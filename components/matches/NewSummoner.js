import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

const NewSummoner = (props) => {
  const [summonerName, setSummonerName] = useState("");

  const summonerRef = useRef();

  const summonerBlurHandler = () => {
    setSummonerName(summonerRef.current.value);
  };

  const fetchSummoner = async () => {
    console.log("prefetch");
    try {
      const response = await fetch(
        `/api/summoner_fetch?summonerName=${summonerName}`
      );

      console.log("postfetch");

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <form>
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
    </>
  );
};

export default NewSummoner;
