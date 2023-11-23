
import React from "react";
import type { Metadata } from 'next'
import {UserProvider} from "@auth0/nextjs-auth0/client";

import '@/css/global.css'
import {meta, config} from "@@/project-meta-config";
import {ThemeProvider} from "@/components/theme/theme-provider"
import {SocketProvider} from "@/components/provider/socket-provider";
import {StateModalProvider} from "@/components/provider/state-modal";
import {LocalUserProvider} from "@/components/provider/local-user";

const faviconPath = config.basePath + '/favicon';

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: meta.title,
  description: meta.description,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppress next-theme error
    <html
      lang={meta.language}
      suppressHydrationWarning
      className={`overflow-y-auto no-scrollbar`}
    >
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: light)"/>
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)"/>
      <link rel="apple-touch-icon" sizes="180x180" href={`${faviconPath}/apple-touch-icon.png`}/>
      <link rel="icon" type="image/png" sizes="32x32" href={`${faviconPath}/favicon-32x32.png`}/>
      <link rel="icon" type="image/png" sizes="16x16" href={`${faviconPath}/favicon-16x16.png`}/>
      <link rel="manifest" href={`${faviconPath}/site.webmanifest`}/>
    </head>
    <body>
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <StateModalProvider>
        <UserProvider
          loginUrl={`${config.basePath}/api/auth/login`}
          profileUrl={`${config.basePath}/api/auth/me`}
        >
          <LocalUserProvider>
            <SocketProvider>
              {/*SocketProvide should under LocalUserProvider, */}
              {/*it needs to use session.user.sub to subscribe socket event*/}
              {children}
            </SocketProvider>
          </LocalUserProvider>
        </UserProvider>
      </StateModalProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
