const HyperRollStats = (props) => {
  return (
    <>
   
      <div>
        <h2>Rank Type: {props.matchInfo.queueType}</h2>
        <p>LP: {props.matchInfo.ratedRating}</p>
        <p> Wins: {props.matchInfo.wins} Losses: {props.matchInfo.losses}</p>
      </div>
    </>
  );
};

export default HyperRollStats;

// dynamically render pages after /summoner/[name]/[region]
//when reaching these pages, useEffect call the api through NewSummoner.js
//return that content and render it
