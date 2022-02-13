import { createSlice } from "@reduxjs/toolkit";

const initialSummonerState = {
  summonerInfo: {},
  matchInfo: [{}],
  gameMode: "TFT",
  routerSummoner: "",
  routerRegion: "",
  isLoading: false,
};

const summonerInfoSlice = createSlice({
  name: "summonerSlice",
  initialState: initialSummonerState,
  reducers: {
    replaceSummoner(state, action) {
      state.summonerInfo = action.payload.summonerInfo;
    },
    replaceMatchInfo(state, action) {
      state.matchInfo = action.payload.matchInfo;
    },
    updateGameMode(state, action) {
      state.gameMode = action.payload.gameMode;
    },
    routerSummoner(state, action) {
      state.routerSummoner = action.payload.routerSummoner;
      state.routerRegion = action.payload.routerRegion;
    },
    fetchLoading(state) {
      state.isLoading = !state.isLoading;
    },
  },
});

export const summonerActions = summonerInfoSlice.actions;

export default summonerInfoSlice;

// redux region or summoner name so that it updates and forces refresh of comp
// header function will change redux, and that redux will be passed onto the fetcher
//therefore it MUST UPDATE :DDDD
