'use client'

import {useUser} from "@auth0/nextjs-auth0/client";
import {useCallback, useEffect, useState} from "react";
import {getActiveSessions, SessionDataType} from "@/app/api/prisma/session";
import {cn, waitTaskMinTime} from "@/lib/utils";
import SessionBar from "@/components/session/SessionBar";

export default function SessionList({
  className
}: {
  className?: string
}){
  const {user: remoteUser} = useUser()
  const [sessions, setSessions] = useState<SessionDataType[]>([])

  const getSessions = useCallback(async () => {
    if(!remoteUser)return;
    const sessions = await waitTaskMinTime(()=>{
      return getActiveSessions(remoteUser?.sub!)
    }, 200)
    sessions.sort((a,b)=>{
      return b.message.ctime.getTime() - a.message.ctime.getTime()
    })
    setSessions(sessions)
  },[remoteUser])

  useEffect(() => {
    getSessions()
  }, [getSessions]);

  return (
    <div className={cn('', className)}>
      {sessions.map(session => {
        return <SessionBar key={session.sessionId} session={session}/>
      })}
    </div>
  )
}