export default function playbackReducer(state = {
    isAuthenticated: false,
    fetching: true,
    hasLoadedAuthentication: false,
    uid: "",
    username: "",
    email: "",

    }, action){
        switch(action.type){
            case "SET_IS_AUTHENTICATED":
                return {...state, isAuthenticated: action.payload, fetching: false, hasLoadedAuthentication: true}
            case "SET_IS_FETCHING":
                return {...state, fetching: action.payload}
        default:
            return state
        }
}