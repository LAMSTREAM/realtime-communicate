'use server'

import prisma from "@/lib/prisma";
import {getCurrentSub} from "@/lib/auth";

export type SessionDataType = {
  sessionId: number;
  name: string;
  image: string;
  message: {
    type: string;
    payload: string;
    ctime: Date;
  }
}

export async function getActiveSessions(sub: string){
  let result: SessionDataType[] = []
  try {
    if(!sub)return result;
    const curSub = await getCurrentSub();
    if(!curSub || curSub !== sub)return result;
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      include: {
        contact: true
      }
    })
    if(!user){
      throw new Error('User not found');
    }

    const sessions = await prisma.session.findMany({
      where: {
        isActive: true,
        contacts: {
          some: {
            id: user.contact?.id
          }
        }
      },
      include: {
        contacts: {
          where: {
            user: {
              sub: {
                not: sub
              }
            }
          },
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        messages: {
          select: {
            type: true,
            payload: true,
            ctime: true
          },
          orderBy: {
            ctime: 'desc'
          },
          take: 1
        }
      }
    })

    if(sessions){
      result = sessions.map(session => {
        return {
          sessionId: session.id,
          name: session.contacts[0].user.name || '',
          image: session.contacts[0].user.image || '',
          message: session.messages[0] || {
            type: '',
            payload: '',
            ctime: new Date(0)
          }
        }
      })
    }

  } catch (error) {
    console.log(error)
  }
  return result
}

export async function getSesssions(sub: string){
  let result: number[] = []
  try {
    if(!sub)return result;
    const curSub = await getCurrentSub()
    if(!curSub || curSub !== sub)return result;
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      include: {
        contact: {
          include: {
            sessions: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    if(user){
      result = user.contact?.sessions.map((obj)=>obj.id) || []
    }
  } catch (Error) {
    console.log(Error)
  }
  return result
}

export async function checkSessionValid(sub: string, sessionId: number){
  sessionId = Number(sessionId)
  let result = false
  try {
    if(!sub)return result
    const curSub = await getCurrentSub()
    if(!curSub || curSub !== sub)return result
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      include: {
        contact: true
      }
    })
    if(!user){
      throw new Error('User not found');
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
        contacts: {
          some: {
            id: user.contact?.id
          }
        }
      }
    })
    if(session)result = true
  } catch (error) {
    console.log(error)
  }
  return result
}

export async function getFriendShipSession(id: number, sub: string){
  id = Number(id)
  let result = -1
  try {
    if(!sub)return result
    const curSub = await getCurrentSub()
    if(!curSub || curSub !== sub)return result
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      include: {contact:true}
    })
    if(!user){
      throw new Error('User not found');
    }

    const friendShip = await prisma.friendShip.findFirst({
      where: {
        contactId: user.contact?.id,
        friend: {
          id: id
        }
      },
      include: {
        session: true
      }
    })
    if(!friendShip){
      throw new Error('Friendship not found');
    }
    result = friendShip.session.id
  } catch (error) {
    console.log(error)
  }
  return result
}