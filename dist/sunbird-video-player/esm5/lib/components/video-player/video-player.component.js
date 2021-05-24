/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewerService } from '../../services/viewer.service';
var VideoPlayerComponent = /** @class */ (function () {
    function VideoPlayerComponent(viewerService, renderer2) {
        this.viewerService = viewerService;
        this.renderer2 = renderer2;
        this.showBackwardButton = false;
        this.showForwardButton = false;
        this.showPlayButton = true;
        this.showPauseButton = false;
        this.showControls = true;
        this.currentPlayerState = 'none';
        this.totalSeekedLength = 0;
        this.previousTime = 0;
        this.currentTime = 0;
        this.seekStart = null;
        this.time = 10;
        this.totalSpentTime = 0;
        this.isAutoplayPrevented = false;
    }
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.viewerService.getPlayerOptions().then((/**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            _this.player = videojs(_this.target.nativeElement, {
                fluid: true,
                sources: options,
                autoplay: true,
                playbackRates: [0.5, 1, 1.5, 2],
                controlBar: {
                    children: ['playToggle', 'volumePanel', 'durationDisplay',
                        'progressControl', 'remainingTimeDisplay',
                        'playbackRateMenuButton', 'fullscreenToggle']
                }
            }, (/**
             * @return {?}
             */
            function onLoad() {
            }));
            _this.player.markers(_this.viewerService.getMarkers());
            _this.registerEvents();
        }));
        setInterval((/**
         * @return {?}
         */
        function () {
            if (!_this.isAutoplayPrevented && _this.currentPlayerState !== 'pause') {
                _this.showControls = false;
            }
        }), 5000);
        this.unlistenTargetMouseMove = this.renderer2.listen(this.target.nativeElement, 'mousemove', (/**
         * @return {?}
         */
        function () {
            _this.showControls = true;
        }));
        this.unlistenTargetTouchStart = this.renderer2.listen(this.target.nativeElement, 'touchstart', (/**
         * @return {?}
         */
        function () {
            _this.showControls = true;
        }));
        this.viewerService.sidebarMenuEvent.subscribe((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (event === 'OPEN_MENU') {
                _this.pause();
            }
            if (event === 'CLOSE_MENU') {
                _this.play();
            }
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var action = _a.action, data = _a.data;
            if (action === 'play') {
                _this.play();
            }
            else if (action === 'pause') {
                _this.pause();
            }
            else if (action === 'seekTo') {
                _this.player.currentTime(data.seconds);
            }
        }));
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.registerEvents = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var promise = this.player.play();
        if (promise !== undefined) {
            promise.catch((/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                _this.isAutoplayPrevented = true;
            }));
        }
        /** @type {?} */
        var events = ['loadstart', 'play', 'pause', 'durationchange',
            'error', 'playing', 'progress', 'seeked', 'seeking', 'volumechange',
            'ratechange'];
        this.player.on('fullscreenchange', (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            // This code is to show the controldiv in fullscreen mode
            if (_this.player.isFullscreen()) {
                _this.target.nativeElement.parentNode.appendChild(_this.controlDiv.nativeElement);
            }
            _this.viewerService.raiseHeartBeatEvent('FULLSCREEN');
        }));
        this.player.on('pause', (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.pause();
        }));
        this.player.on('play', (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.currentPlayerState = 'play';
            _this.showPauseButton = true;
            _this.showPlayButton = false;
            _this.viewerService.raiseHeartBeatEvent('PLAY');
            _this.isAutoplayPrevented = false;
        }));
        this.player.on('timeupdate', (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.handleVideoControls(data);
            _this.viewerService.playerEvent.emit(data);
            if (_this.player.currentTime() === _this.player.duration()) {
                _this.handleVideoControls({ type: 'ended' });
                _this.viewerService.playerEvent.emit({ type: 'ended' });
            }
        }));
        events.forEach((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            _this.player.on(event, (/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                _this.handleVideoControls(data);
                _this.viewerService.playerEvent.emit(data);
            }));
        }));
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.toggleForwardRewindButton = /**
     * @return {?}
     */
    function () {
        this.showForwardButton = true;
        this.showBackwardButton = true;
        if ((this.player.currentTime() + this.time) > this.player.duration()) {
            this.showForwardButton = false;
        }
        if ((this.player.currentTime() - this.time) < 0) {
            this.showBackwardButton = false;
        }
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.play = /**
     * @return {?}
     */
    function () {
        this.player.play();
        this.currentPlayerState = 'play';
        this.showPauseButton = true;
        this.showPlayButton = false;
        this.toggleForwardRewindButton();
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.pause = /**
     * @return {?}
     */
    function () {
        this.player.pause();
        this.currentPlayerState = 'pause';
        this.showPauseButton = false;
        this.showPlayButton = true;
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('PAUSE');
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.backward = /**
     * @return {?}
     */
    function () {
        this.player.currentTime(this.player.currentTime() - this.time);
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('BACKWARD');
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.forward = /**
     * @return {?}
     */
    function () {
        this.player.currentTime(this.player.currentTime() + this.time);
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('FORWARD');
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    VideoPlayerComponent.prototype.handleVideoControls = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var type = _a.type;
        if (type === 'playing') {
            this.showPlayButton = false;
            this.showPauseButton = true;
        }
        if (type === 'ended') {
            this.totalSpentTime += new Date().getTime() - this.startTime;
            this.viewerService.visitedLength = this.totalSpentTime;
            this.viewerService.currentlength = this.player.currentTime();
            this.viewerService.totalLength = this.player.duration();
            this.updatePlayerEventsMetadata({ type: type });
        }
        if (type === 'pause') {
            this.totalSpentTime += new Date().getTime() - this.startTime;
            this.updatePlayerEventsMetadata({ type: type });
        }
        if (type === 'play') {
            this.startTime = new Date().getTime();
            this.updatePlayerEventsMetadata({ type: type });
        }
        if (type === 'loadstart') {
            this.startTime = new Date().getTime();
        }
        // Calulating total seeked length
        if (type === 'timeupdate') {
            this.previousTime = this.currentTime;
            this.currentTime = this.player.currentTime();
            this.toggleForwardRewindButton();
        }
        if (type === 'seeking') {
            if (this.seekStart === null) {
                this.seekStart = this.previousTime;
            }
        }
        if (type === 'seeked') {
            this.updatePlayerEventsMetadata({ type: type });
            if (this.currentTime > this.seekStart) {
                this.totalSeekedLength = this.totalSeekedLength + (this.currentTime - this.seekStart);
            }
            else if (this.seekStart > this.currentTime) {
                this.totalSeekedLength = this.totalSeekedLength + (this.seekStart - this.currentTime);
            }
            this.viewerService.totalSeekedLength = this.totalSeekedLength;
            this.seekStart = null;
        }
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    VideoPlayerComponent.prototype.updatePlayerEventsMetadata = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var type = _a.type;
        this.viewerService.metaData.totalDuration = this.player.duration();
        this.viewerService.metaData.playBackSpeeds.push(this.player.playbackRate());
        this.viewerService.metaData.volume.push(this.player.volume());
        /** @type {?} */
        var action = {};
        action[type + ''] = this.player.currentTime();
        this.viewerService.metaData.actions.push(action);
    };
    /**
     * @return {?}
     */
    VideoPlayerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.player) {
            this.player.dispose();
        }
        this.unlistenTargetMouseMove();
        this.unlistenTargetTouchStart();
    };
    VideoPlayerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'video-player',
                    template: "<video #target class=\"video-js\" controls></video>\n<div #controlDiv>\n  <div [ngClass]=\"{'player-for-back-ward-controls': currentPlayerState === 'pause' || showControls }\">\n    <div class=\"player-container\" *ngIf=\"currentPlayerState === 'pause' || showControls\">\n      <div class=\"back-ward hide-in-desktop\" [style.visibility]=\"showBackwardButton ? 'visible !important' : 'hidden'\" (click)=\"backward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-70.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M108.4,106.3 C108.4,116.86 99.76,125.5 89.2,125.5 C78.64,125.5 70,116.86 70,106.3 L74.8,106.3 C74.8,114.22 81.28,120.7 89.2,120.7 C97.12,120.7 103.6,114.22 103.6,106.3 C103.6,98.38 97.12,91.9 89.2,91.9 L89.2,101.5 L77.2,89.5 L89.2,77.5 L89.2,87.1 C99.76,87.1 108.4,95.74 108.4,106.3 L108.4,106.3 Z M86.4320312,113.5 L84.4,113.5 L84.4,105.667187 L81.9742187,106.419531 L81.9742187,104.767187 L86.2140625,103.248437 L86.4320312,103.248437 L86.4320312,113.5 Z M96.6484375,109.267188 C96.6484375,110.68282 96.3554717,111.765621 95.7695312,112.515625 C95.1835908,113.265629 94.3257869,113.640625 93.1960937,113.640625 C92.0804632,113.640625 91.2273467,113.27266 90.6367187,112.536719 C90.0460908,111.800778 89.7437501,110.746101 89.7296875,109.372656 L89.7296875,107.488281 C89.7296875,106.058587 90.0261689,104.973441 90.6191406,104.232812 C91.2121123,103.492184 92.0664007,103.121875 93.1820312,103.121875 C94.2976618,103.121875 95.1507783,103.488668 95.7414062,104.222266 C96.3320342,104.955863 96.6343749,106.009368 96.6484375,107.382812 L96.6484375,109.267188 Z M94.6164062,107.2 C94.6164062,106.351558 94.5003918,105.733986 94.2683594,105.347266 C94.036327,104.960545 93.6742212,104.767188 93.1820312,104.767188 C92.7039039,104.767188 92.351173,104.95117 92.1238281,105.319141 C91.8964832,105.687111 91.7757813,106.262496 91.7617187,107.045312 L91.7617187,109.534375 C91.7617187,110.368754 91.8753895,110.98867 92.1027344,111.394141 C92.3300793,111.799611 92.6945287,112.002344 93.1960937,112.002344 C93.6929712,112.002344 94.0515614,111.807814 94.271875,111.41875 C94.4921886,111.029686 94.6070312,110.434379 94.6164062,109.632812 L94.6164062,107.2 Z\"\n              id=\"Shape-Copy\"></path>\n          </g>\n        </svg>\n      </div>\n      <div class=\"pause-play\">\n        <span class=\"pause\" *ngIf=\"showPauseButton\" (click)=\"pause()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy-2\" transform=\"translate(-156.000000, -77.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M180.4,77.5 C167.152,77.5 156.4,88.252 156.4,101.5 C156.4,114.748 167.152,125.5 180.4,125.5 C193.648,125.5 204.4,114.748 204.4,101.5 C204.4,88.252 193.648,77.5 180.4,77.5 L180.4,77.5 Z M178,111.1 L173.2,111.1 L173.2,91.9 L178,91.9 L178,111.1 L178,111.1 Z M187.6,111.1 L182.8,111.1 L182.8,91.9 L187.6,91.9 L187.6,111.1 L187.6,111.1 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n        <span class=\"play\" *ngIf=\"showPlayButton\" (click)=\"play()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy\" transform=\"translate(-296.000000, -156.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M320,156 C306.752,156 296,166.752 296,180 C296,193.248 306.752,204 320,204 C333.248,204 344,193.248 344,180 C344,166.752 333.248,156 320,156 L320,156 Z M315.2,190.8 L315.2,169.2 L329.6,180 L315.2,190.8 L315.2,190.8 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n      </div>\n      <div class=\"forward hide-in-desktop\" [style.visibility]=\"showForwardButton ? 'visible !important' : 'hidden'\" (click)=\"forward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-251.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M251.4,106.3 C251.4,116.86 260.04,125.5 270.6,125.5 C281.16,125.5 289.8,116.86 289.8,106.3 L285,106.3 C285,114.22 278.52,120.7 270.6,120.7 C262.68,120.7 256.2,114.22 256.2,106.3 C256.2,98.38 262.68,91.9 270.6,91.9 L270.6,101.5 L282.6,89.5 L270.6,77.5 L270.6,87.1 C260.04,87.1 251.4,95.74 251.4,106.3 L251.4,106.3 Z M267.832031,113.5 L265.8,113.5 L265.8,105.667187 L263.374219,106.419531 L263.374219,104.767187 L267.614062,103.248437 L267.832031,103.248437 L267.832031,113.5 Z M278.048438,109.267188 C278.048438,110.68282 277.755472,111.765621 277.169531,112.515625 C276.583591,113.265629 275.725787,113.640625 274.596094,113.640625 C273.480463,113.640625 272.627347,113.27266 272.036719,112.536719 C271.446091,111.800778 271.14375,110.746101 271.129687,109.372656 L271.129687,107.488281 C271.129687,106.058587 271.426169,104.973441 272.019141,104.232812 C272.612112,103.492184 273.466401,103.121875 274.582031,103.121875 C275.697662,103.121875 276.550778,103.488668 277.141406,104.222266 C277.732034,104.955863 278.034375,106.009368 278.048438,107.382812 L278.048438,109.267188 Z M276.016406,107.2 C276.016406,106.351558 275.900392,105.733986 275.668359,105.347266 C275.436327,104.960545 275.074221,104.767188 274.582031,104.767188 C274.103904,104.767188 273.751173,104.95117 273.523828,105.319141 C273.296483,105.687111 273.175781,106.262496 273.161719,107.045312 L273.161719,109.534375 C273.161719,110.368754 273.275389,110.98867 273.502734,111.394141 C273.730079,111.799611 274.094529,112.002344 274.596094,112.002344 C275.092971,112.002344 275.451561,111.807814 275.671875,111.41875 C275.892189,111.029686 276.007031,110.434379 276.016406,109.632812 L276.016406,107.2 Z\"\n              id=\"Shape\"></path>\n          </g>\n        </svg>\n      </div>\n    </div>\n  </div>\n\n\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    styles: [".video-js{width:100%;height:100%}.video-player{width:100%}.video-js .vjs-duration{display:block}.video-js .vjs-big-play-button{display:none}.video-js .vjs-control-bar{z-index:3;font-size:12px;background:rgba(0,0,0,.75)}@media (min-width:1600px){.video-js .vjs-control-bar{font-size:16px}}.video-js .vjs-slider{background:#7b7b7b}.video-js .vjs-load-progress{background:#797979}.video-js .vjs-load-progress div{background:#a09f9f}.video-js .vjs-progress-holder,.video-js .vjs-progress-holder .vjs-load-progress,.video-js .vjs-progress-holder .vjs-load-progress div,.video-js .vjs-progress-holder .vjs-play-progress{border-radius:.2em}.vjs-menu-button-popup .vjs-menu .vjs-menu-content{background-color:rgba(0,0,0,.72)}.js-focus-visible .vjs-menu li.vjs-selected:hover,.vjs-menu li.vjs-selected,.vjs-menu li.vjs-selected:focus,.vjs-menu li.vjs-selected:hover{background-color:rgba(216,216,216,.2);color:var(--white)}.video-js .vjs-play-progress:before{top:-.3em}.vjs-playback-rate .vjs-playback-rate-value{line-height:2.75}.vjs-menu li,.vjs-playback-rate .vjs-playback-rate-value{font-size:1.1em}@media screen and (min-width:768px){.video-js .vjs-tech{pointer-events:none}}@media (hover:hover){.hide-in-desktop{visibility:hidden!important}}@media (pointer:fine){.hide-in-desktop{visibility:hidden!important}}.player-for-back-ward-controls{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;z-index:2}.player-for-back-ward-controls .player-container{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}.player-for-back-ward-controls .player-container .back-ward,.player-for-back-ward-controls .player-container .forward,.player-for-back-ward-controls .player-container .pause-play{width:2.5rem;height:2.5rem;padding:.5rem;-webkit-transition:.3s ease-in-out;transition:.3s ease-in-out;box-sizing:content-box;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;background:rgba(var(--rc-rgba-black),.5);border-radius:50%;-webkit-transform:scale(1);transform:scale(1)}@media (min-width:768px){.player-for-back-ward-controls .player-container .back-ward:hover,.player-for-back-ward-controls .player-container .forward:hover,.player-for-back-ward-controls .player-container .pause-play:hover{background:rgba(var(--rc-rgba-black),1);border-radius:100%;-webkit-transform:scale(1.25);transform:scale(1.25);cursor:pointer}.player-for-back-ward-controls .player-container .back-ward:hover svg g,.player-for-back-ward-controls .player-container .forward:hover svg g,.player-for-back-ward-controls .player-container .pause-play:hover svg g{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touched,.player-for-back-ward-controls .player-container .forward.touched,.player-for-back-ward-controls .player-container .pause-play.touched{-webkit-animation:2s scaling;animation:2s scaling;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touched svg g,.player-for-back-ward-controls .player-container .forward.touched svg g,.player-for-back-ward-controls .player-container .pause-play.touched svg g{-webkit-animation:2s scalingColor;animation:2s scalingColor;fill:var(--white)}@-webkit-keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touchout,.player-for-back-ward-controls .player-container .forward.touchout,.player-for-back-ward-controls .player-container .pause-play.touchout{-webkit-animation:2s scaling2;animation:2s scaling2;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touchout svg g,.player-for-back-ward-controls .player-container .forward.touchout svg g,.player-for-back-ward-controls .player-container .pause-play.touchout svg g{-webkit-animation:2s scalingColor2;animation:2s scalingColor2;fill:var(--white)}@-webkit-keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward svg,.player-for-back-ward-controls .player-container .forward svg,.player-for-back-ward-controls .player-container .pause-play svg{width:100%}.player-for-back-ward-controls .player-container .pause-play{margin:0 1.5rem}.player-for-back-ward-controls .player-container .pause-play .pause,.player-for-back-ward-controls .player-container .pause-play .play{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}"]
                }] }
    ];
    /** @nocollapse */
    VideoPlayerComponent.ctorParameters = function () { return [
        { type: ViewerService },
        { type: Renderer2 }
    ]; };
    VideoPlayerComponent.propDecorators = {
        events: [{ type: Input }],
        target: [{ type: ViewChild, args: ['target', { static: true },] }],
        controlDiv: [{ type: ViewChild, args: ['controlDiv', { static: true },] }]
    };
    return VideoPlayerComponent;
}());
export { VideoPlayerComponent };
if (false) {
    /** @type {?} */
    VideoPlayerComponent.prototype.showBackwardButton;
    /** @type {?} */
    VideoPlayerComponent.prototype.showForwardButton;
    /** @type {?} */
    VideoPlayerComponent.prototype.showPlayButton;
    /** @type {?} */
    VideoPlayerComponent.prototype.showPauseButton;
    /** @type {?} */
    VideoPlayerComponent.prototype.showControls;
    /** @type {?} */
    VideoPlayerComponent.prototype.currentPlayerState;
    /**
     * @type {?}
     * @private
     */
    VideoPlayerComponent.prototype.unlistenTargetMouseMove;
    /**
     * @type {?}
     * @private
     */
    VideoPlayerComponent.prototype.unlistenTargetTouchStart;
    /** @type {?} */
    VideoPlayerComponent.prototype.events;
    /** @type {?} */
    VideoPlayerComponent.prototype.target;
    /** @type {?} */
    VideoPlayerComponent.prototype.controlDiv;
    /** @type {?} */
    VideoPlayerComponent.prototype.player;
    /** @type {?} */
    VideoPlayerComponent.prototype.totalSeekedLength;
    /** @type {?} */
    VideoPlayerComponent.prototype.previousTime;
    /** @type {?} */
    VideoPlayerComponent.prototype.currentTime;
    /** @type {?} */
    VideoPlayerComponent.prototype.seekStart;
    /** @type {?} */
    VideoPlayerComponent.prototype.time;
    /** @type {?} */
    VideoPlayerComponent.prototype.startTime;
    /** @type {?} */
    VideoPlayerComponent.prototype.totalSpentTime;
    /** @type {?} */
    VideoPlayerComponent.prototype.isAutoplayPrevented;
    /**
     * @type {?}
     * @private
     */
    VideoPlayerComponent.prototype.eventsSubscription;
    /** @type {?} */
    VideoPlayerComponent.prototype.viewerService;
    /**
     * @type {?}
     * @private
     */
    VideoPlayerComponent.prototype.renderer2;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW8tcGxheWVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC12aWRlby1wbGF5ZXItdjgvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy92aWRlby1wbGF5ZXIvdmlkZW8tcGxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQWEsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUU5RDtJQTZCRSw4QkFBbUIsYUFBNEIsRUFBVSxTQUFvQjtRQUExRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7UUF0QjdFLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMzQixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsdUJBQWtCLEdBQUcsTUFBTSxDQUFDO1FBTzVCLHNCQUFpQixHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFFVixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUNuQix3QkFBbUIsR0FBRyxLQUFLLENBQUM7SUFHcUQsQ0FBQzs7OztJQUVsRiw4Q0FBZTs7O0lBQWY7UUFBQSxpQkE4Q0M7UUE3Q0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFB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LEVBQUUsSUFBSSxFQUFFOzZCQUNwQyxTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFvTjNDLDJCQUFDO0NBQUEsQUFyT0QsSUFxT0M7U0EvTlksb0JBQW9COzs7SUFDL0Isa0RBQTJCOztJQUMzQixpREFBMEI7O0lBQzFCLDhDQUFzQjs7SUFDdEIsK0NBQXdCOztJQUN4Qiw0Q0FBb0I7O0lBQ3BCLGtEQUE0Qjs7Ozs7SUFDNUIsdURBQTRDOzs7OztJQUM1Qyx3REFBNkM7O0lBQzdDLHNDQUFnQzs7SUFDaEMsc0NBQTBEOztJQUMxRCwwQ0FBa0U7O0lBQ2xFLHNDQUFZOztJQUNaLGlEQUFzQjs7SUFDdEIsNENBQWlCOztJQUNqQiwyQ0FBZ0I7O0lBQ2hCLHlDQUFpQjs7SUFDakIsb0NBQVU7O0lBQ1YseUNBQVU7O0lBQ1YsOENBQW1COztJQUNuQixtREFBNEI7Ozs7O0lBQzVCLGtEQUF5Qzs7SUFFN0IsNkNBQW1DOzs7OztJQUFFLHlDQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uLCBPbkRlc3Ryb3ksIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFZpZXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy92aWV3ZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3ZpZGVvLXBsYXllcicsXG4gIHRlbXBsYXRlVXJsOiAnLi92aWRlby1wbGF5ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi92aWRlby1wbGF5ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBWaWRlb1BsYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIHNob3dCYWNrd2FyZEJ1dHRvbiA9IGZhbHNlO1xuICBzaG93Rm9yd2FyZEJ1dHRvbiA9IGZhbHNlO1xuICBzaG93UGxheUJ1dHRvbiA9IHRydWU7XG4gIHNob3dQYXVzZUJ1dHRvbiA9IGZhbHNlO1xuICBzaG93Q29udHJvbHMgPSB0cnVlO1xuICBjdXJyZW50UGxheWVyU3RhdGUgPSAnbm9uZSc7XG4gIHByaXZhdGUgdW5saXN0ZW5UYXJnZXRNb3VzZU1vdmU6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgdW5saXN0ZW5UYXJnZXRUb3VjaFN0YXJ0OiAoKSA9PiB2b2lkO1xuICBASW5wdXQoKSBldmVudHM6IE9ic2VydmFibGU8YW55PlxuICBAVmlld0NoaWxkKCd0YXJnZXQnLCB7IHN0YXRpYzogdHJ1ZSB9KSB0YXJnZXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRyb2xEaXYnLCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250cm9sRGl2OiBFbGVtZW50UmVmO1xuICBwbGF5ZXI6IGFueTtcbiAgdG90YWxTZWVrZWRMZW5ndGggPSAwO1xuICBwcmV2aW91c1RpbWUgPSAwO1xuICBjdXJyZW50VGltZSA9IDA7XG4gIHNlZWtTdGFydCA9IG51bGw7XG4gIHRpbWUgPSAxMDtcbiAgc3RhcnRUaW1lO1xuICB0b3RhbFNwZW50VGltZSA9IDA7XG4gIGlzQXV0b3BsYXlQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBldmVudHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld2VyU2VydmljZTogVmlld2VyU2VydmljZSwgcHJpdmF0ZSByZW5kZXJlcjI6IFJlbmRlcmVyMikgeyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5nZXRQbGF5ZXJPcHRpb25zKCkudGhlbihvcHRpb25zID0+IHtcbiAgICAgIHRoaXMucGxheWVyID0gdmlkZW9qcyh0aGlzLnRhcmdldC5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIGZsdWlkOiB0cnVlLFxuICAgICAgICBzb3VyY2VzOiBvcHRpb25zLFxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgcGxheWJhY2tSYXRlczogWzAuNSwgMSwgMS41LCAyXSxcbiAgICAgICAgY29udHJvbEJhcjoge1xuICAgICAgICAgIGNoaWxkcmVuOiBbJ3BsYXlUb2dnbGUnLCAndm9sdW1lUGFuZWwnLCAnZHVyYXRpb25EaXNwbGF5JywgXG4gICAgICAgICAgICAncHJvZ3Jlc3NDb250cm9sJywgJ3JlbWFpbmluZ1RpbWVEaXNwbGF5JyxcbiAgICAgICAgICAgICdwbGF5YmFja1JhdGVNZW51QnV0dG9uJywgJ2Z1bGxzY3JlZW5Ub2dnbGUnXVxuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cbiAgICAgIH0pO1xuICAgICAgdGhpcy5wbGF5ZXIubWFya2Vycyh0aGlzLnZpZXdlclNlcnZpY2UuZ2V0TWFya2VycygpKVxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cygpO1xuICAgIH0pO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmlzQXV0b3BsYXlQcmV2ZW50ZWQgJiYgdGhpcy5jdXJyZW50UGxheWVyU3RhdGUgIT09ICdwYXVzZScpIHtcbiAgICAgICAgdGhpcy5zaG93Q29udHJvbHMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCA1MDAwKTtcblxuICAgIHRoaXMudW5saXN0ZW5UYXJnZXRNb3VzZU1vdmUgPSB0aGlzLnJlbmRlcmVyMi5saXN0ZW4odGhpcy50YXJnZXQubmF0aXZlRWxlbWVudCwgJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLnVubGlzdGVuVGFyZ2V0VG91Y2hTdGFydCA9IHRoaXMucmVuZGVyZXIyLmxpc3Rlbih0aGlzLnRhcmdldC5uYXRpdmVFbGVtZW50LCAndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMudmlld2VyU2VydmljZS5zaWRlYmFyTWVudUV2ZW50LnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQgPT09ICdPUEVOX01FTlUnKSB7IHRoaXMucGF1c2UoKTsgfVxuICAgICAgaWYgKGV2ZW50ID09PSAnQ0xPU0VfTUVOVScpIHsgdGhpcy5wbGF5KCk7IH1cbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudHMuc3Vic2NyaWJlKCh7YWN0aW9uLCBkYXRhfSkgPT4ge1xuICAgICAgaWYoYWN0aW9uID09PSAncGxheScpIHtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICB9IGVsc2UgaWYoYWN0aW9uID09PSAncGF1c2UnKSB7XG4gICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgIH0gZWxzZSBpZihhY3Rpb24gPT09ICdzZWVrVG8nKSB7XG4gICAgICAgIHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKGRhdGEuc2Vjb25kcylcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRXZlbnRzKCkge1xuICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLnBsYXllci5wbGF5KCk7XG4gICAgaWYgKHByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcHJvbWlzZS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuaXNBdXRvcGxheVByZXZlbnRlZCA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudHMgPSBbJ2xvYWRzdGFydCcsICdwbGF5JywgJ3BhdXNlJywgJ2R1cmF0aW9uY2hhbmdlJyxcbiAgICAgICdlcnJvcicsICdwbGF5aW5nJywgJ3Byb2dyZXNzJywgJ3NlZWtlZCcsICdzZWVraW5nJywgJ3ZvbHVtZWNoYW5nZScsXG4gICAgICAncmF0ZWNoYW5nZSddO1xuXG4gICAgdGhpcy5wbGF5ZXIub24oJ2Z1bGxzY3JlZW5jaGFuZ2UnLCAoZGF0YSkgPT4ge1xuICAgICAgLy8gVGhpcyBjb2RlIGlzIHRvIHNob3cgdGhlIGNvbnRyb2xkaXYgaW4gZnVsbHNjcmVlbiBtb2RlXG4gICAgICBpZih0aGlzLnBsYXllci5pc0Z1bGxzY3JlZW4oKSkge1xuICAgICAgICB0aGlzLnRhcmdldC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sRGl2Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ0ZVTExTQ1JFRU4nKTtcbiAgICB9KVxuXG4gICAgdGhpcy5wbGF5ZXIub24oJ3BhdXNlJywgKGRhdGEpID0+IHtcbiAgICAgIHRoaXMucGF1c2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMucGxheWVyLm9uKCdwbGF5JywgKGRhdGEpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFBsYXllclN0YXRlID0gJ3BsYXknO1xuICAgICAgdGhpcy5zaG93UGF1c2VCdXR0b24gPSB0cnVlO1xuICAgICAgdGhpcy5zaG93UGxheUJ1dHRvbiA9IGZhbHNlO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ1BMQVknKTtcbiAgICAgIHRoaXMuaXNBdXRvcGxheVByZXZlbnRlZCA9IGZhbHNlO1xuICAgIH0pOyAgIFxuXG4gICAgdGhpcy5wbGF5ZXIub24oJ3RpbWV1cGRhdGUnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVWaWRlb0NvbnRyb2xzKGRhdGEpO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnBsYXllckV2ZW50LmVtaXQoZGF0YSk7XG4gICAgICBpZiAodGhpcy5wbGF5ZXIuY3VycmVudFRpbWUoKSA9PT0gdGhpcy5wbGF5ZXIuZHVyYXRpb24oKSkge1xuICAgICAgICB0aGlzLmhhbmRsZVZpZGVvQ29udHJvbHMoeyB0eXBlOiAnZW5kZWQnIH0pO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucGxheWVyRXZlbnQuZW1pdCh7IHR5cGU6ICdlbmRlZCcgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZXZlbnRzLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXIub24oZXZlbnQsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlVmlkZW9Db250cm9scyhkYXRhKTtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnBsYXllckV2ZW50LmVtaXQoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9XG5cbiAgdG9nZ2xlRm9yd2FyZFJld2luZEJ1dHRvbigpIHtcbiAgICB0aGlzLnNob3dGb3J3YXJkQnV0dG9uID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dCYWNrd2FyZEJ1dHRvbiA9IHRydWU7XG4gICAgaWYgKCh0aGlzLnBsYXllci5jdXJyZW50VGltZSgpICsgdGhpcy50aW1lKSA+IHRoaXMucGxheWVyLmR1cmF0aW9uKCkpIHtcbiAgICAgIHRoaXMuc2hvd0ZvcndhcmRCdXR0b24gPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnBsYXllci5jdXJyZW50VGltZSgpIC0gdGhpcy50aW1lKSA8IDApIHtcbiAgICAgIHRoaXMuc2hvd0JhY2t3YXJkQnV0dG9uID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLnBsYXllci5wbGF5KCk7XG4gICAgdGhpcy5jdXJyZW50UGxheWVyU3RhdGUgPSAncGxheSc7XG4gICAgdGhpcy5zaG93UGF1c2VCdXR0b24gPSB0cnVlO1xuICAgIHRoaXMuc2hvd1BsYXlCdXR0b24gPSBmYWxzZTtcbiAgICB0aGlzLnRvZ2dsZUZvcndhcmRSZXdpbmRCdXR0b24oKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XG4gICAgdGhpcy5jdXJyZW50UGxheWVyU3RhdGUgPSAncGF1c2UnO1xuICAgIHRoaXMuc2hvd1BhdXNlQnV0dG9uID0gZmFsc2U7XG4gICAgdGhpcy5zaG93UGxheUJ1dHRvbiA9IHRydWU7XG4gICAgdGhpcy50b2dnbGVGb3J3YXJkUmV3aW5kQnV0dG9uKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ1BBVVNFJyk7XG4gIH1cblxuICBiYWNrd2FyZCgpIHtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50VGltZSh0aGlzLnBsYXllci5jdXJyZW50VGltZSgpIC0gdGhpcy50aW1lKTtcbiAgICB0aGlzLnRvZ2dsZUZvcndhcmRSZXdpbmRCdXR0b24oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnQkFDS1dBUkQnKTtcbiAgfVxuXG4gIGZvcndhcmQoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudFRpbWUodGhpcy5wbGF5ZXIuY3VycmVudFRpbWUoKSArIHRoaXMudGltZSk7XG4gICAgdGhpcy50b2dnbGVGb3J3YXJkUmV3aW5kQnV0dG9uKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ0ZPUldBUkQnKTtcbiAgfVxuXG4gIGhhbmRsZVZpZGVvQ29udHJvbHMoeyB0eXBlIH0pIHtcbiAgICBpZiAodHlwZSA9PT0gJ3BsYXlpbmcnKSB7XG4gICAgICB0aGlzLnNob3dQbGF5QnV0dG9uID0gZmFsc2U7XG4gICAgICB0aGlzLnNob3dQYXVzZUJ1dHRvbiA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnZW5kZWQnKSB7XG4gICAgICB0aGlzLnRvdGFsU3BlbnRUaW1lICs9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UudmlzaXRlZExlbmd0aCA9IHRoaXMudG90YWxTcGVudFRpbWU7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UuY3VycmVudGxlbmd0aCA9IHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKCk7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UudG90YWxMZW5ndGggPSB0aGlzLnBsYXllci5kdXJhdGlvbigpO1xuICAgICAgdGhpcy51cGRhdGVQbGF5ZXJFdmVudHNNZXRhZGF0YSh7IHR5cGUgfSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAncGF1c2UnKSB7XG4gICAgICB0aGlzLnRvdGFsU3BlbnRUaW1lICs9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zdGFydFRpbWU7XG4gICAgICB0aGlzLnVwZGF0ZVBsYXllckV2ZW50c01ldGFkYXRhKHsgdHlwZSB9KTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdwbGF5Jykge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMudXBkYXRlUGxheWVyRXZlbnRzTWV0YWRhdGEoeyB0eXBlIH0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAnbG9hZHN0YXJ0Jykge1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICAvLyBDYWx1bGF0aW5nIHRvdGFsIHNlZWtlZCBsZW5ndGhcbiAgICBpZiAodHlwZSA9PT0gJ3RpbWV1cGRhdGUnKSB7XG4gICAgICB0aGlzLnByZXZpb3VzVGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGhpcy5wbGF5ZXIuY3VycmVudFRpbWUoKTtcbiAgICAgIHRoaXMudG9nZ2xlRm9yd2FyZFJld2luZEJ1dHRvbigpO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3NlZWtpbmcnKSB7XG4gICAgICBpZiAodGhpcy5zZWVrU3RhcnQgPT09IG51bGwpIHsgdGhpcy5zZWVrU3RhcnQgPSB0aGlzLnByZXZpb3VzVGltZTsgfVxuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3NlZWtlZCcpIHtcbiAgICAgIHRoaXMudXBkYXRlUGxheWVyRXZlbnRzTWV0YWRhdGEoeyB0eXBlIH0pO1xuICAgICAgaWYgKHRoaXMuY3VycmVudFRpbWUgPiB0aGlzLnNlZWtTdGFydCkge1xuICAgICAgICB0aGlzLnRvdGFsU2Vla2VkTGVuZ3RoID0gdGhpcy50b3RhbFNlZWtlZExlbmd0aCArICh0aGlzLmN1cnJlbnRUaW1lIC0gdGhpcy5zZWVrU3RhcnQpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlZWtTdGFydCA+IHRoaXMuY3VycmVudFRpbWUpIHtcbiAgICAgICAgdGhpcy50b3RhbFNlZWtlZExlbmd0aCA9IHRoaXMudG90YWxTZWVrZWRMZW5ndGggKyAodGhpcy5zZWVrU3RhcnQgLSB0aGlzLmN1cnJlbnRUaW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlld2VyU2VydmljZS50b3RhbFNlZWtlZExlbmd0aCA9IHRoaXMudG90YWxTZWVrZWRMZW5ndGg7XG4gICAgICB0aGlzLnNlZWtTdGFydCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGxheWVyRXZlbnRzTWV0YWRhdGEoeyB0eXBlIH0pIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UubWV0YURhdGEudG90YWxEdXJhdGlvbiA9IHRoaXMucGxheWVyLmR1cmF0aW9uKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLm1ldGFEYXRhLnBsYXlCYWNrU3BlZWRzLnB1c2godGhpcy5wbGF5ZXIucGxheWJhY2tSYXRlKCkpO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5tZXRhRGF0YS52b2x1bWUucHVzaCh0aGlzLnBsYXllci52b2x1bWUoKSk7XG4gICAgY29uc3QgYWN0aW9uID0ge307XG4gICAgYWN0aW9uW3R5cGUgKyAnJ10gPSB0aGlzLnBsYXllci5jdXJyZW50VGltZSgpO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5tZXRhRGF0YS5hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgfVxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5wbGF5ZXIpIHtcbiAgICAgIHRoaXMucGxheWVyLmRpc3Bvc2UoKTtcbiAgICB9XG4gICAgdGhpcy51bmxpc3RlblRhcmdldE1vdXNlTW92ZSgpO1xuICAgIHRoaXMudW5saXN0ZW5UYXJnZXRUb3VjaFN0YXJ0KCk7XG4gIH1cbn1cbiJdfQ==