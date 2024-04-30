
import path from 'path';
import fs from 'fs-extra';
import {NextRequest} from "next/server";

const uploadDir = './uploads/images/avatar'
export const GET = async (
  request: NextRequest,
  {params}: {params: {avatarname: string}}
) => {

  const filename = params.avatarname;
  if (!filename) {
    return new Response('No file specified.', { status: 400 });
  }
  // Security: Ensure the filename does not contain path traversal characters
  if (filename.includes('../') || filename.includes('..\\')) {
    return new Response('Invalid file path.', { status: 400 });
  }
  const filePath = path.join(uploadDir, filename);

  // Check if the file exists
  try {
    fs.accessSync(filePath); // Throws if the file does not exist
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'image/jpeg', // Consider dynamically determining MIME type
      },
    });
  } catch (error) {
    console.error('File access error:', error);
    return new Response('File not found', { status: 404 });
  }

}
