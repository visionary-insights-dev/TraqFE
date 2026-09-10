import { success } from "@/lib/api/mock-db";

export async function POST() {
  const response = success(null);
  const res = new Response(response.body, {
    status: 200,
    headers: Object.fromEntries(response.headers),
  });
  res.headers.set(
    "Set-Cookie",
    "refresh_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  return res;
}
