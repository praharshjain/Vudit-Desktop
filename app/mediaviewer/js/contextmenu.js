! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("video.js")) : "function" == typeof define && define.amd ? define(["video.js"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).videojsContextmenuUi = t(e.videojs)
}(this, (function (e) {
    "use strict";

    function t(e) {
        return e && "object" == typeof e && "default" in e ? e : {
            default: e
        }
    }
    var n = t(e);
    const o = n.default.getComponent("MenuItem");
    class i extends o {
        handleClick(e) {
            super.handleClick(), this.options_.listener(), window.setTimeout((() => {
                this.player().contextmenuUI.menu.dispose()
            }), 1)
        }
    }
    const s = n.default.getComponent("Menu"),
        u = n.default.dom || n.default;
    class c extends s {
        constructor(e, t) {
            super(e, t), this.dispose = this.dispose.bind(this), t.content.forEach((t => {
                let n = function () {};
                "function" == typeof t.listener ? n = t.listener : "string" == typeof t.href && (n = () => window.open(t.href)), this.addItem(new i(e, {
                    label: t.label,
                    listener: n.bind(e)
                }))
            }))
        }
        createEl() {
            const e = super.createEl();
            return u.addClass(e, "vjs-contextmenu-ui-menu"), e.style.left = this.options_.position.left + "px", e.style.top = this.options_.position.top + "px", e
        }
    }

    function d(e, t) {
        const n = {},
            o = function (e) {
                let t;
                if (e.getBoundingClientRect && e.parentNode && (t = e.getBoundingClientRect()), !t) return {
                    left: 0,
                    top: 0
                };
                const n = document.documentElement,
                    o = document.body,
                    i = n.clientLeft || o.clientLeft || 0,
                    s = window.pageXOffset || o.scrollLeft,
                    u = t.left + s - i,
                    c = n.clientTop || o.clientTop || 0,
                    d = window.pageYOffset || o.scrollTop,
                    l = t.top + d - c;
                return {
                    left: Math.round(u),
                    top: Math.round(l)
                }
            }(e),
            i = e.offsetWidth,
            s = e.offsetHeight,
            u = o.top,
            c = o.left;
        let d = t.pageY,
            l = t.pageX;
        return t.changedTouches && (l = t.changedTouches[0].pageX, d = t.changedTouches[0].pageY), n.y = Math.max(0, Math.min(1, (u - d + s) / s)), n.x = Math.max(0, Math.min(1, (l - c) / i)), n
    }
    var l = "7.0.0";

    function r(e) {
        return e.hasOwnProperty("contextmenuUI") && e.contextmenuUI.hasOwnProperty("menu") && e.contextmenuUI.menu.el()
    }

    function a(e) {
        const t = e.tagName.toLowerCase();
        return "input" === t || "textarea" === t
    }

    function h(e) {
        if (r(this)) return void this.contextmenuUI.menu.dispose();
        if (this.contextmenuUI.options_.excludeElements(e.target)) return;
        const t = function (e, t) {
                return {
                    left: Math.round(t.width * e.x),
                    top: Math.round(t.height - t.height * e.y)
                }
            }(d(this.el(), e), this.el().getBoundingClientRect()),
            o = n.default.browser.IS_FIREFOX ? document.documentElement : document;
        e.preventDefault();
        const i = this.contextmenuUI.menu = new c(this, {
            content: this.contextmenuUI.content,
            position: t
        });
        this.contextmenuUI.closeMenu = () => {
            n.default.log.warn("player.contextmenuUI.closeMenu() is deprecated, please use player.contextmenuUI.menu.dispose() instead!"), i.dispose()
        }, i.on("dispose", (() => {
            n.default.off(o, ["click", "tap"], i.dispose), this.removeChild(i), delete this.contextmenuUI.menu
        })), this.addChild(i);
        const s = i.el_.getBoundingClientRect(),
            u = document.body.getBoundingClientRect();
        (this.contextmenuUI.keepInside || s.right > u.width || s.bottom > u.height) && (i.el_.style.left = Math.floor(Math.min(t.left, this.player_.currentWidth() - i.currentWidth())) + "px", i.el_.style.top = Math.floor(Math.min(t.top, this.player_.currentHeight() - i.currentHeight())) + "px"), n.default.on(o, ["click", "tap"], i.dispose)
    }

    function p(e) {
        const t = {
            keepInside: !0,
            excludeElements: a
        };
        if (e = n.default.obj.merge(t, e), !Array.isArray(e.content)) throw new Error('"content" required');
        r(this) && (this.contextmenuUI.menu.dispose(), this.off("contextmenu", this.contextmenuUI.onContextMenu), delete this.contextmenuUI);
        const o = this.contextmenuUI = function () {
            p.apply(this, arguments)
        };
        o.onContextMenu = h.bind(this), o.content = e.content, o.keepInside = e.keepInside, o.options_ = e, o.VERSION = l, this.on("contextmenu", o.onContextMenu), this.ready((() => this.addClass("vjs-contextmenu-ui")))
    }
    return n.default.registerPlugin("contextmenuUI", p), p.VERSION = l, p
}));