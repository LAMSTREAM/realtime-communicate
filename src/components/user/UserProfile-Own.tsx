'use client'

import {cn, getUserImageSource} from "@/lib/utils";
import {TypographyH2, TypographyH4} from "@/components/typography/Typography";
import {Skeleton} from "@/components/ui/skeleton";
import {useLocalUser} from "@/components/provider/local-user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function UserProfileOwn({
  className
}: {
  className?: string
}){
  const {localUser} = useLocalUser()
  if(!localUser){
    return (
      <div className={cn(`flex w-full`, className)}>
        <Skeleton className="w-36 h-36 m-2 select-none rounded-full"/>
        <div className={`flex flex-col ml-4 mt-2`}>
          <Skeleton className={`h-8 w-44 rounded-xl`}/>
          <Skeleton className={`mt-2 h-4 w-36 rounded-xl`}/>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(`flex w-full`, className)}>
      <Avatar className="w-36 h-36 m-2 select-none">
        <AvatarImage
          src={getUserImageSource(localUser.image)}
          alt={localUser.name}
        />
        <AvatarFallback>{localUser.name}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ml-4 mt-2`}>
        <TypographyH2>{localUser.name}</TypographyH2>
        <TypographyH4 className={`text-muted-foreground`}>@{localUser.uid}</TypographyH4>
      </div>
    </div>
  )
}