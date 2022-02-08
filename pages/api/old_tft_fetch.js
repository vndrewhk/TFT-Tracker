// const TFTFetch = () => {
//     let apiKey = "RGAPI-b9c62b31-effc-4236-a30a-24a3d55545e3";
//     let URL = "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/";
//     let requestURL;
//     let summonerName;
//     console.log("fetch file triggered");
//     const handler = async (req, res) => {
//       console.log("handler triggered");
//       // if (req.method === "GET") {
//       // requestURL = `${URL}${summonerName}`;
//       requestURL = `${URL}Voidlapse`;
//       summonerName = req.summonerName;
//       try {
//         const responseData = await fetch(requestURL, {
//           method: "GET",
//           header: {
//             "User-Agent":
//               "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0",
//             "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
//             "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
//             Origin: "https://developer.riotgames.com",
//             "X-Riot-Token": "RGAPI-b9c62b31-effc-4236-a30a-24a3d55545e3",
//           },
//         });
  
//         if (!responseData.ok) {
//           throw new Error("Something went wrong!");
//         }
//         if (responseData.ok) {
//           const data = responseData.json();
//           console.log(data);
//           return data;
//         }
//       } catch (err) {
//         console.log(err);
//       }
//       // }
//     };
  
//     handler();
//   };
  
//   export default TFTFetch;
  