! function e(t, n, o) {
	function i(a, s) {
		if (!n[a]) {
			if (!t[a]) {
				var l = "function" == typeof require && require;
				if (!s && l) return l(a, !0);
				if (r) return r(a, !0);
				var u = new Error("Cannot find module '" + a + "'");
				throw u.code = "MODULE_NOT_FOUND", u
			}
			var c = n[a] = {
				exports: {}
			};
			t[a][0].call(c.exports, function (e) {
				var n = t[a][1][e];
				return i(n ? n : e)
			}, c, c.exports, e, t, n, o)
		}
		return n[a].exports
	}
	for (var r = "function" == typeof require && require, a = 0; a < o.length; a++) i(o[a]);
	return i
}({
	1: [function (e, t, n) {
		function o() {
			throw new Error("setTimeout has not been defined")
		}

		function i() {
			throw new Error("clearTimeout has not been defined")
		}

		function r(e) {
			if (f === setTimeout) return setTimeout(e, 0);
			if ((f === o || !f) && setTimeout) return f = setTimeout, setTimeout(e, 0);
			try {
				return f(e, 0)
			} catch (t) {
				try {
					return f.call(null, e, 0)
				} catch (t) {
					return f.call(this, e, 0)
				}
			}
		}

		function a(e) {
			if (d === clearTimeout) return clearTimeout(e);
			if ((d === i || !d) && clearTimeout) return d = clearTimeout, clearTimeout(e);
			try {
				return d(e)
			} catch (t) {
				try {
					return d.call(null, e)
				} catch (t) {
					return d.call(this, e)
				}
			}
		}

		function s() {
			y && p && (y = !1, p.length ? v = p.concat(v) : m = -1, v.length && l())
		}

		function l() {
			if (!y) {
				var e = r(s);
				y = !0;
				for (var t = v.length; t;) {
					for (p = v, v = []; ++m < t;) p && p[m].run();
					m = -1, t = v.length
				}
				p = null, y = !1, a(e)
			}
		}

		function u(e, t) {
			this.fun = e, this.array = t
		}

		function c() {}
		var f, d, h = t.exports = {};
		! function () {
			try {
				f = "function" == typeof setTimeout ? setTimeout : o
			} catch (e) {
				f = o
			}
			try {
				d = "function" == typeof clearTimeout ? clearTimeout : i
			} catch (e) {
				d = i
			}
		}();
		var p, v = [],
			y = !1,
			m = -1;
		h.nextTick = function (e) {
			var t = new Array(arguments.length - 1);
			if (arguments.length > 1)
				for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
			v.push(new u(e, t)), 1 !== v.length || y || r(l)
		}, u.prototype.run = function () {
			this.fun.apply(null, this.array)
		}, h.title = "browser", h.browser = !0, h.env = {}, h.argv = [], h.version = "", h.versions = {}, h.on = c, h.addListener = c, h.once = c, h.off = c, h.removeListener = c, h.removeAllListeners = c, h.emit = c, h.binding = function (e) {
			throw new Error("process.binding is not supported")
		}, h.cwd = function () {
			return "/"
		}, h.chdir = function (e) {
			throw new Error("process.chdir is not supported")
		}, h.umask = function () {
			return 0
		}
	}, {}],
	2: [function (e, t, n) {
		"use strict";

		function o(e, t, n, o) {
			function i(n) {
				r = t(i, o), e(n - (a || n)), a = n
			}
			var r, a;
			return {
				start: function () {
					r || i(0)
				},
				stop: function () {
					n(r), r = null, a = 0
				}
			}
		}

		function i(e) {
			return o(e, requestAnimationFrame, cancelAnimationFrame)
		}

		function r(e, t) {
			return o(e, setTimeout, clearTimeout, t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.intervalometer = o, n.frameIntervalometer = i, n.timerIntervalometer = r
	}, {}],
	3: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && "object" == typeof e && "default" in e ? e.default : e
		}

		function i(e, t, n, o) {
			function i(t) {
				Boolean(e[n]) === Boolean(o) && t.stopImmediatePropagation(), delete e[n]
			}
			return e.addEventListener(t, i, !1), i
		}

		function r(e, t, n, o) {
			function i() {
				return n[t]
			}

			function r(e) {
				n[t] = e
			}
			o && r(e[t]), Object.defineProperty(e, t, {
				get: i,
				set: r
			})
		}

		function a(e, t, n) {
			n.addEventListener(t, function () {
				return e.dispatchEvent(new Event(t))
			})
		}

		function s(e, t) {
			Promise.resolve().then(function () {
				e.dispatchEvent(new Event(t))
			})
		}

		function l(e) {
			var t = new Audio;
			return a(e, "play", t), a(e, "playing", t), a(e, "pause", t), t.crossOrigin = e.crossOrigin, t.src = e.src || e.currentSrc || "data:", t
		}

		function u(e, t, n) {
			(m || 0) + 200 < Date.now() && (e[k] = !0, m = Date.now()), n || (e.currentTime = t), M[++j % 3] = 100 * t | 0
		}

		function c(e) {
			return e.driver.currentTime >= e.video.duration
		}

		function f(e) {
			var t = this;
			t.video.readyState >= t.video.HAVE_FUTURE_DATA ? (t.hasAudio || (t.driver.currentTime = t.video.currentTime + e * t.video.playbackRate / 1e3, t.video.loop && c(t) && (t.driver.currentTime = 0)), u(t.video, t.driver.currentTime)) : t.video.networkState !== t.video.NETWORK_IDLE || t.video.buffered.length || t.video.load(), t.video.ended && (delete t.video[k], t.video.pause(!0))
		}

		function d() {
			var e = this,
				t = e[g];
			return e.webkitDisplayingFullscreen ? void e[O]() : ("data:" !== t.driver.src && t.driver.src !== e.src && (u(e, 0, !0), t.driver.src = e.src), void(e.paused && (t.paused = !1, e.buffered.length || e.load(), t.driver.play(), t.updater.start(), t.hasAudio || (s(e, "play"), t.video.readyState >= t.video.HAVE_ENOUGH_DATA && s(e, "playing")))))
		}

		function h(e) {
			var t = this,
				n = t[g];
			n.driver.pause(), n.updater.stop(), t.webkitDisplayingFullscreen && t[E](), n.paused && !e || (n.paused = !0, n.hasAudio || s(t, "pause"), t.ended && (t[k] = !0, s(t, "ended")))
		}

		function p(e, t) {
			var n = e[g] = {};
			n.paused = !0, n.hasAudio = t, n.video = e, n.updater = b.frameIntervalometer(f.bind(n)), t ? n.driver = l(e) : (e.addEventListener("canplay", function () {
				e.paused || s(e, "playing")
			}), n.driver = {
				src: e.src || e.currentSrc || "data:",
				muted: !0,
				paused: !0,
				pause: function () {
					n.driver.paused = !0
				},
				play: function () {
					n.driver.paused = !1, c(n) && u(e, 0)
				},
				get ended() {
					return c(n)
				}
			}), e.addEventListener("emptied", function () {
				var t = !n.driver.src || "data:" === n.driver.src;
				n.driver.src && n.driver.src !== e.src && (u(e, 0, !0), n.driver.src = e.src, t ? n.driver.play() : n.updater.stop())
			}, !1), e.addEventListener("webkitbeginfullscreen", function () {
				e.paused ? t && !n.driver.buffered.length && n.driver.load() : (e.pause(), e[O]())
			}), t && (e.addEventListener("webkitendfullscreen", function () {
				n.driver.currentTime = e.currentTime
			}), e.addEventListener("seeking", function () {
				M.indexOf(100 * e.currentTime | 0) < 0 && (n.driver.currentTime = e.currentTime)
			}))
		}

		function v(e) {
			var t = e[g];
			e[O] = e.play, e[E] = e.pause, e.play = d, e.pause = h, r(e, "paused", t.driver), r(e, "muted", t.driver, !0), r(e, "playbackRate", t.driver, !0), r(e, "ended", t.driver), r(e, "loop", t.driver, !0), i(e, "seeking"), i(e, "seeked"), i(e, "timeupdate", k, !1), i(e, "ended", k, !1)
		}

		function y(e, t, n) {
			void 0 === t && (t = !0), void 0 === n && (n = !0), n && !w || e[g] || (p(e, t), v(e), e.classList.add("IIV"), !t && e.autoplay && e.play(), /iPhone|iPod|iPad/.test(navigator.platform) || console.warn("iphone-inline-video is not guaranteed to work in emulated environments"))
		}
		var m, _ = o(e("poor-mans-symbol")),
			b = e("intervalometer"),
			w = /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia("(-webkit-video-playable-inline)").matches,
			g = _(),
			k = _(),
			O = _("nativeplay"),
			E = _("nativepause"),
			M = [],
			j = 0;
		y.isWhitelisted = w, t.exports = y
	}, {
		intervalometer: 2,
		"poor-mans-symbol": 4
	}],
	4: [function (e, t, n) {
		"use strict";
		var o = "undefined" == typeof Symbol ? function (e) {
			return "@" + (e || "@") + Math.random()
		} : Symbol;
		t.exports = o
	}, {}],
	5: [function (e, t, n) {
		! function (e) {
			"use strict";

			function n() {}

			function o(e, t) {
				for (var n = e.length; n--;)
					if (e[n].listener === t) return n;
				return -1
			}

			function i(e) {
				return function () {
					return this[e].apply(this, arguments)
				}
			}

			function r(e) {
				return "function" == typeof e || e instanceof RegExp || !(!e || "object" != typeof e) && r(e.listener)
			}
			var a = n.prototype,
				s = e.EventEmitter;
			a.getListeners = function (e) {
				var t, n, o = this._getEvents();
				if (e instanceof RegExp) {
					t = {};
					for (n in o) o.hasOwnProperty(n) && e.test(n) && (t[n] = o[n])
				} else t = o[e] || (o[e] = []);
				return t
			}, a.flattenListeners = function (e) {
				var t, n = [];
				for (t = 0; t < e.length; t += 1) n.push(e[t].listener);
				return n
			}, a.getListenersAsObject = function (e) {
				var t, n = this.getListeners(e);
				return n instanceof Array && (t = {}, t[e] = n), t || n
			}, a.addListener = function (e, t) {
				if (!r(t)) throw new TypeError("listener must be a function");
				var n, i = this.getListenersAsObject(e),
					a = "object" == typeof t;
				for (n in i) i.hasOwnProperty(n) && o(i[n], t) === -1 && i[n].push(a ? t : {
					listener: t,
					once: !1
				});
				return this
			}, a.on = i("addListener"), a.addOnceListener = function (e, t) {
				return this.addListener(e, {
					listener: t,
					once: !0
				})
			}, a.once = i("addOnceListener"), a.defineEvent = function (e) {
				return this.getListeners(e), this
			}, a.defineEvents = function (e) {
				for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
				return this
			}, a.removeListener = function (e, t) {
				var n, i, r = this.getListenersAsObject(e);
				for (i in r) r.hasOwnProperty(i) && (n = o(r[i], t), n !== -1 && r[i].splice(n, 1));
				return this
			}, a.off = i("removeListener"), a.addListeners = function (e, t) {
				return this.manipulateListeners(!1, e, t)
			}, a.removeListeners = function (e, t) {
				return this.manipulateListeners(!0, e, t)
			}, a.manipulateListeners = function (e, t, n) {
				var o, i, r = e ? this.removeListener : this.addListener,
					a = e ? this.removeListeners : this.addListeners;
				if ("object" != typeof t || t instanceof RegExp)
					for (o = n.length; o--;) r.call(this, t, n[o]);
				else
					for (o in t) t.hasOwnProperty(o) && (i = t[o]) && ("function" == typeof i ? r.call(this, o, i) : a.call(this, o, i));
				return this
			}, a.removeEvent = function (e) {
				var t, n = typeof e,
					o = this._getEvents();
				if ("string" === n) delete o[e];
				else if (e instanceof RegExp)
					for (t in o) o.hasOwnProperty(t) && e.test(t) && delete o[t];
				else delete this._events;
				return this
			}, a.removeAllListeners = i("removeEvent"), a.emitEvent = function (e, t) {
				var n, o, i, r, a, s = this.getListenersAsObject(e);
				for (r in s)
					if (s.hasOwnProperty(r))
						for (n = s[r].slice(0), i = 0; i < n.length; i++) o = n[i], o.once === !0 && this.removeListener(e, o.listener), a = o.listener.apply(this, t || []), a === this._getOnceReturnValue() && this.removeListener(e, o.listener);
				return this
			}, a.trigger = i("emitEvent"), a.emit = function (e) {
				var t = Array.prototype.slice.call(arguments, 1);
				return this.emitEvent(e, t)
			}, a.setOnceReturnValue = function (e) {
				return this._onceReturnValue = e, this
			}, a._getOnceReturnValue = function () {
				return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
			}, a._getEvents = function () {
				return this._events || (this._events = {})
			}, n.noConflict = function () {
				return e.EventEmitter = s, n
			}, "function" == typeof define && define.amd ? define(function () {
				return n
			}) : "object" == typeof t && t.exports ? t.exports = n : e.EventEmitter = n
		}(this || {})
	}, {}],
	6: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var r = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			a = e("./BaseCanvas"),
			s = (o(a), e("../utils")),
			l = function () {
				function e(t, n) {
					var o = this;
					i(this, e), this._player = t, this._options = (0, s.mergeOptions)({}, this._options), this._options = (0, s.mergeOptions)(this._options, n), this._canvas = this._options.canvas, this._timeline = [], this._options.animation.forEach(function (e) {
						o.addTimeline(e)
					})
				}
				return r(e, [{
					key: "addTimeline",
					value: function (e) {
						var t = {
							active: !1,
							initialized: !1,
							completed: !1,
							startValue: {},
							byValue: {},
							endValue: {},
							keyPoint: e.keyPoint,
							duration: e.duration,
							beginTime: 1 / 0,
							endTime: 1 / 0,
							onComplete: e.onComplete,
							from: e.from,
							to: e.to
						};
						"string" == typeof e.ease && (t.ease = s.easeFunctions[e.ease]), "undefined" == typeof e.ease && (t.ease = s.easeFunctions.linear), this._timeline.push(t), this.attachEvents()
					}
				}, {
					key: "initialTimeline",
					value: function (e) {
						for (var t in e.to)
							if (e.to.hasOwnProperty(t)) {
								var n = e.from && "undefined" != typeof e.from[t] ? e.from[t] : this._canvas["_" + t];
								e.startValue[t] = n, e.endValue[t] = e.to[t], e.byValue[t] = e.to[t] - n
							}
					}
				}, {
					key: "processTimeline",
					value: function (e, t) {
						for (var n in e.to)
							if (e.to.hasOwnProperty(n)) {
								var o = e.ease && e.ease(t, e.startValue[n], e.byValue[n], e.duration);
								"fov" === n ? (this._canvas._camera.fov = o, this._canvas._camera.updateProjectionMatrix()) : this._canvas["_" + n] = o
							}
					}
				}, {
					key: "attachEvents",
					value: function () {
						this._active = !0, this._canvas.addListener("beforeRender", this.renderAnimation.bind(this)), this._player.on("seeked", this.handleVideoSeek.bind(this))
					}
				}, {
					key: "detachEvents",
					value: function () {
						this._active = !1, this._canvas.controlable = !0, this._canvas.removeListener("beforeRender", this.renderAnimation.bind(this))
					}
				}, {
					key: "handleVideoSeek",
					value: function () {
						var e = 1e3 * this._player.getVideoEl().currentTime,
							t = 0;
						this._timeline.forEach(function (n) {
							var o = n.keyPoint >= e || n.keyPoint <= e && n.keyPoint + n.duration >= e;
							o && (t++, n.completed = !1, n.initialized = !1)
						}), t > 0 && !this._active && this.attachEvents()
					}
				}, {
					key: "renderAnimation",
					value: function () {
						var e = this,
							t = 1e3 * this._player.getVideoEl().currentTime,
							n = 0,
							o = 0;
						this._timeline.filter(function (i) {
							if (i.completed) return n++, !1;
							var r = i.keyPoint <= t && i.keyPoint + i.duration > t;
							return i.active = r, i.active === !1 && o++, r && !i.initialized && (i.initialized = !0, i.beginTime = i.keyPoint, i.endTime = i.beginTime + i.duration, e.initialTimeline(i)), i.endTime <= t && (i.completed = !0, e.processTimeline(i, i.duration), i.onComplete && i.onComplete.call(e)), r
						}).forEach(function (n) {
							var o = t - n.beginTime;
							e.processTimeline(n, o)
						}), this._canvas.controlable = o === this._timeline.length, n === this._timeline.length && this.detachEvents()
					}
				}]), e
			}();
		n.default = l
	}, {
		"../utils": 36,
		"./BaseCanvas": 7
	}],
	7: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = function e(t, n, o) {
					null === t && (t = Function.prototype);
					var i = Object.getOwnPropertyDescriptor(t, n);
					if (void 0 === i) {
						var r = Object.getPrototypeOf(t);
						return null === r ? void 0 : e(r, n, o)
					}
					if ("value" in i) return i.value;
					var a = i.get;
					if (void 0 !== a) return a.call(o)
				},
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = e("./Component"),
				d = o(f),
				h = e("./HelperCanvas"),
				p = o(h),
				v = e("../utils"),
				y = 2,
				m = function (e) {
					function t(e, n, o) {
						i(this, t);
						var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o));
						return a._width = a.player.el().offsetWidth, a._height = a.player.el().offsetHeight, a._lon = a.options.initLon, a._lat = a.options.initLat, a._phi = 0, a._theta = 0, a._accelector = {
							x: 0,
							y: 0
						}, a._renderer.setSize(a._width, a._height), a._mouseDown = !1, a._isUserInteracting = !1, a._runOnMobile = (0, v.mobileAndTabletcheck)(), a._VRMode = !1, a._controlable = !0, a._mouseDownPointer = {
							x: 0,
							y: 0
						}, a._mouseDownLocation = {
							Lat: 0,
							Lon: 0
						}, a.attachControlEvents(), a
					}
					return a(t, e), s(t, [{
						key: "createEl",
						value: function () {
							arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "div", arguments[1], arguments[2];
							this._renderer = new c.default.WebGLRenderer, this._renderer.setPixelRatio(window.devicePixelRatio), this._renderer.autoClear = !1, this._renderer.setClearColor(0, 1);
							var e = this._renderElement;
							if ("video" !== e.tagName.toLowerCase() || this.options.useHelperCanvas !== !0 && ((0, v.supportVideoTexture)(e) || "auto" !== this.options.useHelperCanvas)) this._texture = new c.default.Texture(e);
							else {
								this._helperCanvas = this.player.addComponent("HelperCanvas", new p.default(this.player));
								var t = this._helperCanvas.el();
								this._texture = new c.default.Texture(t)
							}
							this._texture.generateMipmaps = !1, this._texture.minFilter = c.default.LinearFilter, this._texture.maxFilter = c.default.LinearFilter, this._texture.format = c.default.RGBFormat;
							var n = this._renderer.domElement;
							return n.classList.add("vjs-panorama-canvas"), n
						}
					}, {
						key: "dispose",
						value: function () {
							this.detachControlEvents(), this.stopAnimation(), l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "dispose", this).call(this)
						}
					}, {
						key: "startAnimation",
						value: function () {
							this._time = (new Date).getTime(), this.animate()
						}
					}, {
						key: "stopAnimation",
						value: function () {
							this._requestAnimationId && cancelAnimationFrame(this._requestAnimationId)
						}
					}, {
						key: "attachControlEvents",
						value: function () {
							this.on("mousemove", this.handleMouseMove.bind(this)), this.on("touchmove", this.handleTouchMove.bind(this)), this.on("mousedown", this.handleMouseDown.bind(this)), this.on("touchstart", this.handleTouchStart.bind(this)), this.on("mouseup", this.handleMouseUp.bind(this)), this.on("touchend", this.handleTouchEnd.bind(this)), this.on("mouseenter", this.handleMouseEnter.bind(this)), this.on("mouseleave", this.handleMouseLease.bind(this)), this.options.scrollable && (this.on("mousewheel", this.handleMouseWheel.bind(this)), this.on("MozMousePixelScroll", this.handleMouseWheel.bind(this))), this.options.resizable && window.addEventListener("resize", this.handleResize.bind(this)), this.options.autoMobileOrientation && window.addEventListener("devicemotion", this.handleMobileOrientation.bind(this)), this.options.KeyboardControl && (window.addEventListener("keydown", this.handleKeyDown.bind(this)), window.addEventListener("keyup", this.handleKeyUp.bind(this)))
						}
					}, {
						key: "detachControlEvents",
						value: function () {
							this.off("mousemove", this.handleMouseMove.bind(this)), this.off("touchmove", this.handleTouchMove.bind(this)), this.off("mousedown", this.handleMouseDown.bind(this)), this.off("touchstart", this.handleTouchStart.bind(this)), this.off("mouseup", this.handleMouseUp.bind(this)), this.off("touchend", this.handleTouchEnd.bind(this)), this.off("mouseenter", this.handleMouseEnter.bind(this)), this.off("mouseleave", this.handleMouseLease.bind(this)), this.options.scrollable && (this.off("mousewheel", this.handleMouseWheel.bind(this)), this.off("MozMousePixelScroll", this.handleMouseWheel.bind(this))), this.options.resizable && window.removeEventListener("resize", this.handleResize.bind(this)), this.options.autoMobileOrientation && window.removeEventListener("devicemotion", this.handleMobileOrientation.bind(this)), this.options.KeyboardControl && (window.removeEventListener("keydown", this.handleKeyDown.bind(this)), window.removeEventListener("keyup", this.handleKeyUp.bind(this)))
						}
					}, {
						key: "handleResize",
						value: function () {
							this._width = this.player.el().offsetWidth, this._height = this.player.el().offsetHeight, this._renderer.setSize(this._width, this._height)
						}
					}, {
						key: "handleMouseWheel",
						value: function (e) {
							e.stopPropagation(), e.preventDefault()
						}
					}, {
						key: "handleMouseEnter",
						value: function (e) {
							this._isUserInteracting = !0, this._accelector.x = 0, this._accelector.y = 0
						}
					}, {
						key: "handleMouseLease",
						value: function (e) {
							this._isUserInteracting = !1, this._accelector.x = 0, this._accelector.y = 0, this._mouseDown && (this._mouseDown = !1)
						}
					}, {
						key: "handleMouseDown",
						value: function (e) {
							e.preventDefault();
							var t = e.clientX || e.touches && e.touches[0].clientX,
								n = e.clientY || e.touches && e.touches[0].clientY;
							"undefined" != typeof t && "undefined" !== n && (this._mouseDown = !0, this._mouseDownPointer.x = t, this._mouseDownPointer.y = n, this._mouseDownLocation.Lon = this._lon, this._mouseDownLocation.Lat = this._lat)
						}
					}, {
						key: "handleMouseMove",
						value: function (e) {
							var t = e.clientX || e.touches && e.touches[0].clientX,
								n = e.clientY || e.touches && e.touches[0].clientY;
							if (this.options.MouseEnable && this.controlable && "undefined" != typeof t && "undefined" != typeof n)
								if (this._mouseDown) this._lon = .2 * (this._mouseDownPointer.x - t) + this._mouseDownLocation.Lon, this._lat = .2 * (n - this._mouseDownPointer.y) + this._mouseDownLocation.Lat, this._accelector.x = 0, this._accelector.y = 0;
								else if (!this.options.clickAndDrag) {
								var o = this.el().getBoundingClientRect(),
									i = t - this._width / 2 - o.left,
									r = this._height / 2 - (n - o.top),
									a = 0;
								a = 0 === i ? r > 0 ? Math.PI / 2 : 3 * Math.PI / 2 : i > 0 && r > 0 ? Math.atan(r / i) : i > 0 && r < 0 ? 2 * Math.PI - Math.atan(r * -1 / i) : i < 0 && r > 0 ? Math.PI - Math.atan(r / i * -1) : Math.PI + Math.atan(r / i), this._accelector.x = Math.cos(a) * this.options.movingSpeed.x * Math.abs(i), this._accelector.y = Math.sin(a) * this.options.movingSpeed.y * Math.abs(r)
							}
						}
					}, {
						key: "handleMouseUp",
						value: function (e) {
							if (this._mouseDown = !1, this.options.clickToToggle) {
								var t = e.clientX || e.changedTouches && e.changedTouches[0].clientX,
									n = e.clientY || e.changedTouches && e.changedTouches[0].clientY;
								if ("undefined" != typeof t && "undefined" !== n && this.options.clickToToggle) {
									var o = Math.abs(t - this._mouseDownPointer.x),
										i = Math.abs(n - this._mouseDownPointer.y);
									o < .1 && i < .1 && (this.player.paused() ? this.player.play() : this.player.pause())
								}
							}
						}
					}, {
						key: "handleTouchStart",
						value: function (e) {
							e.touches.length > 1 && (this._isUserPinch = !0, this._multiTouchDistance = (0, v.getTouchesDistance)(e.touches)), this.handleMouseDown(e)
						}
					}, {
						key: "handleTouchMove",
						value: function (e) {
							this.trigger("touchMove"), (!this._isUserPinch || e.touches.length <= 1) && this.handleMouseMove(e)
						}
					}, {
						key: "handleTouchEnd",
						value: function (e) {
							this._isUserPinch = !1, this.handleMouseUp(e)
						}
					}, {
						key: "handleMobileOrientation",
						value: function (e) {
							if ("undefined" != typeof e.rotationRate) {
								var t = e.rotationRate.alpha,
									n = e.rotationRate.beta,
									o = "undefined" != typeof e.portrait ? e.portrait : window.matchMedia("(orientation: portrait)").matches,
									i = "undefined" != typeof e.landscape ? e.landscape : window.matchMedia("(orientation: landscape)").matches,
									r = e.orientation || window.orientation;
								if (o) this._lon = this._lon - n * this.options.mobileVibrationValue, this._lat = this._lat + t * this.options.mobileVibrationValue;
								else if (i) {
									var a = -90;
									"undefined" != typeof r && (a = r), this._lon = a === -90 ? this._lon + t * this.options.mobileVibrationValue : this._lon - t * this.options.mobileVibrationValue, this._lat = a === -90 ? this._lat + n * this.options.mobileVibrationValue : this._lat - n * this.options.mobileVibrationValue
								}
							}
						}
					}, {
						key: "handleKeyDown",
						value: function (e) {
							switch (this._isUserInteracting = !0, e.keyCode) {
								case 38:
								case 87:
									this._lat += this.options.KeyboardMovingSpeed.y;
									break;
								case 37:
								case 65:
									this._lon -= this.options.KeyboardMovingSpeed.x;
									break;
								case 39:
								case 68:
									this._lon += this.options.KeyboardMovingSpeed.x;
									break;
								case 40:
								case 83:
									this._lat -= this.options.KeyboardMovingSpeed.y
							}
						}
					}, {
						key: "handleKeyUp",
						value: function (e) {
							this._isUserInteracting = !1
						}
					}, {
						key: "enableVR",
						value: function () {
							this._VRMode = !0
						}
					}, {
						key: "disableVR",
						value: function () {
							this._VRMode = !1
						}
					}, {
						key: "animate",
						value: function () {
							this._requestAnimationId = requestAnimationFrame(this.animate.bind(this));
							var e = (new Date).getTime();
							e - this._time >= 30 && (this._texture.needsUpdate = !0, this._time = e, this.trigger("textureRender")), ("video" !== this._renderElement.tagName.toLowerCase() || this.player.readyState() >= y) && this.render()
						}
					}, {
						key: "render",
						value: function () {
							if (this.trigger("beforeRender"), this._controlable)
								if (this._isUserInteracting) 0 !== this._accelector.x && 0 !== this._accelector.y && (this._lat += this._accelector.y, this._lon += this._accelector.x);
								else {
									var e = this._lat > this.options.initLat ? -1 : 1,
										t = this._lon > this.options.initLon ? -1 : 1;
									this.options.backToInitLat && (this._lat = this._lat > this.options.initLat - Math.abs(this.options.returnLatSpeed) && this._lat < this.options.initLat + Math.abs(this.options.returnLatSpeed) ? this.options.initLat : this._lat + this.options.returnLatSpeed * e), this.options.backToInitLon && (this._lon = this._lon > this.options.initLon - Math.abs(this.options.returnLonSpeed) && this._lon < this.options.initLon + Math.abs(this.options.returnLonSpeed) ? this.options.initLon : this._lon + this.options.returnLonSpeed * t)
								} 0 === this._options.minLon && 360 === this._options.maxLon && (this._lon > 360 ? this._lon -= 360 : this._lon < 0 && (this._lon += 360)), this._lat = Math.max(this.options.minLat, Math.min(this.options.maxLat, this._lat)), this._lon = Math.max(this.options.minLon, Math.min(this.options.maxLon, this._lon)), this._phi = c.default.Math.degToRad(90 - this._lat), this._theta = c.default.Math.degToRad(this._lon), this._helperCanvas && this._helperCanvas.render(), this._renderer.clear(), this.trigger("render")
						}
					}, {
						key: "VRMode",
						get: function () {
							return this._VRMode
						}
					}, {
						key: "controlable",
						get: function () {
							return this._controlable
						},
						set: function (e) {
							this._controlable = e
						}
					}]), t
				}(d.default);
			n.default = m
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"../utils": 36,
		"./Component": 10,
		"./HelperCanvas": 14
	}],
	8: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = function e(t, n, o) {
				null === t && (t = Function.prototype);
				var i = Object.getOwnPropertyDescriptor(t, n);
				if (void 0 === i) {
					var r = Object.getPrototypeOf(t);
					return null === r ? void 0 : e(r, n, o)
				}
				if ("value" in i) return i.value;
				var a = i.get;
				if (void 0 !== a) return a.call(o)
			},
			u = e("./ClickableComponent"),
			c = o(u),
			f = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					i(this, t);
					var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
					return o.on("keydown", o.handleKeyPress.bind(o)), o
				}
				return a(t, e), s(t, [{
					key: "createEl",
					value: function (e, n, o) {
						return l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "createEl", this).call(this, "button", null, {
							type: "button",
							"aria-live": "polite"
						})
					}
				}, {
					key: "enable",
					value: function () {
						this.el().removeAttribute("disabled")
					}
				}, {
					key: "disable",
					value: function () {
						this.el().setAttribute("disabled", "disabled")
					}
				}, {
					key: "handleKeyPress",
					value: function (e) {
						32 === e.which || 13 === e.which
					}
				}]), t
			}(c.default);
		n.default = f
	}, {
		"./ClickableComponent": 9
	}],
	9: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = function e(t, n, o) {
				null === t && (t = Function.prototype);
				var i = Object.getOwnPropertyDescriptor(t, n);
				if (void 0 === i) {
					var r = Object.getPrototypeOf(t);
					return null === r ? void 0 : e(r, n, o)
				}
				if ("value" in i) return i.value;
				var a = i.get;
				if (void 0 !== a) return a.call(o)
			},
			u = e("./Component"),
			c = o(u),
			f = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					i(this, t);
					var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
					return o.on("click", o.handleClick.bind(o)), o.addListener("tap", o.handleClick.bind(o)), o
				}
				return a(t, e), s(t, [{
					key: "buildCSSClass",
					value: function () {
						return "vjs-control vjs-button " + l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "buildCSSClass", this).call(this)
					}
				}, {
					key: "handleClick",
					value: function (e) {
						this.trigger("click")
					}
				}]), t
			}(c.default);
		n.default = f
	}, {
		"./Component": 10
	}],
	10: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = e("wolfy87-eventemitter"),
			u = o(l),
			c = e("../utils"),
			f = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
						o = arguments[2],
						a = arguments[3];
					i(this, t);
					var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
					return s._player = e, s._options = (0, c.mergeOptions)({}, s._options), s._options = (0, c.mergeOptions)(s._options, n), s._renderElement = o, s._id = n.id || n.el && n.el.id, s._el = n.el ? n.el : s.createEl(), s.emitTapEvents(), s._children = [], a && a.call(s), s
				}
				return a(t, e), s(t, [{
					key: "dispose",
					value: function () {
						for (var e = 0; e < this._children.length; e++) this._children[e].component.dispose();
						this._el && (this._el.parentNode && this._el.parentNode.removeChild(this._el), this._el = null)
					}
				}, {
					key: "emitTapEvents",
					value: function () {
						var e = this,
							t = 0,
							n = null,
							o = 10,
							i = 200,
							r = void 0;
						this.on("touchstart", function (e) {
							1 === e.touches.length && (n = {
								pageX: e.touches[0].pageX,
								pageY: e.touches[0].pageY
							}, t = (new Date).getTime(), r = !0)
						}), this.on("touchmove", function (e) {
							if (e.touches.length > 1) r = !1;
							else if (n) {
								var t = e.touches[0].pageX - n.pageX,
									i = e.touches[0].pageY - n.pageY,
									a = Math.sqrt(t * t + i * i);
								a > o && (r = !1)
							}
						});
						var a = function () {
							r = !1
						};
						this.on("touchleave", a), this.on("touchcancel", a), this.on("touchend", function (o) {
							if (n = null, r === !0) {
								var a = (new Date).getTime() - t;
								a < i && (o.preventDefault(), e.trigger("tap"))
							}
						})
					}
				}, {
					key: "createEl",
					value: function () {
						var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "div",
							t = (arguments[1], arguments[2]),
							n = document.createElement(e);
						n.className = this.buildCSSClass();
						for (var o in t)
							if (t.hasOwnProperty(o)) {
								var i = t[o];
								n.setAttribute(o, i)
							} return n
					}
				}, {
					key: "el",
					value: function () {
						return this._el
					}
				}, {
					key: "buildCSSClass",
					value: function () {
						return ""
					}
				}, {
					key: "on",
					value: function (e, t) {
						this.el().addEventListener(e, t)
					}
				}, {
					key: "off",
					value: function (e, t) {
						this.el().removeEventListener(e, t)
					}
				}, {
					key: "one",
					value: function (e, t) {
						var n = this,
							o = void 0;
						this.on(e, o = function () {
							t(), n.off(e, o)
						})
					}
				}, {
					key: "handleResize",
					value: function () {}
				}, {
					key: "addClass",
					value: function (e) {
						this.el().classList.add(e)
					}
				}, {
					key: "removeClass",
					value: function (e) {
						this.el().classList.remove(e)
					}
				}, {
					key: "toggleClass",
					value: function (e) {
						this.el().classList.toggle(e)
					}
				}, {
					key: "show",
					value: function () {
						this.el().style.display = "block"
					}
				}, {
					key: "hide",
					value: function () {
						this.el().style.display = "none"
					}
				}, {
					key: "addChild",
					value: function (e, t, n) {
						var o = this.el();
						if (n || (n = -1), "function" == typeof t.el && t.el())
							if (n === -1) o.appendChild(t.el());
							else {
								var i = o.childNodes,
									r = i[n];
								o.insertBefore(t.el(), r)
							} this._children.push({
							name: e,
							component: t,
							location: o
						})
					}
				}, {
					key: "removeChild",
					value: function (e) {
						this._children = this._children.reduce(function (t, n) {
							return n.name !== e ? t.push(n) : n.component.dispose(), t
						}, [])
					}
				}, {
					key: "getChild",
					value: function (e) {
						for (var t = void 0, n = 0; n < this._children.length; n++)
							if (this._children[n].name === e) {
								t = this._children[n];
								break
							} return t ? t.component : null
					}
				}, {
					key: "player",
					get: function () {
						return this._player
					}
				}, {
					key: "options",
					get: function () {
						return this._options
					}
				}]), t
			}(u.default);
		n.default = f
	}, {
		"../utils": 36,
		"wolfy87-eventemitter": 5
	}],
	11: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = e("./TwoDVideo"),
				l = o(s),
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = function (e) {
					function t(e, n, o) {
						i(this, t);
						for (var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o)), s = new c.default.SphereBufferGeometry(500, 60, 40).toNonIndexed(), l = s.attributes.normal.array, u = s.attributes.uv.array, f = l.length / 3, d = 0; d < f / 2; d++) {
							var h = l[3 * d + 0],
								p = l[3 * d + 1],
								v = l[3 * d + 2],
								y = 0 == h && 0 == v ? 1 : Math.acos(p) / Math.sqrt(h * h + v * v) * (2 / Math.PI);
							u[2 * d + 0] = h * a.options.dualFish.circle1.rx * y * a.options.dualFish.circle1.coverX + a.options.dualFish.circle1.x, u[2 * d + 1] = v * a.options.dualFish.circle1.ry * y * a.options.dualFish.circle1.coverY + a.options.dualFish.circle1.y;
						}
						for (var m = f / 2; m < f; m++) {
							var _ = l[3 * m + 0],
								b = l[3 * m + 1],
								w = l[3 * m + 2],
								g = 0 == _ && 0 == w ? 1 : Math.acos(-b) / Math.sqrt(_ * _ + w * w) * (2 / Math.PI);
							u[2 * m + 0] = -_ * a.options.dualFish.circle2.rx * g * a.options.dualFish.circle2.coverX + a.options.dualFish.circle2.x, u[2 * m + 1] = w * a.options.dualFish.circle2.ry * g * a.options.dualFish.circle2.coverY + a.options.dualFish.circle2.y
						}
						return s.rotateX(a.options.Sphere.rotateX), s.rotateY(a.options.Sphere.rotateY), s.rotateZ(a.options.Sphere.rotateZ), s.scale(-1, 1, 1), a._mesh = new c.default.Mesh(s, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._scene.add(a._mesh), a
					}
					return a(t, e), t
				}(l.default);
			n.default = f
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./TwoDVideo": 21
	}],
	12: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = e("./TwoDVideo"),
				l = o(s),
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = function (e) {
					function t(e, n, o) {
						i(this, t);
						var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o)),
							s = new c.default.SphereGeometry(500, 60, 40);
						return s.scale(-1, 1, 1), a._mesh = new c.default.Mesh(s, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._scene.add(a._mesh), a
					}
					return a(t, e), t
				}(l.default);
			n.default = f
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./TwoDVideo": 21
	}],
	13: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = e("./TwoDVideo"),
				l = o(s),
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = function (e) {
					function t(e, n, o) {
						i(this, t);
						for (var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o)), s = new c.default.SphereBufferGeometry(500, 60, 40).toNonIndexed(), l = s.attributes.normal.array, u = s.attributes.uv.array, f = 0, d = l.length / 3; f < d; f++) {
							var h = l[3 * f + 0],
								p = l[3 * f + 1],
								v = l[3 * f + 2],
								y = Math.asin(Math.sqrt(h * h + v * v) / Math.sqrt(h * h + p * p + v * v)) / Math.PI;
							p < 0 && (y = 1 - y);
							var m = 0 === h && 0 === v ? 0 : Math.acos(h / Math.sqrt(h * h + v * v));
							v < 0 && (m *= -1), u[2 * f + 0] = -.8 * y * Math.cos(m) + .5, u[2 * f + 1] = .8 * y * Math.sin(m) + .5
						}
						return s.rotateX(a.options.Sphere.rotateX), s.rotateY(a.options.Sphere.rotateY), s.rotateZ(a.options.Sphere.rotateZ), s.scale(-1, 1, 1), a._mesh = new c.default.Mesh(s, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._scene.add(a._mesh), a
					}
					return a(t, e), t
				}(l.default);
			n.default = f
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./TwoDVideo": 21
	}],
	14: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = e("./Component"),
			u = o(l),
			c = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					i(this, t);
					var o = document.createElement("canvas");
					o.className = "vjs-panorama-video-helper-canvas", n.el = o;
					var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
					return a._videoElement = e.getVideoEl(), a._width = a._videoElement.offsetWidth, a._height = a._videoElement.offsetHeight, a.updateDimention(), o.style.display = "none", a._context = o.getContext("2d"), a._context.drawImage(a._videoElement, 0, 0, a._width, a._height), e.one("loadedmetadata", function () {
						a._width = a._videoElement.videoWidth, a._height = a._videoElement.videoHeight, a.updateDimention(), a.render()
					}), a
				}
				return a(t, e), s(t, [{
					key: "updateDimention",
					value: function () {
						this.el().width = this._width, this.el().height = this._height
					}
				}, {
					key: "el",
					value: function () {
						return this._el
					}
				}, {
					key: "render",
					value: function () {
						this._context.drawImage(this._videoElement, 0, 0, this._width, this._height)
					}
				}]), t
			}(u.default);
		n.default = c
	}, {
		"./Component": 10
	}],
	15: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				u = o(l),
				c = e("./Component"),
				f = o(c),
				d = e("./BaseCanvas"),
				h = (o(d), e("../utils")),
				p = {
					keyPoint: -1,
					duration: -1
				},
				v = function (e) {
					function t(e, n) {
						i(this, t);
						var o = void 0,
							a = n.element;
						"string" == typeof a ? (o = document.createElement("div"), o.innerText = a) : o = a, o.id = n.id || "", o.className = "vjs-marker", n.el = o;
						var s = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
						s._options = (0, h.mergeOptions)({}, p, n);
						var l = u.default.Math.degToRad(90 - n.location.lat),
							c = u.default.Math.degToRad(n.location.lon);
						return s._position = new u.default.Vector3(n.radius * Math.sin(l) * Math.cos(c), n.radius * Math.cos(l), n.radius * Math.sin(l) * Math.sin(c)), s.options.keyPoint < 0 && s.enableMarker(), s
					}
					return a(t, e), s(t, [{
						key: "enableMarker",
						value: function () {
							this._enable = !0, this.addClass("vjs-marker--enable"), this.options.onShow && this.options.onShow.call(null)
						}
					}, {
						key: "disableMarker",
						value: function () {
							this._enable = !1, this.removeClass("vjs-marker--enable"), this.options.onHide && this.options.onHide.call(null)
						}
					}, {
						key: "render",
						value: function (e, t) {
							var n = this._position.angleTo(t.target);
							if (n > .4 * Math.PI) this.addClass("vjs-marker--backside");
							else {
								this.removeClass("vjs-marker--backside");
								var o = this._position.clone().project(t),
									i = e.VRMode ? e._width / 2 : e._width,
									r = {
										x: (o.x + 1) / 2 * i,
										y: -(o.y - 1) / 2 * e._height
									};
								this.el().style.transform = "translate(" + r.x + "px, " + r.y + "px)"
							}
						}
					}, {
						key: "enable",
						get: function () {
							return this._enable
						}
					}, {
						key: "position",
						get: function () {
							return this._position
						}
					}]), t
				}(f.default);
			n.default = v
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"../utils": 36,
		"./BaseCanvas": 7,
		"./Component": 10
	}],
	16: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = e("./BaseCanvas"),
			l = (o(s), e("./Component")),
			u = o(l),
			c = e("./MarkerGroup"),
			f = o(c),
			d = e("../utils"),
			h = function (e) {
				function t(e, n) {
					i(this, t);
					var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
					if (o.el().classList.add("vjs-marker-container"), o._canvas = o.options.canvas, o.options.VREnable) ! function () {
						var e = new f.default(o.player, {
								id: "left_group",
								canvas: o._canvas,
								markers: o.options.markers,
								camera: o._canvas._camera
							}),
							t = o.options.markers.map(function (e) {
								var t = (0, d.mergeOptions)({}, e);
								return t.onShow = void 0, t.onHide = void 0, t
							}),
							n = new f.default(o.player, {
								id: "right_group",
								canvas: o._canvas,
								markers: t,
								camera: o._canvas._camera
							});
						o.addChild("leftMarkerGroup", e), o.addChild("rightMarkerGroup", n), e.attachEvents(), o._canvas.VRMode && n.attachEvents(), o.player.on("VRModeOn", function () {
							o.el().classList.add("vjs-marker-container--VREnable"), e.camera = o._canvas._cameraL, n.camera = o._canvas._cameraR, n.attachEvents()
						}), o.player.on("VRModeOff", function () {
							o.el().classList.remove("vjs-marker-container--VREnable"), e.camera = o._canvas._camera, n.detachEvents()
						})
					}();
					else {
						var a = new f.default(o.player, {
							id: "group",
							canvas: o._canvas,
							markers: o.options.markers,
							camera: o._canvas._camera
						});
						o.addChild("markerGroup", a), a.attachEvents()
					}
					return o
				}
				return a(t, e), t
			}(u.default);
		n.default = h
	}, {
		"../utils": 36,
		"./BaseCanvas": 7,
		"./Component": 10,
		"./MarkerGroup": 17
	}],
	17: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				u = (o(l), e("./Component")),
				c = o(u),
				f = e("./BaseCanvas"),
				d = (o(f), e("./Marker")),
				h = o(d),
				p = function (e) {
					function t(e, n) {
						i(this, t);
						var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
						return o._totalMarkers = 0, o._markers = [], o._camera = n.camera, o.el().classList.add("vjs-marker-group"), o._canvas = n.canvas, o.options.markers.forEach(function (e) {
							o.addMarker(e)
						}), o.renderMarkers(), o
					}
					return a(t, e), s(t, [{
						key: "attachEvents",
						value: function () {
							this.el().classList.add("vjs-marker-group--enable"), this.player.on("timeupdate", this.updateMarkers.bind(this)), this._canvas.addListener("render", this.renderMarkers.bind(this))
						}
					}, {
						key: "detachEvents",
						value: function () {
							this.el().classList.remove("vjs-marker-group--enable"), this.player.off("timeupdate", this.updateMarkers.bind(this)), this._canvas.removeListener("render", this.renderMarkers.bind(this))
						}
					}, {
						key: "addMarker",
						value: function (e) {
							this._totalMarkers++, e.id = this.options.id + "_" + (e.id ? e.id : "marker_" + this._totalMarkers);
							var t = new h.default(this.player, e);
							return this.addChild(e.id, t), this._markers.push(t), t
						}
					}, {
						key: "removeMarker",
						value: function (e) {
							this.removeChild(e)
						}
					}, {
						key: "updateMarkers",
						value: function () {
							var e = 1e3 * this.player.getVideoEl().currentTime;
							this._markers.forEach(function (t) {
								t.options.keyPoint >= 0 && (t.options.duration > 0 ? t.options.keyPoint <= e && e < t.options.keyPoint + t.options.duration ? !t.enable && t.enableMarker() : t.enable && t.disableMarker() : t.options.keyPoint <= e ? !t.enable && t.enableMarker() : t.enable && t.disableMarker())
							})
						}
					}, {
						key: "renderMarkers",
						value: function () {
							var e = this;
							this._markers.forEach(function (t) {
								t.enable && t.render(e._canvas, e._camera)
							})
						}
					}, {
						key: "camera",
						set: function (e) {
							this._camera = e
						}
					}]), t
				}(c.default);
			n.default = p
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./BaseCanvas": 7,
		"./Component": 10,
		"./Marker": 15
	}],
	18: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = e("./Component"),
			l = o(s),
			u = function (e) {
				function t(e, n) {
					i(this, t);
					var o = void 0,
						a = n.Message;
					return "string" == typeof a ? (o = document.createElement("div"), o.className = "vjs-video-notice-label vjs-video-notice-show", o.innerText = a) : (o = a, o.classList.add("vjs-video-notice-show")), n.el = o, r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n))
				}
				return a(t, e), t
			}(l.default);
		n.default = u
	}, {
		"./Component": 10
	}],
	19: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = function e(t, n, o) {
					null === t && (t = Function.prototype);
					var i = Object.getOwnPropertyDescriptor(t, n);
					if (void 0 === i) {
						var r = Object.getPrototypeOf(t);
						return null === r ? void 0 : e(r, n, o)
					}
					if ("value" in i) return i.value;
					var a = i.get;
					if (void 0 !== a) return a.call(o)
				},
				u = e("./BaseCanvas"),
				c = o(u),
				f = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				d = o(f),
				h = function (e) {
					function t(e, n, o) {
						i(this, t);
						var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o));
						a._scene = new d.default.Scene;
						var s = a._width / a._height;
						return a._cameraL = new d.default.PerspectiveCamera(a.options.initFov, s, 1, 2e3), a._cameraL.target = new d.default.Vector3(0, 0, 0), a._cameraR = new d.default.PerspectiveCamera(a.options.initFov, s / 2, 1, 2e3), a._cameraR.position.set(1e3, 0, 0), a._cameraR.target = new d.default.Vector3(1e3, 0, 0), a
					}
					return a(t, e), s(t, [{
						key: "handleResize",
						value: function () {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleResize", this).call(this);
							var e = this._width / this._height;
							this.VRMode ? (e /= 2, this._cameraL.aspect = e, this._cameraR.aspect = e, this._cameraL.updateProjectionMatrix(), this._cameraR.updateProjectionMatrix()) : (this._cameraL.aspect = e, this._cameraL.updateProjectionMatrix())
						}
					}, {
						key: "handleMouseWheel",
						value: function (e) {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleMouseWheel", this).call(this, e), e.wheelDeltaY ? this._cameraL.fov -= .05 * e.wheelDeltaY : e.wheelDelta ? this._cameraL.fov -= .05 * e.wheelDelta : e.detail && (this._cameraL.fov += 1 * e.detail), this._cameraL.fov = Math.min(this.options.maxFov, this._cameraL.fov), this._cameraL.fov = Math.max(this.options.minFov, this._cameraL.fov), this._cameraL.updateProjectionMatrix(), this.VRMode && (this._cameraR.fov = this._cameraL.fov, this._cameraR.updateProjectionMatrix())
						}
					}, {
						key: "enableVR",
						value: function () {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "enableVR", this).call(this), this._scene.add(this._meshR), this.handleResize()
						}
					}, {
						key: "disableVR",
						value: function () {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "disableVR", this).call(this), this._scene.remove(this._meshR), this.handleResize()
						}
					}, {
						key: "render",
						value: function () {
							if (l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "render", this).call(this), this._cameraL.target.x = 500 * Math.sin(this._phi) * Math.cos(this._theta), this._cameraL.target.y = 500 * Math.cos(this._phi), this._cameraL.target.z = 500 * Math.sin(this._phi) * Math.sin(this._theta), this._cameraL.lookAt(this._cameraL.target), this.VRMode) {
								var e = this._width / 2,
									n = this._height;
								this._cameraR.target.x = 1e3 + 500 * Math.sin(this._phi) * Math.cos(this._theta), this._cameraR.target.y = 500 * Math.cos(this._phi), this._cameraR.target.z = 500 * Math.sin(this._phi) * Math.sin(this._theta), this._cameraR.lookAt(this._cameraR.target), this._renderer.setViewport(0, 0, e, n), this._renderer.setScissor(0, 0, e, n), this._renderer.render(this._scene, this._cameraL), this._renderer.setViewport(e, 0, e, n), this._renderer.setScissor(e, 0, e, n), this._renderer.render(this._scene, this._cameraR)
							} else this._renderer.render(this._scene, this._cameraL)
						}
					}]), t
				}(c.default);
			n.default = h
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./BaseCanvas": 7
	}],
	20: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = e("./Component"),
			l = o(s),
			u = function (e) {
				function t(e, n) {
					i(this, t);
					var o = void 0;
					o = document.createElement("img"), o.src = n.posterSrc, n.el = o;
					var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
					return a.one("load", function () {
						n.onComplete && n.onComplete()
					}), a
				}
				return a(t, e), t
			}(l.default);
		n.default = u
	}, {
		"./Component": 10
	}],
	21: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = function e(t, n, o) {
					null === t && (t = Function.prototype);
					var i = Object.getOwnPropertyDescriptor(t, n);
					if (void 0 === i) {
						var r = Object.getPrototypeOf(t);
						return null === r ? void 0 : e(r, n, o)
					}
					if ("value" in i) return i.value;
					var a = i.get;
					if (void 0 !== a) return a.call(o)
				},
				u = e("./BaseCanvas"),
				c = o(u),
				f = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				d = o(f),
				h = e("../utils"),
				p = function (e) {
					function t(e, n, o) {
						i(this, t);
						var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o));
						return a._scene = new d.default.Scene, a._camera = new d.default.PerspectiveCamera(a.options.initFov, a._width / a._height, 1, 2e3), a._camera.target = new d.default.Vector3(0, 0, 0), a
					}
					return a(t, e), s(t, [{
						key: "enableVR",
						value: function () {
							if (l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "enableVR", this).call(this), "undefined" != typeof window.vrHMD) {
								var e = window.vrHMD.getEyeParameters("left"),
									n = window.vrHMD.getEyeParameters("right");
								this._eyeFOVL = e.recommendedFieldOfView, this._eyeFOVR = n.recommendedFieldOfView
							}
							this._cameraL = new d.default.PerspectiveCamera(this._camera.fov, this._width / 2 / this._height, 1, 2e3), this._cameraR = new d.default.PerspectiveCamera(this._camera.fov, this._width / 2 / this._height, 1, 2e3), this._cameraL.target = new d.default.Vector3(0, 0, 0), this._cameraR.target = new d.default.Vector3(0, 0, 0)
						}
					}, {
						key: "disableVR",
						value: function () {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "disableVR", this).call(this), this._renderer.setViewport(0, 0, this._width, this._height), this._renderer.setScissor(0, 0, this._width, this._height)
						}
					}, {
						key: "handleResize",
						value: function () {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleResize", this).call(this), this._camera.aspect = this._width / this._height, this._camera.updateProjectionMatrix(), this.VRMode && (this._cameraL.aspect = this._camera.aspect / 2, this._cameraR.aspect = this._camera.aspect / 2, this._cameraL.updateProjectionMatrix(), this._cameraR.updateProjectionMatrix())
						}
					}, {
						key: "handleMouseWheel",
						value: function (e) {
							l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleMouseWheel", this).call(this, e), e.wheelDeltaY ? this._camera.fov -= .05 * e.wheelDeltaY : e.wheelDelta ? this._camera.fov -= .05 * e.wheelDelta : e.detail && (this._camera.fov += 1 * e.detail), this._camera.fov = Math.min(this.options.maxFov, this._camera.fov), this._camera.fov = Math.max(this.options.minFov, this._camera.fov), this._camera.updateProjectionMatrix(), this.VRMode && (this._cameraL.fov = this._camera.fov, this._cameraR.fov = this._camera.fov, this._cameraL.updateProjectionMatrix(), this._cameraR.updateProjectionMatrix())
						}
					}, {
						key: "handleTouchMove",
						value: function (e) {
							if (l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleTouchMove", this).call(this, e), this._isUserPinch) {
								var n = (0, h.getTouchesDistance)(e.touches);
								e.wheelDeltaY = 2 * (n - this._multiTouchDistance), this.handleMouseWheel(e), this._multiTouchDistance = n
							}
						}
					}, {
						key: "render",
						value: function () {
							if (l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "render", this).call(this), this._camera.target.x = 500 * Math.sin(this._phi) * Math.cos(this._theta), this._camera.target.y = 500 * Math.cos(this._phi), this._camera.target.z = 500 * Math.sin(this._phi) * Math.sin(this._theta), this._camera.lookAt(this._camera.target), this.VRMode) {
								var e = this._width / 2,
									n = this._height;
								if ("undefined" != typeof window.vrHMD) this._cameraL.projectionMatrix = (0, h.fovToProjection)(this._eyeFOVL, !0, this._camera.near, this._camera.far), this._cameraR.projectionMatrix = (0, h.fovToProjection)(this._eyeFOVR, !0, this._camera.near, this._camera.far);
								else {
									var o = this._lon + this.options.VRGapDegree,
										i = this._lon - this.options.VRGapDegree,
										r = d.default.Math.degToRad(o),
										a = d.default.Math.degToRad(i);
									this._cameraL.target.x = 500 * Math.sin(this._phi) * Math.cos(r), this._cameraL.target.y = this._camera.target.y, this._cameraL.target.z = 500 * Math.sin(this._phi) * Math.sin(r), this._cameraL.lookAt(this._cameraL.target), this._cameraR.target.x = 500 * Math.sin(this._phi) * Math.cos(a), this._cameraR.target.y = this._camera.target.y, this._cameraR.target.z = 500 * Math.sin(this._phi) * Math.sin(a), this._cameraR.lookAt(this._cameraR.target)
								}
								this._renderer.setViewport(0, 0, e, n), this._renderer.setScissor(0, 0, e, n), this._renderer.render(this._scene, this._cameraL), this._renderer.setViewport(e, 0, e, n), this._renderer.setScissor(e, 0, e, n), this._renderer.render(this._scene, this._cameraR)
							} else this._renderer.render(this._scene, this._camera)
						}
					}]), t
				}(c.default);
			n.default = p
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"../utils": 36,
		"./BaseCanvas": 7
	}],
	22: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = e("./ThreeDVideo"),
				l = o(s),
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = function (e) {
					function t(e, n, o) {
						i(this, t);
						for (var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o)), s = new c.default.SphereBufferGeometry(500, 60, 40, 0, Math.PI).toNonIndexed(), l = new c.default.SphereBufferGeometry(500, 60, 40, 0, Math.PI).toNonIndexed(), u = s.attributes.uv.array, f = s.attributes.normal.array, d = 0; d < f.length / 3; d++) u[2 * d] = u[2 * d] / 2;
						for (var h = l.attributes.uv.array, p = l.attributes.normal.array, v = 0; v < p.length / 3; v++) h[2 * v] = h[2 * v] / 2 + .5;
						return s.scale(-1, 1, 1), l.scale(-1, 1, 1), a._meshL = new c.default.Mesh(s, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._meshR = new c.default.Mesh(l, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._meshR.position.set(1e3, 0, 0), a._scene.add(a._meshL), a
					}
					return a(t, e), t
				}(l.default);
			n.default = f
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./ThreeDVideo": 19
	}],
	23: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = e("./ThreeDVideo"),
				l = o(s),
				u = "undefined" != typeof window ? window.THREE : "undefined" != typeof t ? t.THREE : null,
				c = o(u),
				f = function (e) {
					function t(e, n, o) {
						i(this, t);
						for (var a = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, o)), s = new c.default.SphereBufferGeometry(500, 60, 40).toNonIndexed(), l = new c.default.SphereBufferGeometry(500, 60, 40).toNonIndexed(), u = s.attributes.uv.array, f = s.attributes.normal.array, d = 0; d < f.length / 3; d++) u[2 * d + 1] = u[2 * d + 1] / 2;
						for (var h = l.attributes.uv.array, p = l.attributes.normal.array, v = 0; v < p.length / 3; v++) h[2 * v + 1] = h[2 * v + 1] / 2 + .5;
						return s.scale(-1, 1, 1), l.scale(-1, 1, 1), a._meshL = new c.default.Mesh(s, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._meshR = new c.default.Mesh(l, new c.default.MeshBasicMaterial({
							map: a._texture
						})), a._meshR.position.set(1e3, 0, 0), a._scene.add(a._meshL), a
					}
					return a(t, e), t
				}(l.default);
			n.default = f
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"./ThreeDVideo": 19
	}],
	24: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = function e(t, n, o) {
				null === t && (t = Function.prototype);
				var i = Object.getOwnPropertyDescriptor(t, n);
				if (void 0 === i) {
					var r = Object.getPrototypeOf(t);
					return null === r ? void 0 : e(r, n, o)
				}
				if ("value" in i) return i.value;
				var a = i.get;
				if (void 0 !== a) return a.call(o)
			},
			u = e("./Button"),
			c = o(u),
			f = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					return i(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n))
				}
				return a(t, e), s(t, [{
					key: "buildCSSClass",
					value: function () {
						return "vjs-VR-control " + l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "buildCSSClass", this).call(this)
					}
				}, {
					key: "handleClick",
					value: function (e) {
						l(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "handleClick", this).call(this, e), this.toggleClass("enable");
						var n = this.player.getComponent("VideoCanvas"),
							o = n.VRMode;
						o ? n.disableVR() : n.enableVR(), o ? this.player.trigger("VRModeOff") : this.player.trigger("VRModeOn"), !o && this.options.VRFullscreen && this.player.enableFullscreen()
					}
				}]), t
			}(c.default);
		n.default = f
	}, {
		"./Button": 8
	}],
	25: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.VR180Defaults = n.defaults = void 0;
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = e("iphone-inline-video"),
			u = o(l),
			c = e("wolfy87-eventemitter"),
			f = o(c),
			d = e("./Components/Equirectangular"),
			h = o(d),
			p = e("./Components/Fisheye"),
			v = o(p),
			y = e("./Components/DualFisheye"),
			m = o(y),
			_ = e("./Components/VR3603D"),
			b = o(_),
			w = e("./Components/VR1803D"),
			g = o(w),
			k = e("./Components/Notification"),
			O = o(k),
			E = e("./Components/Thumbnail"),
			M = o(E),
			j = e("./Components/VRButton"),
			P = o(j),
			C = e("./Components/MarkerContainer"),
			T = o(C),
			L = e("./Components/Animation"),
			R = o(L),
			x = e("./utils"),
			V = (0, x.mobileAndTabletcheck)(),
			S = ["equirectangular", "fisheye", "dual_fisheye", "VR1803D", "VR3603D"],
			D = n.defaults = {
				videoType: "equirectangular",
				MouseEnable: !0,
				clickAndDrag: !1,
				movingSpeed: {
					x: 5e-4,
					y: 5e-4
				},
				clickToToggle: !0,
				scrollable: !0,
				resizable: !0,
				useHelperCanvas: "auto",
				initFov: 75,
				maxFov: 105,
				minFov: 51,
				initLat: 0,
				initLon: 180,
				returnLatSpeed: .5,
				returnLonSpeed: 2,
				backToInitLat: !1,
				backToInitLon: !1,
				minLat: -85,
				maxLat: 85,
				minLon: 0,
				maxLon: 360,
				autoMobileOrientation: !0,
				mobileVibrationValue: (0, x.isIos)() ? .022 : 1,
				VREnable: V,
				VRGapDegree: .5,
				VRFullscreen: !0,
				PanoramaThumbnail: !1,
				KeyboardControl: !1,
				KeyboardMovingSpeed: {
					x: 1,
					y: 1
				},
				Sphere: {
					rotateX: 0,
					rotateY: 0,
					rotateZ: 0
				},
				dualFish: {
					width: 1920,
					height: 1080,
					circle1: {
						x: .240625,
						y: .553704,
						rx: .23333,
						ry: .43148,
						coverX: .913,
						coverY: .9
					},
					circle2: {
						x: .757292,
						y: .553704,
						rx: .232292,
						ry: .4296296,
						coverX: .913,
						coverY: .9308
					}
				},
				Notice: {
					Enable: !0,
					Message: "Please use your mouse drag and drop the video.",
					HideTime: 3e3
				},
				Markers: !1,
				Animations: !1
			},
			I = n.VR180Defaults = {
				initLat: 0,
				initLon: 90,
				minLat: -75,
				maxLat: 55,
				minLon: 50,
				maxLon: 130,
				clickAndDrag: !0
			},
			F = function (e) {
				function t(e) {
					var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
					i(this, t);
					var o = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
					if (t.checkOptions(n), "VR1803D" === n.videoType && (n = (0, x.mergeOptions)({}, I, n)), o._options = (0, x.mergeOptions)({}, D, n), o._player = e, o.player.addClass("vjs-panorama"), !x.Detector.webgl) return o.popupNotification((0, x.webGLErrorMessage)()), r(o);
					var a = t.chooseVideoComponent(o.options.videoType);
					if (o.options.PanoramaThumbnail && e.getThumbnailURL()) {
						var s = e.getThumbnailURL(),
							l = new M.default(e, {
								posterSrc: s,
								onComplete: function () {
									o.thumbnailCanvas && (o.thumbnailCanvas._texture.needsUpdate = !0, o.thumbnailCanvas.startAnimation())
								}
							});
						o.player.addComponent("Thumbnail", l), l.el().style.display = "none", o._thumbnailCanvas = new a(e, o.options, l.el()), o.player.addComponent("ThumbnailCanvas", o.thumbnailCanvas), o.player.one("play", function () {
							o.thumbnailCanvas && o.thumbnailCanvas.hide(), o.player.removeComponent("Thumbnail"), o.player.removeComponent("ThumbnailCanvas"), o._thumbnailCanvas = null
						})
					}
					if (V) {
						var c = o.player.getVideoEl();
						(0, x.isRealIphone)() && (c.setAttribute("playsinline", ""), (0, u.default)(c, !0)), o.player.addClass("vjs-panorama-mobile-inline-video"), o.player.removeClass("vjs-using-native-controls")
					}
					if (o.options.VREnable) {
						var f = o.player.controlBar(),
							d = f.childNodes.length,
							h = new P.default(e, o.options);
						h.disable(), o.player.addComponent("VRButton", h, o.player.controlBar(), d - 1)
					}
					return o.player.ready(function () {
						if (o._videoCanvas = new a(e, o.options, e.getVideoEl()), o.videoCanvas.hide(), o.player.addComponent("VideoCanvas", o.videoCanvas), o.attachEvents(), o.options.VREnable) {
							var t = o.player.getComponent("VRButton");
							t && t.enable()
						}
						o.options.ready && o.options.ready.call(o)
					}), o.player.registerTriggerCallback(function (e) {
						o.trigger(e)
					}), o
				}
				return a(t, e), s(t, null, [{
					key: "checkOptions",
					value: function (e) {
						"3dVideo" === e.videoType ? ((0, x.warning)("videoType: " + String(e.videoType) + " is deprecated, please use VR3603D"), e.videoType = "VR3603D") : e.videoType && S.indexOf(e.videoType) === -1 && ((0, x.warning)("videoType: " + String(e.videoType) + " is not supported, set video type to " + String(D.videoType) + "."), e.videoType = D.videoType), "undefined" != typeof e.backToVerticalCenter && ((0, x.warning)("backToVerticalCenter is deprecated, please use backToInitLat."), e.backToInitLat = e.backToVerticalCenter), "undefined" != typeof e.backToHorizonCenter && ((0, x.warning)("backToHorizonCenter is deprecated, please use backToInitLon."), e.backToInitLon = e.backToHorizonCenter), "undefined" != typeof e.returnStepLat && ((0, x.warning)("returnStepLat is deprecated, please use returnLatSpeed."), e.returnLatSpeed = e.returnStepLat), "undefined" != typeof e.returnStepLon && ((0, x.warning)("returnStepLon is deprecated, please use returnLonSpeed."), e.returnLonSpeed = e.returnStepLon), "undefined" != typeof e.helperCanvas && (0, x.warning)("helperCanvas is deprecated, you don't have to set it up on new version."), "undefined" != typeof e.callback && ((0, x.warning)("callback is deprecated, please use ready."), e.ready = e.callback), "undefined" == typeof e.Sphere && (e.Sphere = {}), "undefined" != typeof e.rotateX && ((0, x.warning)("rotateX is deprecated, please use Sphere:{ rotateX: 0, rotateY: 0, rotateZ: 0}."), e.Sphere && (e.Sphere.rotateX = e.rotateX)), "undefined" != typeof e.rotateY && ((0, x.warning)("rotateY is deprecated, please use Sphere:{ rotateX: 0, rotateY: 0, rotateZ: 0}."), e.Sphere && (e.Sphere.rotateY = e.rotateY)), "undefined" != typeof e.rotateZ && ((0, x.warning)("rotateZ is deprecated, please use Sphere:{ rotateX: 0, rotateY: 0, rotateZ: 0}."), e.Sphere && (e.Sphere.rotateY = e.rotateZ)), "undefined" == typeof e.Notice && (e.Notice = {}), "undefined" != typeof e.showNotice && ((0, x.warning)("showNotice is deprecated, please use Notice: { Enable: true }"), e.Notice && (e.Notice.Enable = e.showNotice)), "undefined" != typeof e.NoticeMessage && ((0, x.warning)('NoticeMessage is deprecated, please use Notice: { Message: "" }'), e.Notice && (e.Notice.Message = e.NoticeMessage)), "undefined" != typeof e.autoHideNotice && ((0, x.warning)("autoHideNotice is deprecated, please use Notice: { HideTime: 3000 }"), e.Notice && (e.Notice.HideTime = e.autoHideNotice))
					}
				}, {
					key: "chooseVideoComponent",
					value: function (e) {
						var t = void 0;
						switch (e) {
							case "equirectangular":
								t = h.default;
								break;
							case "fisheye":
								t = v.default;
								break;
							case "dual_fisheye":
								t = m.default;
								break;
							case "VR3603D":
								t = b.default;
								break;
							case "VR1803D":
								t = g.default;
								break;
							default:
								t = h.default
						}
						return t
					}
				}]), s(t, [{
					key: "dispose",
					value: function () {
						this.detachEvents(), this.player.getVideoEl().style.visibility = "visible", this.player.removeComponent("VideoCanvas")
					}
				}, {
					key: "attachEvents",
					value: function () {
						var e = this;
						this.options.Notice && this.options.Notice.Enable && this.player.one("playing", function () {
							var t = e.options.Notice && e.options.Notice.Message || "";
							e.popupNotification(t)
						});
						var t = function () {
							if (e.player.getVideoEl().style.visibility = "hidden", e.videoCanvas.startAnimation(), e.videoCanvas.show(), e.options.Markers && Array.isArray(e.options.Markers)) {
								var t = new T.default(e.player, {
									canvas: e.videoCanvas,
									markers: e.options.Markers,
									VREnable: e.options.VREnable
								});
								e.player.addComponent("markerContainer", t)
							}
							e.options.Animation && Array.isArray(e.options.Animation) && (e._animation = new R.default(e.player, {
								animation: e.options.Animation,
								canvas: e.videoCanvas
							})), window.console && window.console.error && ! function () {
								var t = window.console.error,
									n = window.console.warn;
								window.console.error = function (t) {
									t.message.indexOf("insecure") !== -1 && (e.popupNotification((0, x.crossDomainWarning)()), e.dispose())
								}, window.console.warn = function (t) {
									t.indexOf("gl.getShaderInfoLog") !== -1 && (e.popupNotification((0, x.crossDomainWarning)()), e.dispose(), window.console.warn = n)
								}, setTimeout(function () {
									window.console.error = t, window.console.warn = n
								}, 500)
							}()
						};
						this.player.paused() ? this.player.one("play", t) : t();
						var n = function () {
							e.player.reportUserActivity()
						};
						this.videoCanvas.addListeners({
							touchMove: n,
							tap: n
						})
					}
				}, {
					key: "detachEvents",
					value: function () {
						this.thumbnailCanvas && this.thumbnailCanvas.stopAnimation(), this.videoCanvas && this.videoCanvas.stopAnimation()
					}
				}, {
					key: "popupNotification",
					value: function (e) {
						var t = this.player.addComponent("Notice", new O.default(this.player, {
							Message: e
						}));
						this.options.Notice && this.options.Notice.HideTime && this.options.Notice.HideTime > 0 && setTimeout(function () {
							t.removeClass("vjs-video-notice-show"), t.addClass("vjs-video-notice-fadeOut"), t.one(x.transitionEvent, function () {
								t.hide(), t.removeClass("vjs-video-notice-fadeOut")
							})
						}, this.options.Notice.HideTime)
					}
				}, {
					key: "addTimeline",
					value: function (e) {
						this._animation.addTimeline(e)
					}
				}, {
					key: "enableAnimation",
					value: function () {
						this._animation.attachEvents()
					}
				}, {
					key: "disableAnimation",
					value: function () {
						this._animation.detachEvents()
					}
				}, {
					key: "getCoordinates",
					value: function () {
						var e = this.thumbnailCanvas || this.videoCanvas;
						return {
							lat: e._lat,
							lon: e._lon
						}
					}
				}, {
					key: "thumbnailCanvas",
					get: function () {
						return this._thumbnailCanvas
					}
				}, {
					key: "videoCanvas",
					get: function () {
						return this._videoCanvas
					}
				}, {
					key: "player",
					get: function () {
						return this._player
					}
				}, {
					key: "options",
					get: function () {
						return this._options
					}
				}]), t
			}(f.default);
		n.default = F
	}, {
		"./Components/Animation": 6,
		"./Components/DualFisheye": 11,
		"./Components/Equirectangular": 12,
		"./Components/Fisheye": 13,
		"./Components/MarkerContainer": 16,
		"./Components/Notification": 18,
		"./Components/Thumbnail": 20,
		"./Components/VR1803D": 22,
		"./Components/VR3603D": 23,
		"./Components/VRButton": 24,
		"./utils": 36,
		"iphone-inline-video": 3,
		"wolfy87-eventemitter": 5
	}],
	26: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var i = e("./tech/Loader"),
			r = o(i),
			a = e("./Panorama"),
			s = o(a),
			l = (0, r.default)(window.VIDEO_PANORAMA);
		if (!l) throw new Error("Could not found support player.");
		l.registerPlugin();
		var u = function (e, t) {
			var n = "string" == typeof e ? document.querySelector(e) : e;
			if (l) {
				var o = new l(n, t),
					i = new s.default(o, t);
				return i
			}
		};
		window.Panorama = u, n.default = u
	}, {
		"./Panorama": 25,
		"./tech/Loader": 28
	}],
	27: [function (e, t, n) {
		"use strict";

		function o(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var i = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			r = function () {
				function e(t) {
					if (o(this, e), Object.getPrototypeOf(this) === e.prototype) throw Error("abstract class should not be instantiated directly; write a subclass");
					this.playerInstance = t, this._components = []
				}
				return i(e, [{
					key: "registerTriggerCallback",
					value: function (e) {
						this._triggerCallback = e
					}
				}, {
					key: "el",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "getVideoEl",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "getThumbnailURL",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "on",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "off",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "one",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "trigger",
					value: function (e) {
						throw Error("Not implemented")
					}
				}, {
					key: "addClass",
					value: function (e) {
						throw Error("Not implemented")
					}
				}, {
					key: "removeClass",
					value: function (e) {
						throw Error("Not implemented")
					}
				}, {
					key: "addComponent",
					value: function (e, t, n, o) {
						if (n || (n = this.el()), o || (o = -1), "function" == typeof t.el && t.el())
							if (o === -1) n.appendChild(t.el());
							else {
								var i = n.childNodes,
									r = i[o];
								n.insertBefore(t.el(), r)
							} return this._components.push({
							name: e,
							component: t,
							location: n
						}), t
					}
				}, {
					key: "removeComponent",
					value: function (e) {
						this._components = this._components.reduce(function (t, n) {
							return n.name !== e ? t.push(n) : n.component.dispose(), t
						}, [])
					}
				}, {
					key: "getComponent",
					value: function (e) {
						for (var t = void 0, n = 0; n < this._components.length; n++)
							if (this._components[n].name === e) {
								t = this._components[n];
								break
							} return t ? t.component : null
					}
				}, {
					key: "play",
					value: function () {
						this.playerInstance.play()
					}
				}, {
					key: "pause",
					value: function () {
						this.playerInstance.pause()
					}
				}, {
					key: "paused",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "readyState",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "reportUserActivity",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "controlBar",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "enableFullscreen",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "ready",
					value: function (e) {
						throw Error("Not implemented")
					}
				}, {
					key: "components",
					get: function () {
						return this._components
					}
				}], [{
					key: "registerPlugin",
					value: function () {
						throw Error("Not implemented")
					}
				}]), e
			}();
		n.default = r
	}, {}],
	28: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e) {
			if ("undefined" != typeof e) {
				if (p[e]) return p[e];
				(0, h.warning)("playerType: " + e + " is not supported")
			}
			return null
		}

		function r() {
			if ("undefined" != typeof window.videojs) {
				var e = window.videojs.VERSION,
					t = (0, h.getVideojsVersion)(e);
				return 4 === t ? p.videojs_v4 : p.videojs_v5
			}
			return "undefined" != typeof window.MediaElementPlayer ? p.MediaElementPlayer : null
		}

		function a(e) {
			var t = i(e);
			return t || (t = r()), t
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = e("./Videojs4"),
			l = o(s),
			u = e("./Videojs5"),
			c = o(u),
			f = e("./MediaElementPlayer"),
			d = o(f),
			h = e("../utils"),
			p = {
				videojs_v4: l.default,
				videojs_v5: c.default,
				MediaElementPlayer: d.default
			};
		n.default = a
	}, {
		"../utils": 36,
		"./MediaElementPlayer": 29,
		"./Videojs4": 30,
		"./Videojs5": 31
	}],
	29: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = Object.assign || function (e) {
				for (var t = 1; t < arguments.length; t++) {
					var n = arguments[t];
					for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
				}
				return e
			},
			l = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			u = e("../Panorama"),
			c = o(u),
			f = e("../utils"),
			d = e("./BasePlayer"),
			h = o(d),
			p = function (e) {
				function t(e) {
					i(this, t);
					var n = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
					return (0, f.isIos)() && n._fullscreenOnIOS(), n
				}
				return a(t, e), l(t, [{
					key: "el",
					value: function () {
						return this.playerInstance.container
					}
				}, {
					key: "getVideoEl",
					value: function () {
						return this.playerInstance.domNode
					}
				}, {
					key: "getThumbnailURL",
					value: function () {
						return this.playerInstance.options.poster || this.getVideoEl().getAttribute("poster")
					}
				}, {
					key: "addClass",
					value: function (e) {
						this.playerInstance.container.classList.add(e)
					}
				}, {
					key: "removeClass",
					value: function (e) {
						this.playerInstance.container.classList.remove(e)
					}
				}, {
					key: "on",
					value: function () {
						var e = arguments.length <= 0 ? void 0 : arguments[0],
							t = arguments.length <= 1 ? void 0 : arguments[1];
						this.getVideoEl().addEventListener(e, t)
					}
				}, {
					key: "off",
					value: function () {
						var e = arguments.length <= 0 ? void 0 : arguments[0],
							t = arguments.length <= 1 ? void 0 : arguments[1];
						this.getVideoEl().removeEventListener(e, t)
					}
				}, {
					key: "one",
					value: function () {
						var e = this,
							t = arguments.length <= 0 ? void 0 : arguments[0],
							n = arguments.length <= 1 ? void 0 : arguments[1],
							o = void 0;
						this.on(t, o = function () {
							n(), e.off(t, o)
						})
					}
				}, {
					key: "trigger",
					value: function (e) {
						var t = (0, f.customEvent)(e, this.el());
						this.getVideoEl().dispatchEvent(t), this._triggerCallback && this._triggerCallback(e)
					}
				}, {
					key: "paused",
					value: function () {
						return this.getVideoEl().paused
					}
				}, {
					key: "readyState",
					value: function () {
						return this.getVideoEl().readyState
					}
				}, {
					key: "reportUserActivity",
					value: function () {
						this.playerInstance.showControls()
					}
				}, {
					key: "controlBar",
					value: function () {
						return this.playerInstance.controls
					}
				}, {
					key: "enableFullscreen",
					value: function () {
						this.playerInstance.isFullScreen || this.playerInstance.enterFullScreen()
					}
				}, {
					key: "_resizeCanvasFn",
					value: function (e) {
						var t = this;
						return function () {
							t.playerInstance.container.style.width = "100%", t.playerInstance.container.style.height = "100%", e.handleResize()
						}
					}
				}, {
					key: "_fullscreenOnIOS",
					value: function () {
						var e = this;
						this.playerInstance.enterFullScreen = function () {
							var t = e.getComponent("VideoCanvas"),
								n = e._resizeCanvasFn(t).bind(e);
							e.trigger("before_EnterFullscreen"), document.documentElement.classList.add(this.options.classPrefix + "fullscreen"), e.addClass(this.options.classPrefix + "container-fullscreen"), this.container.style.width = "100%", this.container.style.height = "100%", window.addEventListener("devicemotion", n), e.trigger("after_EnterFullscreen"), this.isFullScreen = !0, t.handleResize()
						}, this.playerInstance.exitFullScreen = function () {
							var t = e.getComponent("VideoCanvas"),
								n = e._resizeCanvasFn(t).bind(e);
							e.trigger("before_ExitFullscreen"), document.documentElement.classList.remove(this.options.classPrefix + "fullscreen"), e.removeClass(this.options.classPrefix + "container-fullscreen"), this.isFullScreen = !1, this.container.style.width = "", this.container.style.height = "", window.removeEventListener("devicemotion", n), e.trigger("after_ExitFullscreen"), t.handleResize()
						}
					}
				}, {
					key: "ready",
					value: function (e) {
						this.one("canplay", e)
					}
				}], [{
					key: "registerPlugin",
					value: function () {
						mejs.MepDefaults = (0, f.mergeOptions)(mejs.MepDefaults, {
							Panorama: s({}, u.defaults)
						}), MediaElementPlayer.prototype = (0, f.mergeOptions)(MediaElementPlayer.prototype, {
							buildPanorama: function (e) {
								if ("video" !== e.domNode.tagName.toLowerCase()) throw new Error("Panorama don't support third party player");
								var n = new t(e);
								e.panorama = new c.default(n, this.options.Panorama)
							},
							clearPanorama: function (e) {
								e.panorama && e.panorama.dispose()
							}
						})
					}
				}]), t
			}(h.default);
		n.default = p
	}, {
		"../Panorama": 25,
		"../utils": 36,
		"./BasePlayer": 27
	}],
	30: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = "undefined" != typeof window ? window.videojs : "undefined" != typeof t ? t.videojs : null,
				u = o(l),
				c = e("./videojs"),
				f = o(c),
				d = e("../Panorama"),
				h = o(d),
				p = function (e) {
					function t() {
						return i(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
					}
					return a(t, e), s(t, [{
						key: "getVideoEl",
						value: function () {
							return this.playerInstance.tech ? this.playerInstance.tech.el() : this.playerInstance.h.el()
						}
					}, {
						key: "_originalFullscreenClickFn",
						value: function () {
							return this.playerInstance.controlBar.fullscreenToggle.onClick || this.playerInstance.controlBar.fullscreenToggle.u
						}
					}], [{
						key: "registerPlugin",
						value: function () {
							u.default.plugin("panorama", function (e) {
								var n = new t(this),
									o = new h.default(n, e);
								return o
							})
						}
					}]), t
				}(f.default);
			n.default = p
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"../Panorama": 25,
		"./videojs": 32
	}],
	31: [function (e, t, n) {
		(function (t) {
			"use strict";

			function o(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function i(e, t) {
				if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
			}

			function r(e, t) {
				if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return !t || "object" != typeof t && "function" != typeof t ? e : t
			}

			function a(e, t) {
				if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
				e.prototype = Object.create(t && t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			var s = function () {
					function e(e, t) {
						for (var n = 0; n < t.length; n++) {
							var o = t[n];
							o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
						}
					}
					return function (t, n, o) {
						return n && e(t.prototype, n), o && e(t, o), t
					}
				}(),
				l = "undefined" != typeof window ? window.videojs : "undefined" != typeof t ? t.videojs : null,
				u = o(l),
				c = e("./videojs"),
				f = o(c),
				d = e("../Panorama"),
				h = o(d),
				p = function (e) {
					function t() {
						return i(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
					}
					return a(t, e), s(t, [{
						key: "getVideoEl",
						value: function () {
							return this.playerInstance.tech({
								IWillNotUseThisInPlugins: !0
							}).el()
						}
					}, {
						key: "_originalFullscreenClickFn",
						value: function () {
							return this.playerInstance.controlBar.fullscreenToggle.handleClick
						}
					}], [{
						key: "registerPlugin",
						value: function () {
							u.default.plugin("panorama", function (e) {
								var n = new t(this),
									o = new h.default(n, e);
								return o
							})
						}
					}]), t
				}(f.default);
			n.default = p
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {
		"../Panorama": 25,
		"./videojs": 32
	}],
	32: [function (e, t, n) {
		"use strict";

		function o(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		}

		function i(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function r(e, t) {
			if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
			return !t || "object" != typeof t && "function" != typeof t ? e : t
		}

		function a(e, t) {
			if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
			e.prototype = Object.create(t && t.prototype, {
				constructor: {
					value: e,
					enumerable: !1,
					writable: !0,
					configurable: !0
				}
			}), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var s = function () {
				function e(e, t) {
					for (var n = 0; n < t.length; n++) {
						var o = t[n];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
					}
				}
				return function (t, n, o) {
					return n && e(t.prototype, n), o && e(t, o), t
				}
			}(),
			l = e("./BasePlayer"),
			u = o(l),
			c = e("../Components/Component"),
			f = (o(c), e("../utils")),
			d = function (e) {
				function t(e) {
					i(this, t);
					var n = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
					return (0, f.isIos)() && n._fullscreenOnIOS(), n.on("fullscreenchange", function () {
						var e = n.getComponent("VideoCanvas");
						e.handleResize()
					}), n
				}
				return a(t, e), s(t, [{
					key: "el",
					value: function () {
						return this.playerInstance.el()
					}
				}, {
					key: "getVideoEl",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "getThumbnailURL",
					value: function () {
						return this.playerInstance.poster()
					}
				}, {
					key: "on",
					value: function () {
						var e;
						(e = this.playerInstance).on.apply(e, arguments)
					}
				}, {
					key: "off",
					value: function () {
						var e;
						(e = this.playerInstance).off.apply(e, arguments)
					}
				}, {
					key: "one",
					value: function () {
						var e;
						(e = this.playerInstance).one.apply(e, arguments)
					}
				}, {
					key: "addClass",
					value: function (e) {
						this.playerInstance.addClass(e)
					}
				}, {
					key: "removeClass",
					value: function (e) {
						this.playerInstance.removeClass(e)
					}
				}, {
					key: "_resizeCanvasFn",
					value: function (e) {
						return function () {
							e.handleResize()
						}
					}
				}, {
					key: "paused",
					value: function () {
						return this.playerInstance.paused()
					}
				}, {
					key: "readyState",
					value: function () {
						return this.playerInstance.readyState()
					}
				}, {
					key: "trigger",
					value: function (e) {
						this.playerInstance.trigger(e), this._triggerCallback && this._triggerCallback(e)
					}
				}, {
					key: "reportUserActivity",
					value: function () {
						this.playerInstance.reportUserActivity()
					}
				}, {
					key: "_originalFullscreenClickFn",
					value: function () {
						throw Error("Not implemented")
					}
				}, {
					key: "_fullscreenOnIOS",
					value: function () {
						var e = this;
						this.playerInstance.controlBar.fullscreenToggle.off("tap", this._originalFullscreenClickFn()), this.playerInstance.controlBar.fullscreenToggle.on("tap", function () {
							var t = e.getComponent("VideoCanvas"),
								n = e._resizeCanvasFn(t);
							e.playerInstance.isFullscreen() ? (e.trigger("before_ExitFullscreen"), e.playerInstance.isFullscreen(!1), e.playerInstance.exitFullWindow(), window.removeEventListener("devicemotion", n), e.trigger("after_ExitFullscreen")) : (e.trigger("before_EnterFullscreen"), e.playerInstance.isFullscreen(!0), e.playerInstance.enterFullWindow(), window.addEventListener("devicemotion", n), e.trigger("after_EnterFullscreen")), e.trigger("fullscreenchange")
						})
					}
				}, {
					key: "controlBar",
					value: function e() {
						var e = this.playerInstance.controlBar;
						return e.el()
					}
				}, {
					key: "enableFullscreen",
					value: function () {
						this.playerInstance.isFullscreen() || this.playerInstance.controlBar.fullscreenToggle.trigger("tap")
					}
				}, {
					key: "ready",
					value: function (e) {
						this.playerInstance.ready(e)
					}
				}]), t
			}(u.default);
		n.default = d
	}, {
		"../Components/Component": 10,
		"../utils": 36,
		"./BasePlayer": 27
	}],
	33: [function (e, t, n) {
		"use strict";

		function o() {
			var e = document.createElement("div"),
				t = {
					transition: "transitionend",
					OTransition: "oTransitionEnd",
					MozTransition: "transitionend",
					WebkitTransition: "webkitTransitionEnd"
				};
			for (var n in t)
				if (void 0 !== e.style[n]) return t[n]
		}

		function i(e, t, n, o) {
			return n * e / o + t
		}

		function r(e, t, n, o) {
			return e /= o, n * e * e + t
		}

		function a(e, t, n, o) {
			return e /= o, -n * e * (e - 2) + t
		}

		function s(e, t, n, o) {
			return e /= o / 2, e < 1 ? n / 2 * e * e + t : (e--, -n / 2 * (e * (e - 2) - 1) + t)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		n.transitionEvent = o(), n.easeFunctions = {
			linear: i,
			easeInQuad: r,
			easeOutQuad: a,
			easeInOutQuad: s
		}
	}, {}],
	34: [function (e, t, n) {
		"use strict";

		function o(e, t) {
			if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
		}

		function i() {
			var e = document.createElement("div");
			return e.id = "webgl-error-message", u.webgl || (e.innerHTML = window.WebGLRenderingContext ? ['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n") : ['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>', 'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n")), e
		}

		function r() {
			var e = -1;
			if ("Microsoft Internet Explorer" === navigator.appName) {
				var t = navigator.userAgent,
					n = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
				null !== n.exec(t) && (e = parseFloat(RegExp.$1))
			} else if ("Netscape" === navigator.appName)
				if (navigator.appVersion.indexOf("Trident") !== -1) e = 11;
				else {
					var o = navigator.userAgent,
						i = new RegExp("Edge/([0-9]{1,}[\\.0-9]{0,})");
					null !== i.exec(o) && (e = parseFloat(RegExp.$1))
				} return e
		}

		function a(e) {
			var t = [].slice.call(e.querySelectorAll("source")),
				n = !1;
			e.src && e.src.indexOf(".m3u8") > -1 && t.push({
				src: e.src,
				type: "application/x-mpegURL"
			});
			for (var o = 0; o < t.length; o++) {
				var i = t[o];
				if (("application/x-mpegURL" === i.type || "application/vnd.apple.mpegurl" === i.type) && /(Safari|AppleWebKit)/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
					n = !0;
					break
				}
			}
			return n
		}

		function s(e) {
			var t = r();
			return (t === -1 || t >= 13) && !a(e)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.webGLErrorMessage = i, n.ieOrEdgeVersion = r, n.isLiveStreamOnSafari = a, n.supportVideoTexture = s;
		var l = function e() {
				o(this, e), this.canvas = !!window.CanvasRenderingContext2D, this.webgl = !1;
				try {
					this.canvas = document.createElement("canvas"), this.webgl = !(!window.WebGLRenderingContext || !this.canvas.getContext("webgl") && !this.canvas.getContext("experimental-webgl"))
				} catch (e) {}
				this.workers = !!window.Worker, this.fileapi = window.File && window.FileReader && window.FileList && window.Blob
			},
			u = n.Detector = new l
	}, {}],
	35: [function (e, t, n) {
		"use strict";

		function o(e, t) {
			var n = new CustomEvent(e, {
				detail: {
					target: t
				}
			});
			return n
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.customEvent = o
	}, {}],
	36: [function (e, t, n) {
		"use strict";
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var o = e("./merge-options");
		Object.keys(o).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return o[e]
				}
			})
		});
		var i = e("./warning");
		Object.keys(i).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return i[e]
				}
			})
		});
		var r = e("./detector");
		Object.keys(r).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return r[e]
				}
			})
		});
		var a = e("./version");
		Object.keys(a).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return a[e]
				}
			})
		});
		var s = e("./mobile");
		Object.keys(s).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return s[e]
				}
			})
		});
		var l = e("./vr");
		Object.keys(l).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return l[e]
				}
			})
		});
		var u = e("./animation");
		Object.keys(u).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return u[e]
				}
			})
		});
		var c = e("./event");
		Object.keys(c).forEach(function (e) {
			"default" !== e && "__esModule" !== e && Object.defineProperty(n, e, {
				enumerable: !0,
				get: function () {
					return c[e]
				}
			})
		})
	}, {
		"./animation": 33,
		"./detector": 34,
		"./event": 35,
		"./merge-options": 37,
		"./mobile": 38,
		"./version": 39,
		"./vr": 40,
		"./warning": 41
	}],
	37: [function (e, t, n) {
		"use strict";

		function o(e) {
			return !!e && "object" === ("undefined" == typeof e ? "undefined" : r(e))
		}

		function i(e) {
			return o(e) && "[object Object]" === Object.prototype.toString.call(e) && e.constructor === Object
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
			return typeof e
		} : function (e) {
			return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
		};
		n.isObject = o, n.isPlain = i;
		n.mergeOptions = function e() {
			for (var t = arguments.length, n = Array(t), o = 0; o < t; o++) n[o] = arguments[o];
			var r = {};
			return n.forEach(function (t) {
				t && Object.getOwnPropertyNames(t).forEach(function (n) {
					var o = t[n];
					return i(o) ? (i(r[n]) || (r[n] = {}), void(r[n] = e(r[n], o))) : void(r[n] = o)
				})
			}), r
		}
	}, {}],
	38: [function (e, t, n) {
		"use strict";

		function o(e) {
			return Math.sqrt((e[0].clientX - e[1].clientX) * (e[0].clientX - e[1].clientX) + (e[0].clientY - e[1].clientY) * (e[0].clientY - e[1].clientY))
		}

		function i() {
			var e = !1;
			return function (t) {
				(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
			}(navigator.userAgent || navigator.vendor || window.opera), e
		}

		function r() {
			return /iPhone|iPad|iPod/i.test(navigator.userAgent)
		}

		function a() {
			return /iPhone|iPod/i.test(navigator.platform)
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.getTouchesDistance = o, n.mobileAndTabletcheck = i, n.isIos = r, n.isRealIphone = a
	}, {}],
	39: [function (e, t, n) {
		"use strict";

		function o(e) {
			var t = e.indexOf(".");
			if (t === -1) return 0;
			var n = parseInt(e.substring(0, t));
			return n
		}
		Object.defineProperty(n, "__esModule", {
			value: !0
		}), n.getVideojsVersion = o
	}, {}],
	40: [function (e, t, n) {
		(function (e) {
			"use strict";

			function t(e) {
				return e && e.__esModule ? e : {
					default: e
				}
			}

			function o(e) {
				var t = 2 / (e.leftTan + e.rightTan),
					n = (e.leftTan - e.rightTan) * t * .5,
					o = 2 / (e.upTan + e.downTan),
					i = (e.upTan - e.downTan) * o * .5;
				return {
					scale: [t, o],
					offset: [n, i]
				}
			}

			function i(e, t, n, i) {
				t = void 0 === t || t, n = void 0 === n ? .01 : n, i = void 0 === i ? 1e4 : i;
				var r = t ? -1 : 1,
					a = new s.default.Matrix4,
					l = a.elements,
					u = o(e);
				return l[0] = u.scale[0], l[1] = 0, l[2] = u.offset[0] * r, l[3] = 0, l[4] = 0, l[5] = u.scale[1], l[6] = -u.offset[1] * r, l[7] = 0, l[8] = 0, l[9] = 0, l[10] = i / (n - i) * -r, l[11] = i * n / (n - i), l[12] = 0, l[13] = 0, l[14] = r, l[15] = 0, a.transpose(), a
			}

			function r(e, t, n, o) {
				var r = Math.PI / 180,
					a = {
						upTan: Math.tan(e.upDegrees * r),
						downTan: Math.tan(e.downDegrees * r),
						leftTan: Math.tan(e.leftDegrees * r),
						rightTan: Math.tan(e.rightDegrees * r)
					};
				return i(a, t, n, o)
			}
			Object.defineProperty(n, "__esModule", {
				value: !0
			}), n.fovToProjection = r;
			var a = "undefined" != typeof window ? window.THREE : "undefined" != typeof e ? e.THREE : null,
				s = t(a)
		}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
	}, {}],
	41: [function (e, t, n) {
		(function (e) {
			"use strict";
			Object.defineProperty(n, "__esModule", {
				value: !0
			});
			n.warning = function (t) {
				if ("production" !== e.env.NODE_ENV) {
					"undefined" != typeof console && "function" == typeof console.error && console.error(t);
					try {
						throw new Error(t)
					} catch (e) {}
				}
			}, n.crossDomainWarning = function () {
				var e = document.createElement("div");
				return e.className = "vjs-cross-domain-unsupport", e.innerHTML = "Sorry, Your browser don't support cross domain.", e
			}
		}).call(this, e("_process"))
	}, {
		_process: 1
	}]
}, {}, [26]);