const SummonerFetch = async (req, res) => {
   let apiKey = "RGAPI-b9c62b31-effc-4236-a30a-24a3d55545e3";
  let URL = "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/";
  let requestURL;
  
  let summonerName = req.query.summonerName;
  // console.log("fetch file triggered");

  // // if (req.method === "GET") {
  requestURL = `${URL}${summonerName}`;
  // requestURL = `${URL}Voidlapse`;
  // summonerName = req.body.summonerName;
  try {
    const responseData = await fetch(
      requestURL,
      {
        headers: {
          "X-Riot-Token": apiKey,
        },
      }
    );

    if (!responseData.ok) {
      res.status(200).json({ message: "!ok" });
      throw new Error("Something went wrong!");
    }
    if (responseData.ok) {
      const data = await responseData.json();
      console.log(data);
      res.status(200).json({ data });
      return data;
    }
  } catch (err) {
    res.status(200).json({ message: "err" });
    console.log(err);
    return err;
  }
};

export default SummonerFetch;
