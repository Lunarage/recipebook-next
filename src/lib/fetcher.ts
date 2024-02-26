const fetcher = async (url: string) => {
  const result = await fetch(url);
  // TODO: Catch errors
  return result.json();
};

export default fetcher;
