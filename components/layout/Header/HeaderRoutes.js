import Button from "@mui/material/Button";
import styles from "./header-routes.module.css";
import { Box } from "@mui/system";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { summonerActions } from "../../../apps/store/summonerInfoSlice";

// when searched, <Link> to the page that you searched for, that page will automatically render and fetch the info for the summoner/display it
// dont need to pass info bc everything will be in the query page

//the component that renders the info will grab all necessary info FROM the URL entered
//no need for global state

// redux region or summoner name so that it uupdates and forces refresh of comp
// header function will change redux, and that redux will be passed onto the fetcher
//therefore it MUST UPDATE :DDDD

const HeaderRoutes = (props) => {
  const [region, setRegion] = useState("NA1");
  const [summonerName, setSummonerName] = useState("");

  const summonerRef = useRef();

  const router = useRouter();

  const summonerChangeHandler = (e) => {
    setSummonerName(e.target.value);
  };
  const regionChangeHandler = (e) => {
    setRegion(e.target.value);
  };

  const dispatch = useDispatch();
  const summonerInfoState = useSelector((state) => state.summonerInfo);

  const updateSummonerRedux = () => {
    dispatch(
      summonerActions.routerSummoner({
        routerSummoner: summonerName,
        routerRegion: region,
      })
    );
  };

  // because the header is ALWAYS on the page, this is a valid solution
  const setSummonerRedux = useCallback(() => {
    dispatch(
      summonerActions.routerSummoner({
        routerSummoner: router.query.summonerName,
        routerRegion: router.query.region,
      })
    );
  }, [dispatch, router.query.region, router.query.summonerName]);

  useEffect(() => {
    setSummonerRedux();
  }, [setSummonerRedux]);

  const redirectHandler = (e) => {
    e.preventDefault();

    updateSummonerRedux();
    router.push(`/tft/${region}/${summonerName}`);
  };

  return (
    <div className={styles.searchBox}>
      <form onSubmit={redirectHandler}>
        <Box>
          <TextField
            id="input-with-sx"
            sx={{ backgroundColor: "white" }}
            label="Summoner Name"
            variant="standard"
            inputRef={summonerRef}
            onChange={summonerChangeHandler}
          />
        </Box>
      </form>
      <FormControl>
        <InputLabel id="region"> Region </InputLabel>
        <Select
          labelId="region-select-label"
          id="region-simple-select"
          value={region}
          label="Region"
          onChange={regionChangeHandler}
          sx={{ backgroundColor: "white" }}
        >
          <MenuItem value={"NA1"}>NA1</MenuItem>
          <MenuItem value={"EUW1"}>EUW1</MenuItem>
          <MenuItem value={"EUN1"}>EUN1</MenuItem>
          <MenuItem value={"KR"}>KR</MenuItem>
          <MenuItem value={"LA1"}>LA1</MenuItem>
          <MenuItem value={"LA2"}>LA2</MenuItem>
          <MenuItem value={"BR1"}>BR1</MenuItem>
          <MenuItem value={"OC1"}>OC1</MenuItem>
          <MenuItem value={"RU"}>RU</MenuItem>
          <MenuItem value={"TR1"}>TR1</MenuItem>
          <MenuItem value={"JP1"}>JP1</MenuItem>
        </Select>
      </FormControl>
      <Button
        sx={{
          "&:hover": {
            color: "rgb(214, 214, 214)",
            backgroundColor: "#3d9185",
          },
          color: "rgb(0,0,0)",
          fontFamily:
            'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;',
          backgroundColor: "#1ad1b9",
          marginRight: "5px",
        }}
        onClick={redirectHandler}
        variant="contained"
      >
        Search
      </Button>
    </div>
  );
};

export default HeaderRoutes;
