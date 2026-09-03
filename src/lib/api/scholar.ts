import { get, post, patch } from "./client";
import {
  type Assignment,
  type ChatMessage,
  type Cohort,
  type Conversation,
  type Course,
  type DashboardAnalytics,
  type ProfileUpdateInput,
  type Resource,
  type ScholarProfile,
} from "@/lib/types";

export function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  return get<DashboardAnalytics>("/analytics/dashboard");
}

export function getMyAssignments(): Promise<Assignment[]> {
  return get<Assignment[]>("/scholars/me/assignments");
}

export function submitAssignment(
  assignmentId: string
): Promise<{ submissionId: string; status: Assignment["status"] }> {
  return post(`/assignments/${assignmentId}/submissions`);
}

export function getMyCourses(): Promise<Course[]> {
  return get<Course[]>("/scholars/me/courses");
}

export function getResources(): Promise<Resource[]> {
  return get<Resource[]>("/resources");
}

export function getCohort(): Promise<Cohort> {
  return get<Cohort>("/scholars/me/cohort");
}

export function getConversations(): Promise<Conversation[]> {
  return get<Conversation[]>("/chats/conversations");
}

export function getMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  return get<ChatMessage[]>(`/chats/conversations/${conversationId}/messages`);
}

export function sendMessage(
  conversationId: string,
  text: string
): Promise<ChatMessage> {
  return post<ChatMessage>(`/chats/conversations/${conversationId}/messages`, {
    text,
  });
}

export function getMyProfile(): Promise<ScholarProfile> {
  return get<ScholarProfile>("/users/me/profile");
}

export function updateProfile(
  input: ProfileUpdateInput
): Promise<ScholarProfile> {
  return patch<ScholarProfile>("/users/me/profile", input);
}
