'use client'

import Link from "next/link";
import {Bolt, LogOut} from "lucide-react";

import {Button} from "@/components/ui/button";
import ProfileForm from "@/components/form/ProfileForm";
import DrawerDialog from "@/components/subpage/drawer-dialog";
import UserProfileOwn from "@/components/user/UserProfile-Own";

export default function Page(){

  return (
    <main className={`p-6 flex flex-col justify-between min-h-[calc(100dvh-var(--header-height)-var(--footer-height))]`}>
      <UserProfileOwn />
      <div className={`w-full space-y-1`}>
        <DrawerDialog
          title={`Edit Profile`}
          customTrigger={()=>(
            <Button
              variant={`outline`}
              className={`p-0 w-full h-14 text-md flex justify-start`}
            >
              <Bolt className={`m-4`}/>
              <p>Edit Profile</p>
            </Button>
          )}
        >
          <ProfileForm />
        </DrawerDialog>
        <Button
          variant={`outline`}
          asChild
          className={`p-0 w-full h-14 text-md flex justify-start`}
        >
          <Link href={`/api/auth/logout`}>
            <LogOut className={`m-4`}/>
            <p>Sign Out</p>
          </Link>
        </Button>
      </div>
    </main>
  )
}