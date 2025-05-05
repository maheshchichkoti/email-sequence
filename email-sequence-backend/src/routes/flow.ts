import express from "express";
import agenda from "../agenda";
import { authenticateJWT, AuthRequest } from "../middleware/auth";

const router = express.Router();

interface NodeData {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface EdgeData {
  source: string;
  target: string;
}

router.post(
  "/schedule-flow",
  authenticateJWT,
  async (req: AuthRequest, res) => {
    const { nodes, edges } = req.body as {
      nodes: NodeData[];
      edges: EdgeData[];
    };

    if (!nodes || !edges || !Array.isArray(nodes) || !Array.isArray(edges)) {
      return res
        .status(400)
        .json({ error: "Nodes and edges are required and must be arrays" });
    }

    const leadSourceNode = nodes.find((n) => n.type === "leadSource");
    if (!leadSourceNode) {
      return res.status(400).json({ error: "Lead Source node is required" });
    }

    // Extract recipient email from lead source node
    const recipientEmail = leadSourceNode.data.email;
    if (!recipientEmail || typeof recipientEmail !== "string") {
      return res.status(400).json({
        error: "Valid recipient email is required in the Lead Source node",
      });
    }

    // Build adjacency list
    const adjacency: Record<string, string[]> = {};
    for (const edge of edges) {
      if (!adjacency[edge.source]) adjacency[edge.source] = [];
      adjacency[edge.source].push(edge.target);
    }

    // Perform BFS to compute delay times
    const delaysMap: Record<string, number> = {};
    const queue: Array<{ nodeId: string; delay: number }> = [
      { nodeId: leadSourceNode.id, delay: 0 },
    ];

    while (queue.length > 0) {
      const { nodeId, delay } = queue.shift()!;
      delaysMap[nodeId] = delay;

      const children = adjacency[nodeId] || [];
      for (const childId of children) {
        const childNode = nodes.find((n) => n.id === childId);
        if (!childNode) continue;

        let newDelay = delay;
        if (childNode.type === "waitDelay") {
          newDelay += Number(childNode.data.delayMinutes) || 0;
        }

        queue.push({ nodeId: childId, delay: newDelay });
      }
    }

    // Schedule emails from coldEmail nodes
    const coldEmailNodes = nodes.filter((n) => n.type === "coldEmail");

    if (coldEmailNodes.length === 0) {
      return res.status(400).json({
        error: "At least one Cold Email node is required in the flow",
      });
    }

    const scheduledEmails = [];

    try {
      for (const coldEmailNode of coldEmailNodes) {
        const delayMinutes = delaysMap[coldEmailNode.id] || 0;
        const sendAfter = new Date(Date.now() + delayMinutes * 60 * 1000);

        // Use the email from the lead source node
        await agenda.schedule(sendAfter, "send-email", {
          email: recipientEmail,
          subject: coldEmailNode.data.subject,
          emailBody: coldEmailNode.data.body,
          flowNodeId: coldEmailNode.id,
          userId: req.user.id,
        });

        scheduledEmails.push({
          nodeId: coldEmailNode.id,
          scheduledFor: sendAfter,
          recipient: recipientEmail,
        });
      }

      return res.status(200).json({
        message: "Flow scheduled successfully",
        scheduledEmails,
      });
    } catch (error) {
      console.error("Error scheduling flow:", error);
      return res.status(500).json({ error: "Failed to schedule flow" });
    }
  }
);

export default router;
