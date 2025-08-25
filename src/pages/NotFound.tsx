import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] p-8">
      <div className="text-[8rem] font-extrabold text-[#232A34] mb-4">404</div>
      <div className="text-3xl font-semibold text-[#8A94A6] mb-2">Oops! Page not found</div>
      <div className="text-lg text-[#8A94A6] mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.<br />
        But don&apos;t worry, you can always go back home!
      </div>
      <Button
        className="rounded-xl px-8 py-4 text-lg font-bold shadow-lg"
        style={{ backgroundColor: '#232A34', color: '#fff' }}
        onClick={() => navigate('/')}
      >
        Go Home
      </Button>
      <div className="mt-12 text-5xl animate-bounce">🐣</div>
    </div>
  );
};

export default NotFound; 