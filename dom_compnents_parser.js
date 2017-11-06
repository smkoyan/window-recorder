const DomComponentsParser = {
    HTMLContent: null,

    CSSContent: null,

    scriptsContents: null,

    parseHTML: function () {
        this.HTMLContent = document.documentElement.outerHTML;

        return this.HTMLContent;
    },

    parseCSS: function () {
        const styleSheetsList = [];

        for (let i = 0; i < document.styleSheets.length; i++) {
            styleSheetsList.push(new Promise(function (resolve, reject) {
                $.get(document.styleSheets[i].href, function (styleSheetContent) {
                    resolve(styleSheetContent);
                }, 'text');
            }));


        }

        return Promise.all(styleSheetsList).then(function (styleSheetsList) {
            this.CSSContent = styleSheetsList;

            return styleSheetsList;
        });
    },

    parseScripts: function () {
        const scriptsList = [];

        for (let i = 0; i < document.scripts.length; i++) {
            scriptsList.push(new Promise(function (resolve, reject) {
                $.get(document.scripts[i].src, function (scriptContent) {
                    resolve(scriptContent);
                }, 'text');
            }));
        }

        return Promise.all(scriptsList).then(function (scriptsContents) {
            this.scriptsContents = scriptsContents;

            return scriptsContents;
        });
    }
};