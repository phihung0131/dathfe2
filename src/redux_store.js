import { configureStore } from "@reduxjs/toolkit";
import appSlicer from "./slicers/appSlicer"

const store = configureStore({
    reducer: {
        appState: appSlicer
    }
})

export default store;