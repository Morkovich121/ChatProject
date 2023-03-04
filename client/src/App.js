import { Chat } from './pages/Chat';
import React from 'react';
import { ComponentA } from './utils/hooks/MyFramework/test';
import { render } from './utils/hooks/MyFramework/MyFramework';

import './App.css';

function App() {

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
