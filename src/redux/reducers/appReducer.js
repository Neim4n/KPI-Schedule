import {
    SET_FUN_MODE,
    SET_FILTER,
    LOAD_ON,
    LOAD_OFF
} from "../types";

const initialState = {
    funMode: JSON.parse(localStorage.getItem("funMode")) || false,
    filter: "",
    isLoaded: false,
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FUN_MODE:
            return {
                ...state,
                funMode: action.funMode,
            }
        case SET_FILTER:
            return {
                ...state,
                filter: action.filter,
            }
        case LOAD_ON:
            return {
                ...state,
                isLoaded: false,
            }
        case LOAD_OFF:
            return {
                ...state,
                isLoaded: true,
            }
        default:
            return state;
    }
}