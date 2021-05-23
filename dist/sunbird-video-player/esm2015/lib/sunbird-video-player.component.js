/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, HostListener, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ErrorService, errorCode, errorMessage } from '@project-sunbird/sunbird-player-sdk-v8';
import { Observable } from 'rxjs';
import { ViewerService } from './services/viewer.service';
import { SunbirdVideoPlayerService } from './sunbird-video-player.service';
export class SunbirdVideoPlayerComponent {
    /**
     * @param {?} videoPlayerService
     * @param {?} viewerService
     * @param {?} cdr
     * @param {?} renderer2
     * @param {?} errorService
     */
    constructor(videoPlayerService, viewerService, cdr, renderer2, errorService) {
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
        event => {
            if (event.type === 'pause') {
                this.isPaused = true;
                this.showControls = true;
            }
            if (event.type === 'play') {
                this.isPaused = false;
            }
            if (event.type === 'loadstart') {
                this.viewerService.raiseStartEvent(event);
            }
            if (event.type === 'ended') {
                this.viewerService.endPageSeen = true;
                this.viewerService.raiseEndEvent();
                this.viewState = 'end';
            }
            if (event.type === 'error') {
                /** @type {?} */
                let code = errorCode.contentLoadFails;
                /** @type {?} */
                let message = errorMessage.contentLoadFails;
                if (!navigator.onLine) {
                    code = errorCode.internetConnectivity,
                        message = errorMessage.internetConnectivity;
                }
                if (this.viewerService.isAvailableLocally) {
                    code = errorCode.contentLoadFails,
                        message = errorMessage.contentLoadFails;
                }
                if (code === errorCode.contentLoadFails) {
                    this.showContentError = true;
                }
                this.viewerService.raiseExceptionLog(code, message, event, this.traceId);
            }
            /** @type {?} */
            const events = [{ type: 'volumechange', telemetryEvent: 'VOLUME_CHANGE' }, { type: 'seeking', telemetryEvent: 'DRAG' }, { type: 'fullscreen', telemetryEvent: 'FULLSCREEN' },
                { type: 'ratechange', telemetryEvent: 'RATE_CHANGE' }];
            events.forEach((/**
             * @param {?} data
             * @return {?}
             */
            data => {
                if (event.type === data.type) {
                    this.viewerService.raiseHeartBeatEvent(data.telemetryEvent);
                }
            }));
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTelemetryEvent(event) {
        this.telemetryEvent.emit(event.detail);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        setInterval((/**
         * @return {?}
         */
        () => {
            if (!this.isPaused) {
                this.showControls = false;
            }
        }), 5000);
        /* tslint:disable:no-string-literal */
        this.nextContent = this.playerConfig.config.nextContent;
        this.traceId = this.playerConfig.config['traceId'];
        this.sideMenuConfig = Object.assign({}, this.sideMenuConfig, this.playerConfig.config.sideMenu);
        this.viewerService.initialize(this.playerConfig);
        this.videoPlayerService.initialize(this.playerConfig);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    sidebarMenuEvent(event) {
        this.viewerService.sidebarMenuEvent.emit(event);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        /** @type {?} */
        const videoPlayerElement = this.videoPlayerRef.nativeElement;
        this.unlistenMouseMove = this.renderer2.listen(videoPlayerElement, 'mousemove', (/**
         * @return {?}
         */
        () => {
            this.showControls = true;
        }));
        this.unlistenTouchStart = this.renderer2.listen(videoPlayerElement, 'touchstart', (/**
         * @return {?}
         */
        () => {
            this.showControls = true;
        }));
        /** @type {?} */
        const contentCompabilityLevel = this.playerConfig.metadata['compatibilityLevel'];
        if (contentCompabilityLevel) {
            /** @type {?} */
            const checkContentCompatible = this.errorService.checkContentCompatibility(contentCompabilityLevel);
            if (!checkContentCompatible['isCompitable']) {
                this.viewerService.raiseExceptionLog(errorCode.contentCompatibility, errorMessage.contentCompatibility, checkContentCompatible['error']['message'], this.traceId);
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    sideBarEvents(event) {
        this.playerEvent.emit(event);
        if (event === 'DOWNLOAD') {
            this.downloadVideo();
        }
        /** @type {?} */
        const events = ['SHARE', 'DOWNLOAD_MENU', 'EXIT', 'CLOSE_MENU'];
        events.forEach((/**
         * @param {?} data
         * @return {?}
         */
        data => {
            if (event === data) {
                this.viewerService.raiseHeartBeatEvent(data);
            }
            if (event === 'EXIT') {
                this.viewerService.sidebarMenuEvent.emit('CLOSE_MENU');
            }
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    playContent(event) {
        this.viewerService.raiseHeartBeatEvent(event.type);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    replayContent(event) {
        this.playerEvent.emit(event);
        this.viewState = 'player';
        this.viewerService.raiseHeartBeatEvent('REPLAY');
    }
    /**
     * @param {?} event
     * @return {?}
     */
    exitContent(event) {
        this.playerEvent.emit(event);
        this.viewerService.raiseHeartBeatEvent('EXIT');
    }
    /**
     * @return {?}
     */
    downloadVideo() {
        /** @type {?} */
        const a = document.createElement('a');
        a.href = this.viewerService.artifactUrl;
        a.download = this.viewerService.contentName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.viewerService.raiseHeartBeatEvent('DOWNLOAD');
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.viewerService.raiseEndEvent();
        this.unlistenTouchStart();
        this.unlistenMouseMove();
    }
}
SunbirdVideoPlayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'sunbird-video-player',
                template: "<div class=\"sunbird-video-player-container\" #videoPlayer>\n      <sb-player-side-menu-icon class=\"sb-player-side-menu-icon notVisible\" (sidebarMenuEvent)=\"viewerService.raiseHeartBeatEvent($event); sidebarMenuEvent($event);\"\n            *ngIf=\"viewState ==='player'\" [ngClass]=\"{'isVisible': showControls}\"></sb-player-side-menu-icon>\n      <video-player *ngIf=\"viewState === 'player'\" [events]=\"events\">\n      </video-player>\n      <sb-player-sidebar *ngIf=\"viewState ==='player'\"\n       [title]=\"viewerService.contentName\"\n      (sidebarEvent)=\"sideBarEvents($event)\" [config]=\"sideMenuConfig\"></sb-player-sidebar>\n      <sb-player-end-page [contentName]=\"viewerService.contentName\" [nextContent]=\"nextContent\" [userName]=\"viewerService.userName\" [showExit]=\"sideMenuConfig.showExit\"\n            [timeSpentLabel]=\"viewerService.timeSpent\" (playNextContent)=\"playContent($event)\" (exitContent)=\"exitContent($event)\"   (replayContent)=\"replayContent($event)\"\n            *ngIf=\"viewState === 'end'\"></sb-player-end-page>\n      <sb-player-contenterror *ngIf=\"showContentError\"></sb-player-contenterror>\n</div>",
                styles: [".sunbird-video-player-container{width:100%;height:100%;overflow:hidden;position:relative}pdf-menu{position:absolute;top:0;left:0;z-index:99}.BtmNotVisible,.notVisible{-webkit-transition:1s ease-in-out;transition:1s ease-in-out;position:absolute;width:100%}.notVisible{top:-10rem}.notVisible.isVisible{top:0}.BtmNotVisible{bottom:-10rem}.BtmNotVisible.isVisible{bottom:0}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span{background:0 0!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:before,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label{background:rgba(51,51,51,.5)}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-pdf-player{overflow:hidden}::ng-deep .pdfViewer .page{background:0 0!important;-webkit-border-image:none!important;-o-border-image:none!important;border-image:none!important;border:0!important}::ng-deep #toolbarContainer{background:0 0!important;height:auto!important}::ng-deep #viewerContainer{position:relative!important;height:calc(100% - 3rem)}::ng-deep .body,::ng-deep .html,::ng-deep .pdf-viewer button,::ng-deep .pdf-viewer input,::ng-deep .pdf-viewer select{font-size:inherit!important}::ng-deep .findbar,::ng-deep .secondaryToolbar,::ng-deep html[dir=ltr] #toolbarContainer,::ng-deep html[dir=rtl] #toolbarContainer{box-shadow:none!important}::ng-deep .zoom{min-height:inherit!important}::ng-deep html[dir=rtl] .sb-pdf-reading-status{left:auto;right:1rem}.sb-pdf-reading-status{color:var(--gray-800);font-size:.75rem;position:absolute;left:1rem;bottom:1rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;background:var(--white);border-radius:.5rem;padding:.25em .5rem;z-index:5;line-height:normal}.sb-pdf-reading-status span{background:var(--gray-800);width:.25rem;height:.25rem;display:block;margin:0 .5rem;border-radius:50%}.sbt-pdf-footer{background:var(--white);position:absolute;bottom:0;width:100%;height:3rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;padding:.75rem .5rem}@media all and (orientation:landscape){::ng-deep .visible-only-potrait{display:none}}@media all and (orientation:portrait){::ng-deep #viewerContainer{height:calc(100% - 6rem)!important}::ng-deep .visible-only-landscape{display:none}::ng-deep .visible-only-potrait{display:block}::ng-deep .file-download__popup{height:15.125rem}::ng-deep .pdf-endpage{display:block!important;position:relative}::ng-deep .pdf-endpage__left-panel{margin-top:6rem}::ng-deep .pdf-endpage__right-panel .title-section{position:absolute;top:0;left:0;right:0}}@media all and (max-width:640px){.visible-only-landscape{display:none}.visible-only-potrait{display:block}}@media all and (min-width:640px){.visible-only-landscape{display:block}.visible-only-potrait{display:none}}"]
            }] }
];
/** @nocollapse */
SunbirdVideoPlayerComponent.ctorParameters = () => [
    { type: SunbirdVideoPlayerService },
    { type: ViewerService },
    { type: ChangeDetectorRef },
    { type: Renderer2 },
    { type: ErrorService }
];
SunbirdVideoPlayerComponent.propDecorators = {
    playerConfig: [{ type: Input }],
    events: [{ type: Input }],
    playerEvent: [{ type: Output }],
    telemetryEvent: [{ type: Output }],
    videoPlayerRef: [{ type: ViewChild, args: ['videoPlayer', { static: true },] }],
    onTelemetryEvent: [{ type: HostListener, args: ['document:TelemetryEvent', ['$event'],] }],
    ngOnDestroy: [{ type: HostListener, args: ['window:beforeunload',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXZpZGVvLXBsYXllci12OC8iLCJzb3VyY2VzIjpbImxpYi9zdW5iaXJkLXZpZGVvLXBsYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQ2pFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFpQixTQUFTLEVBQzlELE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUcsU0FBUyxFQUFHLFlBQVksRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBR2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQU0zRSxNQUFNLE9BQU8sMkJBQTJCOzs7Ozs7OztJQXVCdEMsWUFDUyxrQkFBNkMsRUFDN0MsYUFBNEIsRUFDNUIsR0FBc0IsRUFDckIsU0FBb0IsRUFDckIsWUFBMEI7UUFKMUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUEyQjtRQUM3QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNyQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBdkJ6QixtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXRFLGNBQVMsR0FBRyxRQUFRLENBQUM7UUFJckIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsbUJBQWMsR0FBRztZQUNmLFNBQVMsRUFBRSxJQUFJO1lBQ2YsWUFBWSxFQUFFLElBQUk7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UUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMscXBDQUFvRDs7YUFFckQ7Ozs7WUFMUSx5QkFBeUI7WUFEekIsYUFBYTtZQVBwQixpQkFBaUI7WUFDbUMsU0FBUztZQUV0RCxZQUFZOzs7MkJBYWxCLEtBQUs7cUJBQ0wsS0FBSzswQkFDTCxNQUFNOzZCQUNOLE1BQU07NkJBQ04sU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7K0JBcUV6QyxZQUFZLFNBQUMseUJBQXlCLEVBQUUsQ0FBQyxRQUFRLENBQUM7MEJBdUZsRCxZQUFZLFNBQUMscUJBQXFCOzs7O0lBaEtuQyxtREFBb0M7O0lBQ3BDLDZDQUF3RDs7SUFDeEQsa0RBQTRDOztJQUM1QyxxREFBc0U7O0lBQ3RFLHFEQUF1RTs7SUFDdkUsZ0RBQXFCOztJQUNyQiw4Q0FBdUI7O0lBQ3ZCLGtEQUF3Qjs7SUFDeEIsdURBQTBCOztJQUMxQixtREFBb0I7O0lBQ3BCLHFEQUtFOzs7OztJQUNGLHlEQUF1Qzs7Ozs7SUFDdkMsd0RBQXNDOztJQUN0QywrQ0FBaUI7O0lBSWYseURBQW9EOztJQUNwRCxvREFBbUM7O0lBQ25DLDBDQUE2Qjs7Ozs7SUFDN0IsZ0RBQTRCOztJQUM1QixtREFBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCxcbiAgSG9zdExpc3RlbmVyLCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIFJlbmRlcmVyMiwgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRXJyb3JTZXJ2aWNlICwgZXJyb3JDb2RlICwgZXJyb3JNZXNzYWdlIH0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXBsYXllci1zZGstdjgnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFBsYXllckNvbmZpZyB9IGZyb20gJy4vcGxheWVySW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBWaWV3ZXJTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy92aWV3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTdW5iaXJkVmlkZW9QbGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi9zdW5iaXJkLXZpZGVvLXBsYXllci5zZXJ2aWNlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3N1bmJpcmQtdmlkZW8tcGxheWVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3N1bmJpcmQtdmlkZW8tcGxheWVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc3VuYmlyZC12aWRlby1wbGF5ZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTdW5iaXJkVmlkZW9QbGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KCkgcGxheWVyQ29uZmlnOiBQbGF5ZXJDb25maWc7XG4gIEBJbnB1dCgpIGV2ZW50czogT2JzZXJ2YWJsZTx7YWN0aW9uOiBzdHJpbmcsIGRhdGE6IGFueX0+XG4gIEBPdXRwdXQoKSBwbGF5ZXJFdmVudDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gIEBPdXRwdXQoKSB0ZWxlbWV0cnlFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQFZpZXdDaGlsZCgndmlkZW9QbGF5ZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSB2aWRlb1BsYXllclJlZjogRWxlbWVudFJlZjtcbiAgdmlld1N0YXRlID0gJ3BsYXllcic7XG4gIHB1YmxpYyB0cmFjZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyBuZXh0Q29udGVudDogYW55O1xuICBzaG93Q29udGVudEVycm9yOiBib29sZWFuO1xuICBzaG93Q29udHJvbHMgPSB0cnVlO1xuICBzaWRlTWVudUNvbmZpZyA9IHtcbiAgICBzaG93U2hhcmU6IHRydWUsXG4gICAgc2hvd0Rvd25sb2FkOiB0cnVlLFxuICAgIHNob3dSZXBsYXk6IHRydWUsXG4gICAgc2hvd0V4aXQ6IHRydWVcbiAgfTtcbiAgcHJpdmF0ZSB1bmxpc3RlblRvdWNoU3RhcnQ6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgdW5saXN0ZW5Nb3VzZU1vdmU6ICgpID0+IHZvaWQ7XG4gIGlzUGF1c2VkID0gZmFsc2U7XG4gIFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB2aWRlb1BsYXllclNlcnZpY2U6IFN1bmJpcmRWaWRlb1BsYXllclNlcnZpY2UsXG4gICAgcHVibGljIHZpZXdlclNlcnZpY2U6IFZpZXdlclNlcnZpY2UsXG4gICAgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgZXJyb3JTZXJ2aWNlOiBFcnJvclNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5wbGF5ZXJFdmVudCA9IHRoaXMudmlld2VyU2VydmljZS5wbGF5ZXJFdmVudDtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucGxheWVyRXZlbnQuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmKGV2ZW50LnR5cGUgPT09ICdwYXVzZScpIHtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmKGV2ZW50LnR5cGUgPT09ICdwbGF5Jykge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2xvYWRzdGFydCcpIHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlU3RhcnRFdmVudChldmVudCk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2VuZGVkJykge1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UuZW5kUGFnZVNlZW4gPSB0cnVlO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VFbmRFdmVudCgpO1xuICAgICAgICB0aGlzLnZpZXdTdGF0ZSA9ICdlbmQnO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgbGV0IGNvZGUgPSBlcnJvckNvZGUuY29udGVudExvYWRGYWlscyxcbiAgICAgICAgICBtZXNzYWdlID0gZXJyb3JNZXNzYWdlLmNvbnRlbnRMb2FkRmFpbHNcblxuICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcbiAgICAgICAgICAgIGNvZGUgPSBlcnJvckNvZGUuaW50ZXJuZXRDb25uZWN0aXZpdHksXG4gICAgICAgICAgICBtZXNzYWdlID0gZXJyb3JNZXNzYWdlLmludGVybmV0Q29ubmVjdGl2aXR5XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudmlld2VyU2VydmljZS5pc0F2YWlsYWJsZUxvY2FsbHkpIHtcbiAgICAgICAgICAgIGNvZGUgPSBlcnJvckNvZGUuY29udGVudExvYWRGYWlscyxcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvck1lc3NhZ2UuY29udGVudExvYWRGYWlsc1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2RlID09PSBlcnJvckNvZGUuY29udGVudExvYWRGYWlscykge1xuICAgICAgICAgIHRoaXMuc2hvd0NvbnRlbnRFcnJvciA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlRXhjZXB0aW9uTG9nKGNvZGUsIG1lc3NhZ2UsIGV2ZW50LCB0aGlzLnRyYWNlSWQpO1xuXG4gICAgICB9XG4gICAgICBjb25zdCBldmVudHMgPSBbeyB0eXBlOiAndm9sdW1lY2hhbmdlJywgdGVsZW1ldHJ5RXZlbnQ6ICdWT0xVTUVfQ0hBTkdFJyB9LCB7IHR5cGU6ICdzZWVraW5nJywgdGVsZW1ldHJ5RXZlbnQ6ICdEUkFHJyB9LCB7IHR5cGU6ICdmdWxsc2NyZWVuJywgdGVsZW1ldHJ5RXZlbnQ6ICdGVUxMU0NSRUVOJyB9LFxuICAgICAgeyB0eXBlOiAncmF0ZWNoYW5nZScsIHRlbGVtZXRyeUV2ZW50OiAnUkFURV9DSEFOR0UnIH1dO1xuICAgICAgZXZlbnRzLmZvckVhY2goZGF0YSA9PiB7XG4gICAgICAgIGlmIChldmVudC50eXBlID09PSBkYXRhLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChkYXRhLnRlbGVtZXRyeUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpUZWxlbWV0cnlFdmVudCcsIFsnJGV2ZW50J10pXG4gIG9uVGVsZW1ldHJ5RXZlbnQoZXZlbnQpIHtcbiAgICB0aGlzLnRlbGVtZXRyeUV2ZW50LmVtaXQoZXZlbnQuZGV0YWlsKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5pc1BhdXNlZCkge1xuICAgICAgICB0aGlzLnNob3dDb250cm9scyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sIDUwMDApO1xuXG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cbiAgICB0aGlzLm5leHRDb250ZW50ID0gdGhpcy5wbGF5ZXJDb25maWcuY29uZmlnLm5leHRDb250ZW50O1xuICAgIHRoaXMudHJhY2VJZCA9IHRoaXMucGxheWVyQ29uZmlnLmNvbmZpZ1sndHJhY2VJZCddO1xuICAgIHRoaXMuc2lkZU1lbnVDb25maWcgPSB7IC4uLnRoaXMuc2lkZU1lbnVDb25maWcsIC4uLnRoaXMucGxheWVyQ29uZmlnLmNvbmZpZy5zaWRlTWVudSB9O1xuICAgIHRoaXMudmlld2VyU2VydmljZS5pbml0aWFsaXplKHRoaXMucGxheWVyQ29uZmlnKTtcbiAgICB0aGlzLnZpZGVvUGxheWVyU2VydmljZS5pbml0aWFsaXplKHRoaXMucGxheWVyQ29uZmlnKTtcblxuXG4gIH1cblxuICBzaWRlYmFyTWVudUV2ZW50KGV2ZW50KSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnNpZGViYXJNZW51RXZlbnQuZW1pdChldmVudCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3QgdmlkZW9QbGF5ZXJFbGVtZW50ID0gdGhpcy52aWRlb1BsYXllclJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMudW5saXN0ZW5Nb3VzZU1vdmUgPSB0aGlzLnJlbmRlcmVyMi5saXN0ZW4odmlkZW9QbGF5ZXJFbGVtZW50LCAnbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93Q29udHJvbHMgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy51bmxpc3RlblRvdWNoU3RhcnQgPSB0aGlzLnJlbmRlcmVyMi5saXN0ZW4odmlkZW9QbGF5ZXJFbGVtZW50LCAndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0NvbnRyb2xzID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGNvbnRlbnRDb21wYWJpbGl0eUxldmVsID0gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGFbJ2NvbXBhdGliaWxpdHlMZXZlbCddO1xuICAgIGlmIChjb250ZW50Q29tcGFiaWxpdHlMZXZlbCkge1xuICAgICAgY29uc3QgY2hlY2tDb250ZW50Q29tcGF0aWJsZSA9IHRoaXMuZXJyb3JTZXJ2aWNlLmNoZWNrQ29udGVudENvbXBhdGliaWxpdHkoY29udGVudENvbXBhYmlsaXR5TGV2ZWwpO1xuICAgICAgaWYgKCFjaGVja0NvbnRlbnRDb21wYXRpYmxlWydpc0NvbXBpdGFibGUnXSkge1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VFeGNlcHRpb25Mb2coZXJyb3JDb2RlLmNvbnRlbnRDb21wYXRpYmlsaXR5LCBlcnJvck1lc3NhZ2UuY29udGVudENvbXBhdGliaWxpdHksIGNoZWNrQ29udGVudENvbXBhdGlibGVbJ2Vycm9yJ11bJ21lc3NhZ2UnXSwgdGhpcy50cmFjZUlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaWRlQmFyRXZlbnRzKGV2ZW50KSB7XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGV2ZW50KTtcbiAgICBpZiAoZXZlbnQgPT09ICdET1dOTE9BRCcpIHtcbiAgICAgIHRoaXMuZG93bmxvYWRWaWRlbygpO1xuICAgIH1cbiAgICBjb25zdCBldmVudHMgPSBbJ1NIQVJFJywgJ0RPV05MT0FEX01FTlUnLCAnRVhJVCcsICdDTE9TRV9NRU5VJ107XG4gICAgZXZlbnRzLmZvckVhY2goZGF0YSA9PiB7XG4gICAgICBpZiAoZXZlbnQgPT09IGRhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQgPT09ICdFWElUJykge1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2Uuc2lkZWJhck1lbnVFdmVudC5lbWl0KCdDTE9TRV9NRU5VJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwbGF5Q29udGVudChldmVudCl7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnQudHlwZSk7XG4gIH1cblxuICByZXBsYXlDb250ZW50KGV2ZW50KSB7XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGV2ZW50KTtcbiAgICB0aGlzLnZpZXdTdGF0ZSA9ICdwbGF5ZXInO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KCdSRVBMQVknKTtcbiAgfVxuXG4gIGV4aXRDb250ZW50KGV2ZW50KSB7XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGV2ZW50KTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnRVhJVCcpO1xuICB9XG5cbiAgZG93bmxvYWRWaWRlbygpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuaHJlZiA9IHRoaXMudmlld2VyU2VydmljZS5hcnRpZmFjdFVybDtcbiAgICBhLmRvd25sb2FkID0gdGhpcy52aWV3ZXJTZXJ2aWNlLmNvbnRlbnROYW1lO1xuICAgIGEudGFyZ2V0ID0gJ19ibGFuayc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICBhLmNsaWNrKCk7XG4gICAgYS5yZW1vdmUoKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnRE9XTkxPQUQnKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpiZWZvcmV1bmxvYWQnKVxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VFbmRFdmVudCgpO1xuICAgIHRoaXMudW5saXN0ZW5Ub3VjaFN0YXJ0KCk7XG4gICAgdGhpcy51bmxpc3Rlbk1vdXNlTW92ZSgpO1xuICB9XG59XG4iXX0=