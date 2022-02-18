import { useCallback, useEffect, useState } from "react";

const RenderSummonerNames = (props) => {
  const [sortedUserList, setSortedUserList] = useState([]);
  const [userList, setUserList] = useState([]);

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

  const listSummoners = () => {
    console.log(userList);
    console.log(sortedUserList);
  };

  const sortPlayers = useCallback(() => {
    let tempPlayers = userList.slice();
    setSortedUserList(tempPlayers.sort(dynamicSort("placement")));
  }, [userList]);

  useEffect(() => {
    sortPlayers();
  }, [sortPlayers, userList]);

  return (
    <>
      {/* in the future, will be replaced by a component which shows icon/etc etc */}
      <ul>
        {sortedUserList.map((user) => (
          <li key={user.puuid}>
            <p>
            <span>{user.placement}</span> {user.gameName}#{user.tagLine}
            {/* onClick -> router.push(/{region}/{user.gameName}) */}
            </p>
           
          </li>
        ))}
      </ul>
      <button onClick={grabAllSummoners}>Grab all summoners</button>
      <button onClick={listSummoners}>List all summoners</button>
    </>
  );
};
export default RenderSummonerNames;
