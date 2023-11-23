
const meta = {
  title: 'SChat',
  author: 'Streamess',
  headerTitle: 'SChat',
  description: 'Your own realtime chat application',
  language: 'en-US',
  theme: 'system',
  siteUrl: 'https://streamess.net/SChat',
}

const basePath = process.env.NEXT_PUBLIC_BASEPATH || '';
const config = {
  basePath: basePath,
  socketPath: `${basePath}/api/socket`,
  redirectUrlAfterLogin: `${basePath}/session`
}

// Export as CommonJS
module.exports = { meta, config };
