'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';

export default class MusicDetail extends Component {
    constructor() {
        super();
        this.state = {
            image: './static/images/panda.jpg',
            songName: '',
            singername: '',
            lyric: '',
            audioName: ''
        }
    }

    componentDidMount() {
        $.subscribe('openBigWindow', () => {
            $('.musicDetail').show();
        });

        $.subscribe('selectedOneMusic', (o, args) => {
            this.setDetail(args.hash);
        });

        $.subscribe('changeLyricLine', (o, args) => {
            this.changeLyricLine(args);
        });
    }

    changeLyricLine(args) {
        let $lyricLineGroup = $('.lyricLine');
        $.each($lyricLineGroup, (i, item) => {
            let timeStr = $(item).attr('id').substring(1, 6);
            let time = Number(timeStr.split(':')[0]) * 60 + Number(timeStr.split(':')[1]);
            if (time === args.time) {
                $(item).get(0).scrollIntoView(true);
                $('.lyricLine').css({
                    color: '#000'
                });
                $(item).css({
                    color: '#fff'
                });
            }
        });
    }

    setDetail(hash) {
        if(hash.indexOf('local') !== -1){
            return;
        }
        let url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`;
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'json',
            success: (result) => {
                this.setState({ image: JSON.parse(result).data.img });
                this.setState({ songName: JSON.parse(result).data.song_name });
                this.setState({ singername: JSON.parse(result).data.author_name });
                this.setState({ lyric: JSON.parse(result).data.lyrics });
                this.setState({ audioName: JSON.parse(result).data.audio_name });
            },
            error: (error) => {
                new Message('warning', '获取歌曲信息失败。');
            }
        })
    }

    closeBigWindow() {
        $('.musicDetail').hide();
    }

    render() {
        this.lyrics = this.state.lyric.split('\r\n');
        let lyricLine = this.lyrics.map((line) => {
            return (
                <p className="lyricLine" key={line.split(']')[0]} id={line.split(']')[0]}>{line.split(']')[1]}</p>
            )
        });
        return (
            <div className="musicDetail">
                <div className="detailHeader"><i className="fa fa-compress" aria-hidden="true" onClick={this.closeBigWindow.bind(this)}></i></div>
                <div className="detailContent">
                    <img src={this.state.image} />
                    <p className="detailName">
                        <span style={{ fontWeight: 'bold', fontSize: '20px', display: 'inline-block', marginBottom: '10px' }}>{this.state.songName.substring(0, 10)}</span><br />
                        歌手: {this.state.singername}   专辑: {this.state.audioName.substring(0, 10)}
                    </p>
                    <div className="detailLyric">{lyricLine}</div>
                </div>
            </div>
        )
    }
}