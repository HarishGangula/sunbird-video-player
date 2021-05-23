import { PlayerConfig } from './playerInterfaces';
import { UtilService } from './services/util.service';
export declare class SunbirdVideoPlayerService {
    private utilService;
    private contentSessionId;
    private playSessionId;
    private telemetryObject;
    private context;
    config: any;
    constructor(utilService: UtilService);
    initialize({ context, config, metadata }: PlayerConfig): void;
    start(duration: any): void;
    end(duration: any, totallength: any, currentlength: any, endpageseen: any, totalseekedlength: any, visitedlength: any): void;
    interact(id: any, currentPage: any): void;
    heartBeat(data: any): void;
    impression(currentPage: any): void;
    error(errorCode: string, errorType: string, stacktrace?: Error): void;
    private getEventOptions;
}
