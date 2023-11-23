'use client'

import {useRouter} from "next/navigation";
import {useCallback, useEffect} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

import {checkSessionValid} from "@/app/api/prisma/session";
import SessionChatBox from "@/components/session/SessionChatBox";

export default function Page({
  params
}: {
  params: {sessionId: number}
}) {
  const {user} = useUser()
  const router = useRouter()

  const checkSession = useCallback(async () => {
    if(!user)return;
    const result = await checkSessionValid(user.sub!, params.sessionId)
    if(!result)router.back()
  }, [user, params.sessionId, router])

  useEffect(() => {
    checkSession()
  }, [checkSession]);

  return (
    <main className={`p-1 h-[calc(100dvh-var(--header-height))]`}>
      <SessionChatBox className={`h-full`} sessionId={params.sessionId}/>
    </main>
  )
}