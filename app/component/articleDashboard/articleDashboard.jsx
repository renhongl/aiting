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
            bookList: []
        }
    }

    componentDidMount() {
        $.subscribe('closeArticleDashboard', () => {
            $('.articleDashboard').hide();
        });

        $.subscribe('showArticleDashboard', () => {
            $('.articleDashboard').show();
        });

        this.loadTuiJian();
    }

    loadTuiJian() {
        let url = 'http://www.kting.cn/recommend/getRecommendIndex';
        $.ajax({
            url: url,
            method: 'POST',
            success: (result) => {
                let list = result.categoryList[0].contentList;
                this.setState({ bookList: list });
            },
            error: (err) => {
                new Message('warning', '载入小说列表失败。');
            }
        })
    }

    openThisArticleList(e) {
        let id = $(e.target).parent().attr('data');
        let url = 'http://www.kting.cn/book/getBookArticleList';
        let name = $(e.target).attr('data');
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: 'id=' + id + '&page=1&pageSize=30',
            success: (result) => {
                let list = result.bookArticleList;
                let songs = {
                    data: {
                        info: []
                    }
                };
                $.each(list, (i, article) => {
                    let music = {
                        songname: article.section_title,
                        singername: '',
                        hash: 'article' + i,
                        album_name: '',
                        duration: '',
                        data: article.audio
                    };
                    songs.data.info.push(music);
                });
                $.publish('showMusicByThisList', { result: JSON.stringify(songs) });
                $.publish('closeArticleDashboard');
                $.publish('changeSongName', { songName: name });
            },
            error: (err) => {
                new Message('warning', '显示章节失败，请重新选择。');
            }
        })
    }

    searchArticle(e) {
        if (e.keyCode === 13) {
            let input = $('.articleSearch').val();
            let url = 'http://www.kting.cn/book/searchBook';
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                data: 'keyword=' + input + '&sortField=0&bookStatus=0&pageSize=10&page=1',
                success: (result) => {
                    this.setState({ bookList: result.bookSearchList });
                },
                error: (err) => {
                    new Message('warning', '搜索小说失败，请重试。');
                }
            })
        }
    }

    render() {
        let articleList = this.state.bookList.map((article, i) => {
            return (
                <li key={i} data={article.id}>
                    <img src={article.image} data={article.name} onClick={this.openThisArticleList.bind(this)} />
                    <p>{article.name} 作者: {article.anchor}</p>
                </li>
            )
        })
        return (
            <div className="articleDashboard">
                <input className="articleSearch" placeholder="搜索小说, 相声" onKeyUp={this.searchArticle.bind(this)} />
                <ul className="articlecNavbar">
                    <li className="selectedNavbar">主编推荐</li>
                    <li>有声首发</li>
                    <li>综艺</li>
                </ul>
                <ul className="articleList">{articleList}</ul>
            </div>
        )
    }
}