import { $t } from '@project-sunbird/telemetry-sdk';
import { PlayerConfig } from '../playerInterfaces';
import { UtilService } from './util.service';

export class TelemetryService extends EventTarget {

  private contentSessionId: string;
  private playSessionId!: string;
  private telemetryObject: any;
  private context: any;
  public config: any;
  private utilService: UtilService;

  constructor() {
    super();
    this.utilService = new UtilService();
    this.contentSessionId = this.utilService.uniqueId();
  }

  public initialize({ context, config, metadata }: PlayerConfig) {
    this.context = context;
    this.config = config;
    this.playSessionId = this.utilService.uniqueId();

    if (!$t.isInitialized) {
      $t.initialize({
        pdata: context.pdata,
        env: 'contentplayer',
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
        { id: this.playSessionId, type: 'PlaySession' },
        { id: '2.0', type: 'PlayerVersion' }]
      });
    }

    this.telemetryObject = {
      id: metadata.identifier,
      type: 'Content',
      ver: metadata.pkgVersion + '',
      rollup: context.objectRollup || {}
    };
  }


  public start(duration: number) {
    const event = {
      type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2))
    };
    $t.start(
      this.config,
      this.telemetryObject.id,
      this.telemetryObject.ver,
      event,
      this.getEventOptions()
    );
    this.emitTelemetryEvent(event);
  }

  public end(duration: number, totallength: number, currentlength: number, endpageseen: boolean, totalseekedlength: number, visitedlength: number, score: number, uniqueVisitedLength: number) {
    const durationSec = Number((duration / 1e3).toFixed(2));
    let progress = Number(((uniqueVisitedLength / totallength) * 100).toFixed(0));
    if (totallength - uniqueVisitedLength < 5) {
      progress = 100;
    }
    const event = {
        type: 'content',
        mode: 'play',
        pageid: 'sunbird-player-Endpage',
        summary: [
          {
            progress
          },
          {
            totallength
          },
          {
            visitedlength
          },
          {
            visitedcontentend: endpageseen
          },
          {
            totalseekedlength
          },
          {
            endpageseen
          },
          {
            score
          },
          {
            uniquevisitedlength: uniqueVisitedLength
          }
        ],
        duration: durationSec
      };
    $t.end(
      event,
      this.getEventOptions()
    );
    this.emitTelemetryEvent(event);
  }

  public interact(id: string, currentPage: string, extraValues?: any) {
    const event = { type: 'TOUCH', subtype: '', id, pageid: currentPage + '', extra: extraValues };
    $t.interact(
      event,
      this.getEventOptions()
    );
    this.emitTelemetryEvent(event);
  }

  public heartBeat(data: any) {
    $t.heartbeat(data, this.getEventOptions());
    this.emitTelemetryEvent(data);
  }

  public impression(currentPage: string, cdata: any = {}) {
    const impressionEvent: any = {
        type: 'workflow', subtype: '', pageid: currentPage + '', uri: ''
    };
    const options = this.getEventOptions();
    if (cdata && Object.keys(cdata).length > 0) {
      options.context.cdata.push(cdata);
    }
    $t.impression(impressionEvent, options);
    this.emitTelemetryEvent(impressionEvent);
  }

  public error(errorCode: string, errorType: string, stacktrace?: Error) {
    const event = {
        err: errorCode,
        errtype: errorType,
        stacktrace: (stacktrace && stacktrace.toString()) || ''
      };
    $t.error(
      event,
      this.getEventOptions()
    );
    this.emitTelemetryEvent(event);
  }

  private emitTelemetryEvent(event: any) {
    this.dispatchEvent(new CustomEvent('telemetryEvent', { detail: event }));
  }

  private getEventOptions() {
    return ({
      object: this.telemetryObject,
      context: {
        channel: this.context.channel,
        pdata: this.context.pdata,
        env: 'contentplayer',
        sid: this.context.sid,
        uid: this.context.uid,
        cdata: [{ id: this.contentSessionId, type: 'ContentSession' },
        { id: this.playSessionId, type: 'PlaySession' },
        { id: '2.0', type: 'PlayerVersion' }],
        rollup: this.context.contextRollup || {}
      }
    });
  }
}
