'use client'

import {cn, getUserImageSource} from "@/lib/utils";
import {TypographyP} from "@/components/typography/Typography";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import UserProfile from "@/components/user/UserProfile";
import SheetDialog from "@/components/subpage/sheet-dialog";
import type {Message, RemoteMessage, LocalMessage} from "@/hooks/use-session-messages-store";
import {Loader2} from "lucide-react";
import {useLocalUser} from "@/components/provider/local-user";

export default function MessageBar({
  className,
  message,
  hide,
}: {
  className?: string,
  message: Message,
  hide: boolean,
}){
  const {localUser} = useLocalUser()
  const sender = message.sender
  const ownMessage = localUser?.id === sender.id

  return (
    <div className={cn(`mt-1 flex ${ownMessage ? 'flex-row' : `flex-row-reverse`} justify-end`, className)}>
      {(message as LocalMessage).isLocal && <Loader2 className={`my-auto mr-1 h-4 w-4 text-zinc-500 animate-spin`}/>}
      <TypographyP className={`py-1 px-3 min-w-[2rem] max-w-[66.67%] ${ownMessage 
        ? 'text-white bg-blue-500' 
        : 'text-black bg-zinc-200 dark:text-white dark:bg-zinc-700'} rounded-xl`}>
        {message.payload}
      </TypographyP>
      {hide
        ? (<div className="w-8 h-8 mx-1 self-end select-none"/>)
        : (<SheetDialog title={`Profile`} customTrigger={() => (
          <Avatar className="w-8 h-8 mx-1 self-end select-none hover:cursor-pointer">
            <AvatarImage
              src={getUserImageSource(sender?.image)}
              alt={sender?.name}
            />
            <AvatarFallback>{sender?.name}</AvatarFallback>
          </Avatar>
        )}>
          <UserProfile id={sender?.id!}/>
        </SheetDialog>)
      }
    </div>
  )
}