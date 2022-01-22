const Player = {
    eventsData: null,

    mousePointer: null,

    /*playerWindowHeight: null,

    playerWindowWidth: null,

    originalWindowWidth: null,

    originalWindowHeight: null,*/

    currentX: null,

    currentY: null,

    currentFocusedInput: null,

    currentHoveredElements: [],

    isHoverHandled: false,

    onend: null,

    init: function (options) {
        this.eventsData = options.eventsData;
        this.mousePointer = options.mousePointer;

        this.initElementsWithHover();
    },

    initElementsWithHover: function () {
        const _this = this;

        const selectorsWithHover = VideoContentManager.getCssSelectorsWithHover();
        const elementsWithHover = new Set();

        selectorsWithHover.forEach(function (selector) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(function (element) {
                elementsWithHover.add(element);
            });
        });

        const onhover = _this.customEventsHandlers['hover'].bind(_this);
        elementsWithHover.forEach(function (element) {
            element.addEventListener('hover', onhover);
        });
    },

    play: function (onend) {
        this.onend = onend;
        this.runEvent();
    },

    customEvents: {
        'hover': new Event('hover', {
            bubbles: true,
            cancelable: true
        }),
    },

    customEventsHandlers: {
        'hover': function (event) {
            event.stopPropagation();

            const _this = this;
            _this.isHoverHandled = true;

            const currentTarget = event.currentTarget;
            const currentHoveredElementsCount = _this.currentHoveredElements.length;

            let i = 0;
            if (currentHoveredElementsCount === 0) {
                // no hovered element
                _this.currentHoveredElements.push(currentTarget);
            } else {
                for (i = 0; i < currentHoveredElementsCount; i++) {
                    if (_this.currentHoveredElements[i].contains(currentTarget)) {
                        break;
                    }
                }

                if (i < currentHoveredElementsCount) {
                    _this.currentHoveredElements.splice(0, i).forEach(function (element) {
                        element.classList.remove('wr-hover');
                    });

                    if (currentTarget === _this.currentHoveredElements[0]) {
                        // same element hovered
                        return;
                    }

                    _this.currentHoveredElements.unshift(currentTarget);
                } else {
                    // new element hovered
                    _this.currentHoveredElements.forEach(function (element) {
                        element.classList.remove('wr-hover');
                    });

                    _this.currentHoveredElements = [currentTarget];
                }
            }
            _this.currentHoveredElements[0].classList.add('wr-hover');
        }
    },

    eventsHandlers: {
        'mousemove': function (eventData) {
            const _this = this;
            _this.mousePointer.style.left = ((_this.currentX = eventData.x) + 1) /* x scale */ + 'px';
            _this.mousePointer.style.top = ((_this.currentY = eventData.y) + 1) /* x scale */ + 'px';

            const target = document.elementFromPoint(_this.currentX, _this.currentY);
            target.dispatchEvent(_this.customEvents['hover']);

            if (!_this.isHoverHandled) {
                if (_this.currentHoveredElements.length !== 0) {
                    _this.currentHoveredElements.forEach(function (element) {
                        element.classList.remove('wr-hover');
                    });
                    _this.currentHoveredElements = [];
                }
            }

            _this.isHoverHandled = false;
        },

        'click': function () {
            const _this = this;
            const INPUT_TAG = 'INPUT';

            const target = document.elementFromPoint(_this.currentX, _this.currentY);
            if (target.tagName !== INPUT_TAG) {
                target.click();
            }
        },

        'scroll': function (eventData) {
            window.scrollTo(0, eventData.scrollTop);
        },

        'focus': function () {
            const _this = this;

            _this.currentFocusedInput = document.elementFromPoint(_this.currentX, _this.currentY);
            _this.currentFocusedInput.focus();
        },

        'input': function (eventData) {
            const _this = this;

            if (_this.currentFocusedInput.type === 'password') {
                _this.currentFocusedInput.value = '*'.repeat(eventData.valueLength);
            } else {
                _this.currentFocusedInput.value = eventData.value;
            }
        }
    },

    runEvent: function (eventNumber = 0) {
        const _this = this;

        const eventData = _this.eventsData[eventNumber];
        _this.eventsHandlers[eventData.type].call(_this, eventData);

        if (_this.eventsData.length - 1 >= eventNumber + 1) {
            const delay = _this.eventsData[eventNumber + 1].timestamp - eventData.timestamp;

            setTimeout(function () {
                _this.runEvent(eventNumber + 1);
            }, delay);
        } else {
            this.onend();
            this.onend = null;
        }
    }
};

DomComponentsParser.parse().then(function (domComponents) {
    VideoContentManager.init(domComponents);
});
