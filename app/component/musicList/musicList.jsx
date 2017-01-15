'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import $ from 'jquery';
const fs = window.require('fs');
import Message from 'lrh-message';

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
            let hash = $('#' + args.hash).next().attr('id');
            $('.listItem li').removeClass('selected');
            $('#' + args.hash).next().addClass('selected');
            this.changeOneMusic(hash);
        });

        $.subscribe('lastMusic', (o, args) => {
            let hash = $('#' + args.hash).prev().attr('id');
            $('.listItem li').removeClass('selected');
            $('#' + args.hash).prev().addClass('selected');
            this.changeOneMusic(hash);
        });

        $.subscribe('randomMusic', () => {
            let number = Math.floor(Math.random() * $('.listItem li').length);
            let hash = $(`.listItem li:eq(${number})`).attr('id');
            $('.listItem li').removeClass('selected');
            $(`.listItem li:eq(${number})`).addClass('selected');
            this.changeOneMusic(hash);
        });
    }

    changeOneMusic(hash) {
        $('.listItem li').removeClass('selected');
        $('.fa-headphones').remove();
        $('.musicIndex').show();
        $('#' + hash).addClass('selected');
        $($('#' + hash).get(0).firstChild).hide();
        $('#' + hash).prepend('<i class="fa fa-headphones" aria-hidden="true"></i>');
        $.publish('selectedOneMusic', {hash: hash});
    }

    selectedOneMusic(e) {
        let hash = e.target.id || e.target.parentNode.id;
        $('.listItem li').removeClass('selected');
        $('.fa-headphones').remove();
        $('.musicIndex').show();
        $(e.target.parentNode).addClass('selected');
        $(e.target.parentNode.firstChild).hide();
        $(e.target.parentNode).prepend('<i class="fa fa-headphones" aria-hidden="true"></i>');
        $.publish('selectedOneMusic', {hash: hash});
    }

    addSelectedClass(e) {
        let hash = e.target.id || e.target.parentNode.id;
        $('.listItem li').removeClass('selected');
        $(e.target.parentNode).addClass('selected');
    }

    addZero(n) {
        return n < 10 ? '0' + n + '\t' : n + '\t';
    }

    parseTime(str) {
        if(!str){
            return '';
        }
        let number = Number(str);
        let minutes = parseInt(number / 60);
        let seconds = number % 60;
        return this.addZero(minutes) + ' : ' + this.addZero(seconds);
    }

    addToLove(e) {
        let $li = $(e.target).parent();
        let music = {
            hash: $li.attr('id'),
            songName: $li.find('.songName').attr('title'),
            singerName: $li.find('.singerName').text()
        };
        fs.appendFile('./resources/app/build/static/love.txt', JSON.stringify(music) + '\n');
        new Message('success', '歌曲已经加入喜欢歌曲列表。');
    }

    render() {

        let musicList = this.state.list.map((music, index) => {
            let love;
            if(music.loved || music.hash.indexOf('local') !== -1){
                love = (<i className="fa fa-heart addToLove loved" aria-hidden="true" onClick={this.addToLove.bind(this)}></i>);
            }else{
                love = (<i className="fa fa-heart addToLove" aria-hidden="true" onClick={this.addToLove.bind(this)}></i>)
            }
            return (
                <li key={music.hash} id={music.hash} data={music.data} className="button" onDoubleClick={this.selectedOneMusic.bind(this)} onClick={this.addSelectedClass.bind(this)}>
                    <span className="musicIndex" style={{width: '3%', paddingLeft: '5px'}}>{this.addZero(index + 1)}</span>
                    <span className="songName" title={music.songname} style={{fontWeight:'bold',width: '40%'}}>{ music.songname.substring(0, 15)}</span>
                    <span className="singerName" style={{width: '25%', paddingLeft: '25px'}}>{music.singername}</span>
                    <span title={music.album_name} >{music.album_name.substring(0, 10)}</span>
                    <span style={{width: '10%'}}>{this.parseTime(music.duration)}</span>
                    {love}
                </li>
            )
        });
        return (
            <div className="musicList">
                <div className="musicTitle">
                    <span style={{fontWeight:'bold',width: '43%', paddingLeft: '30px'}}>音乐标题</span>
                    <span style={{width: '26%'}}>歌手</span>
                    <span style={{width: '26%'}}>专辑</span>
                    <span style={{width: '11%'}}>时长</span>
                </div>
                <ul className="listItem">
                    {musicList}
                </ul>
            </div>
        )
    }
}