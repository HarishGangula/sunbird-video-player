/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */ UtilService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });
    return UtilService;
}());
export { UtilService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXZpZGVvLXBsYXllci12OC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy91dGlsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTNDO0lBQUE7S0FvQkM7Ozs7O0lBZlEsOEJBQVE7Ozs7SUFBZixVQUFnQixNQUFXO1FBQVgsdUJBQUEsRUFBQSxXQUFXOztZQUNyQixNQUFNLEdBQUcsRUFBRTs7WUFDVCxVQUFVLEdBQUcsZ0VBQWdFOztZQUM3RSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTTtRQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUMzRTtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Ozs7O0lBRU0sc0NBQWdCOzs7O0lBQXZCLFVBQXdCLFFBQVE7O1lBQ3hCLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O1lBQ3RDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELENBQUM7O2dCQW5CRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7c0JBSkQ7Q0FzQkMsQUFwQkQsSUFvQkM7U0FqQlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgVXRpbFNlcnZpY2Uge1xuXG4gIHB1YmxpYyB1bmlxdWVJZChsZW5ndGggPSAzMikge1xuICAgIGxldCByZXN1bHQgPSAnJztcbiAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcbiAgICBjb25zdCBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRUaW1lU3BlbnRUZXh0KGR1cmF0aW9uKSB7XG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoZHVyYXRpb24gLyA2MDAwMCk7XG4gICAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcigoKGR1cmF0aW9uICUgNjAwMDApIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgcmV0dXJuIChtaW51dGVzICsgJzonICsgKHNlY29uZHMgPCAxMCA/ICcwJyA6ICcnKSArIHNlY29uZHMpO1xuICB9XG59XG4iXX0=