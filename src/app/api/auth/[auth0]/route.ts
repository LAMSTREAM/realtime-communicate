import {handleAuth, handleLogin} from '@auth0/nextjs-auth0';
import {config} from '@@/project-meta-config'

export const GET = handleAuth({
  login: handleLogin({
    returnTo: config.redirectUrlAfterLogin
  })
});