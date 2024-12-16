import styles from './Playlist.module.css';
import React, { useContext, useState, useEffect } from 'react';
import { SearchResultsContext } from '../SearchResults/SearchResults';
import { loginWithSpotifyClick, getUserData, getUserPlaylists, createNewPlaylist, addToNewPlaylist } from '../Track/Track'

const Playlist = () => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const storedPlaylists = JSON.parse(localStorage.getItem('playlists'));
    const { addResults, setResults } = useContext(SearchResultsContext);
    const [playlistName, setPlaylistName] = useState('')
    const [playlistsStored, setPlaylistsStored] = useState({items: []}); 
    let trackNames = addResults.map(song => song.uri);

    useEffect(() => {
        // This will run every time storedUserData changes (for example, when the user logs in)
        const updatePlaylist = async () =>
            {
                let response = await getUserPlaylists();
                if(response)
                {
                    setPlaylistsStored({items: response.items});
                }
                else
                {
                    console.log("Error fetching updated playlists");
                }
    
        
        
            }
    
        
        updatePlaylist(); // Fetch playlists
      }, [playlistName]); // Dependency: This will run when storedUserData changes
      

    const addPlaylists = ((newPlaylist) => {
        setPlaylistsStored((prev) =>
        ({
            ...prev,
            items: [...prev.items, newPlaylist]
        }));
    })
    
   
        
    
    
      

    const handleDelete = (id) =>
    {

        setResults((prev) => {
            return prev.filter((result) => result.id !== id);
        })
    }

    const handleSaveToSpotify = async () => 
    {
        console.log("Handle Save To Spotify function triggered");

        await loginWithSpotifyClick();
    
    }
  





    const createNewUserPlaylist = async () =>
    {
        await createNewPlaylist(storedUserData.id, playlistName);// Need to put in the necessary parameters
        await addItemsToPlaylist();
    }

    const addItemsToPlaylist = async () =>
    {
       
        let fetchPlayListData = await getUserPlaylists();
        let playlists = Object.values(fetchPlayListData.items)
        let desiredPlaylistId = playlists[0].id ;
        console.log(desiredPlaylistId);
        let playlistIds = playlists.map((playlist, index) => playlist.id);
        let PID = '';

        playlistIds.forEach(playlist => {
            if (playlist === desiredPlaylistId) {
            PID = playlist;
            }
        });

        if (PID) {
            await addToNewPlaylist(PID, trackNames);
        } else {
            console.log("Could not find playlist name");
        }

    }
    

    

    
{
    return (
        <div className = {styles.style}>
            <input style = {styles.input} onChange = {(input) => setPlaylistName(input.target.value)} placeholder = "Enter Playlist Name"></input>
                {addResults.map((result, index) => (
                <React.Fragment key = {index} >
                <div className = {styles.playlist}>
                    <div>
                        <h2 style = {{color:"white"}}>{result.name}</h2>
                        <h3>By {result.album.artists[0].name}</h3>
                    </div>
                    <button onClick = {() => handleDelete(result.id)}>-</button>
                </div>
               
                
                </React.Fragment>
                ))}
                <div>
                 {playlistsStored.lenght >1 ? playlistsStored.items.map((playlist) => 
                 <div>
                    <h2 style = {{color: 'white'}}>{playlist.name}</h2>
                    { Array.isArray(playlist.images) && playlist.images.length > 0 ?(
                    <img 
                        src={playlist.images[0].url} // Use the first image
                        alt={`${playlist.name} album cover`} 
                        style={{ width: "100px", height: "100px" }} // Adjust size as needed
                    />
                       ): null }
                </div>

                 ): null} 
                </div>
                    <button onClick = {createNewUserPlaylist}>Add Playlist</button>
                    <button onClick = {handleSaveToSpotify} >Sign in to Spotify</button>
                
        </div>
    )};
}


export default Playlist;