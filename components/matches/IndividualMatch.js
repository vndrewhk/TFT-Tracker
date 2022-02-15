import { useState } from "react";

const IndividualMatch = () => {
  const [matchData, setMatchData] = useState();
  const matchId = "NA1_4216069806";
  const fetchMatchInfo = async () => {
    try {
      const response = await fetch(
        `/api/tft_individual_match?matchId=${matchId}`
      );
      const matchDetails = await response.json();
      setMatchData(matchDetails);
    } catch (err) {
      console.log(err);
    }
  };

  const logInfo = () => {
    console.log(matchData);
  };

  return (
    <>
      <button onClick={fetchMatchInfo}>fetch match details</button>
      <button onClick={logInfo}>log match details</button>
    </>
  );
};

export default IndividualMatch;

// this comp should render out all the details itself, grabbing the match details from redux
// in the future, should render out each component by itself and then store the results in redux
