import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import "../css/AudioPLayer.css";
import Particles from "react-particles-js";

class AudioPlayer extends PureComponent {
  particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#fec345",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 1,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 4,
          size_min: 0.3,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
      },
    },
    retina_detect: true,
  };
  static propTypes = {
    songs: PropTypes.array.isRequired,
    autoplay: PropTypes.bool,
    onTimeUpdate: PropTypes.func,
    onEnded: PropTypes.func,
    onError: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
  };

  static defaultProps = {
    onTimeUpdate: () => {},
    onEnded: () => {},
    onError: () => {},
    onPlay: () => {},
    onPause: () => {},
    onPrevious: () => {},
    onNext: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      active: props.songs[0],
      songs: props.songs,
      current: 0,
      progress: 0,
      random: false,
      playing: !!props.autoplay,
      repeat: false,
      mute: false,
      volume: 1.0,
      queue: false,
    };
    this.playList = this.playList.bind(this);

    this.audio = document.createElement("audio");
    this.audio.src = this.state.active.url;
    this.audio.autoplay = !!this.state.autoplay;

    this.audio.addEventListener("timeupdate", (e) => {
      this.updateProgress();

      props.onTimeUpdate(e);
    });
    this.audio.addEventListener("ended", (e) => {
      this.next();

      props.onEnded(e);
    });
    this.audio.addEventListener("error", (e) => {
      this.next();

      props.onError(e);
    });
    this.audio.addEventListener("onvolumechange", (e) => {
      this.volumeChange();
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     active: nextProps.songs[0],
  //     songs: nextProps.songs,
  //     current: 0,
  //     progress: 0,
  //     random: false,
  //     playing: !!nextProps.autoplay,
  //     repeat: false,
  //     mute: false,
  //   });
  // }

  shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  updateProgress = () => {
    const { duration, currentTime } = this.audio;
    const progress = (currentTime * 100) / duration;

    this.setState({
      progress: progress,
    });
  };

  setProgress = (e) => {
    const target =
      e.target.nodeName === "SPAN" ? e.target.parentNode : e.target;
    const width = target.clientWidth;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const duration = this.audio.duration;
    const currentTime = (duration * offsetX) / width;
    const progress = (currentTime * 100) / duration;

    this.audio.currentTime = currentTime;

    this.setState({
      progress: progress,
    });

    this.play();
  };

  play = () => {
    this.setState({
      playing: true,
    });

    this.audio.play();

    this.props.onPlay();
  };

  pause = () => {
    this.setState({
      playing: false,
    });

    this.audio.pause();

    this.props.onPause();
  };

  toggle = () => (this.state.playing ? this.pause() : this.play());

  next = () => {
    const { repeat, current, songs } = this.state;
    const total = songs.length;
    const newSongToPlay = repeat
      ? current
      : current < total - 1
      ? current + 1
      : 0;
    const active = songs[newSongToPlay];

    this.setState({
      current: newSongToPlay,
      active: active,
      progress: 0,
      repeat: false,
    });

    this.audio.src = active.url;
    this.play();
    this.props.onNext();
  };

  playList = (next) => {
    const { songs } = this.state;
    const song = songs.find((song) => song.url === next.url);
    const songindex = songs.indexOf(song);
    this.setState({
      current: songindex,
      active: song,
      progress: 0,
      repeat: false,
    });

    this.audio.src = song.url;
    this.play();
  };

  previous = () => {
    const { current, songs } = this.state;
    const total = songs.length;
    const newSongToPlay = current > 0 ? current - 1 : total - 1;
    const active = songs[newSongToPlay];

    this.setState({
      current: newSongToPlay,
      active: active,
      progress: 0,
    });

    this.audio.src = active.url;
    this.play();
    this.props.onPrevious();
  };

  randomize = () => {
    const { random, songs } = this.state;
    const shuffled = this.shuffle(songs.slice());

    this.setState({
      songs: !random ? shuffled : songs,
      random: !random,
    });
  };

  repeat = () =>
    this.setState({
      repeat: !this.state.repeat,
    });

  toggleMute = () => {
    const { mute } = this.state;

    this.setState({
      mute: !mute,
    });

    this.audio.volume = !!mute;
  };

  volumeChange = () => {
    // const { volume } = this.state;
    console.log(this.audio.volume);
    const volum = this.audio.volume;
    const vol = volum - 0.1;
    this.setState({
      volume: vol,
    });

    this.audio.volume = vol;
  };
  toggleQueue = () => {
    const { queue } = this.state;
    this.setState({
      queue: !queue,
    });
  };
  showQueue = () => {
    const { songs, queue, active } = this.state;
    if (!!queue) {
      return (
        <ul className="queue">
          {songs.map((song) => {
            return (
              <li
                key={song.id}
                onClick={() => this.playList(song)}
                className={song === active ? "queues" : "queueue"}
              >
                {song.artist.song}
              </li>
            );
          })}
        </ul>
      );
    }
  };
  render() {
    const {
      active: currentSong,
      progress,
      active,
      playing,
      mute,
      random,
      repeat,
      queue,
    } = this.state;
    const coverClass = classnames({
      "player-cover": true,
      "no-height": !!active.cover === false,
    });

    const playPauseClass = classnames({
      fa: true,
      "fa-play": !playing,
      "fa-pause": playing,
    });

    const volumeClass = classnames({
      fa: true,
      "fa-volume-up": !mute,
      "fa-volume-off": mute,
      "player-btn active": !mute,
    });

    const randomClass = classnames({
      "player-btn random": true,
      active: random,
    });

    const repeatClass = classnames({
      "player-btn repeat": true,
      active: repeat,
    });
    return (
      <div className="containerPlayer">
        <Particles className="particlesPlayer" params={this.particlesOptions} />
        <h1>HHH AUDIOPLAYER</h1>
        <div className="player-container">
          <div
            className={coverClass}
            style={{ backgroundImage: `url(${currentSong.cover || ""})` }}
          ></div>

          <div className="artist-info">
            <h2 className="artist-song-name">{currentSong.artist.song}</h2>
            <h3 className="artist-name">{currentSong.artist.name}</h3>
          </div>

          <div
            className="player-progress-container"
            onClick={(e) => this.setProgress(e)}
          >
            <span
              className="player-progress-value"
              style={{ width: progress + "%" }}
            ></span>
          </div>

          <div className="player-options">
            <div className="player-buttons player-controls">
              <button
                onClick={this.previous}
                className="player-btn medium"
                title="Previous Song"
              >
                <i className="fa fa-step-backward"></i>
              </button>
              <button
                onClick={this.toggle}
                className="player-btn big"
                title="Play/Pause"
              >
                <i className={playPauseClass}></i>
              </button>
              <button
                onClick={this.next}
                className="player-btn medium"
                title="Next Song"
              >
                <i className="fa fa-step-forward"></i>
              </button>
            </div>

            <div className="player-buttons">
              <button
                className="player-btn volume"
                onClick={this.toggleMute}
                title="Mute/Unmute"
              >
                <i className={volumeClass}></i>
              </button>
              <button
                className={repeatClass}
                onClick={this.repeat}
                title="Repeat"
              >
                <i className="fa fa-repeat"></i>
              </button>
              <button
                className={randomClass}
                onClick={this.randomize}
                title="Shuffle"
              >
                <i className="fa fa-random"></i>
              </button>
              <button
                className={queue ? "player-btn active" : "player-btn small"}
                onClick={this.toggleQueue}
                title="Queue"
              >
                <i className="fa fa-list fa-xs"></i>
              </button>
            </div>
          </div>
          {this.showQueue()}
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    this.pause();
  }
}

export default AudioPlayer;
