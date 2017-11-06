const WindowRecorder = {
    eventsToListen: [
        'mousemove',
        'click',
        'scroll',
        'input',
        'focus'
    ],

    eventsDataBuffer: [],

    init: function () {
        this.initEventListeners();
    },

    initEventListeners: function () {
        const _this = this;

        let useCapture = null;
        _this.eventsToListen.forEach(function (event) {
            useCapture = (event === 'focus' || event === 'blur');

            document.addEventListener(event, _this.saveEventData.bind(_this), useCapture);
        });
    },

    eventsHandlers: {
        'mousemove': function (eventData) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: eventData.type,
                x: event.clientX,
                y: event.clientY,
            });
        },

        'click': function (eventData) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: eventData.type,
            });
        },

        'scroll': function (eventData) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: eventData.type,
                scrollTop: eventData.pageYOffset
            });
        },

        'input': function (eventData) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: eventData.type,
                inputType: eventData.inputType,
                data: eventData.data
            });
        },

        'focus': function (eventData) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: eventData.type
            });
        }
    },

    saveEventData: function (eventData) {
        this.eventsHandlers[event.type].call(this, eventData);
    }
};


WindowRecorder.init();


/*
// Player testing
setTimeout(function () {
    Player.init({eventsData: WindowRecorder.eventsDataBuffer, mousePointer: document.getElementById('mousePointer')})
    Player.play();
}, 20000);
*/
