const DomComponentsParser = {
    html: null,

    styleSheets: null,

    scripts: null,

    images: null,

    parse: function () {
        return Promise.all([
            this.parseHTML(),
            this.parseStyleSheets(),
            this.parseScripts(),
            this.parseImages()
        ]).then(function (domComponents) {
            return {
                html: domComponents[0],

                styleSheets: domComponents[1],

                scripts: domComponents[2],

                images: domComponents[3]
            };
        });
    },

    parseHTML: function () {
        this.html = document.documentElement.outerHTML;

        return Promise.resolve(this.html);
    },

    parseStyleSheets: function () {
        const _this = this;

        const styleSheetsContentsPromises = [];
        const styleSheets = document.styleSheets;

        for (let i = 0; i < styleSheets.length; i++) {
            if (styleSheets[i].href) {
                styleSheetsContentsPromises.push(new Promise(function (resolve) {
                    $.get(styleSheets[i].href, function (styleSheetContent) {
                        resolve(styleSheetContent);
                    }, 'text');
                }));
            } else {
                styleSheetsContentsPromises.push(styleSheets[i].ownerNode.innerHTML);
            }
        }

        return Promise.all(styleSheetsContentsPromises).then(function (styleSheetsContents) {
            _this.styleSheets = styleSheetsContents;

            return styleSheetsContents;
        });
    },

    parseScripts: function () {
        const _this = this;

        const scriptsContentsPromises = [];
        const scripts = document.scripts;

        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src) {
                scriptsContentsPromises.push(new Promise(function (resolve) {
                    $.get(scripts[i].src, function (scriptContent) {
                        resolve(scriptContent);
                    }, 'text');
                }));
            } else {
                scriptsContentsPromises.push(scripts[i].innerHTML);
            }

        }

        return Promise.all(scriptsContentsPromises).then(function (scriptsContents) {
            _this.scripts = scriptsContents;

            return scriptsContents;
        });
    },


    parseImages: function () {
        const _this = this;

        const imagesContentsPromises = [];
        const images = document.images;

        for (let i = 0; i < images.length; i++) {
            imagesContentsPromises.push(new Promise(function (resolve) {
                $.get(images[i].currentSrc, function (imageContent) {
                    resolve(imageContent);
                }, 'text');
            }));
        }

        return Promise.all(imagesContentsPromises).then(function (imagesContents) {
            _this.images = imagesContents;

            return imagesContents;
        });
    }
};