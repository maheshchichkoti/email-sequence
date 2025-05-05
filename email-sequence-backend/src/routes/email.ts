import express from "express";
import { body, validationResult } from "express-validator";
import agenda from "../agenda";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { Response } from "express";
const router = express.Router();

/**
 * @route POST /api/email/schedule-email
 * @desc Schedule a single email to be sent after a specified time
 * @access Private
 */
router.post(
  "/schedule-email",
  authenticateJWT,
  [
    body("email").isEmail().withMessage("Valid email address is required"),
    body("subject").isString().notEmpty().withMessage("Subject is required"),
    body("body").isString().notEmpty().withMessage("Email body is required"),
    body("sendAfter")
      .isISO8601()
      .withMessage("Valid ISO date is required for sendAfter"),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, subject, body: emailBody, sendAfter } = req.body;

    try {
      const sendTime = new Date(sendAfter);

      // Validate that sendAfter is in the future
      if (sendTime <= new Date()) {
        return res.status(400).json({
          error: "Send time must be in the future",
        });
      }

      const job = await agenda.schedule(sendTime, "send-email", {
        email,
        subject,
        emailBody,
        userId: req.user.id,
      });

      res.status(200).json({
        message: "Email scheduled successfully",
        jobId: job.attrs._id,
        scheduledFor: sendTime,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to schedule email",
        details:
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : undefined,
      });
    }
  }
);

/**
 * @route GET /api/email/test
 * @desc Test email configuration by sending a test email
 * @access Private
 */
router.post(
  "/test",
  authenticateJWT,
  [body("email").isEmail().withMessage("Valid email address is required")],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      await agenda.now("send-email", {
        email,
        subject: "Test Email",
        emailBody:
          "<p>This is a test email from your email sequence application.</p>",
        userId: req.user.id,
      });

      res.status(200).json({
        message: "Test email sent successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to send test email",
        details:
          process.env.NODE_ENV === "development" && err instanceof Error
            ? err.message
            : undefined,
      });
    }
  }
);

export default router;
