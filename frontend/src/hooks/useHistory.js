import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
});

export function useHistory() {
  const { data, error, isLoading, mutate } = useSWR('http://localhost:8000/history', fetcher, {
    refreshInterval: 10000, // Refresh history every 10s
    shouldRetryOnError: true
  });

  return {
    history: data || [],
    isLoading,
    isError: error,
    refreshHistory: mutate
  };
}
