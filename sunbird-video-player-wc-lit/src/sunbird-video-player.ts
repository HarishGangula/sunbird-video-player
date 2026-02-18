import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import videojshttpsourceselector from 'videojs-http-source-selector';
import { PlayerConfig, IAction } from './playerInterfaces';
import { ViewerService } from './services/viewer.service';
import { TelemetryService } from './services/telemetry.service';
import { UtilService } from './services/util.service';
import * as _ from 'lodash-es';
import './sunbird-video-player.css';

// Import Video.js CSS
// Note: In a real build, you might need to handle this differently or include it in index.html
// For now we assume Vite handles CSS imports or we add it to the styles
// import 'video.js/dist/video-js.css';

@customElement('sunbird-video-player')
export class SunbirdVideoPlayer extends LitElement {
  @property({ type: Object }) playerConfig: PlayerConfig | undefined;
  @property({ type: Object }) action: IAction | undefined;

  @query('.video-js') videoElement!: HTMLVideoElement;
  @query('.video-container') videoContainer!: HTMLElement;

  @state() showControls = true;
  @state() isPaused = false;
  @state() showPlayButton = true;
  @state() showPauseButton = false;
  @state() showForwardButton = false;
  @state() showBackwardButton = false;
  @state() currentPlayerState = 'none';

  private player: any;
  private viewerService: ViewerService;
  private telemetryService: TelemetryService;
  private utilService: UtilService;
  private unlistenMouseMove: (() => void) | undefined;
  private unlistenTouchStart: (() => void) | undefined;
  private time = 10;
  private startTime: number = 0;
  private totalSpentTime = 0;
  private isAutoplayPrevented = false;
  private setMetaDataConfig = false;
  private totalDuration = 0;
  private sideMenuConfig = {
    showShare: true,
    showDownload: true,
    showReplay: true,
    showExit: true
  };
  private traceId: string = '';

  constructor() {
    super();
    this.utilService = new UtilService();
    this.telemetryService = new TelemetryService();
    this.viewerService = new ViewerService(this.telemetryService, this.utilService);

    // Bind ViewerService events to dispatch to host
    this.viewerService.addEventListener('playerEvent', (e: any) => {
        this.dispatchEvent(new CustomEvent('playerEvent', { detail: e.detail }));
    });
    this.telemetryService.addEventListener('telemetryEvent', (e: any) => {
        this.dispatchEvent(new CustomEvent('telemetryEvent', { detail: e.detail }));
    });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="video-container" @mousemove=${this.onMouseMove} @touchstart=${this.onTouchStart}>
        <video class="video-js vjs-default-skin vjs-big-play-centered"></video>

        ${this.showControls ? html`
        <div class="player-overlay">
            <div class="controls-container">
                 ${this.showBackwardButton ? html`
                    <button class="control-btn" @click=${this.backward}>
                        <span>&#9104;</span>
                    </button>
                 ` : ''}

                 ${this.showPlayButton ? html`
                    <button class="control-btn" @click=${this.play}>
                        <span>&#9654;</span>
                    </button>
                 ` : ''}

                 ${this.showPauseButton ? html`
                    <button class="control-btn" @click=${this.pause}>
                        <span>&#10074;&#10074;</span>
                    </button>
                 ` : ''}

                 ${this.showForwardButton ? html`
                    <button class="control-btn" @click=${this.forward}>
                        <span>&#9105;</span>
                    </button>
                 ` : ''}
            </div>
        </div>

        <div class="side-menu">
            ${this.sideMenuConfig.showExit ? html`
                <button class="menu-btn" @click=${this.exit}>Exit</button>
            ` : ''}
            ${this.sideMenuConfig.showDownload ? html`
                <button class="menu-btn" @click=${this.download}>Download</button>
            ` : ''}
            ${this.sideMenuConfig.showReplay ? html`
                <button class="menu-btn" @click=${this.replay}>Replay</button>
            ` : ''}
        </div>
        ` : ''}
      </div>
    `;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('playerConfig') && this.playerConfig) {
      if (typeof this.playerConfig === 'string') {
        try {
          this.playerConfig = JSON.parse(this.playerConfig);
        } catch (error) {
          console.error('Invalid playerConfig: ', error);
        }
      }
      if (this.playerConfig) {
        this.initializePlayer();
      }
    }

    if (changedProperties.has('action') && this.action && this.player) {
         if (this.action.name === 'play') {
             this.play();
         } else if (this.action.name === 'pause') {
             this.pause();
         }
    }
  }

  firstUpdated() {
    // Wait for playerConfig
  }

  initializePlayer() {
    if (!this.playerConfig) return;

    this.sideMenuConfig = { ...this.sideMenuConfig, ...this.playerConfig.config.sideMenu };
    this.traceId = this.playerConfig.config['traceId'];

    this.viewerService.initialize(this.playerConfig);

    this.viewerService.getPlayerOptions().then(options => {
        if (this.player) {
            this.player.dispose();
        }

        this.player = videojs(this.videoElement, {
            fluid: true,
            responsive: true,
            sources: options,
            autoplay: true,
            muted: _.get(this.playerConfig, 'config.muted'),
            playbackRates: [0.5, 1, 1.5, 2],
            controlBar: {
                children: ['playToggle', 'volumePanel', 'durationDisplay',
                    'progressControl', 'remainingTimeDisplay',
                    'playbackRateMenuButton', 'fullscreenToggle']
            },
            plugins: {
                httpSourceSelector: {
                    default: 'low'
                }
            },
            html5: {
                hls: {
                    overrideNative: true
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false,
            }
        }, () => {
             // Player ready
        });

        // Initialize plugins
        if (this.player.videojshttpsourceselector) {
            this.player.videojshttpsourceselector = videojshttpsourceselector;
            this.player.videojshttpsourceselector();
        }

        this.registerEvents();
        this.viewerService.playerInstance = this.player;
    });

    // Auto hide controls logic
    setInterval(() => {
        if (!this.isPaused && !this.isAutoplayPrevented) {
             this.showControls = false;
        }
    }, 5000);
  }

  registerEvents() {
      const events = ['loadstart', 'play', 'pause', 'error', 'playing', 'progress', 'seeked', 'seeking', 'volumechange', 'ratechange', 'ended', 'timeupdate'];

      this.player.on('fullscreenchange', () => {
         this.viewerService.raiseHeartBeatEvent('FULLSCREEN');
      });

      this.player.on('ratechange', () => {
        this.viewerService.metaData.playBackSpeeds.push(this.player.playbackRate());
      });

      this.player.on('volumechange', () => {
        this.viewerService.metaData.volume.push(this.player.volume());
        this.viewerService.metaData.muted = this.player.muted();
      });

      this.player.on('play', () => {
          this.currentPlayerState = 'play';
          this.showPauseButton = true;
          this.showPlayButton = false;
          this.isPaused = false;
          this.viewerService.raiseHeartBeatEvent('PLAY');
          this.isAutoplayPrevented = false;
          this.toggleForwardRewindButton();
      });

      this.player.on('pause', () => {
        this.currentPlayerState = 'pause';
        this.showPauseButton = false;
        this.showPlayButton = true;
        this.isPaused = true;
        this.showControls = true;
        this.viewerService.raiseHeartBeatEvent('PAUSE');
        this.toggleForwardRewindButton();
      });

      this.player.on('timeupdate', () => {
        this.viewerService.metaData.currentDuration = this.player.currentTime();
        this.handleVideoControls({ type: 'timeupdate' });
        this.dispatchEvent(new CustomEvent('playerEvent', { detail: { type: 'timeupdate', currentTime: this.player.currentTime() } }));

        this.viewerService.currentlength = this.viewerService.metaData.currentDuration;

        this.totalSpentTime += new Date().getTime() - this.startTime;
        this.startTime = new Date().getTime();

        const remainingTime = Math.floor(this.totalDuration - this.player.currentTime());
        if (remainingTime <= 0 && this.totalDuration > 0) {
            this.viewerService.metaData.currentDuration = 0;
            this.handleVideoControls({ type: 'ended' });
            this.dispatchEvent(new CustomEvent('playerEvent', { detail: { type: 'ended' } }));
        }
      });

      this.player.on('durationchange', (data: any) => {
          if (this.totalDuration === 0) {
             this.totalDuration = this.player.duration();
             this.viewerService.metaData.totalDuration = this.totalDuration;
             this.dispatchEvent(new CustomEvent('playerEvent', { detail: { type: 'durationchange', duration: this.totalDuration } }));
          }
      });

      events.forEach(event => {
          this.player.on(event, (data: any) => {
              this.handleVideoControls({ type: event });
              // this.dispatchEvent(new CustomEvent('playerEvent', { detail: { type: event, ...data } }));
          });
      });

      // Handle initial play promise
      const promise = this.player.play();
      if (promise !== undefined) {
        promise.catch((error: any) => {
          this.isAutoplayPrevented = true;
          this.showControls = true;
        });
      }
  }

  handleVideoControls(event: any) {
      const type = event.type;
      if (type === 'playing') {
          this.showPlayButton = false;
          this.showPauseButton = true;
          if (this.setMetaDataConfig) {
              this.setMetaDataConfig = false;
              this.setPreMetaDataConfig();
          }
      }
      if (type === 'ended') {
          this.viewerService.endPageSeen = true;
          this.viewerService.raiseEndEvent();
          // Reset logic or show end screen?
          // Angular shows end page. We just emit end event for now.
      }
      if (type === 'loadstart') {
        this.startTime = new Date().getTime();
        this.setMetaDataConfig = true;
        this.viewerService.raiseStartEvent(event);
      }
      // ... more logic from ViewerService can be moved here or kept in ViewerService
      // Specifically calculating seeked length, visited length etc is in ViewerService/Component

      // Update metadata actions
      if (['play', 'pause', 'ended', 'seeked'].includes(type)) {
          const action: any = {};
          action[type] = this.player.currentTime();
          this.viewerService.metaData.actions.push(action);
      }
  }

  setPreMetaDataConfig() {
      if (this.playerConfig && !_.isEmpty(_.get(this.playerConfig, 'config.volume'))) {
        this.player.volume(_.last(_.get(this.playerConfig, 'config.volume')));
      }
      if (this.playerConfig && _.get(this.playerConfig, 'config.currentDuration')) {
        this.player.currentTime(_.get(this.playerConfig, 'config.currentDuration'));
      }
      if (this.playerConfig && !_.isEmpty(_.get(this.playerConfig, 'config.playBackSpeeds'))) {
        this.player.playbackRate(_.last(_.get(this.playerConfig, 'config.playBackSpeeds')));
      }
  }

  toggleForwardRewindButton() {
      this.showForwardButton = true;
      this.showBackwardButton = true;
      if ((this.player.currentTime() + this.time) > this.totalDuration) {
          this.showForwardButton = false;
      }
      if ((this.player.currentTime() - this.time) < 0) {
          this.showBackwardButton = false;
      }
  }

  play() {
      if (this.player) {
          this.player.play();
      }
  }

  pause() {
      if (this.player) {
          this.player.pause();
      }
  }

  backward() {
      if (this.player) {
          this.player.currentTime(this.player.currentTime() - this.time);
          this.viewerService.raiseHeartBeatEvent('BACKWARD');
      }
  }

  forward() {
      if (this.player) {
          this.player.currentTime(this.player.currentTime() + this.time);
          this.viewerService.raiseHeartBeatEvent('FORWARD');
      }
  }

  exit() {
      this.viewerService.raiseHeartBeatEvent('EXIT');
      this.dispatchEvent(new CustomEvent('playerEvent', { detail: { type: 'EXIT' } }));
  }

  download() {
      const a = document.createElement('a');
      a.href = this.viewerService.artifactUrl;
      a.download = this.viewerService.contentName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
      this.viewerService.raiseHeartBeatEvent('DOWNLOAD');
  }

  replay() {
      this.player.currentTime(0);
      this.player.play();
      this.viewerService.raiseHeartBeatEvent('REPLAY');
  }

  onMouseMove() {
      this.showControls = true;
  }

  onTouchStart() {
      this.showControls = true;
  }

  disconnectedCallback() {
      super.disconnectedCallback();
      if (this.player) {
          this.player.dispose();
      }
      // Clean up listeners if any
  }
}
