import { CircularProgress } from "@mui/material";
import { style } from "@mui/system";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import fetchCDragon from "../../pages/api/fetchCDragon";
import styles from "./RenderSummonerNames.module.css";
const RenderSummonerNames = (props) => {
  const [sortedUserList, setSortedUserList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [augmentPortraits, setAugmentPortraits] = useState([]);
  const [traitPortraits, setTraitPortraits] = useState([]);
  const [unitPortraits, setUnitPortraits] = useState([]);
  const [unitsFetched, setUnitsFetched] = useState(false);

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

  console.log("render cycle");
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
  let tempUnits = [];
  const unitImageHandler = async (unit) => {
    const unitInfo = await fetchUnitInfo(unit);
    for (const hash in unitInfo.unitInfo) {
      // console.log(unitInfo.unitInfo[hash]);
      for (const key in unitInfo.unitInfo[hash]) {
        if (key === "PortraitIcon") {
          let unitObj = {};
          unitObj[
            unit
          ] = `https://raw.communitydragon.org/latest/game/${unitInfo.unitInfo[
            hash
          ][key]
            .toLowerCase()
            .replace("dds", "png")}`;
          // console.log(tempUnits.indexOf(unitObj));
          if (tempUnits.indexOf(unitObj) === -1) {
            tempUnits.push(unitObj);
          }
        }
      }
    }
    // console.log(tempUnits);
    setUnitPortraits(tempUnits);
  };

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
    <>
      {sortedUserList.map((user) => (
        <p key={user.puuid}>
          {/* summoner names of each player */}
          <li className={styles.userList}>
            <h4>
              <span>{user.placement}</span> {user.gameName}#{user.tagLine}
              {/* onClick -> router.push(/{region}/{user.gameName}) */}
            </h4>
          </li>

          {/* general info */}
          <p>Round: {user.last_round}</p>
          <span>{user.gold_left} GOLD Remaining, </span>
          <span>{user.total_damage_to_players} Damage Dealt</span>

          {/* augments used in game */}
          <p className={styles.augmentContainer}>
            {user.augments.map((augment) => (
              <>
                <p
                  className={styles.augment}
                  key={`${augment}_${user.gameName}_${user.augments.indexOf(
                    augment
                  )}`}
                >
                  {augment.replace("TFT6_Augment_", "").toLowerCase()}
                </p>
                <Image
                  src={`https://raw.communitydragon.org/12.4/game/assets/maps/particles/tft/item_icons/augments/choiceui/${augment
                    .replace("TFT6_Augment_", "")
                    .toLowerCase()}.tft_set6.png`}
                  alt={augment}
                  width={100}
                  height={100}
                ></Image>
              </>
            ))}
          </p>

          {/* traits active */}
          {/* https://raw.communitydragon.org/12.4/game/assets/maps/particles/tft/item_icons/augments/choiceui/celestialblessing1.tft_set6.png */}
          <p className={styles.traitContainer}>
            {user.traits.map((trait) => (
              <p key={`${trait.name}_${user.gameName}`}>
                {/* convert this to icons */}
                <p className={styles.trait}>
                  Tier {trait.tier_total} {trait.name}
                  <p className={styles.trait_unitCount}>
                    {trait.num_units} Units
                  </p>
                </p>
              </p>
            ))}
          </p>

          {/* units used */}
          <p className={styles.unitContainer}>
            {user.units.map((unit) => (
              <p
                className={styles.unit}
                key={`${unit.character_id}_${
                  user.gameName
                }_${user.units.indexOf(unit)}`}
              >
                {unit.character_id.toLowerCase()}

                {/* {unitImageHandler(unit.character_id.toLowerCase())} */}
                {/* <Image
                  src={`https://raw.communitydragon.org/latest/game/assets/characters/${unit.character_id.toLowerCase()}/hud/${unit.character_id.toLowerCase()}.tft_set6_stage2.png`}
                  alt={unit.character_id}
                  width={50}
                  height={50}
                ></Image> */}
              </p>
            ))}
          </p>

          {/* time alive */}
          <span>
            <p>Time Eliminated</p>
            <p>{timeConverter(user.time_eliminated)}</p>
          </span>
        </p>
      ))}
    </>
  );

  // const summonerGameInfo = <>{usersList}</>;

  const logSummoners = () => {
    console.log(userList);
    console.log(userList.length);
    console.log(sortedUserList);
    console.log(unitPortraits);
    // console.log(sortedUserList)
  };

  return (
    <>
      <button onClick={unitImageHandler.bind(null, "tft6_ahri")}>fetch</button>
      {/* in the future, will be replaced by a component which shows icon/etc etc */}
      {sortedUserList.length == 8 ? (
        <ul className={styles.summonerBox}>{usersList}</ul>
      ) : (
        <CircularProgress></CircularProgress>
      )}
      {/* <Image
        src="https://raw.communitydragon.org/latest/game/assets/characters/tft6_nocturne/hud/tft6_nocturne.tft_set6_stage2.png"
        alt="Picture of the author"
        width={50}
        height={50}
      ></Image> */}

      <button onClick={logSummoners}>Log all summoners</button>
    </>
  );
};
export default RenderSummonerNames;
