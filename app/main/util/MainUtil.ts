import { headers } from "next/headers";

export async function getEnvironmentName(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (host && (host.includes("localhost") || host.includes("127.0.0.1"))) {
    return "local";
  }

  if (process.env.NODE_ENV === "development") {
    return "local";
  }

  return "production";
}
