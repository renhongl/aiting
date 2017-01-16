'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
const electron = window.require('electron');
import $ from 'jquery';
import Message from 'lrh-message';

export default class Header extends Component {
    constructor() {
        super();
        this.ipcRenderer = electron.ipcRenderer;
    }

    closeWindow() {
        this.ipcRenderer.send('closeWindow');
    }

    minWindow() {
        this.ipcRenderer.send('minMainWindow');
    }

    searchMusic(e) {
        if (e.keyCode === 13) {
            let value = this.refs.searchInput.value;
            let url = '';
            if(value.indexOf('/小说') !== -1){
                url = 'http://www.kting.cn/html/search.html?keyword=' + value;
            }else{
                url = `http://mobilecdn.kugou.com/api/v3/search/song?format=jsonp&keyword=${value}&page=1&pagesize=30&showtype=1&callback=kgJSONP238513750<span style="white-space:pre"></span>`;
            }
            $.ajax({
                url: url,
                method: 'GET',
                contentType: 'json',
                success: (result) => {
                    result = result.substring(1, result.length -1);
                    $.publish('showMusicByThisList', {result: result});
                    $.publish('listBySearch');
                    $.publish('closeDashboard');
                },
                error: (error) => {
                    new Message('warning', '搜索歌曲失败，请重新搜索。');
                }
            })
        }else{
            //console.log(e.keyCode);
        }
    }

    render() {
        return (
            <div className="header">
                <div className="title"><i className="fa fa-assistive-listening-systems" aria-hidden="true"></i><span>爱 听</span></div>
                <div className="searchDiv"><input type="text" placeholder="搜索歌名, 歌手, 歌词" onKeyUp={this.searchMusic.bind(this)} ref="searchInput" /></div>
                <div className="controlContainer">
                    <div className="setting"><i className="fa fa-cog" aria-hidden="true" title="设置"></i></div>
                    <div className="console"><i className="fa fa-chain-broken" aria-hidden="true" title="控制台"></i></div>
                    <div className="line"></div>
                    <div className="minus"><i className="fa fa-minus" aria-hidden="true" title="最小化" onClick={this.minWindow.bind(this)}></i></div>
                    <div className="close"><i className="fa fa-times" aria-hidden="true" title="关闭" onClick={this.closeWindow.bind(this)}></i></div>
                </div>
            </div>
        )
    }
}