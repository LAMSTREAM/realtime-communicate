'use client'

import {cn, delay, getUserImageSource} from "@/lib/utils";
import {
  type FriendRequestWithReceiverInfo,
  type FriendRequestWithSenderInfo,
  setFriendRequest
} from "@/app/api/prisma/friend";

import {Button} from "@/components/ui/button";
import UserProfile from "@/components/user/UserProfile";
import SheetDialog from "@/components/subpage/sheet-dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";
import {useStateModal} from "@/components/provider/state-modal";

export default function UserBarWithFriendRequest({
  className,
  request,
}: {
  className?: string,
  request: FriendRequestWithSenderInfo|FriendRequestWithReceiverInfo,
}){
  const {setModal} = useStateModal()
  // If the request include sender's info, means you're the receiver
  const requestType = 'sender' in request ? 'receiver' : 'sender';
  const user = 'sender' in request ? request.sender.user : request.receiver.user;

  let button
  if(requestType === 'receiver' && request.status === 'pending'){
    button = (
      <div className={`space-x-1`}>
        <Button
          variant={`destructive`}
          className={`w-20`}
          onClick={async () => {
            setModal({state: 'Loading', desc: ''})
            const result = await setFriendRequest(request.id, "rejected")
            setModal({state: result ? 'Succeed' : 'Failed', desc: ''})
            await delay(200)
            setModal({state: '', desc: ''})
          }}
        >
          Decline
        </Button>
        <Button
          variant={`default`}
          className={'w-20 bg-green-500 hover:bg-green-500/90'}
          onClick={async () => {
            setModal({state: 'Loading', desc: ''})
            const result = await setFriendRequest(request.id, "accepted")
            setModal({state: result ? 'Succeed' : 'Failed', desc: ''})
            await delay(200)
            setModal({state: '', desc: ''})
          }}
        >
          Accept
        </Button>
      </div>
    )
  }else{
    // Capitalize first char
    button = (
      <Button
        variant={`secondary`}
        className={`w-20`}
        disabled
      >
        {`${request.status.charAt(0).toUpperCase()}${request.status.slice(1)}`}
      </Button>
    )
  }

  return (
    <div className={cn(`transition duration-200 bg-background hover:bg-secondary border-2 p-2 rounded-xl flex items-center justify-between hover:cursor-pointer`, className)}>
      <SheetDialog title={`Profile`} customTrigger={()=>(
        <div className={`flex flex-1 items-center`}>
          <Avatar className="w-12 h-12 ml-2 select-none">
            <AvatarImage
              src={getUserImageSource(user?.image)}
              alt={user?.name}
            />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div className={`pl-5`}>
            <TypographyH4>{user?.name}</TypographyH4>
            <TypographyP className={`text-muted-foreground`}>@{user?.uid}</TypographyP>
          </div>
        </div>
      )}>
        <UserProfile id={user?.id} />
      </SheetDialog>
      {button}
    </div>
  )
}
