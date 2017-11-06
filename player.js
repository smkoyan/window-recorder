const Player = {
    eventsData: null,

    mousePointer: null,

    windowHeight: null,

    windowWidth: null,

    lastX: null,

    lastY: null,

    lastFocusedInput: null,

    init: function (options) {
        this.eventsData = options.eventsData;
        this.mousePointer = options.mousePointer;
    },

    play: function () {
        this.runEvent();
    },

    eventsHandlers: {
        'mousemove': function (eventData) {
            const _this = this;

            _this.mousePointer.style.left = ((_this.lastX = eventData.x) + 1) /* x scale */ + 'px';
            _this.mousePointer.style.top = ((_this.lastY = eventData.y) + 1) /* x scale */ + 'px';
        },

        'click': function (eventData) {
            const _this = this;
            const INPUT_TAG = 'INPUT';

            const target = document.elementFromPoint(_this.lastX, _this.lastY);
            if (target.tagName !== INPUT_TAG) {
                target.click();
            }
        },

        'scroll': function (eventData) {
            window.scrollTo(0, eventData.scrollTop);
        },

        'focus': function (eventData) {
            const _this = this;

            _this.lastFocusedInput = document.elementFromPoint(_this.lastX, _this.lastY);
            _this.lastFocusedInput.focus();
        },

        'input': function (eventData) {
            const _this = this;

            switch (eventData.inputType) {
                case 'insertText':
                    if (_this.lastFocusedInput.type === 'password') {
                        _this.lastFocusedInput.value += '*';
                    } else {
                        _this.lastFocusedInput.value += eventData.data;
                    }
                    break;
                case 'deleteContentBackward':
                    _this.lastFocusedInput.value = _this.lastFocusedInput.value.slice(0, -2);
                    break;
            }
        }
    },

    runEvent: function (eventNumber = 0) {
        const _this = this;


        const eventData = _this.eventsData[eventNumber];
        _this.eventsHandlers[eventData.type].call(_this, eventData);

        if (_this.eventsData.length - 1 >= eventNumber + 1) {
            setTimeout(function () {
                _this.runEvent(eventNumber + 1);
            }, _this.eventsData[eventNumber + 1].timestamp - eventData.timestamp);
        }
    }
};