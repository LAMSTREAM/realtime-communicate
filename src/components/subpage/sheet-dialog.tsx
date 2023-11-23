'use client'

import React, {useState} from "react";
import {ChevronLeft} from "lucide-react";

import {useMediaQuery} from "@/hooks/use-media-query";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent, SheetOverlay, SheetPortal,
  SheetTrigger,
} from "@/components/ui/sheet"
import {cn} from "@/lib/utils";
import {TypographyH4} from "@/components/typography/Typography";

//In this component, use special way deliver open and setOpen props to let child component can control if close the dialog
export default function SheetDialog({
  title,
  triggerClassName, //customize default trigger button
  contentClassName, //customize content container
  children,
  customTrigger, //provide custom trigger
}: {
  title: string,
  triggerClassName?: string,
  contentClassName?: string,
  children?: React.ReactNode,
  customTrigger?: ()=>React.ReactNode,
}){
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  let content;
  if (isDesktop) {
    content = (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          {customTrigger
            ? customTrigger()
            : <Button variant="outline" className={cn(``, triggerClassName)}>{title}</Button>}
        </DialogTrigger>
        <DialogPortal>
          {/*bg-transparent cannot overwrite shadcn bg-black/80 currently, so I modify it inside the component*/}
          <DialogOverlay className={`bg-transparent backdrop-blur-sm`}/>
          <DialogContent className={"px-2 pb-0 max-w-md max-h-[85dvh]"}>
            <DialogHeader>
              <DialogTitle className={`px-3`}>{title}</DialogTitle>
            </DialogHeader>
            <div className={cn(``, contentClassName)}>
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  //@ts-ignore
                  return React.cloneElement(child, {open, setOpen}) // Let children able to close dialog
                }
                return child
              })}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
  }else{
    content = (
      <Sheet open={open} onOpenChange={setOpen} modal>
        <SheetTrigger asChild>
          {customTrigger
            ? customTrigger()
            : <Button variant="outline" className={cn(``, triggerClassName)}>{title}</Button>}
        </SheetTrigger>
        {/*remove the default close button in SheetContent*/}
        <SheetPortal>
          {/*bg-transparent cannot overwrite shadcn bg-black/80 currently, so I modify it inside the component*/}
          <SheetOverlay className={`bg-transparent backdrop-blur-sm`}/>
          <SheetContent className={`flex flex-col min-h-screen p-0 sm:max-w-full w-full`}>
            <div className={`fixed w-full h-20 border-b-2 flex items-center justify-center`}>
              <div className={`flex-1`}>
                <ChevronLeft className={`ml-5 w-8 h-8 cursor-pointer`} onClick={() => setOpen(false)}/>
              </div>
              <TypographyH4 className={`mx-auto`}>{title}</TypographyH4>
              <div className={`flex-1`}/>
            </div>
            <div className={cn(`flex-1 pt-20 max-h-full`, contentClassName)}>
              {React.Children.map(children, (child)=>{
                if(React.isValidElement(child)){
                  //@ts-ignore
                  return React.cloneElement(child, {open, setOpen}) // Let children able to close sheet
                }
                return child
              })}
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    )
  }

  return content
}