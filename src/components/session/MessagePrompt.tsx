'use client'

import {useRouter} from "next/navigation";

import {formateTime, getUserImageSource} from "@/lib/utils";
import {RemoteMessage} from "@/hooks/use-session-messages-store";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";

export default function MessagePrompt({
  msg
}: {
  msg: RemoteMessage
}){
  const router = useRouter()

  let message;
  if(msg.type === 'text')message = msg.payload;
  else message = `[${msg.type} message]`;

  return (
    <div
      className={`flex items-center w-full`}
      onClick={()=>router.push(`/session/${msg.sessionId}`)}
    >
      <Avatar className="w-10 h-10 ml-2 select-none">
        <AvatarImage
          src={getUserImageSource(msg.sender.image)}
          alt={msg.sender.name}
        />
        <AvatarFallback>{msg.sender.name}</AvatarFallback>
      </Avatar>
      <div className={`flex pl-5 w-full`}>
        <div className={`flex-grow `}>
          <TypographyH4>{msg.sender.name}</TypographyH4>
          <TypographyP className={`max-h-6 overflow-hidden`}>{message}</TypographyP>
        </div>
        <TypographyP className={`flex flex-shrink-0 justify-center items-center mx-2`}>{formateTime(msg.ctime)}</TypographyP>
      </div>
    </div>
  )
}