import React, {Component} from 'react';
import albumData from './../data/album';


 class Album extends Component {
    constructor(props) {
        super(props);
        
        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            isPlaying: false,
            isHovered: false,
            hoveredIndex: -1,
            pausedSong: -1
        };
        
        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
    }

    play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
    }

    pause(song) {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
        this.setState({pausedSong : song})
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause(song);
        } else {
            if (!isSameSong) { this.setSong(song); }
            this.play();
        }
    }

    handleMouseEnter(index) {
        this.setState({hoveredIndex: index,
        isHovered: true})
    }

    handleMouseLeave() {
        this.setState({isHovered: false})
    }

    playPauseNumber(index, song) {
        if (this.state.isPlaying) {
            if (/* a song is the currentSong*/ this.state.currentSong === song) {
                return /*<button>Pause</button>*/ <span className = "ion-pause"></span>
            } else if (/*a song is not the currentSong*/ this.state.currentSong !== song) {
                if (/*the song is hovered*/ this.state.isHovered && this.state.hoveredIndex === index) {
                    return /*<button>Play</button>*/<span className = "ion-play"></span>
                } else {
                    return (index + 1)
                }
            }

        } else if (/*no song is playing*/ !this.state.isPlaying) {
                if (/*any song is hovered*/ this.state.isHovered) {
                    if (/*this song is hovered*/ this.state.hoveredIndex === index) {
                        return <span className = "ion-play"></span>
                    } else {
                        /*a song is not the one hovered*/
                        return (index +1)
                    }
                } else if (this.state.pausedSong === song) {
                    return <span className = "ion-play"></span>
                } else {
                    return (index + 1)
                }
        } else {
            return (index + 1)
        }
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
                    <div className="album-details">
                        <span>
                        <h1 id="album-title">{this.state.album.title}</h1>
                        </span>
                        <h2 className="artist">{this.state.album.artist}</h2>
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
                                <tr className="desired-song" key={index} onClick={() => this.handleSongClick(song)} 
                                onMouseEnter={() => this.handleMouseEnter(index)}
                                onMouseLeave={() => this.handleMouseLeave()}>

                                <td>{this.playPauseNumber(index, song)}</td>
                                <td>{song.title}</td>
                                <td>{song.duration}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </section>

        );
    }
 }

export default Album;