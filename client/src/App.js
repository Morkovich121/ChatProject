import { Chat } from './pages/Chat';
import React from 'react';
import { ComponentA } from './utils/hooks/MyFramework/test';
import { render } from './utils/hooks/MyFramework/MyFramework';

import './App.css';

function App() {

  const root = () => {
      return ComponentA(3)
  }
  console.log(render(root) === 'ComponentA state 3 ComponentB state 5 ComponentB state 8')
  console.log('--------------')
  console.log(render(root) === 'ComponentA state 4 ComponentB state 10 ComponentB state 16')
  console.log('--------------')
  console.log(render(root) === 'ComponentA state 5 ComponentB state 15 ComponentB state 24')
  console.log('--------------')
  console.log(render(root) === 'ComponentA state 6 ComponentB state 20 ComponentB state 32')
  console.log('--------------')
  console.log(render(root) === 'ComponentA state 7 ComponentB state 25 ComponentB state 40')

  return (
    <div className="App">
      <div className='header'>
        Chat bots 2.0
      </div>
      <div className='main' id='main'>
        <Chat />
      </div>
    </div>
  );
}

export default App;
