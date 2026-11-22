# ArtMatch

ArtMatch is a small art discovery application built for the Amplitude Customer Success Architect take-home assignment.

The app allows a collector to sign in, discover artwork, like pieces they are interested in, revisit their favorites, and submit a request to contact the artist.

The primary measured journey is:

**Artwork Viewed -> Artwork Liked -> Favorite Selected -> Contact Artist Started -> Contact Requested**

## Tech Stack

- React
- JavaScript
- Vite
- Node.js
- Express
- Amplitude Unified SDK
- Amplitude Node.js SDK

## Running ArtMatch Locally

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository.
2. From the project directory, install dependencies:
    npm install
3. Start the React/Vite frontend:
   npm run dev
4. In a second terminal, start the Express backend:
   node server.js
5. Open the local URL provided by Vite, typically:
   http://localhost:5173
Test Login
- Email: collector@artmatch.com
- Password: art123

## Tracking Plan

The tracking plan follows the collector's journey from artwork discovery through a successful contact request. Events describe meaningful user behavior, while event properties provide context about the artwork involved.

| Event | Properties | Source | Purpose |
| --- | --- | --- | --- |
| `Artwork Viewed` | `artwork_id`, `artwork_title`, `category` | Client | Measures artwork exposure and serves as the entry point to the discovery funnel. |
| `Artwork Liked` | `artwork_id`, `artwork_title`, `category` | Client | Measures which artwork and categories generate collector interest. |
| `Favorite Selected` | `artwork_id`, `artwork_title`, `category` | Client | Measures when a collector returns to a previously liked piece for deeper consideration. |
| `Contact Artist Started` | `artwork_id`, `artwork_title`, `category` | Client | Measures contact intent before the collector submits a request. |
| `Contact Requested` | `artwork_id`, `artwork_title`, `category` | Server | Confirms that the backend successfully received the collector's contact request. |

### Identity

Users may interact with ArtMatch anonymously before signing in. After successful login, the collector is assigned the test user ID `collector-001` so anonymous activity can be associated with the identified user.

The contact request is tracked server-side using the same user ID, allowing the server event to remain part of the same user journey as the client-side events.

### Client vs. Server Tracking

Discovery, likes, favorite selection, and contact intent are tracked client-side because they represent interactions occurring in the browser.

`Contact Requested` is tracked by the Express server only after the contact request reaches the backend successfully. This distinguishes a completed backend action from simply clicking the confirmation button.

Sensitive values such as the collector's email address and password are not included as Amplitude event properties.

## Amplitude Analysis

### Dashboard

The **ArtMatch Product Engagement** dashboard includes:

- **Artwork Discovery to Contact Funnel** — measures conversion across `Artwork Viewed → Artwork Liked → Favorite Selected → Contact Artist Started → Contact Requested`.
- **Artwork Likes by Category** — compares total likes across artwork categories to identify which types of artwork generate the most collector interest.

The current dashboard uses test data generated while validating the application and instrumentation, so conversion rates should not be interpreted as real product performance.

### Guide

The **ArtMatch Favorites Education** guide is a tooltip attached to the Like button.

It is triggered after an `Artwork Viewed` event and explains that liking artwork saves it to Favorites for later review. For this prototype, the guide is available to all test users. In a production implementation, I would use a persistent user property or behavioral audience to suppress this education for collectors who have already demonstrated that they understand the feature.

Guide effectiveness could be evaluated using the existing `Artwork Viewed` and `Artwork Liked` events to compare whether exposed users progress from viewing to liking artwork.

### Session Replay

Session Replay is configured to connect replay activity with the same Amplitude users and events used in the product analytics implementation.

For this test environment, the replay sample rate is **100%** to ensure test sessions are captured. For a high-traffic production environment, I would reduce the sample rate based on traffic volume, cost, diagnostic needs, and the importance of specific user cohorts or journeys.

Form fields and text inputs are masked to protect values such as email addresses and passwords. Artwork images are explicitly unmasked because they are non-sensitive content and provide useful visual context when investigating user behavior.

One replay was used to investigate a funnel drop-off after `Contact Artist Started`. The event timeline showed the collector returning to Favorites and selecting another artwork without completing `Contact Requested`, providing qualitative context for the quantitative funnel drop-off.

## Trade-offs and Shortcuts

ArtMatch was intentionally kept small so development time could be focused on instrumentation, identity, analysis, and the Amplitude implementation rather than application complexity.

- **Authentication is simulated.** The app uses fixed test credentials and a fixed test user ID rather than a production authentication system.
- **No database is used.** Artwork data is stored locally and Favorites exist only in React state, so they reset when the page is refreshed.
- **Artwork discovery is deterministic.** The eight included paintings cycle continuously rather than using a recommendation or ranking algorithm.
- **Contact requests are simulated.** The Express backend receives the request and tracks the successful server-side action, but no email or external artist notification is sent.
- **Artwork is stored locally.** Images and metadata are included with the application rather than retrieved from an external content service.
- **Guide targeting is simplified.** The prototype triggers Favorites education after artwork is viewed. A production implementation could use persistent behavioral/user properties to prevent showing education to users who have already demonstrated familiarity with the feature.
- **Session Replay uses 100% sampling for testing.** This guarantees capture during development but would be reduced for a high-traffic production application.

These choices keep the core journey simple while preserving the areas most relevant to the exercise: client and server instrumentation, identity, funnel analysis, in-app guidance, privacy-conscious Session Replay, and behavioral investigation.