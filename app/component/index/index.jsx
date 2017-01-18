'use strict';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from '../header/header.jsx';
import Content from '../content/content.jsx';
import Footer from '../footer/footer.jsx';
import Dashboard from '../dashboard/dashboard.jsx';
import ArticleDashboard from '../articleDashboard/articleDashboard.jsx';
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
                <Dashboard />
                <ArticleDashboard />
                <Content />
                <Footer />
            </div>
        )
    }
}