'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';

export default class Dashboard extends Component {
    constructor() {
        super();
        this.current = 1;
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

        $('.defaultSelected').click();
    }

    loadTuiJianFolder(page) {
        if (typeof page !== 'number') {
            this.addSelectedClass(page);
            page = 1;
        }
        this.current = page;
        let url = 'http://www.kugou.com/yy/special/index/' + page + '-0-1.html';
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
            if (list.length > 10) {
                list.length = 10;
            }
            this.setState({ folderList: list });
        }).fail(function () {
            new Message('warning', '载入歌曲分类失败。');
        });
    }

    goToThisMusicList(e) {
        let page = $(e.target).text();
        this.loadTuiJianFolder(Number(page));
    }

    loadMusicList(e) {
        let url = $(e.target).parent().attr('data');
        if (url.indexOf('singer') !== -1) {
            let value = $(e.target).next().text();
            let url = `http://mobilecdn.kugou.com/api/v3/search/song?format=jsonp&keyword=${value}&page=1&pagesize=30&showtype=1&callback=kgJSONP238513750<span style="white-space:pre"></span>`;
            $.ajax({
                url: url,
                method: 'GET',
                contentType: 'json',
                success: (result) => {
                    result = result.substring(1, result.length - 1);
                    $.publish('showMusicByThisList', { result: result });
                    $.publish('listBySearch');
                    $.publish('closeDashboard');
                    $.publish('closeArticleDashboard');
                },
                error: (error) => {
                    new Message('warning', '搜索歌曲失败，请重新搜索。');
                }
            })
        } else {
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
                $.publish('listBySearch');
            }).fail(function () {
                new Message('warning', '歌曲加载失败，请重新点击。');
            });
        }
    }

    loadSinger(e) {
        this.addSelectedClass(e);
        let url = 'http://www.kugou.com/yy/html/singer.html';
        $.get(url, (result) => {
            let $li = $(result).find('#list_head li');
            let list = [];
            $.each($li, (i, item) => {
                let folder = {
                    title: $(item).find('a').attr('title'),
                    url: 'singer' + i,
                    image: $(item).find('img').attr('_src')
                }
                list.push(folder);
            });
            this.setState({ folderList: list });
        }).fail(function () {
            new Message('warning', '加载热门歌手失败，请尝试重新点击。');
        });
    }

    addSelectedClass(e) {
        $('.musicNavbar li').removeClass('selectedNavbar');
        $(e.target).addClass('selectedNavbar');
    }

    render() {
        let current = this.current;
        let page = [];
        if (this.state.folderList[0] && this.state.folderList[0].url.indexOf('singer') === -1) {
            for (let i = 0; i < 5; i++) {
                if (i + 1 === current) {
                    page.push(<li key={Math.random()} className="musicCurrentPage">{i + 1}</li>);
                } else {
                    page.push(<li key={Math.random()} onClick={this.goToThisMusicList.bind(this)}>{i + 1}</li>);
                }
            }
        }

        let folderList = this.state.folderList.map((folder, i) => {
            return (
                <li className="oneFolder" key={i} data={folder.url}>
                    <img style={{width:'150px',height:'150px'}} src={folder.image} onClick={this.loadMusicList.bind(this)} />
                    <p className="folderTitle" title={folder.title}>{folder.title}</p>
                </li>
            )
        });
        return (
            <div className="dashboard">
                <ul className="musicNavbar">
                    <li className="selectedNavbar defaultSelected" onClick={this.loadTuiJianFolder.bind(this)}>个性推荐</li>
                    <li onClick={this.loadSinger.bind(this)}>热门歌手</li>
                </ul>
                <ul>{folderList}</ul>
                <ul className="musicPagination">
                    {page}
                </ul>
            </div>
        )
    }
}