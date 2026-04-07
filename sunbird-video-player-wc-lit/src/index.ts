import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-http-source-selector';
import 'videojs-markers-plugin';
// Video.js styles
import 'video.js/dist/video-js.css';
import 'videojs-markers-plugin/dist/videojs.markers.plugin.css';
import { $t } from '@project-sunbird/telemetry-sdk';

// Declare window telemetry if used directly
declare global {
  interface Window {
    $t?: any;
    EkTelemetry?: any;
    jQuery?: any;
    $?: any;
  }
}

@customElement('sunbird-video-player')
export class SunbirdVideoPlayer extends LitElement {
  @property({ type: Object }) playerConfig: any = {};
  @property({ type: Object }) action: any = {};

  @query('.video-js') videoElement!: HTMLVideoElement;

  private player: any;
  private isTelemetryInitialized = false;
  private telemetryService: any;
  private traceId: string = '';
  private startTime: number = 0;
  private totalDuration: number = 0;
  private totalSeekedLength: number = 0;
  private previousTime: number = 0;
  private seekStart: number | null = null;
  private playerTimeSlots: number[][] = [];
  private playBitStartTime: number = 0;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    if (this.player) {
      this.player.dispose();
    }
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('playerConfig') && this.playerConfig) {
      if (typeof this.playerConfig === 'string') {
        try {
          this.playerConfig = JSON.parse(this.playerConfig);
        } catch (e) {
          console.error('Invalid playerConfig: ', e);
        }
      }
      this.initTelemetry();
      this.initVideoPlayer();
    }
    if (changedProperties.has('action') && this.action && this.player) {
      if (this.action.name === 'play') {
        this.play();
      } else if (this.action.name === 'pause') {
        this.pause();
      }
    }
  }

  private initTelemetry() {
    if (!this.playerConfig || !this.playerConfig.context || this.isTelemetryInitialized) return;

    try {
      if (!window.$t && typeof $t.initialize === 'function') {
         $t.initialize(this.playerConfig.context.telemetry);
      }
      this.telemetryService = window.$t || $t;
      this.isTelemetryInitialized = true;
      this.traceId = this.playerConfig.config?.traceId || '';
    } catch (e) {
      console.error('Error initializing telemetry', e);
    }
  }

  private initVideoPlayer() {
    if (!this.playerConfig || !this.playerConfig.metadata) return;

    if (this.player) {
      // Lit doesn't re-render the video tag if disposed, so we just return if player exists
      // If we want to support full re-init, we'd need to manually recreate the <video> tag
      this.player.dispose();
      this.player = null;

      const container = this.querySelector('.sb-video-player-container');
      if (container) {
          container.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
      }
    }

    // Refresh query selector after injection
    const videoEl = this.querySelector('.video-js');
    if (!videoEl) return;

    const metadata = this.playerConfig.metadata;
    const streamingUrl = metadata.streamingUrl;
    const artifactUrl = metadata.artifactUrl;
    const isAvailableLocally = metadata.isAvailableLocally;

    let src = artifactUrl;
    let type = metadata.mimeType;

    if (isAvailableLocally) {
      const basePath = streamingUrl ? streamingUrl : (metadata.basePath || metadata.baseDir);
      src = `${basePath}/${artifactUrl}`;
    } else if (streamingUrl) {
      src = streamingUrl;
      type = 'application/x-mpegURL';
    }

    const options = {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      sources: [{ src, type }],
      html5: {
        hls: {
          overrideNative: true
        }
      }
    };

    this.player = videojs(videoEl, options, () => {
      if (typeof this.player.qualityLevels === 'function') {
        if (typeof this.player.httpSourceSelector === 'function') {
          this.player.httpSourceSelector({ default: 'auto' });
        }
      }

      this.addCustomControls();
      this.registerEvents();
      this.handleTranscripts(metadata.transcripts);

      // Init markers if present
      const interceptionPoints = metadata.interceptionPoints;
      if (interceptionPoints && interceptionPoints.items && typeof this.player.markers === 'function') {
          const markersList = interceptionPoints.items.map((item: any) => ({
             time: item.interceptionPoint,
             text: item.identifier,
             type: item.type
          }));
          this.player.markers({
            markers: markersList,
            markerStyle: {
               'width': '8px',
               'border-radius': '30%',
               'background-color': 'red'
            },
            onMarkerReached: (marker: any) => {
               this.triggerTelemetryHeartbeat('VIDEO_MARKER_SELECTED', {
                  identifier: marker.text,
                  type: marker.type,
                  interceptedAt: marker.time
               });
            }
          });
      }

      // Raise start event
      this.raiseStartEvent();
    });
  }

  private addCustomControls() {
    const Button = videojs.getComponent('Button');

    class BackwardButton extends Button {
      constructor(player: any, options: any) {
        super(player, options);
        this.controlText('Backward 10s');
      }
      buildCSSClass() {
        return `vjs-icon-replay ${super.buildCSSClass()}`;
      }
      handleClick() {
        const currentTime = player.currentTime();
        player.currentTime(Math.max(0, currentTime - 10));
      }
    }

    class ForwardButton extends Button {
      constructor(player: any, options: any) {
        super(player, options);
        this.controlText('Forward 10s');
      }
      buildCSSClass() {
        return `vjs-icon-forward ${super.buildCSSClass()}`;
      }
      handleClick() {
        const currentTime = player.currentTime();
        player.currentTime(Math.min(player.duration(), currentTime + 10));
      }
    }

    videojs.registerComponent('BackwardButton', BackwardButton);
    videojs.registerComponent('ForwardButton', ForwardButton);

    this.player.getChild('controlBar').addChild('BackwardButton', {}, 1);
    this.player.getChild('controlBar').addChild('ForwardButton', {}, 2);
  }

  private handleTranscripts(transcripts: any[]) {
    if (transcripts && transcripts.length > 0) {
      transcripts.forEach((transcript) => {
        this.player.addRemoteTextTrack({
          kind: 'subtitles',
          src: transcript.artifactUrl,
          srclang: transcript.languageCode,
          label: transcript.language,
          default: transcript.default || false
        }, false);
      });

      this.player.textTracks().on('change', () => {
        const tracks = this.player.textTracks();
        let selectedTrack = null;
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].mode === 'showing') {
            selectedTrack = tracks[i];
            break;
          }
        }
        if (selectedTrack) {
          this.triggerTelemetryHeartbeat('TRANSCRIPT_LANGUAGE_SELECTED', {
            language: selectedTrack.label,
            videoTimeStamp: this.player.currentTime()
          });
        } else {
          this.triggerTelemetryHeartbeat('TRANSCRIPT_LANGUAGE_OFF', {
            videoTimeStamp: this.player.currentTime()
          });
        }
      });
    }
  }

  private registerEvents() {
    const events = [
      'loadstart', 'play', 'pause', 'error', 'playing',
      'progress', 'seeked', 'seeking', 'volumechange',
      'ratechange', 'timeupdate', 'ended', 'fullscreenchange',
      'durationchange'
    ];

    events.forEach(eventType => {
      this.player.on(eventType, (data: any) => {
        this.handleVideoControls(eventType, data);
        this.dispatchEvent(new CustomEvent('playerEvent', {
          detail: { type: eventType, data },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  private handleVideoControls(type: string, data: any) {
    if (type === 'durationchange') {
       if (this.totalDuration === 0) {
         this.totalDuration = this.player.duration();
       }
    }
    if (type === 'play') {
       this.triggerTelemetryHeartbeat('PLAY');
       this.playBitStartTime = this.player.currentTime();
    }
    if (type === 'pause') {
       this.triggerTelemetryHeartbeat('PAUSE');
       this.playerTimeSlots.push([this.playBitStartTime, this.player.currentTime()]);
    }
    if (type === 'ended') {
       this.playerTimeSlots.push([this.playBitStartTime, this.player.duration()]);
       this.raiseEndEvent();
    }
    if (type === 'fullscreenchange') {
      this.triggerTelemetryHeartbeat('FULLSCREEN');
    }
    if (type === 'ratechange') {
      this.triggerTelemetryHeartbeat('RATE_CHANGE');
    }
    if (type === 'volumechange') {
      this.triggerTelemetryHeartbeat('VOLUME_CHANGE');
    }
    if (type === 'timeupdate') {
      this.previousTime = this.player.currentTime();
    }
    if (type === 'seeking') {
      if (this.seekStart === null) {
        this.seekStart = this.previousTime;
      }
    }
    if (type === 'seeked') {
      const currentTime = this.player.currentTime();
      if (this.seekStart !== null) {
        if (currentTime > this.seekStart) {
          this.totalSeekedLength += (currentTime - this.seekStart);
        } else if (this.seekStart > currentTime) {
          this.totalSeekedLength += (this.seekStart - currentTime);
        }
      }
      this.seekStart = null;
    }
    if (type === 'error') {
      this.raiseErrorEvent(data);
    }
  }

  private triggerTelemetryHeartbeat(type: string, extra?: any) {
    const event = {
      eid: 'HEARTBEAT',
      edata: {
        type,
        currentPage: 'videostage',
        extra
      }
    };
    if (this.telemetryService && this.telemetryService.interact) {
       this.telemetryService.interact(event.edata);
    }
    this.dispatchEvent(new CustomEvent('telemetryEvent', {
      detail: event,
      bubbles: true,
      composed: true
    }));
  }

  private raiseStartEvent() {
    this.startTime = new Date().getTime();
    const event = {
      eid: 'START',
      edata: {
        type: 'START',
        mode: 'play',
        duration: 0
      }
    };
    if (this.telemetryService && this.telemetryService.start) {
       this.telemetryService.start(event.edata);
    }
    this.dispatchEvent(new CustomEvent('telemetryEvent', {
      detail: event,
      bubbles: true,
      composed: true
    }));
  }

  private raiseEndEvent() {
    const duration = new Date().getTime() - this.startTime;
    let visitedLength = 0;

    // Calculate visited length approximately based on time slots
    const secondsList: number[] = [];
    for (const slot of this.playerTimeSlots) {
        if(slot[0] < slot[1]) {
          let sec = slot[0];
          while (sec <= slot[1]) {
            sec = Math.floor(sec);
            if(sec !== 0) {
              secondsList.push(sec);
            }
            sec += 1;
          }
        }
    }
    visitedLength = secondsList.length;

    const event = {
      eid: 'END',
      edata: {
        type: 'END',
        currentTime: this.player.currentTime(),
        totalTime: this.totalDuration,
        duration
      }
    };

    if (this.telemetryService && this.telemetryService.end) {
       this.telemetryService.end(event.edata);
    }
    this.dispatchEvent(new CustomEvent('telemetryEvent', {
      detail: event,
      bubbles: true,
      composed: true
    }));
  }

  private raiseErrorEvent(errorData: any) {
    const event = {
      eid: 'ERROR',
      edata: {
        err: 'VIDEO_PLAY_ERROR',
        errtype: 'CONTENT',
        requestid: this.traceId || '',
        stacktrace: errorData ? JSON.stringify(errorData) : '',
      }
    };
    if (this.telemetryService && this.telemetryService.error) {
       this.telemetryService.error(event.edata);
    }
    this.dispatchEvent(new CustomEvent('telemetryEvent', {
      detail: event,
      bubbles: true,
      composed: true
    }));
  }

  public play() {
    if (this.player) {
      this.player.play();
    }
  }

  public pause() {
    if (this.player) {
      this.player.pause();
    }
  }

  render() {
    return html`
      <div class="relative w-full h-full bg-black text-white sb-video-player-container">
        <video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>
      </div>
    `;
  }
}
