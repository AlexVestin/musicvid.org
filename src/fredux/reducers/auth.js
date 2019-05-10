export default function playbackReducer(state = {
    isAuthenticated: false,
    fetching: true,

    }, action){
        switch(action.type){
            case "SET_IS_AUTHENTICATED":
                return {...state, isAuthenticated: action.payload, fetching: false}
            case "SET_IS_FETCHING":
                return {...state, fetching: action.payload}
        default:
            return state
        }
}