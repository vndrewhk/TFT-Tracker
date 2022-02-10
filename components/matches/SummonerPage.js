import { useRouter } from "next/router";

const SummonerPage = (props) => {
  return (
    <>
      <h1>Summoner Name: {props.summonerName}</h1>
      <div>
        <h2>Rank Type: {props.queueType}</h2>
        <p>LP: {props.rating}</p>
      </div>
    </>
  );
};

export default SummonerPage;

// dynamically render pages after /summoner/[name]/[region]
//when reaching these pages, useEffect call the api through NewSummoner.js
//return that content and render it
