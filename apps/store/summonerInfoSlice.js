import { createSlice } from "@reduxjs/toolkit";

const initialSummonerState = {
  summonerInfo: {},
  matchIds: [],
  matchData: [{}],
  matchPuuids: [],
  requestPuuid: "",
  gameMode: "TFT",
  routerSummoner: "",
  routerRegion: "",
  isLoading: false,
  success: false,
  items: {},
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
    updatePuuids(state, action) {
      state.matchPuuids = action.payload.matchPuuids;
    },
    toggleSuccess(state, action) {
      state.success = action.payload.success;
    },
    replaceRequestPuuid(state, action) {
      state.requestPuuid = action.payload.requestPuuid;
    },
    updateItems(state, action) {
      state.items = action.payload.items;
    },
  },
});

export const summonerActions = summonerInfoSlice.actions;

export default summonerInfoSlice;
