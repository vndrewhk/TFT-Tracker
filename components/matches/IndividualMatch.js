import { style } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import RenderMatchData from "./RenderMatchData";
import styles from "./IndividualMatch.module.css";
import { CircularProgress } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import RenderMiniMatch from "./RenderMiniMatch";

// should show a mini version instead
// render summoner names but just the small version (names/icons/ur units only)
const IndividualMatch = (props) => {
  const [matchData, setMatchData] = useState(); //1
  const [matchIsLoading, setMatchIsLoading] = useState(false); //2
  const [success, setSuccess] = useState(false); //3
  const [toggled, setToggled] = useState(false);
  const [miniMatch, setMiniMatch] = useState(true);

  // const matchId = "NA1_4216069806";
  const matchId = props.matchId;

  const summonerInfoState = useSelector((state) => state.summonerInfo); //5

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
      // setToggled(true);
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

  useEffect(() => {
    fetchMatchInfo();
    if (!success) {
      setSuccess(true);
    }
  }, []);

  // useEffect(() => {
  //   if (success) {
  //     setToggled(true);
  //   }
  // }, [success]);

  const toggleMatchData = () => {
    setToggled(!toggled);
  };

  return (
    <div className={styles.matchContainer}>
      <div className={styles.matchInfo}>
        {matchIsLoading && <CircularProgress></CircularProgress>}
        {/* turn this component into the mini match overview */}
        {/* <h1 onClick={toggleMatchData}>Match {matchId}</h1> */}
        {success && !matchIsLoading && matchData && (
          <RenderMiniMatch
            matchData={matchData}
            key={`${matchData.metadata.match_id}_mini`}
          ></RenderMiniMatch>
        )}
        {success && toggled && matchData && (
          <RenderMatchData
            key={matchData.metadata.match_id}
            matchData={matchData}
          ></RenderMatchData>
        )}
      </div>
      <div className={styles["toggle-detail"]} onClick={toggleMatchData}>
        {toggled ? (
          <KeyboardArrowUp></KeyboardArrowUp>
        ) : (
          <KeyboardArrowDown></KeyboardArrowDown>
        )}
      </div>
      {/* <button onClick={logInfo}>log match details</button> */}
      {/* <button onClick={fetchMatchInfo}>fetch match details</button>
      <button onClick={logInfo}>log match details</button> */}
      {/* <button onClick={toggleMatchData}>Toggle Match Data</button> */}
      {/* <button onClick={setSuccessButton}> set suc</button> */}
    </div>
  );
};

export default IndividualMatch;
