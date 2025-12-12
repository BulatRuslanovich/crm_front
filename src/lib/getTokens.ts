import { cookies } from "next/headers";

export async function getTokens() {
  const store = await cookies();
  const token = store.get("token")?.value;
  const refreshToken = store.get("refreshToken")?.value;

  return {
    token: token || "",
    refreshToken: refreshToken || "",
  };
}
