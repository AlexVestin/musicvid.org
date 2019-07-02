export default function errorReducer(state = {
    message: "",
    open: false,
    variant: "success",
    time: 100000000
    
    }, action){
        switch(action.type){
            case "SET_MESSAGE":
                const {variant, message, time} = action.payload;
                return { ...state, message, variant, time, open: true }
            case "CLOSE_SNACKBAR":
                return { ...state, open: false }
   
        default:
            return state
        }
}