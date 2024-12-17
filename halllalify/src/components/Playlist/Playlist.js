import styles from './Playlist.module.css';
import React, { useContext, useState, useEffect } from 'react';
import { SearchResultsContext } from '../SearchResults/SearchResults';
import { loginWithSpotifyClick, getUserData, getUserPlaylists, createNewPlaylist, addToNewPlaylist, changeUserPlaylist } from '../Track/Track'

const Playlist = () => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const storedPlaylists = JSON.parse(localStorage.getItem('playlists'));
    const { addResults, setResults } = useContext(SearchResultsContext);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistsStored, setPlaylistsStored] = useState({items: []}); 
    const [newName, setNewName] = useState('');
    const [saveID, setSaveID] = useState('')
    const [loadingID, setLoadingID] = useState(null)
    let trackNames = addResults.map(song => song.uri);

      // Call the function to get rate limit info


  
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
    
        
        updatePlaylist(); 
      }, [playlistName]); // Not the best use of UseEffect here, Need to figure out a way to make the api call as least as possible!
      

    const addPlaylists = ((newPlaylist) => {
        setPlaylistsStored((prev) =>
        ({
            ...prev,
            items: [...prev.items, newPlaylist]
        }));
    })

    const handleNameChange = (e) =>
    {
        setNewName(e.target.textContent)
    }
    const handlePlaylistNameChange = async () =>
    {
      
        
        let response = await changeUserPlaylist(saveID, newName);
        setLoadingID(saveID);
        setTimeout(() => {
            setLoadingID(false)
        }, 2000);
    }
    
 
    
      

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
                        <h2 style = {{color:"white", }}>{result.name}</h2>
                        <h3>By {result.album.artists[0].name}</h3>
                    </div>
                    <img className = {styles.trashImage} onClick = {() => handleDelete(result.id)} src = "images/deleteWhite.svg"/>
                </div>
               
                
                </React.Fragment>
                ))}
                <div>
                 {playlistsStored?.items?.length >1  ? playlistsStored.items.map((playlist) => 
                 <div className = {styles.loadPlaylist}>
                    <div>
                    <h2 onInput = {handleNameChange} onClick = {() => setSaveID(playlist.id)} onBlur = {handlePlaylistNameChange} contentEditable suppressContentEditableWarning={true} style = {{color: 'orange', width: '100px'}}>{playlist.name} </h2>
                    <h2>{console.log(playlist.id)}</h2>
                    { Array.isArray(playlist.images) && playlist.images.length > 0 ?(
                    <img 
                        src={playlist.images[0].url} // Use the first image
                        alt={`${playlist.name} album cover`} 
                        style={{ width: "100px", height: "100px" }} // Adjust size as needed
                    />
                       ): null }
                    </div>
                        {loadingID === playlist.id && <div className={styles.loader}></div>}
                    </div>

                 ): null} 
                </div>
                 <div className = {styles.buttonSort}>
                    <div onClick = {createNewUserPlaylist} className = {styles.spotify} >
                        <img style = {{height:'50px', width:'50px' }} src = "images/square-plus-regular-white.svg" />
                        <h3>Add Playlist</h3>
                    </div>
                    <div onClick = {handleSaveToSpotify} className = {styles.spotify}>
                        <img style = {{height:'50px', width:'50px' }} src = "images/spotify.svg"/>
                        <h3 style = {{marginLeft: '10px'}}>Sign in to Spotify</h3>
                    </div>
                </div>
                
        </div>
    )};
}


export default Playlist;