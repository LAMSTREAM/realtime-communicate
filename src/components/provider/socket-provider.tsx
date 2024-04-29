"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import {toast} from "sonner";
import { io } from "socket.io-client";

import {config} from "@@/project-meta-config";
import {getSesssions} from "@/app/api/prisma/session";
import {getMessageById} from "@/app/api/prisma/message";
import {useLocalUser} from "@/components/provider/local-user";
import MessagePrompt from "@/components/session/MessagePrompt";
import {RemoteMessage, useSessionMessagesStore} from "@/hooks/use-session-messages-store";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const {localUser} = useLocalUser()
  const addMessage = useSessionMessagesStore(state => state.addMessage)

  useEffect(() => {
    // By default, socket url refer to origin, this place is fine
    const socket = io({
      path: config.socketPath
    }) as any;

    socket.on("connect", () => {
      setIsConnected(true);
      // Subscribe to all sessions
      setTimeout(async () => {
        const sessionsId = await getSesssions(localUser?.sub!)
        if(sessionsId.length > 0){
          socket.emit('client', {
            type: 'subscribeSessions',
            sessionsId: sessionsId
          })
        }
      }, 0)
    });

    //@ts-ignore
    socket.on('newMessage', (data) => {
      getMessageById(localUser?.sub!, data.sessionId, data.messageId)
        .then((msg: RemoteMessage | null) => {
          if(!msg)return;
          addMessage(data.sessionId, msg)

          if(msg.sender.id === localUser?.id)return;
          toast((<MessagePrompt msg={msg} />))
        })
    })

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    }
  }, [localUser, addMessage]);

  return (
    <SocketContext.Provider value={{socket, isConnected}}>
      {children}
    </SocketContext.Provider>
  )
}