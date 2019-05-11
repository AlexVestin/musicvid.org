import { createStore, combineReducers } from "redux"
import authReducer from './reducers/auth'
import projReducer from './reducers/project'

const rootReducer = combineReducers({auth: authReducer, project: projReducer})
const store = createStore(
    rootReducer
);

export default store