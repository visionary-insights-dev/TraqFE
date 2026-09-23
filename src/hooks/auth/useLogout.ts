import { useMutation } from "@tanstack/react-query";
import { disconnectSocket } from "@/lib/api/socket";
import { clearAccessToken, clearUser } from "@/stores/auth";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await fetch("/api/traq/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // Best-effort — continue with local cleanup below
      }
      finally {
        disconnectSocket();
        clearAccessToken();
        clearUser();
      }

      // Clear the FE-domain session cookie so the middleware stops treating
      // the user as authenticated on the next request.
      try {
        await fetch("/api/auth/session", { method: "DELETE" });
      } catch {
        // Best effort — the full page navigation below will re-run middleware
        // which will see the missing cookie and bounce to sign-in.
      }

      // Full page navigation (not router.replace) so middleware re-runs against
      // the now-cleared cookie.
      window.location.assign(
        new URL("/auth/sign-in", window.location.origin).toString()
      );
    },

    // Full page navigation (not router.replace) so middleware re-runs against
    // the now-cleared cookie.
    onSettled: () => {
      window.location.assign(
        new URL("/auth/sign-in", window.location.origin).toString()
      );
    },
  });
}