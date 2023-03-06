import { useState } from "./MyFramework";

export const ComponentB = (prop) => {
    const [state, setState] = useState(prop);
    const res = `ComponentB state ${state}`
    setState(state + prop)
    return res
}
export const ComponentA = (prop) => {
    const [state, setState] = useState(prop);
    const res = `ComponentA state ${state} ${ComponentB(5)} ${ComponentB(8)}`
    setState(state + 1)
    return res;
}

