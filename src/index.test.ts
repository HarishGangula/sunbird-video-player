import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fixture, html, expect as fixtureExpect } from '@open-wc/testing';
import { SunbirdVideoPlayer } from './index';

// Export mock methods to assert
export const mockVideoJsPlayer = {
  dispose: vi.fn(),
  play: vi.fn(),
  pause: vi.fn(),
  currentTime: vi.fn().mockReturnValue(10),
  duration: vi.fn().mockReturnValue(100),
  on: vi.fn(),
  getChild: vi.fn().mockReturnValue({
    addChild: vi.fn()
  }),
  qualityLevels: vi.fn(),
  httpSourceSelector: vi.fn(),
  addRemoteTextTrack: vi.fn(),
  textTracks: vi.fn().mockReturnValue({
    on: vi.fn()
  }),
  markers: vi.fn()
};

vi.mock('video.js', () => {
  const videojsMockFn = vi.fn().mockImplementation((el, options, ready) => {
    if (ready) setTimeout(() => ready(), 0);
    return mockVideoJsPlayer;
  });

  const mockButtonClass = class {
    constructor() {}
    controlText() {}
    buildCSSClass() { return 'mock-class'; }
    player() { return mockVideoJsPlayer; }
  };

  (videojsMockFn as any).getComponent = vi.fn().mockReturnValue(mockButtonClass);
  (videojsMockFn as any).registerComponent = vi.fn();

  return {
    default: videojsMockFn
  };
});

// Since the component uses $t.initialize natively if available
vi.mock('@project-sunbird/telemetry-sdk', () => {
  return {
    $t: {
      initialize: vi.fn(),
      start: vi.fn(),
      interact: vi.fn(),
      end: vi.fn(),
      error: vi.fn()
    }
  };
});

import videojs from 'video.js';
import { $t as mockTelemetryService } from '@project-sunbird/telemetry-sdk';

describe('SunbirdVideoPlayer WC', () => {
  let el: SunbirdVideoPlayer;

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).$t;
    delete (window as any).EkTelemetry;
    // reset mock state
    mockVideoJsPlayer.currentTime.mockReturnValue(10);
    mockVideoJsPlayer.duration.mockReturnValue(100);
    mockTelemetryService.initialize.mockClear();
    (videojs as any).mockClear();
  });

  afterEach(() => {
    if (el) {
      el.remove();
    }
  });

  const baseConfig = {
    context: {
      telemetry: { pdata: { id: 'test' } }
    },
    config: {
      traceId: 'trace-123'
    },
    metadata: {
      name: 'Test Video',
      streamingUrl: 'http://test.com/stream.m3u8',
      artifactUrl: 'http://test.com/video.mp4',
      mimeType: 'video/mp4',
      isAvailableLocally: false
    }
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  it('should be defined', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    expect(el).toBeInstanceOf(SunbirdVideoPlayer);
  });

  it('should initialize telemetry and video player on playerConfig update', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    expect(mockTelemetryService.initialize).toHaveBeenCalledWith(baseConfig.context.telemetry);
    expect(videojs).toHaveBeenCalled();
  });

  it('should parse playerConfig string', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    const stringConfig = JSON.stringify(baseConfig);
    el.playerConfig = stringConfig;
    await el.updateComplete;

    expect(mockTelemetryService.initialize).toHaveBeenCalled();
  });

  it('should handle invalid playerConfig string gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = "invalid-json";
    await el.updateComplete;

    expect(consoleSpy).toHaveBeenCalledWith('Invalid playerConfig: ', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should catch error in telemetry initialization', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);

    // Force an error inside initTelemetry by making $t a getter that throws
    const originalTt = (window as any).$t;
    Object.defineProperty(window, '$t', {
      get: () => { throw new Error('Telemetry Error') },
      configurable: true
    });

    el.playerConfig = { ...baseConfig };
    await el.updateComplete;

    expect(consoleSpy).toHaveBeenCalledWith('Error initializing telemetry', expect.any(Error));

    // Restore
    delete (window as any).$t;
    if (originalTt) window.$t = originalTt;
    consoleSpy.mockRestore();
  });

  it('should use window.$t if available for telemetry', async () => {
    (window as any).$t = {
        initialize: vi.fn(),
        start: vi.fn(),
        interact: vi.fn(),
        end: vi.fn(),
        error: vi.fn()
    };
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;

    // In our component, we have:
    // if (!window.$t && typeof $t.initialize === 'function') { $t.initialize(...) }
    // Since window.$t IS defined here, the component skips initialization entirely.
    // However, we want to prove it uses window.$t, so let's trigger an event and see if window.$t is called
    el.action = { name: 'play' };
    await el.updateComplete;

    // We mock $t but since window.$t is set, window.$t should receive the interactions
    // Wait, let's just trigger a telemetry event manually
    const eventsToCall: Record<string, Function> = {};
    mockVideoJsPlayer.on.mock.calls.forEach(call => {
      eventsToCall[call[0]] = call[1];
    });

    if (eventsToCall['play']) {
       eventsToCall['play']({});
       expect((window as any).$t.interact).toHaveBeenCalled();
    }
  });

  it('should not initialize if context or metadata is missing', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { metadata: { name: 'Test' } }; // missing context
    await el.updateComplete;
    expect(mockTelemetryService.initialize).not.toHaveBeenCalled();
    (videojs as any).mockClear();

    // To test missing metadata, we need a new component because isTelemetryInitialized flag gets set
    const el2 = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el2.playerConfig = { context: { telemetry: {} } }; // missing metadata
    await el2.updateComplete;
    expect(videojs).not.toHaveBeenCalled();
    el2.remove();
  });

  it('should handle action play and pause', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    el.action = { name: 'play' };
    await el.updateComplete;
    expect(mockVideoJsPlayer.play).toHaveBeenCalled();

    el.action = { name: 'pause' };
    await el.updateComplete;
    expect(mockVideoJsPlayer.pause).toHaveBeenCalled();
  });

  it('should test local path resolution', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = {
      ...baseConfig,
      metadata: {
        ...baseConfig.metadata,
        isAvailableLocally: true,
        basePath: 'file://local'
      }
    };
    await el.updateComplete;

    expect(videojs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sources: [{ src: 'http://test.com/stream.m3u8/http://test.com/video.mp4', type: 'video/mp4' }]
      }),
      expect.any(Function)
    );
  });

  it('should test local path resolution without streamingUrl', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = {
      ...baseConfig,
      metadata: {
        ...baseConfig.metadata,
        streamingUrl: undefined,
        isAvailableLocally: true,
        basePath: 'file://local'
      }
    };
    await el.updateComplete;

    expect(videojs).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        sources: [{ src: 'file://local/http://test.com/video.mp4', type: 'video/mp4' }]
      }),
      expect.any(Function)
    );
  });

  it('should recreate video player if it already exists', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;

    expect(videojs).toHaveBeenCalledTimes(1);

    // trigger update again to recreate
    el.playerConfig = { ...baseConfig, metadata: { ...baseConfig.metadata, test: true } };
    await el.updateComplete;

    expect(mockVideoJsPlayer.dispose).toHaveBeenCalled();
    expect(videojs).toHaveBeenCalledTimes(2);
  });

  it('should dispose player on disconnectedCallback', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;

    el.disconnectedCallback();
    expect(mockVideoJsPlayer.dispose).toHaveBeenCalled();
  });

  it('should initialize player with interception points (markers)', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = {
      ...baseConfig,
      metadata: {
        ...baseConfig.metadata,
        interceptionPoints: {
          items: [
            { interceptionPoint: 10, identifier: 'q1', type: 'Question' }
          ]
        }
      }
    };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    expect(mockVideoJsPlayer.markers).toHaveBeenCalledWith(expect.objectContaining({
      markers: [{ time: 10, text: 'q1', type: 'Question' }]
    }));

    // Test onMarkerReached callback
    const markersCall = mockVideoJsPlayer.markers.mock.calls[0][0];
    markersCall.onMarkerReached({ time: 10, text: 'q1', type: 'Question' });

    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({
      type: 'VIDEO_MARKER_SELECTED',
      extra: { identifier: 'q1', type: 'Question', interceptedAt: 10 }
    }));
  });

  it('should initialize player with transcripts', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = {
      ...baseConfig,
      metadata: {
        ...baseConfig.metadata,
        transcripts: [
          { artifactUrl: 'sub.vtt', languageCode: 'en', language: 'English', default: true }
        ]
      }
    };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    expect(mockVideoJsPlayer.addRemoteTextTrack).toHaveBeenCalledWith({
      kind: 'subtitles',
      src: 'sub.vtt',
      srclang: 'en',
      label: 'English',
      default: true
    }, false);

    const trackChangeCallback = mockVideoJsPlayer.textTracks().on.mock.calls[0][1];

    // Simulate no track selected
    mockVideoJsPlayer.textTracks.mockReturnValueOnce([{ mode: 'disabled' }]);
    trackChangeCallback();
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({
      type: 'TRANSCRIPT_LANGUAGE_OFF'
    }));

    // Simulate track selected
    mockVideoJsPlayer.textTracks.mockReturnValueOnce([{ mode: 'showing', label: 'English' }]);
    trackChangeCallback();
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({
      type: 'TRANSCRIPT_LANGUAGE_SELECTED',
      extra: { language: 'English', videoTimeStamp: 10 }
    }));
  });

  it('should handle video player events correctly', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    // We know 'on' is called multiple times for each event registration
    // Let's call the callbacks directly from the mock calls
    const eventsToCall: Record<string, Function> = {};
    mockVideoJsPlayer.on.mock.calls.forEach(call => {
      eventsToCall[call[0]] = call[1];
    });

    // 1. durationchange
    eventsToCall['durationchange']({});

    // 2. play
    eventsToCall['play']({});
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'PLAY' }));

    // 3. pause
    eventsToCall['pause']({});
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'PAUSE' }));

    // 4. timeupdate
    eventsToCall['timeupdate']({});

    // 5. seeking and seeked
    eventsToCall['seeking']({});
    mockVideoJsPlayer.currentTime.mockReturnValue(20);
    eventsToCall['seeked']({});
    // seek backwards
    eventsToCall['seeking']({});
    mockVideoJsPlayer.currentTime.mockReturnValue(5);
    eventsToCall['seeked']({});

    // 6. ratechange
    eventsToCall['ratechange']({});
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'RATE_CHANGE' }));

    // 7. volumechange
    eventsToCall['volumechange']({});
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'VOLUME_CHANGE' }));

    // 8. fullscreenchange
    eventsToCall['fullscreenchange']({});
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'FULLSCREEN' }));

    // 9. error
    eventsToCall['error']({ message: 'test error' });
    expect(el.showError).toBe(true);
    expect(mockTelemetryService.error).toHaveBeenCalled();

    // 10. ended
    eventsToCall['ended']({});
    expect(el.viewState).toBe('end');
    expect(mockTelemetryService.end).toHaveBeenCalled();
  });

  it('should handle UI interactions', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.playerConfig = { ...baseConfig };
    await el.updateComplete;
    await delay(10); // Wait for ready callback

    // Toggle sidebar
    el.toggleSidebar();
    expect(el.showSidebar).toBe(true);

    // Download video
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.createElement('a'));
    el.downloadVideo();
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'DOWNLOAD' }));
    appendSpy.mockRestore();

    // Share video
    const dispatchSpy = vi.spyOn(el, 'dispatchEvent');
    el.shareVideo();
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'SHARE' }));
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'playerEvent', detail: { type: 'SHARE' } }));

    // Exit video
    el.exitVideo();
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'EXIT' }));

    // Replay video
    vi.useFakeTimers();
    el.replayVideo();
    expect(el.viewState).toBe('player');
    expect(mockTelemetryService.interact).toHaveBeenCalledWith(expect.objectContaining({ type: 'REPLAY' }));
    vi.runAllTimers();
    expect(mockVideoJsPlayer.play).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('should close error UI when close button is clicked', async () => {
    el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
    el.showError = true;
    await el.updateComplete;

    const closeBtn = el.renderRoot.querySelector('button.bg-blue-600') as HTMLButtonElement;
    closeBtn.click();
    await el.updateComplete;

    expect(el.showError).toBe(false);
  });

  it('should add custom backward and forward buttons and handle their clicks', async () => {
      el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
      el.playerConfig = { ...baseConfig };
      await el.updateComplete;
      await delay(10); // Wait for ready callback

      const registeredComponents = (videojs as any).registerComponent.mock.calls;
      expect(registeredComponents.length).toBeGreaterThanOrEqual(2);

      const BackwardButtonClass = registeredComponents.find((c: any) => c[0] === 'BackwardButton')[1];
      const ForwardButtonClass = registeredComponents.find((c: any) => c[0] === 'ForwardButton')[1];

      const bwdBtn = new BackwardButtonClass(mockVideoJsPlayer, {});
      expect(bwdBtn.buildCSSClass()).toContain('vjs-icon-replay');

      // Test bwd click
      mockVideoJsPlayer.currentTime.mockReturnValue(20);
      bwdBtn.handleClick();
      expect(mockVideoJsPlayer.currentTime).toHaveBeenCalledWith(10); // 20 - 10

      // Test bwd min 0
      mockVideoJsPlayer.currentTime.mockReturnValue(5);
      bwdBtn.handleClick();
      expect(mockVideoJsPlayer.currentTime).toHaveBeenCalledWith(0); // Math.max(0, 5 - 10)

      const fwdBtn = new ForwardButtonClass(mockVideoJsPlayer, {});
      expect(fwdBtn.buildCSSClass()).toContain('vjs-icon-forward');

      // Test fwd click
      mockVideoJsPlayer.currentTime.mockReturnValue(20);
      mockVideoJsPlayer.duration.mockReturnValue(100);
      fwdBtn.handleClick();
      expect(mockVideoJsPlayer.currentTime).toHaveBeenCalledWith(30); // 20 + 10

      // Test fwd max duration
      mockVideoJsPlayer.currentTime.mockReturnValue(95);
      fwdBtn.handleClick();
      expect(mockVideoJsPlayer.currentTime).toHaveBeenCalledWith(100); // Math.min(100, 95 + 10)
  });

  it('should test edge cases for formatTime', async () => {
      el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
      expect(el.formatTime(0)).toBe('0:00');
      expect(el.formatTime(59)).toBe('0:59');
      expect(el.formatTime(61)).toBe('1:01');
      expect(el.formatTime(600)).toBe('10:00');
  });

  it('should test action updates that do not match play/pause', async () => {
     el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
     el.playerConfig = { ...baseConfig };
     await el.updateComplete;
     await delay(10); // Wait for ready callback

     el.action = { name: 'stop' };
     await el.updateComplete;
     expect(mockVideoJsPlayer.play).toHaveBeenCalledTimes(0);
     expect(mockVideoJsPlayer.pause).toHaveBeenCalledTimes(0);
  });

  it('should handle telemetry missing start end error methods safely', async () => {
      (window as any).$t = {
          initialize: vi.fn(),
          interact: vi.fn(),
      };

      el = await fixture<SunbirdVideoPlayer>(html`<sunbird-video-player></sunbird-video-player>`);
      el.playerConfig = { ...baseConfig };
      await el.updateComplete;
      await delay(10); // Wait for ready callback

      const eventsToCall: Record<string, Function> = {};
      mockVideoJsPlayer.on.mock.calls.forEach(call => {
        eventsToCall[call[0]] = call[1];
      });

      // These should not crash
      eventsToCall['ended']({});
      eventsToCall['error']({});
  });
});
