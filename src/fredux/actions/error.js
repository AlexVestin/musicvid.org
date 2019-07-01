
import store from '../store'

export function setFatalError(item){
    console.log("FATAL ERROR?", item)
    store.dispatch({
        type: "SET_FATAL_ERROR",
        payload: item
    } 
    );  
}




