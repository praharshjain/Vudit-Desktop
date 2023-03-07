/**
 * videojs_snapshot_new
 * @version 1.0.3
 * @copyright 2020 searKing <searKingChan@gmail.com>
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
        typeof define === 'function' && define.amd ? define(['video.js'], factory) :
            (global.videojsSnapshot = factory(global.videojs));
}(this, (function (video) {
    'use strict';
    video = 'default' in video ? video['default'] : video;
    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var videojsSnapshot = createCommonjsModule(function (module) {
        // import videojs from 'video.js';
        // import {version as VERSION} from '../package.json';
        (function (root, factory) {
            if (typeof undefined === 'function' && undefined.amd) {
                // AMD. Register as an anonymous module.
                undefined(['video.js'], factory);
            } else if ('object' === 'object' && module.exports) {
                // Node. Does not work with strict CommonJS, but
                // only CommonJS-like environments that support module.exports,
                // like Node.
                module.exports = factory(video);
            } else {
                // Browser globals (root is window)
                root.returnExports = factory(root.videojs);
            }
        })(commonjsGlobal, function (videojs) {
            'use strict';

            // Default options for the plugin.
            var defaultOptions = {};
            // Cross-compatibility for Video.js 5 and 6.
            var registerPlugin = videojs.registerPlugin || videojs.plugin;

            // const dom = videojs.dom || videojs;
            var VjsComponent = videojs.getComponent('Component');
            var VjsButton = videojs.getComponent('Button');

            class ImageCaptureEngine extends VjsComponent {
                /**
                 * The constructor function for the class.
                 *
                 * @private
                 * @param {(videojs.Player|Object)} player - Video.js player instance.
                 * @param {Object} options - Player options.
                 */
                constructor(player, options) {
                    super(player, options);
                }
                formatTag(tag) {
                    if (!tag) {
                        return;
                    }
                    tag = tag.trim();
                    if (tag.length === 0) {
                        return;
                    }
                    return tag;
                }
                getDomByIdAndTag(id, tag) {
                    tag = this.formatTag(tag);
                    var dom = document.getElementById(id);
                    if (!tag || tag.trim().length === 0) {
                        return;
                    }
                    if (dom.tagName.toUpperCase() === tag.toUpperCase()) {
                        return dom;
                    }
                    return dom.getElementsByTagName(tag)[0];
                }
                getScreenContainerDomByIdAndTag(id, tag) {
                    tag = this.formatTag(tag);
                    if (!!tag) {
                        return this.getDomByIdAndTag(id, tag);
                    }
                    var dom = this.getDomByIdAndTag(id, 'object');
                    if (!!dom) {
                        return dom;
                    }
                    return this.getDomByIdAndTag(id, 'video');
                }
                drawCanvas(canvasDom, screenContainerDom) {
                    canvasDom.width = screenContainerDom.videoWidth;
                    canvasDom.height = screenContainerDom.videoHeight;
                    canvasDom.getContext('2d').drawImage(screenContainerDom, 0, 0, canvasDom.width, canvasDom.height);
                }
                imageCaptureByDom(screenContainerDom, canvasDom) {
                    var snapshotImageData;
                    if (!!screenContainerDom && screenContainerDom.tagName.toUpperCase() === "object".toUpperCase()) {
                        //flash case
                        snapshotImageData = screenContainerDom.vjs_snap();
                    } else {
                        this.drawCanvas(canvasDom, screenContainerDom);
                        snapshotImageData = canvasDom.toDataURL('image/png');
                    }
                    return snapshotImageData;
                }
                imageCaptureById(playerId, canvaserId) {
                    return this.imageCaptureByDom(this.getScreenContainerDomByIdAndTag(playerId), this.getDomByIdAndTag(canvaserId, 'canvas'));
                }
                imageCaptureByIdAndCanvasDom(playerId, canvaserDom) {
                    return this.imageCaptureByDom(this.getScreenContainerDomByIdAndTag(playerId), canvaserDom);
                }
            }
            /**
             * Take a snapshot of audio/video/images using the Video.js player.
             *
             * @class
             * @augments videojs.RecordBase
             */
            class SnapshoterComponent extends VjsComponent {
                /**
                 * The constructor function for the class.
                 *
                 * @param {(videojs.Player|Object)} player
                 * @param {Object} options - Player options.
                 */
                constructor(player, options) {
                    // run base component initializing with new options.
                    super(player, options);

                    // setup plugin options
                    this.loadOptions();

                    // (re)set recorder state
                    this.resetState();

                    // wait until player ui is ready
                    this.player().one('ready', this.setupUI.bind(this));
                    try {
                        // connect stream to recording engine
                        this.engine = new ImageCaptureEngine(this.player(), options);
                    } catch (err) {
                        throw new Error('Could not load ' + ImageCaptureEngine + ' plugin');
                    }
                }
                /**
                 * Remove any temporary data and references to streams.
                 * @private
                 */
                dispose() { }
                /**
                 * Setup plugin options.
                 */
                loadOptions() {
                    // record settings
                }

                /**
                 * Player UI is ready.
                 * @private
                 */
                setupUI() {
                    // insert custom controls on left-side of controlbar
                    this.player().controlBar.addChild(this.player().cameraButton);
                    this.player().controlBar.el().insertBefore(this.player().cameraButton.el(), this.player().controlBar.el().firstChild);

                    // customize controls
                    // XXX: below are customizations copied from videojs.wavesurfer that
                    //      tweak the video.js UI...
                    this.player().bigPlayButton.hide();

                    if (this.player().options_.controls) {
                        // videojs automatically hides the controls when no valid 'source'
                        // element is included in the 'audio' tag. Don't. Ever again.
                        this.player().controlBar.show();
                        this.player().controlBar.el().style.display = 'flex';
                    }
                }

                /**
                 * Indicates whether the plugin is currently recording or not.
                 *
                 * @return {boolean} Plugin currently recording or not.
                 */
                isSnapshoting() {
                    return this._snapshoting;
                }

                /**
                 * Indicates whether the plugin is currently processing recorded data
                 * or not.
                 *
                 * @return {boolean} Plugin processing or not.
                 */
                isProcessing() {
                    return this._processing;
                }

                /**
                 * Indicates whether the plugin is destroyed or not.
                 *
                 * @return {boolean} Plugin destroyed or not.
                 */
                isDestroyed() {
                    return this.player() && this.player().children() === null;
                }

                /**
                 * Start recording.
                 */
                start() {
                    if (!this.isProcessing()) {
                        this._snapshoting = true;
                        this._processing = true;

                        // hide play control
                        this.player().controlBar.playToggle.hide();

                        // create snapshot
                        this.createSnapshot();
                    }
                }

                /**
                 * Stop recording.
                 */
                stop() {
                    if (this.isProcessing()) {
                        this._snapshoting = false;
                        this._processing = false;
                    }
                    // show play control
                    this.player().controlBar.playToggle.show();
                }

                /**
                 * Destroy plugin and players and cleanup resources.
                 */
                destroy() {
                    // stop recording and device
                    this.stop();
                    // dispose player
                    this.player().dispose();

                    this.resetState();
                }

                /**
                 * Reset the plugin.
                 */
                reset() {

                    // stop recording and device
                    this.stop();

                    // reset options
                    this.loadOptions();

                    // reset recorder state
                    this.resetState();
                    // reset player
                    this.player().reset();

                    // reset UI
                    this.player().snapshotCanvas.hide();
                    this.player().cameraButton.hide();
                }

                /**
                 * Reset the plugin recorder state.
                 * @private
                 */
                resetState() {
                    this._snapshoting = false;
                    this._processing = false;
                }

                /**
                 * Create and display snapshot image.
                 * @private
                 */
                createSnapshot() {
                    var thiz = this;
                    this.captureFrame().then(function (snapshotImageData) {

                        thiz.player().trigger('snap', snapshotImageData);

                        // stop recording
                        thiz.stop();
                    });
                }

                /**
                 * Reset UI for retrying a snapshot image.
                 * @private
                 */
                retrySnapshot() {
                    this._processing = false;

                    // retry: hide the snapshot
                    this.player().snapshotCanvas.hide();
                }

                /**
                 * Capture frame from camera and copy data to canvas.
                 * @private
                 */
                captureFrame() {
                    var thiz = this;
                    var snapshotCanvas = this.player().snapshotCanvas.el().firstChild;

                    // set the canvas size to the dimensions of the camera,
                    // which also wipes the content of the canvas
                    snapshotCanvas.width = this.player().videoWidth();
                    snapshotCanvas.height = this.player().videoHeight();
                    // var tech = thiz.player().tech().name();
                    return new Promise(function (resolve, reject) {
                        var snapshotImageData = thiz.engine.imageCaptureByIdAndCanvasDom(thiz.player().id(), snapshotCanvas);
                        // notify others
                        return resolve(snapshotImageData);
                    });
                }
            }

            /**
             * Canvas for displaying snapshot image.
             * @private
             * @class
             * @augments videojs.Component
             */
            class SnapshotCanvasComponent extends VjsComponent { }
            /**
             * Button to toggle between create and retry snapshot image.
             * @private
             * @class
             * @augments videojs.Button
             */
            class CameraButton extends VjsButton {
                /** @constructor */
                constructor(player, options) {
                    super(player, options);

                    this.on('click', this.onClick);
                    this.on('tap', this.onClick);
                }
                onClick(e) {
                    // stop this event before it bubbles up
                    e.stopImmediatePropagation();

                    var snapshoter = this.player().snapshoter;

                    if (!snapshoter.isProcessing()) {
                        // create snapshot
                        snapshoter.start();
                    } else {
                        // retry
                        snapshoter.retrySnapshot();

                        // reset camera button
                        this.onStop();
                    }
                }
                onStart() {
                    // replace element class so it can change appearance
                    this.removeClass('vjs-icon-photo-camera');
                    this.addClass('vjs-icon-photo-retry');

                    // update label
                    this.el().firstChild.firstChild.innerHTML = this.localize('Retry');
                }
                onStop() {
                    // replace element class so it can change appearance
                    this.removeClass('vjs-icon-photo-retry');
                    this.addClass('vjs-icon-photo-camera');

                    // update label
                    this.el().firstChild.firstChild.innerHTML = this.localize('Image');
                }
            }

            /**
             * Create a custom button.
             * @private
             * @param {string} className - Class name for the new button.
             * @param {string} label - Label for the new button.
             * @param {string} iconName - Icon for the new button.
             */
            var createButton = function createButton(className, label, iconName) {
                var props = {
                    className: 'vjs-' + className + '-button vjs-control vjs-icon-' + iconName,
                    innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + label + '</span></div>'
                };
                var attrs = {
                    role: 'button',
                    'aria-live': 'polite', // let the screen reader user know that the text of the button may change
                    tabIndex: 0
                };
                return VjsComponent.prototype.createEl('div', props, attrs);
            };

            /**
             * Create a custom button.
             * @private
             * @param {string} className - Class name for the new button.
             * @param {string} label - Label for the new button.
             * @param {string} iconName - Icon for the new button.
             */
            var createCanvas = function createCanvas(className) {
                var props = {
                    className: 'vjs-' + className + '-canvas',
                    innerHTML: '<canvas></canvas>'
                };
                return VjsComponent.prototype.createEl('div', props);
            };

            /**
             * Function to invoke when the player is ready.
             *
             * This is a great place for your plugin to initialize itself. When this
             * function is called, the player will have its DOM and child components
             * in place.
             *
             * @function onPlayerReady
             * @param    {Player} player
             *           A Video.js player object.
             *
             * @param    {Object} [options={}]
             *           A plain object containing options for the plugin.
             */
            var onPlayerReady = function onPlayerReady(player, options) {
                player.addClass('vjs-snapshot');
            };

            /**
             * A video.js plugin.
             *
             * In the plugin function, the value of `this` is a video.js `Player`
             * instance. You cannot rely on the player being in a "ready" state here,
             * depending on how the plugin is invoked. This may or may not be important
             * to you; if not, remove the wait for "ready"!
             *
             * @function snapshot
             * @param    {Object} [options={}]
             *           An object of options left to the plugin author to define.
             */
            function snapshot(options) {
                var _this = this;

                var settings = videojs.mergeOptions(defaultOptions, options);
                var player = this;
                player.ready(function () {
                    onPlayerReady(_this, videojs.mergeOptions(defaultOptions, options));
                });

                //crossOrgin process
                var videoTags = document.getElementsByTagName('video');
                for (var i = 0; i < videoTags.length; i++) {
                    var videoTag = videoTags[i];
                    videoTag.setAttribute('crossOrigin', 'Anonymous');
                }

                // create snapshoter
                player.snapshoter = new SnapshoterComponent(this, {
                    'options': settings
                });
                player.addChild(player.snapshoter);

                // add canvas for recording and displaying image
                player.snapshotCanvas = new SnapshotCanvasComponent(player, {
                    'el': createCanvas('snapshot')
                });
                player.snapshotCanvas.hide();
                player.snapshoter.addChild(player.snapshotCanvas);

                // add camera button
                player.cameraButton = new CameraButton(player, {
                    'el': createButton('camera', player.localize('Image'), 'photo-camera')
                });
                // player.cameraButton.hide();
                player.cameraButton.show();
            };

            // Register the plugin with video.js.
            registerPlugin('snapshot', snapshot);

            // Include the version number.
            //   snapshot.VERSION = VERSION;

            // export default snapshot;
            // return a function to define the module export
            return snapshot;
        });
    });

    return videojsSnapshot;

})));