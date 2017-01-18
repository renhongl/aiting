'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
import Message from 'lrh-message';

export default class ArticleList extends Component {
    constructor() {
        super();
        this.state = {
            list: [],
            article: ''
        }
    }

    componentDidMount() {
        $.subscribe('showThisArticleList', (o, args) => {
            this.setState({list: args.obj.list});
            this.setState({article: args.obj.name});
        });

        $.subscribe('closeArticleDList', () => {
            $('.thisArticleList').hide();
        });

        $.subscribe('showArticleList', () => {
            $('.thisArticleList').show();
        });
    }

    playOneArticle(e) {
        let url = $(e.target).parent().attr('id');
        let data = $(e.target).parent().attr('data');
        $('.oneArticle').removeClass('selectedOne');
        $(e.target).parent().addClass('selectedOne');
        $.publish('thisArticleDetail', {one: JSON.parse(data)});
        $.publish('playThisArticle', {url: url});
    }

    render() {
        let list = this.state.list.map((one, i) => {
            let data = {
                title: one.section_title,
                updateTime: one.updateTime
            };
            return (
                <li className="oneArticle" key={i} id={one.audio} data={JSON.stringify(data)}>
                    <span style={{width: '30%',paddingLeft: '20px', fontSize: '14px'}}>{this.state.article}: {one.section_title}</span>
                    更新时间: <span>{one.updateTime}</span>
                    <i className="fa fa-heart" aria-hidden="true" onClick={this.playOneArticle.bind(this)}></i>
                </li>
            )
        })
        return (
            <div className="thisArticleList">
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}