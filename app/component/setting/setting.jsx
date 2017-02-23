'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

export default class Setting extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="settingWindow" >
                服务器地址: <input />
                <input type="button" value="连接"/>
            </div>
        )
    }
}