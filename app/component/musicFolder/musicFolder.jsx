'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';

export default class MusicFolder extends Component {
    constructor() {
        super();
        this.state = {
            image: '',
            songName: '',
            singername: ''
        }
    }

    componentDidMount() {
        $.subscribe('selectedOneMusic', (o, args) => {
            this.showSmallDetail(args.hash);
        })
    }

    showSmallDetail(hash) {
        
        let url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`;
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'json',
            success: (result) => {
                this.setState({ image: JSON.parse(result).data.img});
                this.setState({ songName: JSON.parse(result).data.song_name });
                this.setState({ singername: JSON.parse(result).data.author_name });
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    openBigWindow() {
        $.publish('openBigWindow');
    }

    render() {
        return (
            <div className="musicFolder">
                <div className="folderList"></div>
                <div className="smallWindow button" onClick={this.openBigWindow.bind(this)}>
                    <img src={this.state.image}/>
                    <span>{this.state.songName}</span>
                    <span>{this.state.singername}</span>
                </div>
            </div>
        )
    }
}