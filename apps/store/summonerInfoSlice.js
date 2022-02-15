import { createSlice } from "@reduxjs/toolkit";

const initialSummonerState = {
  summonerInfo: {},
  matchIds: [{}],
  matchData: [{}],
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
    replaceMatchIds(state, action) {
      state.matchIds = action.payload.matchIds;
    },
    updateGameMode(state, action) {
      state.gameMode = action.payload.gameMode;
    },
    routerSummoner(state, action) {
      state.routerSummoner = action.payload.routerSummoner;
      state.routerRegion = action.payload.routerRegion;
    },
    updateMatchData(state, action) {
      state.matchData = action.payload.matchData;
    },
  },
});

export const summonerActions = summonerInfoSlice.actions;

export default summonerInfoSlice;
