import styles from './App.module.css';
import { useState } from 'react';
import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
function App() {



  return (
  <body className= {styles.background}>
    <div>
      <h1 style = {{color: 'rgb(117, 71, 164)', fontSize:100}}>Ha<span style = {{color:'orange'}}>lll</span>alify</h1>
      <SearchBar />

      
    </div>
  </body>
  );
}

export default App;
