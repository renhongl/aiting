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
        });
    }

    addSelectedClass(e) {
        let t = $(this.refs.folderList);
        t.find('.paiHangBang').removeClass('selected');
        $(e.target).addClass('selected');
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

    loadHeJi(e) {
        this.addSelectedClass(e);
        let url = 'http://www.kugou.com/yy/special/single/120265.html';
        $.get(url, (result) => {
            let $li = $(result).find('#songs li');
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('.text').text().split(' - ')[1],
                    singername: $(item).find('.text').text().split(' - ')[0],
                    hash: $(item).find('a').attr('data').split('|')[0],
                    album_name: '',
                    duration: ''
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', {result: JSON.stringify(songs)});
        });
;    }

    loadKuGouYueYu(e) {
        this.addSelectedClass(e);
        let url = 'http://www.kugou.com/yy/special/single/121585.html';
        $.get(url, (result) => {
            let $li = $(result).find('#songs li');
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('.text').text().split(' - ')[1],
                    singername: $(item).find('.text').text().split(' - ')[0],
                    hash: $(item).find('a').attr('data').split('|')[0],
                    album_name: '',
                    duration: ''
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', {result: JSON.stringify(songs)});
        });
    }

    loadKuGouHuaYu(e) {
        this.addSelectedClass(e);
        let url = 'http://www.kugou.com/yy/special/single/29084.html';
        $.get(url, (result) => {
            let $li = $(result).find('#songs li');
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('.text').text().split(' - ')[1],
                    singername: $(item).find('.text').text().split(' - ')[0],
                    hash: $(item).find('a').attr('data').split('|')[0],
                    album_name: '',
                    duration: ''
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', {result: JSON.stringify(songs)});
        });
    }

    loadCunYinYue(e) {
        this.addSelectedClass(e);
        let url = 'http://www.kugou.com/yy/special/single/121512.html';
        $.get(url, (result) => {
            let $li = $(result).find('#songs li');
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('.text').text().split(' - ')[1],
                    singername: $(item).find('.text').text().split(' - ')[0],
                    hash: $(item).find('a').attr('data').split('|')[0],
                    album_name: '',
                    duration: ''
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', {result: JSON.stringify(songs)});
        });
    }

    openBigWindow() {
        $.publish('openBigWindow');
    }

    render() {
        return (
            <div className="musicFolder">
                <div className="folderList" ref="folderList">
                    <p className="intro">推荐</p>
                    <div className="paiHangBang" onClick={this.loadHeJi.bind(this)}>梦想的声音 合集</div>
                    <div className="paiHangBang" onClick={this.loadKuGouHuaYu.bind(this)}>酷狗华语排行榜</div>
                    <div className="paiHangBang" onClick={this.loadKuGouYueYu.bind(this)}>酷狗粤语排行榜</div>
                    <div className="paiHangBang" onClick={this.loadCunYinYue.bind(this)}>纯音乐</div>
                </div>
                <div className="smallWindow button" onClick={this.openBigWindow.bind(this)}>
                    <img src={this.state.image}/>
                    <span>{this.state.songName.substring(0, 10)}</span>
                    <span>{this.state.singername.substring(0, 10)}</span>
                </div>
            </div>
        )
    }
}