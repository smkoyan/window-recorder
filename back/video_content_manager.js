const VideoContentManager = {
    html: null,

    styleSheets: null,

    scripts: null,

    cssSelectorsWithHover: null,

    init: function (options) {
        this.html = options.html;
        this.styleSheets = options.styleSheets;
        this.scripts = options.scripts;
    },

    prepareHTML: function () {
        /*this.removeOldStyleSheets();
        this.removeOldScripts();
        this.includeNewStyleSheets();
        this.includeNewScripts();*/
    },

    getCssSelectorsWithHover: function () {
        const _this = this;

        if (_this.cssSelectorsWithHover === null) {
            _this.parseCssSelectorsWithHover();
        }

        return _this.cssSelectorsWithHover;
    },

    parseCssSelectorsWithHover: function () {
        const _this = this;

        _this.cssSelectorsWithHover = new Set();

        _this.styleSheets.forEach(function (styleSheet) {
            let selectorsWithHover = styleSheet.match(/}?\s*(.+?)\:hover\s*.+?{/g);

            if (selectorsWithHover === null) {
                return;
            }

            selectorsWithHover = selectorsWithHover.map(function (selector) {
                return selector.split(',').map(function (selector) {
                    return selector.replace(/[{}]/g, '').trim();
                }).filter(function (selector) {
                    return selector.includes(':hover');
                });
            });

            selectorsWithHover.forEach(function (selectors) {
                selectors.map(function (selector) {
                    return selector.split(':hover')[0].replace(/::?[^ ,:.]+/g, '').trim();
                }).forEach(function (selector) {
                    _this.cssSelectorsWithHover.add(selector);
                });
            });
        });
    },

    prepareStyleSheets: function () {
        this.parseCssSelectorsWithHover();
        this.styleSheets = this.styleSheets.map(function (styleSheet) {

            return styleSheet.replace(/\:hover/, '.wr-hover');
        });
    },

    removeOldStyleSheets: function () {
        this.html = this.html.replace(/<style(.|\n)+?<\/style>/g, '').
        replace(/<link(.|\n)+?>/g, '');
    },

    removeOldScripts: function () {
        this.html = this.html.replace(/<script(.|\n)+?<\/script>/g, '');
    },

    includeNewStyleSheets: function () {
        this.styleSheets = this.styleSheets.map(function (styleSheet) {
           return '<style>' + styleSheet + '</style>';
        }).join('');

        this.html = this.html.replace(/<\/head>/, this.styleSheets + '</head>');
    },
    
    includeNewScripts: function () {
        this.scripts = this.scripts.map(function (styleSheet) {
            return '<script>' + styleSheet + '</script>';
        }).join('');

        this.html = this.html.replace(/<\/body>/, this.scripts + '</body>');
    }
};