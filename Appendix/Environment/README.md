# Environment setup demo using npm + webpack

All book examples use CDN to import D3 and third-party libraries, and the simplest possible site structures, to avoid extra complexity. Real-world projects, however, often use npm packages and bundlers like Webpack to manage dependencies, bundle code, and optimize assets.
This folder demonstrates some D3 apps created for the book in an environment using an npm-based
workflow with Webpack bundling and containers. 
If you are setting up or already use an npm-based workflow, you can use this as a reference for how to structure your D3 project and manage dependencies.

## What to observe in the source files
- Replaced any CDN HTML `<script type="module">` imports or JavaScript `import` imports with npm packages (`d3`, `d3-geo-projection`, `topojson-client`, `d3-inertia`), instead of using the CDN URLs (e.g. `https://cdn.jsdelivr.net/npm/d3@7`).
- Added a local `package.json` and `webpack.config.js` with multiple entry points for the 4 visualizations plus the index page. If you wish to add more visualizations, you can add new entry points in `webpack.config.js` and create a new HTML page for it.
- HTML pages are kept as templates; scripts are injected by Webpack (`HtmlWebpackPlugin`).
- Static assets (CSV, TopoJSON, CSS) are copied to `dist/` so the bundle is container/deploy friendly. You can distribute this app to run in a Docker container (see the `Dockerfile` to configure the nginx server that serves the static site).

## Prerequisites
- You must have Node.js installed. Use version 18+ (LTS).

## How to install the dependencies
Since this is a self-contained npm project, you need to install the dependencies before running the dev server or building the production bundle. The following command installs the dependencies listed in `package.json` and creates a `node_modules/` folder with the packages.

Open a terminal and enter the `Appendix/Environment` folder. From the repository's root folder, run:

```bash
cd Appendix/Environment
npm install
```

## Develop and test the visualizations

You can run a local development server to test the visualizations. The dev server watches for changes in the source files and automatically reloads the page when you save changes. The following command starts the dev server:

```bash
npm run dev
```

Now you can open your browser and go to http://localhost:5173 to see the landing page. You can click on the links to open each visualization.

## Build a production bundle
This step generates a container-friendly static site under `dist/`:

```bash
npm run build
```

Artifacts generated:
- `dist/index.html`, `dist/viz1.html`, `dist/viz2.html`, `dist/viz3.html`, `dist/viz4/index.html`
- Hashed JS bundles under `dist/js/`
- Copied assets under `dist/data/`, `dist/css/`, `dist/viz4/css/`

## Preview the production build
To preview the production build, serve the `dist/` folder. You can use the `preview` script defined in `package.json` to serve the production build with a simple static server:

```bash
npm run preview
```

To view the app, open your browser and navigate to http://localhost:8080

## Container (optional)
A simple `Dockerfile` is provided to serve the production build with nginx. You can then simply drop the container on any host with Docker installed and run it without installing Node.js or any other dependencies.

To build the image, run the following command from the `Appendix/Environment` folder:

```bash
npm run build
docker build -t env-demo .
```

To run the container (assuming that Docker is installed), run the following command:

```bash
docker run --rm -p 8080:80 env-demo
```

Then open http://localhost:8080

Edit `Dockerfile` to change the port or nginx configuration.
