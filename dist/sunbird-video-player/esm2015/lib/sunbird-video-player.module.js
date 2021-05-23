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
export class SunbirdVideoPlayerModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC12aWRlby1wbGF5ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXZpZGVvLXBsYXllci12OC8iLCJzb3VyY2VzIjpbImxpYi9zdW5iaXJkLXZpZGVvLXBsYXllci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUcsTUFBTSx3Q0FBd0MsQ0FBQztBQUNqRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQVl4RCxNQUFNLE9BQU8sd0JBQXdCOzs7WUFWcEMsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLDJCQUEyQixFQUFFLG9CQUFvQixDQUFDO2dCQUNqRSxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsc0JBQXNCO2lCQUN2QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQywyQkFBMkIsRUFBRyxzQkFBc0IsQ0FBQzthQUNoRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTdW5iaXJkUGxheWVyU2RrTW9kdWxlICB9IGZyb20gJ0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1wbGF5ZXItc2RrLXY4JztcbmltcG9ydCB7IFN1bmJpcmRWaWRlb1BsYXllckNvbXBvbmVudCB9IGZyb20gJy4vc3VuYmlyZC12aWRlby1wbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFZpZGVvUGxheWVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZpZGVvLXBsYXllci92aWRlby1wbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1N1bmJpcmRWaWRlb1BsYXllckNvbXBvbmVudCwgVmlkZW9QbGF5ZXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgU3VuYmlyZFBsYXllclNka01vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbU3VuYmlyZFZpZGVvUGxheWVyQ29tcG9uZW50ICwgU3VuYmlyZFBsYXllclNka01vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgU3VuYmlyZFZpZGVvUGxheWVyTW9kdWxlIHsgfVxuIl19