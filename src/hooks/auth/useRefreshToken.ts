import { useMutation } from "@tanstack/react-query";
import { refreshAccessToken } from "@/lib/api";

export function useRefreshToken() {
  return useMutation({
    mutationFn: () => refreshAccessToken(),
  });
}