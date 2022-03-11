import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import fetchCDragon from "../../pages/api/fetchCDragon";
import styles from "./RenderSummonerNames.module.css";
import goldIcon from "../assets/icons/ico-gold.png";
const RenderSummonerNames = (props) => {
  const [sortedUserList, setSortedUserList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [augmentPortraits, setAugmentPortraits] = useState([]);
  const [unitsLoaded, setUnitsLoaded] = useState(false);
  const [traitPortraits, setTraitPortraits] = useState([]);
  const [unitPortraits, setUnitPortraits] = useState([]);
  const [unitsFetched, setUnitsFetched] = useState(false);

  const summonerInfoState = useSelector((state) => state.summonerInfo);
  // when sortedUserList length === 8, trigger fn
  // fn will fetch all units from the game and store in object key value pair, {tft6_ahri:ASSETS/Characters/TFT6_Ahri/HUD/TFT6_Ahri.TFT_Set6_Stage2.dds}
  // then will use this data in a state to render in site

  const grabAllSummoners = () => {
    setUserList([]);
    props.participants.map((player) => getSummonerByPUUID(player));
  };

  const getSummonerByPUUID = async (player) => {
    try {
      const response = await fetch(`/api/getByPUUID?puuid=${player.puuid}`);
      const userDetails = await response.json();
      // console.log(userDetails);
      setUserList((prevState) => [
        ...prevState,
        { ...player, ...userDetails.userInfo },
      ]);
    } catch (err) {
      console.log(err);
    }
    // return tempList;
  };

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  const sortPlayers = useCallback(() => {
    let tempPlayers = userList.slice();
    setSortedUserList(tempPlayers.sort(dynamicSort("placement")));
  }, [userList]);

  useEffect(() => {
    sortPlayers();
  }, [sortPlayers, userList]);

  // console.log("render cycle");
  useEffect(() => {
    grabAllSummoners();
  }, []);

  const timeConverter = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    const convertedTime = `${minutes}m${seconds}s`;
    return convertedTime;
  };
  const fetchUnitInfo = async (unit) => {
    // success temporarily disabled bc of match v4 disabled
    // if (success) {
    try {
      const response = await fetch(`/api/fetchCDragon?unit=${unit}`);
      const unitInfo = await response.json();

      return unitInfo;
    } catch (err) {
      console.log(err);
    }
    // }
  };

  // should actually fetch every unit and then store it ONCE
  // need to prevent adding a duplicate, or filter it
  let tempUnits = {};
  const unitImageHandler = async (unit) => {
    const unitInfo = await fetchUnitInfo(unit);
    // console.log(unitInfo);
    for (const hash in unitInfo.unitInfo) {
      // console.log(unitInfo.unitInfo[hash]);
      for (const key in unitInfo.unitInfo[hash]) {
        if (key === "PortraitIcon") {
          tempUnits = {
            ...tempUnits,
            [unit]: `https://raw.communitydragon.org/latest/game/${unitInfo.unitInfo[
              hash
            ][key]
              .toLowerCase()
              .replace("dds", "png")}`,
          };
        }
      }
    }
    tempUnits = {
      ...tempUnits,
      tft6_veigar: `https://raw.communitydragon.org/latest/game/assets/characters/tft6_veigar/hud/tft6_veigar_square.tft_set6.png`,
    };
    setUnitPortraits(tempUnits);
    setUnitsLoaded(true);
  };

  // i only need to fetch once in this case

  // let tempItems = {};
  // const itemHandler = async (item_id)=>{
  //   const itemInfo = await fetchItemInfo(item_id)
  // }

  if (sortedUserList.length === 8 && !unitsFetched) {
    console.log(sortedUserList[0].units);
    for (let i = 0; i < sortedUserList.length; i++) {
      for (let j = 0; j < sortedUserList[i].units.length; j++) {
        // console.log(sortedUserList[i].units[j].character_id.toLowerCase());

        unitImageHandler(sortedUserList[i].units[j].character_id.toLowerCase());
      }
    }
    setUnitsFetched(true);
  }

  const usersList = (
    <div>
      {sortedUserList.map((user) => (
        <div className={styles.individualSummoner} key={user.puuid}>
          {/* summoner names of each player */}
          <li className={styles.userList}>
            <h4 className={styles["username"]} key={user.name}>
              {/* we dont use #{user.tagLine} because api not provided from Riot */}
              <span>{user.placement} - </span> {user.name}
              {/* onClick -> router.push(/{region}/{user.gameName}) */}
            </h4>
          </li>

          {/* general info */}
          {/* GOLD, LAST ROUND, TOTAL DAMAGE */}
          <div className={styles["general-info"]}>
            <span className={styles["last-round"]}>
              Round: {user.last_round}
            </span>
            <span className={styles["gold-remaining"]}>
              {user.gold_left}
              <Image src={goldIcon} alt="Gold Icon"></Image>
            </span>
            {/* time alive */}
            <span>Alive: {timeConverter(user.time_eliminated)}</span>
            {/* <span>{user.total_damage_to_players} Damage Dealt</span> */}
          </div>
          {/* augments used in game */}
          {user.augments && (
            <p className={styles.augmentContainer}>
              {user.augments.map((augment) => (
                <>
                  <p
                    className={styles.augment}
                    key={`${augment}_${user.name}_${user.augments.indexOf(
                      augment
                    )}`}
                  >
                    {/* {augment.replace("TFT6_Augment_", "").toLowerCase()} */}
                    {augment}
                  </p>
                  {/* <Image
                  src={`https://raw.communitydragon.org/12.4/game/assets/maps/particles/tft/item_icons/augments/choiceui/${augment
                    .replace("TFT6_Augment_", "")
                    .toLowerCase()}.tft_set6.png`}
                  alt={augment}
                  width={100}
                  height={100}
                ></Image> */}
                </>
              ))}
            </p>
          )}

          {/* traits active */}
          {/* https://raw.communitydragon.org/12.4/game/assets/maps/particles/tft/item_icons/augments/choiceui/celestialblessing1.tft_set6.png */}
          <div className={styles.traitContainer}>
            {user.traits.map((trait) => (
              <div key={`${trait.name}_${user.name}`}>
                {/* convert this to icons */}
                <p className={styles.trait}>
                  {/* Tier {trait.tier_total} {trait.name} */}
                  {/* <span className={styles.trait_unitCount}>
                    {trait.num_units} Units
                  </span> */}
                  {/* {summonerInfoState.traitData[trait.name].icon} */}
                  {summonerInfoState.traitData[trait.name] && (
                    // on hover of this image, show the amount of units activated
                    //  eslint-disable-next-line @next/next/no-img-element
                    <img
                      // key={unit.character_id + user.units.indexOf(unit)}
                      src={`https://raw.communitydragon.org/latest/game/${summonerInfoState.traitData[
                        trait.name
                      ].icon
                        .toLowerCase()
                        .replace("tex", "png")}`}
                      alt={trait.name}
                      className={styles.traitPortrait}
                    />
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* units used */}
          <div className={styles.unitContainer}>
            {user.units.map((unit) => (
              <div
                className={styles.unit}
                key={`${unit.character_id}_${user.name}_${user.units.indexOf(
                  unit
                )}`}
              >
                {!unitsLoaded && unit.character_id.toLowerCase()}
                {/* return unitUrl of the object that matches unit:unit */}

                {Object.keys(unitPortraits).length > 2 && (
                  // <>{unitPortraits[unit.character_id.toLowerCase()]}</>
                  <div className={styles.unitBox}>
                    <>
                      {/* {unit.character_id} */}

                      {/*  eslint-disable-next-line @next/next/no-img-element */}
                      {unitPortraits[unit.character_id.toLowerCase()] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={unit.character_id + user.units.indexOf(unit)}
                          src={unitPortraits[unit.character_id.toLowerCase()]}
                          alt={unit.character_id}
                          // summonerInfoState.championData[unit.character_id].cost
                          className={`${styles.unitPortrait} ${
                            "champion-cost-" +
                            summonerInfoState.championData[unit.character_id]
                              .cost
                          }`}
                        />
                      )}
                    </>
                    {/* could make this on hover instead */}
                    <p className={styles.unitName}>
                      {unit.character_id.split("_")[1]}
                    </p>
                    {/* if item has thieves gloves (id:99), do not iterate over the rest */}
                    <div className={styles.itemBox}>
                      {unit.items.map((item) => (
                        <>
                          {/* {item} */}
                          {summonerInfoState.items[item] && (
                            <>
                              {/* {item} */}
                              {/*  eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                key={
                                  unit.items.indexOf(item) +
                                  unit.character_id +
                                  item
                                }
                                src={`https://raw.communitydragon.org/latest/game/${summonerInfoState.items[
                                  item
                                ].icon
                                  .toLowerCase()
                                  .replace("dds", "png")}`}
                                alt="Logo"
                                className={styles.itemPortrait}
                              />
                            </>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // const summonerGameInfo = <>{usersList}</>;

  const logSummoners = () => {
    console.log(userList);
    console.log(userList.length);
    console.log(sortedUserList);
    console.log(unitPortraits);
    let item = 3;
    // console.log(unitPortraits["tft6_ekko"]);
    // console.log(
    //   summonerInfoState.items.items[item].icon
    //     .toLowerCase()
    //     .replace("dds", "png")
    // );
    console.log(summonerInfoState.items);
    console.log(Object.keys(unitPortraits).length);
    // console.log(sortedUserList)
  };

  return (
    <div>
      {sortedUserList.length == 8 ? (
        <ul className={styles.summonerBox}>{usersList}</ul>
      ) : (
        <CircularProgress></CircularProgress>
      )}

      {/* <button onClick={logSummoners}>Log all summoners</button> */}
    </div>
  );
};
export default RenderSummonerNames;
