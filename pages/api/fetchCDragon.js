"https://raw.communitydragon.org/latest/game/data/characters/tft6_ahri/tft6_ahri.bin.json";

const fetchCDragon = async (req, res) => {
  let URL = "https://raw.communitydragon.org/latest/game/data/characters/";

  let unit = req.query.unit;
  let requestURL = `${URL}${unit}/${unit}.bin.json`;

  try {
    const responseData = await fetch(requestURL);

    if (!responseData.ok) {
      res.status(201).json({ message: "!ok" });
      throw new Error("Something went wrong!");
    }
    if (responseData.ok) {
      const unitInfo = await responseData.json();

      console.log(unitInfo);
      //res status is the one that returns the info

      res.status(200).json({ unitInfo });
      // res.status(200).json({requestType})
      //return matchInfo doesnt do anything
    }
  } catch (err) {
    // res.status(200).json({ message: "err" });
    console.log(err);
    return err;
  }
  res.end();
};

export default fetchCDragon;
