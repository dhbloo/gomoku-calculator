# Gomoku-Calculator

## Build engine from source
Compile [Rapfi](https://github.com/dhbloo/rapfi) with Emscripten and places the engine in the `public/build` directory.
To support browsers with different capabilities, we need to build 4 versions of the engine:
+ `rapfi-single`: Single-threaded engine without SIMD support
+ `rapfi-single-simd128`: Single-threaded engine with SIMD support
+ `rapfi-multi`: Multi-threaded engine without SIMD support
+ `rapfi-multi-simd128`: Multi-threaded engine with SIMD support

The file structure should look like this:
```
public/build
├── rapfi-multi-simd128-relaxed.js
├── rapfi-multi-simd128-relaxed.wasm
├── rapfi-multi-simd128.js
├── rapfi-multi-simd128.wasm
├── rapfi-multi.js
├── rapfi-multi.wasm
├── rapfi-single-simd128.js
├── rapfi-single-simd128.wasm
├── rapfi-single.js
├── rapfi-single.wasm
└── rapfi.data
```
Starting from commit [4a36e8](https://github.com/dhbloo/gomoku-calculator/commit/4a36e8a43f1c4c61023d46f35fa2b7da0c352ca6), we use a fallback engine without support for NNUE for browsers that have not support for Service Worker, to reduce the server cost of repetively downloading the large NNUE weight file. The file structure of the fallback engine should look like this:
```
public/build
└── fallback
    ├── rapfi-multi.js
    ├── rapfi-multi.wasm
    ├── rapfi-single.js
    ├── rapfi-single.wasm
    └── rapfi.data
```

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

**Troubleshooting:**
If you are running into errors like
```
error:0308010C:digital envelope routines::unsupported
```
This error is caused by changes in OpenSSL defaults in Node.js 17+.
You can fix this by setting the environment variable `NODE_OPTIONS` to `--openssl-legacy-provider` before running the build command:
On Linux or macOS:
```
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```
On Windows (PowerShell):
```
$env:NODE_OPTIONS="--openssl-legacy-provider"
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
