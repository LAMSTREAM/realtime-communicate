import {cn} from '@/lib/utils';
import {AlertTriangle} from 'lucide-react';

export function Warning({children, className}: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={cn(`w-36 h-36 rounded-3xl text-red-600 bg-zinc-200 dark:bg-zinc-600 flex flex-col items-center justify-center`,
      className
    )}>
      <AlertTriangle className={`h-16 w-16 animate-shake`}/>
      {children}
    </div>
  )
}
