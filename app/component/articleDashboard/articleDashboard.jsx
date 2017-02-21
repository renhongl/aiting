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
            bookList: [],
            id: ''
        }
    }

    componentDidMount() {
        $.subscribe('closeArticleDashboard', () => {
            $('.articleDashboard').hide();
        });

        $.subscribe('showArticleDashboard', () => {
            $('.articleDashboard').show();
        });

        $.subscribe('goToThisPage', (o, args) => {
            this.goToPage(JSON.parse(args.data));
        });

        $('.defaultBookList').click();
    }

    goToPage(data) {
        let id = this.state.id;
        let url = 'http://www.lrts.me/ajax/playlist/2/' + id + '/' + data.from;
        $.get(url, (result) => {
            let $li = $(result).find('.section-item');
            let total;
            if(!$($(result).find('div')[0]).find('span')[1]){
                total = 10;
            }else {
                total = $($(result).find('div')[0]).find('span')[1].innerText;
            }
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('span')[1].innerText,
                    singername: $(item).find('.column2')[1].innerText,
                    hash: 'article' + i,
                    album_name: '',
                    duration: Number($(item).find('.column3')[0].innerText),
                    data: $(item).find('input')[0].value,
                    total: Number(total),
                    current: data.page
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
        }).fail(() => {
            new Message('warning', '显示章节失败，请重新选择。');
        });
    }

    openThisArticleList(e) {
        let id = $(e.target).parent().attr('data');
        this.setState({ id: id });
        let url = 'http://www.lrts.me/ajax/playlist/2/' + id + '/1';
        let name = $(e.target).attr('data');
        $.get(url, (result) => {
            let $li = $(result).find('.section-item');
            let total;
            if(!$($(result).find('div')[0]).find('span')[1]){
                total = 10;
            }else{  
                total = $($(result).find('div')[0]).find('span')[1].innerText;
            }
            let songs = {
                data: {
                    info: []
                }
            };
            $.each($li, (i, item) => {
                let music = {
                    songname: $(item).find('span')[1].innerText,
                    singername: $(item).find('.column2')[1].innerText,
                    hash: 'article' + i,
                    album_name: '',
                    duration: Number($(item).find('.column3')[0].innerText),
                    data: $(item).find('input')[0].value,
                    total: Number(total),
                    current: 1
                };
                songs.data.info.push(music);
            });
            $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
            $.publish('closeArticleDashboard');
            $.publish('changeSongName', { songName: name });
            $.publish('listBySearch');
        }).fail(() => {
            new Message('warning', '显示章节失败，请重新选择。');
        });
    }

    searchArticle(e) {
        if (e.keyCode === 13) {
            let input = $('.articleSearch').val();
            let url = 'http://www.lrts.me/search/book/' + input;
            $.get(url, (result) => {
                let $li = $(result).find('.book-item');
                let bookList = [];
                $.each($li, (i, item) => {
                    let book = {
                        id: $(item).find('.btn-collection').attr('entityId'),
                        image: $(item).find('img').attr('src'),
                        name: $(item).find('.book-item-name').text(),
                        anchor: $(item).find('.author').text()
                    }
                    bookList.push(book);
                });
                this.setState({ bookList: bookList });
                $(".articlecNavbar li").removeClass('selectedNavbar');
            }).fail(() => {
                new Message('warning', '搜索小说失败，请重试。');
            });
        }
    }

    loadTuiJian(e) {
        this.addSelectedClass(e);
        let url = 'http://www.lrts.me/explore/album';
        $.get(url, (result) => {
            let $li = $(result).find('.album-list li');
            let bookList = [];
            $.each($li, (i, item) => {
                let book = {
                    id: $(item).find('.album-item-name').attr('href').split('/')[2],
                    image: $(item).find('img').attr('src'),
                    name: $(item).find('.album-item-name').text(),
                    anchor: $(item).find('.author').text()
                }
                bookList.push(book);
            });
            this.setState({ bookList: bookList });
        }).fail(function () {
            new Message('warning', '载入推荐失败，请重新点击。');
        });
    }

    loadWenXueMingZhu(e) {
        this.addSelectedClass(e);
        let url = 'http://www.lrts.me/book/category/78';
        $.get(url, (result) => {
            let $li = $(result).find('ul.clearfix li');
            let bookList = [];
            $.each($li, (i, item) => {
                let book = {
                    id: $(item).find('.book-item-name').attr('href').split('/')[2],
                    image: $(item).find('img').attr('src'),
                    name: $(item).find('.book-item-name').text(),
                    anchor: $(item).find('.author').text()
                }
                bookList.push(book);
            });
            this.setState({ bookList: bookList });
        }).fail(function () {
            new Message('warning', '载入推荐失败，请重新点击。');
        });
    }

    addSelectedClass(e) {
        $(".articlecNavbar li").removeClass('selectedNavbar');
        $(e.target).addClass('selectedNavbar');
    }

    render() {
        let articleList = this.state.bookList.map((article, i) => {
            return (
                <li key={i} data={article.id}>
                    <img src={article.image} data={article.name} onClick={this.openThisArticleList.bind(this)} />
                    <p title={article.name + ' 作者: ' + article.anchor} className="folderTitle">{article.name} 作者: {article.anchor}</p>
                </li>
            )
        })
        return (
            <div className="articleDashboard">
                <input className="articleSearch" placeholder="搜索小说, 相声" onKeyUp={this.searchArticle.bind(this)} />
                <ul className="articlecNavbar">
                    <li className="selectedNavbar defaultBookList" onClick={this.loadTuiJian.bind(this)}>主编推荐</li>
                    <li onClick={this.loadWenXueMingZhu.bind(this)}>文学名著</li>
                </ul>
                <ul className="articleList">{articleList}</ul>
            </div>
        )
    }
}