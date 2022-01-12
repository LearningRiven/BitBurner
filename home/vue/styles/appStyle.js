export default class AppStyles {
    
    getAppStyle() {
        let appStyle = `
        .app_root {
            color: white;
            font-family: "Lucida Console", "Lucida Sans Unicode", "Fira Mono", Consolas, "Courier New", Courier, monospace, "Times New Roman";
            .layout {
                z-index: 1500;
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                pointer-events: none;
            }
            .inner {
                width: 100%;
                margin: 10vh 20vw;
                padding: 1em;
                
                background-color: fade-out(darkslategray, 0.1);
                pointer-events: auto;
            }
            .longform_typography {
                h2 {
                    font-size: 32px;
                    margin-bottom: 20px;
                }
                code {
                    padding: 0.25em 0.4em;
                    border-radius: 10px;
                    font-family: inherit;
                    background-color: black;
                    color: lawngreen;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
            }
            .trigger {
                z-index: 1500;
                position: fixed;
                bottom: 0.5em;
                left: 1em;
                width: auto;
                height: auto;
                padding: 0.5em;
                margin: 0;
                background-color: white;
                button {
                    background-color: black;
                    color: currentColor;
                    font-weight: bold;
                    border: none;
                    padding: 0.5em 1em;
                }
            }
        }
        `

        return appStyle;
    }

}