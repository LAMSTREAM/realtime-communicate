'use client'

import React, {useCallback, useEffect, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

import {delay, getUserImageSource} from "@/lib/utils";
import {useMediaQuery} from "@/hooks/use-media-query";
import {sendFriendRequest} from "@/app/api/prisma/friend";
import {checkUserIsFriendBySub, getUserWithBioById, type UserWithBio} from "@/app/api/prisma/user";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";
import {useStateModal} from "@/components/provider/state-modal";
import {getFriendShipSession} from "@/app/api/prisma/session";
import {useRouter} from "next/navigation";

export default function UserProfile({
  id,
}: {
  id: number,
}){
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const {user: remoteUser} = useUser()
  const [user, setUser] = useState<UserWithBio|null>(null)
  const [isFriend, setIsFriend] = useState<boolean>(false)
  // hide action button if browse own profile
  const ownProfile = remoteUser?.sub === user?.sub;
  //RequestState could be Loading/Failed/Success, if set, an indicator will pop up
  const {setModal} = useStateModal()

  const onSendFriendRequest = useCallback(async (remoteUserSub: string, userSub: string) => {
    setModal({state: 'Loading', desc: 'Loading'})
    await delay(200)
    if (userSub && remoteUserSub && await sendFriendRequest(remoteUserSub, userSub)) {
      setModal({state: 'Succeed', desc: 'Succeed'})
    } else {
      setModal({state: 'Failed', desc: 'Failed'})
    }
    await delay(600)
    setModal({state: '', desc: ''})
  }, [setModal]);

  useEffect(()=>{
    fetchUser()
    async function fetchUser(){
      const user = await getUserWithBioById(id)
      if(!user?.sub || !remoteUser?.sub)return;
      const isFriend = await checkUserIsFriendBySub(remoteUser?.sub, user?.sub)
      setUser(user)
      setIsFriend(isFriend)
    }
  }, [id, remoteUser])

  if(!user)return (
    <div className={`h-[60dvh]`}>
      <Skeleton className="px-4 mt-2 mb-4 ml-6 h-4 w-2/3" />
    </div>
  )

  return (
    <div className={`relative h-full`}>
      <div className={`space-y-1 px-8 pb-4 ${ownProfile || 'pb-[4.5rem]'} ${isDesktop ? 'h-[60dvh]' : 'h-full'} overflow-y-auto no-scrollbar`}>
        <Avatar className="w-48 h-48 mx-auto mt-4 select-none">
          <AvatarImage
            src={getUserImageSource(user?.image)}
            alt={user?.name}
          />
          <AvatarFallback>{user?.name}</AvatarFallback>
        </Avatar>
        <div className={`pb-2 border-b-2 flex justify-between`}>
          <div>
            <TypographyH4>{user?.name}</TypographyH4>
            <TypographyP className={`text-muted-foreground`}>@{user?.uid}</TypographyP>
          </div>
          <TypographyP className={`mt-auto text-muted-foreground`}>
            Joined {user?.ctime.toLocaleDateString(
            "en-US",
            {year: 'numeric', month: 'short'}).split(' ').reverse().join(' ')}
          </TypographyP>
        </div>
        <div>
          <TypographyP>{user?.bio}</TypographyP>
        </div>
      </div>

      {ownProfile || (
        <div className={`flex justify-center items-center absolute bottom-0 z-50 h-14 w-full bg-background border-t-2`}>
          {isFriend ? (
            <Button
              variant={`secondary`}
              className={``}
              onClick={()=>{
                getFriendShipSession(id, remoteUser?.sub!).then(sessionId => {
                  if(sessionId !== -1)router.push(`/session/${sessionId}`)
                })
              }}
            >
              Send Message
            </Button>
          ) : (
            <Button
              variant={`secondary`}
              className={``}
              onClick={()=>onSendFriendRequest(remoteUser?.sub!, user?.sub)}
            >
              Send Friend Request
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

