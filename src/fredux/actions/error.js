import store from "../store";

export function setFatalError(item) {
    store.dispatch({
        type: "SET_FATAL_ERROR",
        payload: item
    });
}
