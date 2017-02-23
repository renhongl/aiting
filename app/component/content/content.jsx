'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import MusicList from '../musicList/musicList.jsx';
import MusicFolder from '../musicFolder/musicFolder.jsx';
import MusicDetail from '../musicDetail/musicDetail.jsx';
import Setting from '../setting/setting.jsx';

export default class Content extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="content">
                <MusicFolder />
                <MusicList />
                <MusicDetail />
                <Setting />
            </div>
        )
    }
}