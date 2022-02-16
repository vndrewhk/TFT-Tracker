import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import BetaNewSummoner from "../../../components/matches/BetaNewSummoner";
import IndividualMatch from "../../../components/matches/IndividualMatch";
import NewSummoner from "../../../components/matches/NewSummoner";
import RenderMatchData from "../../../components/matches/RenderMatchData";

const SummonerInfoPage = () => {
  const router = useRouter();
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const { region, summonerName } = router.query;

  return (
    <>
      {/* <NewSummoner region={region} summonerName={summonerName}></NewSummoner> */}
      <BetaNewSummoner
        key={summonerInfoState.routerSummoner}
        region={region}
        summonerName={summonerName}
      ></BetaNewSummoner>
      <IndividualMatch></IndividualMatch>
      {/* {summonerInfoState.success && <RenderMatchData></RenderMatchData>} */}
    </>
  );
};

export default SummonerInfoPage;
