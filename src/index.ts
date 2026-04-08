import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
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

  @state() viewState: 'player' | 'end' = 'player';
  @state() showSidebar: boolean = false;
  @state() showError: boolean = false;


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

      const wrapper = this.querySelector('.video-wrapper');
      if (wrapper) {
          wrapper.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
      }
    }

    const wrapper = this.querySelector('.video-wrapper');
    if (wrapper && !this.querySelector('.video-js')) {
      wrapper.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
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
        const currentTime = this.player().currentTime();
        this.player().currentTime(Math.max(0, currentTime - 10));
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
        const currentTime = this.player().currentTime();
        this.player().currentTime(Math.min(this.player().duration(), currentTime + 10));
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
       this.viewState = 'end';
       this.showSidebar = false;
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
      this.showError = true;
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


  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  downloadVideo() {
    const artifactUrl = this.playerConfig?.metadata?.artifactUrl;
    const contentName = this.playerConfig?.metadata?.name || 'Video';
    if (artifactUrl) {
      const a = document.createElement('a');
      a.href = artifactUrl;
      a.download = contentName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.triggerTelemetryHeartbeat('DOWNLOAD');
    }
  }

  shareVideo() {
    this.triggerTelemetryHeartbeat('SHARE');
    this.dispatchEvent(new CustomEvent('playerEvent', {
      detail: { type: 'SHARE' },
      bubbles: true,
      composed: true
    }));
  }

  replayVideo() {
    this.viewState = 'player';
    this.showSidebar = false;
    this.triggerTelemetryHeartbeat('REPLAY');
    this.dispatchEvent(new CustomEvent('playerEvent', {
      detail: { type: 'REPLAY' },
      bubbles: true,
      composed: true
    }));
    setTimeout(() => {
      this.initVideoPlayer();
      if (this.player) {
        this.player.play();
      }
    }, 0);
  }

  exitVideo() {
    this.triggerTelemetryHeartbeat('EXIT');
    this.dispatchEvent(new CustomEvent('playerEvent', {
      detail: { type: 'EXIT' },
      bubbles: true,
      composed: true
    }));
  }

  formatTime(seconds: number) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  render() {
    return html`
      <div class="relative w-full h-full bg-black text-white sb-video-player-container overflow-hidden">

        <div class="video-wrapper w-full h-full" style="display: ${this.viewState === 'player' ? 'block' : 'none'};">
        </div>

        ${this.viewState === 'player' ? html`
          <button class="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors" @click=${this.toggleSidebar}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        ` : ''}

        ${this.showSidebar && this.viewState === 'player' ? html`
          <div class="absolute top-0 left-0 h-full w-64 bg-gray-900/95 z-50 p-4 shadow-lg flex flex-col transform transition-transform">
            <button class="self-end p-2 mb-4 hover:bg-gray-800 rounded-full" @click=${this.toggleSidebar}>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 class="text-lg font-bold mb-6 border-b border-gray-700 pb-2">${this.playerConfig?.metadata?.name || 'Video Player'}</h2>

            <button class="flex items-center gap-3 w-full p-3 hover:bg-gray-800 rounded-lg text-left mb-2 transition-colors" @click=${this.downloadVideo}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download
            </button>

            <button class="flex items-center gap-3 w-full p-3 hover:bg-gray-800 rounded-lg text-left mb-2 transition-colors" @click=${this.shareVideo}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Share
            </button>

            <button class="flex items-center gap-3 w-full p-3 hover:bg-gray-800 rounded-lg text-left mb-2 transition-colors" @click=${this.replayVideo}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Replay
            </button>

            <button class="flex items-center gap-3 w-full p-3 hover:bg-gray-800 rounded-lg text-left transition-colors" @click=${this.exitVideo}>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Exit
            </button>
          </div>
        ` : ''}

        ${this.viewState === 'end' ? html`
          <div class="absolute inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6">
             <h2 class="text-2xl font-bold mb-2">You just completed</h2>
             <h3 class="text-xl mb-6 text-gray-300">${this.playerConfig?.metadata?.name || 'Video'}</h3>

             <div class="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 flex flex-col items-center w-full max-w-md">
                <div class="text-4xl font-bold mb-2">${this.formatTime(this.totalDuration)}</div>
                <div class="text-gray-400 uppercase tracking-wide text-sm">Time Spent</div>
             </div>

             <div class="flex gap-4">
               <button class="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-semibold transition-colors" @click=${this.replayVideo}>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Replay
               </button>
               <button class="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-semibold transition-colors" @click=${this.exitVideo}>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Exit
               </button>
             </div>
          </div>
        ` : ''}

        ${this.showError ? html`
          <div class="absolute inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-center">
             <div class="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h2 class="text-xl font-bold mb-2">Unable to play video</h2>
             <p class="text-gray-400 mb-6">There was an error loading the video content. Please try again later.</p>
             <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors" @click=${() => this.showError = false}>Close</button>
          </div>
        ` : ''}
      </div>
    `;
  }
}
