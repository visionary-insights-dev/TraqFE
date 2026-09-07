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
  mentorScholars: ["mentor", "scholars"] as const,
  mentorScholar: (id: string) => ["mentor", "scholars", id] as const,
  mentorAssignments: ["mentor", "assignments"] as const,
  verificationQueue: ["mentor", "verification"] as const,
  meetings: ["mentor", "meetings"] as const,
  mentorCourses: ["mentor", "courses"] as const,
  mentorProfile: ["mentor", "profile"] as const,
};
