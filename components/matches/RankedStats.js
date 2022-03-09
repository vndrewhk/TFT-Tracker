import Image from "next/image";
import styles from "./RankedStats.module.css";
import RANKED_ICONS from "../assets/icons/Rank Icons/tft_ranked_icons";

const RankedStats = (props) => {
  console.log("tft_" + props.matchInfo.tier.toLowerCase());
  console.log(RANKED_ICONS["tft_" + props.matchInfo.tier.toLowerCase()]);
  return (
    <>
      <div className={styles["ranked-container"]}>
        <h2>Ranked</h2>
        <div className={styles["ranked-tier"]}>
          <Image
            src={RANKED_ICONS["tft_" + props.matchInfo.tier.toLowerCase()]}
            width={100}
            height={100}
            alt="ranked icon"
            className={styles["ranked-icon"]}
          ></Image>
          <h3>
            Tier: {`${props.matchInfo.tier}`} {props.matchInfo.rank}
          </h3>
        </div>
        <p>LP: {props.matchInfo.leaguePoints}</p>
        <div className={styles["win-loss"]}>
          <div>
            <b>Wins</b>: {props.matchInfo.wins}
          </div>
          <div>
            <b>Losses</b>:{props.matchInfo.losses}
          </div>
        </div>
        <div>
          <b>WR</b>:
          {(props.matchInfo.wins /
            (props.matchInfo.losses + props.matchInfo.wins)) *
            100}
          %
        </div>
      </div>
    </>
  );
};

export default RankedStats;

// dynamically render pages after /summoner/[name]/[region]
//when reaching these pages, useEffect call the api through NewSummoner.js
//return that content and render it
