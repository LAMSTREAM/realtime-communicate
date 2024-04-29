import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { v4 as uuidv4 } from 'uuid';
import {config} from "@@/project-meta-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomFilename(extension?: string) {
  const uniqueId = uuidv4();
  return `${uniqueId}${extension||''}`;
}

export function getFormattedDate(): string {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = (today.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = today.getUTCDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formateTime(date: Date): string {
    let hours: number|string = date.getHours();
    let minutes: number|string = date.getMinutes();

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

export function delay(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, milliseconds);
  });
}

//ensure a function execute at least minTime
export async function waitTaskMinTime<T>(
  asyncTask: ()=>Promise<T>,
  time: number
): Promise<T> {
  const start = Date.now()
  let result: T;

  try{
    result = await asyncTask()
  }catch (error){
    throw error
  }

  const elapsedTime = Date.now() - start;
  if(elapsedTime < time){
    await delay(time - elapsedTime)
  }

  return result
}

export function getUserImageSource(src: string|undefined){
  //if none, return default [userid] image
  if(!src)return `${config.basePath}/default-avatar.png`;
  //if external resource, return
  if(src.startsWith('http') || src.startsWith('data:'))return src;
  //if local resource, append basePath
  return config.basePath + src;
}

export function replaceUndefinedNull(obj: any){
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj[key] === undefined || obj[key] === null) {
        obj[key] = '';
      } else if (typeof obj[key] === 'object') {
        obj[key] = replaceUndefinedNull(obj[key]);
      }
    }
  }
  return obj;
}
