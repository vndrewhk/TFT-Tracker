import { configureStore } from "@reduxjs/toolkit";
import summonerInfoSlice from "./summonerInfoSlice";
const store = configureStore({
  reducer: { summonerInfo: summonerInfoSlice.reducer },
});

export default store;
