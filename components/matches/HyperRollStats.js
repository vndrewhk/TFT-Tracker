import Image from "next/image";
import HYPER_ICONS from "../assets/icons/Hyper Roll Icons/HYPER_ICONS";
import styles from "./HyperRollStats.module.css";

const HyperRollStats = (props) => {
  // const tiers = {
  //   grey: 0,
  //   green: 1400,
  //   blue: 2600,
  //   purple: 3400,
  //   hyper: 4200,
  // };

  let playerTier;
  if (props.matchInfo.ratedRating < 1400) {
    playerTier = "grey";
  } else if (props.matchInfo.ratedRating < 2600) {
    playerTier = "green";
  } else if (props.matchInfo.ratedRating < 3400) {
    playerTier = "blue";
  } else if (props.matchInfo.ratedRating < 4200) {
    playerTier = "purple";
  } else if (props.matchInfo.ratedRating >= 4200) {
    playerTier = "hyper";
  }

  return (
    <>
      <div className={styles["ranked-container"]}>
        <h2>Hyper Roll</h2>

        <div className={styles["ranked-tier"]}>
          <Image
            src={HYPER_ICONS[playerTier]}
            width={100}
            height={100}
            alt="hyper roll tier icon"
            className={styles["ranked-icon"]}
          ></Image>
          <h3>Tier: {playerTier.toUpperCase()}</h3>
        </div>

        <p>LP: {props.matchInfo.ratedRating}</p>

        <div className={styles["win-loss"]}>
          <div>
            <b>Wins</b>: {props.matchInfo.wins}
          </div>
          <div>
            <b>Losses</b>:{props.matchInfo.losses}
          </div>
        </div>
      </div>
    </>
  );
};

export default HyperRollStats;

// dynamically render pages after /summoner/[name]/[region]
//when reaching these pages, useEffect call the api through NewSummoner.js
//return that content and render it
