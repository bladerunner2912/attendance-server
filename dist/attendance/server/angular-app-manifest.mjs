
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 0,
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "route": "/dashboard/class/*"
  },
  {
    "renderMode": 0,
    "route": "/dashboard/class/*/session/*"
  },
  {
    "renderMode": 0,
    "route": "/dashboard/class/*/session/*/take-attendance"
  },
  {
    "renderMode": 0,
    "route": "/dashboard/class/*/student/*"
  },
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 3698, hash: '55d7045202ca9c6a413057a78be42efd085b4a1b622a42f9aee5a377759e9406', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 948, hash: 'e93db9da953fe51a35d8f75b95a0f2885050b5adeb38ac6ef7c55a72d9a347ec', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NQSLH4PV.css': {size: 8216, hash: 'eRErhFFF5HA', text: () => import('./assets-chunks/styles-NQSLH4PV_css.mjs').then(m => m.default)}
  },
};
