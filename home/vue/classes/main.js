import AppStyles from "/vue/styles/appStyle.js";

let styles = new AppStyles();
let appStyle = styles.getAppStyle();
let _window = eval('window')
let _document = eval('document')
let vueAppId = 'vueApp'

export default class Main {

    #ns

    static config = {
        tickRate: 100,
    }

    constructor(ns){
        this.#ns = ns;
    }

    //Initializes the app
    async init() {
        let app = _window._vueApp || null;

        //Import vue if it doesnt exist
        if(!_window.Vue){
            _window.Vue = await import('https://cdn.jsdelivr.net/npm/vue@3.2.26/dist/vue.esm-browser.js');
        }

        //In case it already exists, remove it before proceeding
        if(app){
            try{
                app.unmount();
                _document.querySelectorAll(`#${vueAppId}-wrap`).forEach(x => x.remove());
            } catch (error) {
                console.log('Issue unmounting window', error);
            }
        }

        //Add the app root to the dom
        let body = _document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', `
            <div id='${vueAppId}-wrap'>
                <div id='${vueAppId}'>
                    <app-root />
                </div>
                <style type='text/scss'>${appStyle}</style>
            </div>
        `);

        app = Vue.createApp({});

        //Define any vue components below
        app.component('app-root', {
            data() {
                return {
                    count: 0,
                    isOpen: false,
                }
            },
            computed: {
                toggleWorld() {
                    return this.isOpen ? 'Close' : 'Open'
                }
            },
            template: `
                <div class='app_root'>
                    <div class='layout' v-show='isOpen'>
                        <div class='inner'>
                            <div class='longform_typography'>
                                <h2>Hello From <code>Vue</code>, What Will You Do?</h2>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Sagittis eu volutpat odio facilisis mauris sit amet. Aliquam vestibulum morbi blandit cursus risus at ultrices mi. Mauris vitae ultricies leo integer malesuada nunc. Lacus vestibulum sed arcu non odio euismod lacinia. Nunc mattis enim ut tellus elementum sagittis vitae et leo. Aliquet enim tortor at auctor urna nunc id cursus metus. Pellentesque nec nam aliquam sem et tortor consequat. Morbi enim nunc faucibus a pellentesque sit amet. Sagittis vitae et leo duis ut diam quam nulla.
                                </p>
                                <p>
                                    Sit amet nisl suscipit adipiscing bibendum est. In ornare quam viverra orci sagittis eu volutpat odio facilisis. Dolor magna eget est lorem. In massa tempor nec feugiat nisl pretium fusce id. Laoreet suspendisse interdum consectetur libero id faucibus. Elementum curabitur vitae nunc sed velit dignissim. Urna nec tincidunt praesent semper feugiat nibh sed. Semper risus in hendrerit gravida rutrum quisque non. Praesent tristique magna sit amet purus. Amet est placerat in egestas erat imperdiet sed euismod nisi. Tincidunt arcu non sodales neque sodales ut etiam. Nullam eget felis eget nunc.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class='trigger'>
                        <button @click="toggleDisplay">
                            {{toggleWorld}} Vue App
                        </button>
                    </div>
                </div>
            `,
            methods: {
                toggleDisplay() {
                    this.isOpen = !this.isOpen
                }
            }
        })

        // Mount Vue app
        app.mount(`#${vueAppId}`);

        // Add SCSS compiler for in-browser compilation (kekw)
        this.addScssCompiler();

        window._vueApp = app;

        return app;
    }

    addScssCompiler() {
        function findAndConvertTags() {
            // Restore `window.define`
            _window.define = _window._defineBak
            var sassTags = _document.getElementsByTagName('style');
            for (var i = sassTags.length - 1; i >= 0; i--) {
                if (sassTags[i].type.toLowerCase() === 'text/scss' && sassTags[i]._scssCompiled !== true) {
                    Sass.compile(sassTags[i].innerHTML, function (compiledCSS) {
                        var rawStyle = _document.createElement('style');
                        rawStyle.type = 'text/css';
                        rawStyle.innerHTML = compiledCSS.text;
                        _document.getElementById(`${vueAppId}-wrap`).appendChild(rawStyle);
                    });
                    sassTags[i]._scssCompiled = true
                }
            }
        }
    
        if (typeof _window !== 'undefined' && typeof _document !== 'undefined') {
            if (typeof Sass === 'undefined' || typeof Sass.compile !== 'function') {
                var sassJSScript = _document.createElement('script');
                sassJSScript.type = 'text/javascript';
                sassJSScript.src = 'https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js';
                sassJSScript.onload = findAndConvertTags;
    
                // Monkey patch `window.define` to ensure sass installs properly
                _window._defineBak = _window.define
                _window.define = undefined
                _document.head.appendChild(sassJSScript);
            } else {
                findAndConvertTags();
            }
    
            if (typeof _window !== 'undefined' && _window !== null && typeof Sass !== 'undefined' && typeof Sass.compile === 'function') {
                setTimeout(findAndConvertTags, 0);
            }
        }
    }

    // //Keeps the app running indefinitely, if we need updated information, use this
    // async update() {
    //     return this.#ns.sleep(Main.config.tickRate);
    // }
}

