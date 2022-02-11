const useLocalFetch = () => {
  const sendRequest = async (requestConfig) => {
    try {
      const responseData = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: JSON.stringify(requestConfig.body),
      });

      if (!responseData.ok) {
        throw new Error("Something went wrong!");
      }
 
    } catch (err) {
      console.log(err);
    }
  };

  return { sendRequest };
};
export default useLocalFetch;
