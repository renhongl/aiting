'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

export default class Footer extends Component {
    constructor() {
        super();
        this.state = {
            finishTime: 0,
            totalTime: 300,
            volume: 0.5,
            url: './static/testData/冬天的秘密.mp3'
        }
    }

    componentDidMount() {
        this.timeThread = setInterval(() => {
            let finishTime = this.state.finishTime;
            if(finishTime >= this.state.totalTime){
                clearInterval(this.timeThread);
            }else{
                this.setState({finishTime: finishTime + 1});
            }   
        }, 1000);

        let appAudio = document
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
                <i className="fa fa-pause" aria-hidden="true"></i>
                <i className="fa fa-forward" aria-hidden="true"></i>
                <span className="finishTime">{this.state.finishTime}</span>
                <div className="progress"><span className="finish" style={progressStyle}></span><span className="progressHeader button" style={progressHeaderStyle}></span></div>
                <span className="totalTime">{this.state.totalTime}</span>
                <i className="fa fa-volume-up" aria-hidden="true"></i>
                <div className="volumeProgress"><span className="finish" style={volumeProgressStyle}></span><span className="volumeProgressHeader button" style={volumeProgressHeaderStyle}></span></div>
                <i className="fa fa-repeat" aria-hidden="true"></i>
                <audio id="appAudio"></audio>
            </div>
        )
    }
}