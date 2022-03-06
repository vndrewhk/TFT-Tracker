const RankedStats = (props) => {
  return (
    <>
    
      <div>
        <h2>Ranked</h2>
        <h3>
          Tier: {props.matchInfo.tier} {props.matchInfo.rank}
        </h3>
        <p>LP: {props.matchInfo.leaguePoints}</p>
        <p> Wins: {props.matchInfo.wins} Losses: {props.matchInfo.losses}</p>
      </div>
    </>
  );
};

export default RankedStats;

// dynamically render pages after /summoner/[name]/[region]
//when reaching these pages, useEffect call the api through NewSummoner.js
//return that content and render it
