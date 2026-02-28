console.log("Start")
let songs;
let currentSong = new Audio();
let currFolder;
async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`./Not-A-Spotify-CLone/songs/${currFolder}/info.json`);
    let response = await a.json();

    let div = document.createElement("div")
    div.innerHTML = response
    songs = response.songs
    console.log(songs)

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img src="music.svg" class="inverted">
                        <div class="info">${decodeURIComponent(song)}</div>
                    <img src="play.svg" class="inverted songlistimg"></li>`;

    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").textContent.trim())
            playMusic(e.querySelector(".info").textContent.trim())
        })
    })

}



const playMusic = (track, pause = false) => {
    
    currentSong.src = `./songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play()

        play.src = "pause.svg";
    }

    document.querySelector(".songdetail").innerHTML = decodeURIComponent(track);



}

async function displayAlbums() {
    try {
    let res = await fetch("./Not-A-Spotify-CLONE/songs/index.json");
    console.log(res);
    let data = await res.json(); 
    console.log("Fetched JSON:", data);

    let cardcontainer = document.querySelector(".cardcontainer");
    cardcontainer.innerHTML = "";
    for (const album of data.albums) {
        let infoRes = await fetch(`./Not-A-Spotify-CLONE/songs/${album.folder}/info.json`);
        if (!infoRes.ok) throw new Error(`Failed to fetch ${album.folder}/info.json`);
        let info = await infoRes.json();

        cardcontainer.innerHTML += `<div data-folder="${album.folder}" class="card">
                    <img src="./Not-A-Spotify-CLONE/songs/${album.folder}/cover.jpeg" class="cardimg">
                    <h2>${album.Title}</h2>
                    <p>${album.Detail}</p>
                </div>`;
    }

} catch (err) {
    console.error("Error fetching albums or parsing JSON:", err);

    if (err instanceof SyntaxError) {
        try {
            let res = await fetch("./Not-A-Spotify-CLONE/songs/index.json");
            let text = await res.text();
            console.log("Raw response from server:", text);
        } catch(e) {
            console.error("Cannot fetch raw response:", e);
        }
    }
}

async function main() {
    await getsongs("Cool");
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".seekcircle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".seekcircle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })
    document.addEventListener("keydown", e => {
        if (e.code == "Space") {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "pause.svg"
            }
            else {
                currentSong.pause()
                play.src = "play.svg"
            }
        }
    })
    currentSong.addEventListener("ended", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]));
        console.log("Index Length"+index+songs.length)
        if (index + 1 >= songs.length) {
            playMusic(songs[0])
        }
        else {
            playMusic(songs[index + 1]);

        }
    });

    ham.addEventListener("click", e => {
        if (document.getElementById("left").style.left == '-100%') {
            document.getElementById("left").style.left = 0;

        }
        else {
            document.getElementById("left").style.left = '-100%';

        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]))
        if (index + 1 >= songs.length) {
            playMusic(songs[0])
        }
        else {
            playMusic(songs[index + 1]);

        }

    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split('/').slice(-1)[0]))
        if (index - 1 < 0) {
            playMusic(songs[0])
        }
        else {
            playMusic(songs[index - 1]);

        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })


    
}

function formatTime(seconds) {

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}


main()
