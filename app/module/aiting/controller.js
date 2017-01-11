'use strict';

import Ajax from '../../core/Ajax';
import Vue from 'vue';
import $ from 'jquery';
import './style.css';

export default class AiTing {
    constructor() {
        console.log('init aiting');
        this._loadTemplate();
    }

    _loadTemplate() {
        Ajax.load('../app/module/aiting/view.html').then( result => {
            $('#container').html(result);
            $('#content').height($('#container').height() - 100);
            this._createVueApp();
        });
    }

    _createVueApp() {
        this.vue = new Vue({
            el: '#aiting',
            data: {
                header: 'header',
                content: 'this is content',
                footer: 'footer'
            }
        })
    }
}