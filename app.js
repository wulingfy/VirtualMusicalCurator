const clientId = '902ffd4c89f244c9aa48e1c27423f079';
const clientSecret = '2c6e1b093c75464585b7a434e5c3cca0';

async function getAccessToken() {
    const authUrl = 'https://accounts.spotify.com/api/token';
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(clientId + ':' + clientSecret));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=client_credentials';

    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

async function searchTracks(token, query) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        return data.tracks.items;
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
}

async function searchPlaylists(token, query) {
    const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`;

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        return data.playlists.items;
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

async function fetchRecommendations() {
    const token = await getAccessToken();
    const songDescription = document.getElementById('song-description-input').value;
    const artistName = document.getElementById('artist-name-input').value;

    if (songDescription) {
        const tracks = await searchTracks(token, songDescription);
        displayTracks(tracks);
    }

    if (artistName) {
        const playlists = await searchPlaylists(token, artistName);
        displayPlaylists(playlists);
    }
}

function displayTracks(tracks) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    if (tracks.length === 0) {
        recommendationsDiv.innerHTML += '<p>No tracks found. Please try another description.</p>';
        return;
    }

    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('track');

        const trackImg = document.createElement('img');
        trackImg.src = track.album.images[0].url;
        trackElement.appendChild(trackImg);

        const trackInfo = document.createElement('div');
        trackInfo.classList.add('track-info');

        const trackTitle = document.createElement('h4');
        trackTitle.textContent = track.name;
        trackInfo.appendChild(trackTitle);

        const trackArtist = document.createElement('p');
        trackArtist.textContent = `by ${track.artists.map(artist => artist.name).join(', ')}`;
        trackInfo.appendChild(trackArtist);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const spotifyButton = document.createElement('button');
        spotifyButton.classList.add('spotify-button');
        spotifyButton.textContent = 'Listen on Spotify';
        spotifyButton.onclick = () => {
            window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
        };

        const youtubeButton = document.createElement('button');
        youtubeButton.classList.add('youtube-button');
        youtubeButton.textContent = 'Watch on YouTube';
        youtubeButton.onclick = () => {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(track.name)}`, '_blank');
        };

        buttonsDiv.appendChild(spotifyButton);
        buttonsDiv.appendChild(youtubeButton);

        trackElement.appendChild(trackInfo);
        trackElement.appendChild(buttonsDiv);
        recommendationsDiv.appendChild(trackElement);
    });
}

function displayPlaylists(playlists) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    if (playlists.length === 0) {
        recommendationsDiv.innerHTML += '<p>No playlists found. Please try another artist name.</p>';
        return;
    }

    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');

        const playlistImg = document.createElement('img');
        playlistImg.src = playlist.images[0]?.url || 'default-image-url';
        playlistElement.appendChild(playlistImg);

        const playlistInfo = document.createElement('div');
        playlistInfo.classList.add('playlist-info');

        const playlistTitle = document.createElement('h4');
        playlistTitle.textContent = playlist.name;
        playlistInfo.appendChild(playlistTitle);

        const playlistOwner = document.createElement('p');
        playlistOwner.textContent = `by ${playlist.owner.display_name}`;
        playlistInfo.appendChild(playlistOwner);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const spotifyButton = document.createElement('button');
        spotifyButton.classList.add('spotify-button');
        spotifyButton.textContent = 'Listen on Spotify';
        spotifyButton.onclick = () => {
            window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank');
        };

        const youtubeButton = document.createElement('button');
        youtubeButton.classList.add('youtube-button');
        youtubeButton.textContent = 'Watch on YouTube';
        youtubeButton.onclick = () => {
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(playlist.name)}`, '_blank');
        };

        buttonsDiv.appendChild(spotifyButton);
        buttonsDiv.appendChild(youtubeButton);

        playlistElement.appendChild(playlistInfo);
        playlistElement.appendChild(buttonsDiv);
        recommendationsDiv.appendChild(playlistElement);
    });
}

// Event listeners for search buttons
document.getElementById('song-search-button').addEventListener('click', fetchRecommendations);
document.getElementById('artist-search-button').addEventListener('click', fetchRecommendations);
