import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RenderSummonerNames from "./RenderSummonerNames";
import styles from "./RenderMatchData.module.css";

const RenderMatchData = (props) => {
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const matchData = props.matchData;

  const [puuids, setPuuids] = useState();

  //   parses data and converts to readable format
  const convertData = (matchData) => {
    //   converts time into minute and seconds
    const gameMinutes = Math.floor(matchData.info.game_length / 60);
    const gameSeconds = Math.round(matchData.info.game_length % 60);
    const gameTime = `${gameMinutes}m${gameSeconds}s`;

    //converts unix time to standard time
    const gameDate = new Date(matchData.info.game_datetime);
    // should be altered to make more readable, currently in format of:
    // Sun Feb 13 2022 01:43:58 GMT-0500 (Eastern Standard Time)

    //converts queue_id & tft_game_type to string (1090->TFT Game)

    const queueConverter = (matchDataInfo) => {
      switch (matchDataInfo.tft_game_type) {
        case "standard":
          switch (matchDataInfo.queue_id) {
            case 1090:
              gameQueue = "Normal TFT";
              break;
            case 1100:
              gameQueue = "Ranked TFT";
              break;
          }
          break;

        case "turbo":
          gameQueue = "Hyper Roll TFT";
      }
      return gameQueue;
    };
    const gameQueue = queueConverter(matchData.info);

    const puuidGrabber = (matchData) => {
      // its because THIS IS BEING IPDATED LIKER 2913084281903 TIMES MAN FK
      let puuidLists = matchData.info.participants.map(
        (summoner) => summoner.puuid
      );

      return puuidLists;
    };

    const puuidList = puuidGrabber(matchData);

    const participantInfo = matchData.info.participants.filter(
      (participant) => participant.puuid == summonerInfoState.summonerInfo.puuid
    );
    return { gameTime, gameDate, gameQueue, puuidList, participantInfo };
  };

  const { gameTime, gameDate, gameQueue, puuidList, participantInfo } =
    convertData(matchData);
  console.log("rendering");

  // const puuidListUpdate = () => {
  //   setPuuids(puuidList);
  // };

  console.log(matchData)
  // const storePuuids = useCallback(() => {
  //   console.log("dispatch");
  //   dispatch(
  //     summonerActions.updatePuuids({
  //       matchPuuids: puuids,
  //     })
  //   );
  // }, [dispatch, puuids]);

  const seePuuid = () => {
    
    console.log(puuids);
    console.log(summonerInfoState.matchPuuids);
    console.log(matchData.info.participants);
  };

  return (
    <div className = {styles.matchBox}>
      {/* <h1>Match {matchData.metadata.match_id}</h1> */}
      <h2>Date: {gameDate.toString()}</h2>
      <h2>Game Length: {gameTime}</h2>
      <h3>Placed: {participantInfo[0].placement}</h3>
      <h3>Game Type: {gameQueue}</h3>
      {
        <RenderSummonerNames
          participants={matchData.info.participants}
        ></RenderSummonerNames>
      }
      {/* <button onClick={seePuuid}>see puuids</button> */}
      {/* <button onClick={puuidListUpdate}> puuid update</button> */}
      {/* <button onClick={storePuuids}> Manually store puuid</button> */}
    </div>
  );
};
export default RenderMatchData;
