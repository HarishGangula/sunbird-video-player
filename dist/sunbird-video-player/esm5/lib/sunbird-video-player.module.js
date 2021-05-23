/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v8';
import { SunbirdVideoPlayerComponent } from './sunbird-video-player.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { HttpClientModule } from '@angular/common/http';
var SunbirdVideoPlayerModule = /** @class */ (function () {
    function SunbirdVideoPlayerModule() {
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
    return SunbirdVideoPlayerModule;
}());
export { SunbirdVideoPlayerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXZpZGVvLXBsYXllci12OC8iLCJzb3VyY2VzIjpbImxpYi9zdW5iaXJkLXZpZGVvLXBsYXllci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUcsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RDtJQUFBO0lBVXdDLENBQUM7O2dCQVZ4QyxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsMkJBQTJCLEVBQUUsb0JBQW9CLENBQUM7b0JBQ2pFLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsZ0JBQWdCO3dCQUNoQixzQkFBc0I7cUJBQ3ZCO29CQUNELE9BQU8sRUFBRSxDQUFDLDJCQUEyQixFQUFHLHNCQUFzQixDQUFDO2lCQUNoRTs7SUFDdUMsK0JBQUM7Q0FBQSxBQVZ6QyxJQVV5QztTQUE1Qix3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3VuYmlyZFBsYXllclNka01vZHVsZSAgfSBmcm9tICdAcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcGxheWVyLXNkay12OCc7XG5pbXBvcnQgeyBTdW5iaXJkVmlkZW9QbGF5ZXJDb21wb25lbnQgfSBmcm9tICcuL3N1bmJpcmQtdmlkZW8tcGxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBWaWRlb1BsYXllckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy92aWRlby1wbGF5ZXIvdmlkZW8tcGxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtTdW5iaXJkVmlkZW9QbGF5ZXJDb21wb25lbnQsIFZpZGVvUGxheWVyQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIFN1bmJpcmRQbGF5ZXJTZGtNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1N1bmJpcmRWaWRlb1BsYXllckNvbXBvbmVudCAsIFN1bmJpcmRQbGF5ZXJTZGtNb2R1bGVdXG59KVxuZXhwb3J0IGNsYXNzIFN1bmJpcmRWaWRlb1BsYXllck1vZHVsZSB7IH1cbiJdfQ==