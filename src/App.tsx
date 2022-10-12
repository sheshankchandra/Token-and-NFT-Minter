import React from 'react';
import './App.css';
import MintToken from './MintToken';
import MintNft from './MintNft';

// import {MuiButton} from './components/MuiButton';

function App() {
  return (
    <div className="App">
      {/* <MuiButton/> */}
      <header className="App-header">
        <MintToken />
        <MintNft />
      </header>
    </div>
  );
}

export default App;
