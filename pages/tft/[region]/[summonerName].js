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

  // have to transform this into what i need
  const fetchItemInfo = useCallback(async () => {
    try {
      const response = await fetch(
        "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json"
      );
      if (response.ok) {
        const items = await response.json();
        // console.log(items);
        itemTransformer(items.items);
        championDataTransformer(items.sets[6].champions);
        traitDataTransformer(items.sets[6].traits);
        return items;
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  let tempItems = [];
  let tempTraitData = [];
  let tempChampionData = [];
  const itemTransformer = (items) => {
    for (let i = 0; i < items.length; i++) {
      tempItems = { ...tempItems, [items[i].id]: { ...items[i] } };
    }
    // console.log(tempItems);
    itemHandler(tempItems);
    return tempItems;
  };

  const championDataTransformer = (championData) => {
    for (let i = 0; i < championData.length; i++) {
      tempChampionData = {
        ...tempChampionData,
        [championData[i].apiName]: { ...championData[i] },
      };
    }
    championDataHandler(tempChampionData);
    console.log(tempChampionData);
  };
  const traitDataTransformer = (traitData) => {
    for (let i = 0; i < traitData.length; i++) {
      tempTraitData = {
        ...tempTraitData,
        [traitData[i].apiName]: { ...traitData[i] },
      };
    }
    traitDataHandler(tempTraitData);
    console.log(tempTraitData);
  };

  // json->sets->6 has champ info (ability,name,icon,etc)

  const itemHandler = (items) => {
    dispatch(
      summonerActions.updateItems({
        items,
      })
    );
  };
  const traitDataHandler = (traitData) => {
    dispatch(summonerActions.updateTraitData({ traitData }));
  };
  const championDataHandler = (championData) => {
    dispatch(summonerActions.updateChampionData({ championData }));
  };

  useEffect(() => {
    fetchItemInfo();
  }, []);

  const logItems = () => {
    console.log(summonerInfoState.items);
    console.log(summonerInfoState.championData);
    console.log(summonerInfoState.traitData);
  };
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
      {/* <button onClick={logItems}>Log items</button> */}
      {/* <IndividualMatch></IndividualMatch> */}
      {/* {summonerInfoState.success && <RenderMatchData></RenderMatchData>} */}
    </>
  );
};

export default SummonerInfoPage;
