import {cn} from '@/lib/utils';
import {Check} from 'lucide-react';

export function Success({children, className}: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={cn(`w-36 h-36 rounded-3xl text-green-600 bg-zinc-200 dark:bg-zinc-600 flex flex-col items-center justify-center`,
      className
    )}>
      <Check className={`h-16 w-16`}/>
      {children}
    </div>
  )
}