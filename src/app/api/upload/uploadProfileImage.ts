'use server'

import fs from 'fs-extra';
import {generateRandomFilename, getFormattedDate} from "@/lib/utils";
import {getCurrentSub} from "@/lib/auth";

const uploadDir = './uploads/images/avatar'
export async function uploadProfileImage(base64Image: string){
  if(!base64Image)return '';
  const curSub = await getCurrentSub()
  if(!curSub)return '';
  try{
    //ensure path and no same file name
    await fs.ensureDir(uploadDir)
    let newPath = `${uploadDir}/${generateRandomFilename(getFormattedDate())}`
    while(await fs.pathExists(newPath)){
      newPath = `${uploadDir}/${generateRandomFilename(getFormattedDate())}`
    }
    //write file
    const buffer = Buffer.from(base64Image, 'base64')
    fs.writeFileSync(newPath, buffer)
    // make path of image as '/api/uploads/images/avatar/[filename]'
    return newPath.replace(".", "/api")
  } catch (error){
    console.log(error)
    return ''
  }
}