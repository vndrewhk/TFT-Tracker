import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import styles from "./RenderSummonerNames.module.css";
const RenderSummonerNames = (props) => {
  const [sortedUserList, setSortedUserList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [success, setSuccess] = useState(false);

  // map, then store in a var, then setstate once?

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

  const usersList = (
    <>
      {sortedUserList.map((user) => (
        <li key={user.puuid}>
          <p>
            <span>{user.placement}</span> {user.gameName}#{user.tagLine}
            {/* onClick -> router.push(/{region}/{user.gameName}) */}
          </p>
        </li>
      ))}
    </>
  );

  const logSummoners = () => {
    console.log(userList);
    console.log(userList.length);
    console.log(sortedUserList);
  };

  return (
    <>
      {/* in the future, will be replaced by a component which shows icon/etc etc */}
      {sortedUserList.length == 8 ? (
        <ul className={styles.summonerBox}>{usersList}</ul>
      ) :<CircularProgress></CircularProgress>}

      {/* <button onClick={logSummoners}>Log all summoners</button> */}
    </>
  );
};
export default RenderSummonerNames;
