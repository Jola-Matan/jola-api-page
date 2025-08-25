// amplifyConfig.ts
const isLocalhost = window.location.hostname === 'localhost';

const redirectUri = isLocalhost
  ? 'http://localhost:5173/callback'
  : 'https://app.heyjola.com/callback';

const logoutUri = isLocalhost
  ? 'http://localhost:5173/login'
  : 'https://app.heyjola.com/login'; 

const amplifyConfig = {
  clientId: '55018cv7221fsmjst02e54f55a',
  domain: 'https://us-east-1k9n25treu.auth.us-east-1.amazoncognito.com',
  redirectUri,
  logoutUri,
};

export default amplifyConfig;
