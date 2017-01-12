'use strict';

import $ from 'jquery';

class Observer {
    constructor() {
        let O = $({});
        $.extend({
            publish(topic, data) {
                O.trigger(topic, data);
            },
            subscribe(topic, callback){
                O.on(topic, callback)
            },
            unsubscribe(topic) {
                O.off(topic);
            }
        });
    }
}

let observer = new Observer();
export default observer;
