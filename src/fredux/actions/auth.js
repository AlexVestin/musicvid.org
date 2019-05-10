
import store from '../store'

export function setIsAuthenticated(item){
    store.dispatch({
        type: "SET_IS_AUTHENTICATED",
        payload: item
        } 
    );  
}


export function setIsFetching(item){
    store.dispatch({
        type: "SET_IS_FETCHING",
        payload: item
        } 
    );  
}