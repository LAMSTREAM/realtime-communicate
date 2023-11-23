
import React from "react";
import Link from "next/link";
import Image from "next/image";

import {config} from "@@/project-meta-config";
import {cn} from '@/lib/utils';
import {ModeToggle} from "@/components/theme/theme-switcher";
import {TypographyH4} from "@/components/typography/Typography";
import UserButton from "@/components/user/UserButton";

export default async function Header({ className }: React.HTMLAttributes<HTMLDivElement>){

  return (
    <header className={cn(
      "fixed top-0 z-50 h-[--header-height] w-full px-4 bg-background border-b-2",
      className
    )}>
      <div className={`mx-auto max-w-2xl h-full flex justify-between`}>
        <Link href={`/session`} className={`flex items-center select-none`}>
          <Image
            src={`${config.basePath}/logo.png`} alt={`hello`}
            className={`pr-4`}
            width={76} height={63}
            priority
          />
          <TypographyH4 className={`font-bold text-xl`}>SChat</TypographyH4>
        </Link>
        <div className={`flex items-center space-x-4`}>
          <UserButton/>
          <ModeToggle/>
        </div>
      </div>
    </header>
  )
}