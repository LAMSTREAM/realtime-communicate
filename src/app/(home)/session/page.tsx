
import SessionList from "@/components/session/SessionList";

export default function Page() {

  return (
    <main className={`px-1 h-[calc(100dvh-var(--header-height)-var(--footer-height))]`}>
      <SessionList className={`h-full overflow-y-auto light-scrollbar`}/>
    </main>
  )
}
