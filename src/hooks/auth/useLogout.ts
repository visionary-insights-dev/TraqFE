import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api/auth";
import { disconnectSocket } from "@/lib/api/socket";
import { clearAccessToken, clearUser } from "@/stores/auth";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      // Ask the server to invalidate the httpOnly `refresh_token` cookie first
      // (Set-Cookie Max-Age=0 on the mock backend). Local state is cleared
      // even if the call fails so no in-memory session survives.
      try {
        await logout();
      } finally {
        disconnectSocket();
        clearAccessToken();
        clearUser();
      }
    },
    // Full page navigation (not router.replace) so middleware re-runs against
    // the now-cleared cookie. A client-side navigation skips middleware and
    // could leave a still-valid refresh_token "alive" on the next page reload.
    onSettled: () => {
      window.location.assign(
        new URL("/auth/sign-in", window.location.origin).toString()
      );
    },
  });
}