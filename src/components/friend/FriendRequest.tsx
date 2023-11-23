'use client'

import {useCallback, useEffect, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

import {cn, waitTaskMinTime} from "@/lib/utils";
import {useMediaQuery} from "@/hooks/use-media-query";
import {
  getReceivedFriendRequestWithSenderInfo,
  type FriendRequestWithSenderInfo,
  getSentFriendRequestWithReceiverInfo,
  type FriendRequestWithReceiverInfo,
} from "@/app/api/prisma/friend";
import {Skeleton} from "@/components/ui/skeleton";
import {TypographyP} from "@/components/typography/Typography";
import UserBarWithFriendRequest from "@/components/user/UserBarWithFriendRequest";

export default function FriendRequest({
  className,
}: {
  className?: string,
}) {
  const {user: remoteUser} = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [requests, setRequests] = useState<Array<FriendRequestWithSenderInfo | FriendRequestWithReceiverInfo>>([])

  const getFriendRequests = useCallback(async ()=>{
    if(!remoteUser)return;
    setIsLoading(true)
    // Get received and sent friend requests
    const [receivedRequests, sentRequests] =
      //ensure search last 200ms, otherwise will cause flicker
      await waitTaskMinTime(() => {
        return Promise.all([
          getReceivedFriendRequestWithSenderInfo(remoteUser?.sub!),
          getSentFriendRequestWithReceiverInfo(remoteUser?.sub!)])
      }, 200)
    // Sort by ctime
    const requests = [...receivedRequests, ...sentRequests].sort(
      (a, b) => {
        return b.ctime.getTime() - a.ctime.getTime()
      }
    )
    setRequests(requests)
    setIsLoading(false)
  }, [remoteUser])

  useEffect(() => {
    getFriendRequests()
  }, [getFriendRequests]);

  return (
    <div
      className={cn(`p-4 max-h-full ${isDesktop && 'h-[60dvh]'} overflow-y-auto no-scrollbar`, className)}
    >
      <div className={`space-y-1`}>
        {requests && requests.map((request) => (
            <div key={request.id}>
              <UserBarWithFriendRequest
                request={request}
              />
            </div>
          )
        )}
        {!isLoading && requests.length === 0 && (
          <div className={`h-20 flex justify-center items-center`}>
            <TypographyP>{`You don't have any Friend Request yet.`}</TypographyP>
          </div>
        )}
      </div>
      {isLoading && <Skeleton className={`mt-2 mb-4 h-4 w-2/3`}/>}
    </div>
  )
}