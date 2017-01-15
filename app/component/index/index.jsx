'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../header/header.jsx';
import Content from '../content/content.jsx';
import Footer from '../footer/footer.jsx';
import './style.css';

export default class Index extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <div className="index lrh-message">
                <Header />
                <Content />
                <Footer />
            </div>
        )
    }
}