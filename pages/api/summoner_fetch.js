const SummonerFetch = async (req, res) => {
  let apiKey = "RGAPI-74d28b70-58e7-4615-bc75-db3cb1cb73af";
  let URL = "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/";
  let requestURL;

  //could make a prefix as the urls are similar
  //api prefix up to tft is the same
  //environment variable file
  //its like plugging variables into the application
  //key service, encrypted somewhere, on deployment time, injected into application

  //make a helper function and then pass in common parameters based off of that

  let summonerName = req.query.summonerName;
  let requestType = req.query.requestType;
  let region = req.query.region.toLowerCase();
  // console.log("fetch file triggered");

  // // if (req.method === "GET") {
  URL = `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/`;
  requestURL = `${URL}${summonerName}`;

  // requestURL = `${URL}Voidlapse`;
  // summonerName = req.body.summonerName;
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
      const data = await responseData.json();

      res.status(200).json({ data });
    }
  } catch (err) {
    res.status(200).json({ message: "err" });
    console.log(err);
    return err;
  }
};

export default SummonerFetch;
