export default function errorReducer(state = {
    code: "",
    message: "",
    title: ""

    }, action){

        
        switch(action.type){
            case "SET_FATAL_ERROR":
                    const { code , title, message } = action.payload;
                return { ...state, code, message, title }
   
        default:
            return state
        }
}