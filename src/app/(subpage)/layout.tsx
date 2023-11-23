'use client'

import React from "react";
import {ChevronLeft} from "lucide-react";
import {useRouter} from "next/navigation";

export default function SubpageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className={`flex flex-col`}>
      <header className={"fixed top-0 z-50 h-[--header-height] w-full px-4 bg-background border-b-2"}>
        <div className={`mx-auto max-w-2xl h-full flex justify-between`}>
          <ChevronLeft
            className={`my-auto hover:cursor-pointer`}
            onClick={()=>router.back()}
          />
        </div>
      </header>
      <div className={`pt-[--header-height] mx-auto max-w-2xl w-full`}>
        {children}
      </div>
    </div>
  )
}