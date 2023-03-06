let currentState = 0;
let state = [];

export const useState = (initialState) => {

    const id = currentState;
    currentState++;

    if (state[id] === undefined) {
        state[id] = initialState;
    }

    const setState = (newState) => {
        state[id] = newState;
    };

    return [state[id], setState];
};

export const render = (component) => {
    currentState = 0;
    return component();
};