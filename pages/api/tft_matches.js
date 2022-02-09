const TFTMatches = async (req, res) => {
  let apiKey = "RGAPI-b9c62b31-effc-4236-a30a-24a3d55545e3";
  let URL = "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/";
  let requestURL;
  let summonerId = req.query.summonerId;
  requestURL = `${URL}${summonerId}`;

  try {
    const responseData = await fetch(requestURL, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    if (!responseData.ok) {
      res.status(200).json({ message: "!ok" });
      throw new Error("Something went wrong!");
    }
    if (responseData.ok) {
      const matchInfo = await responseData.json();
 

      console.log(matchInfo);
      res.status(200).json({ matchInfo });
      // res.status(200).json({requestType})
      return matchInfo;
    }
  } catch (err) {
    res.status(200).json({ message: "err" });
    console.log(err);
    return err;
  }
};

export default TFTMatches;
