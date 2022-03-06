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
        console.log(items);
        itemTransformer(items.items);
        // const sortedItems = items.items.sort((a, b) => (a.id > b.id ? 1 : -1));
        // console.log(sortedItems);
        // itemHandler(sortedItems);
        return items;
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  let tempArray = [];
  const itemTransformer = (items) => {
    for (let i = 0; i < items.length; i++) {
      tempArray = { ...tempArray, [items[i].id]: { ...items[i] } };
    }
    console.log(tempArray);
    itemHandler(tempArray);
    return tempArray;
  };

  // might have to abs value this when implementing, for some reason id is - and +
  const itemList = {
    [1]: {
      name: "B.F. Sword",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/BF_Sword.dds",
      index: 606,
    },
    [2]: {
      name: "Recurve Bow",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Recurve_Bow.dds",
      index: 554,
    },
    [3]: {
      name: "Needlessly Large Rod",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Needlessly_Large_Rod.dds",
      index: 618,
    },
    [4]: {
      name: "Tear of the Goddess",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Tear_of_the_Goddess.dds",
      index: 568,
    },
    [5]: {
      name: "Chain Vest",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Chain_Vest.dds",
      index: 541,
    },
    [6]: {
      name: "Negatron Cloak",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Negatron_Cloak.dds",
      index: 571,
    },
    [7]: {
      name: "Giant's Belt",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Gaints_Belt.dds",
      index: 613,
    },
    [8]: {
      name: "Spatula",
      icon: "ASSETS/Maps/Particles/TF…ns/Standard/Spatula.dds",
      index: 597,
    },
    [9]: {
      name: "Sparring Gloves",
      icon: "ASSETS/Maps/Particles/TFT/Item_Icons/Standard/Sparring_Gloves.dds",
      index: 579,
    },
  };

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

  const logItems = () => {
    console.log(itemList);
    console.log(itemList[-2]);
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
      <button onClick={logItems}>Log items</button>
      {/* <IndividualMatch></IndividualMatch> */}
      {/* {summonerInfoState.success && <RenderMatchData></RenderMatchData>} */}
    </>
  );
};

export default SummonerInfoPage;
