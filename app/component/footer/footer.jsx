'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';

export default class Footer extends Component {
    constructor() {
        super();
        this.state = {
            finishTime: 0,
            totalTime: 0,
            volume: 0.5,
            url: '',
            hash: '',
            loop: true,
            songName: '',
            setVolume: false,
            initX: 0,
            path: ''
        }
    }

    parseTime(time) {
        let minutes = parseInt(time / 60);
        let seconds = parseInt(time % 60);
        return this.addZero(minutes) + ' : ' + this.addZero(seconds);
    }

    addZero(number) {
        return number < 10 ? '0' + number : number + '';
    }

    componentDidMount() {
        $.subscribe('selectedOneMusic', (o, args) => {
            this.setState({ hash: args.hash });
            this.getCurrentMusic(args.hash);
        });

        $(document).on('mouseup', () => {
            this.setState({setVolume: false});
        });

        $.subscribe('localPathChanged', (o, args) => {
            this.setState({path: args.path});
        });
    }

    getCurrentMusic(hash) {
        clearInterval(this.timeThread);
        this.setState({ finishTime: 0 });
        let url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`;
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'json',
            success: (result) => {
                this.setState({ url: JSON.parse(result).data.play_url });
                this.setState({songName: JSON.parse(result).data.song_name });
                this.setCurrentMuisc();
            },
            error: (error) => {
                new Message('warning', '播放歌曲失败，请重新播放。');
            }
        })
    }

    setCurrentMuisc() {
        this.appAudio = this.refs.appAudio;
        if(this.state.hash.indexOf('local') !== -1){
            this.appAudio.src = $('#' + this.state.hash).attr('data');
            this.state.songName = $('#' + this.state.hash).attr('data').split(' - ')[0].split('/')[1];
        }else{
            this.appAudio.src = this.state.url;
        }
        this.appAudio.volume = this.state.volume;
        this.appAudio.onloadedmetadata = () => {
            this.setState({ totalTime: this.appAudio.duration });
            this.playMusic();
            new Message('success', '即将播放: ' + this.state.songName);
        }
    }

    controlMusic() {
        if ($(this.refs.playButton).hasClass('fa-play')) {
            $(this.refs.playButton).removeClass('fa-play').addClass('fa-pause');
            this.appAudio.play();
            this.timeThread = setInterval(() => {
                let finishTime = this.state.finishTime;
                if (finishTime >= this.state.totalTime) {
                    clearInterval(this.timeThread);
                    if (this.state.loop) {
                        $.publish('nextMusic', { hash: this.state.hash });
                    } else {
                        $.publish('randomMusic', { hash: this.state.hash });
                    }
                } else {
                    this.setState({ finishTime: finishTime + 1 });
                    $.publish('changeLyricLine', { time: this.state.finishTime });
                }
            }, 1000);
        } else {
            this.appAudio.pause();
            clearInterval(this.timeThread);
            $(this.refs.playButton).removeClass('fa-pause').addClass('fa-play');
        }
    }

    playNextMusic() {
        $.publish('nextMusic', { hash: this.state.hash });
    }

    playLastMusic() {
        $.publish('lastMusic', { hash: this.state.hash });
    }

    playMusic() {
        $(this.refs.playButton).removeClass('fa-play').addClass('fa-pause');
        this.appAudio.play();
        this.timeThread = setInterval(() => {
            let finishTime = this.state.finishTime;
            if (finishTime >= this.state.totalTime - 1) {
                clearInterval(this.timeThread);
                if (this.state.loop) {
                    $.publish('nextMusic', { hash: this.state.hash });
                } else {
                    $.publish('randomMusic', { hash: this.state.hash });
                }
            } else {
                this.setState({ finishTime: finishTime + 1 });
                $.publish('changeLyricLine', { time: this.state.finishTime });
            }
        }, 1000);
    }

    changeLoop(e) {
        if($(e.target).hasClass('fa-repeat')){
            $(e.target).addClass('fa-random').removeClass('fa-repeat');
            this.setState({loop: false});
        }else{
            $(e.target).removeClass('fa-random').addClass('fa-repeat');
            this.setState({loop: true});
        }
    }

    volumeMouseDown(e) {
        this.setState({setVolume: true});
        this.setState({initX: e.clientX});
    }

    volumeMouseUp() {
        this.setState({setVolume: false});
    }

    changeVolume(e) {
        if(this.state.setVolume){
            let offSetX = this.state.initX - e.clientX;
            this.setState({initX: e.clientX});
            let newVolume = this.state.volume - offSetX / 100;
            if(newVolume < 0){
                newVolume = 0;
            }
            if(newVolume > 1){
                newVolume = 1;
            }
            this.setState({volume: newVolume});
            this.refs.appAudio.volume = newVolume;
        }
    }

    render() {
        let offset = 0;
        if(this.state.totalTime !== 0){
            offset = this.state.finishTime / this.state.totalTime;
        }
        let progressStyle = {
            width: offset * 300
        };
        let progressHeaderStyle = {
            left: offset * 300 - 5
        };
        let volumeProgressStyle = {
            width: this.state.volume * 100
        }
        let volumeProgressHeaderStyle = {
            left: this.state.volume * 100 - 5
        }
        return (
            <div className="footer">
                <i className="fa fa-backward" aria-hidden="true" onClick={this.playLastMusic.bind(this)}></i>
                <i className="fa fa-play" aria-hidden="true" ref="playButton" onClick={this.controlMusic.bind(this)}></i>
                <i className="fa fa-forward" aria-hidden="true" onClick={this.playNextMusic.bind(this)}></i>
                <span className="finishTime">{this.parseTime(this.state.finishTime)}</span>
                <div className="progress">
                    <span className="finish" style={progressStyle}></span>
                    <span className="progressHeader button" style={progressHeaderStyle}></span>
                </div>
                <span className="totalTime">{this.parseTime(this.state.totalTime)}</span>
                <i className="fa fa-volume-up" aria-hidden="true"></i>
                <div className="volumeProgress">
                    <span className="finish" style={volumeProgressStyle}></span>
                    <span className="volumeProgressHeader button" style={volumeProgressHeaderStyle} onMouseDown={this.volumeMouseDown.bind(this)} onMouseMove={this.changeVolume.bind(this)} onMouseUp={this.volumeMouseUp.bind(this)}></span>
                </div>
                <i className="fa fa-repeat" aria-hidden="true" onClick={this.changeLoop.bind(this)}></i>
                <audio ref="appAudio"></audio>
            </div>
        )
    }
}