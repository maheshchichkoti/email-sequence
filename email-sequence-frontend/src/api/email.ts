import axiosInstance from "./api";

export interface ScheduleEmailPayload {
  email: string;
  subject: string;
  body: string;
  sendAfter: string; // ISO string
}

export interface ScheduleEmailResponse {
  message: string;
  jobId: string;
  scheduledFor: string;
}

export async function scheduleEmail(payload: ScheduleEmailPayload) {
  return axiosInstance.post<ScheduleEmailResponse>(
    "/email/schedule-email",
    payload
  );
}

export async function sendTestEmail(email: string) {
  return axiosInstance.post<{ message: string }>("/email/test", { email });
}
