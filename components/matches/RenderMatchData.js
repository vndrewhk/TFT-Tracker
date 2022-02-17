import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { summonerActions } from "../../apps/store/summonerInfoSlice";
import RenderSummonerNames from "./RenderSummonerNames";

const RenderMatchData = () => {
  const summonerInfoState = useSelector((state) => state.summonerInfo);
  const matchData = summonerInfoState.matchData;

  const [puuids, setPuuids] = useState();
  const dispatch = useDispatch();

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
    console.log(gameDate.toString());

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

      //   can map to the render instead of the state

      //   console.log(puuidList);
      return puuidLists;
    };

    // because puuids are so closely linked to the matchdata, should i even put it in redux? the data is already there, intrinsicly

    const puuidList = puuidGrabber(matchData);
    // setPuuids(puuidList);

    // console.log(Object.values(gameDate))
    return { gameTime, gameDate, gameQueue, puuidList };
  };

  const { gameTime, gameDate, gameQueue, puuidList } = convertData(matchData);
  //   console.log(puuidList);
  console.log("rendering");
  const puuidListUpdate = () => {
    setPuuids(puuidList);
  };

  const storePuuids = useCallback(() => {
    //6
    console.log("dispatch");
    dispatch(
      summonerActions.updatePuuids({
        matchPuuids: puuids,
      })
    );
  }, [dispatch, puuids]);

  useEffect(() => {
    storePuuids();
  }, [puuids, storePuuids]);

  const seePuuid = () => {
    console.log(puuids);
    console.log(summonerInfoState.matchPuuids);
  };
  //   need to setup API call to grab each player and return summoner name
  return (
    <>
      <h1>Match Data for Match {matchData.metadata.match_id}</h1>
      <h2>Date: {gameDate.toString()}</h2>
      <h2>Game Length: {gameTime}</h2>
      <h3>Game Type: {gameQueue}</h3>
      {puuids && <RenderSummonerNames></RenderSummonerNames>}
      <button onClick={seePuuid}>see puuids</button>
      <button onClick={puuidListUpdate}> puuid update</button>
      <button onClick={storePuuids}> Manually store puuid</button>
      {/* <h2>Game Remainder: {gameRemainder}</h2> */}
    </>
  );
};
export default RenderMatchData;
