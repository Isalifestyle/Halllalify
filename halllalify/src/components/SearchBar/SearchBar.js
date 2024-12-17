import styles from './SearchBar.module.css';
import { useState, createContext } from 'react';
import SearchResults from '../SearchResults/SearchResults';

export const SearchContext = createContext()
const SearchBar = () =>
{
    const [userChoice, setUserChoice] = useState('');
    const [searchResults, setSearchResults] = useState('')


    const searchSpotify = async (query) => {
        const clientId = "9a668d8e6d9c4bfaa7b9814efdd2e399";
        const clientSecret = "585bce0ac0464c948a9c217a5634b5cb";
      
        // Step 1: Get Access Token
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const credentials = btoa(`${clientId}:${clientSecret}`); // Base64 encoding
        const tokenResponse = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${credentials}`,
          },
          body: "grant_type=client_credentials",
        });
      
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
      
        // Step 2: Use the Access Token to Search Spotify
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track`;
        const searchResponse = await fetch(searchUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      
        const searchData = await searchResponse.json();
        return searchData.tracks.items; 
      };

      const handleSearch = async (query) => {
        if (!query.trim()) {
          setSearchResults([]); 
          return;
        }
        const results = await searchSpotify(query); // Call the API function
        console.log(results); // Inspect the results
        setSearchResults(results); // Update your state with the search results
      };
      
      

    return (
        <div >
            <SearchContext.Provider value = {{userChoice, setUserChoice}}>
            <div className = {styles.style}>
            <form> 
              <div className = {styles.style}>
                  <input onChange = {(e) => handleSearch(e.target.value)} placeholder = "Enter a Surah"></input>
                <div>
                <img style = {{height: '60px', width: '60px'}} src= "images/searchButton.png" alt = "search button"/>
                </div>
               </div>
            </form>
            </div>
            <div style = {{marginRight:10}}>
            <SearchResults props = {searchResults} />
            </div>            
            </SearchContext.Provider>

        </div>
    )
}

export default SearchBar;