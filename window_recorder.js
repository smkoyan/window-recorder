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
        'mousemove': function (event) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: event.type,
                x: event.clientX,
                y: event.clientY,
            });
        },

        'click': function (event) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: event.type,
            });
        },

        'scroll': function (event) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: event.type,
                scrollTop: event.pageYOffset
            });
        },

        'input': function (event) {
            const eventData = {
                timestamp: Date.now(),
                type: event.type,
                inputType: event.inputType,
            };

            if (event.type === 'password') {
                eventData.valueLength = event.target.value.length;
            } else {
                eventData.value = event.target.value;
            }

            this.eventsDataBuffer.push(eventData);
        },

        'focus': function (event) {
            this.eventsDataBuffer.push({
                timestamp: Date.now(),
                type: event.type
            });
        }
    },

    saveEventData: function (event) {
        this.eventsHandlers[event.type].call(this, event);
    }
};


WindowRecorder.init();


/*// Player testing
setTimeout(function () {
    Player.init({eventsData: WindowRecorder.eventsDataBuffer, mousePointer: document.getElementById('mousePointer')});
    Player.play();
}, 20000);*/
