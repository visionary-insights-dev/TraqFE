import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveCourse,
  createCourse,
  getAdminCourses,
  unarchiveCourse,
  updateCourse,
} from "@/lib/api/admin";
import type { CourseInput } from "@/lib/types";
import { queryKeys } from "./keys";

export function useAdminCourses() {
  return useQuery({
    queryKey: queryKeys.adminCourses,
    queryFn: getAdminCourses,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CourseInput) => createCourse(input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCourses });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, input }: { courseId: string; input: CourseInput }) =>
      updateCourse(courseId, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCourses });
    },
  });
}

export function useArchiveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => archiveCourse(courseId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCourses });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}

export function useUnarchiveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => unarchiveCourse(courseId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCourses });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDashboard });
    },
  });
}