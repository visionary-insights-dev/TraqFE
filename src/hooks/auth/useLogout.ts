import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { disconnectSocket } from "@/lib/api/socket";
import { clearAccessToken, clearUser } from "@/stores/auth";

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),
    // Clear local session and bounce to sign-in even if the server call fails
    // (the token is already dead or the network is down).
    onSettled: () => {
      disconnectSocket();
      clearAccessToken();
      clearUser();
      router.replace("/auth/sign-in");
    },
  });
}