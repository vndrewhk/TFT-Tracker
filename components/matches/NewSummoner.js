import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import HyperRollStats from "./HyperRollStats";
import RankedStats from "./RankedStats";

import styles from "./NewSummoner.module.css";

const NewSummoner = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const [hasLoaded, setHasLoaded] = useState("false");
  const [summonerName, setSummonerName] = useState("");
  const [summonerInfo, setSummonerInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matchInfo, setMatchInfo] = useState({ matchInfo: [{}] });
  const [region, setRegion] = useState("NA1");
  const [rankedTFTInfo, setRankedTFTInfo] = useState(null);
  const [hyperRollInfo, setHyperRollInfo] = useState(null);
  const [summonerFound, setSummonerFound] = useState(true);
  const [matchIds, setMatchIds] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const [rankedTftVisible, setRankedTftVisible] = useState(true);
  const [hyperRollVisible, setHyperRollVisible] = useState(true);

  const [matchToggle, setMatchToggle] = useState(false);

  const summonerStateHandler = () => {
    dispatch(
      summonerActions.replaceSummoner({
        summonerInfo,
      })
    );
  };

  const storeMatchIds = () => {
    dispatch(
      summonerActions.replaceMatchIds({
        matchIds,
      })
    );
  };

  //this grabs the summoner ID which can be used to process info
  // want to reformat to use a hook that calls this function so its not defined here
  //reusable and can pass information through
  const fetchSummoner = async () => {
    setIsLoading(true);
    setRankedTFTInfo(null);
    setHyperRollInfo(null);
    setMatchInfo({ matchInfo: [{}] });
    try {
      const response = await fetch(
        `/api/summoner_fetch?region=${region}&summonerName=${summonerName}`
      );
      const data = await response.json();

      console.log(data);

      setSummonerFound(true);

      console.log("fetched");
      setIsLoading(false);

      return data.data;
    } catch (err) {
      setSummonerFound(false);
      setIsLoading(false);
      console.log(err);
    }
    setIsLoading(false);
  };

  const fetchMatchDetails = async () => {
    // success temporarily disabled bc of match v4 disabled
    // if (success) {
    setMatchesLoading(true);

    try {
      const response = await fetch(
        `/api/tft_match_details?puuid=${summonerInfoState.summonerInfo.puuid}`
      );
      const data = await response.json();

      setMatchIds(data.matchIds);
    } catch (err) {
      console.log(err);
    }
    setMatchesLoading(false);
    setMatchToggle(true);
  };

  const overviewButtonHandler = () => {
    setMatchToggle(false);
  };

  //if url is /summonerName/matches then call this fn

  const fetchMatches = async () => {
    //useEffect to fetch the summoner info so i dont have to call the summonerId
    //  every single time i call the match info
    const data = await fetchSummoner();
    setSummonerInfo(data);
    try {
      if (data.id) {
        const matches = await fetch(
          `/api/tft_matches?region=${region}&summonerId=${data.id}`
        );
        const matchData = await matches.json();
        setMatchInfo(matchData);
        setSuccess(true);
      } else {
        setSummonerFound(false);
      }
    } catch (err) {
      setSuccess(false);
      console.log(err);
    }
  };

  const assignRankedInfo = useCallback(() => {
    let rankedFiltered = matchInfo.matchInfo.filter(function (obj) {
      return obj.queueType === "RANKED_TFT";
    });
    setRankedTFTInfo(rankedFiltered[0]);
  }, [matchInfo.matchInfo]);

  const assignHyperRollInfo = useCallback(() => {
    let hyperRollFiltered = matchInfo.matchInfo.filter(function (obj) {
      return obj.queueType === "RANKED_TFT_TURBO";
    });
    setHyperRollInfo(hyperRollFiltered[0]);
  }, [matchInfo.matchInfo]);

  //   this makes it so that it will fetch the info on first load of page
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  //this ensures page reloads component with URL info

  useEffect(() => {
    setRegion(summonerInfoState.routerRegion);
    setSummonerName(summonerInfoState.routerSummoner);
  }, [summonerInfoState.routerRegion, summonerInfoState.routerSummoner]);

  //   this prevents it from trying to grab data when undefined, leading to the "NO SUMMONER FOUND" text.
  useEffect(() => {
    const loadNewUser = setTimeout(() => {
      fetchMatches();
    }, 1);
    return () => clearTimeout(loadNewUser);
  }, [hasLoaded, region]);

  //   temporary, this will ensure correct hyperroll info passed
  useEffect(() => {
    assignHyperRollInfo();
  }, [assignHyperRollInfo, matchInfo]);

  //   temporary, this will ensure correct ranked info passed
  useEffect(() => {
    assignRankedInfo();
  }, [assignRankedInfo, matchInfo]);

  //   this ensures redux state is updated with new info
  useEffect(() => {
    if (success) {
      summonerStateHandler();
      //   fetchMatchDetails();
    }
  }, [success]);

  useEffect(() => {
    storeMatchIds();
  }, [matchIds]);

  return (
    <div className={styles.summonerInfoBox}>
      <div className={styles.pageButton}>
        <Button variant="contained" onClick={overviewButtonHandler}>
          overview
        </Button>

        <Button variant="contained" onClick={fetchMatchDetails}>
          matches
        </Button>
      </div>

      {isLoading && <h1>Loading...</h1>}

      <div className={styles.summonerInfo}>
        <h1>{summonerName}</h1>
        {/*  ICON:{summonerInfoState.summonerInfo.profileIconId} */}
        {success && rankedTFTInfo && rankedTftVisible && (
          <RankedStats matchInfo={rankedTFTInfo}></RankedStats>
        )}

        {success && hyperRollInfo && hyperRollVisible && (
          <HyperRollStats matchInfo={hyperRollInfo}></HyperRollStats>
        )}

        {hasLoaded && !summonerFound && !summonerInfoState.isLoading && (
          <h1>Summoner not found! Did you select the correct region?</h1>
        )}
        {matchesLoading && <CircularProgress></CircularProgress>}
        {success && !rankedTFTInfo && !hyperRollInfo && (
          <h1>No Ranked Info Found for {summonerName}!</h1>
        )}
      </div>
    </div>
  );
};

export default NewSummoner;

// const toggleRanked = () => {
//   setRankedTftVisible(!rankedTftVisible);
// };
// const toggleHyperRoll = () => {
//   setHyperRollVisible(!hyperRollVisible);
// };
// const summonerBlurHandler = () => {
//   setSummonerName(summonerRef.current.value);
// };

// const regionChangeHandler = (e) => {
//   setRegion(e.target.value);
// };

// const assignInfo = () => {
//   assignHyperRollInfo();
//   assignRankedInfo();
//   summonerStateHandler();
// };

// const logId = () => {
//   console.log(summonerName);
//   console.log(region);
//   console.log(router.query);
//   // console.log(summonerInfo);
//   // console.log(matchInfo.matchInfo);
//   // console.log(rankedTFTInfo);
//   // console.log(hyperRollInfo);
//   // console.log(success);

//   console.log(summonerInfoState.summonerInfo);
//   console.log(summonerInfoState.matchIds);
//   console.log(summonerInfoState.routerSummoner);
// };

{
  /* <form onSubmit={fetchSummoner}>
        <Box>
          <TextField
            id="input-with-sx"
            label="Summoner Name"
            variant="standard"
            inputRef={summonerRef}
            onChange={summonerBlurHandler}
            onBlur={summonerBlurHandler}
          />
          <FormControl>
            <InputLabel id="region"> Region </InputLabel>
            <Select
              labelId="region-select-label"
              id="region-simple-select"
              value={region}
              label="Region"
              onChange={regionChangeHandler}
            >
              <MenuItem value={"NA1"}>NA1</MenuItem>
              <MenuItem value={"EUW1"}>EUW1</MenuItem>
              <MenuItem value={"EUN1"}>EUN1</MenuItem>
              <MenuItem value={"KR"}>KR</MenuItem>
              <MenuItem value={"LA1"}>LA1</MenuItem>
              <MenuItem value={"LA2"}>LA2</MenuItem>
              <MenuItem value={"BR1"}>BR1</MenuItem>
              <MenuItem value={"OC1"}>OC1</MenuItem>
              <MenuItem value={"RU"}>RU</MenuItem>
              <MenuItem value={"TR1"}>TR1</MenuItem>
              <MenuItem value={"JP1"}>JP1</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </form> */
}

{
  /* <Button variant="contained" onClick={fetchMatches}>
        Click to fetch
      </Button>
      <Button variant="contained" onClick={logId}>
        Click to log current info
      </Button> */
}
{
  /* <Button variant="contained" onClick={summonerBlurHandler}>
        Click to record summoner name
      </Button>
      <Button variant="contained" onClick={assignInfo}>
        Click to assign INFO
      </Button> */
}
{
  /* <Button variant="contained" onClick={toggleRanked}>
        Toggle RANKED
      </Button>
      <Button variant="contained" onClick={toggleHyperRoll}>
        Toggle HYPERROLL
      </Button> */
}
