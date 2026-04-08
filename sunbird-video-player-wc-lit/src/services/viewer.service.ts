import { TelemetryService } from './telemetry.service';
import { UtilService } from './util.service';
import { PlayerConfig, Transcripts } from '../playerInterfaces';
import { errorCode, errorMessage } from '../constants';
import * as _ from 'lodash-es';

export class ViewerService extends EventTarget {
  public endPageSeen = false;
  public timeSpent = '0:0';
  private version = '1.0';
  public contentName: string = '';
  public showDownloadPopup: boolean = false;
  public streamingUrl: string = '';
  public mimeType: string = '';
  public artifactMimeType: string = '';
  public userName: string = '';
  public metaData: any;
  public PlayerLoadStartedAt: number;
  public totalLength: number = 0;
  public currentlength: number = 0;
  public totalSeekedLength = 0;
  public artifactUrl: string = '';
  public visitedLength = 0;
  public uniqueVisitedLength: number = 0;
  public traceId: string = '';
  public isAvailableLocally = false;
  public interceptionPoints: any;
  public interceptionResponses: any = {};
  public showScore = false;
  public scoreObtained: any = 0;
  public maxScore: number = 0;
  public playerInstance: any;
  public contentMap = {};
  public playerTimeSlots: number[][] = [];
  public isEndEventRaised = false;
  public transcripts: Transcripts = [];
  public playBitStartTime = 0;
  public playBitEndTime = 0;

  constructor(private telemetryService: TelemetryService, private utilService: UtilService) {
    super();
    this.PlayerLoadStartedAt = new Date().getTime();
  }

  initialize({ context, config, metadata }: PlayerConfig) {
    this.contentName = metadata.name;
    this.isAvailableLocally = metadata.isAvailableLocally;
    this.streamingUrl = metadata.streamingUrl;
    this.artifactUrl = metadata.artifactUrl;
    this.mimeType = metadata.streamingUrl ? 'application/x-mpegURL' : metadata.mimeType;
    this.artifactMimeType = metadata.mimeType;
    this.isAvailableLocally = metadata.isAvailableLocally;
    this.traceId = config.traceId;
    this.interceptionPoints = metadata.interceptionPoints;
    if (context.userData) {
      const { firstName, lastName } = context.userData;
      this.userName = firstName === lastName ? firstName : `${firstName} ${lastName}`;
    }
    this.metaData = {
      actions: [],
      volume: [],
      playBackSpeeds: [],
      totalDuration: 0,
      muted: undefined,
      currentDuration: undefined,
      transcripts: []
    };
    this.transcripts = metadata.transcripts ? metadata.transcripts : [];
    this.showDownloadPopup = false;
    this.endPageSeen = false;
    if (this.isAvailableLocally) {
      const basePath = (metadata.streamingUrl) ? (metadata.streamingUrl) : (metadata.basePath || metadata.baseDir);
      this.streamingUrl = `${basePath}/${metadata.artifactUrl}`;
      this.mimeType = metadata.mimeType;
    }
    this.telemetryService.initialize({ context, config, metadata });
  }

  handleTranscriptsData(selectedTranscripts: any[]) {
    this.metaData.transcripts = selectedTranscripts;
    if (!_.isArray(this.transcripts)) {
      this.raiseExceptionLog('INVALID_TRANSCRIPT_DATATYPE', 'TRANSCRIPT', new Error('Transcript data should be array'), this.traceId);
      return [];
    } else {
      _.forEach(this.transcripts, (value: any) => {
        if (!(_.some(this.transcripts, {
          language: value.language, artifactUrl: value.artifactUrl,
          languageCode: value.languageCode, identifier: value.identifier
        }))) {
          this.raiseExceptionLog('TRANSCRIPT_DATA_MISSING', 'TRANSCRIPT',
            new Error('Transcript object dose not have required fields'), this.traceId);
          return [];
        } else if (!_.isEmpty(selectedTranscripts) &&
          (_.last(selectedTranscripts) !== 'off' && _.last(selectedTranscripts) === value.languageCode)) {
          value.default = true;
        }
      });
    }
    return this.transcripts;
  }

  async getPlayerOptions() {
    if (!this.streamingUrl) {
      return [{ src: this.artifactUrl, type: this.artifactMimeType }];
    } else {
      try {
        const response = await fetch(this.streamingUrl, { method: 'HEAD' });
        if (response.ok) {
          return [{ src: this.streamingUrl, type: this.mimeType }];
        } else {
             throw new Error('Network response was not ok');
        }
      } catch (error) {
        this.raiseExceptionLog(errorCode.streamingUrlSupport, errorMessage.streamingUrlSupport, new Error(`Streaming Url Not Supported  ${this.streamingUrl}`), this.traceId);
        return [{ src: this.artifactUrl, type: this.artifactMimeType }];
      }
    }
  }

  getUniqueVisitedLength() {
    const uniqSecondsList = [];
    for (let slot of this.playerTimeSlots) {
      if (slot[0] < slot[1]) {
        let sec = slot[0];
        while (sec <= slot[1]) {
          sec = Math.floor(sec)
          if (uniqSecondsList.indexOf(sec) == -1 && sec != 0) {
            uniqSecondsList.push(sec)
          }
          sec += 1
        }
      }
    }
    return uniqSecondsList.length;
  }

  getVisitedLength() {
    const secondsList = [];
    for (let slot of this.playerTimeSlots) {
      if (slot[0] < slot[1]) {
        let sec = slot[0];
        while (sec <= slot[1]) {
          sec = Math.floor(sec)
          if (sec != 0) {
            secondsList.push(sec)
          }
          sec += 1
        }
      }
    }
    return secondsList.length;
  }

  raiseStartEvent(event: any) {
    const duration = new Date().getTime() - this.PlayerLoadStartedAt;
    const startEvent = {
      eid: 'START',
      ver: this.version,
      edata: {
        type: 'START',
        mode: 'play',
        duration
      },
      metaData: this.metaData
    };
    this.emitPlayerEvent(startEvent);
    this.telemetryService.start(duration);
    this.PlayerLoadStartedAt = new Date().getTime();
  }

  calculateScore() {
    this.scoreObtained = Object.values(this.interceptionResponses).reduce(
      (acc: any, response: any) => acc + response['score'], 0);
  }

  raiseEndEvent(isOnPlayInterrupt = false) {
    if (!this.isEndEventRaised) {
      this.calculateScore();
      const duration = new Date().getTime() - this.PlayerLoadStartedAt;
      const endEvent = {
        eid: 'END',
        ver: this.version,
        edata: {
          type: 'END',
          currentTime: this.currentlength,
          totalTime: this.totalLength,
          duration
        },
        metaData: this.metaData
      };
      this.emitPlayerEvent(endEvent);

      if (isOnPlayInterrupt) {
        this.playerTimeSlots.push([this.playBitStartTime, this.currentlength]);
      }
      this.uniqueVisitedLength = this.getUniqueVisitedLength();
      if (this.uniqueVisitedLength > this.totalLength) {
        this.uniqueVisitedLength = this.totalLength;
      }
      this.visitedLength = this.getVisitedLength();
      this.timeSpent = this.utilService.getTimeSpentText(this.visitedLength);

      this.telemetryService.end(
        duration,
        this.totalLength,
        this.currentlength,
        this.endPageSeen,
        this.totalSeekedLength,
        this.visitedLength,
        this.scoreObtained,
        this.uniqueVisitedLength
      );
      this.isEndEventRaised = true;
    }
  }

  raiseHeartBeatEvent(type: string, extraValues?: any) {
    if (type === 'REPLAY') {
      this.interceptionResponses = {};
      this.showScore = false;
      this.scoreObtained = 0;
      this.playerTimeSlots = [];
      this.playBitEndTime = 0;
      this.playBitStartTime = 0;
    }
    const hearBeatEvent = {
      eid: 'HEARTBEAT',
      ver: this.version,
      edata: {
        type,
        currentPage: 'videostage',
        extra: extraValues
      },
      metaData: this.metaData
    };
    this.emitPlayerEvent(hearBeatEvent);
    this.telemetryService.heartBeat(hearBeatEvent);
    const interactItems = ['PLAY', 'PAUSE', 'EXIT', 'VOLUME_CHANGE', 'DRAG',
      'RATE_CHANGE', 'CLOSE_DOWNLOAD', 'DOWNLOAD', 'NAVIGATE_TO_PAGE',
      'NEXT', 'OPEN_MENU', 'PREVIOUS', 'CLOSE_MENU', 'DOWNLOAD_MENU', 'DOWNLOAD_POPUP_CLOSE', 'DOWNLOAD_POPUP_CANCEL',
      'SHARE', 'REPLAY', 'FORWARD', 'BACKWARD', 'FULLSCREEN', 'NEXT_CONTENT_PLAY', 'TRANSCRIPT_LANGUAGE_OFF',
      'TRANSCRIPT_LANGUAGE_SELECTED', 'VIDEO_MARKER_SELECTED'
    ];
    if (interactItems.includes(type)) {
      this.telemetryService.interact(type.toLowerCase(), 'videostage', extraValues);
    }
  }

  raiseImpressionEvent(pageId: string, cdata: any = {}) {
    this.telemetryService.impression(pageId, cdata);
  }

  raiseExceptionLog(errorCode: string, errorType: string, stacktrace: any, traceId: string) {
    const exceptionLogEvent = {
      eid: 'ERROR',
      edata: {
        err: errorCode,
        errtype: errorType,
        requestid: traceId || '',
        stacktrace: (stacktrace && stacktrace.toString()) || '',
      }
    };
    this.emitPlayerEvent(exceptionLogEvent);
    this.telemetryService.error(errorCode, errorType, stacktrace);
  }

  private emitPlayerEvent(event: any) {
      this.dispatchEvent(new CustomEvent('playerEvent', { detail: event }));
  }
}
