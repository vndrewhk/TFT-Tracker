import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import NewSummoner from "../../../components/matches/NewSummoner";
import IndividualMatch from "../../../components/matches/IndividualMatch";
// import NewSummoner from "../../../components/matches/NewSummoner";
import RenderMatchData from "../../../components/matches/RenderMatchData";


const SummonerInfoPage = () => {
  const router = useRouter();
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const { region, summonerName } = router.query;

  // probably should have a renew button that fetches all the matches
  return (
    <>
      {/* <NewSummoner region={region} summonerName={summonerName}></NewSummoner> */}
      <NewSummoner 
        key={summonerInfoState.routerSummoner}
        region={region}
        summonerName={summonerName}
      ></NewSummoner>
      {summonerInfoState.matchIds && (
        <>
          {summonerInfoState.matchIds.map((id) => (
            <IndividualMatch
      
              key={id}
              matchId={id}
            ></IndividualMatch>
          ))}
        </>
      )}
      {/* <IndividualMatch></IndividualMatch> */}
      {/* {summonerInfoState.success && <RenderMatchData></RenderMatchData>} */}
    </>
  );
};

export default SummonerInfoPage;
