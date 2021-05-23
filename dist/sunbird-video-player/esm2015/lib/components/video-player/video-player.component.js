/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewerService } from '../../services/viewer.service';
export class VideoPlayerComponent {
    /**
     * @param {?} viewerService
     * @param {?} renderer2
     */
    constructor(viewerService, renderer2) {
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
    ngAfterViewInit() {
        this.viewerService.getPlayerOptions().then((/**
         * @param {?} options
         * @return {?}
         */
        options => {
            this.player = videojs(this.target.nativeElement, {
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
            this.player.markers(this.viewerService.getMarkers());
            this.registerEvents();
        }));
        setInterval((/**
         * @return {?}
         */
        () => {
            if (!this.isAutoplayPrevented && this.currentPlayerState !== 'pause') {
                this.showControls = false;
            }
        }), 5000);
        this.unlistenTargetMouseMove = this.renderer2.listen(this.target.nativeElement, 'mousemove', (/**
         * @return {?}
         */
        () => {
            this.showControls = true;
        }));
        this.unlistenTargetTouchStart = this.renderer2.listen(this.target.nativeElement, 'touchstart', (/**
         * @return {?}
         */
        () => {
            this.showControls = true;
        }));
        this.viewerService.sidebarMenuEvent.subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event === 'OPEN_MENU') {
                this.pause();
            }
            if (event === 'CLOSE_MENU') {
                this.play();
            }
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ({ action, data }) => {
            if (action === 'play') {
                this.play();
            }
            else if (action === 'pause') {
                this.pause();
            }
        }));
    }
    /**
     * @return {?}
     */
    registerEvents() {
        /** @type {?} */
        const promise = this.player.play();
        if (promise !== undefined) {
            promise.catch((/**
             * @param {?} error
             * @return {?}
             */
            error => {
                this.isAutoplayPrevented = true;
            }));
        }
        /** @type {?} */
        const events = ['loadstart', 'play', 'pause', 'durationchange',
            'error', 'playing', 'progress', 'seeked', 'seeking', 'volumechange',
            'ratechange'];
        this.player.on('fullscreenchange', (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            // This code is to show the controldiv in fullscreen mode
            if (this.player.isFullscreen()) {
                this.target.nativeElement.parentNode.appendChild(this.controlDiv.nativeElement);
            }
            this.viewerService.raiseHeartBeatEvent('FULLSCREEN');
        }));
        this.player.on('pause', (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.pause();
        }));
        this.player.on('play', (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.currentPlayerState = 'play';
            this.showPauseButton = true;
            this.showPlayButton = false;
            this.viewerService.raiseHeartBeatEvent('PLAY');
            this.isAutoplayPrevented = false;
        }));
        this.player.on('timeupdate', (/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.handleVideoControls(data);
            this.viewerService.playerEvent.emit(data);
            if (this.player.currentTime() === this.player.duration()) {
                this.handleVideoControls({ type: 'ended' });
                this.viewerService.playerEvent.emit({ type: 'ended' });
            }
        }));
        events.forEach((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            this.player.on(event, (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                this.handleVideoControls(data);
                this.viewerService.playerEvent.emit(data);
            }));
        }));
    }
    /**
     * @return {?}
     */
    toggleForwardRewindButton() {
        this.showForwardButton = true;
        this.showBackwardButton = true;
        if ((this.player.currentTime() + this.time) > this.player.duration()) {
            this.showForwardButton = false;
        }
        if ((this.player.currentTime() - this.time) < 0) {
            this.showBackwardButton = false;
        }
    }
    /**
     * @return {?}
     */
    play() {
        this.player.play();
        this.currentPlayerState = 'play';
        this.showPauseButton = true;
        this.showPlayButton = false;
        this.toggleForwardRewindButton();
    }
    /**
     * @return {?}
     */
    pause() {
        this.player.pause();
        this.currentPlayerState = 'pause';
        this.showPauseButton = false;
        this.showPlayButton = true;
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('PAUSE');
    }
    /**
     * @return {?}
     */
    backward() {
        this.player.currentTime(this.player.currentTime() - this.time);
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('BACKWARD');
    }
    /**
     * @return {?}
     */
    forward() {
        this.player.currentTime(this.player.currentTime() + this.time);
        this.toggleForwardRewindButton();
        this.viewerService.raiseHeartBeatEvent('FORWARD');
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    handleVideoControls({ type }) {
        if (type === 'playing') {
            this.showPlayButton = false;
            this.showPauseButton = true;
        }
        if (type === 'ended') {
            this.totalSpentTime += new Date().getTime() - this.startTime;
            this.viewerService.visitedLength = this.totalSpentTime;
            this.viewerService.currentlength = this.player.currentTime();
            this.viewerService.totalLength = this.player.duration();
            this.updatePlayerEventsMetadata({ type });
        }
        if (type === 'pause') {
            this.totalSpentTime += new Date().getTime() - this.startTime;
            this.updatePlayerEventsMetadata({ type });
        }
        if (type === 'play') {
            this.startTime = new Date().getTime();
            this.updatePlayerEventsMetadata({ type });
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
            this.updatePlayerEventsMetadata({ type });
            if (this.currentTime > this.seekStart) {
                this.totalSeekedLength = this.totalSeekedLength + (this.currentTime - this.seekStart);
            }
            else if (this.seekStart > this.currentTime) {
                this.totalSeekedLength = this.totalSeekedLength + (this.seekStart - this.currentTime);
            }
            this.viewerService.totalSeekedLength = this.totalSeekedLength;
            this.seekStart = null;
        }
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    updatePlayerEventsMetadata({ type }) {
        this.viewerService.metaData.totalDuration = this.player.duration();
        this.viewerService.metaData.playBackSpeeds.push(this.player.playbackRate());
        this.viewerService.metaData.volume.push(this.player.volume());
        /** @type {?} */
        const action = {};
        action[type + ''] = this.player.currentTime();
        this.viewerService.metaData.actions.push(action);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
        }
        this.unlistenTargetMouseMove();
        this.unlistenTargetTouchStart();
    }
}
VideoPlayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'video-player',
                template: "<video #target class=\"video-js\" controls></video>\n<div #controlDiv>\n  <div [ngClass]=\"{'player-for-back-ward-controls': currentPlayerState === 'pause' || showControls }\">\n    <div class=\"player-container\" *ngIf=\"currentPlayerState === 'pause' || showControls\">\n      <div class=\"back-ward hide-in-desktop\" [style.visibility]=\"showBackwardButton ? 'visible !important' : 'hidden'\" (click)=\"backward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-70.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M108.4,106.3 C108.4,116.86 99.76,125.5 89.2,125.5 C78.64,125.5 70,116.86 70,106.3 L74.8,106.3 C74.8,114.22 81.28,120.7 89.2,120.7 C97.12,120.7 103.6,114.22 103.6,106.3 C103.6,98.38 97.12,91.9 89.2,91.9 L89.2,101.5 L77.2,89.5 L89.2,77.5 L89.2,87.1 C99.76,87.1 108.4,95.74 108.4,106.3 L108.4,106.3 Z M86.4320312,113.5 L84.4,113.5 L84.4,105.667187 L81.9742187,106.419531 L81.9742187,104.767187 L86.2140625,103.248437 L86.4320312,103.248437 L86.4320312,113.5 Z M96.6484375,109.267188 C96.6484375,110.68282 96.3554717,111.765621 95.7695312,112.515625 C95.1835908,113.265629 94.3257869,113.640625 93.1960937,113.640625 C92.0804632,113.640625 91.2273467,113.27266 90.6367187,112.536719 C90.0460908,111.800778 89.7437501,110.746101 89.7296875,109.372656 L89.7296875,107.488281 C89.7296875,106.058587 90.0261689,104.973441 90.6191406,104.232812 C91.2121123,103.492184 92.0664007,103.121875 93.1820312,103.121875 C94.2976618,103.121875 95.1507783,103.488668 95.7414062,104.222266 C96.3320342,104.955863 96.6343749,106.009368 96.6484375,107.382812 L96.6484375,109.267188 Z M94.6164062,107.2 C94.6164062,106.351558 94.5003918,105.733986 94.2683594,105.347266 C94.036327,104.960545 93.6742212,104.767188 93.1820312,104.767188 C92.7039039,104.767188 92.351173,104.95117 92.1238281,105.319141 C91.8964832,105.687111 91.7757813,106.262496 91.7617187,107.045312 L91.7617187,109.534375 C91.7617187,110.368754 91.8753895,110.98867 92.1027344,111.394141 C92.3300793,111.799611 92.6945287,112.002344 93.1960937,112.002344 C93.6929712,112.002344 94.0515614,111.807814 94.271875,111.41875 C94.4921886,111.029686 94.6070312,110.434379 94.6164062,109.632812 L94.6164062,107.2 Z\"\n              id=\"Shape-Copy\"></path>\n          </g>\n        </svg>\n      </div>\n      <div class=\"pause-play\">\n        <span class=\"pause\" *ngIf=\"showPauseButton\" (click)=\"pause()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy-2\" transform=\"translate(-156.000000, -77.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M180.4,77.5 C167.152,77.5 156.4,88.252 156.4,101.5 C156.4,114.748 167.152,125.5 180.4,125.5 C193.648,125.5 204.4,114.748 204.4,101.5 C204.4,88.252 193.648,77.5 180.4,77.5 L180.4,77.5 Z M178,111.1 L173.2,111.1 L173.2,91.9 L178,91.9 L178,111.1 L178,111.1 Z M187.6,111.1 L182.8,111.1 L182.8,91.9 L187.6,91.9 L187.6,111.1 L187.6,111.1 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n        <span class=\"play\" *ngIf=\"showPlayButton\" (click)=\"play()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy\" transform=\"translate(-296.000000, -156.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M320,156 C306.752,156 296,166.752 296,180 C296,193.248 306.752,204 320,204 C333.248,204 344,193.248 344,180 C344,166.752 333.248,156 320,156 L320,156 Z M315.2,190.8 L315.2,169.2 L329.6,180 L315.2,190.8 L315.2,190.8 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n      </div>\n      <div class=\"forward hide-in-desktop\" [style.visibility]=\"showForwardButton ? 'visible !important' : 'hidden'\" (click)=\"forward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-251.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M251.4,106.3 C251.4,116.86 260.04,125.5 270.6,125.5 C281.16,125.5 289.8,116.86 289.8,106.3 L285,106.3 C285,114.22 278.52,120.7 270.6,120.7 C262.68,120.7 256.2,114.22 256.2,106.3 C256.2,98.38 262.68,91.9 270.6,91.9 L270.6,101.5 L282.6,89.5 L270.6,77.5 L270.6,87.1 C260.04,87.1 251.4,95.74 251.4,106.3 L251.4,106.3 Z M267.832031,113.5 L265.8,113.5 L265.8,105.667187 L263.374219,106.419531 L263.374219,104.767187 L267.614062,103.248437 L267.832031,103.248437 L267.832031,113.5 Z M278.048438,109.267188 C278.048438,110.68282 277.755472,111.765621 277.169531,112.515625 C276.583591,113.265629 275.725787,113.640625 274.596094,113.640625 C273.480463,113.640625 272.627347,113.27266 272.036719,112.536719 C271.446091,111.800778 271.14375,110.746101 271.129687,109.372656 L271.129687,107.488281 C271.129687,106.058587 271.426169,104.973441 272.019141,104.232812 C272.612112,103.492184 273.466401,103.121875 274.582031,103.121875 C275.697662,103.121875 276.550778,103.488668 277.141406,104.222266 C277.732034,104.955863 278.034375,106.009368 278.048438,107.382812 L278.048438,109.267188 Z M276.016406,107.2 C276.016406,106.351558 275.900392,105.733986 275.668359,105.347266 C275.436327,104.960545 275.074221,104.767188 274.582031,104.767188 C274.103904,104.767188 273.751173,104.95117 273.523828,105.319141 C273.296483,105.687111 273.175781,106.262496 273.161719,107.045312 L273.161719,109.534375 C273.161719,110.368754 273.275389,110.98867 273.502734,111.394141 C273.730079,111.799611 274.094529,112.002344 274.596094,112.002344 C275.092971,112.002344 275.451561,111.807814 275.671875,111.41875 C275.892189,111.029686 276.007031,110.434379 276.016406,109.632812 L276.016406,107.2 Z\"\n              id=\"Shape\"></path>\n          </g>\n        </svg>\n      </div>\n    </div>\n  </div>\n\n\n</div>",
                encapsulation: ViewEncapsulation.None,
                styles: [".video-js{width:100%;height:100%}.video-player{width:100%}.video-js .vjs-duration{display:block}.video-js .vjs-big-play-button{display:none}.video-js .vjs-control-bar{z-index:3;font-size:12px;background:rgba(0,0,0,.75)}@media (min-width:1600px){.video-js .vjs-control-bar{font-size:16px}}.video-js .vjs-slider{background:#7b7b7b}.video-js .vjs-load-progress{background:#797979}.video-js .vjs-load-progress div{background:#a09f9f}.video-js .vjs-progress-holder,.video-js .vjs-progress-holder .vjs-load-progress,.video-js .vjs-progress-holder .vjs-load-progress div,.video-js .vjs-progress-holder .vjs-play-progress{border-radius:.2em}.vjs-menu-button-popup .vjs-menu .vjs-menu-content{background-color:rgba(0,0,0,.72)}.js-focus-visible .vjs-menu li.vjs-selected:hover,.vjs-menu li.vjs-selected,.vjs-menu li.vjs-selected:focus,.vjs-menu li.vjs-selected:hover{background-color:rgba(216,216,216,.2);color:var(--white)}.video-js .vjs-play-progress:before{top:-.3em}.vjs-playback-rate .vjs-playback-rate-value{line-height:2.75}.vjs-menu li,.vjs-playback-rate .vjs-playback-rate-value{font-size:1.1em}@media screen and (min-width:768px){.video-js .vjs-tech{pointer-events:none}}@media (hover:hover){.hide-in-desktop{visibility:hidden!important}}@media (pointer:fine){.hide-in-desktop{visibility:hidden!important}}.player-for-back-ward-controls{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;z-index:2}.player-for-back-ward-controls .player-container{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}.player-for-back-ward-controls .player-container .back-ward,.player-for-back-ward-controls .player-container .forward,.player-for-back-ward-controls .player-container .pause-play{width:2.5rem;height:2.5rem;padding:.5rem;-webkit-transition:.3s ease-in-out;transition:.3s ease-in-out;box-sizing:content-box;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;background:rgba(var(--rc-rgba-black),.5);border-radius:50%;-webkit-transform:scale(1);transform:scale(1)}@media (min-width:768px){.player-for-back-ward-controls .player-container .back-ward:hover,.player-for-back-ward-controls .player-container .forward:hover,.player-for-back-ward-controls .player-container .pause-play:hover{background:rgba(var(--rc-rgba-black),1);border-radius:100%;-webkit-transform:scale(1.25);transform:scale(1.25);cursor:pointer}.player-for-back-ward-controls .player-container .back-ward:hover svg g,.player-for-back-ward-controls .player-container .forward:hover svg g,.player-for-back-ward-controls .player-container .pause-play:hover svg g{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touched,.player-for-back-ward-controls .player-container .forward.touched,.player-for-back-ward-controls .player-container .pause-play.touched{-webkit-animation:2s scaling;animation:2s scaling;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touched svg g,.player-for-back-ward-controls .player-container .forward.touched svg g,.player-for-back-ward-controls .player-container .pause-play.touched svg g{-webkit-animation:2s scalingColor;animation:2s scalingColor;fill:var(--white)}@-webkit-keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touchout,.player-for-back-ward-controls .player-container .forward.touchout,.player-for-back-ward-controls .player-container .pause-play.touchout{-webkit-animation:2s scaling2;animation:2s scaling2;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touchout svg g,.player-for-back-ward-controls .player-container .forward.touchout svg g,.player-for-back-ward-controls .player-container .pause-play.touchout svg g{-webkit-animation:2s scalingColor2;animation:2s scalingColor2;fill:var(--white)}@-webkit-keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward svg,.player-for-back-ward-controls .player-container .forward svg,.player-for-back-ward-controls .player-container .pause-play svg{width:100%}.player-for-back-ward-controls .player-container .pause-play{margin:0 1.5rem}.player-for-back-ward-controls .player-container .pause-play .pause,.player-for-back-ward-controls .player-container .pause-play .play{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}"]
            }] }
];
/** @nocollapse */
VideoPlayerComponent.ctorParameters = () => [
    { type: ViewerService },
    { type: Renderer2 }
];
VideoPlayerComponent.propDecorators = {
    events: [{ type: Input }],
    target: [{ type: ViewChild, args: ['target', { static: true },] }],
    controlDiv: [{ type: ViewChild, args: ['controlDiv', { static: true },] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW8tcGxheWVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC12aWRlby1wbGF5ZXItdjgvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy92aWRlby1wbGF5ZXIvdmlkZW8tcGxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQWEsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQVE5RCxNQUFNLE9BQU8sb0JBQW9COzs7OztJQXVCL0IsWUFBbUIsYUFBNEIsRUFBVSxTQUFvQjtRQUExRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7UUF0QjdFLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMzQixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsdUJBQWtCLEdBQUcsTUFBTSxDQUFDO1FBTzVCLHNCQUFpQixHQUFHLENBQUMsQ0FBQztRQUN0QixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFFVixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUNuQix3QkFBbUIsR0FBRyxLQUFLLENBQUM7SUFHcUQsQ0FBQzs7OztJQUVsRixlQUFlO1FBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFB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MUIsOENBQXNCOztJQUN0QiwrQ0FBd0I7O0lBQ3hCLDRDQUFvQjs7SUFDcEIsa0RBQTRCOzs7OztJQUM1Qix1REFBNEM7Ozs7O0lBQzVDLHdEQUE2Qzs7SUFDN0Msc0NBQWdDOztJQUNoQyxzQ0FBMEQ7O0lBQzFELDBDQUFrRTs7SUFDbEUsc0NBQVk7O0lBQ1osaURBQXNCOztJQUN0Qiw0Q0FBaUI7O0lBQ2pCLDJDQUFnQjs7SUFDaEIseUNBQWlCOztJQUNqQixvQ0FBVTs7SUFDVix5Q0FBVTs7SUFDViw4Q0FBbUI7O0lBQ25CLG1EQUE0Qjs7Ozs7SUFDNUIsa0RBQXlDOztJQUU3Qiw2Q0FBbUM7Ozs7O0lBQUUseUNBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24sIE9uRGVzdHJveSwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgVmlld2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3ZpZXdlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndmlkZW8tcGxheWVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZpZGVvLXBsYXllci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3ZpZGVvLXBsYXllci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgc2hvd0JhY2t3YXJkQnV0dG9uID0gZmFsc2U7XG4gIHNob3dGb3J3YXJkQnV0dG9uID0gZmFsc2U7XG4gIHNob3dQbGF5QnV0dG9uID0gdHJ1ZTtcbiAgc2hvd1BhdXNlQnV0dG9uID0gZmFsc2U7XG4gIHNob3dDb250cm9scyA9IHRydWU7XG4gIGN1cnJlbnRQbGF5ZXJTdGF0ZSA9ICdub25lJztcbiAgcHJpdmF0ZSB1bmxpc3RlblRhcmdldE1vdXNlTW92ZTogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSB1bmxpc3RlblRhcmdldFRvdWNoU3RhcnQ6ICgpID0+IHZvaWQ7XG4gIEBJbnB1dCgpIGV2ZW50czogT2JzZXJ2YWJsZTxhbnk+XG4gIEBWaWV3Q2hpbGQoJ3RhcmdldCcsIHsgc3RhdGljOiB0cnVlIH0pIHRhcmdldDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnY29udHJvbERpdicsIHsgc3RhdGljOiB0cnVlIH0pIGNvbnRyb2xEaXY6IEVsZW1lbnRSZWY7XG4gIHBsYXllcjogYW55O1xuICB0b3RhbFNlZWtlZExlbmd0aCA9IDA7XG4gIHByZXZpb3VzVGltZSA9IDA7XG4gIGN1cnJlbnRUaW1lID0gMDtcbiAgc2Vla1N0YXJ0ID0gbnVsbDtcbiAgdGltZSA9IDEwO1xuICBzdGFydFRpbWU7XG4gIHRvdGFsU3BlbnRUaW1lID0gMDtcbiAgaXNBdXRvcGxheVByZXZlbnRlZCA9IGZhbHNlO1xuICBwcml2YXRlIGV2ZW50c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3ZXJTZXJ2aWNlOiBWaWV3ZXJTZXJ2aWNlLCBwcml2YXRlIHJlbmRlcmVyMjogUmVuZGVyZXIyKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFBsYXllck9wdGlvbnMoKS50aGVuKG9wdGlvbnMgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXIgPSB2aWRlb2pzKHRoaXMudGFyZ2V0Lm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgZmx1aWQ6IHRydWUsXG4gICAgICAgIHNvdXJjZXM6IG9wdGlvbnMsXG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICBwbGF5YmFja1JhdGVzOiBbMC41LCAxLCAxLjUsIDJdLFxuICAgICAgICBjb250cm9sQmFyOiB7XG4gICAgICAgICAgY2hpbGRyZW46IFsncGxheVRvZ2dsZScsICd2b2x1bWVQYW5lbCcsICdkdXJhdGlvbkRpc3BsYXknLCBcbiAgICAgICAgICAgICdwcm9ncmVzc0NvbnRyb2wnLCAncmVtYWluaW5nVGltZURpc3BsYXknLFxuICAgICAgICAgICAgJ3BsYXliYWNrUmF0ZU1lbnVCdXR0b24nLCAnZnVsbHNjcmVlblRvZ2dsZSddXG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIG9uTG9hZCgpIHtcblxuICAgICAgfSk7XG4gICAgICB0aGlzLnBsYXllci5tYXJrZXJzKHRoaXMudmlld2VyU2VydmljZS5nZXRNYXJrZXJzKCkpXG4gICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNBdXRvcGxheVByZXZlbnRlZCAmJiB0aGlzLmN1cnJlbnRQbGF5ZXJTdGF0ZSAhPT0gJ3BhdXNlJykge1xuICAgICAgICB0aGlzLnNob3dDb250cm9scyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sIDUwMDApO1xuXG4gICAgdGhpcy51bmxpc3RlblRhcmdldE1vdXNlTW92ZSA9IHRoaXMucmVuZGVyZXIyLmxpc3Rlbih0aGlzLnRhcmdldC5uYXRpdmVFbGVtZW50LCAnbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93Q29udHJvbHMgPSB0cnVlO1xuICAgIH0pO1xuICAgIHRoaXMudW5saXN0ZW5UYXJnZXRUb3VjaFN0YXJ0ID0gdGhpcy5yZW5kZXJlcjIubGlzdGVuKHRoaXMudGFyZ2V0Lm5hdGl2ZUVsZW1lbnQsICd0b3VjaHN0YXJ0JywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93Q29udHJvbHMgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnNpZGViYXJNZW51RXZlbnQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudCA9PT0gJ09QRU5fTUVOVScpIHsgdGhpcy5wYXVzZSgpOyB9XG4gICAgICBpZiAoZXZlbnQgPT09ICdDTE9TRV9NRU5VJykgeyB0aGlzLnBsYXkoKTsgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50cy5zdWJzY3JpYmUoKHthY3Rpb24sIGRhdGF9KSA9PiB7XG4gICAgICBpZihhY3Rpb24gPT09ICdwbGF5Jykge1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgIH0gZWxzZSBpZihhY3Rpb24gPT09ICdwYXVzZScpIHtcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IHRoaXMucGxheWVyLnBsYXkoKTtcbiAgICBpZiAocHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcm9taXNlLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5pc0F1dG9wbGF5UHJldmVudGVkID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50cyA9IFsnbG9hZHN0YXJ0JywgJ3BsYXknLCAncGF1c2UnLCAnZHVyYXRpb25jaGFuZ2UnLFxuICAgICAgJ2Vycm9yJywgJ3BsYXlpbmcnLCAncHJvZ3Jlc3MnLCAnc2Vla2VkJywgJ3NlZWtpbmcnLCAndm9sdW1lY2hhbmdlJyxcbiAgICAgICdyYXRlY2hhbmdlJ107XG5cbiAgICB0aGlzLnBsYXllci5vbignZnVsbHNjcmVlbmNoYW5nZScsIChkYXRhKSA9PiB7XG4gICAgICAvLyBUaGlzIGNvZGUgaXMgdG8gc2hvdyB0aGUgY29udHJvbGRpdiBpbiBmdWxsc2NyZWVuIG1vZGVcbiAgICAgIGlmKHRoaXMucGxheWVyLmlzRnVsbHNjcmVlbigpKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xEaXYubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnRlVMTFNDUkVFTicpO1xuICAgIH0pXG5cbiAgICB0aGlzLnBsYXllci5vbigncGF1c2UnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wbGF5ZXIub24oJ3BsYXknLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50UGxheWVyU3RhdGUgPSAncGxheSc7XG4gICAgICB0aGlzLnNob3dQYXVzZUJ1dHRvbiA9IHRydWU7XG4gICAgICB0aGlzLnNob3dQbGF5QnV0dG9uID0gZmFsc2U7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnUExBWScpO1xuICAgICAgdGhpcy5pc0F1dG9wbGF5UHJldmVudGVkID0gZmFsc2U7XG4gICAgfSk7ICAgXG5cbiAgICB0aGlzLnBsYXllci5vbigndGltZXVwZGF0ZScsIChkYXRhKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVZpZGVvQ29udHJvbHMoZGF0YSk7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucGxheWVyRXZlbnQuZW1pdChkYXRhKTtcbiAgICAgIGlmICh0aGlzLnBsYXllci5jdXJyZW50VGltZSgpID09PSB0aGlzLnBsYXllci5kdXJhdGlvbigpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlVmlkZW9Db250cm9scyh7IHR5cGU6ICdlbmRlZCcgfSk7XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5wbGF5ZXJFdmVudC5lbWl0KHsgdHlwZTogJ2VuZGVkJyB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBldmVudHMuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICB0aGlzLnBsYXllci5vbihldmVudCwgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVWaWRlb0NvbnRyb2xzKGRhdGEpO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucGxheWVyRXZlbnQuZW1pdChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH1cblxuICB0b2dnbGVGb3J3YXJkUmV3aW5kQnV0dG9uKCkge1xuICAgIHRoaXMuc2hvd0ZvcndhcmRCdXR0b24gPSB0cnVlO1xuICAgIHRoaXMuc2hvd0JhY2t3YXJkQnV0dG9uID0gdHJ1ZTtcbiAgICBpZiAoKHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKCkgKyB0aGlzLnRpbWUpID4gdGhpcy5wbGF5ZXIuZHVyYXRpb24oKSkge1xuICAgICAgdGhpcy5zaG93Rm9yd2FyZEJ1dHRvbiA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoKHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKCkgLSB0aGlzLnRpbWUpIDwgMCkge1xuICAgICAgdGhpcy5zaG93QmFja3dhcmRCdXR0b24gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMucGxheWVyLnBsYXkoKTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXJTdGF0ZSA9ICdwbGF5JztcbiAgICB0aGlzLnNob3dQYXVzZUJ1dHRvbiA9IHRydWU7XG4gICAgdGhpcy5zaG93UGxheUJ1dHRvbiA9IGZhbHNlO1xuICAgIHRoaXMudG9nZ2xlRm9yd2FyZFJld2luZEJ1dHRvbigpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcbiAgICB0aGlzLmN1cnJlbnRQbGF5ZXJTdGF0ZSA9ICdwYXVzZSc7XG4gICAgdGhpcy5zaG93UGF1c2VCdXR0b24gPSBmYWxzZTtcbiAgICB0aGlzLnNob3dQbGF5QnV0dG9uID0gdHJ1ZTtcbiAgICB0aGlzLnRvZ2dsZUZvcndhcmRSZXdpbmRCdXR0b24oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnUEFVU0UnKTtcbiAgfVxuXG4gIGJhY2t3YXJkKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKCkgLSB0aGlzLnRpbWUpO1xuICAgIHRoaXMudG9nZ2xlRm9yd2FyZFJld2luZEJ1dHRvbigpO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KCdCQUNLV0FSRCcpO1xuICB9XG5cbiAgZm9yd2FyZCgpIHtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50VGltZSh0aGlzLnBsYXllci5jdXJyZW50VGltZSgpICsgdGhpcy50aW1lKTtcbiAgICB0aGlzLnRvZ2dsZUZvcndhcmRSZXdpbmRCdXR0b24oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnRk9SV0FSRCcpO1xuICB9XG5cbiAgaGFuZGxlVmlkZW9Db250cm9scyh7IHR5cGUgfSkge1xuICAgIGlmICh0eXBlID09PSAncGxheWluZycpIHtcbiAgICAgIHRoaXMuc2hvd1BsYXlCdXR0b24gPSBmYWxzZTtcbiAgICAgIHRoaXMuc2hvd1BhdXNlQnV0dG9uID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdlbmRlZCcpIHtcbiAgICAgIHRoaXMudG90YWxTcGVudFRpbWUgKz0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS52aXNpdGVkTGVuZ3RoID0gdGhpcy50b3RhbFNwZW50VGltZTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5jdXJyZW50bGVuZ3RoID0gdGhpcy5wbGF5ZXIuY3VycmVudFRpbWUoKTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS50b3RhbExlbmd0aCA9IHRoaXMucGxheWVyLmR1cmF0aW9uKCk7XG4gICAgICB0aGlzLnVwZGF0ZVBsYXllckV2ZW50c01ldGFkYXRhKHsgdHlwZSB9KTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdwYXVzZScpIHtcbiAgICAgIHRoaXMudG90YWxTcGVudFRpbWUgKz0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnN0YXJ0VGltZTtcbiAgICAgIHRoaXMudXBkYXRlUGxheWVyRXZlbnRzTWV0YWRhdGEoeyB0eXBlIH0pO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ3BsYXknKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgdGhpcy51cGRhdGVQbGF5ZXJFdmVudHNNZXRhZGF0YSh7IHR5cGUgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdsb2Fkc3RhcnQnKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH1cblxuICAgIC8vIENhbHVsYXRpbmcgdG90YWwgc2Vla2VkIGxlbmd0aFxuICAgIGlmICh0eXBlID09PSAndGltZXVwZGF0ZScpIHtcbiAgICAgIHRoaXMucHJldmlvdXNUaW1lID0gdGhpcy5jdXJyZW50VGltZTtcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aGlzLnBsYXllci5jdXJyZW50VGltZSgpO1xuICAgICAgdGhpcy50b2dnbGVGb3J3YXJkUmV3aW5kQnV0dG9uKCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnc2Vla2luZycpIHtcbiAgICAgIGlmICh0aGlzLnNlZWtTdGFydCA9PT0gbnVsbCkgeyB0aGlzLnNlZWtTdGFydCA9IHRoaXMucHJldmlvdXNUaW1lOyB9XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnc2Vla2VkJykge1xuICAgICAgdGhpcy51cGRhdGVQbGF5ZXJFdmVudHNNZXRhZGF0YSh7IHR5cGUgfSk7XG4gICAgICBpZiAodGhpcy5jdXJyZW50VGltZSA+IHRoaXMuc2Vla1N0YXJ0KSB7XG4gICAgICAgIHRoaXMudG90YWxTZWVrZWRMZW5ndGggPSB0aGlzLnRvdGFsU2Vla2VkTGVuZ3RoICsgKHRoaXMuY3VycmVudFRpbWUgLSB0aGlzLnNlZWtTdGFydCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2Vla1N0YXJ0ID4gdGhpcy5jdXJyZW50VGltZSkge1xuICAgICAgICB0aGlzLnRvdGFsU2Vla2VkTGVuZ3RoID0gdGhpcy50b3RhbFNlZWtlZExlbmd0aCArICh0aGlzLnNlZWtTdGFydCAtIHRoaXMuY3VycmVudFRpbWUpO1xuICAgICAgfVxuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnRvdGFsU2Vla2VkTGVuZ3RoID0gdGhpcy50b3RhbFNlZWtlZExlbmd0aDtcbiAgICAgIHRoaXMuc2Vla1N0YXJ0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJFdmVudHNNZXRhZGF0YSh7IHR5cGUgfSkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5tZXRhRGF0YS50b3RhbER1cmF0aW9uID0gdGhpcy5wbGF5ZXIuZHVyYXRpb24oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UubWV0YURhdGEucGxheUJhY2tTcGVlZHMucHVzaCh0aGlzLnBsYXllci5wbGF5YmFja1JhdGUoKSk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLm1ldGFEYXRhLnZvbHVtZS5wdXNoKHRoaXMucGxheWVyLnZvbHVtZSgpKTtcbiAgICBjb25zdCBhY3Rpb24gPSB7fTtcbiAgICBhY3Rpb25bdHlwZSArICcnXSA9IHRoaXMucGxheWVyLmN1cnJlbnRUaW1lKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLm1ldGFEYXRhLmFjdGlvbnMucHVzaChhY3Rpb24pO1xuICB9XG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnBsYXllcikge1xuICAgICAgdGhpcy5wbGF5ZXIuZGlzcG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLnVubGlzdGVuVGFyZ2V0TW91c2VNb3ZlKCk7XG4gICAgdGhpcy51bmxpc3RlblRhcmdldFRvdWNoU3RhcnQoKTtcbiAgfVxufVxuIl19