# Interactive Line Chart

An interactive line chart application visualizing A/B test statistics, built with React, TypeScript, and Recharts.

## Features

- **Interactive Chart**: Displays conversion rates for multiple variations.
- **Dynamic Axes**: X and Y axes adapt automatically to the visible data range.
- **Controls**:
    - **Variations**: Multi-select dropdown to choose which lines to display.
    - **Time Frame**: Dropdown to toggle between Daily and Weekly views.
    - **Line Style**: Dropdown to switch between Smooth, Linear, and Step lines.
- **Zoom & Pan**:
    - **Zoom In (+)**: Zoom in by 20%.
    - **Zoom Out (-)**: Zoom out by 20%.
    - **Pan (Hand)**: Toggle pan mode to drag the chart view.
    - **Reset**: Restore the full chart view.
- **Export**: Export the current chart view as a PNG image.
- **Responsive Design**: Optimized for screens between 671px and 1300px (and mobile friendly).

## Tech Stack

- **React** (v18+)
- **TypeScript**
- **Vite**
- **Recharts** (Visualization)
- **CSS Modules** (Styling)
- **html2canvas** (Export)

## Setup Instructions

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Build for production:
    ```bash
    npm run build
    ```

## Deployment

The project is configured for deployment on GitHub Pages.
To deploy manually:
```bash
npm run build
npx gh-pages -d dist
```
