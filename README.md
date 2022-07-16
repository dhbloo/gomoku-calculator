# Gomoku-Calculator

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Prettify source files
```
npm run pretty
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Deployment
After running `npm run build`, just copy all files under 'dist' to your static file server.

Since browsers require stricter environment when enabling SharedArrayBuffer feature at this moment, [COEP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) is required if multi-threading is needed. Add these two headers to the whole served site (including 'index.html' and javascript files under 'dist/build' directory):
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
It is also recommended to set correct MIME type (`application/wasm`) for the wasm files under 'dist/build' directory.
