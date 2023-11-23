// Need edge runtime, don't know why
import {getSession} from "@auth0/nextjs-auth0/edge";

export async function getCurrentSub(): Promise<string>{
  const session = await getSession()
  return session?.user.sub
}