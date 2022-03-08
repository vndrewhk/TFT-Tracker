import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./RenderMiniSummoner.module.css";
const RenderMiniSummoner = (props) => {
  const [sortedUserList, setSortedUserList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [augmentPortraits, setAugmentPortraits] = useState([]);
  const [unitsLoaded, setUnitsLoaded] = useState(false);
  const [traitPortraits, setTraitPortraits] = useState([]);
  const [unitPortraits, setUnitPortraits] = useState([]);
  const [unitsFetched, setUnitsFetched] = useState(false);

  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const matchData = props.matchData;

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
  // better to actually use a json of every champion and filter through it

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

  if (sortedUserList.length === 8 && !unitsFetched) {
    for (let i = 0; i < sortedUserList.length; i++) {
      if (sortedUserList[i].puuid === summonerInfoState.summonerInfo.puuid) {
        for (let j = 0; j < sortedUserList[i].units.length; j++) {
          // console.log(sortedUserList[i].units[j].character_id.toLowerCase());

          unitImageHandler(
            sortedUserList[i].units[j].character_id.toLowerCase()
          );
        }
      }
    }
    setUnitsFetched(true);
  }

  const userNames = (
    <div className={styles["mini-user-list"]}>
      {sortedUserList.map((user) => (
        <div key={`${user.puuid}_mininame`}>
          <p className={styles["mini-user"]}>{user.name}</p>
        </div>
      ))}
    </div>
  );

  const miniUser = (
    <>
      {userList
        .filter((user) => user.puuid === summonerInfoState.summonerInfo.puuid)
        .map((user) => (
          <div key={`${user.puuid}_mini`}>
            {/* <p>{user.name}</p> */}
            <div className={styles.unitContainer}>
              {user.units.map((unit) => (
                <div
                  className={styles.unit}
                  key={`${unit.character_id}_${user.name}_${user.units.indexOf(
                    unit
                  )}`}
                >
                  {/* return unitUrl of the object that matches unit:unit */}
                  {!unitsLoaded && <CircularProgress></CircularProgress>}
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
    </>
  );

  const logInfo = () => {
    // console.log(summonerInfoState.summonerInfo);
    console.log(props.participants);
    console.log(
      userList.filter(
        (user) => user.puuid == summonerInfoState.summonerInfo.puuid
      )
    );
  };

  return (
    <div className={styles["mini-match-preview"]}>
      {userNames}
      {miniUser} <button onClick={logInfo}>XX</button>
    </div>
  );
};

export default RenderMiniSummoner;
