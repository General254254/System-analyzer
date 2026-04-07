import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export function useHealth() {
  const { data, error, isLoading, mutate } = useSWR('http://localhost:8000/health', fetcher, {
    shouldRetryOnError: true,
    errorRetryCount: 3
  });
  
  const [isScanning, setIsScanning] = useState(false);

  const triggerScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('http://localhost:8000/report', { method: 'POST' });
      if (res.ok) {
        await mutate(); // Revalidate the health data
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return {
    healthReport: data,
    isLoading,
    isError: error,
    triggerScan,
    isScanning
  };
}
