const TFTMatches = async (req, res) => {
  let apiKey = "RGAPI-e214c86c-a32c-4ea0-bc9f-7d5ec024902e";
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

      //res status is the one that returns the info

      res.status(200).json({ matchInfo });
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

export default TFTMatches;
