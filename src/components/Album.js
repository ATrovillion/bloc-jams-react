import React, {Component} from 'react';
import albumData from './../data/album';
import PlayerBar from './PlayerBar';


 class Album extends Component {
    constructor(props) {
        super(props);
        
        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            duration: album.songs[0].duration,
            isPlaying: false,
            currentVolume: 1.0
        };
        
        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
    }

    play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
    }


    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
                this.setState({ currentTime: this.audioElement.currentTime });
            },
            durationchange: e => {
                this.setState({ duration: this.audioElement.duration });
            },
            volumechange: e => {
                this.setState({ currentVolume: this.audioElement.currentVolume });
            }
        };
        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
        this.audioElement.volume=this.state.currentVolume
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }


    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause();
        } else {
            if (!isSameSong) { this.setSong(song); }
            this.play();
        }
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
    }

    setVolume(e) {
        const changedVolume = e.target.value;
        console.log(changedVolume);
        this.audioElement.volume = changedVolume;
        this.setState({ currentVolume: changedVolume });
    }

    formatTime(time) {
        return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.title}</h1>
                        <h2 id="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                </section>
                <section>
                    <table id="song-list">
                        <colgroup>
                            <col id="song-number-column" />
                            <col id="song-title-column" />
                            <col id="song-duration-column" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Song Number</th>
                                <th>Song Title</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.album.songs.map( (song, index) =>
                                <tr className="song" key={index} onClick={() => this.handleSongClick(song)} >
                                <td>{index + 1}</td>
                                <td>{song.title}</td>
                                <td>{this.formatTime(song.duration)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <PlayerBar
                        isPlaying={this.state.isPlaying}
                        currentSong={this.state.currentSong}
                        prettyCurrentTime={this.formatTime(this.state.currentTime)}
                        currentTime={this.audioElement.currentTime}
                        prettyDuration={this.formatTime(this.state.duration)}
                        duration={this.audioElement.duration}
                        currentVolume={this.state.currentVolume}
                        handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                        handlePrevClick={() => this.handlePrevClick()}
                        handleNextClick={() => this.handleNextClick()}
                        handleTimeChange={(e) => this.handleTimeChange(e)}
                        setVolume={(e) => this.setVolume(e)}
                    />
                </section>
            </section>
        );
    }
 }

export default Album;