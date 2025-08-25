// src/pages/Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amplifyConfig from '../amplifyConfig';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setStatus('Missing code in URL');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: amplifyConfig.clientId,
          code,
          redirect_uri: amplifyConfig.redirectUri,
        });

        const res = await fetch(`${amplifyConfig.domain}/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        const tokens = await res.json();

        if (!tokens.access_token) {
          setStatus('Failed to retrieve tokens');
          console.error(tokens);
          return;
        }

        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('id_token', tokens.id_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);

        setStatus('Authentication successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1500);
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    exchangeCodeForToken();
  }, [navigate]);

  return <p>{status}</p>;
};

export default Callback;
