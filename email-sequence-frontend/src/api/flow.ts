import axiosInstance from "./api";

// Define types that match exactly what the backend expects
export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ScheduleFlowResponse {
  message: string;
  scheduledEmails: Array<{
    id: string;
    nodeId: string;
    scheduledFor: string;
    recipient: string;
  }>;
}

export async function scheduleFlow(nodes: FlowNode[], edges: FlowEdge[]) {
  return axiosInstance.post<ScheduleFlowResponse>("/flow/schedule-flow", {
    nodes,
    edges,
  });
}

export async function getScheduledEmails() {
  return axiosInstance.get<any[]>("/flow/scheduled");
}

export async function cancelScheduledEmail(id: string) {
  return axiosInstance.delete(`/flow/scheduled/${id}`);
}
