'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';

export default class Footer extends Component {
    constructor() {
        super();
        this.state = {
            finishTime: 0,
            totalTime: 300,
            volume: 0.5,
            url: './static/testData/冬天的秘密.mp3',
            hash: '',
            loop: true
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
                this.setCurrentMuisc();
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    setCurrentMuisc() {
        this.appAudio = this.refs.appAudio;
        this.appAudio.src = this.state.url;
        this.appAudio.volume = this.state.volume;
        this.appAudio.onloadedmetadata = () => {
            this.setState({ totalTime: this.appAudio.duration });
            this.playMusic(true);
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

    playMusic() {
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

    render() {
        let progressStyle = {
            width: this.state.finishTime / this.state.totalTime * 300
        };
        let progressHeaderStyle = {
            left: this.state.finishTime / this.state.totalTime * 300 - 5
        };
        let volumeProgressStyle = {
            width: this.state.volume * 100
        }
        let volumeProgressHeaderStyle = {
            left: this.state.volume * 100 - 5
        }
        return (
            <div className="footer">
                <i className="fa fa-backward" aria-hidden="true"></i>
                <i className="fa fa-play" aria-hidden="true" ref="playButton" onClick={this.controlMusic.bind(this)}></i>
                <i className="fa fa-forward" aria-hidden="true"></i>
                <span className="finishTime">{this.parseTime(this.state.finishTime)}</span>
                <div className="progress"><span className="finish" style={progressStyle}></span><span className="progressHeader button" style={progressHeaderStyle}></span></div>
                <span className="totalTime">{this.parseTime(this.state.totalTime)}</span>
                <i className="fa fa-volume-up" aria-hidden="true"></i>
                <div className="volumeProgress"><span className="finish" style={volumeProgressStyle}></span><span className="volumeProgressHeader button" style={volumeProgressHeaderStyle}></span></div>
                <i className="fa fa-repeat" aria-hidden="true" onClick={this.changeLoop.bind(this)}></i>
                <audio ref="appAudio"></audio>
            </div>
        )
    }
}