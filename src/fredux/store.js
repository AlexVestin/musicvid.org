import { createStore, combineReducers } from "redux";
import authReducer from "./reducers/auth";
import projReducer from "./reducers/project";
import errReducer from "./reducers/error";
import msgReducer from "./reducers/message";

const rootReducer = combineReducers({
    auth: authReducer,
    project: projReducer,
    error: errReducer,
    message: msgReducer 
});
const store = createStore(rootReducer);

export default store;
