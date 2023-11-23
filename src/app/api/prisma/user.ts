'use server'

import prisma from "@/lib/prisma";
import {UserProfile} from "@auth0/nextjs-auth0/client";
import {getCurrentSub} from "@/lib/auth";

export type UserBasis = {
  id: number;
  uid: string;
  sub: string;
  name: string;
  ctime: Date;
  image: string;
}
export async function getUserBasisBySub(sub: string): Promise<UserBasis|null>{
  let result = null;
  try{
    if(!sub)return result;
    const curSub = await getCurrentSub();
    if(sub !== curSub)return result;
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      select: {
        id: true,
        uid: true,
        sub: true,
        name: true,
        ctime: true,
        image: true,
      }
    })
    if(user){
      //ensure return string
      result = {
        id: user.id ?? -1,
        uid:  user.uid ?? '',
        sub: user.sub ?? '',
        name: user.name ?? '',
        ctime: user.ctime ?? new Date(0),
        image: user.image ?? '',
      };
    }
  } catch (error){
    console.log(error)
  }
  return result
}

export async function upsertUser(user: UserProfile) {
  let result = false;
  try {
    if(!user.sub)return result;
    const curSub = await getCurrentSub()
    if(user.sub !== curSub)return result;
    //sync user's image if not set
    const _ = await prisma.user.upsert({
      where: {sub: user.sub},
      update: {},
      create: {
        sub: user.sub,
        name: user.name,
        image: user.picture,
        profile: {
          create: {
            bio: '',
          },
        },
        privacy: {
          create: {
            searchable: true,
            showReadReceipt: true,
          },
        },
        contact: {
          create: {
            mtime: new Date(),
          },
        },
      },
    })
    if(_)result = true;
  } catch (error){
    console.log(error)
  }
  return result;
}

export type UserBarBasic = {
  id: number
  uid: string;
  name: string;
  image: string;
}
export async function searchUserByNameAndUid(targetString: string, start: number, nums: number): Promise<UserBarBasic[]>{
  let result: UserBarBasic[] = [];
  try{
    if(!targetString)return result;
    const curSub = await getCurrentSub();
    if(!curSub)return result
    const users = await prisma.user.findMany({
      where: {
        privacy: {
          searchable: true,
        }
      },
      skip: start,
      take: nums,
      orderBy: {
        _relevance: { //order by relevance, use preview feature fulltext search
          fields: ['uid', 'name'],
          search: targetString,
          sort: 'desc',
        },
      },
      select: {
        id: true,
        uid: true,
        name: true,
        image: true,
      }
    })
    if(users){
      result = users.map((user)=>{
        return {
          id: user.id,
          uid: user.uid ?? '',
          name: user.name ?? '',
          image: user.image ?? '',
        }
      })
    }
  } catch (error){
    console.log(error)
  }
  return result
}

export type UserWithBio = {
  uid: string;
  sub: string;
  name: string;
  ctime: Date;
  image: string;
  bio: string;
}
export async function getUserWithBioById(id: number): Promise<UserWithBio|null>{
  let result = null;
  try{
    if(!id)return null;
    const curSub = getCurrentSub()
    if(!curSub)return null;
    const user = await prisma.user.findUnique({
      where: {id: id},
      select: {
        uid: true,
        sub: true,
        name: true,
        image: true,
        ctime: true,
        profile: {
          select: {
            bio: true,
          }
        }
      }
    })
    if(user){
      result = {
        uid: user.uid ?? '',
        sub: user.sub ?? '',
        name: user.name ?? '',
        image: user.image ?? '',
        ctime: user.ctime ?? new Date(0),
        bio: user?.profile?.bio ?? '',
      }
    }
  } catch (error){
    console.log(error)
  }
  return result
}

export async function checkUserIsFriendBySub(userSub: string, targetSub: string): Promise<boolean>{
  let result = false
  try {
    if(!userSub || !targetSub)return result;
    const curSub = await getCurrentSub()
    if(!curSub)return result;
    const user = await prisma.user.findUnique({
      where: { sub: userSub },
      include: {
        contact: {
          include: {
            friendShips: {
              include: {
                friend: true // Include all friends info
              }
            }
          }
        }
      }
    })
    const friends = user?.contact?.friendShips || []
    result = friends.some((user)=>{
      return user.friend.sub === targetSub
    })
  } catch (error){
    console.log(error)
  }
  return result
}
