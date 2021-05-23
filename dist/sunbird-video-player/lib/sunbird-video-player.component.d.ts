import { ChangeDetectorRef, EventEmitter, OnInit, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { ErrorService } from '@project-sunbird/sunbird-player-sdk-v8';
import { Observable } from 'rxjs';
import { PlayerConfig } from './playerInterfaces';
import { ViewerService } from './services/viewer.service';
import { SunbirdVideoPlayerService } from './sunbird-video-player.service';
export declare class SunbirdVideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
    videoPlayerService: SunbirdVideoPlayerService;
    viewerService: ViewerService;
    cdr: ChangeDetectorRef;
    private renderer2;
    errorService: ErrorService;
    playerConfig: PlayerConfig;
    events: Observable<{
        action: string;
        data: any;
    }>;
    playerEvent: EventEmitter<object>;
    telemetryEvent: EventEmitter<any>;
    videoPlayerRef: ElementRef;
    viewState: string;
    traceId: string;
    nextContent: any;
    showContentError: boolean;
    showControls: boolean;
    sideMenuConfig: {
        showShare: boolean;
        showDownload: boolean;
        showReplay: boolean;
        showExit: boolean;
    };
    private unlistenTouchStart;
    private unlistenMouseMove;
    isPaused: boolean;
    constructor(videoPlayerService: SunbirdVideoPlayerService, viewerService: ViewerService, cdr: ChangeDetectorRef, renderer2: Renderer2, errorService: ErrorService);
    onTelemetryEvent(event: any): void;
    ngOnInit(): void;
    sidebarMenuEvent(event: any): void;
    ngAfterViewInit(): void;
    sideBarEvents(event: any): void;
    playContent(event: any): void;
    replayContent(event: any): void;
    exitContent(event: any): void;
    downloadVideo(): void;
    ngOnDestroy(): void;
}
