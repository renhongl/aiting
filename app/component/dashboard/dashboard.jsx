'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            folderList: []
        }
    }

    componentDidMount() {
        $.subscribe('closeDashboard', () => {
            $('.dashboard').hide();
        });

        $.subscribe('showDashboard', () => {
            $('.dashboard').show();
        });

        this.loadTuiJianFolder();
    }

    loadTuiJianFolder() {
        let url = 'http://www.kugou.com/yy/special/index/1-0-1.html';
        $.get(url, (result) => {
            let $li = $(result).find('#ulAlbums li');
            let list = [];
            $.each($li, (i, item) => {
                let folder = {
                    title: $(item).find('a').attr('title'),
                    url: $(item).find('a').attr('href'),
                    image: $(item).find('img').attr('_src')
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

    loadMusicList(e) {
        let url = $(e.target).parent().attr('data');
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
            $.publish('closeDashboard');
        }).fail(function () {
            new Message('warning', '歌曲加载失败，请重新点击。');
        });
    }

    render() {
        let folderList = this.state.folderList.map((folder, i) => {
            return (
                <li className="oneFolder" key={i} data={folder.url} onClick={this.loadMusicList.bind(this)}>
                    <img src={folder.image} />
                    <p>{folder.title}</p>
                </li>
            )
        });
        return (
            <div className="dashboard">
                <ul className="musicNavbar">
                    <li className="selectedNavbar" onClick={this.loadTuiJianFolder.bind(this)}>个性推荐</li>
                    <li>热门歌手</li>
                    <li>新歌</li>
                </ul>
                <ul>{folderList}</ul>
            </div>
        )
    }
}