import { useState } from 'react';

const useNgrokUrl = () => {
  const [ngrokUrl, setNgrokUrl] = useState('a92e-41-98-112-198.ngrok-free.app');

  const setUrl = (url) => {
    setNgrokUrl(url);
  };

  return { ngrokUrl, setUrl };
};

export default useNgrokUrl;
