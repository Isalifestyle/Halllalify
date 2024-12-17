import './Track.module.css';

const clientId = '9a668d8e6d9c4bfaa7b9814efdd2e399';
const redirectUrl = 'http://localhost:3000/callback';

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope =  "user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public"


const currentToken = 
{
    get access_token() {return localStorage.getItem('access_token') || null;},
    get refresh_token() {return localStorage.getItem('refresh_token') || null;},
    get expires_in() {return localStorage.getItem('refresh_in' || null);},
    get expires() {return localStorage.getItem('expires') || null;},

    save: function (response) {
        const {access_token, refresh_token, expires_in} = response;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_in', expires_in);

        const now = new Date();
        const expiry = new Date(now.getTime() + (expires_in * 1000));
        localStorage.setItem('expires', expiry);

    }

};


const args = new URLSearchParams(window.location.search);
const code = args.get('code');


if (code) {
    const token = await getToken(code);
    currentToken.save(token);
  
    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
  
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  }

  if (currentToken.access_token) {
    const userData = await getUserData();
    const playlists = await getUserPlaylists();
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }
  
  // Otherwise we're not logged in, so render the login template
  if (!currentToken.access_token) {
    console.log("So far no access to Account")
  }
  
  async function redirectToSpotifyAuthorize() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
  
    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
  
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    window.localStorage.setItem('code_verifier', code_verifier);
  
    const authUrl = new URL(authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };
  
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  }

  // Soptify API Calls
async function getToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');
  
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });
  
    return await response.json();
  }


  async function refreshToken() {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: currentToken.refresh_token
      }),
    });
  
    return await response.json();
  }


  export async function addToNewPlaylist(playlist_id, tracksUris)
    {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + currentToken.access_token,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "uris": tracksUris
            })
        })

    }


  export async function createNewPlaylist(userId, playlistName) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + currentToken.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        public: true, // Set to false for a private playlist
      }),
    });

 
  
    const data = await response.json();
    console.log('Created Playlist:', data);
    return data;  // Returns the playlist object with ID, name, etc.
  }
  







 export async function getUserPlaylists() {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' +  currentToken.access_token  // Ensure the token is valid
      }
    });
  
    
    return await response.json(); // This will return the array of playlists
  }


  export async function changeUserPlaylist(playlist_id, newName) {
    const url = `https://api.spotify.com/v1/playlists/${playlist_id}`;
    console.log('Request URL:', url);
    console.log('New Playlist Name:', newName);
    console.log('Authorization Token:', currentToken.access_token);
  

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + currentToken.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });
       return response.status

    }
  
  

  
  
  export async function getUserData() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });
  
    return await response.json();
  }
  
  // Click handlers
 export async function loginWithSpotifyClick() {
    await redirectToSpotifyAuthorize();
  }
  
  async function logoutClick() {
    localStorage.clear();
    window.location.href = redirectUrl;
  }

  async function refreshTokenClick() {
    const token = await refreshToken();
    currentToken.save(token);
  }

  const getRateLimitInfo = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + currentToken.access_token,
        }
      });
  
      // Check for successful response
      if (response.ok) {
        const data = await response.json();
  
        // Extract rate limit information from headers
        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
  
        console.log(`API Rate Limit: ${rateLimit}`);
        console.log(`API Requests Remaining: ${rateLimitRemaining}`);
        console.log(`Rate Limit Resets At: ${new Date(rateLimitReset * 1000)}`); // Convert to human-readable time
  
        // Optional: handle the case if you're near the limit
        if (rateLimitRemaining === '0') {
          console.log('You have reached the rate limit!');
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching rate limit info:', error);
    }
  };
  

  
