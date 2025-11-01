# Typing Speed Race

![Typing Speed Race Screenshot](https://storage.googleapis.com/aistudio-hosting/project-assets/56f70933-c71b-4171-8742-d63641f02196/typing-race-screenshot.png)

A sleek and modern typing speed test application built with React, TypeScript, and Tailwind CSS. Test your typing skills, track your progress, and race against the clock!

## Features

-   **Dynamic Text Generation**: Fetches random paragraphs from the Google Gemini API for a unique challenge every time.
-   **Real-time Feedback**:
    -   Live Words Per Minute (WPM) calculation.
    -   Live accuracy tracking.
    -   Instant character-by-character highlighting for correct and incorrect inputs.
-   **Interactive Experience**:
    -   Engaging sound effects for starting the race, correct/incorrect keystrokes, and race completion.
    -   A user-friendly mute/unmute option that persists across sessions.
-   **Progress Tracking**: A beautiful and responsive chart visualizes your WPM and accuracy history over time.
-   **Modern UI/UX**: Clean, high-contrast, and responsive design, ensuring a great experience on any device.
-   **Ad Integration**: Ready for monetization with Google AdSense placeholders.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **API**: Google Gemini API for text generation
-   **Charting**: Recharts
-   **Build Tool**: Vite (inferred from `index.html`)

## Getting Started

### Prerequisites

-   Node.js and npm (or yarn)
-   A Google AI API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd typing-speed-race
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the root of your project and add your Google AI API key:

    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

    You can get an API key from [Google AI Studio](https://aistudio.google.com/).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Monetization with Google AdSense

This project is set up with placeholders for Google AdSense. To enable ads:

1.  **Sign up for Google AdSense** and get your publisher ID and ad slot IDs.

2.  **Update `index.html`**:
    Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual AdSense publisher ID in the script tag within the `<head>` section.

    ```html
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossorigin="anonymous"></script>
    ```

3.  **Update Ad Components**:
    In `src/components/AdComponent.tsx`, replace the placeholder `data-ad-client` with your publisher ID and update the `slot` prop in `src/App.tsx` where `<AdComponent />` is used with your ad unit's slot ID.

    ```tsx
    // src/components/AdComponent.tsx
    <ins
      ...
      data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
      data-ad-slot={slot}
      ...
    ></ins>
    ```

    ```tsx
    // src/App.tsx
    <AdComponent slot="YOUR_AD_SLOT_ID" />
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
