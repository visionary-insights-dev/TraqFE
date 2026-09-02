export const queryKeys = {
  dashboardAnalytics: ["dashboard", "analytics"] as const,
  assignments: ["assignments"] as const,
  courses: ["courses"] as const,
  resources: ["resources"] as const,
  cohort: ["cohort"] as const,
  conversations: ["chats", "conversations"] as const,
  messages: (conversationId: string) =>
    ["chats", "messages", conversationId] as const,
  profile: ["profile"] as const,
};
