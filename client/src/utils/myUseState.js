import React from 'react';

export default function MyUseState(initialValue) {
  const [state, setState] = React.useState(initialValue);

  const setStateWithCallbacks = React.useCallback((newState) => {
    setState(newState);
  }, []);

  return [state, setStateWithCallbacks];
}
