import { useMutation } from "@tanstack/react-query";
import { magicLink } from "@/lib/api/auth";

export function useMagicLink() {
  return useMutation({
    mutationFn: (email: string) => magicLink(email),
  });
}