
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
    'index.csr.html': {size: 3698, hash: '914b4f847c82e09db9fea8cf2ec5a81d2991097d0402db5e1085ade440c9b1a7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 948, hash: 'd885e63f286044d6f8174baaef99126988e0b6a6e4f6e589aff2f62b3f377278', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NQSLH4PV.css': {size: 8216, hash: 'eRErhFFF5HA', text: () => import('./assets-chunks/styles-NQSLH4PV_css.mjs').then(m => m.default)}
  },
};
