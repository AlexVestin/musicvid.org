export default function playbackReducer(
    state = {
        projectFile: "",
        loaded: false
    },
    action
) {
    switch (action.type) {
        case "SET_PROJECT_FILE":
            return { ...state, projectFile: action.payload, laoded: false };
        case "SET_PROJECT_LOADED":
            return { ...state, loaded: action.payload };
        default:
            return state;
    }
}
