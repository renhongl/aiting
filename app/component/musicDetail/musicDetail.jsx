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
            songName: '未知',
            singername: '未知',
            lyric: '没有歌词',
            audioName: '未知'
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
                let top = $('.detailLyric').get(0).scrollTop;
                $('.detailLyric').get(0).scrollTop = top - 100;
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
            this.setState({ image: './static/images/panda.jpg' });
            this.setState({ songName: $('#' + hash).attr('data').split(' - ')[0].split('/')[1] });
            this.setState({ singername: $('#' + hash).attr('data').split(' - ')[1].split('.mp3')[0] });
            this.setState({ lyric: '没有歌词' });
            this.setState({ audioName: '未知' });
            return;
        }else if(hash.indexOf('article') !== -1){
            this.setState({ image: './static/images/panda.jpg' });
            this.setState({ songName: '未知'});
            this.setState({ singername: '未知' });
            this.setState({ lyric: '没有歌词' });
            this.setState({ audioName: '未知' });
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
                this.setState({ audioName: JSON.parse(result).data.audio_name });
                let lyrics = JSON.parse(result).data.lyrics;
                for(let i = 0; i < 13; i++){
                    lyrics += '[lyric'+ i +'] \r\n';
                }
                this.setState({ lyric: lyrics });
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
                <p className="lyricLine" key={Math.random()} id={line.split(']')[0]}>{line.split(']')[1]}</p>
            )
        });
        return (
            <div className="musicDetail">
                <div className="detailHeader"><i className="fa fa-compress" aria-hidden="true" onClick={this.closeBigWindow.bind(this)}></i></div>
                <div className="detailContent">
                    <img className="musicImg" src={this.state.image} />
                    <img className="musicBar" src="./static/images/bar.png" />
                    <p className="detailName">
                        <span title={this.state.songName} style={{ fontWeight: 'bold', fontSize: '20px', display: 'inline-block', marginBottom: '10px',overflow:'hidden' }}>{this.state.songName}</span><br />
                        歌手: <span style={{fontWeight: 'bold',display: 'inline-block', marginRight: '10px'}}>{this.state.singername}</span>
                        专辑: <span style={{fontWeight: 'bold'}}>{this.state.audioName.substring(0, 10)}</span>
                    </p>
                    <div className="detailLyric">{lyricLine}</div>
                </div>
            </div>
        )
    }
}