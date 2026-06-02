import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CVksoZrJ.mjs';
import { manifest } from './manifest_DT6XjPg4.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/api/plant.astro.mjs');
const _page4 = () => import('./pages/archives/_slug_.astro.mjs');
const _page5 = () => import('./pages/archives.astro.mjs');
const _page6 = () => import('./pages/community.astro.mjs');
const _page7 = () => import('./pages/gallery/_slug_.astro.mjs');
const _page8 = () => import('./pages/gallery.astro.mjs');
const _page9 = () => import('./pages/garden.astro.mjs');
const _page10 = () => import('./pages/lab/_slug_.astro.mjs');
const _page11 = () => import('./pages/lab.astro.mjs');
const _page12 = () => import('./pages/library/_slug_.astro.mjs');
const _page13 = () => import('./pages/library.astro.mjs');
const _page14 = () => import('./pages/now.astro.mjs');
const _page15 = () => import('./pages/rss.xml.astro.mjs');
const _page16 = () => import('./pages/system.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/api/plant.ts", _page3],
    ["src/pages/archives/[slug].astro", _page4],
    ["src/pages/archives/index.astro", _page5],
    ["src/pages/community.astro", _page6],
    ["src/pages/gallery/[slug].astro", _page7],
    ["src/pages/gallery/index.astro", _page8],
    ["src/pages/garden.astro", _page9],
    ["src/pages/lab/[slug].astro", _page10],
    ["src/pages/lab/index.astro", _page11],
    ["src/pages/library/[slug].astro", _page12],
    ["src/pages/library/index.astro", _page13],
    ["src/pages/now.astro", _page14],
    ["src/pages/rss.xml.ts", _page15],
    ["src/pages/system.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "c5573574-8982-4d2b-a5b2-47e9a37f9660",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
