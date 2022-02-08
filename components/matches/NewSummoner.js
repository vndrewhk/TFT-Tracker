import { Button } from "@mui/material";

const NewSummoner = (props) => {
  const fetchSummoner = async () => {
    console.log("prefetch");
    const response = await fetch("/api/tft_fetch", {
      method: "POST",
    });

    console.log("postfetch");

    const data = await response.json();
    console.log(data);
  };
  return (
    <>
      <Button onClick={fetchSummoner}>Click to fetch</Button>
    </>
  );
};

export default NewSummoner;
