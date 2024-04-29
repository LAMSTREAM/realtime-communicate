import {cn} from '@/lib/utils';

export function TypographyH1({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h1 className={cn("overflow-anywhere scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
      {children}
    </h1>
  )
}

export function TypographyH2({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h2 className={cn("overflow-anywhere scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}>
      {children}
    </h2>
  )
}

export function TypographyH3({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h3 className={cn("overflow-anywhere scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  )
}

export function TypographyH4({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h4 className={cn("overflow-anywhere scroll-m-20 text-xl font-semibold tracking-tight", className)}>
      {children}
    </h4>
  )
}

export function TypographyP({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <p className={cn("overflow-anywhere scroll-m-20 font-semibold tracking-tight", className)}>
      {children}
    </p>
  )
}

export function TypographyLeadP({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <p className={cn("overflow-anywhere leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  )
}

export function TypographyBlockquote({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <blockquote className={cn("overflow-anywhere mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  )
}

export function TypographyInlineCode({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <code
      className={cn("overflow-anywhere relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}>
      {children}
    </code>
  )
}

export function TypographyLead({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <p className={cn("overflow-anywhere text-xl text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export function TypographyLarge({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (<div className={cn("overflow-anywhere text-lg font-semibold", className)}>
    {children}
  </div>)
}

export function TypographySmall({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <small className={cn("overflow-anywhere text-sm font-medium", className)}>{children}</small>
  )
}

export function TypographyMuted({children, className}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <p className={cn("overflow-anywhere text-sm text-muted-foreground", className)}>{children}</p>
  )
}
