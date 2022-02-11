import { useRouter } from "next/router";
import NewSummoner from "../../../components/matches/NewSummoner";

const SummonerInfoPage = () => {
  const router = useRouter();

  const { region, summonerName } = router.query;
  
  return (
    <NewSummoner
      region={region}
      summonerName={summonerName}
    ></NewSummoner>
  );
};

export default SummonerInfoPage;
