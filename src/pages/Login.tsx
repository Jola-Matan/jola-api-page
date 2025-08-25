// src/pages/Login.tsx
'use client';
import { useEffect } from 'react';
import amplifyConfig from '../amplifyConfig';

export default function LoginPage() {
  useEffect(() => {
    const { domain, clientId, redirectUri } = amplifyConfig;
    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  }, []);

  return <p>Redirecting to login...</p>;
}
