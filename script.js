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
    
    currentSong.src = `./Not-A-Spotify-CLone/songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play()

        play.src = "pause.svg";
    }

    document.querySelector(".songdetail").innerHTML = decodeURIComponent(track);



}

async function displayAlbums() {
    try {
        let res = await fetch("./Not-A-Spotify-CLone/songs/index.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        let data = await res.json();

        let cardcontainer = document.querySelector(".cardcontainer");
        cardcontainer.innerHTML = ""; 

        for (const album of data.albums) {
            let infoRes = await fetch(`songs/${album.folder}/info.json`);
            if (!infoRes.ok) throw new Error(`Failed to fetch ${album.folder}/info.json`);
            let info = await infoRes.json();

            cardcontainer.innerHTML += `<div data-folder="${album.folder}" class="card">
                        <img src="./Not-A-Spotify-CLonesongs/${album.folder}/cover.jpeg" class="cardimg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                            <circle cx="12" cy="12" r="10" fill="#1DB954" />
                            <path
                                d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
                                fill="black" />
                        </svg>
                        <h2>${album.Title}</h2>
                        <p>${album.Detail}</p>
                    </div>`;
        }

        // Add click event to cards
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                await getsongs(item.currentTarget.dataset.folder);
            });
        });

    } catch (err) {
        console.error("Failed to display albums:", err);
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
