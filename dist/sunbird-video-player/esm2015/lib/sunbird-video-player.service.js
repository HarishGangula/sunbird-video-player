/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { UtilService } from './services/util.service';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import * as i0 from "@angular/core";
import * as i1 from "./services/util.service";
export class SunbirdVideoPlayerService {
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
/** @nocollapse */ SunbirdVideoPlayerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SunbirdVideoPlayerService_Factory() { return new SunbirdVideoPlayerService(i0.ɵɵinject(i1.UtilService)); }, token: SunbirdVideoPlayerService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC12aWRlby1wbGF5ZXItdjgvIiwic291cmNlcyI6WyJsaWIvc3VuYmlyZC12aWRlby1wbGF5ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNENBQTRDLENBQUM7OztBQUsvRSxNQUFNLE9BQU8seUJBQXlCOzs7O0lBUXBDLFlBQW9CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RELENBQUM7Ozs7O0lBRU0sVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQWdCO1FBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUM3QyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQ3ZEO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7b0JBQ3BCLEdBQUcsRUFBRSxlQUFlO29CQUNwQixPQUFPLEVBQUUsT0FBTyxD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N0IsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSztnQkFDekIsR0FBRyxFQUFFLGVBQWU7Z0JBQ3BCLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ3JCLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ3JCLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7b0JBQzdELEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDO2dCQUNoRCxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksRUFBRTthQUN6QztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTdJRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFMUSxXQUFXOzs7Ozs7OztJQVFsQixxREFBaUM7Ozs7O0lBQ2pDLGtEQUE4Qjs7Ozs7SUFDOUIsb0RBQTZCOzs7OztJQUM3Qiw0Q0FBZ0I7O0lBQ2hCLDJDQUFjOzs7OztJQUVGLGdEQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsYXllckNvbmZpZyB9IGZyb20gJy4vcGxheWVySW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBVdGlsU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvdXRpbC5zZXJ2aWNlJztcbmltcG9ydCB7IENzVGVsZW1ldHJ5TW9kdWxlIH0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9jbGllbnQtc2VydmljZXMvdGVsZW1ldHJ5JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU3VuYmlyZFZpZGVvUGxheWVyU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBjb250ZW50U2Vzc2lvbklkOiBzdHJpbmc7XG4gIHByaXZhdGUgcGxheVNlc3Npb25JZDogc3RyaW5nO1xuICBwcml2YXRlIHRlbGVtZXRyeU9iamVjdDogYW55O1xuICBwcml2YXRlIGNvbnRleHQ7XG4gIHB1YmxpYyBjb25maWc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB1dGlsU2VydmljZTogVXRpbFNlcnZpY2UpIHtcbiAgICB0aGlzLmNvbnRlbnRTZXNzaW9uSWQgPSB0aGlzLnV0aWxTZXJ2aWNlLnVuaXF1ZUlkKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSh7IGNvbnRleHQsIGNvbmZpZywgbWV0YWRhdGEgfTogUGxheWVyQ29uZmlnKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnBsYXlTZXNzaW9uSWQgPSB0aGlzLnV0aWxTZXJ2aWNlLnVuaXF1ZUlkKCk7XG5cbiAgICBpZiAoIUNzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLmlzSW5pdGlhbGlzZWQpIHtcbiAgICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLmluaXQoe30pO1xuICAgICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5pbml0VGVsZW1ldHJ5KFxuICAgICAgICB7XG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBwZGF0YTogY29udGV4dC5wZGF0YSxcbiAgICAgICAgICAgIGVudjogJ0NvbnRlbnRQbGF5ZXInLFxuICAgICAgICAgICAgY2hhbm5lbDogY29udGV4dC5jaGFubmVsLFxuICAgICAgICAgICAgZGlkOiBjb250ZXh0LmRpZCxcbiAgICAgICAgICAgIGF1dGh0b2tlbjogY29udGV4dC5hdXRoVG9rZW4gfHwgJycsXG4gICAgICAgICAgICB1aWQ6IGNvbnRleHQudWlkIHx8ICcnLFxuICAgICAgICAgICAgc2lkOiBjb250ZXh0LnNpZCxcbiAgICAgICAgICAgIGJhdGNoc2l6ZTogMjAsXG4gICAgICAgICAgICBtb2RlOiBjb250ZXh0Lm1vZGUsXG4gICAgICAgICAgICBob3N0OiBjb250ZXh0Lmhvc3QgfHwgJycsXG4gICAgICAgICAgICBlbmRwb2ludDogY29udGV4dC5lbmRwb2ludCB8fCAnL2RhdGEvdjMvdGVsZW1ldHJ5JyxcbiAgICAgICAgICAgIHRhZ3M6IGNvbnRleHQudGFncyxcbiAgICAgICAgICAgIGNkYXRhOiBbeyBpZDogdGhpcy5jb250ZW50U2Vzc2lvbklkLCB0eXBlOiAnQ29udGVudFNlc3Npb24nIH0sXG4gICAgICAgICAgICB7IGlkOiB0aGlzLnBsYXlTZXNzaW9uSWQsIHR5cGU6ICdQbGF5U2Vzc2lvbicgfV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHVzZXJPcmdEZXRhaWxzOiB7fVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMudGVsZW1ldHJ5T2JqZWN0ID0ge1xuICAgICAgaWQ6IG1ldGFkYXRhLmlkZW50aWZpZXIsXG4gICAgICB0eXBlOiAnQ29udGVudCcsXG4gICAgICB2ZXI6IG1ldGFkYXRhLnBrZ1ZlcnNpb24gKyAnJyxcbiAgICAgIHJvbGx1cDogY29udGV4dC5vYmplY3RSb2xsdXAgfHwge31cbiAgICB9O1xuICB9XG5cblxuICBwdWJsaWMgc3RhcnQoZHVyYXRpb24pIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlU3RhcnRUZWxlbWV0cnkoXG4gICAgICB7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICAgIGVkYXRhOiB7IHR5cGU6ICdjb250ZW50JywgbW9kZTogJ3BsYXknLCBwYWdlaWQ6ICcnLCBkdXJhdGlvbjogTnVtYmVyKChkdXJhdGlvbiAvIDFlMykudG9GaXhlZCgyKSkgfVxuICAgICAgfVxuICAgICk7XG5cbiAgfVxuXG4gIHB1YmxpYyBlbmQoZHVyYXRpb24sIHRvdGFsbGVuZ3RoLCBjdXJyZW50bGVuZ3RoLCBlbmRwYWdlc2VlbiwgdG90YWxzZWVrZWRsZW5ndGgsIHZpc2l0ZWRsZW5ndGgpIHtcbiAgICBjb25zdCBkdXJhdGlvblNlYyA9IE51bWJlcigoZHVyYXRpb24gLyAxZTMpLnRvRml4ZWQoMikpO1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VFbmRUZWxlbWV0cnkoe1xuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZTogJ2NvbnRlbnQnLFxuICAgICAgICBtb2RlOiAncGxheScsXG4gICAgICAgIHBhZ2VpZDogJ3N1bmJpcmQtcGxheWVyLUVuZHBhZ2UnLFxuICAgICAgICBzdW1tYXJ5OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvZ3Jlc3M6IE51bWJlcigoKGN1cnJlbnRsZW5ndGggLyB0b3RhbGxlbmd0aCkgKiAxMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b3RhbGxlbmd0aFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmlzaXRlZGxlbmd0aFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmlzaXRlZGNvbnRlbnRlbmQ6ICh0b3RhbGxlbmd0aCA9PT0gY3VycmVudGxlbmd0aClcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRvdGFsc2Vla2VkbGVuZ3RoXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlbmRwYWdlc2VlblxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uU2VjXG4gICAgICB9LFxuICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKVxuICAgIH0pO1xuXG4gIH1cblxuICBwdWJsaWMgaW50ZXJhY3QoaWQsIGN1cnJlbnRQYWdlKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUludGVyYWN0VGVsZW1ldHJ5KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICBlZGF0YTogeyB0eXBlOiAnVE9VQ0gnLCBzdWJ0eXBlOiAnJywgaWQsIHBhZ2VpZDogY3VycmVudFBhZ2UgKyAnJyB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaGVhcnRCZWF0KGRhdGEpIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS5wbGF5ZXJUZWxlbWV0cnlTZXJ2aWNlLm9uSGVhcnRCZWF0RXZlbnQoZGF0YSwge30pO1xuICB9XG5cbiAgcHVibGljIGltcHJlc3Npb24oY3VycmVudFBhZ2UpIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlSW1wcmVzc2lvblRlbGVtZXRyeSh7XG4gICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpLFxuICAgICAgZWRhdGE6IHsgdHlwZTogJ3dvcmtmbG93Jywgc3VidHlwZTogJycsIHBhZ2VpZDogY3VycmVudFBhZ2UgKyAnJywgdXJpOiAnJyB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcgLCBlcnJvclR5cGU6c3RyaW5nICwgIHN0YWNrdHJhY2U/OkVycm9yKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUVycm9yVGVsZW1ldHJ5KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICBlZGF0YToge1xuICAgICAgICBlcnI6IGVycm9yQ29kZSxcbiAgICAgICAgZXJydHlwZTogZXJyb3JUeXBlLFxuICAgICAgICBzdGFja3RyYWNlOiAoc3RhY2t0cmFjZSAmJiBzdGFja3RyYWNlLnRvU3RyaW5nKCkpIHx8ICcnXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldEV2ZW50T3B0aW9ucygpIHtcbiAgICByZXR1cm4gKHtcbiAgICAgIG9iamVjdDogdGhpcy50ZWxlbWV0cnlPYmplY3QsXG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIGNoYW5uZWw6IHRoaXMuY29udGV4dC5jaGFubmVsLFxuICAgICAgICBwZGF0YTogdGhpcy5jb250ZXh0LnBkYXRhLFxuICAgICAgICBlbnY6ICdDb250ZW50UGxheWVyJyxcbiAgICAgICAgc2lkOiB0aGlzLmNvbnRleHQuc2lkLFxuICAgICAgICB1aWQ6IHRoaXMuY29udGV4dC51aWQsXG4gICAgICAgIGNkYXRhOiBbeyBpZDogdGhpcy5jb250ZW50U2Vzc2lvbklkLCB0eXBlOiAnQ29udGVudFNlc3Npb24nIH0sXG4gICAgICAgIHsgaWQ6IHRoaXMucGxheVNlc3Npb25JZCwgdHlwZTogJ1BsYXlTZXNzaW9uJyB9XSxcbiAgICAgICAgcm9sbHVwOiB0aGlzLmNvbnRleHQuY29udGV4dFJvbGx1cCB8fCB7fVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=