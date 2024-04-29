'use client'

import {useUser} from "@auth0/nextjs-auth0/client";

import {getUserImageSource} from "@/lib/utils";
import {useLocalUser} from "@/components/provider/local-user";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function UserButton(){
  const {localUser} = useLocalUser()
  const { user: remoteUser } = useUser();

  if(!remoteUser)return

  return <UserButtonSub user={localUser || remoteUser}/>
}

function UserButtonSub({user}: {user: any}){
  return (
    <Avatar className="w-8 h-8 select-none">
      <AvatarImage
        src={getUserImageSource(user?.image || user?.picture)}
        alt={user?.name ?? ""}
      />
      <AvatarFallback>{user?.name}</AvatarFallback>
    </Avatar>
  )
}