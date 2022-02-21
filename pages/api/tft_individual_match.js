import API_KEY from "./API_key";

const TFTIndividualMatch = async (req, res) => {
  let apiKey = "RGAPI-06131427-0db4-41c7-99ba-bdbf71b99e8e";
  let URL = "https://americas.api.riotgames.com/tft/match/v1/matches/";
  //   b2_-gkNZhsVXT_1nTbcTWaGD0HcDvUhXffYuQYcLZxu0AwE4VAR3teWyakfuxUIeWUoQ8ugLtnZvzw/ids?count=20

  let matchId = req.query.matchId;
  let requestURL = `${URL}${matchId}`;
  try {
    const responseData = await fetch(requestURL, {
      headers: {
        "X-Riot-Token": API_KEY,
      },
    });

    if (!responseData.ok) {
      res.status(201).json({ message: "!ok" });
      throw new Error("Something went wrong!");
    }
    if (responseData.ok) {
      const matchData = await responseData.json();

      //res status is the one that returns the info

      res.status(200).json({ matchData });
      // res.status(200).json({requestType})
      //return matchInfo doesnt do anything
    }
  } catch (err) {
    res.status(200).json({ message: "err" });
    console.log(err);
    return err;
  }
  res.end();
};

export default TFTIndividualMatch;
