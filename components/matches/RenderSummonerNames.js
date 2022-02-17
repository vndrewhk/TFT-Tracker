import { useEffect } from "react";
import { useSelector } from "react-redux";

const RenderSummonerNames = () => {
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const getSummonerByPUUID = async (puuid) => {
    setMatchIsLoading(true);
    try {
      const response = await fetch(`/api/getByPUUID?puuid=${puuid}`);
      const matchDetails = await response.json();
      setMatchData(matchDetails.matchData);

      if (!success) {
        setSuccess(true);
      }
      setMatchIsLoading(false);
    } catch (err) {
      setSuccess(false);
      console.log(err);
    }
    // setSuccess(true);
  };

//   useEffect(() => {
//     getSummonerByPUUID;
//   }, []);

  return <>Summoner Names</>;
};
export default RenderSummonerNames;
