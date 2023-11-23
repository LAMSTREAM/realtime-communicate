'use client'

import React from "react";
import {Search} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";

import {cn, waitTaskMinTime} from "@/lib/utils";
import {useMediaQuery} from "@/hooks/use-media-query";
import {searchUserByNameAndUid, UserBarBasic} from "@/app/api/prisma/user";
import {Input} from "@/components/ui/input";
import UserBar from "@/components/user/UserBar";
import {Skeleton} from "@/components/ui/skeleton";

export default function UserSearch({
  className,
}: {
  className?: string,
}){
  //indicate state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  //stash searchString
  const [searchString, setSearchString] = useState<string>("")
  //search results
  const [users, setUsers] = useState<UserBarBasic[]>([])
  //debounce for input fetch
  const [flag, setFlag] = useState<NodeJS.Timeout>()
  //ref for scroll fetch
  const resultsContainerRef = useRef<HTMLDivElement|null>(null)
  const [resultStartIndex, setResultStartIndex] = useState<number>(0)
  //if Desktop, limit height
  const isDesktop = useMediaQuery("(min-width: 768px)")

  //debounce input fetch
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(flag);
    setIsLoading(true);
    setResultStartIndex(0);
    setSearchString(event.target.value);
    const timeout = setTimeout(getUsers, 400);
    setFlag(timeout);

    async function getUsers() {
      const users = await searchUserByNameAndUid(event.target.value, 0, 20);
      setUsers(users);
      setIsLoading(false);
    }
  }, [flag]);

  // Infinite scroll fetch
  const handleScroll = useCallback(() => {
    const resultsContainer = resultsContainerRef.current;
    if (!resultsContainer || isLoading) return;

    const { scrollTop, clientHeight, scrollHeight } = resultsContainer;
    if (scrollTop + clientHeight >= scrollHeight) {
      setResultStartIndex(prev => prev + 20);
      getUsers();
    }

    async function getUsers() {
      //ensure search last 200ms, otherwise will cause flicker
      const users = await waitTaskMinTime(()=>{
        return searchUserByNameAndUid(
          searchString,
          resultStartIndex + 20,
          20
        );
      }, 200)
      if (users.length === 0) return;
      setUsers(prevState => [...prevState, ...users]);
    }
  }, [isLoading, resultStartIndex, searchString]);

  //attach scroll listener
  useEffect(()=>{
    const resultsContainer = resultsContainerRef.current;
    if(!resultsContainer)return;

    resultsContainer.addEventListener('scroll', handleScroll);
    return (()=>{
      resultsContainer.removeEventListener('scroll', handleScroll);
    })
  }, [handleScroll])

  return (
    <div
      ref={resultsContainerRef}
      className={cn(`p-4 max-h-full ${isDesktop && 'h-[60dvh]'} overflow-y-auto no-scrollbar`, className)}
    >
      <div className={'relative m-1'}>
        <Search className={`absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3`}/>
        <Input
          type={`text`}
          className={`pl-12 pr-4 text-md`}
          placeholder={`Name/User ID`}
          onChange={handleChange}
          value={searchString}
        />
      </div>
      <div className={`mt-4 space-y-1`}>
        {users && (
          users.map((user)=>(
            <UserBar key={user.uid} user={user} />
          ))
        )}
      </div>
      {isLoading && <Skeleton className="mt-2 mb-4 h-4 w-2/3" />}
    </div>
  )
}
