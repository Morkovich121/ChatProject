import React from 'react';

//Моя реализация useState. В данном случае useState и useCallback нужны лишь для перерисовки компонента
//Так как они напрямую перерисовывают компонент

function MyUseState(initialValue) {
    const stateRef = React.useRef(initialValue);

    const setState = (newValue) => {
        stateRef.current = newValue;
        forceUpdate();
    };

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    return [stateRef.current, setState];
}

export default MyUseState;