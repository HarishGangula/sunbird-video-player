/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { SunbirdVideoPlayerService } from '../sunbird-video-player.service';
import { UtilService } from './util.service';
import { errorCode, errorMessage } from '@project-sunbird/sunbird-player-sdk-v8';
import * as i0 from "@angular/core";
import * as i1 from "../sunbird-video-player.service";
import * as i2 from "./util.service";
import * as i3 from "@angular/common/http";
export class ViewerService {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
/** @nocollapse */ ViewerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(i0.ɵɵinject(i1.SunbirdVideoPlayerService), i0.ɵɵinject(i2.UtilService), i0.ɵɵinject(i3.HttpClient)); }, token: ViewerService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtdmlkZW8tcGxheWVyLXY4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3ZpZXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFHLFlBQVksRUFBRSxNQUFNLHdDQUF3QyxDQUFDOzs7OztBQUtsRixNQUFNLE9BQU8sYUFBYTs7Ozs7O0lBeUJ4QixZQUFvQixrQkFBNkMsRUFDdkQsV0FBd0IsRUFDeEIsSUFBZ0I7UUFGTix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQTJCO1FBQ3ZELGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFNBQUksR0FBSixJQUFJLENBQVk7UUF6Qm5CLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDakIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNqQixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFjdEMscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUUzQyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFPaEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEQsQ0FBQzs7Ozs7SUFFRCxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBZ0I7UUFDcEQsSUFBSSxDQUFDLFdBQVcs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LElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUcsU0FBUyxFQUFHLFVBQVUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7OztZQXpKRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFOUSx5QkFBeUI7WUFDekIsV0FBVztZQUpYLFVBQVU7Ozs7O0lBWWpCLG9DQUEyQjs7SUFDM0Isa0NBQXlCOzs7OztJQUN6QixnQ0FBd0I7O0lBQ3hCLG9DQUE2Qzs7SUFDN0Msb0NBQTJCOztJQUMzQiwwQ0FBa0M7O0lBQ2xDLHFDQUE0Qjs7SUFDNUIsaUNBQXdCOztJQUN4Qix5Q0FBZ0M7O0lBQ2hDLGlDQUF3Qjs7SUFDeEIsaUNBQXFCOztJQUNyQiw0Q0FBbUM7O0lBQ25DLG9DQUFtQjs7SUFDbkIsc0NBQXFCOztJQUNyQiwwQ0FBeUI7O0lBQ3pCLG9DQUFtQjs7SUFDbkIsc0NBQXFCOztJQUNyQix5Q0FBa0Q7O0lBQ2xELGdDQUF1Qjs7SUFDdkIsMkNBQWtDOzs7OztJQUNsQyxnQ0FBcUI7Ozs7O0lBR1QsMkNBQXFEOzs7OztJQUMvRCxvQ0FBZ0M7Ozs7O0lBQ2hDLDZCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsYXllckNvbmZpZyB9IGZyb20gJy4uL3BsYXllckludGVyZmFjZXMnO1xuaW1wb3J0IHsgU3VuYmlyZFZpZGVvUGxheWVyU2VydmljZSB9IGZyb20gJy4uL3N1bmJpcmQtdmlkZW8tcGxheWVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXRpbFNlcnZpY2UgfSBmcm9tICcuL3V0aWwuc2VydmljZSc7XG5pbXBvcnQgeyBlcnJvckNvZGUgLCBlcnJvck1lc3NhZ2UgfSBmcm9tICdAcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcGxheWVyLXNkay12OCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdlclNlcnZpY2Uge1xuXG4gIHB1YmxpYyBlbmRQYWdlU2VlbiA9IGZhbHNlO1xuICBwdWJsaWMgdGltZVNwZW50ID0gJzA6MCc7XG4gIHByaXZhdGUgdmVyc2lvbiA9ICcxLjAnO1xuICBwdWJsaWMgcGxheWVyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIGNvbnRlbnROYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBzaG93RG93bmxvYWRQb3B1cDogYm9vbGVhbjtcbiAgcHVibGljIHN0cmVhbWluZ1VybDogc3RyaW5nO1xuICBwdWJsaWMgbWltZVR5cGU6IHN0cmluZztcbiAgcHVibGljIGFydGlmYWN0TWltZVR5cGU6IHN0cmluZztcbiAgcHVibGljIHVzZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBtZXRhRGF0YTogYW55O1xuICBwdWJsaWMgUGxheWVyTG9hZFN0YXJ0ZWRBdDogbnVtYmVyO1xuICBwdWJsaWMgdG90YWxMZW5ndGg7XG4gIHB1YmxpYyBjdXJyZW50bGVuZ3RoO1xuICBwdWJsaWMgdG90YWxTZWVrZWRMZW5ndGg7XG4gIHB1YmxpYyBhcnRpZmFjdFVybDtcbiAgcHVibGljIHZpc2l0ZWRMZW5ndGg7XG4gIHB1YmxpYyBzaWRlYmFyTWVudUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyB0cmFjZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyBpc0F2YWlsYWJsZUxvY2FsbHkgPSBmYWxzZTtcbiAgcHJpdmF0ZSBtYXJrZXJzOiBhbnk7XG5cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZpZGVvUGxheWVyU2VydmljZTogU3VuYmlyZFZpZGVvUGxheWVyU2VydmljZSxcbiAgICBwcml2YXRlIHV0aWxTZXJ2aWNlOiBVdGlsU2VydmljZSxcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcbiAgICB0aGlzLlBsYXllckxvYWRTdGFydGVkQXQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoeyBjb250ZXh0LCBjb25maWcsIG1ldGFkYXRhIH06IFBsYXllckNvbmZpZykge1xuICAgIHRoaXMuY29udGVudE5hbWUgPSBtZXRhZGF0YS5uYW1lO1xuICAgIHRoaXMuc3RyZWFtaW5nVXJsID0gbWV0YWRhdGEuc3RyZWFtaW5nVXJsO1xuICAgIHRoaXMuYXJ0aWZhY3RVcmwgPSBtZXRhZGF0YS5hcnRpZmFjdFVybDtcbiAgICB0aGlzLm1pbWVUeXBlID0gbWV0YWRhdGEuc3RyZWFtaW5nVXJsID8gJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTCcgOiBtZXRhZGF0YS5taW1lVHlwZTtcbiAgICB0aGlzLmFydGlmYWN0TWltZVR5cGUgPSBtZXRhZGF0YS5taW1lVHlwZTtcbiAgICB0aGlzLmlzQXZhaWxhYmxlTG9jYWxseSA9IG1ldGFkYXRhLmlzQXZhaWxhYmxlTG9jYWxseTtcbiAgICB0aGlzLnRyYWNlSWQgPSBjb25maWcudHJhY2VJZDtcbiAgICB0aGlzLm1hcmtlcnMgPSBjb25maWcubWFya2VycztcbiAgICBpZiAoY29udGV4dC51c2VyRGF0YSkge1xuICAgICAgY29uc3QgeyB1c2VyRGF0YTogeyBmaXJzdE5hbWUsIGxhc3ROYW1lIH0gfSA9IGNvbnRleHQ7XG4gICAgICB0aGlzLnVzZXJOYW1lID0gZmlyc3ROYW1lID09PSBsYXN0TmFtZSA/IGZpcnN0TmFtZSA6IGAke2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gO1xuICAgIH1cbiAgICB0aGlzLm1ldGFEYXRhID0ge1xuICAgICAgYWN0aW9uczogW1xuICAgICAgXSxcbiAgICAgIHZvbHVtZTogW10sXG4gICAgICBwbGF5QmFja1NwZWVkczogW10sXG4gICAgICB0b3RhbER1cmF0aW9uOiAwXG4gICAgfTtcbiAgICB0aGlzLnNob3dEb3dubG9hZFBvcHVwID0gZmFsc2U7XG4gICAgdGhpcy5lbmRQYWdlU2VlbiA9IGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0UGxheWVyT3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuc3RyZWFtaW5nVXJsKSB7XG4gICAgICByZXR1cm4gW3sgc3JjOiB0aGlzLmFydGlmYWN0VXJsLCB0eXBlOiB0aGlzLmFydGlmYWN0TWltZVR5cGUgfV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmh0dHAuaGVhZCh0aGlzLnN0cmVhbWluZ1VybCwgeyByZXNwb25zZVR5cGU6ICdibG9iJyB9KS50b1Byb21pc2UoKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMucmFpc2VFeGNlcHRpb25Mb2coZXJyb3JDb2RlLnN0cmVhbWluZ1VybFN1cHBvcnQgLCBlcnJvck1lc3NhZ2Uuc3RyZWFtaW5nVXJsU3VwcG9ydCAsIG5ldyBFcnJvcihgU3RyZWFtaW5nIFVybCBOb3QgU3VwcG9ydGVkICAke3RoaXMuc3RyZWFtaW5nVXJsfWApLCB0aGlzLnRyYWNlSWQpO1xuICAgICAgfSk7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gW3sgc3JjOiB0aGlzLnN0cmVhbWluZ1VybCwgdHlwZTogdGhpcy5taW1lVHlwZSB9XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbeyBzcmM6IHRoaXMuYXJ0aWZhY3RVcmwsIHR5cGU6IHRoaXMuYXJ0aWZhY3RNaW1lVHlwZSB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0TWFya2VycygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJzO1xuICB9XG5cblxuICBwdWJsaWMgcGFnZVNlc3Npb25VcGRhdGUoKSB7XG5cbiAgfVxuXG4gIHJhaXNlU3RhcnRFdmVudChldmVudCkge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLlBsYXllckxvYWRTdGFydGVkQXQ7XG4gICAgY29uc3Qgc3RhcnRFdmVudCA9IHtcbiAgICAgIGVpZDogJ1NUQVJUJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZTogJ1NUQVJUJyxcbiAgICAgICAgbW9kZTogJ3BsYXknLFxuICAgICAgICBkdXJhdGlvblxuICAgICAgfSxcbiAgICAgIG1ldGFEYXRhOiB0aGlzLm1ldGFEYXRhXG4gICAgfTtcbiAgICB0aGlzLnBsYXllckV2ZW50LmVtaXQoc3RhcnRFdmVudCk7XG4gICAgdGhpcy52aWRlb1BsYXllclNlcnZpY2Uuc3RhcnQoZHVyYXRpb24pO1xuICAgIHRoaXMuUGxheWVyTG9hZFN0YXJ0ZWRBdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgcmFpc2VFbmRFdmVudCgpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5QbGF5ZXJMb2FkU3RhcnRlZEF0O1xuICAgIGNvbnN0IGVuZEV2ZW50ID0ge1xuICAgICAgZWlkOiAnRU5EJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZTogJ0VORCcsXG4gICAgICAgIGN1cnJlbnRUaW1lOiB0aGlzLmN1cnJlbnRsZW5ndGgsXG4gICAgICAgIHRvdGFsVGltZTogdGhpcy50b3RhbExlbmd0aCxcbiAgICAgICAgZHVyYXRpb25cbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGVuZEV2ZW50KTtcbiAgICB0aGlzLnRpbWVTcGVudCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VGltZVNwZW50VGV4dCh0aGlzLnZpc2l0ZWRMZW5ndGgpO1xuICAgIHRoaXMudmlkZW9QbGF5ZXJTZXJ2aWNlLmVuZChkdXJhdGlvbiwgdGhpcy50b3RhbExlbmd0aCwgdGhpcy5jdXJyZW50bGVuZ3RoLCB0aGlzLmVuZFBhZ2VTZWVuLCB0aGlzLnRvdGFsU2Vla2VkTGVuZ3RoLFxuICAgICAgdGhpcy52aXNpdGVkTGVuZ3RoIC8gMTAwMCk7XG4gIH1cblxuXG4gIHJhaXNlSGVhcnRCZWF0RXZlbnQodHlwZTogc3RyaW5nKSB7XG4gICAgY29uc3QgaGVhckJlYXRFdmVudCA9IHtcbiAgICAgIGVpZDogJ0hFQVJUQkVBVCcsXG4gICAgICB2ZXI6IHRoaXMudmVyc2lvbixcbiAgICAgIGVkYXRhOiB7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIGN1cnJlbnRQYWdlOiAndmlkZW9zdGFnZSdcbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGhlYXJCZWF0RXZlbnQpO1xuICAgIHRoaXMudmlkZW9QbGF5ZXJTZXJ2aWNlLmhlYXJ0QmVhdChoZWFyQmVhdEV2ZW50KTtcbiAgICBjb25zdCBpbnRlcmFjdEl0ZW1zID0gWydQTEFZJywgJ1BBVVNFJywgJ0VYSVQnLCAnVk9MVU1FX0NIQU5HRScsICdEUkFHJyxcbiAgICAgICdSQVRFX0NIQU5HRScsICdDTE9TRV9ET1dOTE9BRCcsICdET1dOTE9BRCcsICdOQVZJR0FURV9UT19QQUdFJyxcbiAgICAgICdORVhUJywgJ09QRU5fTUVOVScsICdQUkVWSU9VUycsICdDTE9TRV9NRU5VJywgJ0RPV05MT0FEX01FTlUnLFxuICAgICAgJ1NIQVJFJywgJ1JFUExBWScsICdGT1JXQVJEJywgJ0JBQ0tXQVJEJywgJ0ZVTExTQ1JFRU4nICwgJ05FWFRfQ09OVEVOVF9QTEFZJ1xuICAgIF07XG4gICAgaWYgKGludGVyYWN0SXRlbXMuaW5jbHVkZXModHlwZSkpIHtcbiAgICAgIHRoaXMudmlkZW9QbGF5ZXJTZXJ2aWNlLmludGVyYWN0KHR5cGUudG9Mb3dlckNhc2UoKSwgJ3ZpZGVvc3RhZ2UnKTtcbiAgICB9XG5cbiAgfVxuXG4gIHJhaXNlRXhjZXB0aW9uTG9nKGVycm9yQ29kZTogc3RyaW5nLCBlcnJvclR5cGU6IHN0cmluZywgc3RhY2t0cmFjZSwgdHJhY2VJZCkge1xuICAgIGNvbnN0IGV4Y2VwdGlvbkxvZ0V2ZW50ID0ge1xuICAgICAgZWlkOiAnRVJST1InLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgZXJyOiBlcnJvckNvZGUsXG4gICAgICAgIGVycnR5cGU6IGVycm9yVHlwZSxcbiAgICAgICAgcmVxdWVzdGlkOiB0cmFjZUlkIHx8ICcnLFxuICAgICAgICBzdGFja3RyYWNlOiAoc3RhY2t0cmFjZSAmJiBzdGFja3RyYWNlLnRvU3RyaW5nKCkpIHx8ICcnLFxuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGV4Y2VwdGlvbkxvZ0V2ZW50KTtcbiAgICB0aGlzLnZpZGVvUGxheWVyU2VydmljZS5lcnJvcihlcnJvckNvZGUgLCBlcnJvclR5cGUgLCBzdGFja3RyYWNlKTtcbiAgfVxuXG59XG4iXX0=