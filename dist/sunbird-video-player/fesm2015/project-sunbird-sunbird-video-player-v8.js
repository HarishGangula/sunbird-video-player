import { Injectable, ɵɵdefineInjectable, ɵɵinject, EventEmitter, Component, ChangeDetectorRef, Renderer2, Input, Output, ViewChild, HostListener, ViewEncapsulation, NgModule } from '@angular/core';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { errorCode, errorMessage, ErrorService, SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v8';
import 'rxjs';
import { __awaiter } from 'tslib';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UtilService {
    /**
     * @param {?=} length
     * @return {?}
     */
    uniqueId(length = 32) {
        /** @type {?} */
        let result = '';
        /** @type {?} */
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /** @type {?} */
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     * @param {?} duration
     * @return {?}
     */
    getTimeSpentText(duration) {
        /** @type {?} */
        const minutes = Math.floor(duration / 60000);
        /** @type {?} */
        const seconds = Number(((duration % 60000) / 1000).toFixed(0));
        return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    }
}
UtilService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */ UtilService.ngInjectableDef = ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SunbirdVideoPlayerService {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.contentSessionId = this.utilService.uniqueId();
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    initialize({ context, config, metadata }) {
        this.context = context;
        this.config = config;
        this.playSessionId = this.utilService.uniqueId();
        if (!CsTelemetryModule.instance.isInitialised) {
            CsTelemetryModule.instance.init({});
            CsTelemetryModule.instance.telemetryService.initTelemetry({
                config: {
                    pdata: context.pdata,
                    env: 'ContentPlayer',
                    channel: context.channel,
                    did: context.did,
                    authtoken: context.authToken || '',
                    uid: context.uid || '',
                    sid: context.sid,
                    batchsize: 20,
                    mode: context.mode,
                    host: context.host || '',
                    endpoint: context.endpoint || '/data/v3/telemetry',
                    tags: context.tags,
                    cdata: [{ id: this.contentSessionId, type: 'ContentSession' },
                        { id: this.playSessionId, type: 'PlaySession' }]
                },
                userOrgDetails: {}
            });
        }
        this.telemetryObject = {
            id: metadata.identifier,
            type: 'Content',
            ver: metadata.pkgVersion + '',
            rollup: context.objectRollup || {}
        };
    }
    /**
     * @param {?} duration
     * @return {?}
     */
    start(duration) {
        CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
        });
    }
    /**
     * @param {?} duration
     * @param {?} totallength
     * @param {?} currentlength
     * @param {?} endpageseen
     * @param {?} totalseekedlength
     * @param {?} visitedlength
     * @return {?}
     */
    end(duration, totallength, currentlength, endpageseen, totalseekedlength, visitedlength) {
        /** @type {?} */
        const durationSec = Number((duration / 1e3).toFixed(2));
        CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
            edata: {
                type: 'content',
                mode: 'play',
                pageid: 'sunbird-player-Endpage',
                summary: [
                    {
                        progress: Number(((currentlength / totallength) * 100).toFixed(0))
                    },
                    {
                        totallength
                    },
                    {
                        visitedlength
                    },
                    {
                        visitedcontentend: (totallength === currentlength)
                    },
                    {
                        totalseekedlength
                    },
                    {
                        endpageseen
                    }
                ],
                duration: durationSec
            },
            options: this.getEventOptions()
        });
    }
    /**
     * @param {?} id
     * @param {?} currentPage
     * @return {?}
     */
    interact(id, currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'TOUCH', subtype: '', id, pageid: currentPage + '' }
        });
    }
    /**
     * @param {?} data
     * @return {?}
     */
    heartBeat(data) {
        CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
    }
    /**
     * @param {?} currentPage
     * @return {?}
     */
    impression(currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
        });
    }
    /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?=} stacktrace
     * @return {?}
     */
    error(errorCode, errorType, stacktrace) {
        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
            options: this.getEventOptions(),
            edata: {
                err: errorCode,
                errtype: errorType,
                stacktrace: (stacktrace && stacktrace.toString()) || ''
            }
        });
    }
    /**
     * @private
     * @return {?}
     */
    getEventOptions() {
        return ({
            object: this.telemetryObject,
            context: {
                channel: this.context.channel,
                pdata: this.context.pdata,
                env: 'ContentPlayer',
                sid: this.context.sid,
                uid: this.context.uid,
                cdata: [{ id: this.contentSessionId, type: 'ContentSession' },
                    { id: this.playSessionId, type: 'PlaySession' }],
                rollup: this.context.contextRollup || {}
            }
        });
    }
}
SunbirdVideoPlayerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
SunbirdVideoPlayerService.ctorParameters = () => [
    { type: UtilService }
];
/** @nocollapse */ SunbirdVideoPlayerService.ngInjectableDef = ɵɵdefineInjectable({ factory: function SunbirdVideoPlayerService_Factory() { return new SunbirdVideoPlayerService(ɵɵinject(UtilService)); }, token: SunbirdVideoPlayerService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerService.prototype.contentSessionId;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerService.prototype.playSessionId;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerService.prototype.telemetryObject;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerService.prototype.context;
    /** @type {?} */
    SunbirdVideoPlayerService.prototype.config;
    /**
     * @type {?}
     * @private
     */
    SunbirdVideoPlayerService.prototype.utilService;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ViewerService {
    /**
     * @param {?} videoPlayerService
     * @param {?} utilService
     * @param {?} http
     */
    constructor(videoPlayerService, utilService, http) {
        this.videoPlayerService = videoPlayerService;
        this.utilService = utilService;
        this.http = http;
        this.endPageSeen = false;
        this.timeSpent = '0:0';
        this.version = '1.0';
        this.playerEvent = new EventEmitter();
        this.sidebarMenuEvent = new EventEmitter();
        this.isAvailableLocally = false;
        this.PlayerLoadStartedAt = new Date().getTime();
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    initialize({ context, config, metadata }) {
        this.contentName = metadata.name;
        this.streamingUrl = metadata.streamingUrl;
        this.artifactUrl = metadata.artifactUrl;
        this.mimeType = metadata.streamingUrl ? 'application/x-mpegURL' : metadata.mimeType;
        this.artifactMimeType = metadata.mimeType;
        this.isAvailableLocally = metadata.isAvailableLocally;
        this.traceId = config.traceId;
        this.markers = config.markers;
        if (context.userData) {
            const { userData: { firstName, lastName } } = context;
            this.userName = firstName === lastName ? firstName : `${firstName} ${lastName}`;
        }
        this.metaData = {
            actions: [],
            volume: [],
            playBackSpeeds: [],
            totalDuration: 0
        };
        this.showDownloadPopup = false;
        this.endPageSeen = false;
    }
    /**
     * @return {?}
     */
    getPlayerOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.streamingUrl) {
                return [{ src: this.artifactUrl, type: this.artifactMimeType }];
            }
            else {
                /** @type {?} */
                const data = yield this.http.head(this.streamingUrl, { responseType: 'blob' }).toPromise().catch((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => {
                    this.raiseExceptionLog(errorCode.streamingUrlSupport, errorMessage.streamingUrlSupport, new Error(`Streaming Url Not Supported  ${this.streamingUrl}`), this.traceId);
                }));
                if (data) {
                    return [{ src: this.streamingUrl, type: this.mimeType }];
                }
                else {
                    return [{ src: this.artifactUrl, type: this.artifactMimeType }];
                }
            }
        });
    }
    /**
     * @return {?}
     */
    getMarkers() {
        return this.markers;
    }
    /**
     * @return {?}
     */
    pageSessionUpdate() {
    }
    /**
     * @param {?} event
     * @return {?}
     */
    raiseStartEvent(event) {
        /** @type {?} */
        const duration = new Date().getTime() - this.PlayerLoadStartedAt;
        /** @type {?} */
        const startEvent = {
            eid: 'START',
            ver: this.version,
            edata: {
                type: 'START',
                mode: 'play',
                duration
            },
            metaData: this.metaData
        };
        this.playerEvent.emit(startEvent);
        this.videoPlayerService.start(duration);
        this.PlayerLoadStartedAt = new Date().getTime();
    }
    /**
     * @return {?}
     */
    raiseEndEvent() {
        /** @type {?} */
        const duration = new Date().getTime() - this.PlayerLoadStartedAt;
        /** @type {?} */
        const endEvent = {
            eid: 'END',
            ver: this.version,
            edata: {
                type: 'END',
                currentTime: this.currentlength,
                totalTime: this.totalLength,
                duration
            },
            metaData: this.metaData
        };
        this.playerEvent.emit(endEvent);
        this.timeSpent = this.utilService.getTimeSpentText(this.visitedLength);
        this.videoPlayerService.end(duration, this.totalLength, this.currentlength, this.endPageSeen, this.totalSeekedLength, this.visitedLength / 1000);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    raiseHeartBeatEvent(type) {
        /** @type {?} */
        const hearBeatEvent = {
            eid: 'HEARTBEAT',
            ver: this.version,
            edata: {
                type,
                currentPage: 'videostage'
            },
            metaData: this.metaData
        };
        this.playerEvent.emit(hearBeatEvent);
        this.videoPlayerService.heartBeat(hearBeatEvent);
        /** @type {?} */
        const interactItems = ['PLAY', 'PAUSE', 'EXIT', 'VOLUME_CHANGE', 'DRAG',
            'RATE_CHANGE', 'CLOSE_DOWNLOAD', 'DOWNLOAD', 'NAVIGATE_TO_PAGE',
            'NEXT', 'OPEN_MENU', 'PREVIOUS', 'CLOSE_MENU', 'DOWNLOAD_MENU',
            'SHARE', 'REPLAY', 'FORWARD', 'BACKWARD', 'FULLSCREEN', 'NEXT_CONTENT_PLAY'
        ];
        if (interactItems.includes(type)) {
            this.videoPlayerService.interact(type.toLowerCase(), 'videostage');
        }
    }
    /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?} stacktrace
     * @param {?} traceId
     * @return {?}
     */
    raiseExceptionLog(errorCode, errorType, stacktrace, traceId) {
        /** @type {?} */
        const exceptionLogEvent = {
            eid: 'ERROR',
            edata: {
                err: errorCode,
                errtype: errorType,
                requestid: traceId || '',
                stacktrace: (stacktrace && stacktrace.toString()) || '',
            }
        };
        this.playerEvent.emit(exceptionLogEvent);
        this.videoPlayerService.error(errorCode, errorType, stacktrace);
    }
}
ViewerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
ViewerService.ctorParameters = () => [
    { type: SunbirdVideoPlayerService },
    { type: UtilService },
    { type: HttpClient }
];
/** @nocollapse */ ViewerService.ngInjectableDef = ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(ɵɵinject(SunbirdVideoPlayerService), ɵɵinject(UtilService), ɵɵinject(HttpClient)); }, token: ViewerService, providedIn: "root" });
if (false) {
    /** @type {?} */
    ViewerService.prototype.endPageSeen;
    /** @type {?} */
    ViewerService.prototype.timeSpent;
    /**
     * @type {?}
     * @private
     */
    ViewerService.prototype.version;
    /** @type {?} */
    ViewerService.prototype.playerEvent;
    /** @type {?} */
    ViewerService.prototype.contentName;
    /** @type {?} */
    ViewerService.prototype.showDownloadPopup;
    /** @type {?} */
    ViewerService.prototype.streamingUrl;
    /** @type {?} */
    ViewerService.prototype.mimeType;
    /** @type {?} */
    ViewerService.prototype.artifactMimeType;
    /** @type {?} */
    ViewerService.prototype.userName;
    /** @type {?} */
    ViewerService.prototype.metaData;
    /** @type {?} */
    ViewerService.prototype.PlayerLoadStartedAt;
    /** @type {?} */
    ViewerService.prototype.totalLength;
    /** @type {?} */
    ViewerService.prototype.currentlength;
    /** @type {?} */
    ViewerService.prototype.totalSeekedLength;
    /** @type {?} */
    ViewerService.prototype.artifactUrl;
    /** @type {?} */
    ViewerService.prototype.visitedLength;
    /** @type {?} */
    ViewerService.prototype.sidebarMenuEvent;
    /** @type {?} */
    ViewerService.prototype.traceId;
    /** @type {?} */
    ViewerService.prototype.isAvailableLocally;
    /**
     * @type {?}
     * @private
     */
    ViewerService.prototype.markers;
    /**
     * @type {?}
     * @private
     */
    ViewerService.prototype.videoPlayerService;
    /**
     * @type {?}
     * @private
     */
    ViewerService.prototype.utilService;
    /**
     * @type {?}
     * @private
     */
    ViewerService.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SunbirdVideoPlayerComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class VideoPlayerComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SunbirdVideoPlayerModule {
}
SunbirdVideoPlayerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SunbirdVideoPlayerComponent, VideoPlayerComponent],
                imports: [
                    CommonModule,
                    FormsModule,
                    HttpClientModule,
                    SunbirdPlayerSdkModule
                ],
                exports: [SunbirdVideoPlayerComponent, SunbirdPlayerSdkModule]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { SunbirdVideoPlayerComponent, SunbirdVideoPlayerModule, SunbirdVideoPlayerService, UtilService as ɵa, ViewerService as ɵb, VideoPlayerComponent as ɵc };
//# sourceMappingURL=project-sunbird-sunbird-video-player-v8.js.map
