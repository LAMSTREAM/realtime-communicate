'use client'

import {Bolt} from "lucide-react";

import DrawerDialog from "@/components/subpage/drawer-dialog";
import ProfileForm from "@/components/form/ProfileForm";
import {Button} from "@/components/ui/button";

export default function Page(){

  return (
    <main className={`p-6 flex flex-col items-center justify-center`}>
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
    </main>
  )
}