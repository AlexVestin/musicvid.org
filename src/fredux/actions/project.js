
import store from '../store'

export function setProjectFile(item){
    store.dispatch({
        type: "SET_PROJECT_FILE",
        payload: item
        } 
    );  
}
