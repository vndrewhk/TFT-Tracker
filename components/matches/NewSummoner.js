import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

const NewSummoner = (props) => {
  const [summonerName, setSummonerName] = useState("");
  const [summonerInfo, setSummonerInfo] = useState("");
  const [matchInfo, setMatchInfo] = useState("");
  const summonerRef = useRef();

  const summonerBlurHandler = () => {
    setSummonerName(summonerRef.current.value);
  };

  //this grabs the summoner ID which can be used to process info
  const fetchSummoner = async () => {
    try {
      const response = await fetch(
        `/api/summoner_fetch?summonerName=${summonerName}`
      );
      const data = await response.json();

      console.log(data.data);
      console.log("fetched");

      return data.data;
    } catch (err) {
      console.log(err);
    }
  };

  //if url is /summonerName/matches then call this fn

  const fetchMatches = async () => {
    //useEffect to fetch the summoner info so i dont have to call the summonerId
    //  every single time i call the match info
    const data = await fetchSummoner();
    setSummonerInfo(data);
    try {
      const matches = await fetch(`/api/tft_matches?summonerId=${data.id}`);
      const matchData = await matches.json();
      setMatchInfo(matchData);
    } catch (err) {
      console.log(err);
    }
  };

  const logId = () => {
    console.log(summonerInfo);
    console.log(matchInfo);
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
            onBlur={summonerBlurHandler}
          />
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
    </>
  );
};

export default NewSummoner;
