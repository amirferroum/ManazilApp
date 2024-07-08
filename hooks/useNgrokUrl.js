import { useState } from 'react';

const useNgrokUrl = () => {
  const [ngrokUrl, setNgrokUrl] = useState('139d-105-110-241-143.ngrok-free.app');

  const setUrl = (url) => {
    setNgrokUrl(url);
  };

  return { ngrokUrl, setUrl };
};

export default useNgrokUrl;
