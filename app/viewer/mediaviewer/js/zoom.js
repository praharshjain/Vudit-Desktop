!(function (t, s) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = s(require("video.js")))
        : "function" == typeof define && define.amd
            ? define(["video.js"], s)
            : ((t = "undefined" != typeof globalThis ? globalThis : t || self)[
                "@theonlyducks/videojs-zoom"
            ] = s(t.videojs));
})(this, function (t) {
    "use strict";
    var s,
        o,
        e,
        i = {
            name: "@theonlyducks/videojs-zoom",
            title: "Video.js Zoom",
            version: "1.1.2",
            private: !1,
            description: "Simple plugin to zoom in video.js player",
            author: "Giovane Santos <giovanesantos1999@gmail.com>",
            license: "MIT",
            main: "./dist/videojs-zoom.cjs.js",
            module: "./dist/videojs-zoom.es.js",
            browser: "./dist/videojs-zoom.js",
            exports: {
                ".": {
                    import: "./dist/videojs-zoom.es.js",
                    require: "./dist/videojs-zoom.cjs.js",
                },
                "./styles": {
                    import: "./dist/videojs-zoom.css",
                    require: "./dist/videojs-zoom.css",
                },
            },
            scripts: {
                build: "yarn clean && yarn build:js && yarn build:css",
                "build:js": "rollup -c",
                "build:css": "mv dist/plugin.css dist/videojs-zoom.css ",
                clean: "rm -rf ./dist",
                start: "webpack serve --progress",
            },
            engines: { node: ">=16.0" },
            repository: {
                type: "git",
                url: "git+https://github.com/theonlyducks/videojs-zoom-duck.git",
            },
            bugs: { url: "https://github.com/theonlyducks/videojs-zoom-duck/issues" },
            files: ["dist", "LICENSE", "README.md"],
            keywords: [
                "videojs",
                "videojs-zoom",
                "videojs-zoom-duck",
                "videojs-plugin",
                "videojs-plugin-zoom",
            ],
            browserslist: ["defaults"],
            peerDependencies: { "video.js": ">= ^7" },
            devDependencies: {
                "@babel/cli": "^7.19.3",
                "@babel/core": "^7.19.6",
                "@babel/preset-env": "^7.19.4",
                "@rollup/plugin-babel": "^6.0.3",
                "@rollup/plugin-commonjs": "^24.0.0",
                "@rollup/plugin-json": "^6.0.0",
                "@rollup/plugin-node-resolve": "^15.0.1",
                "babel-loader": "^9.0.1",
                "css-loader": "^6.7.1",
                "html-webpack-plugin": "^5.5.0",
                rollup: "^3.3.0",
                "rollup-plugin-copy": "^3.4.0",
                "rollup-plugin-terser": "^7.0.2",
                "style-loader": "^3.3.1",
                "video.js": "^7.20.3",
                webpack: "^5.74.0",
                "webpack-cli": "^4.10.0",
                "webpack-dev-server": "^4.11.1",
            },
        };
    class n {
        constructor() {
            this._listeners = [];
        }
        static getInstance() {
            return n._instance || (n._instance = new n()), n._instance;
        }
        subscribe(t, s) {
            this._listeners.push({ event: t, callback: s });
        }
        notify(t, s) {
            this._listeners.forEach((o) => {
                if (o.event === t) return o.callback(s);
            });
        }
    }
    (s = n),
        (e = null),
        (o = (function (t) {
            var s = (function (t, s) {
                if ("object" != typeof t || null === t) return t;
                var o = t[Symbol.toPrimitive];
                if (void 0 !== o) {
                    var e = o.call(t, s || "default");
                    if ("object" != typeof e) return e;
                    throw new TypeError("@@toPrimitive must return a primitive value.");
                }
                return ("string" === s ? String : Number)(t);
            })(t, "string");
            return "symbol" == typeof s ? s : String(s);
        })((o = "_instance"))) in s
            ? Object.defineProperty(s, o, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0,
            })
            : (s[o] = e);
    const a = 0.2;
    class l {
        constructor(t, s) {
            (this.player = t.el()),
                (this.plugin = s.plugin),
                (this.observer = n.getInstance()),
                t.on("playing", () => {
                    this._updateSalt();
                }),
                this.observer.subscribe("change", (t) => {
                    (this.state = { ...t, saltMoveX: 70, saltMoveY: 70 }),
                        this._updateSalt();
                });
        }
        _updateSalt() {
            (this.state.saltMoveX = (this.player.offsetWidth * a) / 2),
                (this.state.saltMoveY = (this.player.offsetHeight * a) / 2);
        }
        _zoom() {
            this.plugin.zoom(this.state.zoom),
                this.plugin.listeners.change(this.state);
        }
        zoomIn() {
            this.state.zoom >= 9.8 ||
                (this.state.moveCount++,
                    (this.state.zoom += a),
                    this.plugin.zoom(this.state.zoom),
                    this.plugin.listeners.change(this.state));
        }
        zoomOut() {
            this.state.zoom <= 1 ||
                (this.state.moveCount--,
                    (this.state.zoom -= a),
                    this.plugin.zoom(this.state.zoom),
                    this.plugin.move(0, 0),
                    this.plugin.listeners.change(this.state));
        }
        _move() {
            this.plugin.move(this.state.moveX, this.state.moveY),
                this.plugin.listeners.change(this.state);
        }
        moveUp() {
            const t = this.state.moveY + this.state.saltMoveY;
            this.state.moveCount * this.state.saltMoveY < t ||
                (this._updateSalt(),
                    (this.state.moveY += this.state.saltMoveY),
                    this._move());
        }
        moveDown() {
            const t = this.state.moveY - this.state.saltMoveY;
            -(this.state.moveCount * this.state.saltMoveY) > t ||
                (this._updateSalt(),
                    (this.state.moveY -= this.state.saltMoveY),
                    this._move());
        }
        reset() {
            (this.state.zoom = 1),
                (this.state.moveX = 0),
                (this.state.moveY = 0),
                (this.state.rotate = 0),
                (this.state.moveCount = 0),
                this.plugin.zoom(1),
                this.plugin.flip("+"),
                this.plugin.rotate(0),
                this.plugin.move(0, 0),
                this.plugin.listeners.change(this.state);
        }
        moveLeft() {
            const t = this.state.moveX + this.state.saltMoveX;
            this.state.moveCount * this.state.saltMoveX < t ||
                (this._updateSalt(),
                    (this.state.moveX += this.state.saltMoveX),
                    this._move());
        }
        moveRight() {
            const t = this.state.moveX - this.state.saltMoveX;
            -(this.state.moveCount * this.state.saltMoveX) > t ||
                (this._updateSalt(),
                    (this.state.moveX -= this.state.saltMoveX),
                    this._move());
        }
        _rotate() {
            this.plugin.rotate(this.state.rotate),
                this.plugin.listeners.change(this.state);
        }
        rotate() {
            (this.state.rotate -= 90),
                -360 === this.state.rotate && (this.state.rotate = 0),
                this._rotate();
        }
        _flip() {
            this.plugin.flip(this.state.flip),
                this.plugin.listeners.change(this.state);
        }
        flip() {
            (this.state.flip = "+" === this.state.flip ? "-" : "+"), this._flip();
        }
    }
    class r {
        constructor() {
            (this.content = null), this._createContent();
        }
        getContent() {
            return this.content;
        }
        _createContent() {
            this.content =
                '\n\t\t\t<div class="vjs-zoom-duck__container--row">\n\t\t\t\t<button id="vjs-zoom-duck__zoomIn" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">add</span>\n\t\t\t\t</button>\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t\t<button id="vjs-zoom-duck__zoomOut" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">remove</span>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class="vjs-zoom-duck__container--row">\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t\t<button id="vjs-zoom-duck__moveUp" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">arrow_drop_up</span>\n\t\t\t\t</button>\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t</div>\n\t\t\t<div class="vjs-zoom-duck__container--row">\n\t\t\t\t<button id="vjs-zoom-duck__moveLeft" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">arrow_left</span>\n\t\t\t\t</button>\n\t\t\t\t<button id="vjs-zoom-duck__reset" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">fiber_manual_record</span>\n\t\t\t\t</button>\n\t\t\t\t<button id="vjs-zoom-duck__moveRight" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">arrow_right</span>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class="vjs-zoom-duck__container--row">\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t\t<button id="vjs-zoom-duck__moveDown" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">arrow_drop_down</span>\n\t\t\t\t</button>\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t</div>\n\t\t\t<div class="vjs-zoom-duck__container--row">\n\t\t\t\t<button id="vjs-zoom-duck__rotate" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">rotate_left</span>\n\t\t\t\t</button>\n\t\t\t\t<span class="vjs-zoom-duck__space"></span>\n\t\t\t\t<button id="vjs-zoom-duck__flip" class="vjs-zoom-duck__button">\n\t\t\t\t\t<span class="vjs-zoom-icons">swap_horiz</span>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t';
        }
    }
    const c = t.getComponent("Component");
    const u = t.getComponent("Button");
    const { version: m } = i,
        h = t.getPlugin("plugin"),
        p = { zoom: 1, moveX: 0, moveY: 0, flip: "+", rotate: 0 };
    class d extends h {
        constructor(s) {
            let o =
                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            super(s, o),
                t.log("[~Zoom Plugin] start ", o),
                (this.player = s.el()),
                (this.listeners = { click: () => { }, change: () => { } }),
                (this.player.style.overflow = "hidden"),
                (this.state = t.mergeOptions(p, o)),
                (this.state.flip = "+"),
                (this.state.moveCount = Math.round((this.state.zoom - 1) / a)),
                s.getChild("ControlBar").addChild("ZoomButton"),
                s.addChild("ZoomModal", { plugin: this, state: this.state }),
                (this._observer = n.getInstance()),
                this._setTransform();
        }
        zoom(t) {
            if (t <= 0) throw new Error("Zoom value invalid");
            (this.state.zoom = t),
                (this.state.moveCount = Math.round((this.state.zoom - 1) / a)),
                this._setTransform();
        }
        rotate(t) {
            (this.state.rotate = t), this._setTransform();
        }
        move(t, s) {
            (this.state.moveX = t), (this.state.moveY = s), this._setTransform();
        }
        flip(t) {
            (this.state.flip = t), this._setTransform();
        }
        toggle() {
            const [t] = this.player.getElementsByClassName(
                "vjs-zoom-duck__container"
            );
            t.classList.toggle("open");
        }
        listen(t, s) {
            this.listeners[t] = s;
        }
        _notify() {
            this._observer.notify("change", this.state);
        }
        _setTransform() {
            const [t] = this.player.getElementsByTagName("video");
            (t.style.transform = `\n\t\t\ttranslate(${this.state.moveX}px, ${this.state.moveY}px) \n\t\t\tscale(${this.state.flip}${this.state.zoom}, ${this.state.zoom}) \n\t\t\trotate(${this.state.rotate}deg)\n\t\t`),
                this._notify();
        }
    }
    return (
        (d.defaultState = {}),
        (d.VERSION = m),
        t.registerComponent(
            "ZoomModal",
            class extends c {
                constructor(t, s) {
                    super(t, s),
                        (this.player = t.el()),
                        (this.plugin = s.plugin),
                        (this.function = new l(t, s)),
                        t.on("playing", () => {
                            this.listeners();
                        });
                }
                createEl() {
                    const s = t.dom.createEl("div", {
                        className: "vjs-zoom-duck__container",
                    }),
                        o = new r();
                    return (s.innerHTML = o.getContent()), s;
                }
                listeners() {
                    let t = this.player.getElementsByClassName("vjs-zoom-duck__button");
                    (t = Array.from(t)),
                        t.map((t) => {
                            const [, s] = t.id.split("__");
                            t.onclick = () => this.function[s]();
                        });
                }
                open() {
                    const [t] = this.player.getElementsByClassName(
                        "vjs-zoom-duck__container"
                    );
                    t.classList.toggle("open"), this.plugin.listeners.click();
                }
            }
        ),
        t.registerComponent(
            "ZoomButton",
            class extends u {
                constructor(t, s) {
                    super(t, s);
                }
                buildCSSClass() {
                    return `vjs-zoom-duck ${super.buildCSSClass()}`;
                }
                handleClick() {
                    t.log("[~Zoom Plugin] button handleClick");
                    this.player().getChild("ZoomModal").open();
                }
            }
        ),
        t.registerPlugin("zoomPlugin", d),
        d
    );
});
