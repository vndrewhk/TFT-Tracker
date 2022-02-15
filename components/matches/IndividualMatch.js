import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import RenderMatchData from "./RenderMatchData";

// this file will only grab the data, and store it in redux. RenderMatchData.js will map the data
const IndividualMatch = () => {
  const [matchData, setMatchData] = useState();
  const [matchIsLoading, setMatchIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const matchId = "NA1_4216069806";
  const dispatch = useDispatch();
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  // map over the values of matchIds in the redux store
  const fetchMatchInfo = async () => {
    setMatchIsLoading(true);
    try {
      const response = await fetch(
        `/api/tft_individual_match?matchId=${matchId}`
      );
      const matchDetails = await response.json();
      setMatchData(matchDetails.matchData);
    } catch (err) {
      console.log(err);
    }
    setSuccess(true);
    setMatchIsLoading(false);
  };

  const storeMatchInfo = useCallback(() => {
    dispatch(
      summonerActions.updateMatchData({
        matchData,
      })
    );
  }, [dispatch, matchData]);

  const logInfo = () => {
    console.log(summonerInfoState.matchData);
  };

  useEffect(() => {
    storeMatchInfo();
  }, [matchData, storeMatchInfo]);

  return (
    <>
      {matchIsLoading && <div>Loading Match Details</div>}
      <button onClick={fetchMatchInfo}>fetch match details</button>
      <button onClick={logInfo}>log match details</button>
      {success && <RenderMatchData></RenderMatchData>}
    </>
  );
};

export default IndividualMatch;

// this comp should render out all the details itself, grabbing the match details from redux
// in the future, should render out each component by itself and then store the results in redux
