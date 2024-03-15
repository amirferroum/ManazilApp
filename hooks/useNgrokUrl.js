import { useState } from 'react';

const useNgrokUrl = () => {
  const [ngrokUrl, setNgrokUrl] = useState('d6fc-105-106-241-193.ngrok-free.app');

  const setUrl = (url) => {
    setNgrokUrl(url);
  };

  return { ngrokUrl, setUrl };
};

export default useNgrokUrl;
