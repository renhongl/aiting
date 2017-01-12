'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
const electron = window.require('electron');

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

    render() {
        return (
            <div className="header">
                <div className="title"><i className="fa fa-assistive-listening-systems" aria-hidden="true"></i><span>爱听</span></div>
                <div className="searchDiv"><input type="text" placeholder="搜索歌曲"/></div>
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