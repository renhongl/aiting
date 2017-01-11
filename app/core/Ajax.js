'use strict';

class Ajax {

    load(url) {
        let promise = new Promise(function(resovle, reject) {
            let client = new XMLHttpRequest();
            client.open('GET', url);
            client.responseType = 'html';
            client.setRequestHeader('Accept', 'application/json');
            client.onreadystatechange = function() {
                if(client.readyState !== 4){
                    return;
                }
                if(client.status === 200){
                    resovle(client.response);
                }else{
                    reject(new Error(client.responseText));
                }
            };
            client.send();
        });
        return promise; 
    }

    get(url) {
        let promise = new Promise(function(resovle, reject) {
            let client = new XMLHttpRequest();
            client.open('GET', url);
            client.responseType = 'json';
            client.setRequestHeader('Accept', 'application/json');
            client.onreadystatechange = function() {
                if(client.readyState !== 4){
                    return;
                }
                if(client.status === 200){
                    resovle(client.response);
                }else{
                    reject(new Error(client.responseText));
                }
            };
            client.send();
        });
        return promise; 
    }

    post(url, postData) {
        let promise = new Promise(function(resovle, reject) {
            let client = new XMLHttpRequest();
            client.open('POST', url);
            client.responseType = 'json';
            client.setRequestHeader('Accept', 'application/json');
            client.setRequestHeader('Content-Type', 'application/json');
            client.onreadystatechange = function() {
                if (client.readyState !== 4) {
                    return;
                }
                if (client.status === 200) {
                    resovle(client.response);
                } else {
                    reject(new Error(client.responseText));
                }
            };
            if (typeof postData !== 'string') {
                postData = JSON.stringify(postData);
            }
            client.send(postData);
        });
        return promise;
    }

}

let ajax = new Ajax();
export default ajax;