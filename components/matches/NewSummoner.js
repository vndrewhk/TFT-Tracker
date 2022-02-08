import { Button } from "@mui/material";

const NewSummoner = (props) => {
  const fetchSummoner = async () => {
    console.log("prefetch");
    try {
      const response = await fetch("/api/tft_fetch");

      console.log("postfetch");

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Button onClick={fetchSummoner}>Click to fetch</Button>
    </>
  );
};

export default NewSummoner;
