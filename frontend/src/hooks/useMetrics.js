import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export function useMetrics() {
  const { data, error, isLoading } = useSWR('http://localhost:8000/metrics', fetcher, {
    refreshInterval: 5000,
    shouldRetryOnError: true,
    errorRetryCount: 3
  });

  return {
    metrics: data,
    isLoading,
    isError: error
  };
}
