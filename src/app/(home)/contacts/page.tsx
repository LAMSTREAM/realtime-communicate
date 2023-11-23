'use client'

import {useEffect} from "react";
import {Search, UserRoundPlus} from "lucide-react";

import {updateExpiredFriendRequest} from "@/app/api/prisma/friend";
import {Button} from "@/components/ui/button";
import UserSearch from "@/components/user/UserSearch";
import SheetDialog from "@/components/subpage/sheet-dialog";
import FriendRequest from "@/components/friend/FriendRequest";
import FriendList from "@/components/friend/FriendList";

export default function Page(){

  useEffect(()=>{
    async function init(){
      await updateExpiredFriendRequest()
    }

    init()
  }, [])

  return (
    <main className={`p-6 mx-auto max-w-2xl space-y-1 flex flex-col items-center justify-center`}>
      <SheetDialog
        title={`Search User`}
        customTrigger={()=>(
          <Button
            variant={`outline`}
            className={`p-0 w-full h-14 text-md flex justify-start`}
          >
            <Search className={`m-4`}/>
            <p>Search User</p>
          </Button>
        )}
      >
        <UserSearch/>
      </SheetDialog>
      <SheetDialog
        title={`Friend Requests`}
        customTrigger={()=>(
          <Button
            variant={`outline`}
            className={`p-0 w-full h-14 text-md flex justify-start`}
          >
            <UserRoundPlus className={`m-4`}/>
            <p>Friend Requests</p>
          </Button>
        )}
      >
        <FriendRequest />
      </SheetDialog>
      <FriendList className={`pt-6`}/>
    </main>
  )
}