var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/csurf/node_modules/cookie/index.js
var require_cookie = __commonJS({
  "../../node_modules/csurf/node_modules/cookie/index.js"(exports2) {
    "use strict";
    exports2.parse = parse;
    exports2.serialize = serialize;
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var pairSplitRegExp = /; */;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var pairs = str.split(pairSplitRegExp);
      var dec = opt.decode || decode;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf("=");
        if (eq_idx < 0) {
          continue;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        if ('"' == val[0]) {
          val = val.slice(1, -1);
        }
        if (void 0 == obj[key]) {
          obj[key] = tryDecode(val, dec);
        }
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge)) throw new Error("maxAge should be a Number");
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== "function") {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// ../../node_modules/csurf/node_modules/depd/lib/compat/callsite-tostring.js
var require_callsite_tostring = __commonJS({
  "../../node_modules/csurf/node_modules/depd/lib/compat/callsite-tostring.js"(exports2, module2) {
    "use strict";
    module2.exports = callSiteToString2;
    function callSiteFileLocation(callSite) {
      var fileName;
      var fileLocation = "";
      if (callSite.isNative()) {
        fileLocation = "native";
      } else if (callSite.isEval()) {
        fileName = callSite.getScriptNameOrSourceURL();
        if (!fileName) {
          fileLocation = callSite.getEvalOrigin();
        }
      } else {
        fileName = callSite.getFileName();
      }
      if (fileName) {
        fileLocation += fileName;
        var lineNumber = callSite.getLineNumber();
        if (lineNumber != null) {
          fileLocation += ":" + lineNumber;
          var columnNumber = callSite.getColumnNumber();
          if (columnNumber) {
            fileLocation += ":" + columnNumber;
          }
        }
      }
      return fileLocation || "unknown source";
    }
    function callSiteToString2(callSite) {
      var addSuffix = true;
      var fileLocation = callSiteFileLocation(callSite);
      var functionName = callSite.getFunctionName();
      var isConstructor = callSite.isConstructor();
      var isMethodCall = !(callSite.isToplevel() || isConstructor);
      var line = "";
      if (isMethodCall) {
        var methodName = callSite.getMethodName();
        var typeName = getConstructorName(callSite);
        if (functionName) {
          if (typeName && functionName.indexOf(typeName) !== 0) {
            line += typeName + ".";
          }
          line += functionName;
          if (methodName && functionName.lastIndexOf("." + methodName) !== functionName.length - methodName.length - 1) {
            line += " [as " + methodName + "]";
          }
        } else {
          line += typeName + "." + (methodName || "<anonymous>");
        }
      } else if (isConstructor) {
        line += "new " + (functionName || "<anonymous>");
      } else if (functionName) {
        line += functionName;
      } else {
        addSuffix = false;
        line += fileLocation;
      }
      if (addSuffix) {
        line += " (" + fileLocation + ")";
      }
      return line;
    }
    function getConstructorName(obj) {
      var receiver = obj.receiver;
      return receiver.constructor && receiver.constructor.name || null;
    }
  }
});

// ../../node_modules/csurf/node_modules/depd/lib/compat/event-listener-count.js
var require_event_listener_count = __commonJS({
  "../../node_modules/csurf/node_modules/depd/lib/compat/event-listener-count.js"(exports2, module2) {
    "use strict";
    module2.exports = eventListenerCount2;
    function eventListenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    }
  }
});

// ../../node_modules/csurf/node_modules/depd/lib/compat/index.js
var require_compat = __commonJS({
  "../../node_modules/csurf/node_modules/depd/lib/compat/index.js"(exports2, module2) {
    "use strict";
    var EventEmitter = __require("events").EventEmitter;
    lazyProperty(module2.exports, "callSiteToString", function callSiteToString2() {
      var limit = Error.stackTraceLimit;
      var obj = {};
      var prep = Error.prepareStackTrace;
      function prepareObjectStackTrace2(obj2, stack3) {
        return stack3;
      }
      Error.prepareStackTrace = prepareObjectStackTrace2;
      Error.stackTraceLimit = 2;
      Error.captureStackTrace(obj);
      var stack2 = obj.stack.slice();
      Error.prepareStackTrace = prep;
      Error.stackTraceLimit = limit;
      return stack2[0].toString ? toString : require_callsite_tostring();
    });
    lazyProperty(module2.exports, "eventListenerCount", function eventListenerCount2() {
      return EventEmitter.listenerCount || require_event_listener_count();
    });
    function lazyProperty(obj, prop, getter) {
      function get() {
        var val = getter();
        Object.defineProperty(obj, prop, {
          configurable: true,
          enumerable: true,
          value: val
        });
        return val;
      }
      Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        get
      });
    }
    function toString(obj) {
      return obj.toString();
    }
  }
});

// ../../node_modules/csurf/node_modules/depd/index.js
var require_depd = __commonJS({
  "../../node_modules/csurf/node_modules/depd/index.js"(exports, module) {
    var callSiteToString = require_compat().callSiteToString;
    var eventListenerCount = require_compat().eventListenerCount;
    var relative = __require("path").relative;
    module.exports = depd;
    var basePath = process.cwd();
    function containsNamespace(str, namespace) {
      var vals = str.split(/[ ,]+/);
      var ns = String(namespace).toLowerCase();
      for (var i = 0; i < vals.length; i++) {
        var val = vals[i];
        if (val && (val === "*" || val.toLowerCase() === ns)) {
          return true;
        }
      }
      return false;
    }
    function convertDataDescriptorToAccessor(obj, prop, message2) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      var value = descriptor.value;
      descriptor.get = function getter() {
        return value;
      };
      if (descriptor.writable) {
        descriptor.set = function setter(val) {
          return value = val;
        };
      }
      delete descriptor.value;
      delete descriptor.writable;
      Object.defineProperty(obj, prop, descriptor);
      return descriptor;
    }
    function createArgumentsString(arity) {
      var str = "";
      for (var i = 0; i < arity; i++) {
        str += ", arg" + i;
      }
      return str.substr(2);
    }
    function createStackString(stack2) {
      var str = this.name + ": " + this.namespace;
      if (this.message) {
        str += " deprecated " + this.message;
      }
      for (var i = 0; i < stack2.length; i++) {
        str += "\n    at " + callSiteToString(stack2[i]);
      }
      return str;
    }
    function depd(namespace) {
      if (!namespace) {
        throw new TypeError("argument namespace is required");
      }
      var stack2 = getStack();
      var site2 = callSiteLocation(stack2[1]);
      var file = site2[0];
      function deprecate2(message2) {
        log.call(deprecate2, message2);
      }
      deprecate2._file = file;
      deprecate2._ignored = isignored(namespace);
      deprecate2._namespace = namespace;
      deprecate2._traced = istraced(namespace);
      deprecate2._warned = /* @__PURE__ */ Object.create(null);
      deprecate2.function = wrapfunction;
      deprecate2.property = wrapproperty;
      return deprecate2;
    }
    function isignored(namespace) {
      if (process.noDeprecation) {
        return true;
      }
      var str = process.env.NO_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function istraced(namespace) {
      if (process.traceDeprecation) {
        return true;
      }
      var str = process.env.TRACE_DEPRECATION || "";
      return containsNamespace(str, namespace);
    }
    function log(message2, site2) {
      var haslisteners = eventListenerCount(process, "deprecation") !== 0;
      if (!haslisteners && this._ignored) {
        return;
      }
      var caller;
      var callFile;
      var callSite;
      var depSite;
      var i = 0;
      var seen = false;
      var stack2 = getStack();
      var file = this._file;
      if (site2) {
        depSite = site2;
        callSite = callSiteLocation(stack2[1]);
        callSite.name = depSite.name;
        file = callSite[0];
      } else {
        i = 2;
        depSite = callSiteLocation(stack2[i]);
        callSite = depSite;
      }
      for (; i < stack2.length; i++) {
        caller = callSiteLocation(stack2[i]);
        callFile = caller[0];
        if (callFile === file) {
          seen = true;
        } else if (callFile === this._file) {
          file = this._file;
        } else if (seen) {
          break;
        }
      }
      var key = caller ? depSite.join(":") + "__" + caller.join(":") : void 0;
      if (key !== void 0 && key in this._warned) {
        return;
      }
      this._warned[key] = true;
      var msg = message2;
      if (!msg) {
        msg = callSite === depSite || !callSite.name ? defaultMessage(depSite) : defaultMessage(callSite);
      }
      if (haslisteners) {
        var err = DeprecationError(this._namespace, msg, stack2.slice(i));
        process.emit("deprecation", err);
        return;
      }
      var format = process.stderr.isTTY ? formatColor : formatPlain;
      var output = format.call(this, msg, caller, stack2.slice(i));
      process.stderr.write(output + "\n", "utf8");
    }
    function callSiteLocation(callSite) {
      var file = callSite.getFileName() || "<anonymous>";
      var line = callSite.getLineNumber();
      var colm = callSite.getColumnNumber();
      if (callSite.isEval()) {
        file = callSite.getEvalOrigin() + ", " + file;
      }
      var site2 = [file, line, colm];
      site2.callSite = callSite;
      site2.name = callSite.getFunctionName();
      return site2;
    }
    function defaultMessage(site2) {
      var callSite = site2.callSite;
      var funcName = site2.name;
      if (!funcName) {
        funcName = "<anonymous@" + formatLocation(site2) + ">";
      }
      var context = callSite.getThis();
      var typeName = context && callSite.getTypeName();
      if (typeName === "Object") {
        typeName = void 0;
      }
      if (typeName === "Function") {
        typeName = context.name || typeName;
      }
      return typeName && callSite.getMethodName() ? typeName + "." + funcName : funcName;
    }
    function formatPlain(msg, caller, stack2) {
      var timestamp2 = (/* @__PURE__ */ new Date()).toUTCString();
      var formatted = timestamp2 + " " + this._namespace + " deprecated " + msg;
      if (this._traced) {
        for (var i = 0; i < stack2.length; i++) {
          formatted += "\n    at " + callSiteToString(stack2[i]);
        }
        return formatted;
      }
      if (caller) {
        formatted += " at " + formatLocation(caller);
      }
      return formatted;
    }
    function formatColor(msg, caller, stack2) {
      var formatted = "\x1B[36;1m" + this._namespace + "\x1B[22;39m \x1B[33;1mdeprecated\x1B[22;39m \x1B[0m" + msg + "\x1B[39m";
      if (this._traced) {
        for (var i = 0; i < stack2.length; i++) {
          formatted += "\n    \x1B[36mat " + callSiteToString(stack2[i]) + "\x1B[39m";
        }
        return formatted;
      }
      if (caller) {
        formatted += " \x1B[36m" + formatLocation(caller) + "\x1B[39m";
      }
      return formatted;
    }
    function formatLocation(callSite) {
      return relative(basePath, callSite[0]) + ":" + callSite[1] + ":" + callSite[2];
    }
    function getStack() {
      var limit = Error.stackTraceLimit;
      var obj = {};
      var prep = Error.prepareStackTrace;
      Error.prepareStackTrace = prepareObjectStackTrace;
      Error.stackTraceLimit = Math.max(10, limit);
      Error.captureStackTrace(obj);
      var stack2 = obj.stack.slice(1);
      Error.prepareStackTrace = prep;
      Error.stackTraceLimit = limit;
      return stack2;
    }
    function prepareObjectStackTrace(obj, stack2) {
      return stack2;
    }
    function wrapfunction(fn, message) {
      if (typeof fn !== "function") {
        throw new TypeError("argument fn must be a function");
      }
      var args = createArgumentsString(fn.length);
      var deprecate = this;
      var stack = getStack();
      var site = callSiteLocation(stack[1]);
      site.name = fn.name;
      var deprecatedfn = eval("(function (" + args + ') {\n"use strict"\nlog.call(deprecate, message, site)\nreturn fn.apply(this, arguments)\n})');
      return deprecatedfn;
    }
    function wrapproperty(obj, prop, message2) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new TypeError("argument obj must be object");
      }
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (!descriptor) {
        throw new TypeError("must call property on owner object");
      }
      if (!descriptor.configurable) {
        throw new TypeError("property must be configurable");
      }
      var deprecate2 = this;
      var stack2 = getStack();
      var site2 = callSiteLocation(stack2[1]);
      site2.name = prop;
      if ("value" in descriptor) {
        descriptor = convertDataDescriptorToAccessor(obj, prop, message2);
      }
      var get = descriptor.get;
      var set = descriptor.set;
      if (typeof get === "function") {
        descriptor.get = function getter() {
          log.call(deprecate2, message2, site2);
          return get.apply(this, arguments);
        };
      }
      if (typeof set === "function") {
        descriptor.set = function setter() {
          log.call(deprecate2, message2, site2);
          return set.apply(this, arguments);
        };
      }
      Object.defineProperty(obj, prop, descriptor);
    }
    function DeprecationError(namespace, message2, stack2) {
      var error = new Error();
      var stackString;
      Object.defineProperty(error, "constructor", {
        value: DeprecationError
      });
      Object.defineProperty(error, "message", {
        configurable: true,
        enumerable: false,
        value: message2,
        writable: true
      });
      Object.defineProperty(error, "name", {
        enumerable: false,
        configurable: true,
        value: "DeprecationError",
        writable: true
      });
      Object.defineProperty(error, "namespace", {
        configurable: true,
        enumerable: false,
        value: namespace,
        writable: true
      });
      Object.defineProperty(error, "stack", {
        configurable: true,
        enumerable: false,
        get: function() {
          if (stackString !== void 0) {
            return stackString;
          }
          return stackString = createStackString.call(this, stack2);
        },
        set: function setter(val) {
          stackString = val;
        }
      });
      return error;
    }
  }
});

// ../../node_modules/csurf/node_modules/setprototypeof/index.js
var require_setprototypeof = __commonJS({
  "../../node_modules/csurf/node_modules/setprototypeof/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
    function setProtoOf(obj, proto) {
      obj.__proto__ = proto;
      return obj;
    }
    function mixinProperties(obj, proto) {
      for (var prop in proto) {
        if (!obj.hasOwnProperty(prop)) {
          obj[prop] = proto[prop];
        }
      }
      return obj;
    }
  }
});

// ../../node_modules/csurf/node_modules/statuses/codes.json
var require_codes = __commonJS({
  "../../node_modules/csurf/node_modules/statuses/codes.json"(exports2, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// ../../node_modules/csurf/node_modules/statuses/index.js
var require_statuses = __commonJS({
  "../../node_modules/csurf/node_modules/statuses/index.js"(exports2, module2) {
    "use strict";
    var codes = require_codes();
    module2.exports = status;
    status.STATUS_CODES = codes;
    status.codes = populateStatusesMap(status, codes);
    status.redirect = {
      300: true,
      301: true,
      302: true,
      303: true,
      305: true,
      307: true,
      308: true
    };
    status.empty = {
      204: true,
      205: true,
      304: true
    };
    status.retry = {
      502: true,
      503: true,
      504: true
    };
    function populateStatusesMap(statuses, codes2) {
      var arr = [];
      Object.keys(codes2).forEach(function forEachCode(code) {
        var message2 = codes2[code];
        var status2 = Number(code);
        statuses[status2] = message2;
        statuses[message2] = status2;
        statuses[message2.toLowerCase()] = status2;
        arr.push(status2);
      });
      return arr;
    }
    function status(code) {
      if (typeof code === "number") {
        if (!status[code]) throw new Error("invalid status code: " + code);
        return code;
      }
      if (typeof code !== "string") {
        throw new TypeError("code must be a number or string");
      }
      var n = parseInt(code, 10);
      if (!isNaN(n)) {
        if (!status[n]) throw new Error("invalid status code: " + n);
        return n;
      }
      n = status[code.toLowerCase()];
      if (!n) throw new Error('invalid status message: "' + code + '"');
      return n;
    }
  }
});

// ../../node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "../../node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// ../../node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "../../node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function") throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// ../../node_modules/csurf/node_modules/toidentifier/index.js
var require_toidentifier = __commonJS({
  "../../node_modules/csurf/node_modules/toidentifier/index.js"(exports2, module2) {
    module2.exports = toIdentifier;
    function toIdentifier(str) {
      return str.split(" ").map(function(token) {
        return token.slice(0, 1).toUpperCase() + token.slice(1);
      }).join("").replace(/[^ _0-9a-z]/gi, "");
    }
  }
});

// ../../node_modules/csurf/node_modules/http-errors/index.js
var require_http_errors = __commonJS({
  "../../node_modules/csurf/node_modules/http-errors/index.js"(exports2, module2) {
    "use strict";
    var deprecate2 = require_depd()("http-errors");
    var setPrototypeOf = require_setprototypeof();
    var statuses = require_statuses();
    var inherits = require_inherits();
    var toIdentifier = require_toidentifier();
    module2.exports = createError;
    module2.exports.HttpError = createHttpErrorConstructor();
    populateConstructorExports(module2.exports, statuses.codes, module2.exports.HttpError);
    function codeClass(status) {
      return Number(String(status).charAt(0) + "00");
    }
    function createError() {
      var err;
      var msg;
      var status = 500;
      var props = {};
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg instanceof Error) {
          err = arg;
          status = err.status || err.statusCode || status;
          continue;
        }
        switch (typeof arg) {
          case "string":
            msg = arg;
            break;
          case "number":
            status = arg;
            if (i !== 0) {
              deprecate2("non-first-argument status code; replace with createError(" + arg + ", ...)");
            }
            break;
          case "object":
            props = arg;
            break;
        }
      }
      if (typeof status === "number" && (status < 400 || status >= 600)) {
        deprecate2("non-error status code; use only 4xx or 5xx status codes");
      }
      if (typeof status !== "number" || !statuses[status] && (status < 400 || status >= 600)) {
        status = 500;
      }
      var HttpError = createError[status] || createError[codeClass(status)];
      if (!err) {
        err = HttpError ? new HttpError(msg) : new Error(msg || statuses[status]);
        Error.captureStackTrace(err, createError);
      }
      if (!HttpError || !(err instanceof HttpError) || err.status !== status) {
        err.expose = status < 500;
        err.status = err.statusCode = status;
      }
      for (var key in props) {
        if (key !== "status" && key !== "statusCode") {
          err[key] = props[key];
        }
      }
      return err;
    }
    function createHttpErrorConstructor() {
      function HttpError() {
        throw new TypeError("cannot construct abstract class");
      }
      inherits(HttpError, Error);
      return HttpError;
    }
    function createClientErrorConstructor(HttpError, name, code) {
      var className = name.match(/Error$/) ? name : name + "Error";
      function ClientError(message2) {
        var msg = message2 != null ? message2 : statuses[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ClientError);
        setPrototypeOf(err, ClientError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ClientError, HttpError);
      nameFunc(ClientError, className);
      ClientError.prototype.status = code;
      ClientError.prototype.statusCode = code;
      ClientError.prototype.expose = true;
      return ClientError;
    }
    function createServerErrorConstructor(HttpError, name, code) {
      var className = name.match(/Error$/) ? name : name + "Error";
      function ServerError(message2) {
        var msg = message2 != null ? message2 : statuses[code];
        var err = new Error(msg);
        Error.captureStackTrace(err, ServerError);
        setPrototypeOf(err, ServerError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(ServerError, HttpError);
      nameFunc(ServerError, className);
      ServerError.prototype.status = code;
      ServerError.prototype.statusCode = code;
      ServerError.prototype.expose = false;
      return ServerError;
    }
    function nameFunc(func, name) {
      var desc = Object.getOwnPropertyDescriptor(func, "name");
      if (desc && desc.configurable) {
        desc.value = name;
        Object.defineProperty(func, "name", desc);
      }
    }
    function populateConstructorExports(exports3, codes, HttpError) {
      codes.forEach(function forEachCode(code) {
        var CodeError;
        var name = toIdentifier(statuses[code]);
        switch (codeClass(code)) {
          case 400:
            CodeError = createClientErrorConstructor(HttpError, name, code);
            break;
          case 500:
            CodeError = createServerErrorConstructor(HttpError, name, code);
            break;
        }
        if (CodeError) {
          exports3[code] = CodeError;
          exports3[name] = CodeError;
        }
      });
      exports3["I'mateapot"] = deprecate2.function(
        exports3.ImATeapot,
        `"I'mateapot"; use "ImATeapot" instead`
      );
    }
  }
});

// ../../node_modules/cookie-signature/index.js
var require_cookie_signature = __commonJS({
  "../../node_modules/cookie-signature/index.js"(exports2) {
    var crypto = __require("crypto");
    exports2.sign = function(val, secret2) {
      if ("string" != typeof val) throw new TypeError("Cookie value must be provided as a string.");
      if ("string" != typeof secret2) throw new TypeError("Secret string must be provided.");
      return val + "." + crypto.createHmac("sha256", secret2).update(val).digest("base64").replace(/\=+$/, "");
    };
    exports2.unsign = function(val, secret2) {
      if ("string" != typeof val) throw new TypeError("Signed cookie string must be provided.");
      if ("string" != typeof secret2) throw new TypeError("Secret string must be provided.");
      var str = val.slice(0, val.lastIndexOf(".")), mac = exports2.sign(str, secret2);
      return sha1(mac) == sha1(val) ? str : false;
    };
    function sha1(str) {
      return crypto.createHash("sha1").update(str).digest("hex");
    }
  }
});

// ../../node_modules/rndm/index.js
var require_rndm = __commonJS({
  "../../node_modules/rndm/index.js"(exports2, module2) {
    var assert = __require("assert");
    var base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var base36 = "abcdefghijklmnopqrstuvwxyz0123456789";
    var base10 = "0123456789";
    exports2 = module2.exports = create(base62);
    exports2.base62 = exports2;
    exports2.base36 = create(base36);
    exports2.base10 = create(base10);
    exports2.create = create;
    function create(chars) {
      assert(typeof chars === "string", "the list of characters must be a string!");
      var length = Buffer.byteLength(chars);
      return function rndm(len) {
        len = len || 10;
        assert(typeof len === "number" && len >= 0, "the length of the random string must be a number!");
        var salt = "";
        for (var i = 0; i < len; i++) salt += chars[Math.floor(length * Math.random())];
        return salt;
      };
    }
  }
});

// ../../node_modules/random-bytes/index.js
var require_random_bytes = __commonJS({
  "../../node_modules/random-bytes/index.js"(exports2, module2) {
    "use strict";
    var crypto = __require("crypto");
    var generateAttempts = crypto.randomBytes === crypto.pseudoRandomBytes ? 1 : 3;
    module2.exports = randomBytes2;
    module2.exports.sync = randomBytesSync;
    function randomBytes2(size, callback) {
      if (callback !== void 0 && typeof callback !== "function") {
        throw new TypeError("argument callback must be a function");
      }
      if (!callback && !global.Promise) {
        throw new TypeError("argument callback is required");
      }
      if (callback) {
        return generateRandomBytes(size, generateAttempts, callback);
      }
      return new Promise(function executor(resolve2, reject) {
        generateRandomBytes(size, generateAttempts, function onRandomBytes(err, str) {
          if (err) return reject(err);
          resolve2(str);
        });
      });
    }
    function randomBytesSync(size) {
      var err = null;
      for (var i = 0; i < generateAttempts; i++) {
        try {
          return crypto.randomBytes(size);
        } catch (e) {
          err = e;
        }
      }
      throw err;
    }
    function generateRandomBytes(size, attempts, callback) {
      crypto.randomBytes(size, function onRandomBytes(err, buf) {
        if (!err) return callback(null, buf);
        if (!--attempts) return callback(err);
        setTimeout(generateRandomBytes.bind(null, size, attempts, callback), 10);
      });
    }
  }
});

// ../../node_modules/uid-safe/index.js
var require_uid_safe = __commonJS({
  "../../node_modules/uid-safe/index.js"(exports2, module2) {
    "use strict";
    var randomBytes2 = require_random_bytes();
    var EQUAL_END_REGEXP = /=+$/;
    var PLUS_GLOBAL_REGEXP = /\+/g;
    var SLASH_GLOBAL_REGEXP = /\//g;
    module2.exports = uid;
    module2.exports.sync = uidSync;
    function uid(length, callback) {
      if (callback !== void 0 && typeof callback !== "function") {
        throw new TypeError("argument callback must be a function");
      }
      if (!callback && !global.Promise) {
        throw new TypeError("argument callback is required");
      }
      if (callback) {
        return generateUid(length, callback);
      }
      return new Promise(function executor(resolve2, reject) {
        generateUid(length, function onUid(err, str) {
          if (err) return reject(err);
          resolve2(str);
        });
      });
    }
    function uidSync(length) {
      return toString(randomBytes2.sync(length));
    }
    function generateUid(length, callback) {
      randomBytes2(length, function(err, buf) {
        if (err) return callback(err);
        callback(null, toString(buf));
      });
    }
    function toString(buf) {
      return buf.toString("base64").replace(EQUAL_END_REGEXP, "").replace(PLUS_GLOBAL_REGEXP, "-").replace(SLASH_GLOBAL_REGEXP, "_");
    }
  }
});

// ../../node_modules/tsscmp/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/tsscmp/lib/index.js"(exports2, module2) {
    "use strict";
    var crypto = __require("crypto");
    function bufferEqual(a, b) {
      if (a.length !== b.length) {
        return false;
      }
      if (crypto.timingSafeEqual) {
        return crypto.timingSafeEqual(a, b);
      }
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    function timeSafeCompare(a, b) {
      var sa = String(a);
      var sb = String(b);
      var key = crypto.pseudoRandomBytes(32);
      var ah = crypto.createHmac("sha256", key).update(sa).digest();
      var bh = crypto.createHmac("sha256", key).update(sb).digest();
      return bufferEqual(ah, bh) && a === b;
    }
    module2.exports = timeSafeCompare;
  }
});

// ../../node_modules/csrf/index.js
var require_csrf = __commonJS({
  "../../node_modules/csrf/index.js"(exports2, module2) {
    "use strict";
    var rndm = require_rndm();
    var uid = require_uid_safe();
    var compare = require_lib();
    var crypto = __require("crypto");
    var EQUAL_GLOBAL_REGEXP = /=/g;
    var PLUS_GLOBAL_REGEXP = /\+/g;
    var SLASH_GLOBAL_REGEXP = /\//g;
    module2.exports = Tokens;
    function Tokens(options) {
      if (!(this instanceof Tokens)) {
        return new Tokens(options);
      }
      var opts = options || {};
      var saltLength = opts.saltLength !== void 0 ? opts.saltLength : 8;
      if (typeof saltLength !== "number" || !isFinite(saltLength) || saltLength < 1) {
        throw new TypeError("option saltLength must be finite number > 1");
      }
      var secretLength = opts.secretLength !== void 0 ? opts.secretLength : 18;
      if (typeof secretLength !== "number" || !isFinite(secretLength) || secretLength < 1) {
        throw new TypeError("option secretLength must be finite number > 1");
      }
      this.saltLength = saltLength;
      this.secretLength = secretLength;
    }
    Tokens.prototype.create = function create(secret2) {
      if (!secret2 || typeof secret2 !== "string") {
        throw new TypeError("argument secret is required");
      }
      return this._tokenize(secret2, rndm(this.saltLength));
    };
    Tokens.prototype.secret = function secret2(callback) {
      return uid(this.secretLength, callback);
    };
    Tokens.prototype.secretSync = function secretSync() {
      return uid.sync(this.secretLength);
    };
    Tokens.prototype._tokenize = function tokenize(secret2, salt) {
      return salt + "-" + hash(salt + "-" + secret2);
    };
    Tokens.prototype.verify = function verify(secret2, token) {
      if (!secret2 || typeof secret2 !== "string") {
        return false;
      }
      if (!token || typeof token !== "string") {
        return false;
      }
      var index = token.indexOf("-");
      if (index === -1) {
        return false;
      }
      var salt = token.substr(0, index);
      var expected = this._tokenize(secret2, salt);
      return compare(token, expected);
    };
    function hash(str) {
      return crypto.createHash("sha1").update(str, "ascii").digest("base64").replace(PLUS_GLOBAL_REGEXP, "-").replace(SLASH_GLOBAL_REGEXP, "_").replace(EQUAL_GLOBAL_REGEXP, "");
    }
  }
});

// ../../node_modules/csurf/index.js
var require_csurf = __commonJS({
  "../../node_modules/csurf/index.js"(exports2, module2) {
    "use strict";
    var Cookie = require_cookie();
    var createError = require_http_errors();
    var sign = require_cookie_signature().sign;
    var Tokens = require_csrf();
    module2.exports = csurf;
    function csurf(options) {
      var opts = options || {};
      var cookie = getCookieOptions(opts.cookie);
      var sessionKey = opts.sessionKey || "session";
      var value = opts.value || defaultValue;
      var tokens = new Tokens(opts);
      var ignoreMethods = opts.ignoreMethods === void 0 ? ["GET", "HEAD", "OPTIONS"] : opts.ignoreMethods;
      if (!Array.isArray(ignoreMethods)) {
        throw new TypeError("option ignoreMethods must be an array");
      }
      var ignoreMethod = getIgnoredMethods(ignoreMethods);
      return function csrf2(req, res, next) {
        if (!verifyConfiguration(req, sessionKey, cookie)) {
          return next(new Error("misconfigured csrf"));
        }
        var secret2 = getSecret(req, sessionKey, cookie);
        var token;
        req.csrfToken = function csrfToken() {
          var sec = !cookie ? getSecret(req, sessionKey, cookie) : secret2;
          if (token && sec === secret2) {
            return token;
          }
          if (sec === void 0) {
            sec = tokens.secretSync();
            setSecret(req, res, sessionKey, sec, cookie);
          }
          secret2 = sec;
          token = tokens.create(secret2);
          return token;
        };
        if (!secret2) {
          secret2 = tokens.secretSync();
          setSecret(req, res, sessionKey, secret2, cookie);
        }
        if (!ignoreMethod[req.method] && !tokens.verify(secret2, value(req))) {
          return next(createError(403, "invalid csrf token", {
            code: "EBADCSRFTOKEN"
          }));
        }
        next();
      };
    }
    function defaultValue(req) {
      return req.body && req.body._csrf || req.query && req.query._csrf || req.headers["csrf-token"] || req.headers["xsrf-token"] || req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];
    }
    function getCookieOptions(options) {
      if (options !== true && typeof options !== "object") {
        return void 0;
      }
      var opts = /* @__PURE__ */ Object.create(null);
      opts.key = "_csrf";
      opts.path = "/";
      if (options && typeof options === "object") {
        for (var prop in options) {
          var val = options[prop];
          if (val !== void 0) {
            opts[prop] = val;
          }
        }
      }
      return opts;
    }
    function getIgnoredMethods(methods) {
      var obj = /* @__PURE__ */ Object.create(null);
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i].toUpperCase();
        obj[method] = true;
      }
      return obj;
    }
    function getSecret(req, sessionKey, cookie) {
      var bag = getSecretBag(req, sessionKey, cookie);
      var key = cookie ? cookie.key : "csrfSecret";
      if (!bag) {
        throw new Error("misconfigured csrf");
      }
      return bag[key];
    }
    function getSecretBag(req, sessionKey, cookie) {
      if (cookie) {
        var cookieKey = cookie.signed ? "signedCookies" : "cookies";
        return req[cookieKey];
      } else {
        return req[sessionKey];
      }
    }
    function setCookie(res, name, val, options) {
      var data = Cookie.serialize(name, val, options);
      var prev = res.getHeader("set-cookie") || [];
      var header = Array.isArray(prev) ? prev.concat(data) : [prev, data];
      res.setHeader("set-cookie", header);
    }
    function setSecret(req, res, sessionKey, val, cookie) {
      if (cookie) {
        var value = val;
        if (cookie.signed) {
          value = "s:" + sign(val, req.secret);
        }
        setCookie(res, cookie.key, value, cookie);
      } else {
        req[sessionKey].csrfSecret = val;
      }
    }
    function verifyConfiguration(req, sessionKey, cookie) {
      if (!getSecretBag(req, sessionKey, cookie)) {
        return false;
      }
      if (cookie && cookie.signed && !req.secret) {
        return false;
      }
      return true;
    }
  }
});

// ../../node_modules/ip-address/dist/address-error.js
var require_address_error = __commonJS({
  "../../node_modules/ip-address/dist/address-error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AddressError = void 0;
    var AddressError = class extends Error {
      constructor(message2, parseMessage) {
        super(message2);
        this.name = "AddressError";
        this.parseMessage = parseMessage;
      }
    };
    exports2.AddressError = AddressError;
  }
});

// ../../node_modules/ip-address/dist/common.js
var require_common = __commonJS({
  "../../node_modules/ip-address/dist/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isInSubnet = isInSubnet;
    exports2.isCorrect = isCorrect;
    exports2.prefixLengthFromMask = prefixLengthFromMask;
    exports2.numberToPaddedHex = numberToPaddedHex;
    exports2.stringToPaddedHex = stringToPaddedHex;
    exports2.testBit = testBit;
    var address_error_1 = require_address_error();
    function isInSubnet(address) {
      if (this.subnetMask < address.subnetMask) {
        return false;
      }
      if (this.mask(address.subnetMask) === address.mask()) {
        return true;
      }
      return false;
    }
    function isCorrect(defaultBits) {
      return function() {
        if (this.addressMinusSuffix !== this.correctForm()) {
          return false;
        }
        if (this.subnetMask === defaultBits && !this.parsedSubnet) {
          return true;
        }
        return this.parsedSubnet === String(this.subnetMask);
      };
    }
    function prefixLengthFromMask(value, totalBits) {
      const binary = value.toString(2).padStart(totalBits, "0");
      if (binary.length > totalBits) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      const firstZero = binary.indexOf("0");
      if (firstZero === -1) {
        return totalBits;
      }
      if (binary.slice(firstZero).includes("1")) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      return firstZero;
    }
    function numberToPaddedHex(number) {
      return number.toString(16).padStart(2, "0");
    }
    function stringToPaddedHex(numberString) {
      return numberToPaddedHex(parseInt(numberString, 10));
    }
    function testBit(binaryValue, position) {
      const { length } = binaryValue;
      if (position > length) {
        return false;
      }
      const positionInString = length - position;
      return binaryValue.substring(positionInString, positionInString + 1) === "1";
    }
  }
});

// ../../node_modules/ip-address/dist/v4/constants.js
var require_constants = __commonJS({
  "../../node_modules/ip-address/dist/v4/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RE_SUBNET_STRING = exports2.RE_ADDRESS = exports2.GROUPS = exports2.BITS = void 0;
    exports2.BITS = 32;
    exports2.GROUPS = 4;
    exports2.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
    exports2.RE_SUBNET_STRING = /\/\d{1,2}$/;
  }
});

// ../../node_modules/ip-address/dist/ipv4.js
var require_ipv4 = __commonJS({
  "../../node_modules/ip-address/dist/ipv4.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Address4 = void 0;
    var common = __importStar(require_common());
    var constants = __importStar(require_constants());
    var address_error_1 = require_address_error();
    var isCorrect4 = common.isCorrect(constants.BITS);
    var Address4 = class _Address4 {
      constructor(address) {
        this.groups = constants.GROUPS;
        this.parsedAddress = [];
        this.parsedSubnet = "";
        this.subnet = "/32";
        this.subnetMask = 32;
        this.v4 = true;
        this.isCorrect = isCorrect4;
        this.isInSubnet = common.isInSubnet;
        this.address = address;
        const subnet = constants.RE_SUBNET_STRING.exec(address);
        if (subnet) {
          this.parsedSubnet = subnet[0].replace("/", "");
          this.subnetMask = parseInt(this.parsedSubnet, 10);
          this.subnet = `/${this.subnetMask}`;
          if (this.subnetMask < 0 || this.subnetMask > constants.BITS) {
            throw new address_error_1.AddressError("Invalid subnet mask.");
          }
          address = address.replace(constants.RE_SUBNET_STRING, "");
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(address);
      }
      /**
       * Returns true if the given string is a valid IPv4 address (with optional
       * CIDR subnet), false otherwise. Host bits in the subnet portion are
       * allowed (e.g. `192.168.1.5/24` is valid); for strict network-address
       * validation compare `correctForm()` to `startAddress().correctForm()`,
       * or use `networkForm()`.
       */
      static isValid(address) {
        try {
          new _Address4(address);
          return true;
        } catch (e) {
          return false;
        }
      }
      /**
       * Parses an IPv4 address string into its four octet groups and stores the
       * result on `this.parsedAddress`. Called automatically by the constructor;
       * you typically don't need to call it directly. Throws `AddressError` if
       * the input is not a valid IPv4 address.
       */
      parse(address) {
        const groups = address.split(".");
        if (!address.match(constants.RE_ADDRESS)) {
          throw new address_error_1.AddressError("Invalid IPv4 address.");
        }
        return groups;
      }
      /**
       * Returns the address in correct form: octets joined with `.` and any
       * leading zeros stripped (e.g. `192.168.1.1`). For IPv4 this matches the
       * canonical dotted-decimal representation.
       */
      correctForm() {
        return this.parsedAddress.map((part) => parseInt(part, 10)).join(".");
      }
      /**
       * Construct an `Address4` from an address and a dotted-decimal subnet
       * mask given as separate strings (e.g. as returned by Node's
       * `os.networkInterfaces()`). Throws `AddressError` if the mask is
       * non-contiguous (e.g. `255.0.255.0`).
       * @example
       * var address = Address4.fromAddressAndMask('192.168.1.1', '255.255.255.0');
       * address.subnetMask; // 24
       */
      static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new _Address4(mask).bigInt(), constants.BITS);
        return new _Address4(`${address}/${bits}`);
      }
      /**
       * Construct an `Address4` from an address and a Cisco-style wildcard mask
       * given as separate strings (e.g. `0.0.0.255` for a `/24`). The wildcard
       * mask is the bitwise inverse of the subnet mask. Throws `AddressError`
       * if the mask is non-contiguous (e.g. `0.255.0.255`).
       * @example
       * var address = Address4.fromAddressAndWildcardMask('10.0.0.1', '0.0.0.255');
       * address.subnetMask; // 24
       */
      static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new _Address4(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants.BITS)) - BigInt(1);
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants.BITS);
        return new _Address4(`${address}/${bits}`);
      }
      /**
       * Construct an `Address4` from a wildcard pattern with trailing `*`
       * octets. The number of trailing wildcards determines the prefix
       * length: each `*` represents 8 bits.
       *
       * Only trailing whole-octet wildcards are supported. Partial-octet
       * wildcards (e.g. `192.168.0.1*`) and interior wildcards (e.g.
       * `192.*.0.1`) throw `AddressError`.
       * @example
       * Address4.fromWildcard('192.168.0.*').subnet;   // '/24'
       * Address4.fromWildcard('192.168.*.*').subnet;   // '/16'
       * Address4.fromWildcard('*.*.*.*').subnet;       // '/0'
       */
      static fromWildcard(input) {
        const groups = input.split(".");
        if (groups.length !== constants.GROUPS) {
          throw new address_error_1.AddressError("Wildcard pattern must have 4 octets");
        }
        let firstWildcard = -1;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i] === "*") {
            if (firstWildcard === -1) {
              firstWildcard = i;
            }
          } else if (firstWildcard !== -1) {
            throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing octets (e.g. `192.168.0.*`)");
          }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g) => g === "*" ? "0" : g);
        const subnetBits = constants.BITS - trailing * 8;
        return new _Address4(`${replaced.join(".")}/${subnetBits}`);
      }
      /**
       * Converts a hex string to an IPv4 address object. Accepts 8 hex digits
       * with optional `:` separators (e.g. `'7f000001'` or `'7f:00:00:01'`).
       * Throws `AddressError` for any other length or for non-hex characters.
       * @param {string} hex - a hex string to convert
       * @returns {Address4}
       */
      static fromHex(hex) {
        const stripped = hex.replace(/:/g, "");
        if (!/^[0-9a-fA-F]{8}$/.test(stripped)) {
          throw new address_error_1.AddressError("IPv4 hex must be exactly 8 hex digits");
        }
        const groups = [];
        for (let i = 0; i < 8; i += 2) {
          groups.push(parseInt(stripped.slice(i, i + 2), 16));
        }
        return new _Address4(groups.join("."));
      }
      /**
       * Converts an integer into a IPv4 address object. The integer must be a
       * non-negative safe integer in the range `[0, 2**32 - 1]`; otherwise
       * `AddressError` is thrown.
       * @param {integer} integer - a number to convert
       * @returns {Address4}
       */
      static fromInteger(integer2) {
        if (!Number.isInteger(integer2) || integer2 < 0 || integer2 > 4294967295) {
          throw new address_error_1.AddressError("IPv4 integer must be in the range 0 to 2**32 - 1");
        }
        return _Address4.fromHex(integer2.toString(16).padStart(8, "0"));
      }
      /**
       * Return an address from in-addr.arpa form
       * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
       * @returns {Adress4}
       * @example
       * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
       * address.correctForm(); // '192.0.2.42'
       */
      static fromArpa(arpaFormAddress) {
        const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, "");
        const address = leader.split(".").reverse().join(".");
        return new _Address4(address);
      }
      /**
       * Converts an IPv4 address object to a hex string
       * @returns {String}
       */
      toHex() {
        return this.parsedAddress.map((part) => common.stringToPaddedHex(part)).join(":");
      }
      /**
       * Converts an IPv4 address object to an array of bytes.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toArray())`.
       * @returns {Array}
       */
      toArray() {
        return this.parsedAddress.map((part) => parseInt(part, 10));
      }
      /**
       * Converts an IPv4 address object to an IPv6 address group
       * @returns {String}
       */
      toGroup6() {
        const output = [];
        let i;
        for (i = 0; i < constants.GROUPS; i += 2) {
          output.push(`${common.stringToPaddedHex(this.parsedAddress[i])}${common.stringToPaddedHex(this.parsedAddress[i + 1])}`);
        }
        return output.join(":");
      }
      /**
       * Returns the address as a `bigint`
       * @returns {bigint}
       */
      bigInt() {
        return BigInt(`0x${this.parsedAddress.map((n) => common.stringToPaddedHex(n)).join("")}`);
      }
      /**
       * Helper function getting start address.
       * @returns {bigint}
       */
      _startAddress() {
        return BigInt(`0b${this.mask() + "0".repeat(constants.BITS - this.subnetMask)}`);
      }
      /**
       * The first address in the range given by this address' subnet.
       * Often referred to as the Network Address.
       * @returns {Address4}
       */
      startAddress() {
        return _Address4.fromBigInt(this._startAddress());
      }
      /**
       * The first host address in the range given by this address's subnet ie
       * the first address after the Network Address
       * @returns {Address4}
       */
      startAddressExclusive() {
        const adjust = BigInt("1");
        return _Address4.fromBigInt(this._startAddress() + adjust);
      }
      /**
       * Helper function getting end address.
       * @returns {bigint}
       */
      _endAddress() {
        return BigInt(`0b${this.mask() + "1".repeat(constants.BITS - this.subnetMask)}`);
      }
      /**
       * The last address in the range given by this address' subnet
       * Often referred to as the Broadcast
       * @returns {Address4}
       */
      endAddress() {
        return _Address4.fromBigInt(this._endAddress());
      }
      /**
       * The last host address in the range given by this address's subnet ie
       * the last address prior to the Broadcast Address
       * @returns {Address4}
       */
      endAddressExclusive() {
        const adjust = BigInt("1");
        return _Address4.fromBigInt(this._endAddress() - adjust);
      }
      /**
       * The dotted-decimal form of the subnet mask, e.g. `255.255.240.0` for
       * a `/20`. Returns an `Address4`; call `.correctForm()` for the string.
       * @returns {Address4}
       */
      subnetMaskAddress() {
        return _Address4.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants.BITS - this.subnetMask)}`));
      }
      /**
       * The Cisco-style wildcard mask, e.g. `0.0.0.255` for a `/24`. This is
       * the bitwise inverse of `subnetMaskAddress()`. Returns an `Address4`;
       * call `.correctForm()` for the string.
       * @returns {Address4}
       */
      wildcardMask() {
        return _Address4.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants.BITS - this.subnetMask)}`));
      }
      /**
       * The network address in CIDR string form, e.g. `192.168.1.0/24` for
       * `192.168.1.5/24`. For an address with no explicit subnet the prefix is
       * `/32`, e.g. `networkForm()` on `192.168.1.5` returns `192.168.1.5/32`.
       * @returns {string}
       */
      networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
      }
      /**
       * Converts a BigInt to a v4 address object. The value must be in the
       * range `[0, 2**32 - 1]`; otherwise `AddressError` is thrown.
       * @param {bigint} bigInt - a BigInt to convert
       * @returns {Address4}
       */
      static fromBigInt(bigInt) {
        if (bigInt < 0n || bigInt > 0xffffffffn) {
          throw new address_error_1.AddressError("IPv4 BigInt must be in the range 0 to 2**32 - 1");
        }
        return _Address4.fromHex(bigInt.toString(16).padStart(8, "0"));
      }
      /**
       * Convert a byte array to an Address4 object.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address4.fromByteArray([...buf])`.
       * @param {Array<number>} bytes - an array of 4 bytes (0-255)
       * @returns {Address4}
       */
      static fromByteArray(bytes) {
        if (bytes.length !== 4) {
          throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
        }
        for (let i = 0; i < bytes.length; i++) {
          if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
            throw new address_error_1.AddressError("All bytes must be integers between 0 and 255");
          }
        }
        return this.fromUnsignedByteArray(bytes);
      }
      /**
       * Convert an unsigned byte array to an Address4 object
       * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
       * @returns {Address4}
       */
      static fromUnsignedByteArray(bytes) {
        if (bytes.length !== 4) {
          throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
        }
        const address = bytes.join(".");
        return new _Address4(address);
      }
      /**
       * Returns the first n bits of the address, defaulting to the
       * subnet mask
       * @returns {String}
       */
      mask(mask) {
        if (mask === void 0) {
          mask = this.subnetMask;
        }
        return this.getBitsBase2(0, mask);
      }
      /**
       * Returns the bits in the given range as a base-2 string
       * @returns {string}
       */
      getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
      }
      /**
       * Return the reversed ip6.arpa form of the address
       * @param {Object} options
       * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
       * @returns {String}
       */
      reverseForm(options) {
        if (!options) {
          options = {};
        }
        const reversed = this.correctForm().split(".").reverse().join(".");
        if (options.omitSuffix) {
          return reversed;
        }
        return `${reversed}.in-addr.arpa.`;
      }
      /**
       * Returns true if the given address is a multicast address
       * @returns {boolean}
       */
      isMulticast() {
        return this.isInSubnet(MULTICAST_V4);
      }
      /**
       * Returns true if the address is in one of the [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
       * @returns {boolean}
       */
      isPrivate() {
        return PRIVATE_V4.some((subnet) => this.isInSubnet(subnet));
      }
      /**
       * Returns true if the address is in the loopback range `127.0.0.0/8` ([RFC 1122](https://datatracker.ietf.org/doc/html/rfc1122)).
       * @returns {boolean}
       */
      isLoopback() {
        return this.isInSubnet(LOOPBACK_V4);
      }
      /**
       * Returns true if the address is in the link-local range `169.254.0.0/16` ([RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)).
       * @returns {boolean}
       */
      isLinkLocal() {
        return this.isInSubnet(LINK_LOCAL_V4);
      }
      /**
       * Returns true if the address is the unspecified address `0.0.0.0`.
       * @returns {boolean}
       */
      isUnspecified() {
        return this.isInSubnet(UNSPECIFIED_V4);
      }
      /**
       * Returns true if the address is the limited broadcast address `255.255.255.255` ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)).
       * @returns {boolean}
       */
      isBroadcast() {
        return this.isInSubnet(BROADCAST_V4);
      }
      /**
       * Returns true if the address is in the carrier-grade NAT range `100.64.0.0/10` ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)).
       * @returns {boolean}
       */
      isCGNAT() {
        return this.isInSubnet(CGNAT_V4);
      }
      /**
       * Returns a zero-padded base-2 string representation of the address
       * @returns {string}
       */
      binaryZeroPad() {
        if (this._binaryZeroPad === void 0) {
          this._binaryZeroPad = this.bigInt().toString(2).padStart(constants.BITS, "0");
        }
        return this._binaryZeroPad;
      }
      /**
       * Groups an IPv4 address for inclusion at the end of an IPv6 address
       * @returns {String}
       */
      groupForV6() {
        const segments = this.parsedAddress;
        return this.address.replace(constants.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join(".")}</span>`);
      }
    };
    exports2.Address4 = Address4;
    var MULTICAST_V4 = new Address4("224.0.0.0/4");
    var PRIVATE_V4 = [
      new Address4("10.0.0.0/8"),
      new Address4("172.16.0.0/12"),
      new Address4("192.168.0.0/16")
    ];
    var LOOPBACK_V4 = new Address4("127.0.0.0/8");
    var LINK_LOCAL_V4 = new Address4("169.254.0.0/16");
    var UNSPECIFIED_V4 = new Address4("0.0.0.0/32");
    var BROADCAST_V4 = new Address4("255.255.255.255/32");
    var CGNAT_V4 = new Address4("100.64.0.0/10");
  }
});

// ../../node_modules/ip-address/dist/v6/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/ip-address/dist/v6/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RE_URL_WITH_PORT = exports2.RE_URL = exports2.RE_ZONE_STRING = exports2.RE_SUBNET_STRING = exports2.RE_BAD_ADDRESS = exports2.RE_BAD_CHARACTERS = exports2.TYPES = exports2.SCOPES = exports2.GROUPS = exports2.BITS = void 0;
    exports2.BITS = 128;
    exports2.GROUPS = 8;
    exports2.SCOPES = {
      0: "Reserved",
      1: "Interface local",
      2: "Link local",
      4: "Admin local",
      5: "Site local",
      8: "Organization local",
      14: "Global",
      15: "Reserved"
    };
    exports2.TYPES = {
      "ff01::1/128": "Multicast (All nodes on this interface)",
      "ff01::2/128": "Multicast (All routers on this interface)",
      "ff02::1/128": "Multicast (All nodes on this link)",
      "ff02::2/128": "Multicast (All routers on this link)",
      "ff05::2/128": "Multicast (All routers in this site)",
      "ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
      "ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
      "ff02::9/128": "Multicast (RIP routers)",
      "ff02::a/128": "Multicast (EIGRP routers)",
      "ff02::d/128": "Multicast (PIM routers)",
      "ff02::16/128": "Multicast (MLDv2 reports)",
      "ff01::fb/128": "Multicast (mDNSv6)",
      "ff02::fb/128": "Multicast (mDNSv6)",
      "ff05::fb/128": "Multicast (mDNSv6)",
      "ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
      "ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
      "ff02::1:3/128": "Multicast (All DHCP servers on this link)",
      "ff05::1:3/128": "Multicast (All DHCP servers in this site)",
      "::/128": "Unspecified",
      "::1/128": "Loopback",
      "ff00::/8": "Multicast",
      "fe80::/10": "Link-local unicast",
      "fc00::/7": "Unique local",
      "2002::/16": "6to4",
      "2001:db8::/32": "Documentation",
      "64:ff9b::/96": "NAT64 (well-known)",
      "64:ff9b:1::/48": "NAT64 (local-use)"
    };
    exports2.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
    exports2.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
    exports2.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
    exports2.RE_ZONE_STRING = /%.*$/;
    exports2.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
    exports2.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
  }
});

// ../../node_modules/ip-address/dist/v6/helpers.js
var require_helpers = __commonJS({
  "../../node_modules/ip-address/dist/v6/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.escapeHtml = escapeHtml;
    exports2.spanAllZeroes = spanAllZeroes;
    exports2.spanAll = spanAll;
    exports2.spanLeadingZeroes = spanLeadingZeroes;
    exports2.simpleGroup = simpleGroup;
    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function spanAllZeroes(s) {
      return escapeHtml(s).replace(/(0+)/g, '<span class="zero">$1</span>');
    }
    function spanAll(s, offset = 0) {
      const letters = s.split("");
      return letters.map((n, i) => `<span class="digit value-${escapeHtml(n)} position-${i + offset}">${spanAllZeroes(n)}</span>`).join("");
    }
    function spanLeadingZeroesSimple(group) {
      return escapeHtml(group).replace(/^(0+)/, '<span class="zero">$1</span>');
    }
    function spanLeadingZeroes(address) {
      const groups = address.split(":");
      return groups.map((g) => spanLeadingZeroesSimple(g)).join(":");
    }
    function simpleGroup(addressString, offset = 0) {
      const groups = addressString.split(":");
      return groups.map((g, i) => {
        if (/group-v4/.test(g)) {
          return g;
        }
        return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
      });
    }
  }
});

// ../../node_modules/ip-address/dist/v6/regular-expressions.js
var require_regular_expressions = __commonJS({
  "../../node_modules/ip-address/dist/v6/regular-expressions.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ADDRESS_BOUNDARY = void 0;
    exports2.groupPossibilities = groupPossibilities;
    exports2.padGroup = padGroup;
    exports2.simpleRegularExpression = simpleRegularExpression;
    exports2.possibleElisions = possibleElisions;
    var v6 = __importStar(require_constants2());
    function groupPossibilities(possibilities) {
      return `(${possibilities.join("|")})`;
    }
    function padGroup(group) {
      if (group.length < 4) {
        return `0{0,${4 - group.length}}${group}`;
      }
      return group;
    }
    exports2.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
    function simpleRegularExpression(groups) {
      const zeroIndexes = [];
      groups.forEach((group, i) => {
        const groupInteger = parseInt(group, 16);
        if (groupInteger === 0) {
          zeroIndexes.push(i);
        }
      });
      const possibilities = zeroIndexes.map((zeroIndex) => groups.map((group, i) => {
        if (i === zeroIndex) {
          const elision = i === 0 || i === v6.GROUPS - 1 ? ":" : "";
          return groupPossibilities([padGroup(group), elision]);
        }
        return padGroup(group);
      }).join(":"));
      possibilities.push(groups.map(padGroup).join(":"));
      return groupPossibilities(possibilities);
    }
    function possibleElisions(elidedGroups, moreLeft, moreRight) {
      const left = moreLeft ? "" : ":";
      const right = moreRight ? "" : ":";
      const possibilities = [];
      if (!moreLeft && !moreRight) {
        possibilities.push("::");
      }
      if (moreLeft && moreRight) {
        possibilities.push("");
      }
      if (moreRight && !moreLeft || !moreRight && moreLeft) {
        possibilities.push(":");
      }
      possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
      possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
      possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
      for (let groups = 1; groups < elidedGroups - 1; groups++) {
        for (let position = 1; position < elidedGroups - groups; position++) {
          possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
        }
      }
      return groupPossibilities(possibilities);
    }
  }
});

// ../../node_modules/ip-address/dist/ipv6.js
var require_ipv6 = __commonJS({
  "../../node_modules/ip-address/dist/ipv6.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Address6 = void 0;
    var common = __importStar(require_common());
    var constants4 = __importStar(require_constants());
    var constants6 = __importStar(require_constants2());
    var helpers = __importStar(require_helpers());
    var ipv4_1 = require_ipv4();
    var regular_expressions_1 = require_regular_expressions();
    var address_error_1 = require_address_error();
    var common_1 = require_common();
    var isCorrect6 = common.isCorrect(constants6.BITS);
    function assert(condition) {
      if (!condition) {
        throw new Error("Assertion failed.");
      }
    }
    function addCommas(number) {
      const r = /(\d+)(\d{3})/;
      while (r.test(number)) {
        number = number.replace(r, "$1,$2");
      }
      return number;
    }
    function spanLeadingZeroes4(n) {
      n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
      n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
      return n;
    }
    function compact(address, slice) {
      const s1 = [];
      const s2 = [];
      let i;
      for (i = 0; i < address.length; i++) {
        if (i < slice[0]) {
          s1.push(address[i]);
        } else if (i > slice[1]) {
          s2.push(address[i]);
        }
      }
      return s1.concat(["compact"]).concat(s2);
    }
    function paddedHex(octet) {
      return parseInt(octet, 16).toString(16).padStart(4, "0");
    }
    function unsignByte(b) {
      return b & 255;
    }
    var Address62 = class _Address6 {
      constructor(address, optionalGroups) {
        this.addressMinusSuffix = "";
        this.parsedSubnet = "";
        this.subnet = "/128";
        this.subnetMask = 128;
        this.v4 = false;
        this.zone = "";
        this.isInSubnet = common.isInSubnet;
        this.isCorrect = isCorrect6;
        if (optionalGroups === void 0) {
          this.groups = constants6.GROUPS;
        } else {
          this.groups = optionalGroups;
        }
        this.address = address;
        const subnet = constants6.RE_SUBNET_STRING.exec(address);
        if (subnet) {
          this.parsedSubnet = subnet[0].replace("/", "");
          this.subnetMask = parseInt(this.parsedSubnet, 10);
          this.subnet = `/${this.subnetMask}`;
          if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
            throw new address_error_1.AddressError("Invalid subnet mask.");
          }
          address = address.replace(constants6.RE_SUBNET_STRING, "");
        } else if (/\//.test(address)) {
          throw new address_error_1.AddressError("Invalid subnet mask.");
        }
        const zone = constants6.RE_ZONE_STRING.exec(address);
        if (zone) {
          this.zone = zone[0];
          address = address.replace(constants6.RE_ZONE_STRING, "");
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(this.addressMinusSuffix);
      }
      /**
       * Returns true if the given string is a valid IPv6 address (with optional
       * CIDR subnet and zone identifier), false otherwise. Host bits in the
       * subnet portion are allowed (e.g. `2001:db8::1/32` is valid); for strict
       * network-address validation compare `correctForm()` to
       * `startAddress().correctForm()`, or use `networkForm()`.
       */
      static isValid(address) {
        try {
          new _Address6(address);
          return true;
        } catch (e) {
          return false;
        }
      }
      /**
       * Convert a BigInt to a v6 address object. The value must be in the
       * range `[0, 2**128 - 1]`; otherwise `AddressError` is thrown.
       * @param {bigint} bigInt - a BigInt to convert
       * @returns {Address6}
       * @example
       * var bigInt = BigInt('1000000000000');
       * var address = Address6.fromBigInt(bigInt);
       * address.correctForm(); // '::e8:d4a5:1000'
       */
      static fromBigInt(bigInt) {
        if (bigInt < 0n || bigInt > (1n << BigInt(constants6.BITS)) - 1n) {
          throw new address_error_1.AddressError("IPv6 BigInt must be in the range 0 to 2**128 - 1");
        }
        const hex = bigInt.toString(16).padStart(32, "0");
        const groups = [];
        for (let i = 0; i < constants6.GROUPS; i++) {
          groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new _Address6(groups.join(":"));
      }
      /**
       * Parse a URL (with optional bracketed host and port) into an address and
       * port. Returns either `{ address, port }` on success or
       * `{ error, address: null, port: null }` if the URL could not be parsed.
       * Ports are returned as numbers (or `null` if absent or out of range).
       * @example
       * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
       * addressAndPort.address.correctForm(); // 'ffff::'
       * addressAndPort.port; // 8080
       */
      static fromURL(url) {
        let host;
        let port = null;
        let result;
        if (url.indexOf("[") !== -1 && url.indexOf("]:") !== -1) {
          result = constants6.RE_URL_WITH_PORT.exec(url);
          if (result === null) {
            return {
              error: "failed to parse address with port",
              address: null,
              port: null
            };
          }
          host = result[1];
          port = result[2];
        } else if (url.indexOf("/") !== -1) {
          url = url.replace(/^[a-z0-9]+:\/\//, "");
          result = constants6.RE_URL.exec(url);
          if (result === null) {
            return {
              error: "failed to parse address from URL",
              address: null,
              port: null
            };
          }
          host = result[1];
        } else {
          host = url;
        }
        if (port) {
          port = parseInt(port, 10);
          if (port < 0 || port > 65536) {
            port = null;
          }
        } else {
          port = null;
        }
        return {
          address: new _Address6(host),
          port
        };
      }
      /**
       * Construct an `Address6` from an address and a hex subnet mask given as
       * separate strings (e.g. as returned by Node's `os.networkInterfaces()`).
       * Throws `AddressError` if the mask is non-contiguous (e.g.
       * `ffff::ffff`).
       * @example
       * var address = Address6.fromAddressAndMask('fe80::1', 'ffff:ffff:ffff:ffff::');
       * address.subnetMask; // 64
       */
      static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new _Address6(mask).bigInt(), constants6.BITS);
        return new _Address6(`${address}/${bits}`);
      }
      /**
       * Construct an `Address6` from an address and a Cisco-style wildcard mask
       * given as separate strings (e.g. `::ffff:ffff:ffff:ffff` for a `/64`).
       * The wildcard mask is the bitwise inverse of the subnet mask. Throws
       * `AddressError` if the mask is non-contiguous.
       * @example
       * var address = Address6.fromAddressAndWildcardMask('fe80::1', '::ffff:ffff:ffff:ffff');
       * address.subnetMask; // 64
       */
      static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new _Address6(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1);
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants6.BITS);
        return new _Address6(`${address}/${bits}`);
      }
      /**
       * Construct an `Address6` from a wildcard pattern with trailing `*`
       * groups. The number of trailing wildcards determines the prefix
       * length: each `*` represents 16 bits. `::` is expanded to zero groups
       * (not wildcards) before evaluating trailing wildcards.
       *
       * Only trailing whole-group wildcards are supported. Partial-group
       * wildcards (e.g. `2001:db8::0*`) and interior wildcards (e.g.
       * `*::1`) throw `AddressError`.
       * @example
       * Address6.fromWildcard('2001:db8:*:*:*:*:*:*').subnet;  // '/32'
       * Address6.fromWildcard('2001:db8::*').subnet;           // '/112'
       * Address6.fromWildcard('*:*:*:*:*:*:*:*').subnet;       // '/0'
       */
      static fromWildcard(input) {
        if (input.includes("%") || input.includes("/")) {
          throw new address_error_1.AddressError("Wildcard pattern must not include a zone or CIDR suffix");
        }
        const halves = input.split("::");
        if (halves.length > 2) {
          throw new address_error_1.AddressError("Wildcard pattern cannot contain more than one '::'");
        }
        let groups;
        if (halves.length === 2) {
          const left = halves[0] === "" ? [] : halves[0].split(":");
          const right = halves[1] === "" ? [] : halves[1].split(":");
          const remaining = constants6.GROUPS - left.length - right.length;
          if (remaining < 1) {
            throw new address_error_1.AddressError("Wildcard pattern with '::' has too many groups");
          }
          groups = [...left, ...new Array(remaining).fill("0"), ...right];
        } else {
          groups = input.split(":");
        }
        if (groups.length !== constants6.GROUPS) {
          throw new address_error_1.AddressError("Wildcard pattern must have 8 groups");
        }
        let firstWildcard = -1;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i] === "*") {
            if (firstWildcard === -1) {
              firstWildcard = i;
            }
          } else if (firstWildcard !== -1) {
            throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing groups (e.g. `2001:db8:*:*:*:*:*:*`)");
          }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g) => g === "*" ? "0" : g);
        const subnetBits = constants6.BITS - trailing * 16;
        return new _Address6(`${replaced.join(":")}/${subnetBits}`);
      }
      /**
       * Create an IPv6-mapped address given an IPv4 address
       * @param {string} address - An IPv4 address string
       * @returns {Address6}
       * @example
       * var address = Address6.fromAddress4('192.168.0.1');
       * address.correctForm(); // '::ffff:c0a8:1'
       * address.to4in6(); // '::ffff:192.168.0.1'
       */
      static fromAddress4(address) {
        const address4 = new ipv4_1.Address4(address);
        const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
        return new _Address6(`::ffff:${address4.correctForm()}/${mask6}`);
      }
      /**
       * Return an address from ip6.arpa form
       * @param {string} arpaFormAddress - an 'ip6.arpa' form address
       * @returns {Adress6}
       * @example
       * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
       * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
       */
      static fromArpa(arpaFormAddress) {
        let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, "");
        const semicolonAmount = 7;
        if (address.length !== 63) {
          throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
        }
        const parts = address.split(".").reverse();
        for (let i = semicolonAmount; i > 0; i--) {
          const insertIndex = i * 4;
          parts.splice(insertIndex, 0, ":");
        }
        address = parts.join("");
        return new _Address6(address);
      }
      /**
       * Return the Microsoft UNC transcription of the address
       * @returns {String} the Microsoft UNC transcription of the address
       */
      microsoftTranscription() {
        return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
      }
      /**
       * Return the first n bits of the address, defaulting to the subnet mask
       * @param {number} [mask=subnet] - the number of bits to mask
       * @returns {String} the first n bits of the address as a string
       */
      mask(mask = this.subnetMask) {
        return this.getBitsBase2(0, mask);
      }
      /**
       * Return the number of possible subnets of a given size in the address
       * @param {number} [subnetSize=128] - the subnet size
       * @returns {String}
       */
      // TODO: probably useful to have a numeric version of this too
      possibleSubnets(subnetSize = 128) {
        const availableBits = constants6.BITS - this.subnetMask;
        const subnetBits = Math.abs(subnetSize - constants6.BITS);
        const subnetPowers = availableBits - subnetBits;
        if (subnetPowers < 0) {
          return "0";
        }
        return addCommas((BigInt("2") ** BigInt(subnetPowers)).toString(10));
      }
      /**
       * Helper function getting start address.
       * @returns {bigint}
       */
      _startAddress() {
        return BigInt(`0b${this.mask() + "0".repeat(constants6.BITS - this.subnetMask)}`);
      }
      /**
       * The first address in the range given by this address' subnet
       * Often referred to as the Network Address.
       * @returns {Address6}
       */
      startAddress() {
        return _Address6.fromBigInt(this._startAddress());
      }
      /**
       * The first host address in the range given by this address's subnet ie
       * the first address after the Network Address
       * @returns {Address6}
       */
      startAddressExclusive() {
        const adjust = BigInt("1");
        return _Address6.fromBigInt(this._startAddress() + adjust);
      }
      /**
       * Helper function getting end address.
       * @returns {bigint}
       */
      _endAddress() {
        return BigInt(`0b${this.mask() + "1".repeat(constants6.BITS - this.subnetMask)}`);
      }
      /**
       * The last address in the range given by this address' subnet
       * Often referred to as the Broadcast
       * @returns {Address6}
       */
      endAddress() {
        return _Address6.fromBigInt(this._endAddress());
      }
      /**
       * The last host address in the range given by this address's subnet ie
       * the last address prior to the Broadcast Address
       * @returns {Address6}
       */
      endAddressExclusive() {
        const adjust = BigInt("1");
        return _Address6.fromBigInt(this._endAddress() - adjust);
      }
      /**
       * The hex form of the subnet mask, e.g. `ffff:ffff:ffff:ffff::` for a
       * `/64`. Returns an `Address6`; call `.correctForm()` for the string.
       * @returns {Address6}
       */
      subnetMaskAddress() {
        return _Address6.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants6.BITS - this.subnetMask)}`));
      }
      /**
       * The Cisco-style wildcard mask, e.g. `::ffff:ffff:ffff:ffff` for a
       * `/64`. This is the bitwise inverse of `subnetMaskAddress()`. Returns
       * an `Address6`; call `.correctForm()` for the string.
       * @returns {Address6}
       */
      wildcardMask() {
        return _Address6.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants6.BITS - this.subnetMask)}`));
      }
      /**
       * The network address in CIDR string form, e.g. `2001:db8::/32` for
       * `2001:db8::1/32`. For an address with no explicit subnet the prefix
       * is `/128`, e.g. `networkForm()` on `2001:db8::1` returns
       * `2001:db8::1/128`.
       * @returns {string}
       */
      networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
      }
      /**
       * Return the scope of the address. The 4-bit scope field
       * ([RFC 4291 §2.7](https://datatracker.ietf.org/doc/html/rfc4291#section-2.7))
       * is only defined for multicast addresses; for unicast addresses the scope
       * is derived from the address type per
       * [RFC 4007 §6](https://datatracker.ietf.org/doc/html/rfc4007#section-6).
       * @returns {String}
       */
      getScope() {
        const type = this.getType();
        if (type === "Multicast" || type.startsWith("Multicast ")) {
          const scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
          return scope || "Unknown";
        }
        if (type === "Link-local unicast" || type === "Loopback") {
          return "Link local";
        }
        if (type === "Unspecified") {
          return "Unknown";
        }
        return "Global";
      }
      /**
       * Return the type of the address
       * @returns {String}
       */
      getType() {
        for (let i = 0; i < TYPE_SUBNETS.length; i++) {
          const entry = TYPE_SUBNETS[i];
          if (this.isInSubnet(entry[0])) {
            return entry[1];
          }
        }
        return "Global unicast";
      }
      /**
       * Return the bits in the given range as a BigInt
       * @returns {bigint}
       */
      getBits(start, end) {
        return BigInt(`0b${this.getBitsBase2(start, end)}`);
      }
      /**
       * Return the bits in the given range as a base-2 string
       * @returns {String}
       */
      getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
      }
      /**
       * Return the bits in the given range as a base-16 string
       * @returns {String}
       */
      getBitsBase16(start, end) {
        const length = end - start;
        if (length % 4 !== 0) {
          throw new Error("Length of bits to retrieve must be divisible by four");
        }
        return this.getBits(start, end).toString(16).padStart(length / 4, "0");
      }
      /**
       * Return the bits that are set past the subnet mask length
       * @returns {String}
       */
      getBitsPastSubnet() {
        return this.getBitsBase2(this.subnetMask, constants6.BITS);
      }
      /**
       * Return the reversed ip6.arpa form of the address
       * @param {Object} options
       * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
       * @returns {String}
       */
      reverseForm(options) {
        if (!options) {
          options = {};
        }
        const characters = Math.floor(this.subnetMask / 4);
        const reversed = this.canonicalForm().replace(/:/g, "").split("").slice(0, characters).reverse().join(".");
        if (characters > 0) {
          if (options.omitSuffix) {
            return reversed;
          }
          return `${reversed}.ip6.arpa.`;
        }
        if (options.omitSuffix) {
          return "";
        }
        return "ip6.arpa.";
      }
      /**
       * Returns the address in correct form, per
       * [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952): leading zeros
       * stripped, the longest run of zero groups collapsed to `::`, and hex digits
       * lowercased (e.g. `2001:db8::1`). This is the recommended form for display.
       */
      correctForm() {
        let i;
        let groups = [];
        let zeroCounter = 0;
        const zeroes = [];
        for (i = 0; i < this.parsedAddress.length; i++) {
          const value = parseInt(this.parsedAddress[i], 16);
          if (value === 0) {
            zeroCounter++;
          }
          if (value !== 0 && zeroCounter > 0) {
            if (zeroCounter > 1) {
              zeroes.push([i - zeroCounter, i - 1]);
            }
            zeroCounter = 0;
          }
        }
        if (zeroCounter > 1) {
          zeroes.push([this.parsedAddress.length - zeroCounter, this.parsedAddress.length - 1]);
        }
        const zeroLengths = zeroes.map((n) => n[1] - n[0] + 1);
        if (zeroes.length > 0) {
          const index = zeroLengths.indexOf(Math.max(...zeroLengths));
          groups = compact(this.parsedAddress, zeroes[index]);
        } else {
          groups = this.parsedAddress;
        }
        for (i = 0; i < groups.length; i++) {
          if (groups[i] !== "compact") {
            groups[i] = parseInt(groups[i], 16).toString(16);
          }
        }
        let correct = groups.join(":");
        correct = correct.replace(/^compact$/, "::");
        correct = correct.replace(/(^compact)|(compact$)/, ":");
        correct = correct.replace(/compact/, "");
        return correct;
      }
      /**
       * Return a zero-padded base-2 string representation of the address
       * @returns {String}
       * @example
       * var address = new Address6('2001:4860:4001:803::1011');
       * address.binaryZeroPad();
       * // '0010000000000001010010000110000001000000000000010000100000000011
       * //  0000000000000000000000000000000000000000000000000001000000010001'
       */
      binaryZeroPad() {
        if (this._binaryZeroPad === void 0) {
          this._binaryZeroPad = this.bigInt().toString(2).padStart(constants6.BITS, "0");
        }
        return this._binaryZeroPad;
      }
      /**
       * Parses a v4-in-v6 string (e.g. `::ffff:192.168.0.1`) by extracting the
       * trailing IPv4 address into `this.address4` / `this.parsedAddress4` and
       * returning the address with the v4 portion converted to two v6 groups.
       * Used internally by `parse()`.
       */
      // TODO: Improve the semantics of this helper function
      parse4in6(address) {
        if (address.indexOf(".") === -1) {
          return address;
        }
        const groups = address.split(":");
        const lastGroup = groups.slice(-1)[0];
        const address4 = lastGroup.match(constants4.RE_ADDRESS);
        if (address4) {
          this.parsedAddress4 = address4[0];
          this.address4 = new ipv4_1.Address4(this.parsedAddress4);
          for (let i = 0; i < this.address4.groups; i++) {
            if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) {
              const highlighted = this.address4.parsedAddress.map(spanLeadingZeroes4).join(".");
              const prefix = groups.slice(0, -1).map(helpers.escapeHtml).join(":");
              const separator = groups.length > 1 ? ":" : "";
              throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", `${prefix}${separator}${highlighted}`);
            }
          }
          this.v4 = true;
          groups[groups.length - 1] = this.address4.toGroup6();
          address = groups.join(":");
        }
        return address;
      }
      /**
       * Parses an IPv6 address string into its 8 hexadecimal groups (expanding
       * any `::` elision and any trailing v4-in-v6 portion) and stores the result
       * on `this.parsedAddress`. Called automatically by the constructor; you
       * typically don't need to call it directly. Throws `AddressError` if the
       * input is malformed.
       */
      // TODO: Make private?
      parse(address) {
        address = this.parse4in6(address);
        const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
        if (badCharacters) {
          throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? "s" : ""} detected in address: ${badCharacters.join("")}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
        }
        const badAddress = address.match(constants6.RE_BAD_ADDRESS);
        if (badAddress) {
          throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join("")}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
        }
        let groups = [];
        const halves = address.split("::");
        if (halves.length === 2) {
          let first = halves[0].split(":");
          let last = halves[1].split(":");
          if (first.length === 1 && first[0] === "") {
            first = [];
          }
          if (last.length === 1 && last[0] === "") {
            last = [];
          }
          const remaining = this.groups - (first.length + last.length);
          if (!remaining) {
            throw new address_error_1.AddressError("Error parsing groups");
          }
          this.elidedGroups = remaining;
          this.elisionBegin = first.length;
          this.elisionEnd = first.length + this.elidedGroups;
          groups = groups.concat(first);
          for (let i = 0; i < remaining; i++) {
            groups.push("0");
          }
          groups = groups.concat(last);
        } else if (halves.length === 1) {
          groups = address.split(":");
          this.elidedGroups = 0;
        } else {
          throw new address_error_1.AddressError("Too many :: groups found");
        }
        groups = groups.map((group) => parseInt(group, 16).toString(16));
        if (groups.length !== this.groups) {
          throw new address_error_1.AddressError("Incorrect number of groups found");
        }
        return groups;
      }
      /**
       * Returns the canonical (fully expanded) form of the address: all 8 groups,
       * each padded to 4 hex digits, with no `::` collapsing
       * (e.g. `2001:0db8:0000:0000:0000:0000:0000:0001`). Useful for sorting and
       * byte-exact comparison.
       */
      canonicalForm() {
        return this.parsedAddress.map(paddedHex).join(":");
      }
      /**
       * Return the decimal form of the address
       * @returns {String}
       */
      decimal() {
        return this.parsedAddress.map((n) => parseInt(n, 16).toString(10).padStart(5, "0")).join(":");
      }
      /**
       * Return the address as a BigInt
       * @returns {bigint}
       */
      bigInt() {
        return BigInt(`0x${this.parsedAddress.map(paddedHex).join("")}`);
      }
      /**
       * Return the last two groups of this address as an IPv4 address string
       * @returns {Address4}
       * @example
       * var address = new Address6('2001:4860:4001::1825:bf11');
       * address.to4().correctForm(); // '24.37.191.17'
       */
      to4() {
        const binary = this.binaryZeroPad().split("");
        return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join("")}`).toString(16).padStart(8, "0"));
      }
      /**
       * Return the v4-in-v6 form of the address
       * @returns {String}
       */
      to4in6() {
        const address4 = this.to4();
        const address6 = new _Address6(this.parsedAddress.slice(0, 6).join(":"), 6);
        const correct = address6.correctForm();
        let infix = "";
        if (!/:$/.test(correct)) {
          infix = ":";
        }
        return correct + infix + address4.address;
      }
      /**
       * Decodes the Teredo tunneling fields embedded in this address. Returns the
       * Teredo prefix, server IPv4, client IPv4, raw flag bits, cone-NAT flag,
       * UDP port, and Microsoft-format flag breakdown (reserved, universal/local,
       * group/individual, nonce). Only meaningful for addresses in `2001::/32`.
       */
      inspectTeredo() {
        const prefix = this.getBitsBase16(0, 32);
        const bitsForUdpPort = this.getBits(80, 96);
        const udpPort = (bitsForUdpPort ^ BigInt("0xffff")).toString();
        const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
        const bitsForClient4 = this.getBits(96, 128);
        const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt("0xffffffff")).toString(16).padStart(8, "0"));
        const flagsBase2 = this.getBitsBase2(64, 80);
        const coneNat = (0, common_1.testBit)(flagsBase2, 15);
        const reserved = (0, common_1.testBit)(flagsBase2, 14);
        const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
        const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
        const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
        return {
          prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
          server4: server4.address,
          client4: client4.address,
          flags: flagsBase2,
          coneNat,
          microsoft: {
            reserved,
            universalLocal,
            groupIndividual,
            nonce
          },
          udpPort
        };
      }
      /**
       * Decodes the 6to4 tunneling fields embedded in this address. Returns the
       * 6to4 prefix and the embedded IPv4 gateway address. Only meaningful for
       * addresses in `2002::/16`.
       */
      inspect6to4() {
        const prefix = this.getBitsBase16(0, 16);
        const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
        return {
          prefix: prefix.slice(0, 4),
          gateway: gateway.address
        };
      }
      /**
       * Return a v6 6to4 address from a v6 v4inv6 address
       * @returns {Address6}
       */
      to6to4() {
        if (!this.is4()) {
          return null;
        }
        const addr6to4 = [
          "2002",
          this.getBitsBase16(96, 112),
          this.getBitsBase16(112, 128),
          "",
          "/16"
        ].join(":");
        return new _Address6(addr6to4);
      }
      /**
       * Embed an IPv4 address into a NAT64 IPv6 address using the encoding
       * defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
       * The default prefix is the well-known prefix `64:ff9b::/96`. The prefix
       * length must be one of 32, 40, 48, 56, 64, or 96; for prefixes shorter
       * than /64 the IPv4 octets are split around the reserved bits 64–71.
       * @example
       * Address6.fromAddress4Nat64('192.0.2.33').correctForm(); // '64:ff9b::c000:221'
       * Address6.fromAddress4Nat64('192.0.2.33', '2001:db8::/32').correctForm(); // '2001:db8:c000:221::'
       */
      static fromAddress4Nat64(address, prefix = "64:ff9b::/96") {
        const v4 = new ipv4_1.Address4(address);
        const prefix6 = new _Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
          throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
        }
        const prefixBits = prefix6.binaryZeroPad();
        const v4Bits = v4.binaryZeroPad();
        let bits;
        if (pl === 96) {
          bits = prefixBits.slice(0, 96) + v4Bits;
        } else {
          const beforeU = 64 - pl;
          bits = prefixBits.slice(0, pl) + v4Bits.slice(0, beforeU) + "00000000" + v4Bits.slice(beforeU) + "0".repeat(128 - 72 - (32 - beforeU));
        }
        const hex = BigInt(`0b${bits}`).toString(16).padStart(32, "0");
        const groups = [];
        for (let i = 0; i < 8; i++) {
          groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new _Address6(groups.join(":"));
      }
      /**
       * Extract the embedded IPv4 address from a NAT64 IPv6 address using the
       * encoding defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
       * The default prefix is the well-known prefix `64:ff9b::/96`. Returns
       * `null` if this address is not contained within the given prefix.
       * @example
       * new Address6('64:ff9b::c000:221').toAddress4Nat64()!.correctForm(); // '192.0.2.33'
       */
      toAddress4Nat64(prefix = "64:ff9b::/96") {
        const prefix6 = new _Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
          throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
        }
        if (!this.isInSubnet(prefix6)) {
          return null;
        }
        const bits = this.binaryZeroPad();
        let v4Bits;
        if (pl === 96) {
          v4Bits = bits.slice(96, 128);
        } else {
          const beforeU = 64 - pl;
          v4Bits = bits.slice(pl, pl + beforeU) + bits.slice(72, 72 + (32 - beforeU));
        }
        const octets = [];
        for (let i = 0; i < 4; i++) {
          octets.push(parseInt(v4Bits.slice(i * 8, (i + 1) * 8), 2).toString());
        }
        return new ipv4_1.Address4(octets.join("."));
      }
      /**
       * Return a byte array.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toByteArray())`.
       * @returns {Array}
       */
      toByteArray() {
        const valueWithoutPadding = this.bigInt().toString(16);
        const leadingPad = "0".repeat(valueWithoutPadding.length % 2);
        const value = `${leadingPad}${valueWithoutPadding}`;
        const bytes = [];
        for (let i = 0, length = value.length; i < length; i += 2) {
          bytes.push(parseInt(value.substring(i, i + 2), 16));
        }
        return bytes;
      }
      /**
       * Return an unsigned byte array.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toUnsignedByteArray())`.
       * @returns {Array}
       */
      toUnsignedByteArray() {
        return this.toByteArray().map(unsignByte);
      }
      /**
       * Convert a byte array to an Address6 object.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address6.fromByteArray([...buf])`.
       * @returns {Address6}
       */
      static fromByteArray(bytes) {
        return this.fromUnsignedByteArray(bytes.map(unsignByte));
      }
      /**
       * Convert an unsigned byte array to an Address6 object.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address6.fromUnsignedByteArray([...buf])`.
       * @returns {Address6}
       */
      static fromUnsignedByteArray(bytes) {
        const BYTE_MAX = BigInt("256");
        let result = BigInt("0");
        let multiplier = BigInt("1");
        for (let i = bytes.length - 1; i >= 0; i--) {
          result += multiplier * BigInt(bytes[i].toString(10));
          multiplier *= BYTE_MAX;
        }
        return _Address6.fromBigInt(result);
      }
      /**
       * Returns true if the address is in the canonical form, false otherwise
       * @returns {boolean}
       */
      isCanonical() {
        return this.addressMinusSuffix === this.canonicalForm();
      }
      /**
       * Returns true if the address is a link local address, false otherwise
       * @returns {boolean}
       */
      isLinkLocal() {
        if (this.getBitsBase2(0, 64) === "1111111010000000000000000000000000000000000000000000000000000000") {
          return true;
        }
        return false;
      }
      /**
       * Returns true if the address is a multicast address, false otherwise
       * @returns {boolean}
       */
      isMulticast() {
        const type = this.getType();
        return type === "Multicast" || type.startsWith("Multicast ");
      }
      /**
       * Returns true if the address was written in v4-in-v6 dotted-quad notation
       * (e.g. `::ffff:127.0.0.1`), false otherwise. This is a notation-level flag
       * and does not reflect whether the address bits lie in the IPv4-mapped
       * (`::ffff:0:0/96`) subnet — for that, see {@link isMapped4}.
       * @returns {boolean}
       */
      is4() {
        return this.v4;
      }
      /**
       * Returns true if the address is an IPv4-mapped IPv6 address in
       * `::ffff:0:0/96` ([RFC 4291 §2.5.5.2](https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2)),
       * false otherwise. Unlike {@link is4}, this checks the underlying address
       * bits rather than the textual notation, so `::ffff:127.0.0.1` and
       * `::ffff:7f00:1` both return true.
       * @returns {boolean}
       */
      isMapped4() {
        return this.isInSubnet(IPV4_MAPPED_SUBNET);
      }
      /**
       * Returns true if the address is a Teredo address, false otherwise
       * @returns {boolean}
       */
      isTeredo() {
        return this.isInSubnet(TEREDO_SUBNET);
      }
      /**
       * Returns true if the address is a 6to4 address, false otherwise
       * @returns {boolean}
       */
      is6to4() {
        return this.isInSubnet(SIX_TO_FOUR_SUBNET);
      }
      /**
       * Returns true if the address is a loopback address, false otherwise
       * @returns {boolean}
       */
      isLoopback() {
        return this.getType() === "Loopback";
      }
      /**
       * Returns true if the address is a Unique Local Address in `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)). ULAs are the IPv6 equivalent of IPv4 [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private addresses.
       * @returns {boolean}
       */
      isULA() {
        return this.isInSubnet(ULA_SUBNET);
      }
      /**
       * Returns true if the address is the unspecified address `::`.
       * @returns {boolean}
       */
      isUnspecified() {
        return this.getType() === "Unspecified";
      }
      /**
       * Returns true if the address is in the documentation prefix `2001:db8::/32` ([RFC 3849](https://datatracker.ietf.org/doc/html/rfc3849)).
       * @returns {boolean}
       */
      isDocumentation() {
        return this.isInSubnet(DOCUMENTATION_SUBNET);
      }
      // #endregion
      // #region HTML
      /**
       * Returns the address as an HTTP URL with the host bracketed, e.g.
       * `http://[2001:db8::1]/`. If `optionalPort` is provided it is appended,
       * e.g. `http://[2001:db8::1]:8080/`.
       */
      href(optionalPort) {
        if (optionalPort === void 0) {
          optionalPort = "";
        } else {
          optionalPort = `:${optionalPort}`;
        }
        return `http://[${this.correctForm()}]${optionalPort}/`;
      }
      /**
       * Returns an HTML `<a>` element whose `href` encodes the address in a URL
       * hash fragment (default prefix `/#address=`). Useful for linking between
       * pages of an address-inspector UI.
       * @param options.className - CSS class for the rendered `<a>` element
       * @param options.prefix - hash prefix prepended to the address (default `/#address=`)
       * @param options.v4 - when true, render the address in v4-in-v6 form
       */
      link(options) {
        if (!options) {
          options = {};
        }
        if (options.className === void 0) {
          options.className = "";
        }
        if (options.prefix === void 0) {
          options.prefix = "/#address=";
        }
        if (options.v4 === void 0) {
          options.v4 = false;
        }
        let formFunction = this.correctForm;
        if (options.v4) {
          formFunction = this.to4in6;
        }
        const form = formFunction.call(this);
        const safeHref = helpers.escapeHtml(`${options.prefix}${form}`);
        const safeForm = helpers.escapeHtml(form);
        if (options.className) {
          const safeClass = helpers.escapeHtml(options.className);
          return `<a href="${safeHref}" class="${safeClass}">${safeForm}</a>`;
        }
        return `<a href="${safeHref}">${safeForm}</a>`;
      }
      /**
       * Groups an address
       * @returns {String}
       */
      group() {
        if (this.elidedGroups === 0) {
          return helpers.simpleGroup(this.addressMinusSuffix).join(":");
        }
        assert(typeof this.elidedGroups === "number");
        assert(typeof this.elisionBegin === "number");
        const output = [];
        const [left, right] = this.addressMinusSuffix.split("::");
        if (left.length) {
          output.push(...helpers.simpleGroup(left));
        } else {
          output.push("");
        }
        const classes = ["hover-group"];
        for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++) {
          classes.push(`group-${i}`);
        }
        output.push(`<span class="${classes.join(" ")}"></span>`);
        if (right.length) {
          output.push(...helpers.simpleGroup(right, this.elisionEnd));
        } else {
          output.push("");
        }
        if (this.is4()) {
          assert(this.address4 instanceof ipv4_1.Address4);
          output.pop();
          output.push(this.address4.groupForV6());
        }
        return output.join(":");
      }
      // #endregion
      // #region Regular expressions
      /**
       * Generate a regular expression string that can be used to find or validate
       * all variations of this address
       * @param {boolean} substringSearch
       * @returns {string}
       */
      regularExpressionString(substringSearch = false) {
        let output = [];
        const address6 = new _Address6(this.correctForm());
        if (address6.elidedGroups === 0) {
          output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
        } else if (address6.elidedGroups === constants6.GROUPS) {
          output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
        } else {
          const halves = address6.address.split("::");
          if (halves[0].length) {
            output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(":")));
          }
          assert(typeof address6.elidedGroups === "number");
          output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
          if (halves[1].length) {
            output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(":")));
          }
          output = [output.join(":")];
        }
        if (!substringSearch) {
          output = [
            "(?=^|",
            regular_expressions_1.ADDRESS_BOUNDARY,
            "|[^\\w\\:])(",
            ...output,
            ")(?=[^\\w\\:]|",
            regular_expressions_1.ADDRESS_BOUNDARY,
            "|$)"
          ];
        }
        return output.join("");
      }
      /**
       * Generate a regular expression that can be used to find or validate all
       * variations of this address.
       * @param {boolean} substringSearch
       * @returns {RegExp}
       */
      regularExpression(substringSearch = false) {
        return new RegExp(this.regularExpressionString(substringSearch), "i");
      }
    };
    exports2.Address6 = Address62;
    var TYPE_SUBNETS = Object.keys(constants6.TYPES).map((subnet) => [
      new Address62(subnet),
      constants6.TYPES[subnet]
    ]);
    var TEREDO_SUBNET = new Address62("2001::/32");
    var SIX_TO_FOUR_SUBNET = new Address62("2002::/16");
    var ULA_SUBNET = new Address62("fc00::/7");
    var DOCUMENTATION_SUBNET = new Address62("2001:db8::/32");
    var IPV4_MAPPED_SUBNET = new Address62("::ffff:0:0/96");
  }
});

// ../../node_modules/ip-address/dist/ip-address.js
var require_ip_address = __commonJS({
  "../../node_modules/ip-address/dist/ip-address.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.v6 = exports2.AddressError = exports2.Address6 = exports2.Address4 = void 0;
    var ipv4_1 = require_ipv4();
    Object.defineProperty(exports2, "Address4", { enumerable: true, get: function() {
      return ipv4_1.Address4;
    } });
    var ipv6_1 = require_ipv6();
    Object.defineProperty(exports2, "Address6", { enumerable: true, get: function() {
      return ipv6_1.Address6;
    } });
    var address_error_1 = require_address_error();
    Object.defineProperty(exports2, "AddressError", { enumerable: true, get: function() {
      return address_error_1.AddressError;
    } });
    var helpers = __importStar(require_helpers());
    exports2.v6 = { helpers };
  }
});

// src/observability/sentry.ts
import * as Sentry from "@sentry/node";

// src/config/env.ts
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { z } from "zod";
var rootEnv = resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) {
  loadDotenv({ path: rootEnv });
} else {
  loadDotenv();
}
var EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  // Obrigatório desde o MVP — usado para assinar o JWT de sessão.
  JWT_SECRET: z.string().min(32, "JWT_SECRET deve ter ao menos 32 caracteres"),
  SESSION_COOKIE_NAME: z.string().min(1).default("vita_session"),
  // Opcionais agora; tornam-se necessários nas suas respectivas user stories.
  DATABASE_URL: z.string().url().optional(),
  // US2 (Neon)
  GOOGLE_CLIENT_ID: z.string().optional(),
  // US3
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // US3
  OAUTH_REDIRECT_URI: z.string().url().optional(),
  // US3
  ADMIN_EMAILS: z.string().optional(),
  // US3
  SENTRY_DSN: z.string().optional()
  // US4
});
function parseEnv(source) {
  const cleaned = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, value === "" ? void 0 : value])
  );
  return EnvSchema.safeParse(cleaned);
}
function loadEnv() {
  const parsed = parseEnv(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    console.error(`
[config] Vari\xE1veis de ambiente inv\xE1lidas:
${issues}
`);
    process.exit(1);
  }
  return parsed.data;
}
var env = loadEnv();
var isProduction = env.NODE_ENV === "production";

// src/observability/sentry.ts
var initialized = false;
function initSentry() {
  if (initialized || !env.SENTRY_DSN) return false;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      return event;
    }
  });
  initialized = true;
  return true;
}
function captureException2(err) {
  if (initialized) Sentry.captureException(err);
}

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

// src/middleware/logging.ts
import { pinoHttp } from "pino-http";
import pino from "pino";
var REDACT_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  'res.headers["set-cookie"]',
  "req.body.password",
  "req.body.token",
  "*.password",
  "*.secret",
  "*.token"
];
var logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : isProduction ? "info" : "debug",
  redact: { paths: REDACT_PATHS, remove: true }
});
var httpLogger = pinoHttp({ logger });

// src/middleware/error.ts
var AppError = class extends Error {
  status;
  code;
  constructor(status, code, message2) {
    super(message2);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
};
var notFoundHandler = (_req, res) => {
  const body = { error: { code: "not_found", message: "Recurso n\xE3o encontrado" } };
  res.status(404).json(body);
};
var errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn({ code: err.code, status: err.status }, err.message);
    const body2 = { error: { code: err.code, message: err.message } };
    res.status(err.status).json(body2);
    return;
  }
  logger.error({ err }, "Erro n\xE3o tratado");
  captureException2(err);
  const body = {
    error: {
      code: "internal_error",
      message: isProduction ? "Erro interno" : err instanceof Error ? err.message : "Erro interno"
    }
  };
  res.status(500).json(body);
};

// src/health/health.route.ts
import { Router } from "express";

// src/db/client.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql as sql2 } from "drizzle-orm";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  allowlist: () => allowlist,
  bloodPressureLogs: () => bloodPressureLogs,
  userProfiles: () => userProfiles,
  weightLogs: () => weightLogs
});
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid, real, integer, date } from "drizzle-orm/pg-core";
var allowlist = pgTable(
  "allowlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    role: text("role", { enum: ["admin", "member"] }).notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: text("created_by")
  },
  (table) => [
    // Unicidade case-insensitive por e-mail.
    uniqueIndex("allowlist_email_lower_unique").on(sql`lower(${table.email})`)
  ]
);
var weightLogs = pgTable("weight_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userEmail: text("user_email").notNull(),
  weight: real("weight").notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var bloodPressureLogs = pgTable("blood_pressure_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userEmail: text("user_email").notNull(),
  systolic: integer("systolic").notNull(),
  diastolic: integer("diastolic").notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userEmail: text("user_email").notNull(),
    fullName: text("full_name"),
    birthDate: date("birth_date"),
    heightCm: real("height_cm"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    // No máximo um perfil por usuário (case-insensitive).
    uniqueIndex("user_profiles_email_lower_unique").on(sql`lower(${table.userEmail})`)
  ]
);

// src/db/client.ts
function requireDatabaseUrl() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL n\xE3o configurada (necess\xE1ria a partir da US2).");
  }
  return env.DATABASE_URL;
}
var client = neon(requireDatabaseUrl());
var db = drizzle(client, { schema: schema_exports });
async function checkDatabase() {
  try {
    await db.execute(sql2`select 1`);
    return true;
  } catch {
    return false;
  }
}

// src/health/health.route.ts
var healthRouter = Router();
healthRouter.get("/", async (_req, res) => {
  const dbUp = await checkDatabase();
  const body = {
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "up" : "down",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  res.status(dbUp ? 200 : 503).json(body);
});

// src/auth/auth.route.ts
import { randomBytes } from "node:crypto";
import { Router as Router2 } from "express";

// src/middleware/async.ts
var asyncHandler = (fn2) => (req, res, next) => Promise.resolve(fn2(req, res, next)).catch(next);

// src/allowlist/allowlist.service.ts
import { eq, sql as sql3 } from "drizzle-orm";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function assertCanRemove(entry, adminCount) {
  if (entry.role === "admin" && adminCount <= 1) {
    throw new AppError(409, "last_admin", "N\xE3o \xE9 poss\xEDvel remover o \xFAltimo administrador.");
  }
}
async function listEntries() {
  return db.select().from(allowlist).orderBy(allowlist.createdAt);
}
async function getRole(email) {
  const rows = await db.select({ role: allowlist.role }).from(allowlist).where(sql3`lower(${allowlist.email}) = ${normalizeEmail(email)}`).limit(1);
  return rows[0]?.role ?? null;
}
async function addEntry(input, createdBy) {
  try {
    const [row] = await db.insert(allowlist).values({ email: normalizeEmail(input.email), role: input.role, createdBy }).returning();
    return row;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      throw new AppError(409, "email_exists", "Este e-mail j\xE1 est\xE1 na allowlist.");
    }
    throw err;
  }
}
async function countAdmins() {
  const rows = await db.select({ n: sql3`count(*)::int` }).from(allowlist).where(eq(allowlist.role, "admin"));
  return rows[0]?.n ?? 0;
}
async function removeEntry(id) {
  const [entry] = await db.select().from(allowlist).where(eq(allowlist.id, id)).limit(1);
  if (!entry) {
    throw new AppError(404, "not_found", "Entrada n\xE3o encontrada.");
  }
  assertCanRemove(entry, await countAdmins());
  await db.delete(allowlist).where(eq(allowlist.id, id));
}

// src/auth/google.ts
import { OAuth2Client } from "google-auth-library";
function oauthConfig() {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new AppError(500, "oauth_not_configured", "Autentica\xE7\xE3o Google n\xE3o configurada.");
  }
  return { clientId, clientSecret, redirectUri };
}
function createOAuthClient() {
  const { clientId, clientSecret, redirectUri } = oauthConfig();
  return new OAuth2Client({ clientId, clientSecret, redirectUri });
}
function buildAuthUrl(state) {
  return createOAuthClient().generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account"
  });
}
async function exchangeCodeForEmail(code) {
  const { clientId } = oauthConfig();
  const client2 = createOAuthClient();
  const { tokens } = await client2.getToken(code);
  if (!tokens.id_token) {
    throw new AppError(401, "oauth_error", "Token de identidade ausente.");
  }
  const ticket = await client2.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new AppError(401, "oauth_error", "E-mail n\xE3o retornado pelo Google.");
  }
  return { email: payload.email, emailVerified: payload.email_verified ?? false };
}

// src/auth/session.ts
import { SignJWT, jwtVerify } from "jose";
var secret = new TextEncoder().encode(env.JWT_SECRET);
var SESSION_TTL_SECONDS = 60 * 60 * 12;
var SESSION_COOKIE_NAME = env.SESSION_COOKIE_NAME;
async function issueSessionToken(claims) {
  return new SignJWT({ role: claims.role }).setProtectedHeader({ alg: "HS256" }).setSubject(claims.sub).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(secret);
}
async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return { sub: String(payload.sub), role: payload.role };
}
function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1e3
  };
}

// src/auth/middleware.ts
var requireAuth = async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    next(new AppError(401, "unauthenticated", "Autentica\xE7\xE3o necess\xE1ria."));
    return;
  }
  try {
    const claims = await verifySessionToken(token);
    req.user = { email: claims.sub, role: claims.role };
    next();
  } catch {
    next(new AppError(401, "unauthenticated", "Sess\xE3o inv\xE1lida ou expirada."));
  }
};
var requireAdmin = (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    if (req.user?.role !== "admin") {
      next(new AppError(403, "forbidden", "Acesso restrito a administradores."));
      return;
    }
    next();
  });
};

// src/auth/auth.route.ts
var authRouter = Router2();
var OAUTH_STATE_COOKIE = "vita_oauth_state";
var stateCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 10 * 60 * 1e3
  // 10 min
};
authRouter.get(
  "/google",
  asyncHandler(async (_req, res) => {
    const state = randomBytes(16).toString("hex");
    res.cookie(OAUTH_STATE_COOKIE, state, stateCookieOptions);
    res.redirect(buildAuthUrl(state));
  })
);
authRouter.get(
  "/google/callback",
  asyncHandler(async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];
    if (!code || !state || !cookieState || state !== cookieState) {
      throw new AppError(403, "invalid_state", "Estado OAuth inv\xE1lido.");
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });
    const { email, emailVerified } = await exchangeCodeForEmail(code);
    if (!emailVerified) {
      throw new AppError(403, "email_unverified", "E-mail do Google n\xE3o verificado.");
    }
    const role = await getRole(email);
    if (!role) {
      res.status(403).type("html").send(
        '<!doctype html><meta charset="utf-8"><p>Acesso n\xE3o autorizado para este e-mail.</p><a href="/login">Voltar</a>'
      );
      return;
    }
    const token = await issueSessionToken({ sub: email.toLowerCase(), role });
    res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    res.redirect("/");
  })
);
authRouter.get("/me", requireAuth, (req, res) => {
  const user = req.user;
  res.json(user);
});
authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.status(204).end();
});

// src/allowlist/allowlist.route.ts
import { Router as Router3 } from "express";

// ../../packages/shared/src/index.ts
import { z as z5 } from "zod";

// ../../packages/shared/src/auth.ts
import { z as z2 } from "zod";
var roleSchema = z2.enum(["admin", "member"]);
var currentUserSchema = z2.object({
  email: z2.string().email(),
  role: roleSchema
});
var allowlistEntrySchema = z2.object({
  id: z2.string().uuid(),
  email: z2.string().email(),
  role: roleSchema,
  createdAt: z2.string(),
  createdBy: z2.string().nullable()
});
var allowlistCreateSchema = z2.object({
  email: z2.string().email(),
  role: roleSchema.default("member")
});

// ../../packages/shared/src/health.ts
import { z as z3 } from "zod";
var weightLogInputSchema = z3.object({
  weight: z3.number({ required_error: "O peso \xE9 obrigat\xF3rio." }).min(20, { message: "O peso m\xEDnimo \xE9 20 kg." }).max(350, { message: "O peso m\xE1ximo \xE9 350 kg." }),
  loggedAt: z3.string().datetime({ message: "Data inv\xE1lida." }).optional()
});
var bpLogInputSchema = z3.object({
  systolic: z3.number({ required_error: "A press\xE3o sist\xF3lica \xE9 obrigat\xF3ria." }).int().min(40, { message: "A press\xE3o sist\xF3lica m\xEDnima \xE9 40 mmHg." }).max(300, { message: "A press\xE3o sist\xF3lica m\xE1xima \xE9 300 mmHg." }),
  diastolic: z3.number({ required_error: "A press\xE3o diast\xF3lica \xE9 obrigat\xF3ria." }).int().min(30, { message: "A press\xE3o diast\xF3lica m\xEDnima \xE9 30 mmHg." }).max(200, { message: "A press\xE3o diast\xF3lica m\xE1xima \xE9 200 mmHg." }),
  loggedAt: z3.string().datetime({ message: "Data inv\xE1lida." }).optional()
});

// ../../packages/shared/src/profile.ts
import { z as z4 } from "zod";
var profileInputSchema = z4.object({
  fullName: z4.string().trim().max(120, { message: "O nome completo deve ter no m\xE1ximo 120 caracteres." }).optional(),
  birthDate: z4.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento inv\xE1lida (use AAAA-MM-DD)." }).refine(
    (value) => {
      const date2 = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date2.getTime());
    },
    { message: "Data de nascimento inv\xE1lida." }
  ).refine(
    (value) => {
      const year = Number(value.slice(0, 4));
      return year >= 1900;
    },
    { message: "O ano de nascimento deve ser a partir de 1900." }
  ).refine(
    (value) => {
      const date2 = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
      const today = /* @__PURE__ */ new Date();
      today.setUTCHours(0, 0, 0, 0);
      return date2.getTime() <= today.getTime();
    },
    { message: "A data de nascimento n\xE3o pode estar no futuro." }
  ).optional(),
  heightCm: z4.number({ invalid_type_error: "A altura deve ser um n\xFAmero." }).min(50, { message: "A altura m\xEDnima \xE9 50 cm." }).max(250, { message: "A altura m\xE1xima \xE9 250 cm." }).optional()
});

// src/allowlist/allowlist.route.ts
var allowlistRouter = Router3();
function toDto(row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    createdBy: row.createdBy
  };
}
allowlistRouter.use(requireAdmin);
allowlistRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await listEntries();
    res.json(rows.map(toDto));
  })
);
allowlistRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = allowlistCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "invalid_body", "Dados inv\xE1lidos.");
    }
    const row = await addEntry(parsed.data, req.user?.email ?? null);
    res.status(201).json(toDto(row));
  })
);
allowlistRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (typeof id !== "string" || id.length === 0) {
      throw new AppError(400, "invalid_id", "Identificador inv\xE1lido.");
    }
    await removeEntry(id);
    res.status(204).end();
  })
);

// src/docs/docs.route.ts
import { Router as Router4 } from "express";
import swaggerUi from "swagger-ui-express";

// src/docs/openapi.ts
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z5);
var healthSchema = z5.object({
  status: z5.enum(["ok", "degraded"]),
  db: z5.enum(["up", "down"]).optional(),
  time: z5.string()
});
var errorSchema = z5.object({
  error: z5.object({ code: z5.string(), message: z5.string() })
});
function buildOpenApiDocument() {
  const registry = new OpenAPIRegistry();
  const CurrentUser = registry.register("CurrentUser", currentUserSchema);
  const AllowlistEntry = registry.register("AllowlistEntry", allowlistEntrySchema);
  const AllowlistCreate = registry.register("AllowlistCreate", allowlistCreateSchema);
  const Health = registry.register("Health", healthSchema);
  const ApiError = registry.register("Error", errorSchema);
  registry.registerPath({
    method: "get",
    path: "/api/health",
    summary: "Verifica\xE7\xE3o de sa\xFAde (inclui estado do banco)",
    responses: {
      200: { description: "Saud\xE1vel", content: { "application/json": { schema: Health } } },
      503: { description: "Degradado", content: { "application/json": { schema: Health } } }
    }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/google",
    summary: "Inicia o fluxo OAuth (redireciona ao Google)",
    responses: { 302: { description: "Redirecionamento" } }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/google/callback",
    summary: "Callback OAuth: valida, checa allowlist e emite sess\xE3o",
    responses: {
      302: { description: "Sucesso (cookie de sess\xE3o)" },
      403: { description: "Fora da allowlist / state inv\xE1lido" }
    }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/me",
    summary: "Usu\xE1rio da sess\xE3o atual",
    responses: {
      200: { description: "Autenticado", content: { "application/json": { schema: CurrentUser } } },
      401: { description: "Sem sess\xE3o", content: { "application/json": { schema: ApiError } } }
    }
  });
  registry.registerPath({
    method: "post",
    path: "/api/auth/logout",
    summary: "Encerra a sess\xE3o",
    responses: { 204: { description: "Sess\xE3o encerrada" } }
  });
  registry.registerPath({
    method: "get",
    path: "/api/allowlist",
    summary: "Lista a allowlist (admin)",
    responses: {
      200: {
        description: "Lista",
        content: { "application/json": { schema: z5.array(AllowlistEntry) } }
      },
      401: { description: "Sem sess\xE3o" },
      403: { description: "N\xE3o-admin" }
    }
  });
  registry.registerPath({
    method: "post",
    path: "/api/allowlist",
    summary: "Adiciona um e-mail (admin)",
    request: {
      body: { content: { "application/json": { schema: AllowlistCreate } } }
    },
    responses: {
      201: { description: "Criado", content: { "application/json": { schema: AllowlistEntry } } },
      400: { description: "Inv\xE1lido" },
      409: { description: "E-mail j\xE1 existente" }
    }
  });
  registry.registerPath({
    method: "delete",
    path: "/api/allowlist/{id}",
    summary: "Remove uma entrada (admin)",
    request: { params: z5.object({ id: z5.string().uuid() }) },
    responses: {
      204: { description: "Removido" },
      409: { description: "Opera\xE7\xE3o proibida (\xFAltimo admin)" }
    }
  });
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: { title: "VITA Foundation API", version: "0.1.0" }
  });
}

// src/docs/docs.route.ts
var docsRouter = Router4();
var document = buildOpenApiDocument();
docsRouter.get("/openapi.json", (_req, res) => {
  res.json(document);
});
docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(document));

// src/health_metrics/metrics.route.ts
import { Router as Router5 } from "express";

// src/health_metrics/metrics.service.ts
import { gte, and, eq as eq2, asc } from "drizzle-orm";
function parseDecimalInput(value) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}
async function createWeightLog(userEmail, data) {
  if (typeof data.weight === "string") {
    const parsed = parseDecimalInput(data.weight);
    if (parsed === null) {
      throw new AppError(400, "validation_error", "O peso deve ser um n\xFAmero v\xE1lido.");
    }
    data.weight = parsed;
  }
  const result = weightLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "validation_error", result.error.errors[0]?.message || "Dados de peso inv\xE1lidos.");
  }
  const [inserted] = await db.insert(weightLogs).values({
    userEmail,
    weight: result.data.weight,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : /* @__PURE__ */ new Date()
  }).returning();
  return inserted;
}
async function createBPLog(userEmail, data) {
  const result = bpLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "validation_error", result.error.errors[0]?.message || "Dados de press\xE3o inv\xE1lidos.");
  }
  const [inserted] = await db.insert(bloodPressureLogs).values({
    userEmail,
    systolic: result.data.systolic,
    diastolic: result.data.diastolic,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : /* @__PURE__ */ new Date()
  }).returning();
  return inserted;
}
function getFilterDate(timeframe) {
  const now = /* @__PURE__ */ new Date();
  if (timeframe === "7d") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
  } else if (timeframe === "30d") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
  }
  return null;
}
async function getWeightHistory(userEmail, timeframe = "all") {
  const filterDate = getFilterDate(timeframe);
  const conditions = [eq2(weightLogs.userEmail, userEmail)];
  if (filterDate) {
    conditions.push(gte(weightLogs.loggedAt, filterDate));
  }
  return db.select({
    id: weightLogs.id,
    weight: weightLogs.weight,
    loggedAt: weightLogs.loggedAt
  }).from(weightLogs).where(and(...conditions)).orderBy(asc(weightLogs.loggedAt));
}
async function getBPHistory(userEmail, timeframe = "all") {
  const filterDate = getFilterDate(timeframe);
  const conditions = [eq2(bloodPressureLogs.userEmail, userEmail)];
  if (filterDate) {
    conditions.push(gte(bloodPressureLogs.loggedAt, filterDate));
  }
  return db.select({
    id: bloodPressureLogs.id,
    systolic: bloodPressureLogs.systolic,
    diastolic: bloodPressureLogs.diastolic,
    loggedAt: bloodPressureLogs.loggedAt
  }).from(bloodPressureLogs).where(and(...conditions)).orderBy(asc(bloodPressureLogs.loggedAt));
}
async function updateWeightLog(id, userEmail, data) {
  if (typeof data.weight === "string") {
    const parsed = parseDecimalInput(data.weight);
    if (parsed === null) {
      throw new AppError(400, "validation_error", "O peso deve ser um n\xFAmero v\xE1lido.");
    }
    data.weight = parsed;
  }
  const result = weightLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "validation_error", result.error.errors[0]?.message || "Dados inv\xE1lidos.");
  }
  const [updated] = await db.update(weightLogs).set({
    weight: result.data.weight,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : void 0
  }).where(and(eq2(weightLogs.id, id), eq2(weightLogs.userEmail, userEmail))).returning();
  if (!updated) {
    throw new AppError(404, "not_found", "Registro de peso n\xE3o encontrado.");
  }
  return updated;
}
async function deleteWeightLog(id, userEmail) {
  const [deleted] = await db.delete(weightLogs).where(and(eq2(weightLogs.id, id), eq2(weightLogs.userEmail, userEmail))).returning();
  if (!deleted) {
    throw new AppError(404, "not_found", "Registro de peso n\xE3o encontrado.");
  }
  return deleted;
}
async function updateBPLog(id, userEmail, data) {
  const result = bpLogInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "validation_error", result.error.errors[0]?.message || "Dados inv\xE1lidos.");
  }
  const [updated] = await db.update(bloodPressureLogs).set({
    systolic: result.data.systolic,
    diastolic: result.data.diastolic,
    loggedAt: result.data.loggedAt ? new Date(result.data.loggedAt) : void 0
  }).where(and(eq2(bloodPressureLogs.id, id), eq2(bloodPressureLogs.userEmail, userEmail))).returning();
  if (!updated) {
    throw new AppError(404, "not_found", "Registro de press\xE3o arterial n\xE3o encontrado.");
  }
  return updated;
}
async function deleteBPLog(id, userEmail) {
  const [deleted] = await db.delete(bloodPressureLogs).where(and(eq2(bloodPressureLogs.id, id), eq2(bloodPressureLogs.userEmail, userEmail))).returning();
  if (!deleted) {
    throw new AppError(404, "not_found", "Registro de press\xE3o arterial n\xE3o encontrado.");
  }
  return deleted;
}

// src/health_metrics/metrics.route.ts
var router = Router5();
router.get("/weight", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const timeframe = req.query.timeframe;
    const logs = await getWeightHistory(userEmail, timeframe);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});
router.post("/weight", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const log2 = await createWeightLog(userEmail, req.body);
    res.status(201).json(log2);
  } catch (error) {
    next(error);
  }
});
router.put("/weight/:id", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const log2 = await updateWeightLog(req.params.id, userEmail, req.body);
    res.status(200).json(log2);
  } catch (error) {
    next(error);
  }
});
router.delete("/weight/:id", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    await deleteWeightLog(req.params.id, userEmail);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
router.get("/blood-pressure", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const timeframe = req.query.timeframe;
    const logs = await getBPHistory(userEmail, timeframe);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
});
router.post("/blood-pressure", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const log2 = await createBPLog(userEmail, req.body);
    res.status(201).json(log2);
  } catch (error) {
    next(error);
  }
});
router.put("/blood-pressure/:id", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const log2 = await updateBPLog(req.params.id, userEmail, req.body);
    res.status(200).json(log2);
  } catch (error) {
    next(error);
  }
});
router.delete("/blood-pressure/:id", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    await deleteBPLog(req.params.id, userEmail);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
var metrics_route_default = router;

// src/profile/profile.route.ts
import { Router as Router6 } from "express";

// src/profile/profile.service.ts
import { eq as eq3, sql as sql4 } from "drizzle-orm";
function toDto2(row) {
  return {
    id: row.id,
    fullName: row.fullName ?? null,
    birthDate: row.birthDate ?? null,
    heightCm: row.heightCm ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}
async function getProfile(userEmail) {
  const [row] = await db.select().from(userProfiles).where(eq3(sql4`lower(${userProfiles.userEmail})`, userEmail.toLowerCase())).limit(1);
  return row ? toDto2(row) : null;
}
async function upsertProfile(userEmail, data) {
  const result = profileInputSchema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, "validation_error", result.error.errors[0]?.message || "Dados de perfil inv\xE1lidos.");
  }
  const { fullName, birthDate, heightCm } = result.data;
  const now = /* @__PURE__ */ new Date();
  const [existing] = await db.select({ id: userProfiles.id }).from(userProfiles).where(eq3(sql4`lower(${userProfiles.userEmail})`, userEmail.toLowerCase())).limit(1);
  if (existing) {
    const [updated] = await db.update(userProfiles).set({
      fullName: fullName ?? null,
      birthDate: birthDate ?? null,
      heightCm: heightCm ?? null,
      updatedAt: now
    }).where(eq3(userProfiles.id, existing.id)).returning();
    return toDto2(updated);
  }
  const [inserted] = await db.insert(userProfiles).values({
    userEmail,
    fullName: fullName ?? null,
    birthDate: birthDate ?? null,
    heightCm: heightCm ?? null
  }).returning();
  return toDto2(inserted);
}

// src/profile/profile.route.ts
var router2 = Router6();
router2.get("/", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const profile = await getProfile(userEmail);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
});
router2.put("/", async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      res.status(401).json({ error: { code: "unauthenticated", message: "Autentica\xE7\xE3o necess\xE1ria." } });
      return;
    }
    const profile = await upsertProfile(userEmail, req.body);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
});
var profile_route_default = router2;

// src/middleware/security.ts
var import_csurf = __toESM(require_csurf(), 1);

// ../../node_modules/express-rate-limit/dist/index.mjs
var import_ip_address = __toESM(require_ip_address(), 1);
import { isIPv6 } from "node:net";
import { isIPv6 as isIPv62 } from "node:net";
import { Buffer as Buffer2 } from "node:buffer";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
function ipKeyGenerator(ip, ipv6Subnet = 56) {
  if (isIPv6(ip)) {
    const address = new import_ip_address.Address6(ip);
    if (address.is4()) return address.to4().correctForm();
    if (ipv6Subnet) {
      const subnet = new import_ip_address.Address6(`${ip}/${ipv6Subnet}`);
      return subnet.networkForm();
    }
  }
  return ip;
}
var MemoryStore = class {
  constructor(validations2) {
    this.validations = validations2;
    this.previous = /* @__PURE__ */ new Map();
    this.current = /* @__PURE__ */ new Map();
    this.localKeys = true;
  }
  /**
   * Method that initializes the store.
   *
   * @param options {Options} - The options used to setup the middleware.
   */
  init(options) {
    this.windowMs = options.windowMs;
    this.validations?.windowMs(this.windowMs);
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.clearExpired();
    }, this.windowMs);
    this.interval.unref?.();
  }
  /**
   * Method to fetch a client's hit count and reset time.
   *
   * @param key {string} - The identifier for a client.
   *
   * @returns {ClientRateLimitInfo | undefined} - The number of hits and reset time for that client.
   *
   * @public
   */
  async get(key) {
    return this.current.get(key) ?? this.previous.get(key);
  }
  /**
   * Method to increment a client's hit counter.
   *
   * @param key {string} - The identifier for a client.
   *
   * @returns {ClientRateLimitInfo} - The number of hits and reset time for that client.
   *
   * @public
   */
  async increment(key) {
    const client2 = this.getClient(key);
    const now = Date.now();
    if (client2.resetTime.getTime() <= now) {
      this.resetClient(client2, now);
    }
    client2.totalHits++;
    return client2;
  }
  /**
   * Method to decrement a client's hit counter.
   *
   * @param key {string} - The identifier for a client.
   *
   * @public
   */
  async decrement(key) {
    const client2 = this.getClient(key);
    if (client2.totalHits > 0) client2.totalHits--;
  }
  /**
   * Method to reset a client's hit counter.
   *
   * @param key {string} - The identifier for a client.
   *
   * @public
   */
  async resetKey(key) {
    this.current.delete(key);
    this.previous.delete(key);
  }
  /**
   * Method to reset everyone's hit counter.
   *
   * @public
   */
  async resetAll() {
    this.current.clear();
    this.previous.clear();
  }
  /**
   * Method to stop the timer (if currently running) and prevent any memory
   * leaks.
   *
   * @public
   */
  shutdown() {
    clearInterval(this.interval);
    void this.resetAll();
  }
  /**
   * Recycles a client by setting its hit count to zero, and reset time to
   * `windowMs` milliseconds from now.
   *
   * NOT to be confused with `#resetKey()`, which removes a client from both the
   * `current` and `previous` maps.
   *
   * @param client {Client} - The client to recycle.
   * @param now {number} - The current time, to which the `windowMs` is added to get the `resetTime` for the client.
   *
   * @return {Client} - The modified client that was passed in, to allow for chaining.
   */
  resetClient(client2, now = Date.now()) {
    client2.totalHits = 0;
    client2.resetTime.setTime(now + this.windowMs);
    return client2;
  }
  /**
   * Retrieves or creates a client, given a key. Also ensures that the client being
   * returned is in the `current` map.
   *
   * @param key {string} - The key under which the client is (or is to be) stored.
   *
   * @returns {Client} - The requested client.
   */
  getClient(key) {
    if (this.current.has(key)) return this.current.get(key);
    let client2;
    if (this.previous.has(key)) {
      client2 = this.previous.get(key);
      this.previous.delete(key);
    } else {
      client2 = { totalHits: 0, resetTime: /* @__PURE__ */ new Date() };
      this.resetClient(client2);
    }
    this.current.set(key, client2);
    return client2;
  }
  /**
   * Move current clients to previous, create a new map for current.
   *
   * This function is called every `windowMs`.
   */
  clearExpired() {
    this.previous = this.current;
    this.current = /* @__PURE__ */ new Map();
  }
};
var ConsoleLogger = {
  warn(...args2) {
    console.warn(...args2.reverse());
  },
  error(...args2) {
    console.error(...args2.reverse());
  }
};
var SUPPORTED_DRAFT_VERSIONS = [
  "draft-6",
  "draft-7",
  "draft-8"
];
var getResetSeconds = (windowMs, resetTime) => {
  let resetSeconds;
  if (resetTime) {
    const deltaSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1e3);
    resetSeconds = Math.max(0, deltaSeconds);
  } else {
    resetSeconds = Math.ceil(windowMs / 1e3);
  }
  return resetSeconds;
};
var getPartitionKey = (key) => {
  const hash = createHash("sha256");
  hash.update(key);
  const partitionKey = hash.digest("hex").slice(0, 12);
  return Buffer2.from(partitionKey).toString("base64");
};
var setLegacyHeaders = (response, info) => {
  if (response.headersSent) return;
  response.setHeader("X-RateLimit-Limit", info.limit.toString());
  response.setHeader("X-RateLimit-Remaining", info.remaining.toString());
  if (info.resetTime instanceof Date) {
    response.setHeader("Date", (/* @__PURE__ */ new Date()).toUTCString());
    response.setHeader(
      "X-RateLimit-Reset",
      Math.ceil(info.resetTime.getTime() / 1e3).toString()
    );
  }
};
var setDraft6Headers = (response, info, windowMs) => {
  if (response.headersSent) return;
  const windowSeconds = Math.ceil(windowMs / 1e3);
  const resetSeconds = getResetSeconds(windowMs, info.resetTime);
  response.setHeader("RateLimit-Policy", `${info.limit};w=${windowSeconds}`);
  response.setHeader("RateLimit-Limit", info.limit.toString());
  response.setHeader("RateLimit-Remaining", info.remaining.toString());
  if (typeof resetSeconds === "number")
    response.setHeader("RateLimit-Reset", resetSeconds.toString());
};
var setDraft7Headers = (response, info, windowMs) => {
  if (response.headersSent) return;
  const windowSeconds = Math.ceil(windowMs / 1e3);
  const resetSeconds = getResetSeconds(windowMs, info.resetTime);
  response.setHeader("RateLimit-Policy", `${info.limit};w=${windowSeconds}`);
  response.setHeader(
    "RateLimit",
    `limit=${info.limit}, remaining=${info.remaining}, reset=${resetSeconds}`
  );
};
var setDraft8Headers = (response, info, windowMs, name, key) => {
  if (response.headersSent) return;
  const windowSeconds = Math.ceil(windowMs / 1e3);
  const resetSeconds = getResetSeconds(windowMs, info.resetTime);
  const partitionKey = getPartitionKey(key);
  const header = `r=${info.remaining}; t=${resetSeconds}`;
  const policy = `q=${info.limit}; w=${windowSeconds}; pk=:${partitionKey}:`;
  response.append("RateLimit", `"${name}"; ${header}`);
  response.append("RateLimit-Policy", `"${name}"; ${policy}`);
};
var setRetryAfterHeader = (response, info, windowMs) => {
  if (response.headersSent) return;
  const resetSeconds = getResetSeconds(windowMs, info.resetTime);
  response.setHeader("Retry-After", resetSeconds.toString());
};
var omitUndefinedProperties = (passedOptions) => {
  const omittedOptions = {};
  for (const k of Object.keys(passedOptions)) {
    const key = k;
    if (passedOptions[key] !== void 0) {
      omittedOptions[key] = passedOptions[key];
    }
  }
  return omittedOptions;
};
var ValidationError = class extends Error {
  /**
   * The code must be a string, in snake case and all capital, that starts with
   * the substring `ERR_ERL_`.
   *
   * The message must be a string, starting with an uppercase character,
   * describing the issue in detail.
   */
  constructor(code, message2) {
    const url = `https://express-rate-limit.github.io/${code}/`;
    super(`${message2} See ${url} for more information.`);
    this.name = this.constructor.name;
    this.code = code;
    this.help = url;
  }
};
var ChangeWarning = class extends ValidationError {
};
var usedStores = /* @__PURE__ */ new Set();
var singleCountKeys = /* @__PURE__ */ new WeakMap();
var validations = {
  enabled: {
    default: true
  },
  // Should be EnabledValidations type, but that's a circular reference
  disable() {
    for (const k of Object.keys(this.enabled)) this.enabled[k] = false;
  },
  /**
   * Checks whether the IP address is valid, and that it does not have a port
   * number in it.
   *
   * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_invalid_ip_address.
   *
   * @param ip {string | undefined} - The IP address provided by Express as request.ip.
   *
   * @returns {void}
   */
  ip(ip) {
    if (ip === void 0) {
      throw new ValidationError(
        "ERR_ERL_UNDEFINED_IP_ADDRESS",
        `An undefined 'request.ip' was detected. This might indicate a misconfiguration or the connection being destroyed prematurely.`
      );
    }
    if (!isIP(ip)) {
      throw new ValidationError(
        "ERR_ERL_INVALID_IP_ADDRESS",
        `An invalid 'request.ip' (${ip}) was detected. Consider passing a custom 'keyGenerator' function to the rate limiter.`
      );
    }
  },
  /**
   * Makes sure the trust proxy setting is not set to `true`.
   *
   * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_permissive_trust_proxy.
   *
   * @param request {Request} - The Express request object.
   *
   * @returns {void}
   */
  trustProxy(request) {
    if (request.app.get("trust proxy") === true) {
      throw new ValidationError(
        "ERR_ERL_PERMISSIVE_TRUST_PROXY",
        `The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting.`
      );
    }
  },
  /**
   * Makes sure the trust proxy setting is set in case the `X-Forwarded-For`
   * header is present.
   *
   * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_unset_trust_proxy.
   *
   * @param request {Request} - The Express request object.
   *
   * @returns {void}
   */
  xForwardedForHeader(request) {
    if (request.headers["x-forwarded-for"] && request.app.get("trust proxy") === false) {
      throw new ValidationError(
        "ERR_ERL_UNEXPECTED_X_FORWARDED_FOR",
        `The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users.`
      );
    }
  },
  /**
   * Alert the user if the Forwarded header is set (standardized version of X-Forwarded-For - not supported by express as of version 5.1.0)
   *
   * @param request {Request} - The Express request object.
   *
   * @returns {void}
   */
  forwardedHeader(request) {
    if (request.headers.forwarded && request.ip === request.socket?.remoteAddress) {
      throw new ValidationError(
        "ERR_ERL_FORWARDED_HEADER",
        `The 'Forwarded' header (standardized X-Forwarded-For) is set but currently being ignored. Add a custom keyGenerator to use a value from this header.`
      );
    }
  },
  /**
   * Ensures totalHits value from store is a positive integer.
   *
   * @param hits {any} - The `totalHits` returned by the store.
   */
  positiveHits(hits) {
    if (typeof hits !== "number" || hits < 1 || hits !== Math.round(hits)) {
      throw new ValidationError(
        "ERR_ERL_INVALID_HITS",
        `The totalHits value returned from the store must be a positive integer, got ${hits}`
      );
    }
  },
  /**
   * Ensures a single store instance is not used with multiple express-rate-limit instances
   */
  unsharedStore(store) {
    if (usedStores.has(store)) {
      const maybeUniquePrefix = store?.localKeys ? "" : " (with a unique prefix)";
      throw new ValidationError(
        "ERR_ERL_STORE_REUSE",
        `A Store instance must not be shared across multiple rate limiters. Create a new instance of ${store.constructor.name}${maybeUniquePrefix} for each limiter instead.`
      );
    }
    usedStores.add(store);
  },
  /**
   * Ensures a given key is incremented only once per request.
   *
   * @param request {Request} - The Express request object.
   * @param store {Store} - The store class.
   * @param key {string} - The key used to store the client's hit count.
   *
   * @returns {void}
   */
  singleCount(request, store, key) {
    let storeKeys = singleCountKeys.get(request);
    if (!storeKeys) {
      storeKeys = /* @__PURE__ */ new Map();
      singleCountKeys.set(request, storeKeys);
    }
    const storeKey = store.localKeys ? store : store.constructor.name;
    let keys = storeKeys.get(storeKey);
    if (!keys) {
      keys = [];
      storeKeys.set(storeKey, keys);
    }
    const prefixedKey = `${store.prefix ?? ""}${key}`;
    if (keys.includes(prefixedKey)) {
      throw new ValidationError(
        "ERR_ERL_DOUBLE_COUNT",
        `The hit count for ${key} was incremented more than once for a single request.`
      );
    }
    keys.push(prefixedKey);
  },
  /**
   * Warns the user that the behaviour for `max: 0` / `limit: 0` is
   * changing in the next major release.
   *
   * @param limit {number} - The maximum number of hits per client.
   *
   * @returns {void}
   */
  limit(limit) {
    if (limit === 0) {
      throw new ChangeWarning(
        "WRN_ERL_MAX_ZERO",
        "Setting limit or max to 0 disables rate limiting in express-rate-limit v6 and older, but will cause all requests to be blocked in v7"
      );
    }
  },
  /**
   * Warns the user that the `draft_polli_ratelimit_headers` option is deprecated
   * and will be removed in the next major release.
   *
   * @param draft_polli_ratelimit_headers {any | undefined} - The now-deprecated setting that was used to enable standard headers.
   *
   * @returns {void}
   */
  draftPolliHeaders(draft_polli_ratelimit_headers) {
    if (draft_polli_ratelimit_headers) {
      throw new ChangeWarning(
        "WRN_ERL_DEPRECATED_DRAFT_POLLI_HEADERS",
        `The draft_polli_ratelimit_headers configuration option is deprecated and has been removed in express-rate-limit v7, please set standardHeaders: 'draft-6' instead.`
      );
    }
  },
  /**
   * Warns the user that the `onLimitReached` option is deprecated and
   * will be removed in the next major release.
   *
   * @param onLimitReached {any | undefined} - The maximum number of hits per client.
   *
   * @returns {void}
   */
  onLimitReached(onLimitReached) {
    if (onLimitReached) {
      throw new ChangeWarning(
        "WRN_ERL_DEPRECATED_ON_LIMIT_REACHED",
        "The onLimitReached configuration option is deprecated and has been removed in express-rate-limit v7."
      );
    }
  },
  /**
   * Warns the user when an invalid/unsupported version of the draft spec is passed.
   *
   * @param version {any | undefined} - The version passed by the user.
   *
   * @returns {void}
   */
  headersDraftVersion(version) {
    if (typeof version !== "string" || // @ts-expect-error This is fine. If version is not in the array, it will just return false.
    !SUPPORTED_DRAFT_VERSIONS.includes(version)) {
      const versionString = SUPPORTED_DRAFT_VERSIONS.join(", ");
      throw new ValidationError(
        "ERR_ERL_HEADERS_UNSUPPORTED_DRAFT_VERSION",
        `standardHeaders: only the following versions of the IETF draft specification are supported: ${versionString}.`
      );
    }
  },
  /**
   * Warns the user when the selected headers option requires a reset time but
   * the store does not provide one.
   *
   * @param resetTime {Date | undefined} - The timestamp when the client's hit count will be reset.
   *
   * @returns {void}
   */
  headersResetTime(resetTime) {
    if (!resetTime) {
      throw new ValidationError(
        "ERR_ERL_HEADERS_NO_RESET",
        `standardHeaders:  'draft-7' requires a 'resetTime', but the store did not provide one. The 'windowMs' value will be used instead, which may cause clients to wait longer than necessary.`
      );
    }
  },
  knownOptions(passedOptions) {
    if (!passedOptions) return;
    const optionsMap = {
      windowMs: true,
      limit: true,
      message: true,
      statusCode: true,
      legacyHeaders: true,
      standardHeaders: true,
      identifier: true,
      requestPropertyName: true,
      skipFailedRequests: true,
      skipSuccessfulRequests: true,
      keyGenerator: true,
      ipv6Subnet: true,
      handler: true,
      skip: true,
      requestWasSuccessful: true,
      store: true,
      validate: true,
      headers: true,
      max: true,
      passOnStoreError: true,
      logger: true
    };
    const validOptions = Object.keys(optionsMap).concat(
      "draft_polli_ratelimit_headers",
      // not a valid option anymore, but we have a more specific check for this one, so don't warn for it here
      // from express-slow-down - https://github.com/express-rate-limit/express-slow-down/blob/main/source/types.ts#L65
      "delayAfter",
      "delayMs",
      "maxDelayMs"
    );
    for (const key of Object.keys(passedOptions)) {
      if (!validOptions.includes(key)) {
        throw new ValidationError(
          "ERR_ERL_UNKNOWN_OPTION",
          `Unexpected configuration option: ${key}`
          // todo: suggest a valid option with a short levenstein distance?
        );
      }
    }
  },
  /**
   * Checks the options.validate setting to ensure that only recognized
   * validations are enabled or disabled.
   *
   * If any unrecognized values are found, an error is logged that
   * includes the list of supported validations.
   */
  validationsConfig() {
    const supportedValidations = Object.keys(this).filter(
      (k) => !["enabled", "disable"].includes(k)
    );
    supportedValidations.push("default");
    for (const key of Object.keys(this.enabled)) {
      if (!supportedValidations.includes(key)) {
        throw new ValidationError(
          "ERR_ERL_UNKNOWN_VALIDATION",
          `options.validate.${key} is not recognized. Supported validate options are: ${supportedValidations.join(
            ", "
          )}.`
        );
      }
    }
  },
  /**
   * Checks to see if the instance was created inside of a request handler,
   * which would prevent it from working correctly, with the default memory
   * store (or any other store with localKeys.)
   */
  creationStack(store) {
    const { stack: stack2 } = new Error(
      "express-rate-limit validation check (set options.validate.creationStack=false to disable)"
    );
    if (stack2?.includes("Layer.handle [as handle_request]") || // express v4
    stack2?.includes("Layer.handleRequest")) {
      if (!store.localKeys) {
        throw new ValidationError(
          "ERR_ERL_CREATED_IN_REQUEST_HANDLER",
          "express-rate-limit instance should *usually* be created at app initialization, not when responding to a request."
        );
      }
      throw new ValidationError(
        "ERR_ERL_CREATED_IN_REQUEST_HANDLER",
        "express-rate-limit instance should be created at app initialization, not when responding to a request."
      );
    }
  },
  ipv6Subnet(ipv6Subnet) {
    if (ipv6Subnet === false) {
      return;
    }
    if (!Number.isInteger(ipv6Subnet) || ipv6Subnet < 32 || ipv6Subnet > 64) {
      throw new ValidationError(
        "ERR_ERL_IPV6_SUBNET",
        `Unexpected ipv6Subnet value: ${ipv6Subnet}. Expected an integer between 32 and 64 (usually 48-64).`
      );
    }
  },
  ipv6SubnetOrKeyGenerator(options) {
    if (options.ipv6Subnet !== void 0 && options.keyGenerator) {
      throw new ValidationError(
        "ERR_ERL_IPV6SUBNET_OR_KEYGENERATOR",
        `Incompatible options: the 'ipv6Subnet' option is ignored when a custom 'keyGenerator' function is also set.`
      );
    }
  },
  keyGeneratorIpFallback(keyGenerator) {
    if (!keyGenerator) {
      return;
    }
    const src = keyGenerator.toString();
    if ((src.includes("req.ip") || src.includes("request.ip")) && !src.includes("ipKeyGenerator")) {
      throw new ValidationError(
        "ERR_ERL_KEY_GEN_IPV6",
        "Custom keyGenerator appears to use request IP without calling the ipKeyGenerator helper function for IPv6 addresses. This could allow IPv6 users to bypass limits."
      );
    }
  },
  /**
   * Checks to see if the window duration is greater than 2^32 - 1. This is only
   * called by the default MemoryStore, since it uses Node's setInterval method.
   *
   * See https://nodejs.org/api/timers.html#setintervalcallback-delay-args.
   */
  windowMs(windowMs) {
    const SET_TIMEOUT_MAX = 2 ** 31 - 1;
    if (typeof windowMs !== "number" || Number.isNaN(windowMs) || windowMs < 1 || windowMs > SET_TIMEOUT_MAX) {
      throw new ValidationError(
        "ERR_ERL_WINDOW_MS",
        `Invalid windowMs value: ${windowMs}${typeof windowMs !== "number" ? ` (${typeof windowMs})` : ""}, must be a number between 1 and ${SET_TIMEOUT_MAX} when using the default MemoryStore`
      );
    }
  }
};
function validateLogger(logger2) {
  if (typeof logger2 !== "object" || typeof logger2.error !== "function" || typeof logger2.warn !== "function") {
    throw new TypeError(
      "Provided logger does not implement the Logger interface"
    );
  }
}
var getValidations = (_enabled, logger2) => {
  validateLogger(logger2);
  let enabled;
  if (typeof _enabled === "boolean") {
    enabled = {
      default: _enabled
    };
  } else {
    enabled = {
      default: true,
      ..._enabled
    };
  }
  const wrappedValidations = { enabled };
  for (const [name, validation] of Object.entries(validations)) {
    if (typeof validation === "function")
      wrappedValidations[name] = (...args2) => {
        if (!(enabled[name] ?? enabled.default)) {
          return;
        }
        try {
          ;
          validation.apply(
            wrappedValidations,
            args2
          );
        } catch (error) {
          if (error instanceof ChangeWarning) logger2.warn(error);
          else logger2.error(error);
        }
      };
  }
  return wrappedValidations;
};
var isLegacyStore = (store) => (
  // Check that `incr` exists but `increment` does not - store authors might want
  // to keep both around for backwards compatibility.
  typeof store.incr === "function" && typeof store.increment !== "function"
);
var promisifyStore = (passedStore) => {
  if (!isLegacyStore(passedStore)) {
    return passedStore;
  }
  const legacyStore = passedStore;
  class PromisifiedStore {
    async increment(key) {
      return new Promise((resolve2, reject) => {
        legacyStore.incr(
          key,
          (error, totalHits, resetTime) => {
            if (error) reject(error);
            resolve2({ totalHits, resetTime });
          }
        );
      });
    }
    async decrement(key) {
      return legacyStore.decrement(key);
    }
    async resetKey(key) {
      return legacyStore.resetKey(key);
    }
    /* istanbul ignore next */
    async resetAll() {
      if (typeof legacyStore.resetAll === "function")
        return legacyStore.resetAll();
    }
  }
  return new PromisifiedStore();
};
var getOptionsFromConfig = (config) => {
  const { validations: validations2, ...directlyPassableEntries } = config;
  return {
    ...directlyPassableEntries,
    validate: validations2.enabled
  };
};
var parseOptions = (passedOptions) => {
  const notUndefinedOptions = omitUndefinedProperties(passedOptions);
  const logger2 = passedOptions.logger ?? ConsoleLogger;
  const validations2 = getValidations(
    notUndefinedOptions?.validate ?? true,
    logger2
  );
  validations2.validationsConfig();
  validations2.knownOptions(passedOptions);
  validations2.draftPolliHeaders(
    // @ts-expect-error see the note above.
    notUndefinedOptions.draft_polli_ratelimit_headers
  );
  validations2.onLimitReached(notUndefinedOptions.onLimitReached);
  if (notUndefinedOptions.ipv6Subnet !== void 0 && typeof notUndefinedOptions.ipv6Subnet !== "function") {
    validations2.ipv6Subnet(notUndefinedOptions.ipv6Subnet);
  }
  validations2.keyGeneratorIpFallback(notUndefinedOptions.keyGenerator);
  validations2.ipv6SubnetOrKeyGenerator(notUndefinedOptions);
  let standardHeaders = notUndefinedOptions.standardHeaders ?? false;
  if (standardHeaders === true) standardHeaders = "draft-6";
  const config = {
    windowMs: 60 * 1e3,
    limit: passedOptions.max ?? 5,
    // `max` is deprecated, but support it anyways.
    message: "Too many requests, please try again later.",
    statusCode: 429,
    legacyHeaders: passedOptions.headers ?? true,
    identifier(request, _response) {
      let duration = "";
      const property = config.requestPropertyName;
      const { limit } = request[property];
      const seconds = config.windowMs / 1e3;
      const minutes = config.windowMs / (1e3 * 60);
      const hours = config.windowMs / (1e3 * 60 * 60);
      const days = config.windowMs / (1e3 * 60 * 60 * 24);
      if (seconds < 60) duration = `${seconds}sec`;
      else if (minutes < 60) duration = `${minutes}min`;
      else if (hours < 24) duration = `${hours}hr${hours > 1 ? "s" : ""}`;
      else duration = `${days}day${days > 1 ? "s" : ""}`;
      return `${limit}-in-${duration}`;
    },
    requestPropertyName: "rateLimit",
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
    requestWasSuccessful: (_request, response) => response.statusCode < 400,
    skip: (_request, _response) => false,
    async keyGenerator(request, response) {
      validations2.ip(request.ip);
      validations2.trustProxy(request);
      validations2.xForwardedForHeader(request);
      validations2.forwardedHeader(request);
      const ip = request.ip;
      let subnet = 56;
      if (isIPv62(ip)) {
        subnet = typeof config.ipv6Subnet === "function" ? await config.ipv6Subnet(request, response) : config.ipv6Subnet;
        if (typeof config.ipv6Subnet === "function")
          validations2.ipv6Subnet(subnet);
      }
      return ipKeyGenerator(ip, subnet);
    },
    ipv6Subnet: 56,
    async handler(request, response, _next, _optionsUsed) {
      response.status(config.statusCode);
      const message2 = typeof config.message === "function" ? await config.message(
        request,
        response
      ) : config.message;
      if (!response.writableEnded) response.send(message2);
    },
    passOnStoreError: false,
    // Allow the default options to be overridden by the passed options.
    ...notUndefinedOptions,
    // `standardHeaders` is resolved into a draft version above, use that.
    standardHeaders,
    // Note that this field is declared after the user's options are spread in,
    // so that this field doesn't get overridden with an un-promisified store!
    store: promisifyStore(
      notUndefinedOptions.store ?? new MemoryStore(validations2)
    ),
    // Print an error to the console if a few known misconfigurations are detected.
    validations: validations2,
    logger: logger2
  };
  if (typeof config.store.increment !== "function" || typeof config.store.decrement !== "function" || typeof config.store.resetKey !== "function" || config.store.resetAll !== void 0 && typeof config.store.resetAll !== "function" || config.store.init !== void 0 && typeof config.store.init !== "function") {
    throw new TypeError(
      "An invalid store was passed. Please ensure that the store is a class that implements the `Store` interface."
    );
  }
  return config;
};
var handleAsyncErrors = (fn2) => async (request, response, next) => {
  try {
    await Promise.resolve(fn2(request, response, next)).catch(next);
  } catch (error) {
    next(error);
  }
};
var rateLimit = (passedOptions) => {
  const config = parseOptions(passedOptions ?? {});
  const options = getOptionsFromConfig(config);
  config.validations.creationStack(config.store);
  config.validations.unsharedStore(config.store);
  if (typeof config.store.init === "function") {
    try {
      const storeInit = config.store.init(options);
      if (storeInit instanceof Promise) {
        storeInit.catch(
          (error) => config.logger.error(
            error,
            "express-rate-limit: async error during store initialization."
          )
        );
      }
    } catch (error) {
      config.logger.error(
        error,
        "express-rate-limit: error during store initialization."
      );
    }
  }
  const middleware = handleAsyncErrors(
    async (request, response, next) => {
      const closePromise = config.skipFailedRequests && new Promise((resolve2) => response.once("close", resolve2));
      const finishPromise = (config.skipFailedRequests || config.skipSuccessfulRequests) && new Promise((resolve2) => response.once("finish", resolve2));
      const errorPromise = config.skipFailedRequests && new Promise((resolve2) => response.once("error", resolve2));
      const skip = await config.skip(request, response);
      if (skip) {
        next();
        return;
      }
      const augmentedRequest = request;
      const key = await config.keyGenerator(request, response);
      let totalHits = 0;
      let resetTime;
      try {
        const incrementResult = await config.store.increment(key);
        totalHits = incrementResult.totalHits;
        resetTime = incrementResult.resetTime;
      } catch (error) {
        if (config.passOnStoreError) {
          config.logger.error(
            error,
            "express-rate-limit: error from store, allowing request without rate-limiting."
          );
          next();
          return;
        }
        throw error;
      }
      config.validations.positiveHits(totalHits);
      config.validations.singleCount(request, config.store, key);
      const retrieveLimit = typeof config.limit === "function" ? config.limit(request, response) : config.limit;
      const limit = await retrieveLimit;
      config.validations.limit(limit);
      const info = {
        limit,
        used: totalHits,
        remaining: Math.max(limit - totalHits, 0),
        resetTime,
        key
      };
      Object.defineProperty(info, "current", {
        configurable: false,
        enumerable: false,
        value: totalHits
      });
      augmentedRequest[config.requestPropertyName] = info;
      if (config.legacyHeaders && !response.headersSent) {
        setLegacyHeaders(response, info);
      }
      if (config.standardHeaders && !response.headersSent) {
        switch (config.standardHeaders) {
          case "draft-6": {
            setDraft6Headers(response, info, config.windowMs);
            break;
          }
          case "draft-7": {
            config.validations.headersResetTime(info.resetTime);
            setDraft7Headers(response, info, config.windowMs);
            break;
          }
          case "draft-8": {
            const retrieveName = typeof config.identifier === "function" ? config.identifier(request, response) : config.identifier;
            const name = await retrieveName;
            config.validations.headersResetTime(info.resetTime);
            setDraft8Headers(response, info, config.windowMs, name, key);
            break;
          }
          default: {
            config.validations.headersDraftVersion(config.standardHeaders);
            break;
          }
        }
      }
      if (config.skipFailedRequests || config.skipSuccessfulRequests) {
        let decremented = false;
        const decrementKey = async () => {
          if (!decremented) {
            await config.store.decrement(key);
            decremented = true;
          }
        };
        if (config.skipFailedRequests) {
          if (finishPromise) {
            void finishPromise.then(async () => {
              if (!await config.requestWasSuccessful(request, response))
                await decrementKey();
            });
          }
          if (closePromise) {
            void closePromise.then(async () => {
              if (!response.writableEnded) await decrementKey();
            });
          }
          if (errorPromise) {
            void errorPromise.then(async () => {
              await decrementKey();
            });
          }
        }
        if (config.skipSuccessfulRequests) {
          if (finishPromise) {
            void finishPromise.then(async () => {
              if (await config.requestWasSuccessful(request, response))
                await decrementKey();
            });
          }
        }
      }
      config.validations.disable();
      if (totalHits > limit) {
        if (config.legacyHeaders || config.standardHeaders) {
          setRetryAfterHeader(response, info, config.windowMs);
        }
        config.handler(request, response, next, options);
        return;
      }
      next();
    }
  );
  const getThrowFn = () => {
    throw new Error("The current store does not support the get/getKey method");
  };
  middleware.resetKey = config.store.resetKey.bind(config.store);
  middleware.getKey = typeof config.store.get === "function" ? config.store.get.bind(config.store) : getThrowFn;
  return middleware;
};
var rate_limit_default = rateLimit;

// src/middleware/security.ts
var standardCsrf = (0, import_csurf.default)({ cookie: { key: "_csrf", httpOnly: true, sameSite: "lax" } });
var csrfProtection = (req, res, next) => {
  if (env.NODE_ENV === "test") {
    next();
    return;
  }
  if (["GET", "HEAD", "OPTIONS", "TRACE"].includes(req.method)) {
    next();
    return;
  }
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const isValidOrigin = (originString) => {
    return originString === env.WEB_ORIGIN || originString === "http://localhost:5173" || /^https:\/\/vita-web.*\.vercel\.app$/.test(originString);
  };
  if (origin && isValidOrigin(origin)) {
    next();
    return;
  }
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      if (isValidOrigin(refererUrl.origin)) {
        next();
        return;
      }
    } catch {
    }
  }
  standardCsrf(req, res, next);
};
var rateLimiter = rate_limit_default({
  windowMs: 60 * 1e3,
  // 1 minute
  max: 100,
  // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test"
  // Do not rate limit during tests
});

// src/app.ts
function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    const forwardedProto = req.header("x-forwarded-proto");
    if (isProduction && forwardedProto === "http") {
      res.redirect(308, `https://${req.header("host") ?? env.WEB_ORIGIN}${req.originalUrl}`);
      return;
    }
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      crossOriginEmbedderPolicy: false,
      hsts: isProduction ? {
        maxAge: 15552e3,
        includeSubDomains: true
      } : false
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        const isAllowed = !origin || origin === env.WEB_ORIGIN || origin === "http://localhost:5173" || /^https:\/\/vita-web.*\.vercel\.app$/.test(origin);
        callback(null, isAllowed);
      },
      credentials: true
    })
  );
  app.use(rateLimiter);
  app.use(express.json());
  app.use(cookieParser());
  app.use(csrfProtection);
  app.use(httpLogger);
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/allowlist", allowlistRouter);
  app.use("/api/docs", docsRouter);
  app.use("/api/metrics", requireAuth, metrics_route_default);
  app.use("/api/profile", requireAuth, profile_route_default);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

// api/index.ts
initSentry();
var index_default = createApp();
export {
  index_default as default
};
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/lib/compat/callsite-tostring.js:
  (*!
   * depd
   * Copyright(c) 2014 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/lib/compat/event-listener-count.js:
  (*!
   * depd
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/lib/compat/index.js:
  (*!
   * depd
   * Copyright(c) 2014-2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

depd/index.js:
  (*!
   * depd
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

statuses/index.js:
  (*!
   * statuses
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

toidentifier/index.js:
  (*!
   * toidentifier
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

http-errors/index.js:
  (*!
   * http-errors
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

random-bytes/index.js:
  (*!
   * random-bytes
   * Copyright(c) 2016 Douglas Christopher Wilson
   * MIT Licensed
   *)

uid-safe/index.js:
  (*!
   * uid-safe
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)

csrf/index.js:
  (*!
   * csrf
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

csurf/index.js:
  (*!
   * csurf
   * Copyright(c) 2011 Sencha Inc.
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2014-2016 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
