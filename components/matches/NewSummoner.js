import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import HyperRollStats from "./HyperRollStats";
import RankedStats from "./RankedStats";

const NewSummoner = (props) => {
  const [summonerName, setSummonerName] = useState("");
  const [summonerInfo, setSummonerInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matchInfo, setMatchInfo] = useState("");
  const [region, setRegion] = useState("NA1");

  const summonerRef = useRef();
  const regionRef = useRef();

  const summonerBlurHandler = () => {
    setSummonerName(summonerRef.current.value);
  };

  const regionChangeHandler = (e) => {
    setRegion(e.target.value);
  };

  //this grabs the summoner ID which can be used to process info
  const fetchSummoner = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/summoner_fetch?region=${region}&summonerName=${summonerName}`
      );
      const data = await response.json();

      console.log(data.data);
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

  const logId = () => {
    console.log(summonerName);
    console.log(region);
    console.log(summonerInfo);
    console.log(matchInfo.matchInfo);
  };

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
      {isLoading && <h1>Loading...</h1>}

      {/* {success && (
       <>  <RankedStats
       // summonerName={summonerInfo.name}
       // queueType={matchInfo.matchInfo[1].queueType}
       // tier = {matchInfo.matchInfo[1].tier}
       // rank = {matchInfo.matchInfo[1].rank}
       // rating = {matchInfo.matchInfo[1].leaguePoints}
       matchInfo={matchInfo.matchInfo[1]}
     ></RankedStats> <HyperRollStats matchInfo={matchInfo.matchInfo[0]}></HyperRollStats> 
     </> )} */}

     
    </>
  );
};

export default NewSummoner;
