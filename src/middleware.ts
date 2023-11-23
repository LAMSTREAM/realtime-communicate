
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();

export const config = {
  //matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
  matcher: ["/(api(?!/auth).*)"], //protect api, but expose auth endpoint
}