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
            songName: '未知',
            singername: '未知',
            path: '',
            folderList: []
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

        this.loadMusicFolder();
    }

    loadMusicFolder() {
        let url = 'http://www.kugou.com/yy/special/index/1-0-1.html';
        $.get(url, (result) => {
            let $li = $(result).find('#ulAlbums li');
            let list = [];
            $.each($li, (i, item) => {
                let folder = {
                    title: $(item).find('a').attr('title'),
                    url: $(item).find('a').attr('href'),
                }
                list.push(folder);
            });
            if(list.length > 10){
                list.length = 10;
            }
            this.setState({ folderList: list });
        }).fail(function () {
            new Message('warning', '载入歌曲分类失败。');
        });
    }

    addSelectedClass(e) {
        let folderList = $(this.refs.folderList);
        folderList.find('.paiHangBang').removeClass('selected');
        $(e.target).addClass('selected');
        $.publish('closeDashboard');
    }

    showSmallDetail(hash) {
        if (hash.indexOf('local') !== -1) {
            this.setState({ image: './static/images/panda.jpg' });
            this.setState({ songName: $('#' + hash).attr('data').split(' - ')[0].split('/')[1] });
            this.setState({ singername: $('#' + hash).attr('data').split(' - ')[1].split('.mp3')[0] });
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

    loadKuGouFengLei(e) {
        this.addSelectedClass(e);
        let url = $(e.target).attr('data');
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

    openLocalMusic(e) {
        this.addSelectedClass(e);
        this.ipcRenderer.send('openLocalMusic');
        this.ipcRenderer.on('loadedFolder', (e, args) => {
            let path = args[0];
            this.setState({ path: path });
            $.publish('localPathChanged', { path: path });
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
            if (fullName.indexOf('.mp3') !== -1) {
                let music = {
                    songname: fullName.split(' - ')[0],
                    singername: fullName.split(' - ')[1].split('.mp3')[0],
                    hash: 'local' + i,
                    album_name: '',
                    duration: '',
                    data: this.state.path + '/' + fullName
                };
                songs.data.info.push(music);
            }
        });
        $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
    }

    parseString(str) {
        if (str.length > 8) {
            return str.substring(0, 8) + '...';
        } else {
            return str;
        }
    }

    openLoveMusic(e) {
        this.addSelectedClass(e);
        $.get('./static/love.txt', (result) => {
            let loveMusic = result.split('\n');
            loveMusic.length = loveMusic.length - 1;
            let songs = {
                data: {
                    info: []
                }
            };
            for (let i = 0; i < loveMusic.length; i++) {
                let one = JSON.parse(loveMusic[i]);
                let music = {
                    songname: one.songName,
                    singername: one.singerName,
                    hash: one.hash,
                    album_name: '',
                    duration: '',
                    loved: true
                };
                songs.data.info.push(music);
            }
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(function () {
            new Message('warning', '载入喜欢的歌曲失败。');
        });
    }

    render() {
        let folderList = this.state.folderList.map((folder, i) => {
            return (
                <div key={i} title={folder.title} className="paiHangBang" onClick={this.loadKuGouFengLei.bind(this)} data={folder.url}>{this.parseString(folder.title)}</div>
            )
        });
        return (
            <div className="musicFolder">
                <div className="folderList" ref="folderList">
                    <p className="intro">推荐</p>
                    {folderList}
                    <p className="intro">我的音乐</p>
                    <div className="paiHangBang" onClick={this.openLocalMusic.bind(this)}><i className="fa fa-folder-open" aria-hidden="true"></i>本地歌曲</div>
                    <div className="paiHangBang" onClick={this.openLoveMusic.bind(this)}><i className="fa fa-heart" aria-hidden="true"></i>我喜欢的音乐</div>
                </div>
                <div className="smallWindow button" onClick={this.openBigWindow.bind(this)} onMouseEnter={this.showOpenBigIcon.bind(this)} onMouseLeave={this.hideOpenBigIcon.bind(this)}>
                    <i className="fa fa-expand" aria-hidden="true"></i>
                    <img src={this.state.image} />
                    <span style={{ fontWeight: 'bold' }}>{this.state.songName.substring(0, 10)}</span>
                    <span>{this.state.singername.substring(0, 10)}</span>
                </div>
            </div>
        )
    }
}