(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["table-vue2"] = factory();
	else
		root["table-vue2"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 679:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ 669:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(609);

/***/ }),

/***/ 448:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var settle = __webpack_require__(26);
var cookies = __webpack_require__(372);
var buildURL = __webpack_require__(327);
var buildFullPath = __webpack_require__(97);
var parseHeaders = __webpack_require__(109);
var isURLSameOrigin = __webpack_require__(985);
var transitionalDefaults = __webpack_require__(874);
var AxiosError = __webpack_require__(648);
var CanceledError = __webpack_require__(644);
var parseProtocol = __webpack_require__(205);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 609:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var bind = __webpack_require__(849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(185);
var defaults = __webpack_require__(546);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = __webpack_require__(644);
axios.CancelToken = __webpack_require__(972);
axios.isCancel = __webpack_require__(502);
axios.VERSION = (__webpack_require__(288).version);
axios.toFormData = __webpack_require__(675);

// Expose AxiosError class
axios.AxiosError = __webpack_require__(648);

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 972:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var CanceledError = __webpack_require__(644);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 644:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(648);
var utils = __webpack_require__(867);

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;


/***/ }),

/***/ 502:
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var buildURL = __webpack_require__(327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(572);
var mergeConfig = __webpack_require__(185);
var buildFullPath = __webpack_require__(97);
var validator = __webpack_require__(875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;


/***/ }),

/***/ 648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;


/***/ }),

/***/ 782:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 97:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(793);
var combineURLs = __webpack_require__(303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var transformData = __webpack_require__(527);
var isCancel = __webpack_require__(502);
var defaults = __webpack_require__(546);
var CanceledError = __webpack_require__(644);

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 185:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ 26:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var AxiosError = __webpack_require__(648);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 527:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var defaults = __webpack_require__(546);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 546:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);
var normalizeHeaderName = __webpack_require__(16);
var AxiosError = __webpack_require__(648);
var transitionalDefaults = __webpack_require__(874);
var toFormData = __webpack_require__(675);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(448);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: __webpack_require__(623)
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 874:
/***/ (function(module) {

"use strict";


module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};


/***/ }),

/***/ 288:
/***/ (function(module) {

module.exports = {
  "version": "0.27.2"
};

/***/ }),

/***/ 849:
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 327:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 303:
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 372:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 793:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 268:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};


/***/ }),

/***/ 985:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 16:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 623:
/***/ (function(module) {

// eslint-disable-next-line strict
module.exports = null;


/***/ }),

/***/ 109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 205:
/***/ (function(module) {

"use strict";


module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};


/***/ }),

/***/ 713:
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 675:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(867);

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;


/***/ }),

/***/ 875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var VERSION = (__webpack_require__(288).version);
var AxiosError = __webpack_require__(648);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 867:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Vuetable": function() { return /* reexport */ Vuetable; },
  "VuetableColGutter": function() { return /* reexport */ VuetableColGutter; },
  "VuetableFieldCheckbox": function() { return /* reexport */ VuetableFieldCheckbox; },
  "VuetableFieldCheckboxMixin": function() { return /* reexport */ VuetableFieldCheckboxMixin; },
  "VuetableFieldHandle": function() { return /* reexport */ VuetableFieldHandle; },
  "VuetableFieldMixin": function() { return /* reexport */ VuetableFieldMixin; },
  "VuetableFieldSequence": function() { return /* reexport */ VuetableFieldSequence; },
  "VuetablePagination": function() { return /* reexport */ VuetablePagination; },
  "VuetablePaginationDropDown": function() { return /* reexport */ VuetablePaginationDropdown; },
  "VuetablePaginationInfo": function() { return /* reexport */ VuetablePaginationInfo; },
  "VuetablePaginationInfoMixin": function() { return /* reexport */ VuetablePaginationInfoMixin; },
  "VuetablePaginationMixin": function() { return /* reexport */ VuetablePaginationMixin; },
  "VuetableRowHeader": function() { return /* reexport */ VuetableRowHeader; },
  "default": function() { return /* binding */ entry_lib; },
  "install": function() { return /* reexport */ install; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__(679)
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/Vuetable.vue?vue&type=template&id=0c70e2b7&
var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{class:_vm.$_css.tableWrapper},[(_vm.isFixedHeader)?_c('div',{staticClass:"vuetable-head-wrapper"},[_c('table',{class:['vuetable', _vm.$_css.tableClass, _vm.$_css.tableHeaderClass]},[_c('VuetableColGroup',{attrs:{"is-header":true}}),_c('thead',[_vm._t("tableHeader",function(){return [_vm._l((_vm.headerRows),function(header,headerIndex){return [_c(header,{key:headerIndex,tag:"component",on:{"vuetable:header-event":_vm.onHeaderEvent}})]})]},{"fields":_vm.tableFields})],2)],1)]):_vm._e(),_c('div',{staticClass:"vuetable-body-wrapper",class:{ 'fixed-header': _vm.isFixedHeader },style:({ height: _vm.tableHeight })},[_c('table',{class:[
        'vuetable',
        _vm.isFixedHeader ? 'fixed-header' : '',
        _vm.$_css.tableClass,
        _vm.$_css.tableBodyClass
      ]},[_c('VuetableColGroup'),(!_vm.isFixedHeader)?_c('thead',[_vm._t("tableHeader",function(){return [_vm._l((_vm.headerRows),function(header,headerIndex){return [_c(header,{key:headerIndex,tag:"component",on:{"vuetable:header-event":_vm.onHeaderEvent}})]})]},{"fields":_vm.tableFields})],2):_vm._e(),_c('tfoot',[_vm._t("tableFooter",null,{"fields":_vm.tableFields})],2),_c('tbody',{staticClass:"vuetable-body"},[_vm._l((_vm.tableData),function(item,itemIndex){return [_c('tr',{key:itemIndex,class:_vm.onRowClass(item, itemIndex),attrs:{"item-index":itemIndex},on:{"click":function($event){return _vm.onRowClicked(item, itemIndex, $event)},"dblclick":function($event){return _vm.onRowDoubleClicked(item, itemIndex, $event)},"mouseover":function($event){return _vm.onMouseOver(item, itemIndex, $event)}}},[_vm._l((_vm.tableFields),function(field,fieldIndex){return [(field.visible)?[(_vm.isFieldComponent(field.name))?[_c(field.name,{key:fieldIndex,tag:"component",class:_vm.bodyClass('vuetable-component', field),style:({ width: field.width }),attrs:{"row-data":item,"row-index":itemIndex,"row-field":field,"vuetable":_vm.vuetable},on:{"vuetable:field-event":_vm.onFieldEvent}})]:(_vm.isFieldSlot(field.name))?[_c('td',{key:fieldIndex,class:_vm.bodyClass('vuetable-slot', field),style:({ width: field.width })},[_vm._t(field.name,null,{"rowData":item,"rowIndex":itemIndex,"rowField":field})],2)]:[_c('td',{key:fieldIndex,class:_vm.bodyClass('vuetable-td-' + field.name, field),style:({ width: field.width }),domProps:{"innerHTML":_vm._s(_vm.renderNormalField(field, item))},on:{"click":function($event){return _vm.onCellClicked(item, itemIndex, field, $event)},"dblclick":function($event){return _vm.onCellDoubleClicked(item, itemIndex, field, $event)},"contextmenu":function($event){return _vm.onCellRightClicked(item, itemIndex, field, $event)}}})]]:_vm._e()]})],2),(_vm.useDetailRow)?[_c('transition',{key:itemIndex,attrs:{"name":_vm.detailRowTransition}},[(_vm.isVisibleDetailRow(item[_vm.trackBy]))?_c('tr',{class:_vm.onDetailRowClass(item, itemIndex),on:{"click":function($event){return _vm.onDetailRowClick(item, itemIndex, $event)}}},[_c('td',{attrs:{"colspan":_vm.countVisibleFields}},[_c(_vm.detailRowComponent,{tag:"component",attrs:{"row-data":item,"row-index":itemIndex,"options":_vm.detailRowOptions}})],1)]):_vm._e()])]:_vm._e()]}),(_vm.displayEmptyDataRow)?[_c('tr',[_c('td',{staticClass:"vuetable-empty-result",attrs:{"colspan":_vm.countVisibleFields},domProps:{"innerHTML":_vm._s(_vm.noDataTemplate)}})])]:_vm._e(),(_vm.lessThanMinRows)?_vm._l((_vm.blankRows),function(i){return _c('tr',{key:i,staticClass:"blank-row"},[_vm._l((_vm.tableFields),function(field,fieldIndex){return [(field.visible)?_c('td',{key:fieldIndex},[_vm._v(" ")]):_vm._e()]})],2)}):_vm._e()],2)],1)])])
}
var staticRenderFns = []


// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__(669);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableRowHeader.vue?vue&type=template&id=ac62bff6&
var VuetableRowHeadervue_type_template_id_ac62bff6_render = function render(){var _vm=this,_c=_vm._self._c;return _c('tr',[_vm._l((_vm.vuetable.tableFields),function(field,fieldIndex){return [(field.visible)?[(_vm.vuetable.isFieldComponent(field.name))?[_c(field.name,{key:fieldIndex,tag:"component",class:_vm.headerClass('vuetable-th-component', field),style:({ width: field.width }),attrs:{"row-field":field,"is-header":true,"title":_vm.renderTitle(field),"vuetable":_vm.vuetable},on:{"vuetable:header-event":_vm.vuetable.onHeaderEvent,"click":function($event){return _vm.onColumnHeaderClicked(field, $event)}}})]:(_vm.vuetable.isFieldSlot(field.name))?[_c('th',{key:fieldIndex,class:_vm.headerClass('vuetable-th-slot', field),style:({ width: field.width }),domProps:{"innerHTML":_vm._s(_vm.renderTitle(field))},on:{"click":function($event){return _vm.onColumnHeaderClicked(field, $event)}}})]:[_c('th',{key:fieldIndex,class:_vm.headerClass('vuetable-th', field),style:({ width: field.width }),attrs:{"id":'_' + field.name},domProps:{"innerHTML":_vm._s(_vm.renderTitle(field))},on:{"click":function($event){return _vm.onColumnHeaderClicked(field, $event)}}})]]:_vm._e()]}),(_vm.vuetable.scrollVisible)?_c('vuetable-col-gutter'):_vm._e()],2)
}
var VuetableRowHeadervue_type_template_id_ac62bff6_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldCheckbox.vue?vue&type=template&id=77f2e5dd&
var VuetableFieldCheckboxvue_type_template_id_77f2e5dd_render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.isHeader)?_c('th',{staticClass:"vuetable-th-component-checkbox"},[_c('input',{attrs:{"type":"checkbox"},domProps:{"checked":_vm.isAllItemsInCurrentPageSelected()},on:{"change":function($event){return _vm.toggleAllCheckbox($event)}}})]):_c('td',{staticClass:"vuetable-td-component-checkbox"},[_c('input',{attrs:{"type":"checkbox"},domProps:{"checked":_vm.isSelected(_vm.rowData)},on:{"change":function($event){return _vm.toggleCheckbox(_vm.rowData, $event)}}})])
}
var VuetableFieldCheckboxvue_type_template_id_77f2e5dd_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldMixin.vue?vue&type=script&lang=js&

/* harmony default export */ var VuetableFieldMixinvue_type_script_lang_js_ = ({
  props: {
    rowData: {
      type: Object,
      default: null
    },
    rowIndex: {
      type: Number
    },
    rowField: {
      type: Object
    },
    isHeader: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    vuetable: {
      type: Object,
      default: null
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableFieldMixin.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableFieldMixinvue_type_script_lang_js_ = (VuetableFieldMixinvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// CONCATENATED MODULE: ./src/components/VuetableFieldMixin.vue
var VuetableFieldMixin_render, VuetableFieldMixin_staticRenderFns
;



/* normalize component */
;
var component = normalizeComponent(
  components_VuetableFieldMixinvue_type_script_lang_js_,
  VuetableFieldMixin_render,
  VuetableFieldMixin_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableFieldMixin = (component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldCheckboxMixin.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetableFieldCheckboxMixinvue_type_script_lang_js_ = ({
  mixins: [VuetableFieldMixin],

  methods: {
    toggleCheckbox(dataItem, event) {
      this.vuetable.onCheckboxToggled(
        event.target.checked,
        this.rowField.name,
        dataItem
      )
    },

    toggleAllCheckbox(event) {
      this.vuetable.onCheckboxToggledAll(event.target.checked)
    },

    isSelected(rowData) {
      return this.vuetable.isSelectedRow(rowData[this.vuetable.trackBy])
    },

    isAllItemsInCurrentPageSelected() {
      if (!this.vuetable.tableData) return

      let idColumn = this.vuetable.trackBy
      let checkbox = this.$el.querySelector('input[type=checkbox]')
      let selected = this.vuetable.tableData.filter(item =>
        this.vuetable.isSelectedRow(item[idColumn])
      )

      // count == 0, clear the checkbox
      if (selected.length <= 0) {
        checkbox.indeterminate = false
        return false
      }
      // count > 0 and count < perPage, set checkbox state to 'indeterminate'
      else if (selected.length < this.vuetable.perPage) {
        checkbox.indeterminate = true
        return true
      }
      // count == perPage, set checkbox state to 'checked'
      else {
        checkbox.indeterminate = false
        return true
      }
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableFieldCheckboxMixin.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableFieldCheckboxMixinvue_type_script_lang_js_ = (VuetableFieldCheckboxMixinvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableFieldCheckboxMixin.vue
var VuetableFieldCheckboxMixin_render, VuetableFieldCheckboxMixin_staticRenderFns
;



/* normalize component */
;
var VuetableFieldCheckboxMixin_component = normalizeComponent(
  components_VuetableFieldCheckboxMixinvue_type_script_lang_js_,
  VuetableFieldCheckboxMixin_render,
  VuetableFieldCheckboxMixin_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableFieldCheckboxMixin = (VuetableFieldCheckboxMixin_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldCheckbox.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetableFieldCheckboxvue_type_script_lang_js_ = ({
  name: 'vuetable-field-checkbox',

  mixins: [VuetableFieldCheckboxMixin]
});

;// CONCATENATED MODULE: ./src/components/VuetableFieldCheckbox.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableFieldCheckboxvue_type_script_lang_js_ = (VuetableFieldCheckboxvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableFieldCheckbox.vue





/* normalize component */
;
var VuetableFieldCheckbox_component = normalizeComponent(
  components_VuetableFieldCheckboxvue_type_script_lang_js_,
  VuetableFieldCheckboxvue_type_template_id_77f2e5dd_render,
  VuetableFieldCheckboxvue_type_template_id_77f2e5dd_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableFieldCheckbox = (VuetableFieldCheckbox_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldHandle.vue?vue&type=template&id=54700d14&
var VuetableFieldHandlevue_type_template_id_54700d14_render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.isHeader)?_c('th',{staticClass:"vuetable-th-component-handle",domProps:{"innerHTML":_vm._s(_vm.title)}}):_c('td',{staticClass:"vuetable-td-component-handle",domProps:{"innerHTML":_vm._s(_vm.renderIconTag(['handle-icon', _vm.css.handleIcon]))}})
}
var VuetableFieldHandlevue_type_template_id_54700d14_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldHandle.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetableFieldHandlevue_type_script_lang_js_ = ({
  name: 'vuetable-field-handle',

  mixins: [VuetableFieldMixin],

  computed: {
    css() {
      return this.vuetable.$_css
    }
  },

  methods: {
    renderIconTag(classes, options = '') {
      return typeof this.css.renderIcon === 'undefined'
        ? `<i class="${classes.join(' ')}" ${options}></i>`
        : this.css.renderIcon(classes, options)
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableFieldHandle.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableFieldHandlevue_type_script_lang_js_ = (VuetableFieldHandlevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableFieldHandle.vue





/* normalize component */
;
var VuetableFieldHandle_component = normalizeComponent(
  components_VuetableFieldHandlevue_type_script_lang_js_,
  VuetableFieldHandlevue_type_template_id_54700d14_render,
  VuetableFieldHandlevue_type_template_id_54700d14_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableFieldHandle = (VuetableFieldHandle_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldSequence.vue?vue&type=template&id=6f19165b&
var VuetableFieldSequencevue_type_template_id_6f19165b_render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.isHeader)?_c('th',{staticClass:"vuetable-th-component-sequence",domProps:{"innerHTML":_vm._s(_vm.title)}}):_c('td',{staticClass:"vuetable-td-component-sequence",domProps:{"innerHTML":_vm._s(_vm.renderSequence())}})
}
var VuetableFieldSequencevue_type_template_id_6f19165b_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableFieldSequence.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetableFieldSequencevue_type_script_lang_js_ = ({
  name: 'vuetable-field-sequence',

  mixins: [VuetableFieldMixin],

  methods: {
    renderSequence() {
      return this.vuetable.tablePagination
        ? this.vuetable.tablePagination.from + this.rowIndex
        : 1 + this.rowIndex
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableFieldSequence.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableFieldSequencevue_type_script_lang_js_ = (VuetableFieldSequencevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableFieldSequence.vue





/* normalize component */
;
var VuetableFieldSequence_component = normalizeComponent(
  components_VuetableFieldSequencevue_type_script_lang_js_,
  VuetableFieldSequencevue_type_template_id_6f19165b_render,
  VuetableFieldSequencevue_type_template_id_6f19165b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableFieldSequence = (VuetableFieldSequence_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableColGutter.vue?vue&type=template&id=615dafa7&
var VuetableColGuttervue_type_template_id_615dafa7_render = function render(){var _vm=this,_c=_vm._self._c;return _c('th',{staticClass:"vuetable-th-gutter",style:({ width: _vm.vuetable.scrollBarWidth })})
}
var VuetableColGuttervue_type_template_id_615dafa7_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableColGutter.vue?vue&type=script&lang=js&

/* harmony default export */ var VuetableColGuttervue_type_script_lang_js_ = ({
  name: 'vuetable-th-gutter',

  computed: {
    vuetable() {
      return this.$parent
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableColGutter.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableColGuttervue_type_script_lang_js_ = (VuetableColGuttervue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-52.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-52.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-52.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableColGutter.vue?vue&type=style&index=0&id=615dafa7&prod&lang=css&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/VuetableColGutter.vue?vue&type=style&index=0&id=615dafa7&prod&lang=css&

;// CONCATENATED MODULE: ./src/components/VuetableColGutter.vue



;


/* normalize component */

var VuetableColGutter_component = normalizeComponent(
  components_VuetableColGuttervue_type_script_lang_js_,
  VuetableColGuttervue_type_template_id_615dafa7_render,
  VuetableColGuttervue_type_template_id_615dafa7_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableColGutter = (VuetableColGutter_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableRowHeader.vue?vue&type=script&lang=js&






/* harmony default export */ var VuetableRowHeadervue_type_script_lang_js_ = ({
  components: {
    'vuetable-field-checkbox': VuetableFieldCheckbox,
    'vuetable-field-handle': VuetableFieldHandle,
    'vuetable-field-sequence': VuetableFieldSequence,
    VuetableColGutter: VuetableColGutter
  },

  computed: {
    sortOrder() {
      return this.$parent.sortOrder
    },

    css() {
      return this.$parent.$_css
    },

    vuetable() {
      return this.$parent
    }
  },

  methods: {
    stripPrefix(name) {
      return name.replace(this.vuetable.fieldPrefix, '')
    },

    headerClass(base, field) {
      return [
        base + '-' + this.toSnakeCase(field.name),
        field.titleClass || '',
        this.sortClass(field),
        { sortable: this.vuetable.isSortable(field) }
      ]
    },

    toSnakeCase(str) {
      return (
        typeof str === 'string' &&
        str
          .replace(/([A-Z])/g, chr => '_' + chr.toLowerCase())
          .replace(' ', '_')
          .replace('.', '_')
      )
    },

    sortClass(field) {
      let cls = ''
      let i = this.currentSortOrderPosition(field)

      if (i !== false) {
        cls =
          this.sortOrder[i].direction == 'asc'
            ? this.css.ascendingClass
            : this.css.descendingClass
      }

      return cls
    },

    sortIcon(field) {
      let cls = this.css.sortableIcon
      let i = this.currentSortOrderPosition(field)

      if (i !== false) {
        cls =
          this.sortOrder[i].direction == 'asc'
            ? this.css.ascendingIcon
            : this.css.descendingIcon
      }

      return cls
    },

    isInCurrentSortGroup(field) {
      return this.currentSortOrderPosition(field) !== false
    },

    hasSortableIcon(field) {
      return this.vuetable.isSortable(field) && this.css.sortableIcon != ''
    },

    currentSortOrderPosition(field) {
      if (!this.vuetable.isSortable(field)) {
        return false
      }

      for (let i = 0; i < this.sortOrder.length; i++) {
        if (this.fieldIsInSortOrderPosition(field, i)) {
          return i
        }
      }

      return false
    },

    fieldIsInSortOrderPosition(field, i) {
      return (
        this.sortOrder[i].field === field.name &&
        this.sortOrder[i].sortField === field.sortField
      )
    },

    renderTitle(field) {
      let title = this.getTitle(field)

      if (
        (title.length > 0 && this.isInCurrentSortGroup(field)) ||
        this.hasSortableIcon(field)
      ) {
        let style = `opacity:${this.sortIconOpacity(
          field
        )};position:relative;float:right`
        let iconTag = this.vuetable.showSortIcons
          ? this.renderIconTag(
              ['sort-icon', this.sortIcon(field)],
              `style="${style}"`
            )
          : ''
        return title + ' ' + iconTag
      }

      return title
    },

    getTitle(field) {
      if (typeof field.title === 'function') return field.title()

      return typeof field.title === 'undefined'
        ? field.name.replace('.', ' ')
        : field.title
    },

    sortIconOpacity(field) {
      /*
       * fields with stronger precedence have darker color
       *
       * if there are few fields, we go down by 0.3
       * ex. 2 fields are selected: 1.0, 0.7
       *
       * if there are more we go down evenly on the given spectrum
       * ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3
       */
      let max = 1.0,
        min = 0.3,
        step = 0.3

      let count = this.sortOrder.length
      let current = this.currentSortOrderPosition(field)

      if (max - count * step < min) {
        step = (max - min) / (count - 1)
      }

      let opacity = max - current * step

      return opacity
    },

    renderIconTag(classes, options = '') {
      return typeof this.css.renderIcon === 'undefined'
        ? `<i class="${classes.join(' ')}" ${options}></i>`
        : this.css.renderIcon(classes, options)
    },

    onColumnHeaderClicked(field, event) {
      this.vuetable.orderBy(field, event)
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableRowHeader.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableRowHeadervue_type_script_lang_js_ = (VuetableRowHeadervue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableRowHeader.vue





/* normalize component */
;
var VuetableRowHeader_component = normalizeComponent(
  components_VuetableRowHeadervue_type_script_lang_js_,
  VuetableRowHeadervue_type_template_id_ac62bff6_render,
  VuetableRowHeadervue_type_template_id_ac62bff6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableRowHeader = (VuetableRowHeader_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableColGroup.vue?vue&type=template&id=20596931&
var VuetableColGroupvue_type_template_id_20596931_render = function render(){var _vm=this,_c=_vm._self._c;return _c('colgroup',[_vm._l((_vm.vuetable.tableFields),function(field,fieldIndex){return [(field.visible)?[_c('col',{key:fieldIndex,class:_vm.columnClass(field, fieldIndex),style:({ width: field.width })})]:_vm._e()]}),(_vm.isHeader && _vm.vuetable.scrollVisible)?_c('col',{staticClass:"vuetable-col-gutter",style:({ width: _vm.vuetable.scrollBarWidth })}):_vm._e()],2)
}
var VuetableColGroupvue_type_template_id_20596931_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetableColGroup.vue?vue&type=script&lang=js&

/* harmony default export */ var VuetableColGroupvue_type_script_lang_js_ = ({
  name: 'vuetable-col-group',

  props: {
    isHeader: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    vuetable() {
      return this.$parent
    }
  },

  methods: {
    columnClass(field, fieldIndex) {
      let fieldName =
        typeof field.name === 'object' && field.name !== null
          ? field.name.name
          : field.name
      fieldName = fieldName.replace(this.fieldPrefix, '')

      return ['vuetable-col-' + fieldName, field.titleClass]
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetableColGroup.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetableColGroupvue_type_script_lang_js_ = (VuetableColGroupvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetableColGroup.vue





/* normalize component */
;
var VuetableColGroup_component = normalizeComponent(
  components_VuetableColGroupvue_type_script_lang_js_,
  VuetableColGroupvue_type_template_id_20596931_render,
  VuetableColGroupvue_type_template_id_20596931_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetableColGroup = (VuetableColGroup_component.exports);
;// CONCATENATED MODULE: ./src/components/VuetableCssSemanticUI.js
/* harmony default export */ var VuetableCssSemanticUI = ({
  table: {
    tableWrapper: '',
    tableHeaderClass: 'fixed',
    tableBodyClass: 'fixed',
    tableClass: 'ui blue selectable unstackable celled table',
    loadingClass: 'loading',
    ascendingIcon: 'blue chevron up icon',
    descendingIcon: 'blue chevron down icon',
    ascendingClass: 'sorted-asc',
    descendingClass: 'sorted-desc',
    sortableIcon: 'grey sort icon',
    handleIcon: 'grey sidebar icon'
  },

  pagination: {
    wrapperClass: 'ui right floated pagination menu',
    activeClass: 'active large',
    disabledClass: 'disabled',
    pageClass: 'item',
    linkClass: 'icon item',
    paginationClass: 'ui bottom attached segment grid',
    paginationInfoClass: 'left floated left aligned six wide column',
    dropdownClass: 'ui search dropdown',
    icons: {
      first: 'angle double left icon',
      prev: 'left chevron icon',
      next: 'right chevron icon',
      last: 'angle double right icon'
    }
  },

  paginationInfo: {
    infoClass: 'left floated left aligned six wide column'
  }
});

;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/Vuetable.vue?vue&type=script&lang=js&






/* harmony default export */ var Vuetablevue_type_script_lang_js_ = ({
  name: 'Vuetable',

  components: {
    VuetableRowHeader: VuetableRowHeader,
    VuetableColGroup: VuetableColGroup
  },

  props: {
    fields: {
      type: Array,
      required: true
    },
    loadOnStart: {
      type: Boolean,
      default: true
    },
    apiUrl: {
      type: String,
      default: ''
    },
    httpMethod: {
      type: String,
      default: 'get',
      validator: value => {
        return ['get', 'post'].indexOf(value) > -1
      }
    },
    reactiveApiUrl: {
      type: Boolean,
      default: true
    },
    apiMode: {
      type: Boolean,
      default: true
    },
    data: {
      type: [Array, Object],
      default: null
    },
    dataManager: {
      type: Function,
      default: null
    },
    dataPath: {
      type: String,
      default: 'data'
    },
    paginationPath: {
      type: String,
      default: 'links.pagination'
    },
    queryParams: {
      type: [Object, Function],
      default() {
        return {
          sort: 'sort',
          page: 'page',
          perPage: 'per_page'
        }
      }
    },
    appendParams: {
      type: Object,
      default() {
        return {}
      }
    },
    httpOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    httpFetch: {
      type: Function,
      default: null
    },
    perPage: {
      type: Number,
      default: 10
    },
    /**
     * Page that should be displayed when the table is first displayed
     */
    initialPage: {
      type: Number,
      default: 1
    },
    /**
     * First page number. Set this prop to 0 for zero based pagination
     */
    firstPage: {
      type: Number,
      default: 1
    },
    sortOrder: {
      type: Array,
      default() {
        return []
      }
    },
    multiSort: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: String,
      default: null
    },
    /*
     * physical key that will trigger multi-sort option
     * possible values: 'alt', 'ctrl', 'meta', 'shift'
     * 'ctrl' might not work as expected on Mac
     */
    multiSortKey: {
      type: String,
      default: 'alt'
    },
    rowClass: {
      type: [String, Function],
      default: ''
    },
    detailRowComponent: {
      type: [String, Object],
      default: ''
    },
    detailRowTransition: {
      type: String,
      default: ''
    },
    detailRowClass: {
      type: [String, Function],
      default: 'vuetable-detail-row'
    },
    detailRowOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    css: {
      type: Object,
      default() {
        return {}
      }
    },
    minRows: {
      type: Number,
      default: 0
    },
    silent: {
      type: Boolean,
      default: false
    },
    noDataTemplate: {
      type: String,
      default() {
        return 'No Data Available'
      }
    },
    showSortIcons: {
      type: Boolean,
      default: true
    },
    headerRows: {
      type: Array,
      default() {
        return ['VuetableRowHeader']
      }
    },
    transform: {
      type: Function,
      default: null
    },
    sortParams: {
      type: Function,
      default: null
    },
    fieldPrefix: {
      type: String,
      default() {
        return 'vuetable-field-'
      }
    },
    eventPrefix: {
      type: String,
      default() {
        return 'vuetable:'
      }
    }
  },

  data() {
    return {
      tableFields: [],
      tableData: null,
      tablePagination: null,
      currentPage: this.initialPage,
      selectedTo: [],
      visibleDetailRows: [],
      lastScrollPosition: 0,
      scrollBarWidth: '17px', //chrome default
      scrollVisible: false,
      $_css: {}
    }
  },

  computed: {
    version: () => VERSION,
    useDetailRow() {
      if (!this.dataIsAvailable) return false

      return this.detailRowComponent !== ''
    },
    dataIsAvailable() {
      if (!this.tableData) return false

      return this.tableData.length > 0
    },
    hasRowIdentifier() {
      return (
        this.tableData && typeof this.tableData[0][this.trackBy] !== 'undefined'
      )
    },
    countVisibleFields() {
      return this.tableFields.filter(field => {
        return field.visible
      }).length
    },
    countTableData() {
      if (this.tableData === null) {
        return 0
      }
      return this.tableData.length
    },
    displayEmptyDataRow() {
      return this.countTableData === 0 && this.noDataTemplate.length > 0
    },
    lessThanMinRows() {
      if (this.tableData === null || this.tableData.length === 0) {
        return true
      }
      return this.tableData.length < this.minRows
    },
    blankRows() {
      if (this.tableData === null || this.tableData.length === 0) {
        return this.minRows
      }
      if (this.tableData.length >= this.minRows) {
        return 0
      }

      return this.minRows - this.tableData.length
    },
    isApiMode() {
      return this.apiMode
    },
    isDataMode() {
      return !this.apiMode
    },
    isFixedHeader() {
      return this.tableHeight != null
    },
    vuetable() {
      return this
    }
  },

  created() {
    this.mergeCss()
    this.normalizeFields()
    this.normalizeSortOrder()
    this.$nextTick(() => {
      this.fireEvent('initialized', this.tableFields)
    })
  },

  mounted() {
    if (this.loadOnStart) {
      this.loadData()
    }

    if (this.isFixedHeader) {
      this.scrollBarWidth = this.getScrollBarWidth() + 'px'

      let elem = this.$el.getElementsByClassName('vuetable-body-wrapper')[0]
      if (elem != null) {
        elem.addEventListener('scroll', this.handleScroll)
      }
    }
  },

  destroyed() {
    let elem = this.$el.getElementsByClassName('vuetable-body-wrapper')[0]
    if (elem != null) {
      elem.removeEventListener('scroll', this.handleScroll)
    }
  },

  watch: {
    multiSort(newVal, oldVal) {
      if (newVal === false && this.sortOrder.length > 1) {
        this.sortOrder.splice(1)
        this.loadData()
      }
    },

    apiUrl(newVal, oldVal) {
      if (this.reactiveApiUrl && newVal !== oldVal) this.refresh()
    },

    data(newVal, oldVal) {
      this.setData(newVal)
    },

    tableHeight(newVal, oldVal) {
      this.checkScrollbarVisibility()
    },

    fields(newVal, oldVal) {
      this.normalizeFields()
    },

    perPage(newVal, oldVal) {
      this.reload()
    }
  },

  methods: {
    getScrollBarWidth() {
      const outer = document.createElement('div')
      const inner = document.createElement('div')

      outer.style.visibility = 'hidden'
      outer.style.width = '100px'

      inner.style.width = '100%'

      outer.appendChild(inner)
      document.body.appendChild(outer)

      const widthWithoutScrollbar = outer.offsetWidth
      outer.style.overflow = 'scroll'
      const widthWithScrollbar = inner.offsetWidth
      document.body.removeChild(outer)

      return widthWithoutScrollbar - widthWithScrollbar
    },

    //make sure that the header and the body are aligned when scrolling horizontally on a table that is wider than the viewport
    handleScroll(e) {
      let horizontal = e.currentTarget.scrollLeft

      //don't modify header scroll if we are scrolling vertically
      if (horizontal != this.lastScrollPosition) {
        let header = this.$el.getElementsByClassName('vuetable-head-wrapper')[0]
        if (header != null) {
          header.scrollLeft = horizontal
        }
        this.lastScrollPosition = horizontal
      }
    },

    mergeCss() {
      this.$_css = { ...VuetableCssSemanticUI.table, ...this.css }
    },

    bodyClass(base, field) {
      return [base, field.dataClass]
    },

    normalizeFields() {
      if (typeof this.fields === 'undefined') {
        this.warn('You need to provide "fields" prop.')
        return
      }

      this.tableFields = []

      this.fields.forEach((field, i) => {
        this.tableFields.push(this.newField(field, i))
      })
    },

    newField(field, index) {
      let defaultField = {
        name: '',
        // title:
        // this allow the code to detect undefined title
        // and replace it with capitalized name instead
        titleClass: '',
        dataClass: '',
        sortField: null,
        formatter: null,
        visible: true,
        width: null,
        $_index: index
      }

      if (typeof field === 'string') {
        return Object.assign({}, defaultField, {
          name: this.normalizeFieldName(field),
          title: this.makeTitle(field)
        })
      }

      let obj = Object.assign({}, defaultField, field)
      obj.name = this.normalizeFieldName(obj.name)
      if (obj.title === undefined) {
        obj.title = this.makeTitle(obj.name)
      }
      if (obj.formatter !== null && typeof obj.formatter !== 'function') {
        console.error(obj.name + ' field formatter must be a function')
        obj.formatter = null
      }
      return obj
    },

    normalizeFieldName(fieldName) {
      if (fieldName instanceof Object) return fieldName

      return (
        typeof fieldName === 'string' &&
        fieldName.replace('__', this.fieldPrefix)
      )
    },

    setData(data) {
      if (data === null || typeof data === 'undefined') return

      this.fireEvent('loading')

      if (Array.isArray(data)) {
        this.tableData = data
        this.fireEvent('loaded')
        return
      }

      this.tableData = this.getObjectValue(data, this.dataPath, null)
      this.tablePagination = this.getObjectValue(
        data,
        this.paginationPath,
        null
      )

      this.$nextTick(() => {
        this.checkIfRowIdentifierExists()
        this.updateHeader()
        this.fireEvent('pagination-data', this.tablePagination)
        this.fireEvent('loaded')
      })
    },

    checkIfRowIdentifierExists() {
      if (!this.dataIsAvailable) return

      if (!this.hasRowIdentifier) {
        this.warn('Invalid your data! Use "track-by" prop to specify.')
        return false
      }

      return true
    },

    makeTitle(str) {
      if (this.isFieldComponent(str)) {
        return ''
      }

      return this.titleCase(str.replace('.', ' '))
    },

    getFieldTitle(field) {
      if (typeof field.title === 'function') return field.title()

      return field.title
    },

    renderNormalField(field, item) {
      return this.hasFormatter(field)
        ? this.callFormatter(field, item)
        : this.getObjectValue(item, field.name, '')
    },

    isFieldComponent(fieldName) {
      if (fieldName instanceof Object) {
        // let's assume it is a Vue component
        return true
      }

      return (
        fieldName.slice(0, this.fieldPrefix.length) === this.fieldPrefix ||
        fieldName.slice(0, 2) === '__'
      )
    },

    isFieldSlot(fieldName) {
      return typeof this.$scopedSlots[fieldName] !== 'undefined'
    },

    titleCase(str) {
      return str.replace(/\w+/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },

    camelCase(str, delimiter = '_') {
      return str
        .split(delimiter)
        .map(item => self.titleCase(item))
        .join('')
    },

    loadData(success = this.loadSuccess, failed = this.loadFailed) {
      if (this.isDataMode) {
        this.handleDataMode()
        return
      }

      this.fireEvent('loading')

      this.httpOptions['params'] = this.getAppendParams(
        this.getAllQueryParams()
      )

      return this.fetch(this.apiUrl, this.httpOptions)
        .then(success, failed)
        .catch(() => failed())
    },

    fetch(apiUrl, httpOptions) {
      if (this.httpFetch) {
        return this.httpFetch(apiUrl, httpOptions)
      }

      if (this.httpMethod === 'get') {
        return axios_default().get(apiUrl, httpOptions)
      } else {
        // Is a POST request
        let params = httpOptions.params
        delete httpOptions.params
        return axios_default().post(apiUrl, params, httpOptions)
      }
    },

    loadSuccess(response) {
      this.fireEvent('load-success', response)

      let body = this.transform ? this.transform(response.data) : response.data

      this.tableData = this.getObjectValue(body, this.dataPath, null)
      this.tablePagination = this.getObjectValue(
        body,
        this.paginationPath,
        null
      )

      if (this.tablePagination === null) {
        this.warn(
          'vuetable: pagination-path "' +
            this.paginationPath +
            '" not found. ' +
            'It looks like the data returned from the server does not have pagination information ' +
            'or you may have set it incorrectly.\n' +
            'You can explicitly suppress this warning by setting pagination-path="".'
        )
      }

      this.$nextTick(() => {
        this.checkIfRowIdentifierExists()
        this.updateHeader()
        this.fireEvent('pagination-data', this.tablePagination)
        this.fireEvent('loaded')
      })
    },

    updateHeader() {
      // $nextTick doesn't seem to work in all cases. This might be because
      // $nextTick is finished before the transition element (just my guess)
      //
      // the scrollHeight value does not yet changed, causing scrollVisible
      // to remain "true", therefore, the header gutter never gets updated
      // to reflect the display of scrollbar in the table body.
      // setTimeout 80ms seems to work in this case.
      setTimeout(this.checkScrollbarVisibility, 80)
    },

    checkScrollbarVisibility() {
      this.$nextTick(() => {
        let elem = this.$el.getElementsByClassName('vuetable-body-wrapper')[0]
        if (elem != null) {
          this.scrollVisible = elem.scrollHeight > elem.clientHeight
          this.fireEvent('scrollbar-visible', this.scrollVisible)
        }
      })
    },

    loadFailed(response) {
      console.error('load-error', response)
      this.fireEvent('load-error', response)
      this.fireEvent('loaded')
    },

    fireEvent() {
      if (arguments.length === 1) {
        return this.$emit(this.eventPrefix + arguments[0])
      }

      if (arguments.length > 1) {
        let args = Array.from(arguments)
        args[0] = this.eventPrefix + args[0]
        return this.$emit.apply(this, args)
      }
    },

    warn(msg) {
      if (!this.silent) {
        console.warn(msg)
      }
    },

    getAllQueryParams() {
      let params = {}

      if (typeof this.queryParams === 'function') {
        params = this.queryParams(
          this.sortOrder,
          this.currentPage,
          this.perPage
        )
        return typeof params === 'object' ? params : {}
      }

      params[this.queryParams.sort] = this.getSortParam()
      params[this.queryParams.page] = this.currentPage
      params[this.queryParams.perPage] = this.perPage

      return params
    },

    getSortParam() {
      if (!this.sortOrder || this.sortOrder.field == '') {
        return ''
      }

      if (typeof this.sortParams === 'function') {
        return this.sortParams(this.sortOrder)
      }

      return this.getDefaultSortParam()
    },

    getDefaultSortParam() {
      return this.sortOrder
        .map(item => `${item.sortField}|${item.direction}`)
        .join(',')
    },

    getAppendParams(params) {
      for (let x in this.appendParams) {
        params[x] = this.appendParams[x]
      }

      return params
    },

    isSortable(field) {
      return field.sortField !== null
    },

    currentSortOrderPosition(field) {
      if (!this.isSortable(field)) {
        return false
      }

      for (let i = 0; i < this.sortOrder.length; i++) {
        if (this.fieldIsInSortOrderPosition(field, i)) {
          return i
        }
      }

      return false
    },

    fieldIsInSortOrderPosition(field, i) {
      return (
        this.sortOrder[i].field === field.name &&
        this.sortOrder[i].sortField === field.sortField
      )
    },

    orderBy(field, event) {
      if (!this.isSortable(field)) return

      let key = this.multiSortKey.toLowerCase() + 'Key'

      if (this.multiSort && event[key]) {
        //adding column to multisort
        this.multiColumnSort(field)
      } else {
        //no multisort, or resetting sort
        this.singleColumnSort(field)
      }

      this.currentPage = this.firstPage // reset page index
      if (this.apiMode || this.dataManager) {
        this.loadData()
      }
    },

    addSortColumn(field, direction) {
      this.sortOrder.push({
        field: field.name,
        sortField: field.sortField,
        direction: 'asc'
      })
    },

    removeSortColumn(index) {
      this.sortOrder.splice(index, 1)
    },

    setSortColumnDirection(index, direction) {
      this.sortOrder[index].direction = direction
    },

    multiColumnSort(field) {
      let i = this.currentSortOrderPosition(field)

      if (i === false) {
        //this field is not in the sort array yet
        this.addSortColumn(field, 'asc')
      } else {
        //this field is in the sort array, now we change its state
        if (this.sortOrder[i].direction === 'asc') {
          // switch direction
          this.setSortColumnDirection(i, 'desc')
        } else {
          this.removeSortColumn(i)
        }
      }
    },

    singleColumnSort(field) {
      if (this.sortOrder.length === 0) {
        // this.clearSortOrder()
        this.addSortColumn(field, 'asc')
        return
      }

      this.sortOrder.splice(1) //removes additional columns

      if (this.fieldIsInSortOrderPosition(field, 0)) {
        // change sort direction
        this.sortOrder[0].direction =
          this.sortOrder[0].direction === 'asc' ? 'desc' : 'asc'
      } else {
        // reset sort direction
        this.sortOrder[0].direction = 'asc'
      }
      this.sortOrder[0].field = field.name
      this.sortOrder[0].sortField = field.sortField
    },

    clearSortOrder() {
      this.sortOrder = []
    },

    hasFormatter(item) {
      return typeof item.formatter === 'function'
    },

    callFormatter(field, item) {
      if (!this.hasFormatter(field)) return

      if (typeof field.formatter === 'function') {
        return field.formatter(this.getObjectValue(item, field.name), this)
      }
    },

    getObjectValue(object, path, defaultValue) {
      defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue

      let obj = object
      if (path.trim() != '') {
        let keys = path.split('.')
        keys.forEach(key => {
          if (
            obj !== null &&
            typeof obj[key] !== 'undefined' &&
            obj[key] !== null
          ) {
            obj = obj[key]
          } else {
            obj = defaultValue
            return
          }
        })
      }
      return obj
    },

    selectId(key) {
      if (!this.isSelectedRow(key)) {
        this.selectedTo.push(key)
      }
    },

    unselectId(key) {
      this.selectedTo = this.selectedTo.filter(item => {
        return item !== key
      })
    },

    isSelectedRow(key) {
      return this.selectedTo.indexOf(key) >= 0
    },

    clearSelectedValues() {
      this.selectedTo = []
    },

    gotoPreviousPage() {
      if (this.currentPage > this.firstPage) {
        this.currentPage--
        this.loadData()
      }
    },

    gotoNextPage() {
      if (this.currentPage < this.tablePagination.last_page) {
        this.currentPage++
        this.loadData()
      }
    },

    gotoPage(page) {
      if (
        page != this.currentPage &&
        page >= this.firstPage &&
        page <= this.tablePagination.last_page
      ) {
        this.currentPage = page
        this.loadData()
      }
    },

    isVisibleDetailRow(rowId) {
      return this.visibleDetailRows.indexOf(rowId) >= 0
    },

    showDetailRow(rowId) {
      if (!this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.push(rowId)
      }
      this.checkScrollbarVisibility()
    },

    hideDetailRow(rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.splice(this.visibleDetailRows.indexOf(rowId), 1)
        this.updateHeader()
      }
    },

    toggleDetailRow(rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.hideDetailRow(rowId)
      } else {
        this.showDetailRow(rowId)
      }
    },

    showField(index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = true
    },

    hideField(index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = false
    },

    toggleField(index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = !this.tableFields[index].visible
    },

    makePagination(total = null, perPage = null, currentPage = null) {
      let pagination = {}
      total = total === null ? 0 : total
      perPage = perPage === null ? this.perPage : perPage
      currentPage = currentPage === null ? this.currentPage : currentPage

      return {
        total: total,
        per_page: perPage,
        current_page: currentPage,
        last_page: Math.ceil(total / perPage) || 0,
        next_page_url: '',
        prev_page_url: '',
        from: (currentPage - 1) * perPage + 1,
        to: Math.min(currentPage * perPage, total)
      }
    },

    normalizeSortOrder() {
      this.sortOrder.forEach(item => {
        item.sortField = item.sortField || item.field
      })
    },

    handleDataMode() {
      // data is array
      if (this.data !== null && Array.isArray(this.data)) {
        this.setData(this.data)
        return
      }

      // data must be an object, check if dataManager is present
      if (this.dataManager) {
        this.callDataManager()
      } else {
        this.setData(this.data)
      }
    },

    callDataManager() {
      const result = this.dataManager(this.sortOrder, this.makePagination())

      if (this.isPromiseObject(result)) {
        result.then(data => this.setData(data))
      } else {
        this.setData(result)
      }
    },

    isObject(unknown) {
      return typeof unknown === 'object' && unknown !== null
    },

    isPromiseObject(unknown) {
      return this.isObject(unknown) && typeof unknown.then === 'function'
    },

    onRowClass(dataItem, index) {
      if (typeof this.rowClass === 'function') {
        return this.rowClass(dataItem, index)
      }

      return this.rowClass
    },

    onDetailRowClass(dataItem, index) {
      if (typeof this.detailRowClass === 'function') {
        return this.detailRowClass(dataItem, index)
      }

      return this.detailRowClass
    },

    onRowClicked(dataItem, dataIndex, event) {
      this.fireEvent('row-clicked', {
        data: dataItem,
        index: dataIndex,
        event: event
      })
      return true
    },

    onRowDoubleClicked(dataItem, dataIndex, event) {
      this.fireEvent('row-dblclicked', {
        data: dataItem,
        index: dataIndex,
        event: event
      })
    },

    onDetailRowClick(dataItem, dataIndex, event) {
      this.fireEvent('detail-row-clicked', {
        data: dataItem,
        index: dataIndex,
        event: event
      })
    },

    onCellClicked(dataItem, dataIndex, field, event) {
      this.fireEvent('cell-clicked', {
        data: dataItem,
        index: dataIndex,
        field: field,
        event: event
      })
    },

    onCellDoubleClicked(dataItem, dataIndex, field, event) {
      this.fireEvent('cell-dblclicked', {
        data: dataItem,
        index: dataIndex,
        field: field,
        event: event
      })
    },

    onCellRightClicked(dataItem, dataIndex, field, event) {
      this.fireEvent('cell-rightclicked', {
        data: dataItem,
        index: dataIndex,
        field: field,
        event: event
      })
    },

    onMouseOver(dataItem, dataIndex, event) {
      this.fireEvent('row-mouseover', {
        data: dataItem,
        index: dataIndex,
        event: event
      })
    },

    onFieldEvent(type, payload) {
      this.fireEvent('field-event', type, payload, this)
    },

    onHeaderEvent(type, payload) {
      this.fireEvent('header-event', type, payload, this)
    },

    onCheckboxToggled(isChecked, fieldName, dataItem) {
      let idColumn = this.trackBy

      if (dataItem[idColumn] === undefined) {
        this.warn(
          'checkbox field: The "' +
            this.trackBy +
            '" field does not exist! Make sure the field you specify in "track-by" prop does exist.'
        )
        return
      }

      let key = dataItem[idColumn]
      if (isChecked) {
        this.selectId(key)
      } else {
        this.unselectId(key)
      }

      this.fireEvent('checkbox-toggled', isChecked, fieldName)
    },

    onCheckboxToggledAll(isChecked) {
      let idColumn = this.trackBy

      if (isChecked) {
        this.tableData.forEach(dataItem => {
          this.selectId(dataItem[idColumn])
        })
      } else {
        this.tableData.forEach(dataItem => {
          this.unselectId(dataItem[idColumn])
        })
      }

      this.fireEvent('checkbox-toggled-all', isChecked)
    },

    /*
     * API for externals
     */
    changePage(page) {
      if (page === 'prev') {
        this.gotoPreviousPage()
      } else if (page === 'next') {
        this.gotoNextPage()
      } else {
        this.gotoPage(page)
      }
    },

    reload() {
      return this.loadData()
    },

    refresh() {
      this.currentPage = this.firstPage
      return this.loadData()
    },

    resetData() {
      this.tableData = null
      this.tablePagination = null
      this.fireEvent('data-reset')
    }
  } // end: methods
});

;// CONCATENATED MODULE: ./src/components/Vuetable.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Vuetablevue_type_script_lang_js_ = (Vuetablevue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-52.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-52.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-52.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/Vuetable.vue?vue&type=style&index=0&id=0c70e2b7&prod&lang=css&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/Vuetable.vue?vue&type=style&index=0&id=0c70e2b7&prod&lang=css&

;// CONCATENATED MODULE: ./src/components/Vuetable.vue



;


/* normalize component */

var Vuetable_component = normalizeComponent(
  components_Vuetablevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Vuetable = (Vuetable_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationMixin.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetablePaginationMixinvue_type_script_lang_js_ = ({
  props: {
    css: {
      type: Object,
      default() {
        return {}
      }
    },
    onEachSide: {
      type: Number,
      default() {
        return 2
      }
    },
    firstPage: {
      type: Number,
      default: 1
    }
  },
  data: function () {
    return {
      eventPrefix: 'vuetable-pagination:',
      tablePagination: null,
      $_css: {}
    }
  },
  computed: {
    totalPage() {
      return this.tablePagination === null
        ? 0
        : this.tablePagination.last_page - this.firstPage + 1
    },
    lastPage() {
      return this.tablePagination === null ? 0 : this.tablePagination.last_page
    },
    isOnFirstPage() {
      return this.tablePagination === null
        ? false
        : this.tablePagination.current_page === this.firstPage
    },
    isOnLastPage() {
      return this.tablePagination === null
        ? false
        : this.tablePagination.current_page === this.lastPage
    },
    notEnoughPages() {
      return this.totalPage < this.onEachSide * 2 + 4
    },
    windowSize() {
      return this.onEachSide * 2 + 1
    },
    windowStart() {
      if (
        !this.tablePagination ||
        this.tablePagination.current_page <= this.onEachSide
      ) {
        return 1
      } else if (
        this.tablePagination.current_page >=
        this.totalPage - this.onEachSide
      ) {
        return this.totalPage - this.onEachSide * 2
      }

      return this.tablePagination.current_page - this.onEachSide
    }
  },
  created() {
    this.mergeCss()
  },
  methods: {
    mergeCss() {
      this.$_css = { ...VuetableCssSemanticUI.pagination, ...this.css }
    },
    loadPage(page) {
      this.$emit(this.eventPrefix + 'change-page', page)
    },
    isCurrentPage(page) {
      return page === this.tablePagination.current_page
    },
    setPaginationData(tablePagination) {
      this.tablePagination = tablePagination
    },
    resetData() {
      this.tablePagination = null
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetablePaginationMixin.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetablePaginationMixinvue_type_script_lang_js_ = (VuetablePaginationMixinvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetablePaginationMixin.vue
var VuetablePaginationMixin_render, VuetablePaginationMixin_staticRenderFns
;



/* normalize component */
;
var VuetablePaginationMixin_component = normalizeComponent(
  components_VuetablePaginationMixinvue_type_script_lang_js_,
  VuetablePaginationMixin_render,
  VuetablePaginationMixin_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetablePaginationMixin = (VuetablePaginationMixin_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationInfoMixin.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetablePaginationInfoMixinvue_type_script_lang_js_ = ({
  props: {
    css: {
      type: Object,
      default() {
        return {}
      }
    },
    infoTemplate: {
      type: String,
      default() {
        return 'Displaying {from} to {to} of {total} items'
      }
    },
    noDataTemplate: {
      type: String,
      default() {
        return 'No relevant data'
      }
    }
  },
  data: function () {
    return {
      tablePagination: null,
      $_css: {}
    }
  },
  computed: {
    paginationInfo() {
      if (this.tablePagination == null || this.tablePagination.total == 0) {
        return this.noDataTemplate
      }

      return this.infoTemplate
        .replace('{from}', this.tablePagination.from || 0)
        .replace('{to}', this.tablePagination.to || 0)
        .replace('{total}', this.tablePagination.total || 0)
    }
  },
  created() {
    this.mergeCss()
  },
  methods: {
    mergeCss() {
      this.$_css = { ...VuetableCssSemanticUI.paginationInfo, ...this.css }
    },
    setPaginationData(tablePagination) {
      this.tablePagination = tablePagination
    },
    resetData() {
      this.tablePagination = null
    }
  }
});

;// CONCATENATED MODULE: ./src/components/VuetablePaginationInfoMixin.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetablePaginationInfoMixinvue_type_script_lang_js_ = (VuetablePaginationInfoMixinvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetablePaginationInfoMixin.vue
var VuetablePaginationInfoMixin_render, VuetablePaginationInfoMixin_staticRenderFns
;



/* normalize component */
;
var VuetablePaginationInfoMixin_component = normalizeComponent(
  components_VuetablePaginationInfoMixinvue_type_script_lang_js_,
  VuetablePaginationInfoMixin_render,
  VuetablePaginationInfoMixin_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetablePaginationInfoMixin = (VuetablePaginationInfoMixin_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePagination.vue?vue&type=template&id=0f7faeb0&
var VuetablePaginationvue_type_template_id_0f7faeb0_render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.tablePagination && _vm.lastPage > _vm.firstPage),expression:"tablePagination && lastPage > firstPage"}],class:_vm.$_css.wrapperClass},[_c('a',{class:[
      'btn-nav',
      _vm.$_css.linkClass,
      _vm.isOnFirstPage ? _vm.$_css.disabledClass : ''
    ],on:{"click":function($event){return _vm.loadPage(_vm.firstPage)}}},[(_vm.$_css.icons.first != '')?_c('i',{class:[_vm.$_css.icons.first]}):_c('span',[_vm._v("«")])]),_c('a',{class:[
      'btn-nav',
      _vm.$_css.linkClass,
      _vm.isOnFirstPage ? _vm.$_css.disabledClass : ''
    ],on:{"click":function($event){return _vm.loadPage('prev')}}},[(_vm.$_css.icons.next != '')?_c('i',{class:[_vm.$_css.icons.prev]}):_c('span',[_vm._v(" ‹")])]),(_vm.notEnoughPages)?[_vm._l((_vm.totalPage),function(n,i){return [_c('a',{key:i,class:[
          _vm.$_css.pageClass,
          _vm.isCurrentPage(i + _vm.firstPage) ? _vm.$_css.activeClass : ''
        ],domProps:{"innerHTML":_vm._s(n)},on:{"click":function($event){return _vm.loadPage(i + _vm.firstPage)}}})]})]:[_vm._l((_vm.windowSize),function(n,i){return [_c('a',{key:i,class:[
          _vm.$_css.pageClass,
          _vm.isCurrentPage(_vm.windowStart + i + _vm.firstPage - 1)
            ? _vm.$_css.activeClass
            : ''
        ],domProps:{"innerHTML":_vm._s(_vm.windowStart + n - 1)},on:{"click":function($event){return _vm.loadPage(_vm.windowStart + i + _vm.firstPage - 1)}}})]})],_c('a',{class:[
      'btn-nav',
      _vm.$_css.linkClass,
      _vm.isOnLastPage ? _vm.$_css.disabledClass : ''
    ],on:{"click":function($event){return _vm.loadPage('next')}}},[(_vm.$_css.icons.next != '')?_c('i',{class:[_vm.$_css.icons.next]}):_c('span',[_vm._v("› ")])]),_c('a',{class:[
      'btn-nav',
      _vm.$_css.linkClass,
      _vm.isOnLastPage ? _vm.$_css.disabledClass : ''
    ],on:{"click":function($event){return _vm.loadPage(_vm.lastPage)}}},[(_vm.$_css.icons.last != '')?_c('i',{class:[_vm.$_css.icons.last]}):_c('span',[_vm._v("»")])])],2)
}
var VuetablePaginationvue_type_template_id_0f7faeb0_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePagination.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetablePaginationvue_type_script_lang_js_ = ({
  mixins: [VuetablePaginationMixin]
});

;// CONCATENATED MODULE: ./src/components/VuetablePagination.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetablePaginationvue_type_script_lang_js_ = (VuetablePaginationvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-52.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-52.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-52.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePagination.vue?vue&type=style&index=0&id=0f7faeb0&prod&lang=css&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/VuetablePagination.vue?vue&type=style&index=0&id=0f7faeb0&prod&lang=css&

;// CONCATENATED MODULE: ./src/components/VuetablePagination.vue



;


/* normalize component */

var VuetablePagination_component = normalizeComponent(
  components_VuetablePaginationvue_type_script_lang_js_,
  VuetablePaginationvue_type_template_id_0f7faeb0_render,
  VuetablePaginationvue_type_template_id_0f7faeb0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetablePagination = (VuetablePagination_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationDropdown.vue?vue&type=template&id=142d3de4&
var VuetablePaginationDropdownvue_type_template_id_142d3de4_render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{class:[_vm.$_css.wrapperClass]},[_c('a',{class:[_vm.$_css.linkClass, { [_vm.$_css.disabledClass]: _vm.isOnFirstPage }],on:{"click":function($event){return _vm.loadPage('prev')}}},[_c('i',{class:_vm.$_css.icons.prev})]),_c('select',{class:['vuetable-pagination-dropdown', _vm.$_css.dropdownClass],on:{"change":function($event){return _vm.loadPage($event.target.selectedIndex + _vm.firstPage)}}},_vm._l((_vm.totalPage),function(n,i){return _c('option',{key:n,class:[_vm.$_css.pageClass],domProps:{"value":i + _vm.firstPage,"selected":_vm.isCurrentPage(i + _vm.firstPage)}},[_vm._v(" "+_vm._s(_vm.pageText)+" "+_vm._s(n)+" ")])}),0),_c('a',{class:[_vm.$_css.linkClass, { [_vm.$_css.disabledClass]: _vm.isOnLastPage }],on:{"click":function($event){return _vm.loadPage('next')}}},[_c('i',{class:_vm.$_css.icons.next})])])
}
var VuetablePaginationDropdownvue_type_template_id_142d3de4_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationDropdown.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetablePaginationDropdownvue_type_script_lang_js_ = ({
  mixins: [VuetablePaginationMixin],
  props: {
    pageText: {
      type: String,
      default() {
        return 'Page'
      }
    }
  },
  methods: {
    registerEvents() {
      this.$on('vuetable:pagination-data', tablePagination => {
        this.setPaginationData(tablePagination)
      })
    }
  },
  created() {
    this.registerEvents()
  }
});

;// CONCATENATED MODULE: ./src/components/VuetablePaginationDropdown.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetablePaginationDropdownvue_type_script_lang_js_ = (VuetablePaginationDropdownvue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./src/components/VuetablePaginationDropdown.vue





/* normalize component */
;
var VuetablePaginationDropdown_component = normalizeComponent(
  components_VuetablePaginationDropdownvue_type_script_lang_js_,
  VuetablePaginationDropdownvue_type_template_id_142d3de4_render,
  VuetablePaginationDropdownvue_type_template_id_142d3de4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetablePaginationDropdown = (VuetablePaginationDropdown_component.exports);
;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationInfo.vue?vue&type=template&id=27c8baec&
var VuetablePaginationInfovue_type_template_id_27c8baec_render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{class:['vuetable-pagination-info', _vm.$_css.infoClass],domProps:{"innerHTML":_vm._s(_vm.paginationInfo)}})
}
var VuetablePaginationInfovue_type_template_id_27c8baec_staticRenderFns = []


;// CONCATENATED MODULE: ./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationInfo.vue?vue&type=script&lang=js&



/* harmony default export */ var VuetablePaginationInfovue_type_script_lang_js_ = ({
  mixins: [VuetablePaginationInfoMixin]
});

;// CONCATENATED MODULE: ./src/components/VuetablePaginationInfo.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VuetablePaginationInfovue_type_script_lang_js_ = (VuetablePaginationInfovue_type_script_lang_js_); 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-52.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-52.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-52.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/VuetablePaginationInfo.vue?vue&type=style&index=0&id=27c8baec&prod&lang=css&
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/VuetablePaginationInfo.vue?vue&type=style&index=0&id=27c8baec&prod&lang=css&

;// CONCATENATED MODULE: ./src/components/VuetablePaginationInfo.vue



;


/* normalize component */

var VuetablePaginationInfo_component = normalizeComponent(
  components_VuetablePaginationInfovue_type_script_lang_js_,
  VuetablePaginationInfovue_type_template_id_27c8baec_render,
  VuetablePaginationInfovue_type_template_id_27c8baec_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var VuetablePaginationInfo = (VuetablePaginationInfo_component.exports);
;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/finally.js
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      // @ts-ignore
      return constructor.resolve(callback()).then(function() {
        // @ts-ignore
        return constructor.reject(reason);
      });
    }
  );
}

/* harmony default export */ var src_finally = (finallyConstructor);

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/allSettled.js
function allSettled(arr) {
  var P = this;
  return new P(function(resolve, reject) {
    if (!(arr && typeof arr.length !== 'undefined')) {
      return reject(
        new TypeError(
          typeof arr +
            ' ' +
            arr +
            ' is not iterable(cannot read property Symbol(Symbol.iterator))'
        )
      );
    }
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        var then = val.then;
        if (typeof then === 'function') {
          then.call(
            val,
            function(val) {
              res(i, val);
            },
            function(e) {
              args[i] = { status: 'rejected', reason: e };
              if (--remaining === 0) {
                resolve(args);
              }
            }
          );
          return;
        }
      }
      args[i] = { status: 'fulfilled', value: val };
      if (--remaining === 0) {
        resolve(args);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
}

/* harmony default export */ var src_allSettled = (allSettled);

;// CONCATENATED MODULE: ./node_modules/promise-polyfill/src/index.js



// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = src_finally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.allSettled = src_allSettled;

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  // @ts-ignore
  (typeof setImmediate === 'function' &&
    function(fn) {
      // @ts-ignore
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/* harmony default export */ var promise_polyfill_src = (Promise);

;// CONCATENATED MODULE: ./src/index.js

















const rootVariable =
  (typeof self === 'object' && self.self === self && self) ||
  (typeof __webpack_require__.g === 'object' && __webpack_require__.g) ||
  undefined
if (!rootVariable.Promise) {
  rootVariable.Promise = promise_polyfill_src
}

function install(Vue) {
  Vue.component('vuetable', Vuetable)
  Vue.component('vuetable-col-gutter', VuetableColGutter)
  Vue.component('vuetable-field-checkbox', VuetableFieldCheckbox)
  Vue.component('vuetable-field-handle', VuetableFieldHandle)
  Vue.component('vuetable-field-sequence', VuetableFieldSequence)
  Vue.component('vuetable-pagination', VuetablePagination)
  Vue.component('vuetable-pagination-dropdown', VuetablePaginationDropdown)
  Vue.component('vuetable-pagination-info', VuetablePaginationInfo)
  Vue.component('vuetable-row-header', VuetableRowHeader)
}


/* harmony default export */ var src_0 = (Vuetable);

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (src_0);


}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=table-vue2.umd.js.map