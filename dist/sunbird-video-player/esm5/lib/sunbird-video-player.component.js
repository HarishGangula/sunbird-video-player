/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, HostListener, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ErrorService, errorCode, errorMessage } from '@project-sunbird/sunbird-player-sdk-v8';
import { Observable } from 'rxjs';
import { ViewerService } from './services/viewer.service';
import { SunbirdVideoPlayerService } from './sunbird-video-player.service';
var SunbirdVideoPlayerComponent = /** @class */ (function () {
    function SunbirdVideoPlayerComponent(videoPlayerService, viewerService, cdr, renderer2, errorService) {
        var _this = this;
        this.videoPlayerService = videoPlayerService;
        this.viewerService = viewerService;
        this.cdr = cdr;
        this.renderer2 = renderer2;
        this.errorService = errorService;
        this.telemetryEvent = new EventEmitter();
        this.viewState = 'player';
        this.showControls = true;
        this.sideMenuConfig = {
            showShare: true,
            showDownload: true,
            showReplay: true,
            showExit: true
        };
        this.isPaused = false;
        this.playerEvent = this.viewerService.playerEvent;
        this.viewerService.playerEvent.subscribe((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (event.type === 'pause') {
                _this.isPaused = true;
                _this.showControls = true;
            }
            if (event.type === 'play') {
                _this.isPaused = false;
            }
            if (event.type === 'loadstart') {
                _this.viewerService.raiseStartEvent(event);
            }
            if (event.type === 'ended') {
                _this.viewerService.endPageSeen = true;
                _this.viewerService.raiseEndEvent();
                _this.viewState = 'end';
            }
            if (event.type === 'error') {
                /** @type {?} */
                var code = errorCode.contentLoadFails;
                /** @type {?} */
                var message = errorMessage.contentLoadFails;
                if (!navigator.onLine) {
                    code = errorCode.internetConnectivity,
                        message = errorMessage.internetConnectivity;
                }
                if (_this.viewerService.isAvailableLocally) {
                    code = errorCode.contentLoadFails,
                        message = errorMessage.contentLoadFails;
                }
                if (code === errorCode.contentLoadFails) {
                    _this.showContentError = true;
                }
                _this.viewerService.raiseExceptionLog(code, message, event, _this.traceId);
            }
            /** @type {?} */
            var events = [{ type: 'volumechange', telemetryEvent: 'VOLUME_CHANGE' }, { type: 'seeking', telemetryEvent: 'DRAG' }, { type: 'fullscreen', telemetryEvent: 'FULLSCREEN' },
                { type: 'ratechange', telemetryEvent: 'RATE_CHANGE' }];
            events.forEach((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                if (event.type === data.type) {
                    _this.viewerService.raiseHeartBeatEvent(data.telemetryEvent);
                }
            }));
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.onTelemetryEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.telemetryEvent.emit(event.detail);
    };
    /**
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        setInterval((/**
         * @return {?}
         */
        function () {
            if (!_this.isPaused) {
                _this.showControls = false;
            }
        }), 5000);
        /* tslint:disable:no-string-literal */
        this.nextContent = this.playerConfig.config.nextContent;
        this.traceId = this.playerConfig.config['traceId'];
        this.sideMenuConfig = tslib_1.__assign({}, this.sideMenuConfig, this.playerConfig.config.sideMenu);
        this.viewerService.initialize(this.playerConfig);
        this.videoPlayerService.initialize(this.playerConfig);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.sidebarMenuEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.viewerService.sidebarMenuEvent.emit(event);
    };
    /**
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var videoPlayerElement = this.videoPlayerRef.nativeElement;
        this.unlistenMouseMove = this.renderer2.listen(videoPlayerElement, 'mousemove', (/**
         * @return {?}
         */
        function () {
            _this.showControls = true;
        }));
        this.unlistenTouchStart = this.renderer2.listen(videoPlayerElement, 'touchstart', (/**
         * @return {?}
         */
        function () {
            _this.showControls = true;
        }));
        /** @type {?} */
        var contentCompabilityLevel = this.playerConfig.metadata['compatibilityLevel'];
        if (contentCompabilityLevel) {
            /** @type {?} */
            var checkContentCompatible = this.errorService.checkContentCompatibility(contentCompabilityLevel);
            if (!checkContentCompatible['isCompitable']) {
                this.viewerService.raiseExceptionLog(errorCode.contentCompatibility, errorMessage.contentCompatibility, checkContentCompatible['error']['message'], this.traceId);
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.sideBarEvents = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        this.playerEvent.emit(event);
        if (event === 'DOWNLOAD') {
            this.downloadVideo();
        }
        /** @type {?} */
        var events = ['SHARE', 'DOWNLOAD_MENU', 'EXIT', 'CLOSE_MENU'];
        events.forEach((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (event === data) {
                _this.viewerService.raiseHeartBeatEvent(data);
            }
            if (event === 'EXIT') {
                _this.viewerService.sidebarMenuEvent.emit('CLOSE_MENU');
            }
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.playContent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.viewerService.raiseHeartBeatEvent(event.type);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.replayContent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.playerEvent.emit(event);
        this.viewState = 'player';
        this.viewerService.raiseHeartBeatEvent('REPLAY');
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.exitContent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.playerEvent.emit(event);
        this.viewerService.raiseHeartBeatEvent('EXIT');
    };
    /**
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.downloadVideo = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var a = document.createElement('a');
        a.href = this.viewerService.artifactUrl;
        a.download = this.viewerService.contentName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.viewerService.raiseHeartBeatEvent('DOWNLOAD');
    };
    /**
     * @return {?}
     */
    SunbirdVideoPlayerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseEndEvent();
        this.unlistenTouchStart();
        this.unlistenMouseMove();
    };
    SunbirdVideoPlayerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'sunbird-video-player',
                    template: "<div class=\"sunbird-video-player-container\" #videoPlayer>\n      <sb-player-side-menu-icon class=\"sb-player-side-menu-icon notVisible\" (sidebarMenuEvent)=\"viewerService.raiseHeartBeatEvent($event); sidebarMenuEvent($event);\"\n            *ngIf=\"viewState ==='player'\" [ngClass]=\"{'isVisible': showControls}\"></sb-player-side-menu-icon>\n      <video-player *ngIf=\"viewState === 'player'\" [events]=\"events\">\n      </video-player>\n      <sb-player-sidebar *ngIf=\"viewState ==='player'\"\n       [title]=\"viewerService.contentName\"\n      (sidebarEvent)=\"sideBarEvents($event)\" [config]=\"sideMenuConfig\"></sb-player-sidebar>\n      <sb-player-end-page [contentName]=\"viewerService.contentName\" [nextContent]=\"nextContent\" [userName]=\"viewerService.userName\" [showExit]=\"sideMenuConfig.showExit\"\n            [timeSpentLabel]=\"viewerService.timeSpent\" (playNextContent)=\"playContent($event)\" (exitContent)=\"exitContent($event)\"   (replayContent)=\"replayContent($event)\"\n            *ngIf=\"viewState === 'end'\"></sb-player-end-page>\n      <sb-player-contenterror *ngIf=\"showContentError\"></sb-player-contenterror>\n</div>",
                    styles: [".sunbird-video-player-container{width:100%;height:100%;overflow:hidden;position:relative}pdf-menu{position:absolute;top:0;left:0;z-index:99}.BtmNotVisible,.notVisible{-webkit-transition:1s ease-in-out;transition:1s ease-in-out;position:absolute;width:100%}.notVisible{top:-10rem}.notVisible.isVisible{top:0}.BtmNotVisible{bottom:-10rem}.BtmNotVisible.isVisible{bottom:0}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span{background:0 0!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:before,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label{background:rgba(51,51,51,.5)}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-pdf-player{overflow:hidden}::ng-deep .pdfViewer .page{background:0 0!important;-webkit-border-image:none!important;-o-border-image:none!important;border-image:none!important;border:0!important}::ng-deep #toolbarContainer{background:0 0!important;height:auto!important}::ng-deep #viewerContainer{position:relative!important;height:calc(100% - 3rem)}::ng-deep .body,::ng-deep .html,::ng-deep .pdf-viewer button,::ng-deep .pdf-viewer input,::ng-deep .pdf-viewer select{font-size:inherit!important}::ng-deep .findbar,::ng-deep .secondaryToolbar,::ng-deep html[dir=ltr] #toolbarContainer,::ng-deep html[dir=rtl] #toolbarContainer{box-shadow:none!important}::ng-deep .zoom{min-height:inherit!important}::ng-deep html[dir=rtl] .sb-pdf-reading-status{left:auto;right:1rem}.sb-pdf-reading-status{color:var(--gray-800);font-size:.75rem;position:absolute;left:1rem;bottom:1rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;background:var(--white);border-radius:.5rem;padding:.25em .5rem;z-index:5;line-height:normal}.sb-pdf-reading-status span{background:var(--gray-800);width:.25rem;height:.25rem;display:block;margin:0 .5rem;border-radius:50%}.sbt-pdf-footer{background:var(--white);position:absolute;bottom:0;width:100%;height:3rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;padding:.75rem .5rem}@media all and (orientation:landscape){::ng-deep .visible-only-potrait{display:none}}@media all and (orientation:portrait){::ng-deep #viewerContainer{height:calc(100% - 6rem)!important}::ng-deep .visible-only-landscape{display:none}::ng-deep .visible-only-potrait{display:block}::ng-deep .file-download__popup{height:15.125rem}::ng-deep .pdf-endpage{display:block!important;position:relative}::ng-deep .pdf-endpage__left-panel{margin-top:6rem}::ng-deep .pdf-endpage__right-panel .title-section{position:absolute;top:0;left:0;right:0}}@media all and (max-width:640px){.visible-only-landscape{display:none}.visible-only-potrait{display:block}}@media all and (min-width:640px){.visible-only-landscape{display:block}.visible-only-potrait{display:none}}"]
                }] }
    ];
    /** @nocollapse */
    SunbirdVideoPlayerComponent.ctorParameters = function () { return [
        { type: SunbirdVideoPlayerService },
        { type: ViewerService },
        { type: ChangeDetectorRef },
        { type: Renderer2 },
        { type: ErrorService }
    ]; };
    SunbirdVideoPlayerComponent.propDecorators = {
        playerConfig: [{ type: Input }],
        events: [{ type: Input }],
        playerEvent: [{ type: Output }],
        telemetryEvent: [{ type: Output }],
        videoPlayerRef: [{ type: ViewChild, args: ['videoPlayer', { static: true },] }],
        onTelemetryEvent: [{ type: HostListener, args: ['document:TelemetryEvent', ['$event'],] }],
        ngOnDestroy: [{ type: HostListener, args: ['window:beforeunload',] }]
    };
    return SunbirdVideoPlayerComponent;
}());
export { SunbirdVideoPlayerComponent };
if (false) {
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.playerConfig;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.events;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.playerEvent;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.telemetryEvent;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.videoPlayerRef;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.viewState;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.traceId;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.nextContent;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.showContentError;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.showControls;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.sideMenuConfig;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerComponent.prototype.unlistenTouchStart;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerComponent.prototype.unlistenMouseMove;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.isPaused;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.videoPlayerService;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.viewerService;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.cdr;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerComponent.prototype.renderer2;
    /** @type {?} */
    SunbirdVideoPlayerComponent.prototype.errorService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXZpZGVvLXBsYXllci12OC8iLCJzb3VyY2VzIjpbImxpYi9zdW5iaXJkLXZpZGVvLXBsYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUNqRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBaUIsU0FBUyxFQUM5RCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFHLFNBQVMsRUFBRyxZQUFZLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRyxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUdoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0U7SUE0QkUscUNBQ1Msa0JBQTZDLEVBQzdDLGFBQTRCLEVBQzVCLEdBQXNCLEVBQ3JCLFNBQW9CLEVBQ3JCLFlBQTBCO1FBTG5DLGlCQWtEQztRQWpEUSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQTJCO1FBQzdDLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3JCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQWM7UUF2QnpCLG1CQUFjLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFFdEUsY0FBUyxHQUFHLFFBQVEsQ0FBQztRQUlyQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixtQkFBYyxHQUFHO1lBQ2YsU0FBUyxFQUFFLElBQUk7WUFDZixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFV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UUFDMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Z0JBNUtGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxxcENBQW9EOztpQkFFckQ7Ozs7Z0JBTFEseUJBQXlCO2dCQUR6QixhQUFhO2dCQVBwQixpQkFBaUI7Z0JBQ21DLFNBQVM7Z0JBRXRELFlBQVk7OzsrQkFhbEIsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLE1BQU07aUNBQ04sTUFBTTtpQ0FDTixTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTttQ0FxRXpDLFlBQVksU0FBQyx5QkFBeUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkF1RmxELFlBQVksU0FBQyxxQkFBcUI7O0lBTXJDLGtDQUFDO0NBQUEsQUE3S0QsSUE2S0M7U0F4S1ksMkJBQTJCOzs7SUFFdEMsbURBQW9DOztJQUNwQyw2Q0FBd0Q7O0lBQ3hELGtEQUE0Qzs7SUFDNUMscURBQXNFOztJQUN0RSxxREFBdUU7O0lBQ3ZFLGdEQUFxQjs7SUFDckIsOENBQXVCOztJQUN2QixrREFBd0I7O0lBQ3hCLHVEQUEwQjs7SUFDMUIsbURBQW9COztJQUNwQixxREFLRTs7Ozs7SUFDRix5REFBdUM7Ozs7O0lBQ3ZDLHdEQUFzQzs7SUFDdEMsK0NBQWlCOztJQUlmLHlEQUFvRDs7SUFDcEQsb0RBQW1DOztJQUNuQywwQ0FBNkI7Ozs7O0lBQzdCLGdEQUE0Qjs7SUFDNUIsbURBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsXG4gIEhvc3RMaXN0ZW5lciwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBSZW5kZXJlcjIsIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVycm9yU2VydmljZSAsIGVycm9yQ29kZSAsIGVycm9yTWVzc2FnZSB9IGZyb20gJ0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1wbGF5ZXItc2RrLXY4JztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBQbGF5ZXJDb25maWcgfSBmcm9tICcuL3BsYXllckludGVyZmFjZXMnO1xuaW1wb3J0IHsgVmlld2VyU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvdmlld2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3VuYmlyZFZpZGVvUGxheWVyU2VydmljZSB9IGZyb20gJy4vc3VuYmlyZC12aWRlby1wbGF5ZXIuc2VydmljZSc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzdW5iaXJkLXZpZGVvLXBsYXllcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zdW5iaXJkLXZpZGVvLXBsYXllci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3N1bmJpcmQtdmlkZW8tcGxheWVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU3VuYmlyZFZpZGVvUGxheWVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpIHBsYXllckNvbmZpZzogUGxheWVyQ29uZmlnO1xuICBASW5wdXQoKSBldmVudHM6IE9ic2VydmFibGU8e2FjdGlvbjogc3RyaW5nLCBkYXRhOiBhbnl9PlxuICBAT3V0cHV0KCkgcGxheWVyRXZlbnQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICBAT3V0cHV0KCkgdGVsZW1ldHJ5RXZlbnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBWaWV3Q2hpbGQoJ3ZpZGVvUGxheWVyJywgeyBzdGF0aWM6IHRydWUgfSkgdmlkZW9QbGF5ZXJSZWY6IEVsZW1lbnRSZWY7XG4gIHZpZXdTdGF0ZSA9ICdwbGF5ZXInO1xuICBwdWJsaWMgdHJhY2VJZDogc3RyaW5nO1xuICBwdWJsaWMgbmV4dENvbnRlbnQ6IGFueTtcbiAgc2hvd0NvbnRlbnRFcnJvcjogYm9vbGVhbjtcbiAgc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgc2lkZU1lbnVDb25maWcgPSB7XG4gICAgc2hvd1NoYXJlOiB0cnVlLFxuICAgIHNob3dEb3dubG9hZDogdHJ1ZSxcbiAgICBzaG93UmVwbGF5OiB0cnVlLFxuICAgIHNob3dFeGl0OiB0cnVlXG4gIH07XG4gIHByaXZhdGUgdW5saXN0ZW5Ub3VjaFN0YXJ0OiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIHVubGlzdGVuTW91c2VNb3ZlOiAoKSA9PiB2b2lkO1xuICBpc1BhdXNlZCA9IGZhbHNlO1xuICBcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmlkZW9QbGF5ZXJTZXJ2aWNlOiBTdW5iaXJkVmlkZW9QbGF5ZXJTZXJ2aWNlLFxuICAgIHB1YmxpYyB2aWV3ZXJTZXJ2aWNlOiBWaWV3ZXJTZXJ2aWNlLFxuICAgIHB1YmxpYyBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGVycm9yU2VydmljZTogRXJyb3JTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMucGxheWVyRXZlbnQgPSB0aGlzLnZpZXdlclNlcnZpY2UucGxheWVyRXZlbnQ7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnBsYXllckV2ZW50LnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZihldmVudC50eXBlID09PSAncGF1c2UnKSB7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3dDb250cm9scyA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZihldmVudC50eXBlID09PSAncGxheScpIHtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdsb2Fkc3RhcnQnKSB7XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZVN0YXJ0RXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdlbmRlZCcpIHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmVuZFBhZ2VTZWVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlRW5kRXZlbnQoKTtcbiAgICAgICAgdGhpcy52aWV3U3RhdGUgPSAnZW5kJztcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgIGxldCBjb2RlID0gZXJyb3JDb2RlLmNvbnRlbnRMb2FkRmFpbHMsXG4gICAgICAgICAgbWVzc2FnZSA9IGVycm9yTWVzc2FnZS5jb250ZW50TG9hZEZhaWxzXG5cbiAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG4gICAgICAgICAgICBjb2RlID0gZXJyb3JDb2RlLmludGVybmV0Q29ubmVjdGl2aXR5LFxuICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yTWVzc2FnZS5pbnRlcm5ldENvbm5lY3Rpdml0eVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZpZXdlclNlcnZpY2UuaXNBdmFpbGFibGVMb2NhbGx5KSB7XG4gICAgICAgICAgICBjb2RlID0gZXJyb3JDb2RlLmNvbnRlbnRMb2FkRmFpbHMsXG4gICAgICAgICAgICBtZXNzYWdlID0gZXJyb3JNZXNzYWdlLmNvbnRlbnRMb2FkRmFpbHNcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29kZSA9PT0gZXJyb3JDb2RlLmNvbnRlbnRMb2FkRmFpbHMpIHtcbiAgICAgICAgICB0aGlzLnNob3dDb250ZW50RXJyb3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUV4Y2VwdGlvbkxvZyhjb2RlLCBtZXNzYWdlLCBldmVudCwgdGhpcy50cmFjZUlkKTtcblxuICAgICAgfVxuICAgICAgY29uc3QgZXZlbnRzID0gW3sgdHlwZTogJ3ZvbHVtZWNoYW5nZScsIHRlbGVtZXRyeUV2ZW50OiAnVk9MVU1FX0NIQU5HRScgfSwgeyB0eXBlOiAnc2Vla2luZycsIHRlbGVtZXRyeUV2ZW50OiAnRFJBRycgfSwgeyB0eXBlOiAnZnVsbHNjcmVlbicsIHRlbGVtZXRyeUV2ZW50OiAnRlVMTFNDUkVFTicgfSxcbiAgICAgIHsgdHlwZTogJ3JhdGVjaGFuZ2UnLCB0ZWxlbWV0cnlFdmVudDogJ1JBVEVfQ0hBTkdFJyB9XTtcbiAgICAgIGV2ZW50cy5mb3JFYWNoKGRhdGEgPT4ge1xuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gZGF0YS50eXBlKSB7XG4gICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZGF0YS50ZWxlbWV0cnlFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6VGVsZW1ldHJ5RXZlbnQnLCBbJyRldmVudCddKVxuICBvblRlbGVtZXRyeUV2ZW50KGV2ZW50KSB7XG4gICAgdGhpcy50ZWxlbWV0cnlFdmVudC5lbWl0KGV2ZW50LmRldGFpbCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgdGhpcy5zaG93Q29udHJvbHMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9LCA1MDAwKTtcblxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXG4gICAgdGhpcy5uZXh0Q29udGVudCA9IHRoaXMucGxheWVyQ29uZmlnLmNvbmZpZy5uZXh0Q29udGVudDtcbiAgICB0aGlzLnRyYWNlSWQgPSB0aGlzLnBsYXllckNvbmZpZy5jb25maWdbJ3RyYWNlSWQnXTtcbiAgICB0aGlzLnNpZGVNZW51Q29uZmlnID0geyAuLi50aGlzLnNpZGVNZW51Q29uZmlnLCAuLi50aGlzLnBsYXllckNvbmZpZy5jb25maWcuc2lkZU1lbnUgfTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UuaW5pdGlhbGl6ZSh0aGlzLnBsYXllckNvbmZpZyk7XG4gICAgdGhpcy52aWRlb1BsYXllclNlcnZpY2UuaW5pdGlhbGl6ZSh0aGlzLnBsYXllckNvbmZpZyk7XG5cblxuICB9XG5cbiAgc2lkZWJhck1lbnVFdmVudChldmVudCkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5zaWRlYmFyTWVudUV2ZW50LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IHZpZGVvUGxheWVyRWxlbWVudCA9IHRoaXMudmlkZW9QbGF5ZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnVubGlzdGVuTW91c2VNb3ZlID0gdGhpcy5yZW5kZXJlcjIubGlzdGVuKHZpZGVvUGxheWVyRWxlbWVudCwgJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMudW5saXN0ZW5Ub3VjaFN0YXJ0ID0gdGhpcy5yZW5kZXJlcjIubGlzdGVuKHZpZGVvUGxheWVyRWxlbWVudCwgJ3RvdWNoc3RhcnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNob3dDb250cm9scyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb250ZW50Q29tcGFiaWxpdHlMZXZlbCA9IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhWydjb21wYXRpYmlsaXR5TGV2ZWwnXTtcbiAgICBpZiAoY29udGVudENvbXBhYmlsaXR5TGV2ZWwpIHtcbiAgICAgIGNvbnN0IGNoZWNrQ29udGVudENvbXBhdGlibGUgPSB0aGlzLmVycm9yU2VydmljZS5jaGVja0NvbnRlbnRDb21wYXRpYmlsaXR5KGNvbnRlbnRDb21wYWJpbGl0eUxldmVsKTtcbiAgICAgIGlmICghY2hlY2tDb250ZW50Q29tcGF0aWJsZVsnaXNDb21waXRhYmxlJ10pIHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlRXhjZXB0aW9uTG9nKGVycm9yQ29kZS5jb250ZW50Q29tcGF0aWJpbGl0eSwgZXJyb3JNZXNzYWdlLmNvbnRlbnRDb21wYXRpYmlsaXR5LCBjaGVja0NvbnRlbnRDb21wYXRpYmxlWydlcnJvciddWydtZXNzYWdlJ10sIHRoaXMudHJhY2VJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2lkZUJhckV2ZW50cyhldmVudCkge1xuICAgIHRoaXMucGxheWVyRXZlbnQuZW1pdChldmVudCk7XG4gICAgaWYgKGV2ZW50ID09PSAnRE9XTkxPQUQnKSB7XG4gICAgICB0aGlzLmRvd25sb2FkVmlkZW8oKTtcbiAgICB9XG4gICAgY29uc3QgZXZlbnRzID0gWydTSEFSRScsICdET1dOTE9BRF9NRU5VJywgJ0VYSVQnLCAnQ0xPU0VfTUVOVSddO1xuICAgIGV2ZW50cy5mb3JFYWNoKGRhdGEgPT4ge1xuICAgICAgaWYgKGV2ZW50ID09PSBkYXRhKSB7XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGRhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50ID09PSAnRVhJVCcpIHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnNpZGViYXJNZW51RXZlbnQuZW1pdCgnQ0xPU0VfTUVOVScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcGxheUNvbnRlbnQoZXZlbnQpe1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50LnR5cGUpO1xuICB9XG5cbiAgcmVwbGF5Q29udGVudChldmVudCkge1xuICAgIHRoaXMucGxheWVyRXZlbnQuZW1pdChldmVudCk7XG4gICAgdGhpcy52aWV3U3RhdGUgPSAncGxheWVyJztcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnUkVQTEFZJyk7XG4gIH1cblxuICBleGl0Q29udGVudChldmVudCkge1xuICAgIHRoaXMucGxheWVyRXZlbnQuZW1pdChldmVudCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ0VYSVQnKTtcbiAgfVxuXG4gIGRvd25sb2FkVmlkZW8oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmhyZWYgPSB0aGlzLnZpZXdlclNlcnZpY2UuYXJ0aWZhY3RVcmw7XG4gICAgYS5kb3dubG9hZCA9IHRoaXMudmlld2VyU2VydmljZS5jb250ZW50TmFtZTtcbiAgICBhLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgYS5jbGljaygpO1xuICAgIGEucmVtb3ZlKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ0RPV05MT0FEJyk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JldW5sb2FkJylcbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlRW5kRXZlbnQoKTtcbiAgICB0aGlzLnVubGlzdGVuVG91Y2hTdGFydCgpO1xuICAgIHRoaXMudW5saXN0ZW5Nb3VzZU1vdmUoKTtcbiAgfVxufVxuIl19