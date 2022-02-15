import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import HyperRollStats from "./HyperRollStats";
import RankedStats from "./RankedStats";

const BetaNewSummoner = (props) => {
  // error occurs upon manually entering the page bc it doesnt get passed the query
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
  const [matchIds, setMatchIds] = useState({});

  const [rankedTftVisible, setRankedTftVisible] = useState(true);
  const [hyperRollVisible, setHyperRollVisible] = useState(true);

  const toggleRanked = () => {
    setRankedTftVisible(!rankedTftVisible);
  };
  const toggleHyperRoll = () => {
    setHyperRollVisible(!hyperRollVisible);
  };

  const summonerRef = useRef();

  const summonerBlurHandler = () => {
    setSummonerName(summonerRef.current.value);
  };

  const regionChangeHandler = (e) => {
    setRegion(e.target.value);
  };
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

  // here we assume that fetching the user has been successful.
  const fetchMatchDetails = async () => {
    if (success) {
      try {
        const response = await fetch(
          `/api/tft_match_details?puuid=${summonerInfoState.summonerInfo.puuid}`
        );
        const data = await response.json();

        setMatchIds(data.matchIds);
      } catch (err) {
        console.log(err);
      }
    }
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
          setSummonerFound(false)
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

  const assignInfo = () => {
    assignHyperRollInfo();
    assignRankedInfo();
    summonerStateHandler();
  };

  const logId = () => {
    console.log(summonerName);
    console.log(region);
    console.log(router.query);
    // console.log(summonerInfo);
    // console.log(matchInfo.matchInfo);
    // console.log(rankedTFTInfo);
    // console.log(hyperRollInfo);
    // console.log(success);

    console.log(summonerInfoState.summonerInfo);
    console.log(summonerInfoState.matchIds);
    console.log(summonerInfoState.routerSummoner);
  };

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

  return (
    <>
      <form onSubmit={fetchSummoner}>
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
      </form>
      {/* <Button variant="contained" onClick={fetchSummoner}>
        Click to fetch
      </Button> */}
      <Button variant="contained" onClick={fetchMatches}>
        Click to fetch
      </Button>
      <Button variant="contained" onClick={logId}>
        Click to log current info
      </Button>
      {/* <Button variant="contained" onClick={summonerBlurHandler}>
        Click to record summoner name
      </Button>
      <Button variant="contained" onClick={assignInfo}>
        Click to assign INFO
      </Button> */}
      {/* <Button variant="contained" onClick={toggleRanked}>
        Toggle RANKED
      </Button>
      <Button variant="contained" onClick={toggleHyperRoll}>
        Toggle HYPERROLL
      </Button> */}
      <Button variant="contained" onClick={fetchMatchDetails}>
        Fetch Match Details
      </Button>
      <Button variant="contained" onClick={storeMatchIds}>
        store match ids
      </Button>
      {isLoading && <h1>Loading...</h1>}

      {/* need to add conditional rendering here, cannot assume the player has played ranked queues */}
      {/* use filter or map to separate them */}

      {/* need to clear state after checking a new user so it doesnt display old stats */}
      {success && rankedTFTInfo && rankedTftVisible && (
        <RankedStats matchInfo={rankedTFTInfo}></RankedStats>
      )}
      {/* {success&&rankedTFTInfo&&rankedTftVisible&&<div>{matchIds}</div>} */}
      {/* would map a component here */}
      {success && hyperRollInfo && hyperRollVisible && (
        <HyperRollStats matchInfo={hyperRollInfo}></HyperRollStats>
      )}

      {hasLoaded && !summonerFound && !summonerInfoState.isLoading && (
        <h1>Summoner not found! Did you select the correct region?</h1>
      )}

      {success && !rankedTFTInfo && !hyperRollInfo && (
        <h1>No Ranked Info Found!</h1>
      )}
    </>
  );
};

export default BetaNewSummoner;
