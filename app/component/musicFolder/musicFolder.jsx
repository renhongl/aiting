'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';
const electron = window.require('electron');
const fs = window.require('fs');


export default class MusicFolder extends Component {
    constructor() {
        super();
        this.ipcRenderer = electron.ipcRenderer;
        this.state = {
            image: './static/images/panda.jpg',
            songName: '',
            singername: '',
            path: ''
        }
    }

    componentDidMount() {
        $.subscribe('selectedOneMusic', (o, args) => {
            this.showSmallDetail(args.hash);
        });

        $.subscribe('listBySearch', () => {
            let folderList = $(this.refs.folderList);
            folderList.find('.paiHangBang').removeClass('selected');
        });
    }

    addSelectedClass(e) {
        let folderList = $(this.refs.folderList);
        folderList.find('.paiHangBang').removeClass('selected');
        $(e.target).addClass('selected');
    }

    showSmallDetail(hash) {
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
            },
            error: (error) => {
                new Message('warning', '小窗口显示错误');
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
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(function () {
            new Message('warning', '歌曲加载失败，请重新点击。');
        });
    }

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
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(function () {
            new Message('warning', '歌曲加载失败，请重新点击。');
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
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(function () {
            new Message('warning', '歌曲加载失败，请重新点击。');
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
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(function () {
            new Message('warning', '歌曲加载失败，请重新点击。');
        });
    }

    openBigWindow() {
        $.publish('openBigWindow');
    }

    showOpenBigIcon() {
        $('.fa-expand').show();
    }

    hideOpenBigIcon() {
        $('.fa-expand').hide();
    }

    openLocalMusic() {
        this.ipcRenderer.send('openLocalMusic');
        this.ipcRenderer.on('loadedFolder', (e, args) => {
            let path = args[0];
            this.setState({path: path});
            $.publish('localPathChanged', {path: path});
            fs.readdir(path, (err, fiels) => {
                if (err) {
                    new Message('warning', '打开本地歌曲失败。');
                    return;
                } else {
                    this.showLocalMusic(fiels);
                }
            });
        });
    }

    showLocalMusic(fiels) {
        let songs = {
            data: {
                info: []
            }
        };
        $.each(fiels, (i, fullName) => {
            let music = {
                songname: fullName.split(' - ')[0],
                singername: fullName.split(' - ')[1].split('.mp3')[0],
                hash: 'local' + i,
                album_name: '',
                duration: '',
                data: this.state.path + '/' + fullName
            };
            songs.data.info.push(music);
        });
        $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
    }

    render() {
        return (
            <div className="musicFolder">
                <div className="folderList" ref="folderList">
                    <p className="intro">推荐</p>
                    <div className="paiHangBang" onClick={this.loadHeJi.bind(this)}>梦想的声音 合集</div>
                    <div className="paiHangBang" onClick={this.loadKuGouHuaYu.bind(this)}>华语排行榜</div>
                    <div className="paiHangBang" onClick={this.loadKuGouYueYu.bind(this)}>粤语排行榜</div>
                    <div className="paiHangBang" onClick={this.loadCunYinYue.bind(this)}>纯音乐</div>
                    <p className="intro">我的音乐</p>
                    <div className="paiHangBang" onClick={this.openLocalMusic.bind(this)}>本地歌曲</div>
                    <div className="paiHangBang" onClick={this.loadHeJi.bind(this)}>我喜欢的音乐</div>
                </div>
                <div className="smallWindow button" onClick={this.openBigWindow.bind(this)} onMouseEnter={this.showOpenBigIcon.bind(this)} onMouseLeave={this.hideOpenBigIcon.bind(this)}>
                    <i className="fa fa-expand" aria-hidden="true"></i>
                    <img src={this.state.image} />
                    <span style={{ fontSize: 'bold' }}>{this.state.songName.substring(0, 10)}</span>
                    <span>{this.state.singername.substring(0, 10)}</span>
                </div>
            </div>
        )
    }
}