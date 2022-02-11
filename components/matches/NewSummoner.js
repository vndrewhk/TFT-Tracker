import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import HyperRollStats from "./HyperRollStats";
import RankedStats from "./RankedStats";

const NewSummoner = (props) => {
  // overwhelming amount of state, a reducer would be better now.
  const [hasLoaded, setHasLoaded] = useState("false");
  const [summonerName, setSummonerName] = useState("");
  const [summonerInfo, setSummonerInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matchInfo, setMatchInfo] = useState({ matchInfo: [{}] });
  const [region, setRegion] = useState("NA1");
  const [rankedTFTInfo, setRankedTFTInfo] = useState(null);
  const [hyperRollInfo, setHyperRollInfo] = useState(null);

  const [summonerFound, setSummonerFound] = useState(false);

  const summonerRef = useRef();

  const summonerBlurHandler = () => {
    setSummonerName(summonerRef.current.value);
  };

  const regionChangeHandler = (e) => {
    setRegion(e.target.value);
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

      console.log(data.data);
      setSummonerFound(true);
      if (!data.data) {
        setSummonerFound(false);
      }
      console.log("fetched");
      setIsLoading(false);

      return data.data;
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
    setIsLoading(false);
  };

  //if url is /summonerName/matches then call this fn

  const fetchMatches = async () => {
    //useEffect to fetch the summoner info so i dont have to call the summonerId
    //  every single time i call the match info
    const data = await fetchSummoner();
    setSummonerInfo(data);
    try {
      const matches = await fetch(
        `/api/tft_matches?region=${region}&summonerId=${data.id}`
      );
      const matchData = await matches.json();
      setMatchInfo(matchData);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      console.log(err);
    }
  };

  useEffect(() => {
    summonerBlurHandler();
  }, []);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    setRegion(props.region);
    setSummonerName(props.summonerName);
  }, [props.region, props.summonerName]);

  useEffect(() => {
    fetchMatches();
  }, [hasLoaded, region]);

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
  };

  const logId = () => {
    console.log(summonerName);
    console.log(region);
    console.log(summonerInfo);
    console.log(matchInfo.matchInfo);
    console.log(rankedTFTInfo);
    console.log(hyperRollInfo);
    console.log(success);
  };

  useEffect(() => {
    assignHyperRollInfo();
  }, [assignHyperRollInfo, matchInfo]);

  useEffect(() => {
    assignRankedInfo();
  }, [assignRankedInfo, matchInfo]);

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
      <Button variant="contained" onClick={fetchSummoner}>
        Click to fetch
      </Button>
      <Button variant="contained" onClick={fetchMatches}>
        Click to fetch AGAIN
      </Button>
      <Button variant="contained" onClick={logId}>
        Click to log current info
      </Button>
      <Button variant="contained" onClick={summonerBlurHandler}>
        Click to record summoner name
      </Button>
      <Button variant="contained" onClick={assignInfo}>
        Click to assign INFO
      </Button>
      {isLoading && <h1>Loading...</h1>}

      {/* need to add conditional rendering here, cannot assume the player has played ranked queues */}
      {/* use filter or map to separate them */}

      {/* need to clear state after checking a new user so it doesnt display old stats */}
      {success && rankedTFTInfo && (
        <RankedStats matchInfo={rankedTFTInfo}></RankedStats>
      )}
      {success && hyperRollInfo && (
        <HyperRollStats matchInfo={hyperRollInfo}></HyperRollStats>
      )}

      {!summonerFound && (
        <h1>Summoner not found! Did you select the correct region?</h1>
      )}

      {success && !rankedTFTInfo && !hyperRollInfo && (
        <h1>No Ranked Info Found!</h1>
      )}
    </>
  );
};

export default NewSummoner;
