import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RenderSummonerNames = () => {
  // probably shouldnt use redux, because state for each match should be individual
  //   will need to rework to not use redux
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const [userList, setUserList] = useState([]);
  const puuidList = summonerInfoState.matchPuuids;

  const grabAllSummoners = () => {
    setUserList([]);
    puuidList.map((puuid) => getSummonerByPUUID(puuid));
  };
  const getSummonerByPUUID = async (puuid) => {
    try {
      const response = await fetch(`/api/getByPUUID?puuid=${puuid}`);
      const userDetails = await response.json();

      setUserList((prevState) => [...prevState, userDetails.userInfo]);
    } catch (err) {
      console.log(err);
    }
    // setSuccess(true);
  };

  //   useEffect(() => {
  //     getSummonerByPUUID;
  //   }, []);

  const summonerList = () => {
    userList.map((user) => (
      <>
        <h2>
          {user.gameName}
          {user.tagLine}
        </h2>
      </>
    ));
  };

  const listSummoners = () => {
    console.log(userList);
  };

  return (
    <>
      <ul>
        {userList.map((user) => (
          <>
            <h2 key={user.puuid}>
              {user.gameName}#{user.tagLine}
            </h2>
          </>
        ))}
      </ul>
      <button onClick={grabAllSummoners}>Grab all summoners</button>
      <button onClick={listSummoners}>List all summoners</button>
    </>
  );
};
export default RenderSummonerNames;
