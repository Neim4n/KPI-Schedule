import {
    SET_FUN_MODE,
    SET_FILTER,
    LOAD_ON,
    LOAD_OFF
} from "./types";

//Actions
export function setFunMode(funMode) {
    localStorage.setItem("funMode", funMode);
    return {
        type: SET_FUN_MODE,
        funMode,
    }
}

export function setFilter(filter) {
    return {
        type: SET_FILTER,
        filter,
    }
}

export function loadOn() {
    return {
        type: LOAD_ON,
    }
}

export function loadOff() {
    return {
        type: LOAD_OFF,
    }
}