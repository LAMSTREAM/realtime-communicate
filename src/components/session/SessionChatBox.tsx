'use client'

import React, {useLayoutEffect} from "react";
import {ArrowUp} from "lucide-react";
import {ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";

import {cn} from "@/lib/utils";
import {createMessage, getMessages} from "@/app/api/prisma/message";
import {useScrollTop} from "@/hooks/use-scroll-top";
import {useMediaQuery} from "@/hooks/use-media-query";
import useAutosizeTextarea from "@/hooks/use-autosize-textarea";
import {type LocalMessage, useSessionMessagesStore} from "@/hooks/use-session-messages-store";
import {Textarea} from "@/components/ui/textarea";
import MessageBar from "@/components/session/MessageBar";
import {useLocalUser} from "@/components/provider/local-user";

export default function SessionChatBox({
  className,
  sessionId
}: {
  className?: string;
  sessionId: number;
}) {
  sessionId = Number(sessionId)
  const { localUser } = useLocalUser();
  const {
    session,
    addMessage,
    updateMessage,
    appendMessages,
  } = useSessionMessagesStore((state) => ({
    session: state.sessions[sessionId] || {},
    addMessage: state.addMessage,
    updateMessage: state.updateMessage,
    appendMessages: state.appendMessages,
  }));

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prevScrollHeight = useRef<number>(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const backToBottom = useCallback(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const fetchMessages = useCallback(({ take, from, callback }: {
    take: number;
    from?: number;
    callback?: () => void;
  }) => {
    setIsLoading(true);
    getMessages(localUser?.sub!, sessionId, take, from)
      .then((messages) => appendMessages(sessionId, messages))
      .finally(() => {
        setIsLoading(false);
        if (callback) callback();
      });
  }, [appendMessages, localUser?.sub, sessionId]);

  useScrollTop({
    parentRef,
    callback: () => {
      const _from = session.messageOrder.findLast((e) => !(session.messages[e] as LocalMessage).isLocal);
      fetchMessages({ take: 40, from: _from });
    },
    shouldTriggerCallback: !isLoading,
  });

  useAutosizeTextarea(textareaRef.current, input, 100);

  // Fetch messages when enter the page
  useEffect(() => {
    fetchMessages({ take: 40, callback: backToBottom });
  }, [backToBottom, fetchMessages]);

  // Go to bottom when enter the page
  useLayoutEffect(() => {
    backToBottom();
  }, [backToBottom]);

  // Stay the same view when fetch history
  useLayoutEffect(() => {
    if (!parentRef.current || !isLoading) return;
    const currentContainer = parentRef.current;
    const currentScrollPosition = currentContainer.scrollHeight - prevScrollHeight.current;
    if (prevScrollHeight.current !== 0) {
      currentContainer.scrollTop = currentScrollPosition;
    }
    prevScrollHeight.current = currentContainer.scrollHeight;
  }, [isLoading, session]);

  /************* Input Bar Block **************/
  const onInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const sendNewMessage = useCallback((input: string) => {
    const newMessage = {
      sender: {
        id: localUser?.id,
        name: localUser?.name,
        image: localUser?.image,
      },
      ctime: new Date(),
      read: false,
      type: 'text',
      payload: input,
      sessionId: sessionId,
      id: Number(`${localUser?.id}${Date.now()}`),
      isLocal: true,
      retry: false,
    } as LocalMessage;
    addMessage(sessionId, newMessage);
    createMessage(localUser?.sub!, newMessage).then((result) => {
      updateMessage(sessionId, result || newMessage, newMessage.id);
    }).finally(backToBottom);
  }, [addMessage, backToBottom, localUser, sessionId, updateMessage]);

  const onSend = useCallback(() => {
    if(input === '')return;
    sendNewMessage(input)
    setInput("")
    // Focus back after send
    textareaRef.current?.focus()
  }, [input, sendNewMessage])

  const onInputPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Optimize for mobile keyboard break line
    if(isDesktop){
      if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault()
        onSend();
      }
    }
  }, [onSend, isDesktop])
  /************* Input Bar Block **************/

  return (
    <div className={cn(`flex flex-col`, className)}>
      <div
        ref={parentRef}
        className={`mx-2 flex flex-col-reverse flex-grow overflow-y-auto ${isDesktop ? 'light-scrollbar' : 'no-scrollbar'}`}>
        <div ref={bottomAnchorRef}/>
        <div className={`flex flex-col-reverse`}>
          {session.messageOrder?.length > 0 && session.messageOrder.map((id, index) => {
            const msg = session.messages[id];
            //remove duplicate avatar
            let hide = false;
            if (index >= 1 && session.messages[session.messageOrder[index - 1]].sender.id === msg.sender.id) {
              hide = true
            }
            return (
              <MessageBar
                key={msg.ctime.getTime()}
                message={msg}
                hide={hide}
              />
            )
          })}
        </div>
      </div>
      <div className={`flex-none h-auto w-full relative p-2`}>
        <Textarea
          ref={textareaRef}
          autoFocus={true}
          rows={1}
          className={`pr-12 text-md font-semibold resize-none no-scrollbar min-h-0 focus-visible:ring-offset-0`}
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputPress}
        />
        <ArrowUp
          className={`cursor-pointer text-white bg-blue-500 hover:bg-blue-600 rounded-full absolute bottom-4 right-4 w-6 h-6`}
          onClick={onSend}
        />
      </div>
    </div>
  )
}
