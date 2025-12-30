"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "./action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "./request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "./static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Crestaurant-ordering%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Crestaurant-ordering&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Crestaurant-ordering%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Crestaurant-ordering&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_restaurant_ordering_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\restaurant-ordering\\\\src\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_restaurant_ordering_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDcmVzdGF1cmFudC1vcmRlcmluZyU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q3Jlc3RhdXJhbnQtb3JkZXJpbmcmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3FCO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVzdGF1cmFudC1vcmRlcmluZy1zeXN0ZW0vPzA5YmMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxccmVzdGF1cmFudC1vcmRlcmluZ1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxccmVzdGF1cmFudC1vcmRlcmluZ1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Crestaurant-ordering%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Crestaurant-ordering&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBZ0M7QUFDUTtBQUV4QyxNQUFNRSxVQUFVRixnREFBUUEsQ0FBQ0Msa0RBQVdBO0FBRU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN0YXVyYW50LW9yZGVyaW5nLXN5c3RlbS8uL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz8wMDk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXHJcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCdcclxuXHJcbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aChhdXRoT3B0aW9ucylcclxuXHJcbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfVxyXG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJhdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @auth/prisma-adapter */ \"(rsc)/./node_modules/@auth/prisma-adapter/index.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma),\n    session: {\n        strategy: \"jwt\"\n    },\n    providers: [\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID || \"\",\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET || \"\",\n            allowDangerousEmailAccountLinking: true\n        }),\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            authorize: async (credentials)=>{\n                if (!credentials?.email || !credentials?.password) return null;\n                const rawEmail = credentials.email.trim();\n                let user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n                    where: {\n                        email: rawEmail\n                    }\n                });\n                if (!user) {\n                    user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n                        where: {\n                            email: rawEmail.toLowerCase()\n                        }\n                    });\n                }\n                if (!user?.passwordHash) return null;\n                const valid = await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_4__.compare)(credentials.password, user.passwordHash);\n                if (!valid) return null;\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async signIn ({ user, account, profile }) {\n            if (account?.provider === \"google\") {\n                const email = (user?.email || \"\").toLowerCase().trim();\n                if (!email) return false;\n                try {\n                    let existing = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n                        where: {\n                            email\n                        }\n                    });\n                    if (!existing) {\n                        existing = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.create({\n                            data: {\n                                email,\n                                name: user.name || email.split(\"@\")[0],\n                                image: user.image || null,\n                                role: \"CUSTOMER\"\n                            }\n                        });\n                    }\n                    const existingAccount = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.account.findFirst({\n                        where: {\n                            provider: \"google\",\n                            providerAccountId: account.providerAccountId\n                        }\n                    });\n                    if (!existingAccount) {\n                        await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.account.create({\n                            data: {\n                                userId: existing.id,\n                                type: account.type,\n                                provider: account.provider,\n                                providerAccountId: account.providerAccountId,\n                                refresh_token: account.refresh_token || null,\n                                access_token: account.access_token || null,\n                                expires_at: account.expires_at || null,\n                                token_type: account.token_type || null,\n                                scope: account.scope || null,\n                                id_token: account.id_token || null\n                            }\n                        });\n                    }\n                    user.id = existing.id;\n                } catch (e) {\n                    console.error(\"Google signIn error:\", e);\n                    return false;\n                }\n            }\n            return true;\n        },\n        async jwt ({ token, user, account }) {\n            if (user) {\n                token.role = user.role || \"CUSTOMER\";\n                token.id = user.id;\n            }\n            if (account?.provider === \"google\" && token.email) {\n                const dbUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n                    where: {\n                        email: token.email\n                    }\n                });\n                if (dbUser) {\n                    token.role = dbUser.role;\n                    token.id = dbUser.id;\n                }\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                const userAny = session.user;\n                userAny.role = token.role;\n                userAny.id = token.id || token.sub;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/signin\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUMrQztBQUNVO0FBQ0w7QUFDZjtBQUNIO0FBRTNCLE1BQU1LLGNBQStCO0lBQzFDQyxTQUFTSixtRUFBYUEsQ0FBQ0MsK0NBQU1BO0lBQzdCSSxTQUFTO1FBQUVDLFVBQVU7SUFBTTtJQUMzQkMsV0FBVztRQUNUVCxzRUFBTUEsQ0FBQztZQUNMVSxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLGdCQUFnQixJQUFJO1lBQzFDQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLG9CQUFvQixJQUFJO1lBQ2xEQyxtQ0FBbUM7UUFDckM7UUFDQWYsMkVBQVdBLENBQUM7WUFDVmdCLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQUUsV0FBVyxPQUFPTDtnQkFDaEIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVUsT0FBTztnQkFDMUQsTUFBTUUsV0FBV04sWUFBWUMsS0FBSyxDQUFDTSxJQUFJO2dCQUN2QyxJQUFJQyxPQUFPLE1BQU12QiwrQ0FBTUEsQ0FBQ3VCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO29CQUFFQyxPQUFPO3dCQUFFVCxPQUFPSztvQkFBUztnQkFBRTtnQkFDckUsSUFBSSxDQUFDRSxNQUFNO29CQUNUQSxPQUFPLE1BQU12QiwrQ0FBTUEsQ0FBQ3VCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO3dCQUFFQyxPQUFPOzRCQUFFVCxPQUFPSyxTQUFTSyxXQUFXO3dCQUFHO29CQUFFO2dCQUNqRjtnQkFDQSxJQUFJLENBQUNILE1BQU1JLGNBQWMsT0FBTztnQkFDaEMsTUFBTUMsUUFBUSxNQUFNM0IsaURBQU9BLENBQUNjLFlBQVlJLFFBQVEsRUFBRUksS0FBS0ksWUFBWTtnQkFDbkUsSUFBSSxDQUFDQyxPQUFPLE9BQU87Z0JBQ25CLE9BQU87b0JBQUVDLElBQUlOLEtBQUtNLEVBQUU7b0JBQUViLE9BQU9PLEtBQUtQLEtBQUs7b0JBQUVGLE1BQU1TLEtBQUtULElBQUk7b0JBQUVnQixNQUFNUCxLQUFLTyxJQUFJO2dCQUFDO1lBQzVFO1FBQ0Y7S0FDRDtJQUNEQyxXQUFXO1FBQ1QsTUFBTUMsUUFBTyxFQUFFVCxJQUFJLEVBQUVVLE9BQU8sRUFBRUMsT0FBTyxFQUFFO1lBQ3JDLElBQUlELFNBQVNFLGFBQWEsVUFBVTtnQkFDbEMsTUFBTW5CLFFBQVEsQ0FBQ08sTUFBTVAsU0FBUyxFQUFDLEVBQUdVLFdBQVcsR0FBR0osSUFBSTtnQkFDcEQsSUFBSSxDQUFDTixPQUFPLE9BQU87Z0JBRW5CLElBQUk7b0JBQ0YsSUFBSW9CLFdBQVcsTUFBTXBDLCtDQUFNQSxDQUFDdUIsSUFBSSxDQUFDQyxVQUFVLENBQUM7d0JBQUVDLE9BQU87NEJBQUVUO3dCQUFNO29CQUFFO29CQUUvRCxJQUFJLENBQUNvQixVQUFVO3dCQUNiQSxXQUFXLE1BQU1wQywrQ0FBTUEsQ0FBQ3VCLElBQUksQ0FBQ2MsTUFBTSxDQUFDOzRCQUNsQ0MsTUFBTTtnQ0FDSnRCO2dDQUNBRixNQUFNUyxLQUFLVCxJQUFJLElBQUlFLE1BQU11QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0NBQ3RDQyxPQUFPakIsS0FBS2lCLEtBQUssSUFBSTtnQ0FDckJWLE1BQU07NEJBQ1I7d0JBQ0Y7b0JBQ0Y7b0JBRUEsTUFBTVcsa0JBQWtCLE1BQU16QywrQ0FBTUEsQ0FBQ2lDLE9BQU8sQ0FBQ1MsU0FBUyxDQUFDO3dCQUNyRGpCLE9BQU87NEJBQUVVLFVBQVU7NEJBQVVRLG1CQUFtQlYsUUFBUVUsaUJBQWlCO3dCQUFDO29CQUM1RTtvQkFFQSxJQUFJLENBQUNGLGlCQUFpQjt3QkFDcEIsTUFBTXpDLCtDQUFNQSxDQUFDaUMsT0FBTyxDQUFDSSxNQUFNLENBQUM7NEJBQzFCQyxNQUFNO2dDQUNKTSxRQUFRUixTQUFTUCxFQUFFO2dDQUNuQlgsTUFBTWUsUUFBUWYsSUFBSTtnQ0FDbEJpQixVQUFVRixRQUFRRSxRQUFRO2dDQUMxQlEsbUJBQW1CVixRQUFRVSxpQkFBaUI7Z0NBQzVDRSxlQUFlWixRQUFRWSxhQUFhLElBQUk7Z0NBQ3hDQyxjQUFjYixRQUFRYSxZQUFZLElBQUk7Z0NBQ3RDQyxZQUFZZCxRQUFRYyxVQUFVLElBQUk7Z0NBQ2xDQyxZQUFZZixRQUFRZSxVQUFVLElBQUk7Z0NBQ2xDQyxPQUFPaEIsUUFBUWdCLEtBQUssSUFBSTtnQ0FDeEJDLFVBQVVqQixRQUFRaUIsUUFBUSxJQUFJOzRCQUNoQzt3QkFDRjtvQkFDRjtvQkFFQTNCLEtBQUtNLEVBQUUsR0FBR08sU0FBU1AsRUFBRTtnQkFDdkIsRUFBRSxPQUFPc0IsR0FBRztvQkFDVkMsUUFBUUMsS0FBSyxDQUFDLHdCQUF3QkY7b0JBQ3RDLE9BQU87Z0JBQ1Q7WUFDRjtZQUNBLE9BQU87UUFDVDtRQUNBLE1BQU1HLEtBQUksRUFBRUMsS0FBSyxFQUFFaEMsSUFBSSxFQUFFVSxPQUFPLEVBQUU7WUFDaEMsSUFBSVYsTUFBTTtnQkFDUmdDLE1BQU16QixJQUFJLEdBQUcsS0FBY0EsSUFBSSxJQUFJO2dCQUNuQ3lCLE1BQU0xQixFQUFFLEdBQUdOLEtBQUtNLEVBQUU7WUFDcEI7WUFFQSxJQUFJSSxTQUFTRSxhQUFhLFlBQVlvQixNQUFNdkMsS0FBSyxFQUFFO2dCQUNqRCxNQUFNd0MsU0FBUyxNQUFNeEQsK0NBQU1BLENBQUN1QixJQUFJLENBQUNDLFVBQVUsQ0FBQztvQkFBRUMsT0FBTzt3QkFBRVQsT0FBT3VDLE1BQU12QyxLQUFLO29CQUFDO2dCQUFFO2dCQUM1RSxJQUFJd0MsUUFBUTtvQkFDVkQsTUFBTXpCLElBQUksR0FBRzBCLE9BQU8xQixJQUFJO29CQUN4QnlCLE1BQU0xQixFQUFFLEdBQUcyQixPQUFPM0IsRUFBRTtnQkFDdEI7WUFDRjtZQUVBLE9BQU8wQjtRQUNUO1FBQ0EsTUFBTW5ELFNBQVEsRUFBRUEsT0FBTyxFQUFFbUQsS0FBSyxFQUFFO1lBQzlCLElBQUluRCxRQUFRbUIsSUFBSSxFQUFFO2dCQUNoQixNQUFNa0MsVUFBVXJELFFBQVFtQixJQUFJO2dCQUM1QmtDLFFBQVEzQixJQUFJLEdBQUd5QixNQUFNekIsSUFBSTtnQkFDekIyQixRQUFRNUIsRUFBRSxHQUFHMEIsTUFBTTFCLEVBQUUsSUFBSTBCLE1BQU1HLEdBQUc7WUFDcEM7WUFDQSxPQUFPdEQ7UUFDVDtJQUNGO0lBQ0F1RCxPQUFPO1FBQ0wzQixRQUFRO0lBQ1Y7SUFDQTRCLFFBQVFwRCxRQUFRQyxHQUFHLENBQUNvRCxlQUFlO0FBQ3JDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXN0YXVyYW50LW9yZGVyaW5nLXN5c3RlbS8uL3NyYy9saWIvYXV0aC50cz82NjkyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJ1xyXG5pbXBvcnQgR29vZ2xlIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvZ29vZ2xlJ1xyXG5pbXBvcnQgQ3JlZGVudGlhbHMgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFscydcclxuaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gJ0BhdXRoL3ByaXNtYS1hZGFwdGVyJ1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnXHJcbmltcG9ydCB7IGNvbXBhcmUgfSBmcm9tICdiY3J5cHRqcydcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSBhcyBhbnksXHJcbiAgc2Vzc2lvbjogeyBzdHJhdGVneTogJ2p3dCcgfSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIEdvb2dsZSh7XHJcbiAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEIHx8ICcnLFxyXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUIHx8ICcnLFxyXG4gICAgICBhbGxvd0Rhbmdlcm91c0VtYWlsQWNjb3VudExpbmtpbmc6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIENyZWRlbnRpYWxzKHtcclxuICAgICAgbmFtZTogJ0NyZWRlbnRpYWxzJyxcclxuICAgICAgY3JlZGVudGlhbHM6IHtcclxuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0VtYWlsJywgdHlwZTogJ2VtYWlsJyB9LFxyXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGF1dGhvcml6ZTogYXN5bmMgKGNyZWRlbnRpYWxzKSA9PiB7XHJcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkgcmV0dXJuIG51bGxcclxuICAgICAgICBjb25zdCByYXdFbWFpbCA9IGNyZWRlbnRpYWxzLmVtYWlsLnRyaW0oKVxyXG4gICAgICAgIGxldCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiByYXdFbWFpbCB9IH0pXHJcbiAgICAgICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgICB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiByYXdFbWFpbC50b0xvd2VyQ2FzZSgpIH0gfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF1c2VyPy5wYXNzd29yZEhhc2gpIHJldHVybiBudWxsXHJcbiAgICAgICAgY29uc3QgdmFsaWQgPSBhd2FpdCBjb21wYXJlKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkSGFzaClcclxuICAgICAgICBpZiAoIXZhbGlkKSByZXR1cm4gbnVsbFxyXG4gICAgICAgIHJldHVybiB7IGlkOiB1c2VyLmlkLCBlbWFpbDogdXNlci5lbWFpbCwgbmFtZTogdXNlci5uYW1lLCByb2xlOiB1c2VyLnJvbGUgfVxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBjYWxsYmFja3M6IHtcclxuICAgIGFzeW5jIHNpZ25Jbih7IHVzZXIsIGFjY291bnQsIHByb2ZpbGUgfSkge1xyXG4gICAgICBpZiAoYWNjb3VudD8ucHJvdmlkZXIgPT09ICdnb29nbGUnKSB7XHJcbiAgICAgICAgY29uc3QgZW1haWwgPSAodXNlcj8uZW1haWwgfHwgJycpLnRvTG93ZXJDYXNlKCkudHJpbSgpXHJcbiAgICAgICAgaWYgKCFlbWFpbCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGxldCBleGlzdGluZyA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBlbWFpbCB9IH0pXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICghZXhpc3RpbmcpIHtcclxuICAgICAgICAgICAgZXhpc3RpbmcgPSBhd2FpdCBwcmlzbWEudXNlci5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lIHx8IGVtYWlsLnNwbGl0KCdAJylbMF0sXHJcbiAgICAgICAgICAgICAgICBpbWFnZTogdXNlci5pbWFnZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgcm9sZTogJ0NVU1RPTUVSJyxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBleGlzdGluZ0FjY291bnQgPSBhd2FpdCBwcmlzbWEuYWNjb3VudC5maW5kRmlyc3Qoe1xyXG4gICAgICAgICAgICB3aGVyZTogeyBwcm92aWRlcjogJ2dvb2dsZScsIHByb3ZpZGVyQWNjb3VudElkOiBhY2NvdW50LnByb3ZpZGVyQWNjb3VudElkIH0sXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAoIWV4aXN0aW5nQWNjb3VudCkge1xyXG4gICAgICAgICAgICBhd2FpdCBwcmlzbWEuYWNjb3VudC5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogZXhpc3RpbmcuaWQsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBhY2NvdW50LnR5cGUsXHJcbiAgICAgICAgICAgICAgICBwcm92aWRlcjogYWNjb3VudC5wcm92aWRlcixcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyQWNjb3VudElkOiBhY2NvdW50LnByb3ZpZGVyQWNjb3VudElkLFxyXG4gICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogYWNjb3VudC5yZWZyZXNoX3Rva2VuIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IGFjY291bnQuYWNjZXNzX3Rva2VuIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICBleHBpcmVzX2F0OiBhY2NvdW50LmV4cGlyZXNfYXQgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIHRva2VuX3R5cGU6IGFjY291bnQudG9rZW5fdHlwZSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IGFjY291bnQuc2NvcGUgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgIGlkX3Rva2VuOiBhY2NvdW50LmlkX3Rva2VuIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdXNlci5pZCA9IGV4aXN0aW5nLmlkXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignR29vZ2xlIHNpZ25JbiBlcnJvcjonLCBlKVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIsIGFjY291bnQgfSkge1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuLnJvbGUgPSAodXNlciBhcyBhbnkpLnJvbGUgfHwgJ0NVU1RPTUVSJ1xyXG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBpZiAoYWNjb3VudD8ucHJvdmlkZXIgPT09ICdnb29nbGUnICYmIHRva2VuLmVtYWlsKSB7XHJcbiAgICAgICAgY29uc3QgZGJVc2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiB0b2tlbi5lbWFpbCB9IH0pXHJcbiAgICAgICAgaWYgKGRiVXNlcikge1xyXG4gICAgICAgICAgdG9rZW4ucm9sZSA9IGRiVXNlci5yb2xlXHJcbiAgICAgICAgICB0b2tlbi5pZCA9IGRiVXNlci5pZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHRva2VuXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcclxuICAgICAgaWYgKHNlc3Npb24udXNlcikge1xyXG4gICAgICAgIGNvbnN0IHVzZXJBbnkgPSBzZXNzaW9uLnVzZXIgYXMgYW55XHJcbiAgICAgICAgdXNlckFueS5yb2xlID0gdG9rZW4ucm9sZVxyXG4gICAgICAgIHVzZXJBbnkuaWQgPSB0b2tlbi5pZCB8fCB0b2tlbi5zdWJcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2Vzc2lvblxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBhZ2VzOiB7XHJcbiAgICBzaWduSW46ICcvc2lnbmluJyxcclxuICB9LFxyXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxyXG59XHJcbiJdLCJuYW1lcyI6WyJHb29nbGUiLCJDcmVkZW50aWFscyIsIlByaXNtYUFkYXB0ZXIiLCJwcmlzbWEiLCJjb21wYXJlIiwiYXV0aE9wdGlvbnMiLCJhZGFwdGVyIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwicHJvdmlkZXJzIiwiY2xpZW50SWQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX0NMSUVOVF9JRCIsImNsaWVudFNlY3JldCIsIkdPT0dMRV9DTElFTlRfU0VDUkVUIiwiYWxsb3dEYW5nZXJvdXNFbWFpbEFjY291bnRMaW5raW5nIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInJhd0VtYWlsIiwidHJpbSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJ0b0xvd2VyQ2FzZSIsInBhc3N3b3JkSGFzaCIsInZhbGlkIiwiaWQiLCJyb2xlIiwiY2FsbGJhY2tzIiwic2lnbkluIiwiYWNjb3VudCIsInByb2ZpbGUiLCJwcm92aWRlciIsImV4aXN0aW5nIiwiY3JlYXRlIiwiZGF0YSIsInNwbGl0IiwiaW1hZ2UiLCJleGlzdGluZ0FjY291bnQiLCJmaW5kRmlyc3QiLCJwcm92aWRlckFjY291bnRJZCIsInVzZXJJZCIsInJlZnJlc2hfdG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJleHBpcmVzX2F0IiwidG9rZW5fdHlwZSIsInNjb3BlIiwiaWRfdG9rZW4iLCJlIiwiY29uc29sZSIsImVycm9yIiwiand0IiwidG9rZW4iLCJkYlVzZXIiLCJ1c2VyQW55Iiwic3ViIiwicGFnZXMiLCJzZWNyZXQiLCJORVhUQVVUSF9TRUNSRVQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsQ0FBQztJQUMvREksS0FBS0MsS0FBeUIsR0FBZ0I7UUFBQztRQUFRO1FBQVE7S0FBTyxHQUFHLENBQVM7QUFDcEYsR0FBRTtBQUVGLElBQUlBLElBQXlCLEVBQWNKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Jlc3RhdXJhbnQtb3JkZXJpbmctc3lzdGVtLy4vc3JjL2xpYi9wcmlzbWEudHM/MDFkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQgfVxyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCh7XHJcbiAgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IFsncXVlcnknLCdlcnJvcicsJ3dhcm4nXSA6IFsnZXJyb3InXVxyXG59KVxyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWFcclxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@auth","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Crestaurant-ordering%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Crestaurant-ordering&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();