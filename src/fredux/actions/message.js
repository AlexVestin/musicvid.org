import store from "../store";

export function setSnackbarMessage(message, variant = "success", time=1000000) {
    store.dispatch({
        type: "SET_MESSAGE",
        payload: {message, variant, time}
    });
}


export function closeSnackbar(item) {
    store.dispatch({
        type: "CLOSE_SNACKBAR",
        payload: item
    });
}
