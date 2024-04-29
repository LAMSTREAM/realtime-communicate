'use client'

import Link from "next/link";
import {LogIn} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";
import {useRouter} from "next/navigation";

import {getUserBasisBySub, upsertUser} from "@/app/api/prisma/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useLocalUser} from "@/components/provider/local-user";

export default function LoginModal(){
  const router = useRouter()
  const { user: remoteUser, isLoading} = useUser();
  const [isOpen, setIsOpen] = useState(false)
  const {localUser, setLocalUser} = useLocalUser()

  const secureLogIn = useCallback(async () => {
    if (!remoteUser || isLoading) return; // Check isLoading to avoid showing the modal while user data is being fetched
    if (localUser && localUser.uid === "") router.push("/about/edit-profile");
    if (!localUser && remoteUser?.sub){
      await upsertUser(remoteUser); // Upsert user data
      const userBasis = await getUserBasisBySub(remoteUser.sub); // Fetch user basis
      setLocalUser(userBasis); // Set local user
    }
  }, [localUser, setLocalUser, remoteUser, isLoading, router]);

  //Check if logged in
  useEffect(() => {
    secureLogIn();
  }, [secureLogIn]);

  //Show login modal based on login status
  useEffect(() => {
    if (!remoteUser && !isLoading) {
      setIsOpen(true);
    }
  }, [remoteUser, isLoading]);

  // Pop up login alert if user haven't login
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogPortal>
        <AlertDialogOverlay className={`bg-transparent backdrop-blur-sm`}/>
        <AlertDialogContent className={`max-w-md`}>
          <AlertDialogHeader>
            <AlertDialogTitle><b>Welcome to SChat!</b></AlertDialogTitle>
            <AlertDialogDescription>
              To provide you with a personalized and secure experience, we require all users to sign in.
              Please sign in to access the full range of features and exclusive content. Thank you for being a part of our
              community!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link
                href={`/api/auth/login`}
                className={`p-0 flex items-center space-x-4 select-none`}
              >
                <LogIn/>
                <p>Sign In</p>
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}