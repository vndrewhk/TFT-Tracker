import { useState } from "react";
import { useSelector } from "react-redux";
import RenderMiniSummoner from "./RenderMiniSummoner";
import styles from "./RenderMiniMatch.module.css";
const RenderMiniMatch = (props) => {
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

  return (
    <div>
      <div className={styles["info-box"]}>
        {/* <p className={styles["general-info"]}>Date: {gameDate.toString()}</p> */}
        <p className={styles["general-info"]}>
          Placed: <b>{participantInfo[0].placement}</b>
        </p>

        <b className={styles["general-info"]}>{gameQueue}</b>
        <p className={styles["general-info"]}>{gameTime}</p>
      </div>
      <RenderMiniSummoner
        key={matchData.metadata.match_id + "_mini"}
        participants={matchData.info.participants}
      ></RenderMiniSummoner>
    </div>
  );
};

export default RenderMiniMatch;
