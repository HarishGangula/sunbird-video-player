/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { UtilService } from './services/util.service';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import * as i0 from "@angular/core";
import * as i1 from "./services/util.service";
var SunbirdVideoPlayerService = /** @class */ (function () {
    function SunbirdVideoPlayerService(utilService) {
        this.utilService = utilService;
        this.contentSessionId = this.utilService.uniqueId();
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.initialize = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var context = _a.context, config = _a.config, metadata = _a.metadata;
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
    };
    /**
     * @param {?} duration
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.start = /**
     * @param {?} duration
     * @return {?}
     */
    function (duration) {
        CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
        });
    };
    /**
     * @param {?} duration
     * @param {?} totallength
     * @param {?} currentlength
     * @param {?} endpageseen
     * @param {?} totalseekedlength
     * @param {?} visitedlength
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.end = /**
     * @param {?} duration
     * @param {?} totallength
     * @param {?} currentlength
     * @param {?} endpageseen
     * @param {?} totalseekedlength
     * @param {?} visitedlength
     * @return {?}
     */
    function (duration, totallength, currentlength, endpageseen, totalseekedlength, visitedlength) {
        /** @type {?} */
        var durationSec = Number((duration / 1e3).toFixed(2));
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
                        totallength: totallength
                    },
                    {
                        visitedlength: visitedlength
                    },
                    {
                        visitedcontentend: (totallength === currentlength)
                    },
                    {
                        totalseekedlength: totalseekedlength
                    },
                    {
                        endpageseen: endpageseen
                    }
                ],
                duration: durationSec
            },
            options: this.getEventOptions()
        });
    };
    /**
     * @param {?} id
     * @param {?} currentPage
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.interact = /**
     * @param {?} id
     * @param {?} currentPage
     * @return {?}
     */
    function (id, currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'TOUCH', subtype: '', id: id, pageid: currentPage + '' }
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.heartBeat = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
    };
    /**
     * @param {?} currentPage
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.impression = /**
     * @param {?} currentPage
     * @return {?}
     */
    function (currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
        });
    };
    /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?=} stacktrace
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.error = /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?=} stacktrace
     * @return {?}
     */
    function (errorCode, errorType, stacktrace) {
        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
            options: this.getEventOptions(),
            edata: {
                err: errorCode,
                errtype: errorType,
                stacktrace: (stacktrace && stacktrace.toString()) || ''
            }
        });
    };
    /**
     * @private
     * @return {?}
     */
    SunbirdVideoPlayerService.prototype.getEventOptions = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    SunbirdVideoPlayerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    SunbirdVideoPlayerService.ctorParameters = function () { return [
        { type: UtilService }
    ]; };
    /** @nocollapse */ SunbirdVideoPlayerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SunbirdVideoPlayerService_Factory() { return new SunbirdVideoPlayerService(i0.ɵɵinject(i1.UtilService)); }, token: SunbirdVideoPlayerService, providedIn: "root" });
    return SunbirdVideoPlayerService;
}());
export { SunbirdVideoPlayerService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC12aWRlby1wbGF5ZXItdjgvIiwic291cmNlcyI6WyJsaWIvc3VuYmlyZC12aWRlby1wbGF5ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNENBQTRDLENBQUM7OztBQUUvRTtJQVdFLG1DQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUMxQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0RCxDQUFDOzs7OztJQUVNLDhDQUFVOzs7O0lBQWpCLFVBQWtCLEVBQTJDO1lBQXpDLG9CQUFPLEVBQUUsa0JBQU0sRUFBRSxzQkFBUTtRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDN0MsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUN2RDtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO29CQUNwQixHQUFHLEVBQUUsZUFBZTtvQkFDcEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxP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LENBQUM7WUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDNUIsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Z0JBQzdCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0JBQ3pCLEdBQUcsRUFBRSxlQUFlO2dCQUNwQixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNyQixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUNyQixLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO29CQUM3RCxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQztnQkFDaEQsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLEVBQUU7YUFDekM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDOztnQkE3SUYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFMUSxXQUFXOzs7b0NBRnBCO0NBbUpDLEFBOUlELElBOElDO1NBM0lZLHlCQUF5Qjs7Ozs7O0lBRXBDLHFEQUFpQzs7Ozs7SUFDakMsa0RBQThCOzs7OztJQUM5QixvREFBNkI7Ozs7O0lBQzdCLDRDQUFnQjs7SUFDaEIsMkNBQWM7Ozs7O0lBRUYsZ0RBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGxheWVyQ29uZmlnIH0gZnJvbSAnLi9wbGF5ZXJJbnRlcmZhY2VzJztcbmltcG9ydCB7IFV0aWxTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy91dGlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3NUZWxlbWV0cnlNb2R1bGUgfSBmcm9tICdAcHJvamVjdC1zdW5iaXJkL2NsaWVudC1zZXJ2aWNlcy90ZWxlbWV0cnknO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTdW5iaXJkVmlkZW9QbGF5ZXJTZXJ2aWNlIHtcblxuICBwcml2YXRlIGNvbnRlbnRTZXNzaW9uSWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBwbGF5U2Vzc2lvbklkOiBzdHJpbmc7XG4gIHByaXZhdGUgdGVsZW1ldHJ5T2JqZWN0OiBhbnk7XG4gIHByaXZhdGUgY29udGV4dDtcbiAgcHVibGljIGNvbmZpZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHV0aWxTZXJ2aWNlOiBVdGlsU2VydmljZSkge1xuICAgIHRoaXMuY29udGVudFNlc3Npb25JZCA9IHRoaXMudXRpbFNlcnZpY2UudW5pcXVlSWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKHsgY29udGV4dCwgY29uZmlnLCBtZXRhZGF0YSB9OiBQbGF5ZXJDb25maWcpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucGxheVNlc3Npb25JZCA9IHRoaXMudXRpbFNlcnZpY2UudW5pcXVlSWQoKTtcblxuICAgIGlmICghQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UuaXNJbml0aWFsaXNlZCkge1xuICAgICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UuaW5pdCh7fSk7XG4gICAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLmluaXRUZWxlbWV0cnkoXG4gICAgICAgIHtcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHBkYXRhOiBjb250ZXh0LnBkYXRhLFxuICAgICAgICAgICAgZW52OiAnQ29udGVudFBsYXllcicsXG4gICAgICAgICAgICBjaGFubmVsOiBjb250ZXh0LmNoYW5uZWwsXG4gICAgICAgICAgICBkaWQ6IGNvbnRleHQuZGlkLFxuICAgICAgICAgICAgYXV0aHRva2VuOiBjb250ZXh0LmF1dGhUb2tlbiB8fCAnJyxcbiAgICAgICAgICAgIHVpZDogY29udGV4dC51aWQgfHwgJycsXG4gICAgICAgICAgICBzaWQ6IGNvbnRleHQuc2lkLFxuICAgICAgICAgICAgYmF0Y2hzaXplOiAyMCxcbiAgICAgICAgICAgIG1vZGU6IGNvbnRleHQubW9kZSxcbiAgICAgICAgICAgIGhvc3Q6IGNvbnRleHQuaG9zdCB8fCAnJyxcbiAgICAgICAgICAgIGVuZHBvaW50OiBjb250ZXh0LmVuZHBvaW50IHx8ICcvZGF0YS92My90ZWxlbWV0cnknLFxuICAgICAgICAgICAgdGFnczogY29udGV4dC50YWdzLFxuICAgICAgICAgICAgY2RhdGE6IFt7IGlkOiB0aGlzLmNvbnRlbnRTZXNzaW9uSWQsIHR5cGU6ICdDb250ZW50U2Vzc2lvbicgfSxcbiAgICAgICAgICAgIHsgaWQ6IHRoaXMucGxheVNlc3Npb25JZCwgdHlwZTogJ1BsYXlTZXNzaW9uJyB9XVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXNlck9yZ0RldGFpbHM6IHt9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy50ZWxlbWV0cnlPYmplY3QgPSB7XG4gICAgICBpZDogbWV0YWRhdGEuaWRlbnRpZmllcixcbiAgICAgIHR5cGU6ICdDb250ZW50JyxcbiAgICAgIHZlcjogbWV0YWRhdGEucGtnVmVyc2lvbiArICcnLFxuICAgICAgcm9sbHVwOiBjb250ZXh0Lm9iamVjdFJvbGx1cCB8fCB7fVxuICAgIH07XG4gIH1cblxuXG4gIHB1YmxpYyBzdGFydChkdXJhdGlvbikge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VTdGFydFRlbGVtZXRyeShcbiAgICAgIHtcbiAgICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKSxcbiAgICAgICAgZWRhdGE6IHsgdHlwZTogJ2NvbnRlbnQnLCBtb2RlOiAncGxheScsIHBhZ2VpZDogJycsIGR1cmF0aW9uOiBOdW1iZXIoKGR1cmF0aW9uIC8gMWUzKS50b0ZpeGVkKDIpKSB9XG4gICAgICB9XG4gICAgKTtcblxuICB9XG5cbiAgcHVibGljIGVuZChkdXJhdGlvbiwgdG90YWxsZW5ndGgsIGN1cnJlbnRsZW5ndGgsIGVuZHBhZ2VzZWVuLCB0b3RhbHNlZWtlZGxlbmd0aCwgdmlzaXRlZGxlbmd0aCkge1xuICAgIGNvbnN0IGR1cmF0aW9uU2VjID0gTnVtYmVyKChkdXJhdGlvbiAvIDFlMykudG9GaXhlZCgyKSk7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUVuZFRlbGVtZXRyeSh7XG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnY29udGVudCcsXG4gICAgICAgIG1vZGU6ICdwbGF5JyxcbiAgICAgICAgcGFnZWlkOiAnc3VuYmlyZC1wbGF5ZXItRW5kcGFnZScsXG4gICAgICAgIHN1bW1hcnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwcm9ncmVzczogTnVtYmVyKCgoY3VycmVudGxlbmd0aCAvIHRvdGFsbGVuZ3RoKSAqIDEwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRvdGFsbGVuZ3RoXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2aXNpdGVkbGVuZ3RoXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2aXNpdGVkY29udGVudGVuZDogKHRvdGFsbGVuZ3RoID09PSBjdXJyZW50bGVuZ3RoKVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG90YWxzZWVrZWRsZW5ndGhcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVuZHBhZ2VzZWVuXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25TZWNcbiAgICAgIH0sXG4gICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpXG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBpbnRlcmFjdChpZCwgY3VycmVudFBhZ2UpIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlSW50ZXJhY3RUZWxlbWV0cnkoe1xuICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKSxcbiAgICAgIGVkYXRhOiB7IHR5cGU6ICdUT1VDSCcsIHN1YnR5cGU6ICcnLCBpZCwgcGFnZWlkOiBjdXJyZW50UGFnZSArICcnIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBoZWFydEJlYXQoZGF0YSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnBsYXllclRlbGVtZXRyeVNlcnZpY2Uub25IZWFydEJlYXRFdmVudChkYXRhLCB7fSk7XG4gIH1cblxuICBwdWJsaWMgaW1wcmVzc2lvbihjdXJyZW50UGFnZSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VJbXByZXNzaW9uVGVsZW1ldHJ5KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICBlZGF0YTogeyB0eXBlOiAnd29ya2Zsb3cnLCBzdWJ0eXBlOiAnJywgcGFnZWlkOiBjdXJyZW50UGFnZSArICcnLCB1cmk6ICcnIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihlcnJvckNvZGU6IHN0cmluZyAsIGVycm9yVHlwZTpzdHJpbmcgLCAgc3RhY2t0cmFjZT86RXJyb3IpIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlRXJyb3JUZWxlbWV0cnkoe1xuICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKSxcbiAgICAgIGVkYXRhOiB7XG4gICAgICAgIGVycjogZXJyb3JDb2RlLFxuICAgICAgICBlcnJ0eXBlOiBlcnJvclR5cGUsXG4gICAgICAgIHN0YWNrdHJhY2U6IChzdGFja3RyYWNlICYmIHN0YWNrdHJhY2UudG9TdHJpbmcoKSkgfHwgJydcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXZlbnRPcHRpb25zKCkge1xuICAgIHJldHVybiAoe1xuICAgICAgb2JqZWN0OiB0aGlzLnRlbGVtZXRyeU9iamVjdCxcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jb250ZXh0LmNoYW5uZWwsXG4gICAgICAgIHBkYXRhOiB0aGlzLmNvbnRleHQucGRhdGEsXG4gICAgICAgIGVudjogJ0NvbnRlbnRQbGF5ZXInLFxuICAgICAgICBzaWQ6IHRoaXMuY29udGV4dC5zaWQsXG4gICAgICAgIHVpZDogdGhpcy5jb250ZXh0LnVpZCxcbiAgICAgICAgY2RhdGE6IFt7IGlkOiB0aGlzLmNvbnRlbnRTZXNzaW9uSWQsIHR5cGU6ICdDb250ZW50U2Vzc2lvbicgfSxcbiAgICAgICAgeyBpZDogdGhpcy5wbGF5U2Vzc2lvbklkLCB0eXBlOiAnUGxheVNlc3Npb24nIH1dLFxuICAgICAgICByb2xsdXA6IHRoaXMuY29udGV4dC5jb250ZXh0Um9sbHVwIHx8IHt9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==