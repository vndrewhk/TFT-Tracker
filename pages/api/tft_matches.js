const TFTMatches = async (req, res) => {
  let apiKey = "RGAPI-88770496-6896-4852-b3a3-b2fafc5cd6a8";
  let URL = "https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/";

  let summonerId = req.query.summonerId;
  let requestURL = `${URL}${summonerId}`;

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
