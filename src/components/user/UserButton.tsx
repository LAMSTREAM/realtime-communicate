'use client'

import Link from "next/link";
import {LogOut} from "lucide-react";
import {useUser} from "@auth0/nextjs-auth0/client";

import {getUserImageSource} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {TypographyH4, TypographyP} from "@/components/typography/Typography";
import {useLocalUser} from "@/components/provider/local-user";

export default function UserButton(){
  const {localUser} = useLocalUser()
  const { user: remoteUser } = useUser();

  if(!remoteUser)return

  return <UserButtonSub user={localUser || remoteUser}/>
}

function UserButtonSub({user}: {user: any}){
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8 select-none">
            <AvatarImage
              src={getUserImageSource(user?.image || user?.picture)}
              alt={user?.name ?? ""}
            />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-52`} align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <TypographyH4>{user?.name}</TypographyH4>
            <TypographyP className={`text-muted-foreground`}>@{user?.uid}</TypographyP>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>
            <Link
              href={`/api/auth/logout`}
              className={`w-full flex justify-center items-center mx-auto space-x-2 select-none`}
            >
              <LogOut/>
              <p>Log Out</p>
            </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}