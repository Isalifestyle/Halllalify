//Need to figure out when to put {} around imports 
import React from "react"
import styles from './SearchResult.module.css';
import { useState, useContext } from 'react';
import { SearchContext } from "../SearchBar/SearchBar";
import  Playlist  from "../Playlist/Playlist"

export const SearchResultsContext = React.createContext()
const SearchResults = (props) =>
{
   console.log("PROPS:", props)

    const [addResults, setResults] = useState([])
    const {userChoice} = useContext(SearchContext);
      const handleClick = (data) =>
      {
        if (!addResults.some((item) => item.id === data.id)) {
          //NEED TO FIGURE OUT HOW ITEM.ID IS THE ACTUAL ID!!!
          setResults((prev) => [...prev, data]);
        }
      }
    return (
        <div className = {styles.style}>
            <SearchResultsContext.Provider value = {{addResults, setResults}}>
              <div className = {styles.search}>
                <h1 style = {{textAlign: 'center', fontSize:50, color:'white'}}>Search Results | </h1>
                    {Object.values(props.props)?.map((item) => (
                        <React.Fragment key = {item.artists.name}>
                          <div className = {styles.subcontainer}>
                          <div style = {{width: '100px', height:'100px'}}>
                                {item.album.images && item.album.images.length > 0 ? (
                                  <img 
                                    src={item.album.images[0].url} // Use the first image
                                    alt={`${item.name} album cover`} 
                                    style={{ width: "100px", height: "100px" }} // Adjust size as needed
                                  />
                                ) : (
                                  <p style={{ color: "white" }}>No image available</p> // Fallback content
                                )}
                                </div>
                          <div className = {styles.surahinfo}>
                            <div>
                            <h3 style = {{color : 'orange'}}>{item.name}</h3>
                            </div>
                            <div className={styles.artistInfo}>
                              {item.artists?.slice(0, 2).map((artist, index) => (
                                <div key={index} style={{ width: '75px', height: '20px' }}>
                                  <h3 className = {styles.artistName} style={{ color: 'white' }}>{artist.name}</h3>
                                </div>
                              ))}
                              {item.artists?.length > 2 && (
                                <div className = {styles.artistName}style={{ width: '75px', height: '20px' }}>
                                  <h3>And More...</h3>
                                </div>
                              )}
                            </div>
                          </div> 
                        </div>
                          <button onClick = {() => handleClick(item)} >+</button>
                        </React.Fragment>
            
            
                ))}
              </div>
                <Playlist />
            </SearchResultsContext.Provider>
                
        </div>
        
    );
}

export default SearchResults