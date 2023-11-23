import { useEffect } from "react";

type ScrollTopType = {
  parentRef: React.RefObject<HTMLDivElement>;
  callback: () => void;
  shouldTriggerCallback: boolean;
};

export function useScrollTop({
  parentRef,
  callback,
  shouldTriggerCallback,
}: ScrollTopType){

  useEffect(() => {
    const topDiv = parentRef.current;
    if(!topDiv || !shouldTriggerCallback)return

    const handleScroll = () => {
      const { scrollTop}  = topDiv;
      if (scrollTop === 0)callback()
    };

    topDiv.addEventListener("scroll", handleScroll);
    return () => {
      topDiv.removeEventListener("scroll", handleScroll);
    }
  }, [callback, parentRef, shouldTriggerCallback]);
}