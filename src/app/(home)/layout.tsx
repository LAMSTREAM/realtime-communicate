
import React from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}){

  return (
    <div className={`flex flex-col`}>
      <Header />
      <div className={`pt-[--header-height] pb-[--footer-height] mx-auto max-w-2xl w-full`}>
        {children}
      </div>
      <Footer />
    </div>
  )
}