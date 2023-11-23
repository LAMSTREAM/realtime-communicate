'use client'

import React from "react";
import {useState} from "react";

import {cn} from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader, DrawerOverlay, DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

//In this component, use special way deliver open and setOpen props to let child component can control if close the dialog
export default function DrawerDialog({
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
                  return React.cloneElement(child, {open, setOpen}) // Let children able to close dislog
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
      <Drawer open={open} onOpenChange={setOpen} modal>
        <DrawerTrigger asChild>
          {customTrigger
            ? customTrigger()
            : <Button variant="outline" className={cn(``, triggerClassName)}>{title}</Button>}
        </DrawerTrigger>
        <DrawerPortal>
          {/*bg-transparent cannot overwrite shadcn bg-black/80 currently, so I modify it inside the component*/}
          <DrawerOverlay className={`bg-transparent backdrop-blur-sm`}/>
          <DrawerContent className={`px-8 pb-4`}>
            {/*to avoid overflow*/}
            <div className={`max-h-[85dvh] overflow-y-auto no-scrollbar`}>
              <DrawerHeader className="text-left px-3">
                <DrawerTitle>{title}</DrawerTitle>
              </DrawerHeader>
              <div className={cn(``, contentClassName)}>
                {React.Children.map(children, (child)=>{
                  if(React.isValidElement(child)){
                    //@ts-ignore
                    return React.cloneElement(child, {open, setOpen}) // Let children able to close drawer
                  }
                  return child
                })}
              </div>
              <DrawerFooter className={`px-3 py-0`}>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    )
  }

  return content
}