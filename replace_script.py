import re

with open('sunbird-video-player-wc-lit/src/index.ts', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { customElement, property, query } from 'lit/decorators.js';",
    "import { customElement, property, query, state } from 'lit/decorators.js';"
)

# 2. Add state properties
state_props = """
  @state() viewState: 'player' | 'end' = 'player';
  @state() showSidebar: boolean = false;
  @state() showError: boolean = false;
"""
content = content.replace(
    "  @query('.video-js') videoElement!: HTMLVideoElement;",
    "  @query('.video-js') videoElement!: HTMLVideoElement;\n" + state_props
)

# 3. Fix initVideoPlayer wrapper logic
old_init_dom = """      const container = this.querySelector('.sb-video-player-container');
      if (container) {
          container.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
      }"""
new_init_dom = """      const wrapper = this.querySelector('.video-wrapper');
      if (wrapper) {
          wrapper.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
      }"""
content = content.replace(old_init_dom, new_init_dom)

# Add fallback injection if wrapper is there but video is not (first init)
old_refresh = """    // Refresh query selector after injection
    const videoEl = this.querySelector('.video-js');
    if (!videoEl) return;"""
new_refresh = """    const wrapper = this.querySelector('.video-wrapper');
    if (wrapper && !this.querySelector('.video-js')) {
      wrapper.innerHTML = '<video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>';
    }

    // Refresh query selector after injection
    const videoEl = this.querySelector('.video-js');
    if (!videoEl) return;"""
content = content.replace(old_refresh, new_refresh)

# 4. Handle end event to show end page
old_ended = """    if (type === 'ended') {
       this.playerTimeSlots.push([this.playBitStartTime, this.player.duration()]);
       this.raiseEndEvent();
    }"""
new_ended = """    if (type === 'ended') {
       this.playerTimeSlots.push([this.playBitStartTime, this.player.duration()]);
       this.raiseEndEvent();
       this.viewState = 'end';
       this.showSidebar = false;
    }"""
content = content.replace(old_ended, new_ended)

# 5. Handle error event to show error page
old_error = """    if (type === 'error') {
      this.raiseErrorEvent(data);
    }"""
new_error = """    if (type === 'error') {
      this.raiseErrorEvent(data);
      this.showError = true;
    }"""
content = content.replace(old_error, new_error)

# 6. Add UI action methods before render()
methods = """
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

"""
content = content.replace("  render() {", methods + "  render() {")

# 7. Update render method
old_render = """  render() {
    return html`
      <div class="relative w-full h-full bg-black text-white sb-video-player-container">
        <video class="video-js vjs-default-skin vjs-big-play-centered" playsinline></video>
      </div>
    `;
  }"""
new_render = """  render() {
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
  }"""
content = content.replace(old_render, new_render)

with open('sunbird-video-player-wc-lit/src/index.ts', 'w') as f:
    f.write(content)
