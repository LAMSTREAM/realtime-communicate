'use client'

import {useRouter} from "next/navigation";

import {cn, getUserImageSource} from "@/lib/utils";
import {type SessionDataType} from "@/app/api/prisma/session";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";

export default function SessionBar({
  className,
  session,
}: {
  className?: string,
  session: SessionDataType
}){
  const router = useRouter()

  let message;
  if(session.message.type === '')message = '';
  else if(session.message.type === 'text')message = session.message.payload;
  else message = session.message.type + ' message';

  return (
    <div
      className={cn(`transition duration-200 bg-background hover:bg-secondary border-t-[1px] p-2 w-full flex items-center hover:cursor-pointer`, className)}
      onClick={()=>{
        router.push(`/session/${session.sessionId}`)
      }}
    >
      <div className={`w-16`}>
        <Avatar className="w-12 h-12 mx-2 select-none">
          <AvatarImage
            src={getUserImageSource(session?.image)}
            alt={session?.name}
          />
          <AvatarFallback>{session?.name}</AvatarFallback>
        </Avatar>
      </div>
      <div className={`pl-3 flex-1 overflow-hidden`}>
        <TypographyH4>{session?.name}</TypographyH4>
        <TypographyP className={`truncate`}>
          {message}
        </TypographyP>
      </div>
    </div>
  )
}