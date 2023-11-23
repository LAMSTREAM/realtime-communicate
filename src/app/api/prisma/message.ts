'use server'

import prisma from "@/lib/prisma";
import {replaceUndefinedNull} from "@/lib/utils";
import {checkSessionValid} from "@/app/api/prisma/session";
import type {Message, RemoteMessage} from "@/hooks/use-session-messages-store";
import {socket} from "@/lib/socket";

export async function createMessage(sub: string, msg: Message){
  let result: RemoteMessage | null = null
  try {
    const validAccess = await checkSessionValid(sub, msg.sessionId)
    if(!validAccess)return result

    const message = await prisma.message.create({
      data: {
        sender: {
          connect: {
            id: msg.sender.id
          }
        },
        session: {
          connect: {
            id: msg.sessionId
          }
        },
        ctime: msg.ctime,
        read: msg.read,
        type: msg.type,
        payload: msg.payload
      },
      select: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        ctime: true,
        read: true,
        type: true,
        payload: true,

        sessionId: true,
        id: true
      }
    })

    if(message)result = replaceUndefinedNull(message)
  } catch (Error) {
    console.log(Error)
  }

  const data = {
    type: 'newMessage',
    messageId: result?.id,
    sessionId: result?.sessionId
  }
  socket.emit('server', data)
  return result
}

export async function getMessages(
  sub: string,
  sessionId: number,
  take: number,
  from?: number, // pick previous messages from ...(id), cause message.id is increase by time
){
  let result: RemoteMessage[] = []
  try {
    const validAccess = await checkSessionValid(sub, sessionId)
    if(!validAccess)return result

    const whereClause = {
      sessionId: sessionId
    };
    // Check if 'from' is a number and add the condition to the where clause
    if (typeof from === 'number') {
      //@ts-ignore
      whereClause.id = { lt: from };
    }
    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: {
        ctime: 'desc'
      },
      take: take,
      select: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        ctime: true,
        read: true,
        type: true,
        payload: true,

        sessionId: true,
        id: true
      }
    })

    if(messages)result = messages.map(message => replaceUndefinedNull(message))
  } catch (Error) {
    console.log(Error)
  }
  return result
}

export async function getMessageById(sub: string, sessionId:number, messageId: number): Promise<RemoteMessage | null>{
  sessionId = Number(sessionId)
  messageId = Number(messageId)
  let result: RemoteMessage | null = null;
  try {
    const validAccess = await checkSessionValid(sub, sessionId)
    if(!validAccess)return result

    const message = await prisma.message.findUnique({
      where: {id: messageId},
      select: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        ctime: true,
        read: true,
        type: true,
        payload: true,
        sessionId: true,
        id: true,
      }
    })
    if(message)result = replaceUndefinedNull(message)
  } catch (Error) {
    console.log(Error)
  }
  return result
}