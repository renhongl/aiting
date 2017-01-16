'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            height: '100%'
        }
    }

    componentDidMount() {
        $.subscribe('closeDashboard', () => {
            $('.dashboard').hide();
        });
    }

    render() {
        return (
            <div className="dashboard">
                <p>欢迎使用爱听播放器<br/>现在你可以通过左边的歌曲分组选择音乐播放<br/>或者在头部使用搜索框搜索歌曲</p>
                <p>主页功能开发中。。。</p>
            </div>
        )
    }
}