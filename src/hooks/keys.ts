export const queryKeys = {
  scholarDashboard: ["scholar", "dashboard"] as const,
  scholarAssignments: (filters?: Record<string, unknown>) =>
    filters ? (["scholar", "assignments", filters] as const) : (["scholar", "assignments"] as const),
  scholarCourses: ["scholar", "courses"] as const,
  scholarResources: (filters?: Record<string, unknown>) =>
    filters ? (["scholar", "resources", filters] as const) : (["scholar", "resources"] as const),
  scholarCohort: ["scholar", "cohort"] as const,
  userProfile: ["user", "profile"] as const,
  conversations: ["chats", "conversations"] as const,
  messages: (conversationId: string) =>
    ["chats", "messages", conversationId] as const,
  mentorScholars: ["mentor", "scholars"] as const,
  mentorScholar: (id: string) => ["mentor", "scholars", id] as const,
  mentorAssignments: ["mentor", "assignments"] as const,
  verificationQueue: ["mentor", "verification"] as const,
  mentorMeetings: ["mentor", "meetings"] as const,
  mentorCourses: ["mentor", "courses"] as const,
  mentorProfile: ["mentor", "profile"] as const,
  mentorResources: ["mentor", "resources"] as const,
};