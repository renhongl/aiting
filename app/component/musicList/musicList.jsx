'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';

export default class MusicList extends Component {
    constructor() {
        super();
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        $.subscribe('showMusicByThisList', (o, args) => {
            this.setState({list: JSON.parse(args.result).data.info});
        });

        $.subscribe('nextMusic', (o, args) => {
            $('#' + args.hash).next().click();
            $('.listItem li').removeClass('selected');
            $('#' + args.hash).next().addClass('selected');
        });

        $.subscribe('randomMusic', () => {
            let number = Math.floor(Math.random() * $('.listItem li').length);
            $(`.listItem li:eq(${number})`).click();
            $('.listItem li').removeClass('selected');
            $(`.listItem li:eq(${number})`).addClass('selected');
        });
    }

    selectedOneMusic(e) {
        let hash = e.target.id || e.target.parentNode.id;
        $('.listItem li').removeClass('selected');
        $(e.target.parentNode).addClass('selected');
        $.publish('selectedOneMusic', {hash: hash});
    }

    render() {
        let musicList = this.state.list.map((music) => {
            return (
                <li key={music.hash} id={music.hash} className="button" onClick={this.selectedOneMusic.bind(this)}>
                    <span style={{fontWeight:'bold',width: '40%'}}>{music.songname}</span><span>{music.singername}</span><span>{music.album_name}</span><span style={{width: '10%'}}>{music.duration}</span>
                </li>
            )
        });
        return (
            <div className="musicList">
                <div className="musicTitle"><span style={{fontWeight:'bold',width: '40%'}}>音乐标题</span><span>歌手</span><span>专辑</span><span style={{width: '10%'}}>时长</span></div>
                <ul className="listItem">
                    {musicList}
                </ul>
            </div>
        )
    }
}