'use client'

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Contact2, Layers3, MessageSquare} from "lucide-react";
import {TypographyP} from "@/components/typography/Typography";
import {cn} from "@/lib/utils";

const links = [
  {href: '/session', name: 'Messages', icon: MessageSquare},
  {href: '/contacts', name: 'Contacts', icon: Contact2},
  {href: '/about', name: 'About', icon: Layers3},
]

export default function Footer({ className }: React.HTMLAttributes<HTMLDivElement>){
  const path = usePathname()

  return (
    <footer className={cn(
      `fixed bottom-0 z-50 h-[--footer-height] w-full p-4 rounded-t-3xl backdrop-blur-lg border-t-2`,
      className
    )}>
      <div className={`mx-auto max-w-2xl flex justify-around`}>
        {links.map((link, i)=>{
          return (
            <Link href={link.href} key={i} className={`w-24 duration-500 flex flex-col ${(path.startsWith(link.href)) && 'text-purple-500 -mt-3'}`}>
              <link.icon className={`mx-auto`}/>
              <TypographyP className={`mx-auto select-none`}>{link.name}</TypographyP>
            </Link>
          )
        })}
      </div>
    </footer>
  )
}