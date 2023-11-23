'use server'

import prisma from "@/lib/prisma";
import {Prisma} from ".prisma/client";
import {getCurrentSub} from "@/lib/auth";

type Profile = {
  name: string;
  uid: string;
  image?: string;
  bio?: string;
}

export async function getProfileDataBySub(sub: string){
  if(!sub)return null;
  const curSub = await getCurrentSub();
  if(sub !== curSub)return null;
  try{
    const user = await prisma.user.findUnique({
      where: {sub: sub},
      select: {
        name: true,
        uid: true,
        image: true,
        profile: {
          select: {
            bio: true,
          }
        }
      }
    })
    if(user){
      return {
        name: user.name ?? '',
        uid: user.uid ?? '',
        image: user.image ?? '',
        bio: user.profile?.bio ?? '',
      }
    }
  }catch (error){
    console.log(error)
  }
  return null;
}

type setResult = {
  status: 'success'|'fail';
  payload: string;
}
export async function setProfileDataBySub(sub: string, user: Profile){
  const result: setResult = {
    status: 'fail',
    payload: '',
  }
  if(!sub)return result;
  const curSub = await getCurrentSub();
  if(sub !== curSub){
    result.payload = 'No Permission'
    return result
  }
  try {
    const upsert = await prisma.user.update({
      where: {sub: sub},
      data: {
        name: user.name,
        uid: user.uid,
        image: user.image,
        profile: {
          upsert: {
            update: {
              bio: user.bio,
              mtime: new Date(),
            },
            create: {
              bio: user.bio,
            }
          }
        }
      }
    })
    result.status = 'success';
  }catch (error){
    if(error instanceof Prisma.PrismaClientKnownRequestError){
      if(error.message.includes('uid')){
        result.payload = 'Uid Conflict!'
      }
    }
    //@ts-ignore
    console.log(error.message)
  }
  return result;
}
