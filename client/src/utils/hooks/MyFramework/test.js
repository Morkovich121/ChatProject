import { MyUseState, render } from "./MyFramework";

export const ComponentB = (prop) => {
    const [state, setState] = MyUseState(prop);
    const res = `ComponentB state ${state}`
    setState(state + prop)
    return res
}
export const ComponentA = (prop) => {
    const [state, setState] = MyUseState(prop);
    const res = `ComponentA state ${state} ${ComponentB(5)} ${ComponentB(8)}`
    setState(prop + 1)
    return res;
}

// const root = () => {
//     return ComponentA(3)
// }
// console.log(render(root) === 'ComponentA state 3 ComponentB state 5 ComponentB state 8')
// console.log('--------------')
// console.log(render(root) === 'ComponentA state 4 ComponentB state 10 ComponentB state 16')
// console.log('--------------')
// console.log(render(root) === 'ComponentA state 5 ComponentB state 15 ComponentB state 24')
// console.log('--------------')
// console.log(render(root) === 'ComponentA state 6 ComponentB state 20 ComponentB state 32')
// console.log('--------------')
// console.log(render(root) === 'ComponentA state 7 ComponentB state 25 ComponentB state 40')