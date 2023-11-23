'use client'

import {useUser} from "@auth0/nextjs-auth0/client";
import {useCallback, useEffect, useState} from "react";

import {cn, waitTaskMinTime} from "@/lib/utils";
import {type FriendsSubAndName, getFriendList} from "@/app/api/prisma/friend";
import UserBar from "@/components/user/UserBar";
import {Skeleton} from "@/components/ui/skeleton";
import {TypographyP} from "@/components/typography/Typography";

export default function FriendList({
  className,
}: {
  className?: string,
}) {
  const {user: remoteUser} = useUser()
  const [isLoading ,setIsLoading] = useState(true)
  const [friends, setFriends] = useState<Array<FriendsSubAndName>>([])

  const getFriends = useCallback(async () => {
    if(!remoteUser)return;
    setIsLoading(true)
    const friends = await waitTaskMinTime(()=> {
      return getFriendList(remoteUser?.sub!)
    }, 200)
    // Sort by name
    friends.sort((a, b)=>a.name.localeCompare(b.name))
    setFriends(friends)
    setIsLoading(false)
  }, [remoteUser])

  useEffect(() => {
    getFriends()
  }, [getFriends]);

  return (
    <div className={cn(`p-0 w-full`, className)}>
      <div className={`space-y-1`}>
        {friends && friends.map((friend) => (
            <div key={friend.uid}>
              <UserBar user={friend}/>
            </div>
          )
        )}
        {!isLoading && friends.length === 0 && (
          <div className={`h-20 flex justify-center items-center`}>
            <TypographyP>{`You don’t have any friend yet, try to make new friends. :)`}</TypographyP>
          </div>
        )}
      </div>
      {isLoading && <Skeleton className={`mt-2 mb-4 h-4 w-2/3`}/>}
    </div>
  )
}