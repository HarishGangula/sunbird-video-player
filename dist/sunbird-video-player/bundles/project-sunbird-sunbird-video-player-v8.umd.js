(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@project-sunbird/client-services/telemetry'), require('@project-sunbird/sunbird-player-sdk-v8'), require('rxjs'), require('@angular/common/http'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('@project-sunbird/sunbird-video-player-v8', ['exports', '@angular/core', '@project-sunbird/client-services/telemetry', '@project-sunbird/sunbird-player-sdk-v8', 'rxjs', '@angular/common/http', '@angular/common', '@angular/forms'], factory) :
    (global = global || self, factory((global['project-sunbird'] = global['project-sunbird'] || {}, global['project-sunbird']['sunbird-video-player-v8'] = {}), global.ng.core, global.telemetry, global.sunbirdPlayerSdkV8, global.rxjs, global.ng.common.http, global.ng.common, global.ng.forms));
}(this, (function (exports, core, telemetry, sunbirdPlayerSdkV8, rxjs, http, common, forms) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __createBinding(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }

    function __exportStar(m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var UtilService = /** @class */ (function () {
        function UtilService() {
        }
        /**
         * @param {?=} length
         * @return {?}
         */
        UtilService.prototype.uniqueId = /**
         * @param {?=} length
         * @return {?}
         */
        function (length) {
            if (length === void 0) { length = 32; }
            /** @type {?} */
            var result = '';
            /** @type {?} */
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            /** @type {?} */
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        /**
         * @param {?} duration
         * @return {?}
         */
        UtilService.prototype.getTimeSpentText = /**
         * @param {?} duration
         * @return {?}
         */
        function (duration) {
            /** @type {?} */
            var minutes = Math.floor(duration / 60000);
            /** @type {?} */
            var seconds = Number(((duration % 60000) / 1000).toFixed(0));
            return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
        };
        UtilService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */ UtilService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });
        return UtilService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
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
            if (!telemetry.CsTelemetryModule.instance.isInitialised) {
                telemetry.CsTelemetryModule.instance.init({});
                telemetry.CsTelemetryModule.instance.telemetryService.initTelemetry({
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
            telemetry.CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
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
            telemetry.CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
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
            telemetry.CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
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
            telemetry.CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
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
            telemetry.CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
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
            telemetry.CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
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
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        SunbirdVideoPlayerService.ctorParameters = function () { return [
            { type: UtilService }
        ]; };
        /** @nocollapse */ SunbirdVideoPlayerService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function SunbirdVideoPlayerService_Factory() { return new SunbirdVideoPlayerService(core.ɵɵinject(UtilService)); }, token: SunbirdVideoPlayerService, providedIn: "root" });
        return SunbirdVideoPlayerService;
    }());
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
    var ViewerService = /** @class */ (function () {
        function ViewerService(videoPlayerService, utilService, http) {
            this.videoPlayerService = videoPlayerService;
            this.utilService = utilService;
            this.http = http;
            this.endPageSeen = false;
            this.timeSpent = '0:0';
            this.version = '1.0';
            this.playerEvent = new core.EventEmitter();
            this.sidebarMenuEvent = new core.EventEmitter();
            this.isAvailableLocally = false;
            this.PlayerLoadStartedAt = new Date().getTime();
        }
        /**
         * @param {?} __0
         * @return {?}
         */
        ViewerService.prototype.initialize = /**
         * @param {?} __0
         * @return {?}
         */
        function (_a) {
            var context = _a.context, config = _a.config, metadata = _a.metadata;
            this.contentName = metadata.name;
            this.streamingUrl = metadata.streamingUrl;
            this.artifactUrl = metadata.artifactUrl;
            this.mimeType = metadata.streamingUrl ? 'application/x-mpegURL' : metadata.mimeType;
            this.artifactMimeType = metadata.mimeType;
            this.isAvailableLocally = metadata.isAvailableLocally;
            this.traceId = config.traceId;
            this.markers = config.markers;
            if (context.userData) {
                var _b = context.userData, firstName = _b.firstName, lastName = _b.lastName;
                this.userName = firstName === lastName ? firstName : firstName + " " + lastName;
            }
            this.metaData = {
                actions: [],
                volume: [],
                playBackSpeeds: [],
                totalDuration: 0
            };
            this.showDownloadPopup = false;
            this.endPageSeen = false;
        };
        /**
         * @return {?}
         */
        ViewerService.prototype.getPlayerOptions = /**
         * @return {?}
         */
        function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.streamingUrl) return [3 /*break*/, 1];
                            return [2 /*return*/, [{ src: this.artifactUrl, type: this.artifactMimeType }]];
                        case 1: return [4 /*yield*/, this.http.head(this.streamingUrl, { responseType: 'blob' }).toPromise().catch((/**
                             * @param {?} error
                             * @return {?}
                             */
                            function (error) {
                                _this.raiseExceptionLog(sunbirdPlayerSdkV8.errorCode.streamingUrlSupport, sunbirdPlayerSdkV8.errorMessage.streamingUrlSupport, new Error("Streaming Url Not Supported  " + _this.streamingUrl), _this.traceId);
                            }))];
                        case 2:
                            data = _a.sent();
                            if (data) {
                                return [2 /*return*/, [{ src: this.streamingUrl, type: this.mimeType }]];
                            }
                            else {
                                return [2 /*return*/, [{ src: this.artifactUrl, type: this.artifactMimeType }]];
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * @return {?}
         */
        ViewerService.prototype.getMarkers = /**
         * @return {?}
         */
        function () {
            return this.markers;
        };
        /**
         * @return {?}
         */
        ViewerService.prototype.pageSessionUpdate = /**
         * @return {?}
         */
        function () {
        };
        /**
         * @param {?} event
         * @return {?}
         */
        ViewerService.prototype.raiseStartEvent = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var duration = new Date().getTime() - this.PlayerLoadStartedAt;
            /** @type {?} */
            var startEvent = {
                eid: 'START',
                ver: this.version,
                edata: {
                    type: 'START',
                    mode: 'play',
                    duration: duration
                },
                metaData: this.metaData
            };
            this.playerEvent.emit(startEvent);
            this.videoPlayerService.start(duration);
            this.PlayerLoadStartedAt = new Date().getTime();
        };
        /**
         * @return {?}
         */
        ViewerService.prototype.raiseEndEvent = /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var duration = new Date().getTime() - this.PlayerLoadStartedAt;
            /** @type {?} */
            var endEvent = {
                eid: 'END',
                ver: this.version,
                edata: {
                    type: 'END',
                    currentTime: this.currentlength,
                    totalTime: this.totalLength,
                    duration: duration
                },
                metaData: this.metaData
            };
            this.playerEvent.emit(endEvent);
            this.timeSpent = this.utilService.getTimeSpentText(this.visitedLength);
            this.videoPlayerService.end(duration, this.totalLength, this.currentlength, this.endPageSeen, this.totalSeekedLength, this.visitedLength / 1000);
        };
        /**
         * @param {?} type
         * @return {?}
         */
        ViewerService.prototype.raiseHeartBeatEvent = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            /** @type {?} */
            var hearBeatEvent = {
                eid: 'HEARTBEAT',
                ver: this.version,
                edata: {
                    type: type,
                    currentPage: 'videostage'
                },
                metaData: this.metaData
            };
            this.playerEvent.emit(hearBeatEvent);
            this.videoPlayerService.heartBeat(hearBeatEvent);
            /** @type {?} */
            var interactItems = ['PLAY', 'PAUSE', 'EXIT', 'VOLUME_CHANGE', 'DRAG',
                'RATE_CHANGE', 'CLOSE_DOWNLOAD', 'DOWNLOAD', 'NAVIGATE_TO_PAGE',
                'NEXT', 'OPEN_MENU', 'PREVIOUS', 'CLOSE_MENU', 'DOWNLOAD_MENU',
                'SHARE', 'REPLAY', 'FORWARD', 'BACKWARD', 'FULLSCREEN', 'NEXT_CONTENT_PLAY'
            ];
            if (interactItems.includes(type)) {
                this.videoPlayerService.interact(type.toLowerCase(), 'videostage');
            }
        };
        /**
         * @param {?} errorCode
         * @param {?} errorType
         * @param {?} stacktrace
         * @param {?} traceId
         * @return {?}
         */
        ViewerService.prototype.raiseExceptionLog = /**
         * @param {?} errorCode
         * @param {?} errorType
         * @param {?} stacktrace
         * @param {?} traceId
         * @return {?}
         */
        function (errorCode, errorType, stacktrace, traceId) {
            /** @type {?} */
            var exceptionLogEvent = {
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
        };
        ViewerService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        ViewerService.ctorParameters = function () { return [
            { type: SunbirdVideoPlayerService },
            { type: UtilService },
            { type: http.HttpClient }
        ]; };
        /** @nocollapse */ ViewerService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(core.ɵɵinject(SunbirdVideoPlayerService), core.ɵɵinject(UtilService), core.ɵɵinject(http.HttpClient)); }, token: ViewerService, providedIn: "root" });
        return ViewerService;
    }());
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
    var SunbirdVideoPlayerComponent = /** @class */ (function () {
        function SunbirdVideoPlayerComponent(videoPlayerService, viewerService, cdr, renderer2, errorService) {
            var _this = this;
            this.videoPlayerService = videoPlayerService;
            this.viewerService = viewerService;
            this.cdr = cdr;
            this.renderer2 = renderer2;
            this.errorService = errorService;
            this.telemetryEvent = new core.EventEmitter();
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
                    var code = sunbirdPlayerSdkV8.errorCode.contentLoadFails;
                    /** @type {?} */
                    var message = sunbirdPlayerSdkV8.errorMessage.contentLoadFails;
                    if (!navigator.onLine) {
                        code = sunbirdPlayerSdkV8.errorCode.internetConnectivity,
                            message = sunbirdPlayerSdkV8.errorMessage.internetConnectivity;
                    }
                    if (_this.viewerService.isAvailableLocally) {
                        code = sunbirdPlayerSdkV8.errorCode.contentLoadFails,
                            message = sunbirdPlayerSdkV8.errorMessage.contentLoadFails;
                    }
                    if (code === sunbirdPlayerSdkV8.errorCode.contentLoadFails) {
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
            this.sideMenuConfig = __assign({}, this.sideMenuConfig, this.playerConfig.config.sideMenu);
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
                    this.viewerService.raiseExceptionLog(sunbirdPlayerSdkV8.errorCode.contentCompatibility, sunbirdPlayerSdkV8.errorMessage.contentCompatibility, checkContentCompatible['error']['message'], this.traceId);
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
            { type: core.Component, args: [{
                        selector: 'sunbird-video-player',
                        template: "<div class=\"sunbird-video-player-container\" #videoPlayer>\n      <sb-player-side-menu-icon class=\"sb-player-side-menu-icon notVisible\" (sidebarMenuEvent)=\"viewerService.raiseHeartBeatEvent($event); sidebarMenuEvent($event);\"\n            *ngIf=\"viewState ==='player'\" [ngClass]=\"{'isVisible': showControls}\"></sb-player-side-menu-icon>\n      <video-player *ngIf=\"viewState === 'player'\" [events]=\"events\">\n      </video-player>\n      <sb-player-sidebar *ngIf=\"viewState ==='player'\"\n       [title]=\"viewerService.contentName\"\n      (sidebarEvent)=\"sideBarEvents($event)\" [config]=\"sideMenuConfig\"></sb-player-sidebar>\n      <sb-player-end-page [contentName]=\"viewerService.contentName\" [nextContent]=\"nextContent\" [userName]=\"viewerService.userName\" [showExit]=\"sideMenuConfig.showExit\"\n            [timeSpentLabel]=\"viewerService.timeSpent\" (playNextContent)=\"playContent($event)\" (exitContent)=\"exitContent($event)\"   (replayContent)=\"replayContent($event)\"\n            *ngIf=\"viewState === 'end'\"></sb-player-end-page>\n      <sb-player-contenterror *ngIf=\"showContentError\"></sb-player-contenterror>\n</div>",
                        styles: [".sunbird-video-player-container{width:100%;height:100%;overflow:hidden;position:relative}pdf-menu{position:absolute;top:0;left:0;z-index:99}.BtmNotVisible,.notVisible{-webkit-transition:1s ease-in-out;transition:1s ease-in-out;position:absolute;width:100%}.notVisible{top:-10rem}.notVisible.isVisible{top:0}.BtmNotVisible{bottom:-10rem}.BtmNotVisible.isVisible{bottom:0}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span{background:0 0!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button span:before,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon input[type=checkbox]:checked~#overlay-button:hover span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label{background:rgba(51,51,51,.5)}::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:after,::ng-deep .sunbird-video-player-container .sb-player-side-menu-icon label span:before{background-color:rgba(255,255,255,.7)!important}::ng-deep .sunbird-pdf-player{overflow:hidden}::ng-deep .pdfViewer .page{background:0 0!important;-webkit-border-image:none!important;-o-border-image:none!important;border-image:none!important;border:0!important}::ng-deep #toolbarContainer{background:0 0!important;height:auto!important}::ng-deep #viewerContainer{position:relative!important;height:calc(100% - 3rem)}::ng-deep .body,::ng-deep .html,::ng-deep .pdf-viewer button,::ng-deep .pdf-viewer input,::ng-deep .pdf-viewer select{font-size:inherit!important}::ng-deep .findbar,::ng-deep .secondaryToolbar,::ng-deep html[dir=ltr] #toolbarContainer,::ng-deep html[dir=rtl] #toolbarContainer{box-shadow:none!important}::ng-deep .zoom{min-height:inherit!important}::ng-deep html[dir=rtl] .sb-pdf-reading-status{left:auto;right:1rem}.sb-pdf-reading-status{color:var(--gray-800);font-size:.75rem;position:absolute;left:1rem;bottom:1rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;background:var(--white);border-radius:.5rem;padding:.25em .5rem;z-index:5;line-height:normal}.sb-pdf-reading-status span{background:var(--gray-800);width:.25rem;height:.25rem;display:block;margin:0 .5rem;border-radius:50%}.sbt-pdf-footer{background:var(--white);position:absolute;bottom:0;width:100%;height:3rem;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;padding:.75rem .5rem}@media all and (orientation:landscape){::ng-deep .visible-only-potrait{display:none}}@media all and (orientation:portrait){::ng-deep #viewerContainer{height:calc(100% - 6rem)!important}::ng-deep .visible-only-landscape{display:none}::ng-deep .visible-only-potrait{display:block}::ng-deep .file-download__popup{height:15.125rem}::ng-deep .pdf-endpage{display:block!important;position:relative}::ng-deep .pdf-endpage__left-panel{margin-top:6rem}::ng-deep .pdf-endpage__right-panel .title-section{position:absolute;top:0;left:0;right:0}}@media all and (max-width:640px){.visible-only-landscape{display:none}.visible-only-potrait{display:block}}@media all and (min-width:640px){.visible-only-landscape{display:block}.visible-only-potrait{display:none}}"]
                    }] }
        ];
        /** @nocollapse */
        SunbirdVideoPlayerComponent.ctorParameters = function () { return [
            { type: SunbirdVideoPlayerService },
            { type: ViewerService },
            { type: core.ChangeDetectorRef },
            { type: core.Renderer2 },
            { type: sunbirdPlayerSdkV8.ErrorService }
        ]; };
        SunbirdVideoPlayerComponent.propDecorators = {
            playerConfig: [{ type: core.Input }],
            events: [{ type: core.Input }],
            playerEvent: [{ type: core.Output }],
            telemetryEvent: [{ type: core.Output }],
            videoPlayerRef: [{ type: core.ViewChild, args: ['videoPlayer', { static: true },] }],
            onTelemetryEvent: [{ type: core.HostListener, args: ['document:TelemetryEvent', ['$event'],] }],
            ngOnDestroy: [{ type: core.HostListener, args: ['window:beforeunload',] }]
        };
        return SunbirdVideoPlayerComponent;
    }());
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
            { type: core.Component, args: [{
                        selector: 'video-player',
                        template: "<video #target class=\"video-js\" controls></video>\n<div #controlDiv>\n  <div [ngClass]=\"{'player-for-back-ward-controls': currentPlayerState === 'pause' || showControls }\">\n    <div class=\"player-container\" *ngIf=\"currentPlayerState === 'pause' || showControls\">\n      <div class=\"back-ward hide-in-desktop\" [style.visibility]=\"showBackwardButton ? 'visible !important' : 'hidden'\" (click)=\"backward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-70.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M108.4,106.3 C108.4,116.86 99.76,125.5 89.2,125.5 C78.64,125.5 70,116.86 70,106.3 L74.8,106.3 C74.8,114.22 81.28,120.7 89.2,120.7 C97.12,120.7 103.6,114.22 103.6,106.3 C103.6,98.38 97.12,91.9 89.2,91.9 L89.2,101.5 L77.2,89.5 L89.2,77.5 L89.2,87.1 C99.76,87.1 108.4,95.74 108.4,106.3 L108.4,106.3 Z M86.4320312,113.5 L84.4,113.5 L84.4,105.667187 L81.9742187,106.419531 L81.9742187,104.767187 L86.2140625,103.248437 L86.4320312,103.248437 L86.4320312,113.5 Z M96.6484375,109.267188 C96.6484375,110.68282 96.3554717,111.765621 95.7695312,112.515625 C95.1835908,113.265629 94.3257869,113.640625 93.1960937,113.640625 C92.0804632,113.640625 91.2273467,113.27266 90.6367187,112.536719 C90.0460908,111.800778 89.7437501,110.746101 89.7296875,109.372656 L89.7296875,107.488281 C89.7296875,106.058587 90.0261689,104.973441 90.6191406,104.232812 C91.2121123,103.492184 92.0664007,103.121875 93.1820312,103.121875 C94.2976618,103.121875 95.1507783,103.488668 95.7414062,104.222266 C96.3320342,104.955863 96.6343749,106.009368 96.6484375,107.382812 L96.6484375,109.267188 Z M94.6164062,107.2 C94.6164062,106.351558 94.5003918,105.733986 94.2683594,105.347266 C94.036327,104.960545 93.6742212,104.767188 93.1820312,104.767188 C92.7039039,104.767188 92.351173,104.95117 92.1238281,105.319141 C91.8964832,105.687111 91.7757813,106.262496 91.7617187,107.045312 L91.7617187,109.534375 C91.7617187,110.368754 91.8753895,110.98867 92.1027344,111.394141 C92.3300793,111.799611 92.6945287,112.002344 93.1960937,112.002344 C93.6929712,112.002344 94.0515614,111.807814 94.271875,111.41875 C94.4921886,111.029686 94.6070312,110.434379 94.6164062,109.632812 L94.6164062,107.2 Z\"\n              id=\"Shape-Copy\"></path>\n          </g>\n        </svg>\n      </div>\n      <div class=\"pause-play\">\n        <span class=\"pause\" *ngIf=\"showPauseButton\" (click)=\"pause()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy-2\" transform=\"translate(-156.000000, -77.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M180.4,77.5 C167.152,77.5 156.4,88.252 156.4,101.5 C156.4,114.748 167.152,125.5 180.4,125.5 C193.648,125.5 204.4,114.748 204.4,101.5 C204.4,88.252 193.648,77.5 180.4,77.5 L180.4,77.5 Z M178,111.1 L173.2,111.1 L173.2,91.9 L178,91.9 L178,111.1 L178,111.1 Z M187.6,111.1 L182.8,111.1 L182.8,91.9 L187.6,91.9 L187.6,111.1 L187.6,111.1 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n        <span class=\"play\" *ngIf=\"showPlayButton\" (click)=\"play()\">\n          <svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n            <g id=\"video/default-copy\" transform=\"translate(-296.000000, -156.000000)\" fill=\"#FFFFFF\">\n              <path\n                d=\"M320,156 C306.752,156 296,166.752 296,180 C296,193.248 306.752,204 320,204 C333.248,204 344,193.248 344,180 C344,166.752 333.248,156 320,156 L320,156 Z M315.2,190.8 L315.2,169.2 L329.6,180 L315.2,190.8 L315.2,190.8 Z\"\n                id=\"Shape\"></path>\n            </g>\n          </svg>\n        </span>\n      </div>\n      <div class=\"forward hide-in-desktop\" [style.visibility]=\"showForwardButton ? 'visible !important' : 'hidden'\" (click)=\"forward()\">\n        <svg width=\"39px\" height=\"49px\" viewBox=\"0 0 39 49\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n          xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          <g id=\"video/default-copy-2\" transform=\"translate(-251.000000, -77.000000)\" fill=\"#FFFFFF\">\n            <path\n              d=\"M251.4,106.3 C251.4,116.86 260.04,125.5 270.6,125.5 C281.16,125.5 289.8,116.86 289.8,106.3 L285,106.3 C285,114.22 278.52,120.7 270.6,120.7 C262.68,120.7 256.2,114.22 256.2,106.3 C256.2,98.38 262.68,91.9 270.6,91.9 L270.6,101.5 L282.6,89.5 L270.6,77.5 L270.6,87.1 C260.04,87.1 251.4,95.74 251.4,106.3 L251.4,106.3 Z M267.832031,113.5 L265.8,113.5 L265.8,105.667187 L263.374219,106.419531 L263.374219,104.767187 L267.614062,103.248437 L267.832031,103.248437 L267.832031,113.5 Z M278.048438,109.267188 C278.048438,110.68282 277.755472,111.765621 277.169531,112.515625 C276.583591,113.265629 275.725787,113.640625 274.596094,113.640625 C273.480463,113.640625 272.627347,113.27266 272.036719,112.536719 C271.446091,111.800778 271.14375,110.746101 271.129687,109.372656 L271.129687,107.488281 C271.129687,106.058587 271.426169,104.973441 272.019141,104.232812 C272.612112,103.492184 273.466401,103.121875 274.582031,103.121875 C275.697662,103.121875 276.550778,103.488668 277.141406,104.222266 C277.732034,104.955863 278.034375,106.009368 278.048438,107.382812 L278.048438,109.267188 Z M276.016406,107.2 C276.016406,106.351558 275.900392,105.733986 275.668359,105.347266 C275.436327,104.960545 275.074221,104.767188 274.582031,104.767188 C274.103904,104.767188 273.751173,104.95117 273.523828,105.319141 C273.296483,105.687111 273.175781,106.262496 273.161719,107.045312 L273.161719,109.534375 C273.161719,110.368754 273.275389,110.98867 273.502734,111.394141 C273.730079,111.799611 274.094529,112.002344 274.596094,112.002344 C275.092971,112.002344 275.451561,111.807814 275.671875,111.41875 C275.892189,111.029686 276.007031,110.434379 276.016406,109.632812 L276.016406,107.2 Z\"\n              id=\"Shape\"></path>\n          </g>\n        </svg>\n      </div>\n    </div>\n  </div>\n\n\n</div>",
                        encapsulation: core.ViewEncapsulation.None,
                        styles: [".video-js{width:100%;height:100%}.video-player{width:100%}.video-js .vjs-duration{display:block}.video-js .vjs-big-play-button{display:none}.video-js .vjs-control-bar{z-index:3;font-size:12px;background:rgba(0,0,0,.75)}@media (min-width:1600px){.video-js .vjs-control-bar{font-size:16px}}.video-js .vjs-slider{background:#7b7b7b}.video-js .vjs-load-progress{background:#797979}.video-js .vjs-load-progress div{background:#a09f9f}.video-js .vjs-progress-holder,.video-js .vjs-progress-holder .vjs-load-progress,.video-js .vjs-progress-holder .vjs-load-progress div,.video-js .vjs-progress-holder .vjs-play-progress{border-radius:.2em}.vjs-menu-button-popup .vjs-menu .vjs-menu-content{background-color:rgba(0,0,0,.72)}.js-focus-visible .vjs-menu li.vjs-selected:hover,.vjs-menu li.vjs-selected,.vjs-menu li.vjs-selected:focus,.vjs-menu li.vjs-selected:hover{background-color:rgba(216,216,216,.2);color:var(--white)}.video-js .vjs-play-progress:before{top:-.3em}.vjs-playback-rate .vjs-playback-rate-value{line-height:2.75}.vjs-menu li,.vjs-playback-rate .vjs-playback-rate-value{font-size:1.1em}@media screen and (min-width:768px){.video-js .vjs-tech{pointer-events:none}}@media (hover:hover){.hide-in-desktop{visibility:hidden!important}}@media (pointer:fine){.hide-in-desktop{visibility:hidden!important}}.player-for-back-ward-controls{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0;z-index:2}.player-for-back-ward-controls .player-container{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}.player-for-back-ward-controls .player-container .back-ward,.player-for-back-ward-controls .player-container .forward,.player-for-back-ward-controls .player-container .pause-play{width:2.5rem;height:2.5rem;padding:.5rem;-webkit-transition:.3s ease-in-out;transition:.3s ease-in-out;box-sizing:content-box;display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;background:rgba(var(--rc-rgba-black),.5);border-radius:50%;-webkit-transform:scale(1);transform:scale(1)}@media (min-width:768px){.player-for-back-ward-controls .player-container .back-ward:hover,.player-for-back-ward-controls .player-container .forward:hover,.player-for-back-ward-controls .player-container .pause-play:hover{background:rgba(var(--rc-rgba-black),1);border-radius:100%;-webkit-transform:scale(1.25);transform:scale(1.25);cursor:pointer}.player-for-back-ward-controls .player-container .back-ward:hover svg g,.player-for-back-ward-controls .player-container .forward:hover svg g,.player-for-back-ward-controls .player-container .pause-play:hover svg g{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touched,.player-for-back-ward-controls .player-container .forward.touched,.player-for-back-ward-controls .player-container .pause-play.touched{-webkit-animation:2s scaling;animation:2s scaling;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touched svg g,.player-for-back-ward-controls .player-container .forward.touched svg g,.player-for-back-ward-controls .player-container .pause-play.touched svg g{-webkit-animation:2s scalingColor;animation:2s scalingColor;fill:var(--white)}@-webkit-keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward.touchout,.player-for-back-ward-controls .player-container .forward.touchout,.player-for-back-ward-controls .player-container .pause-play.touchout{-webkit-animation:2s scaling2;animation:2s scaling2;-webkit-transform:scale(1);transform:scale(1)}@-webkit-keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}@keyframes scaling2{0%,100%{-webkit-transform:scale(1);transform:scale(1)}50%{-webkit-transform:scale(1.25);transform:scale(1.25)}}.player-for-back-ward-controls .player-container .back-ward.touchout svg g,.player-for-back-ward-controls .player-container .forward.touchout svg g,.player-for-back-ward-controls .player-container .pause-play.touchout svg g{-webkit-animation:2s scalingColor2;animation:2s scalingColor2;fill:var(--white)}@-webkit-keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}@keyframes scalingColor2{0%,100%{fill:var(--white)}50%{fill:var(--primary-theme)}}.player-for-back-ward-controls .player-container .back-ward svg,.player-for-back-ward-controls .player-container .forward svg,.player-for-back-ward-controls .player-container .pause-play svg{width:100%}.player-for-back-ward-controls .player-container .pause-play{margin:0 1.5rem}.player-for-back-ward-controls .player-container .pause-play .pause,.player-for-back-ward-controls .player-container .pause-play .play{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center}"]
                    }] }
        ];
        /** @nocollapse */
        VideoPlayerComponent.ctorParameters = function () { return [
            { type: ViewerService },
            { type: core.Renderer2 }
        ]; };
        VideoPlayerComponent.propDecorators = {
            events: [{ type: core.Input }],
            target: [{ type: core.ViewChild, args: ['target', { static: true },] }],
            controlDiv: [{ type: core.ViewChild, args: ['controlDiv', { static: true },] }]
        };
        return VideoPlayerComponent;
    }());
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
    var SunbirdVideoPlayerModule = /** @class */ (function () {
        function SunbirdVideoPlayerModule() {
        }
        SunbirdVideoPlayerModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [SunbirdVideoPlayerComponent, VideoPlayerComponent],
                        imports: [
                            common.CommonModule,
                            forms.FormsModule,
                            http.HttpClientModule,
                            sunbirdPlayerSdkV8.SunbirdPlayerSdkModule
                        ],
                        exports: [SunbirdVideoPlayerComponent, sunbirdPlayerSdkV8.SunbirdPlayerSdkModule]
                    },] }
        ];
        return SunbirdVideoPlayerModule;
    }());

    exports.SunbirdVideoPlayerComponent = SunbirdVideoPlayerComponent;
    exports.SunbirdVideoPlayerModule = SunbirdVideoPlayerModule;
    exports.SunbirdVideoPlayerService = SunbirdVideoPlayerService;
    exports.ɵa = UtilService;
    exports.ɵb = ViewerService;
    exports.ɵc = VideoPlayerComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=project-sunbird-sunbird-video-player-v8.umd.js.map
