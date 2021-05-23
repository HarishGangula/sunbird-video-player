import { AfterViewInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewerService } from '../../services/viewer.service';
export declare class VideoPlayerComponent implements AfterViewInit, OnDestroy {
    viewerService: ViewerService;
    private renderer2;
    showBackwardButton: boolean;
    showForwardButton: boolean;
    showPlayButton: boolean;
    showPauseButton: boolean;
    showControls: boolean;
    currentPlayerState: string;
    private unlistenTargetMouseMove;
    private unlistenTargetTouchStart;
    events: Observable<any>;
    target: ElementRef;
    controlDiv: ElementRef;
    player: any;
    totalSeekedLength: number;
    previousTime: number;
    currentTime: number;
    seekStart: any;
    time: number;
    startTime: any;
    totalSpentTime: number;
    isAutoplayPrevented: boolean;
    private eventsSubscription;
    constructor(viewerService: ViewerService, renderer2: Renderer2);
    ngAfterViewInit(): void;
    registerEvents(): void;
    toggleForwardRewindButton(): void;
    play(): void;
    pause(): void;
    backward(): void;
    forward(): void;
    handleVideoControls({ type }: {
        type: any;
    }): void;
    updatePlayerEventsMetadata({ type }: {
        type: any;
    }): void;
    ngOnDestroy(): void;
}
