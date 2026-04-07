# Sunbird Video Player

A web component based on Lit for playing video content within the Sunbird ecosystem. It replaces the old Angular-based implementation, bringing better performance, smaller bundle sizes, and framework agnosticism.

## Features

- **Video.js Integration:** Reliable and customizable video playback.
- **HLS Support:** Plays `application/x-mpegURL` seamlessly.
- **Telemetry Integration:** Fully integrated with `@project-sunbird/telemetry-sdk` for events like `START`, `END`, `HEARTBEAT`, and `ERROR`.
- **Custom UI Overlays:** Built-in Sidebar, Error Page, and End Page using Tailwind CSS.
- **Markers & Interception Points:** Visual markers on the timeline that trigger telemetry events.

## Installation

```bash
npm install
```

## Development

Start the development server with live reload:

```bash
npx vite
```

The component can be tested and viewed using `index.html` as the entry point.

## Build

To build the project for production:

```bash
npx vite build
```

This will output the compiled Web Component files in the `dist` directory.

## Usage

Include the compiled Web Component script and CSS in your HTML file:

```html
<script type="module" src="path/to/dist/sunbird-video-player-wc.es.js"></script>
<link rel="stylesheet" href="path/to/dist/sunbird-video-player-wc-lit.css">
```

Then, use the custom element in your DOM:

```html
<sunbird-video-player></sunbird-video-player>
```

### Properties

The component accepts the following properties (can be passed as objects or JSON strings):

*   `playerConfig`: Configuration object for the player (metadata, telemetry context, etc.).
*   `action`: Action object to trigger specific behaviors (e.g., `{ name: 'play' }` or `{ name: 'pause' }`).

**Example Setup:**

```javascript
const player = document.querySelector('sunbird-video-player');

player.playerConfig = {
  context: {
    telemetry: { /* telemetry config */ }
  },
  config: {
    traceId: "12345"
  },
  metadata: {
    name: "Sample Video",
    artifactUrl: "https://example.com/video.mp4",
    mimeType: "video/mp4",
    isAvailableLocally: false
  }
};
```

## Migration from Angular

This Lit-based web component is designed to fully replace the old Angular library. All previous Angular code has been removed from this repository.
