'use client'

import SessionList from "@/components/session/SessionList";
import SessionChatBox from "@/components/session/SessionChatBox";
import {useMediaQuery} from "@/hooks/use-media-query";

export default function Page() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <main className={`p-1 h-[calc(100dvh-var(--header-height)-var(--footer-height))]`}>
      <div className={`flex h-full`}>
        <SessionList className={`flex-1 max-h-full overflow-y-auto light-scrollbar`}/>
        {/*{isDesktop && <SessionChatBox className={`flex-[2] max-h-full`}/>}*/}
      </div>
    </main>
  )
}
