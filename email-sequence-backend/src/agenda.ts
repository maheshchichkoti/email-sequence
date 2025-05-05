import Agenda from "agenda";
import dotenv from "dotenv";
import { sendEmail } from "./utils/mailer";
import { Job } from "agenda";
dotenv.config();

const mongoConnectionString = process.env.MONGO_URI || "";

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "agendaJobs" },
  processEvery: "30 seconds",
});

agenda.define("send-email", async (job: Job) => {
  const { email, subject, emailBody } = job.attrs.data as {
    email: string;
    subject: string;
    emailBody: string;
  };

  try {
    await sendEmail(email, subject, emailBody);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
});

// Start agenda if not in test mode
if (process.env.NODE_ENV !== "test") {
  (async function () {
    await agenda.start();
    console.log("Agenda started");
  })();
}

// Add a stop method for clean shutdown
agenda.stop = async function () {
  return new Promise<void>((resolve) => {
    this.once("stop", resolve);
    this.stop();
  });
};

export default agenda;
