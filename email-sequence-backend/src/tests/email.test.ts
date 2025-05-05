// tests/email.test.ts
import request from "supertest";
import mongoose from "mongoose";
import app from "../index";
import User from "../models/User";
import agenda from "../agenda";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

describe("Email API", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.TEST_MONGO_URI ||
        "mongodb://localhost:27017/test-email-sequence"
    );

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
    });
    userId = user._id.toString();

    // Generate token
    token = jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await agenda.purge();

    // Stop agenda and close MongoDB connection
    await agenda.stop();
    await mongoose.connection.close();

    // Add a small delay to ensure connections are fully closed
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe("POST /api/email/schedule-email", () => {
    it("should schedule an email successfully", async () => {
      const sendAfter = new Date(Date.now() + 3600000); // 1 hour from now

      const response = await request(app)
        .post("/api/email/schedule-email")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "recipient@example.com",
          subject: "Test Subject",
          body: "<p>Test body</p>",
          sendAfter: sendAfter.toISOString(),
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Email scheduled successfully");
      expect(response.body.jobId).toBeDefined();
      expect(response.body.scheduledFor).toBeDefined();

      // Check if job was actually scheduled
      const jobs = await agenda.jobs({
        "data.userId": userId,
        "data.subject": "Test Subject",
      });

      expect(jobs.length).toBe(1);
    });

    it("should reject invalid email data", async () => {
      const response = await request(app)
        .post("/api/email/schedule-email")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "invalid-email",
          subject: "",
          body: "<p>Test body</p>",
          sendAfter: "invalid-date",
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
