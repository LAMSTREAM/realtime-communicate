import {cn} from '@/lib/utils';
import {Loader2} from 'lucide-react';

export function Loading({children, className}: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={cn(`w-36 h-36 rounded-3xl bg-zinc-200 dark:bg-zinc-600 flex flex-col items-center justify-center`,
      className
    )}>
      <Loader2 className={`h-16 w-16 animate-spin`}/>
      {children}
    </div>
  )
}
