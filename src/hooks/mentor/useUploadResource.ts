import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createResource,
  getResourceUploadUrl,
  uploadResourceFile,
} from "@/lib/api/mentor";
import type { Resource, ResourceType } from "@/lib/types";
import { queryKeys } from "../keys";

export type ResourceUploadVars =
  | {
      name: string;
      type: ResourceType;
      courseId?: string;
      url: string;
      visibility?: "PUBLIC" | "PRIVATE";
    }
  | {
      name: string;
      type: ResourceType;
      courseId?: string;
      file: File;
      visibility?: "PUBLIC" | "PRIVATE";
    };

export function useUploadResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: ResourceUploadVars) => {
      if ("url" in vars) {
        return createResource({
          name: vars.name,
          type: vars.type,
          courseId: vars.courseId,
          url: vars.url,
          visibility: vars.visibility,
        });
      }
      const { uploadUrl, fileKey } = await getResourceUploadUrl(
        vars.file.name,
        vars.file.type
      );
      await uploadResourceFile(uploadUrl, vars.file);
      return createResource({
        name: vars.name,
        type: vars.type,
        courseId: vars.courseId,
        fileKey,
        visibility: vars.visibility,
      });
    },
    onSuccess: (created: Resource) => {
      queryClient.setQueryData<Resource[]>(queryKeys.mentorResources, (old) =>
        old ? [...old, created] : [created]
      );
    },
  });
}