'use server'

import prisma from "@/lib/prisma"
import {getCurrentSub} from "@/lib/auth";
import {replaceUndefinedNull} from "@/lib/utils";
import {UserBarBasic} from "@/app/api/prisma/user";

export async function sendFriendRequest(userSub: string, targetSub: string): Promise<boolean> {
  let result = false
  try {
    if (!userSub || !targetSub) return result;
    const curSub = await getCurrentSub()
    if (!curSub || curSub !== userSub) return result;
    const senderUser = await prisma.user.findUnique({
      where: {sub: userSub},
      include: {contact: true}
    })
    const receiverUser = await prisma.user.findUnique({
      where: {sub: targetSub},
      include: {contact: true}
    })

    if (senderUser && receiverUser && senderUser.contact && receiverUser.contact) {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          AND: [
            {senderId: senderUser.contact.id},
            {receiverId: receiverUser.contact.id},
            {ctime: {gt: twoWeeksAgo}},
            {status: 'pending'}
          ],
        },
        orderBy: {ctime: 'desc'}
      });
      if (existingRequest) {
        await prisma.friendRequest.update({
          where: {id: existingRequest.id},
          data: {
            ctime: new Date(),
            status: 'pending'
          }
        });
      } else {
        await prisma.friendRequest.create({
          data: {
            sender: {connect: {id: senderUser.contact.id}},
            receiver: {connect: {id: receiverUser.contact.id}},
            status: 'pending'
          }
        });
      }
      result = true;
    }
  } catch (error) {
    console.log(error)
  }
  return result;
}

export async function updateExpiredFriendRequest(){
  let result = false
  try {
    const curSub = await getCurrentSub();
    if(!curSub)return result;
    const sub = curSub
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const expiredRequests = await prisma.friendRequest.findMany({
      where: {
        AND: [
          {status: 'pending'}, // Assuming the status for pending requests
          {ctime: {lt: twoWeeksAgo}}
        ],
        OR: [
          {
            receiver: {
              user: {
                sub: sub
              }
            }
          },
          {
            sender: {
              user: {
                sub: sub
              }
            }
          }
        ]
      }
    });

    for (const request of expiredRequests) {
      await prisma.friendRequest.update({
        where: { id: request.id },
        data: { status: 'expired' }
      });
    }
    result = true
  } catch (error){
    console.log(error)
  }
  return result
}

export type FriendRequestWithSenderInfo = {
  id: number;
  senderId: number;
  receiverId: number;
  ctime: Date;
  status: string;
  sender: {
    id: number;
    userId: number;
    mtime: Date;
    user: {
      id: number;
      uid: string;
      sub: string;
      name: string;
      ctime: Date;
      image: string;
    };
  };
};
export async function getReceivedFriendRequestWithSenderInfo(sub: string){
  let result: FriendRequestWithSenderInfo[] = []
  try {
    if(!sub)return result;
    const curSub = await getCurrentSub()
    if(!curSub || curSub !== sub)return result;
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiver: {
          user: {
            sub: sub
          }
        }
      },
      include: {
        sender: {
          include: {
            user: true // This includes all fields of the User model
          }
        }
      }
    });
    if (requests){
      result = requests.map(request=>{
        return replaceUndefinedNull(request)
      })
    }
  } catch (error) {
    console.log(error)
  }
  return result
}

export type FriendRequestWithReceiverInfo = {
  id: number;
  senderId: number;
  receiverId: number;
  ctime: Date;
  status: string;
  receiver: {
    id: number;
    userId: number;
    mtime: Date;
    user: {
      id: number;
      uid: string;
      sub: string;
      name: string;
      ctime: Date;
      image: string;
    };
  };
};
export async function getSentFriendRequestWithReceiverInfo(sub: string){
  let result: FriendRequestWithReceiverInfo[] = []
  try {
    if(!sub)return result;
    const curSub = await getCurrentSub()
    if(!curSub || curSub !== sub)return result;
    const requests = await prisma.friendRequest.findMany({
      where: {
        sender: {
          user: {
            sub: sub
          }
        }
      },
      include: {
        receiver: {
          include: {
            user: true
          }
        }
      }
    });
    if(requests){
      result = requests.map(request=>{
        return replaceUndefinedNull(request)
      })
    }
  } catch (error) {
    console.log(error)
  }
  return result
}

export async function setFriendRequest(friendRequestId: number, action: 'accepted'|'rejected'){
  let result = false
  try {
    const curSub = await getCurrentSub();
    if(!curSub)return result;

    const preRequest = await prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId
      }
    })
    // Check if friend request exists
    if (!preRequest) {
      throw new Error('Friend request not found');
    }
    // Ensure no to manipulate friend request again
    if(preRequest.status !== 'pending'){
      throw new Error('Manipulating invalid friend request')
    }
    const request = await prisma.friendRequest.update({
      where: {
        id: friendRequestId
      },
      data: {
        status: action
      }
    })

    if(action === 'accepted'){
      await createFriendShip(friendRequestId)
    }

    result = true
  } catch (error) {
    console.log(error)
  }
  return result
}

export async function createFriendShip(friendRequestId: number){
  let result = false
  try {
    const curSub = await getCurrentSub();
    if(!curSub)return result;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        id: friendRequestId
      },
      include: {
        sender: true,
        receiver: true,
      },
    })
    // Check if friend request exists
    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        contacts: {
          connect: [{ id: friendRequest.senderId }, { id: friendRequest.receiverId }],
        },
      },
    });
    // Check if session create success
    if (!session) {
      throw new Error('Session create fail');
    }

    // Create friendship records
    const [senderFriendship, receiverFriendship,] = await Promise.all([
      prisma.friendShip.create({
        data: {
          contact: {
            connect: { id: friendRequest.senderId },
          },
          friend: {
            connect: { id: friendRequest.receiverId },
          },
          session: {
            connect: { id: session.id },
          },
        },
      }),
      prisma.friendShip.create({
        data: {
          contact: {
            connect: { id: friendRequest.receiverId },
          },
          friend: {
            connect: { id: friendRequest.senderId },
          },
          session: {
            connect: { id: session.id },
          },
        },
      })
    ])

    if(!senderFriendship || !receiverFriendship){
      throw new Error('Friendship create fail');
    }

    result = true
  } catch (error){
    console.log(error)
  }
  return result
}

export type FriendsSubAndName = UserBarBasic
export async function getFriendList(sub: string){
  let result: FriendsSubAndName[] = []
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
      throw new Error('User not founded')
    }

    const friendships = await prisma.friendShip.findMany({
      where: {
        contactId: user.contact?.id
      },
      include: {
        friend: {
          select: {
            id: true,
            uid: true,
            name: true,
            image: true
          }
        }
      }
    })

    if(friendships){
      result = friendships.map(friendship => {
        return {
          id: friendship.friend.id,
          uid: friendship.friend.uid || '',
          name: friendship.friend.name || '',
          image: friendship.friend.image || '',
        }
      })
    }

  } catch (error) {
    console.log(error)
  }
  return result
}
