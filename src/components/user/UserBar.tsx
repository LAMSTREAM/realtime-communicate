'use client'

import {type UserBarBasic} from "@/app/api/prisma/user";
import {cn, getUserImageSource} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";
import SheetDialog from "@/components/subpage/sheet-dialog";
import UserProfile from "@/components/user/UserProfile";

export default function UserBar({
  className,
  user,
}: {
  className?: string,
  user: UserBarBasic,
}){

  return (
    <SheetDialog title={`Profile`} customTrigger={()=>(
      <div className={cn(`transition duration-200 bg-background hover:bg-secondary border-2 p-2 rounded-xl flex items-center hover:cursor-pointer`, className)}>
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
  )
}