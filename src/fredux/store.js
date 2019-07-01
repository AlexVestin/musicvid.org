import { createStore, combineReducers } from "redux"
import authReducer from './reducers/auth'
import projReducer from './reducers/project'
import errReducer from './reducers/error'


const rootReducer = combineReducers({auth: authReducer, project: projReducer, error: errReducer})
const store = createStore(
    rootReducer
);

export default store