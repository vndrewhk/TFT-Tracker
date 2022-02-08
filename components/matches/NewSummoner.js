import { Button } from "@mui/material";

const NewSummoner = (props) => {
  const fetchSummoner = async (summonerName) => {
    summonerName = "Voidlapse";
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
      <Button variant="contained" onClick={fetchSummoner}>
        Click to fetch
      </Button>
    </>
  );
};

export default NewSummoner;
