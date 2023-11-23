'use client'

import React, {createContext, useContext, useState} from "react";
import {UserBasis} from "@/app/api/prisma/user";
import LoginModal from "@/components/auth/LoginModal";

type LocalUserType = {
  localUser: UserBasis | null;
  setLocalUser: any | null;
}

const LocalUserContext = createContext<LocalUserType>({
  localUser: null,
  setLocalUser: null
})

export const useLocalUser = () => {
  return useContext(LocalUserContext)
}

export const LocalUserProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [localUser, setLocalUser] = useState<UserBasis|null>(null)

  return (
    <LocalUserContext.Provider value={{localUser, setLocalUser}}>
      {children}
      <LoginModal/>
    </LocalUserContext.Provider>
  )
}