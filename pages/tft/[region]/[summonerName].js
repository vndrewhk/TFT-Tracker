import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import NewSummoner from "../../../components/matches/NewSummoner";
import IndividualMatch from "../../../components/matches/IndividualMatch";
import { useCallback, useEffect } from "react";
import { summonerActions } from "../../../apps/store/summonerInfoSlice";

const SummonerInfoPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const { region, summonerName } = router.query;

  const fetchItemInfo = useCallback(async () => {
    try {
      const response = await fetch(
        "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json"
      );
      if (response.ok) {
        const items = await response.json();

        console.log(items);
        const sortedItems = items.items.sort((a, b) => (a.id > b.id ? 1 : -1));
        console.log(sortedItems);
        itemHandler(sortedItems);
        return items;
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const itemHandler = (items) => {
    dispatch(
      summonerActions.updateItems({
        items,
      })
    );
  };

  useEffect(() => {
    fetchItemInfo();
  }, []);

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
            <IndividualMatch key={id} matchId={id}></IndividualMatch>
          ))}
        </>
      )}
      {/* <IndividualMatch></IndividualMatch> */}
      {/* {summonerInfoState.success && <RenderMatchData></RenderMatchData>} */}
    </>
  );
};

// export async function getStaticProps() {
//   try {
//     const response = await fetch(
//       "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json"
//     );
//     if (response.ok) {
//       const items = await response.json();
//       return { props: { items } };
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return { props: { items: "N/A" } };
// }

export default SummonerInfoPage;
