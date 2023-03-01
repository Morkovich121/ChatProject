import { Chat } from './pages/Chat';
import React from 'react';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className='header'>
        Chat bots 2.0
      </div>
      <div className='main'>
        <Chat />
      </div>
    </div>
  );
}

export default App;
