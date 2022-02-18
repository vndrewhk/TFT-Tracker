import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import RenderMatchData from "./RenderMatchData";

const IndividualMatch = (props) => {
  // for each match, send in props of the matchId
  const [matchData, setMatchData] = useState(); //1
  const [matchIsLoading, setMatchIsLoading] = useState(false); //2
  const [success, setSuccess] = useState(false); //3
  const [toggled, setToggled] = useState(false);
  // const matchId = "NA1_4216069806";
  const matchId = props.matchId;
  // const dispatch = useDispatch(); //4
  const summonerInfoState = useSelector((state) => state.summonerInfo); //5
  // map over the values of matchIds in the redux store

  //because im setting state here, it re-renders multiple times
  //perhaps render in a separate fn

  //fking retarded couldve just done if (success) {}
  const fetchMatchInfo = async () => {
    setMatchIsLoading(true);
    try {
      const response = await fetch(
        `/api/tft_individual_match?matchId=${matchId}`
      );
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

  const logInfo = () => {
    console.log(summonerInfoState.matchData);
  };

  // useEffect(() => {
  //   //7
  //   storeMatchInfo();
  // }, [storeMatchInfo]);
  console.log("PARENT RENDERING");
  console.log("rendering done");

  useEffect(() => {
    fetchMatchInfo();
    if (!success) {
      setSuccess(true);
    }
  }, []);

  // const setSuccessButton = () => {
  //   setSuccess(!success);
  // };
  const toggleMatchData = () => {
    setToggled(!toggled);
  };

  return (
    <>
      {/* should rework to have fetchMatchInfo grab every single match, up to 20 and then render them all */}
      {matchIsLoading && <div>Loading Match Details</div>}
      <h1 onClick={toggleMatchData}>Match {matchId}</h1>
      {/* <button onClick={fetchMatchInfo}>fetch match details</button>
      <button onClick={logInfo}>log match details</button> */}
      {/* <button onClick={toggleMatchData}>Toggle Match Data</button> */}
      {/* <button onClick={setSuccessButton}> set suc</button> */}
      {success && toggled && (
        <RenderMatchData matchData={matchData}></RenderMatchData>
      )}
    </>
  );
};

export default IndividualMatch;

// this comp should render out all the details itself, grabbing the match details from redux
// in the future, should render out each component by itself and then store the results in redux
