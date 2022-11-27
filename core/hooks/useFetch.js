import { useEffect, useState } from "react";

export const useFetch = (request, doRequestInit = true) => {
  if (!request) throw new Error("request required in useFetch");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doRequest, setDoRequest] = useState(doRequestInit);

  useEffect(() => {
    if (doRequest) {
      setIsLoading(true);

      request()
        .then((res) => setData(res.data))
        .catch((error) => setError(error))
        .finally(() => {
          setIsLoading(false);
          setDoRequest(false);
        });
    }
  }, [doRequest]);

  const refetch = () => {
    setDoRequest(true);
  };

  return { data, error, isLoading, refetch };
};
