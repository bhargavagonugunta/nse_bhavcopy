// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = import.meta.require;

// node_modules/ms/index.js
var require_ms = __commonJS((exports, module) => {
  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
  }
  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS((exports, module) => {
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require_ms();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0;i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self = debug;
        const curr = Number(new Date);
        const ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self, args);
        const logFn = self.log || createDebug.log;
        logFn.apply(self, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  module.exports = setup;
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS((exports, module) => {
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.destroy = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
    };
  })();
  exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    let m;
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  exports.log = console.debug || console.log || (() => {});
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem("debug", namespaces);
      } else {
        exports.storage.removeItem("debug");
      }
    } catch (error) {}
  }
  function load() {
    let r;
    try {
      r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
    } catch (error) {}
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {}
  }
  module.exports = require_common()(exports);
  var { formatters } = module.exports;
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
});

// ../../node_modules/supports-color/index.js
var exports_supports_color = {};
__export(exports_supports_color, {
  default: () => supports_color_default,
  createSupportsColor: () => createSupportsColor
});
import process2 from "process";
import os from "os";
import tty from "tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
  if (!("FORCE_COLOR" in env)) {
    return;
  }
  if (env.FORCE_COLOR === "true") {
    return 1;
  }
  if (env.FORCE_COLOR === "false") {
    return 0;
  }
  if (env.FORCE_COLOR.length === 0) {
    return 1;
  }
  const level = Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  if (![0, 1, 2, 3].includes(level)) {
    return;
  }
  return level;
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env))) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var env, flagForceColor, supportsColor, supports_color_default;
var init_supports_color = __esm(() => {
  ({ env } = process2);
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    flagForceColor = 0;
  } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    flagForceColor = 1;
  }
  supportsColor = {
    stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
    stderr: createSupportsColor({ isTTY: tty.isatty(2) })
  };
  supports_color_default = supportsColor;
});

// node_modules/debug/src/node.js
var require_node = __commonJS((exports, module) => {
  var tty2 = __require("tty");
  var util = __require("util");
  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  exports.colors = [6, 2, 3, 4, 5, 1];
  try {
    const supportsColor2 = (init_supports_color(), __toCommonJS(exports_supports_color));
    if (supportsColor2 && (supportsColor2.stderr || supportsColor2).level >= 2) {
      exports.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ];
    }
  } catch (error) {}
  exports.inspectOpts = Object.keys(process.env).filter((key) => {
    return /^debug_/i.test(key);
  }).reduce((obj, key) => {
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase();
    });
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
      val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
      val = false;
    } else if (val === "null") {
      val = null;
    } else {
      val = Number(val);
    }
    obj[prop] = val;
    return obj;
  }, {});
  function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty2.isatty(process.stderr.fd);
  }
  function formatArgs(args) {
    const { namespace: name, useColors: useColors2 } = this;
    if (useColors2) {
      const c = this.color;
      const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
      const prefix = `  ${colorCode};1m${name} \x1B[0m`;
      args[0] = prefix + args[0].split(`
`).join(`
` + prefix);
      args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
    } else {
      args[0] = getDate() + name + " " + args[0];
    }
  }
  function getDate() {
    if (exports.inspectOpts.hideDate) {
      return "";
    }
    return new Date().toISOString() + " ";
  }
  function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + `
`);
  }
  function save(namespaces) {
    if (namespaces) {
      process.env.DEBUG = namespaces;
    } else {
      delete process.env.DEBUG;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for (let i = 0;i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
  }
  module.exports = require_common()(exports);
  var { formatters } = module.exports;
  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split(`
`).map((str) => str.trim()).join(" ");
  };
  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
});

// node_modules/debug/src/index.js
var require_src = __commonJS((exports, module) => {
  if (typeof process === "undefined" || process.type === "renderer" || false || process.__nwjs) {
    module.exports = require_browser();
  } else {
    module.exports = require_node();
  }
});

// node_modules/arr-union/index.js
var require_arr_union = __commonJS((exports, module) => {
  module.exports = function union(init) {
    if (!Array.isArray(init)) {
      throw new TypeError("arr-union expects the first argument to be an array.");
    }
    var len = arguments.length;
    var i = 0;
    while (++i < len) {
      var arg = arguments[i];
      if (!arg)
        continue;
      if (!Array.isArray(arg)) {
        arg = [arg];
      }
      for (var j = 0;j < arg.length; j++) {
        var ele = arg[j];
        if (init.indexOf(ele) >= 0) {
          continue;
        }
        init.push(ele);
      }
    }
    return init;
  };
});

// node_modules/lazy-cache/index.js
var require_lazy_cache = __commonJS((exports, module) => {
  function lazyCache(fn) {
    var cache2 = {};
    var proxy = function(mod, name) {
      name = name || camelcase(mod);
      if (process.env.UNLAZY === "true" || process.env.UNLAZY === true || process.env.TRAVIS) {
        cache2[name] = fn(mod);
      }
      Object.defineProperty(proxy, name, {
        enumerable: true,
        configurable: true,
        get: getter
      });
      function getter() {
        if (cache2.hasOwnProperty(name)) {
          return cache2[name];
        }
        return cache2[name] = fn(mod);
      }
      return getter;
    };
    return proxy;
  }
  function camelcase(str) {
    if (str.length === 1) {
      return str.toLowerCase();
    }
    str = str.replace(/^[\W_]+|[\W_]+$/g, "").toLowerCase();
    return str.replace(/[\W_]+(\w|$)/g, function(_, ch) {
      return ch.toUpperCase();
    });
  }
  module.exports = lazyCache;
});

// node_modules/for-in/index.js
var require_for_in = __commonJS((exports, module) => {
  /*!
   * for-in <https://github.com/jonschlinkert/for-in>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  module.exports = function forIn(obj, fn, thisArg) {
    for (var key in obj) {
      if (fn.call(thisArg, obj[key], key, obj) === false) {
        break;
      }
    }
  };
});

// node_modules/for-own/index.js
var require_for_own = __commonJS((exports, module) => {
  /*!
   * for-own <https://github.com/jonschlinkert/for-own>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  var forIn = require_for_in();
  var hasOwn = Object.prototype.hasOwnProperty;
  module.exports = function forOwn(obj, fn, thisArg) {
    forIn(obj, function(val, key) {
      if (hasOwn.call(obj, key)) {
        return fn.call(thisArg, obj[key], key, obj);
      }
    });
  };
});

// node_modules/clone-deep/utils.js
var require_utils = __commonJS((exports, module) => {
  var utils = require_lazy_cache()(__require);
  var fn = __require;
  __require = utils;
  __require("is-plain-object", "isObject");
  __require("shallow-clone", "clone");
  __require("kind-of", "typeOf");
  require_for_own();
  __require = fn;
  module.exports = utils;
});

// node_modules/clone-deep/index.js
var require_clone_deep = __commonJS((exports, module) => {
  var utils = require_utils();
  function cloneDeep(val, instanceClone) {
    switch (utils.typeOf(val)) {
      case "object":
        return cloneObjectDeep(val, instanceClone);
      case "array":
        return cloneArrayDeep(val, instanceClone);
      default:
        return utils.clone(val);
    }
  }
  function cloneObjectDeep(obj, instanceClone) {
    if (utils.isObject(obj)) {
      var res = {};
      utils.forOwn(obj, function(obj2, key) {
        this[key] = cloneDeep(obj2, instanceClone);
      }, res);
      return res;
    } else if (instanceClone) {
      return instanceClone(obj);
    } else {
      return obj;
    }
  }
  function cloneArrayDeep(arr, instanceClone) {
    var len = arr.length, res = [];
    var i = -1;
    while (++i < len) {
      res[i] = cloneDeep(arr[i], instanceClone);
    }
    return res;
  }
  module.exports = cloneDeep;
});

// node_modules/is-buffer/index.js
var require_is_buffer = __commonJS((exports, module) => {
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  module.exports = function(obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
  };
  function isBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
  }
  function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
  }
});

// node_modules/kind-of/index.js
var require_kind_of = __commonJS((exports, module) => {
  var isBuffer = require_is_buffer();
  var toString = Object.prototype.toString;
  module.exports = function kindOf(val) {
    if (typeof val === "undefined") {
      return "undefined";
    }
    if (val === null) {
      return "null";
    }
    if (val === true || val === false || val instanceof Boolean) {
      return "boolean";
    }
    if (typeof val === "string" || val instanceof String) {
      return "string";
    }
    if (typeof val === "number" || val instanceof Number) {
      return "number";
    }
    if (typeof val === "function" || val instanceof Function) {
      return "function";
    }
    if (typeof Array.isArray !== "undefined" && Array.isArray(val)) {
      return "array";
    }
    if (val instanceof RegExp) {
      return "regexp";
    }
    if (val instanceof Date) {
      return "date";
    }
    var type = toString.call(val);
    if (type === "[object RegExp]") {
      return "regexp";
    }
    if (type === "[object Date]") {
      return "date";
    }
    if (type === "[object Arguments]") {
      return "arguments";
    }
    if (type === "[object Error]") {
      return "error";
    }
    if (isBuffer(val)) {
      return "buffer";
    }
    if (type === "[object Set]") {
      return "set";
    }
    if (type === "[object WeakSet]") {
      return "weakset";
    }
    if (type === "[object Map]") {
      return "map";
    }
    if (type === "[object WeakMap]") {
      return "weakmap";
    }
    if (type === "[object Symbol]") {
      return "symbol";
    }
    if (type === "[object Int8Array]") {
      return "int8array";
    }
    if (type === "[object Uint8Array]") {
      return "uint8array";
    }
    if (type === "[object Uint8ClampedArray]") {
      return "uint8clampedarray";
    }
    if (type === "[object Int16Array]") {
      return "int16array";
    }
    if (type === "[object Uint16Array]") {
      return "uint16array";
    }
    if (type === "[object Int32Array]") {
      return "int32array";
    }
    if (type === "[object Uint32Array]") {
      return "uint32array";
    }
    if (type === "[object Float32Array]") {
      return "float32array";
    }
    if (type === "[object Float64Array]") {
      return "float64array";
    }
    return "object";
  };
});

// node_modules/merge-deep/index.js
var require_merge_deep = __commonJS((exports, module) => {
  /*!
   * merge-deep <https://github.com/jonschlinkert/merge-deep>
   *
   * Copyright (c) 2014-2015, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  var union = require_arr_union();
  var clone = require_clone_deep();
  var typeOf = require_kind_of();
  module.exports = function mergeDeep(orig, objects) {
    if (!isObject(orig) && !Array.isArray(orig)) {
      orig = {};
    }
    var target = clone(orig);
    var len = arguments.length;
    var idx = 0;
    while (++idx < len) {
      var val = arguments[idx];
      if (isObject(val) || Array.isArray(val)) {
        merge(target, val);
      }
    }
    return target;
  };
  function merge(target, obj) {
    for (var key in obj) {
      if (!isValidKey(key) || !hasOwn(obj, key)) {
        continue;
      }
      var oldVal = obj[key];
      var newVal = target[key];
      if (isObject(newVal) && isObject(oldVal)) {
        target[key] = merge(newVal, oldVal);
      } else if (Array.isArray(newVal)) {
        target[key] = union([], newVal, oldVal);
      } else {
        target[key] = clone(oldVal);
      }
    }
    return target;
  }
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function isObject(val) {
    return typeOf(val) === "object" || typeOf(val) === "function";
  }
  function isValidKey(key) {
    return key !== "__proto__" && key !== "constructor" && key !== "prototype";
  }
});

// node_modules/puppeteer-extra-plugin/dist/index.cjs.js
var require_index_cjs = __commonJS((exports) => {
  /*!
   * puppeteer-extra-plugin v3.2.2 by berstend
   * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin
   * @license MIT
   */
  Object.defineProperty(exports, "__esModule", { value: true });
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var debug2 = _interopDefault(require_src());
  var merge = require_merge_deep();

  class PuppeteerExtraPlugin {
    constructor(opts) {
      this._debugBase = debug2(`puppeteer-extra-plugin:base:${this.name}`);
      this._childClassMembers = [];
      this._opts = merge(this.defaults, opts || {});
      this._debugBase("Initialized.");
    }
    get name() {
      throw new Error('Plugin must override "name"');
    }
    get defaults() {
      return {};
    }
    get requirements() {
      return new Set([]);
    }
    get dependencies() {
      return new Set([]);
    }
    get data() {
      return [];
    }
    get opts() {
      return this._opts;
    }
    get debug() {
      return debug2(`puppeteer-extra-plugin:${this.name}`);
    }
    async beforeLaunch(options) {}
    async afterLaunch(browser, opts = { options: {} }) {}
    async beforeConnect(options) {}
    async afterConnect(browser, opts = {}) {}
    async onBrowser(browser, opts) {}
    async onTargetCreated(target) {}
    async onPageCreated(page) {}
    async onTargetChanged(target) {}
    async onTargetDestroyed(target) {}
    async onDisconnected() {}
    async onClose() {}
    async onPluginRegistered() {}
    getDataFromPlugins(name) {
      return [];
    }
    _getMissingDependencies(plugins) {
      const pluginNames = new Set(plugins.map((p) => p.name));
      const missing = new Set(Array.from(this.dependencies.values()).filter((x) => !pluginNames.has(x)));
      return missing;
    }
    async _bindBrowserEvents(browser, opts = {}) {
      if (this._hasChildClassMember("onTargetCreated") || this._hasChildClassMember("onPageCreated")) {
        browser.on("targetcreated", this._onTargetCreated.bind(this));
      }
      if (this._hasChildClassMember("onTargetChanged") && this.onTargetChanged) {
        browser.on("targetchanged", this.onTargetChanged.bind(this));
      }
      if (this._hasChildClassMember("onTargetDestroyed") && this.onTargetDestroyed) {
        browser.on("targetdestroyed", this.onTargetDestroyed.bind(this));
      }
      if (this._hasChildClassMember("onDisconnected") && this.onDisconnected) {
        browser.on("disconnected", this.onDisconnected.bind(this));
      }
      if (opts.context === "launch" && this._hasChildClassMember("onClose")) {
        if (this.onClose) {
          process.on("exit", this.onClose.bind(this));
          browser.on("disconnected", this.onClose.bind(this));
          if (opts.options.handleSIGINT !== false) {
            process.on("SIGINT", this.onClose.bind(this));
          }
          if (opts.options.handleSIGTERM !== false) {
            process.on("SIGTERM", this.onClose.bind(this));
          }
          if (opts.options.handleSIGHUP !== false) {
            process.on("SIGHUP", this.onClose.bind(this));
          }
        }
      }
      if (opts.context === "launch" && this.afterLaunch) {
        await this.afterLaunch(browser, opts);
      }
      if (opts.context === "connect" && this.afterConnect) {
        await this.afterConnect(browser, opts);
      }
      if (this.onBrowser)
        await this.onBrowser(browser, opts);
    }
    async _onTargetCreated(target) {
      if (this.onTargetCreated)
        await this.onTargetCreated(target);
      if (target.type() === "page") {
        try {
          const page = await target.page();
          if (!page) {
            return;
          }
          const validPage = "isClosed" in page && !page.isClosed();
          if (this.onPageCreated && validPage) {
            await this.onPageCreated(page);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    _register(prototype) {
      this._registerChildClassMembers(prototype);
      if (this.onPluginRegistered)
        this.onPluginRegistered();
    }
    _registerChildClassMembers(prototype) {
      this._childClassMembers = Object.getOwnPropertyNames(prototype);
    }
    _hasChildClassMember(name) {
      return !!this._childClassMembers.includes(name);
    }
    get _isPuppeteerExtraPlugin() {
      return true;
    }
  }
  exports.PuppeteerExtraPlugin = PuppeteerExtraPlugin;
});

// node_modules/puppeteer-extra-plugin-stealth/index.js
var require_puppeteer_extra_plugin_stealth = __commonJS((exports, module) => {
  var { PuppeteerExtraPlugin } = require_index_cjs();

  class StealthPlugin extends PuppeteerExtraPlugin {
    constructor(opts = {}) {
      super(opts);
    }
    get name() {
      return "stealth";
    }
    get defaults() {
      const availableEvasions = new Set([
        "chrome.app",
        "chrome.csi",
        "chrome.loadTimes",
        "chrome.runtime",
        "defaultArgs",
        "iframe.contentWindow",
        "media.codecs",
        "navigator.hardwareConcurrency",
        "navigator.languages",
        "navigator.permissions",
        "navigator.plugins",
        "navigator.webdriver",
        "sourceurl",
        "user-agent-override",
        "webgl.vendor",
        "window.outerdimensions"
      ]);
      return {
        availableEvasions,
        enabledEvasions: new Set([...availableEvasions])
      };
    }
    get dependencies() {
      return new Set([...this.opts.enabledEvasions].map((e) => `${this.name}/evasions/${e}`));
    }
    get availableEvasions() {
      return this.defaults.availableEvasions;
    }
    get enabledEvasions() {
      return this.opts.enabledEvasions;
    }
    set enabledEvasions(evasions) {
      this.opts.enabledEvasions = evasions;
    }
    async onBrowser(browser) {
      if (browser && browser.setMaxListeners) {
        browser.setMaxListeners(30);
      }
    }
  }
  var defaultExport = (opts) => new StealthPlugin(opts);
  module.exports = defaultExport;
});

// node_modules/adm-zip/util/constants.js
var require_constants = __commonJS((exports, module) => {
  module.exports = {
    LOCHDR: 30,
    LOCSIG: 67324752,
    LOCVER: 4,
    LOCFLG: 6,
    LOCHOW: 8,
    LOCTIM: 10,
    LOCCRC: 14,
    LOCSIZ: 18,
    LOCLEN: 22,
    LOCNAM: 26,
    LOCEXT: 28,
    EXTSIG: 134695760,
    EXTHDR: 16,
    EXTCRC: 4,
    EXTSIZ: 8,
    EXTLEN: 12,
    CENHDR: 46,
    CENSIG: 33639248,
    CENVEM: 4,
    CENVER: 6,
    CENFLG: 8,
    CENHOW: 10,
    CENTIM: 12,
    CENCRC: 16,
    CENSIZ: 20,
    CENLEN: 24,
    CENNAM: 28,
    CENEXT: 30,
    CENCOM: 32,
    CENDSK: 34,
    CENATT: 36,
    CENATX: 38,
    CENOFF: 42,
    ENDHDR: 22,
    ENDSIG: 101010256,
    ENDSUB: 8,
    ENDTOT: 10,
    ENDSIZ: 12,
    ENDOFF: 16,
    ENDCOM: 20,
    END64HDR: 20,
    END64SIG: 117853008,
    END64START: 4,
    END64OFF: 8,
    END64NUMDISKS: 16,
    ZIP64SIG: 101075792,
    ZIP64HDR: 56,
    ZIP64LEAD: 12,
    ZIP64SIZE: 4,
    ZIP64VEM: 12,
    ZIP64VER: 14,
    ZIP64DSK: 16,
    ZIP64DSKDIR: 20,
    ZIP64SUB: 24,
    ZIP64TOT: 32,
    ZIP64SIZB: 40,
    ZIP64OFF: 48,
    ZIP64EXTRA: 56,
    STORED: 0,
    SHRUNK: 1,
    REDUCED1: 2,
    REDUCED2: 3,
    REDUCED3: 4,
    REDUCED4: 5,
    IMPLODED: 6,
    DEFLATED: 8,
    ENHANCED_DEFLATED: 9,
    PKWARE: 10,
    BZIP2: 12,
    LZMA: 14,
    IBM_TERSE: 18,
    IBM_LZ77: 19,
    AES_ENCRYPT: 99,
    FLG_ENC: 1,
    FLG_COMP1: 2,
    FLG_COMP2: 4,
    FLG_DESC: 8,
    FLG_ENH: 16,
    FLG_PATCH: 32,
    FLG_STR: 64,
    FLG_EFS: 2048,
    FLG_MSK: 4096,
    FILE: 2,
    BUFFER: 1,
    NONE: 0,
    EF_ID: 0,
    EF_SIZE: 2,
    ID_ZIP64: 1,
    ID_AVINFO: 7,
    ID_PFS: 8,
    ID_OS2: 9,
    ID_NTFS: 10,
    ID_OPENVMS: 12,
    ID_UNIX: 13,
    ID_FORK: 14,
    ID_PATCH: 15,
    ID_X509_PKCS7: 20,
    ID_X509_CERTID_F: 21,
    ID_X509_CERTID_C: 22,
    ID_STRONGENC: 23,
    ID_RECORD_MGT: 24,
    ID_X509_PKCS7_RL: 25,
    ID_IBM1: 101,
    ID_IBM2: 102,
    ID_POSZIP: 18064,
    EF_ZIP64_OR_32: 4294967295,
    EF_ZIP64_OR_16: 65535,
    EF_ZIP64_SUNCOMP: 0,
    EF_ZIP64_SCOMP: 8,
    EF_ZIP64_RHO: 16,
    EF_ZIP64_DSN: 24
  };
});

// node_modules/adm-zip/util/errors.js
var require_errors = __commonJS((exports) => {
  var errors2 = {
    INVALID_LOC: "Invalid LOC header (bad signature)",
    INVALID_CEN: "Invalid CEN header (bad signature)",
    INVALID_END: "Invalid END header (bad signature)",
    DESCRIPTOR_NOT_EXIST: "No descriptor present",
    DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
    DESCRIPTOR_FAULTY: "Descriptor data is malformed",
    NO_DATA: "Nothing to decompress",
    BAD_CRC: "CRC32 checksum failed {0}",
    FILE_IN_THE_WAY: "There is a file in the way: {0}",
    UNKNOWN_METHOD: "Invalid/unsupported compression method",
    AVAIL_DATA: "inflate::Available inflate data did not terminate",
    INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
    TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
    INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
    INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
    INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
    INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
    INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
    INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
    INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
    CANT_EXTRACT_FILE: "Could not extract the file",
    CANT_OVERRIDE: "Target file already exists",
    DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
    NO_ZIP: "No zip file was loaded",
    NO_ENTRY: "Entry doesn't exist",
    DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
    FILE_NOT_FOUND: 'File not found: "{0}"',
    NOT_IMPLEMENTED: "Not implemented",
    INVALID_FILENAME: "Invalid filename",
    INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
    INVALID_PASS_PARAM: "Incompatible password parameter",
    WRONG_PASSWORD: "Wrong Password",
    COMMENT_TOO_LONG: "Comment is too long",
    EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
  };
  function E(message) {
    return function(...args) {
      if (args.length) {
        message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "");
      }
      return new Error("ADM-ZIP: " + message);
    };
  }
  for (const msg of Object.keys(errors2)) {
    exports[msg] = E(errors2[msg]);
  }
});

// node_modules/adm-zip/util/utils.js
var require_utils2 = __commonJS((exports, module) => {
  var fsystem = __require("fs");
  var pth = __require("path");
  var Constants = require_constants();
  var Errors = require_errors();
  var isWin = typeof process === "object" && process.platform === "win32";
  var is_Obj = (obj) => typeof obj === "object" && obj !== null;
  var crcTable = new Uint32Array(256).map((t, c) => {
    for (let k = 0;k < 8; k++) {
      if ((c & 1) !== 0) {
        c = 3988292384 ^ c >>> 1;
      } else {
        c >>>= 1;
      }
    }
    return c >>> 0;
  });
  function Utils(opts) {
    this.sep = pth.sep;
    this.fs = fsystem;
    if (is_Obj(opts)) {
      if (is_Obj(opts.fs) && typeof opts.fs.statSync === "function") {
        this.fs = opts.fs;
      }
    }
  }
  module.exports = Utils;
  Utils.prototype.makeDir = function(folder) {
    const self = this;
    function mkdirSync(fpath) {
      let resolvedPath = fpath.split(self.sep)[0];
      fpath.split(self.sep).forEach(function(name) {
        if (!name || name.substr(-1, 1) === ":")
          return;
        resolvedPath += self.sep + name;
        var stat;
        try {
          stat = self.fs.statSync(resolvedPath);
        } catch (e) {
          self.fs.mkdirSync(resolvedPath);
        }
        if (stat && stat.isFile())
          throw Errors.FILE_IN_THE_WAY(`"${resolvedPath}"`);
      });
    }
    mkdirSync(folder);
  };
  Utils.prototype.writeFileTo = function(path, content, overwrite, attr) {
    const self = this;
    if (self.fs.existsSync(path)) {
      if (!overwrite)
        return false;
      var stat = self.fs.statSync(path);
      if (stat.isDirectory()) {
        return false;
      }
    }
    var folder = pth.dirname(path);
    if (!self.fs.existsSync(folder)) {
      self.makeDir(folder);
    }
    var fd;
    try {
      fd = self.fs.openSync(path, "w", 438);
    } catch (e) {
      self.fs.chmodSync(path, 438);
      fd = self.fs.openSync(path, "w", 438);
    }
    if (fd) {
      try {
        self.fs.writeSync(fd, content, 0, content.length, 0);
      } finally {
        self.fs.closeSync(fd);
      }
    }
    self.fs.chmodSync(path, attr || 438);
    return true;
  };
  Utils.prototype.writeFileToAsync = function(path, content, overwrite, attr, callback) {
    if (typeof attr === "function") {
      callback = attr;
      attr = undefined;
    }
    const self = this;
    self.fs.exists(path, function(exist) {
      if (exist && !overwrite)
        return callback(false);
      self.fs.stat(path, function(err, stat) {
        if (exist && stat.isDirectory()) {
          return callback(false);
        }
        var folder = pth.dirname(path);
        self.fs.exists(folder, function(exists) {
          if (!exists)
            self.makeDir(folder);
          self.fs.open(path, "w", 438, function(err2, fd) {
            if (err2) {
              self.fs.chmod(path, 438, function() {
                self.fs.open(path, "w", 438, function(err3, fd2) {
                  self.fs.write(fd2, content, 0, content.length, 0, function() {
                    self.fs.close(fd2, function() {
                      self.fs.chmod(path, attr || 438, function() {
                        callback(true);
                      });
                    });
                  });
                });
              });
            } else if (fd) {
              self.fs.write(fd, content, 0, content.length, 0, function() {
                self.fs.close(fd, function() {
                  self.fs.chmod(path, attr || 438, function() {
                    callback(true);
                  });
                });
              });
            } else {
              self.fs.chmod(path, attr || 438, function() {
                callback(true);
              });
            }
          });
        });
      });
    });
  };
  Utils.prototype.findFiles = function(path) {
    const self = this;
    function findSync(dir, pattern, recursive) {
      if (typeof pattern === "boolean") {
        recursive = pattern;
        pattern = undefined;
      }
      let files = [];
      self.fs.readdirSync(dir).forEach(function(file) {
        const path2 = pth.join(dir, file);
        const stat = self.fs.statSync(path2);
        if (!pattern || pattern.test(path2)) {
          files.push(pth.normalize(path2) + (stat.isDirectory() ? self.sep : ""));
        }
        if (stat.isDirectory() && recursive)
          files = files.concat(findSync(path2, pattern, recursive));
      });
      return files;
    }
    return findSync(path, undefined, true);
  };
  Utils.prototype.findFilesAsync = function(dir, cb) {
    const self = this;
    let results = [];
    self.fs.readdir(dir, function(err, list) {
      if (err)
        return cb(err);
      let list_length = list.length;
      if (!list_length)
        return cb(null, results);
      list.forEach(function(file) {
        file = pth.join(dir, file);
        self.fs.stat(file, function(err2, stat) {
          if (err2)
            return cb(err2);
          if (stat) {
            results.push(pth.normalize(file) + (stat.isDirectory() ? self.sep : ""));
            if (stat.isDirectory()) {
              self.findFilesAsync(file, function(err3, res) {
                if (err3)
                  return cb(err3);
                results = results.concat(res);
                if (!--list_length)
                  cb(null, results);
              });
            } else {
              if (!--list_length)
                cb(null, results);
            }
          }
        });
      });
    });
  };
  Utils.prototype.getAttributes = function() {};
  Utils.prototype.setAttributes = function() {};
  Utils.crc32update = function(crc, byte) {
    return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
  };
  Utils.crc32 = function(buf) {
    if (typeof buf === "string") {
      buf = Buffer.from(buf, "utf8");
    }
    let len = buf.length;
    let crc = ~0;
    for (let off = 0;off < len; )
      crc = Utils.crc32update(crc, buf[off++]);
    return ~crc >>> 0;
  };
  Utils.methodToString = function(method) {
    switch (method) {
      case Constants.STORED:
        return "STORED (" + method + ")";
      case Constants.DEFLATED:
        return "DEFLATED (" + method + ")";
      default:
        return "UNSUPPORTED (" + method + ")";
    }
  };
  Utils.canonical = function(path) {
    if (!path)
      return "";
    const safeSuffix = pth.posix.normalize("/" + path.split("\\").join("/"));
    return pth.join(".", safeSuffix);
  };
  Utils.zipnamefix = function(path) {
    if (!path)
      return "";
    const safeSuffix = pth.posix.normalize("/" + path.split("\\").join("/"));
    return pth.posix.join(".", safeSuffix);
  };
  Utils.findLast = function(arr, callback) {
    if (!Array.isArray(arr))
      throw new TypeError("arr is not array");
    const len = arr.length >>> 0;
    for (let i = len - 1;i >= 0; i--) {
      if (callback(arr[i], i, arr)) {
        return arr[i];
      }
    }
    return;
  };
  Utils.sanitize = function(prefix, name) {
    prefix = pth.resolve(pth.normalize(prefix));
    var parts = name.split("/");
    for (var i = 0, l = parts.length;i < l; i++) {
      var path = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
      if (path.indexOf(prefix) === 0) {
        return path;
      }
    }
    return pth.normalize(pth.join(prefix, pth.basename(name)));
  };
  Utils.toBuffer = function toBuffer(input, encoder) {
    if (Buffer.isBuffer(input)) {
      return input;
    } else if (input instanceof Uint8Array) {
      return Buffer.from(input);
    } else {
      return typeof input === "string" ? encoder(input) : Buffer.alloc(0);
    }
  };
  Utils.readBigUInt64LE = function(buffer, index) {
    var slice = Buffer.from(buffer.slice(index, index + 8));
    slice.swap64();
    return parseInt(`0x${slice.toString("hex")}`);
  };
  Utils.fromDOS2Date = function(val) {
    return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
  };
  Utils.fromDate2DOS = function(val) {
    let date = 0;
    let time = 0;
    if (val.getFullYear() > 1979) {
      date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate();
      time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1;
    }
    return date << 16 | time;
  };
  Utils.isWin = isWin;
  Utils.crcTable = crcTable;
});

// node_modules/adm-zip/util/fattr.js
var require_fattr = __commonJS((exports, module) => {
  var pth = __require("path");
  module.exports = function(path, { fs }) {
    var _path = path || "", _obj = newAttr(), _stat = null;
    function newAttr() {
      return {
        directory: false,
        readonly: false,
        hidden: false,
        executable: false,
        mtime: 0,
        atime: 0
      };
    }
    if (_path && fs.existsSync(_path)) {
      _stat = fs.statSync(_path);
      _obj.directory = _stat.isDirectory();
      _obj.mtime = _stat.mtime;
      _obj.atime = _stat.atime;
      _obj.executable = (73 & _stat.mode) !== 0;
      _obj.readonly = (128 & _stat.mode) === 0;
      _obj.hidden = pth.basename(_path)[0] === ".";
    } else {
      console.warn("Invalid path: " + _path);
    }
    return {
      get directory() {
        return _obj.directory;
      },
      get readOnly() {
        return _obj.readonly;
      },
      get hidden() {
        return _obj.hidden;
      },
      get mtime() {
        return _obj.mtime;
      },
      get atime() {
        return _obj.atime;
      },
      get executable() {
        return _obj.executable;
      },
      decodeAttributes: function() {},
      encodeAttributes: function() {},
      toJSON: function() {
        return {
          path: _path,
          isDirectory: _obj.directory,
          isReadOnly: _obj.readonly,
          isHidden: _obj.hidden,
          isExecutable: _obj.executable,
          mTime: _obj.mtime,
          aTime: _obj.atime
        };
      },
      toString: function() {
        return JSON.stringify(this.toJSON(), null, "\t");
      }
    };
  };
});

// node_modules/adm-zip/util/decoder.js
var require_decoder = __commonJS((exports, module) => {
  module.exports = {
    efs: true,
    encode: (data) => Buffer.from(data, "utf8"),
    decode: (data) => data.toString("utf8")
  };
});

// node_modules/adm-zip/util/index.js
var require_util = __commonJS((exports, module) => {
  module.exports = require_utils2();
  module.exports.Constants = require_constants();
  module.exports.Errors = require_errors();
  module.exports.FileAttr = require_fattr();
  module.exports.decoder = require_decoder();
});

// node_modules/adm-zip/headers/entryHeader.js
var require_entryHeader = __commonJS((exports, module) => {
  var Utils = require_util();
  var Constants = Utils.Constants;
  module.exports = function() {
    var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
    _verMade |= Utils.isWin ? 2560 : 768;
    _flags |= Constants.FLG_EFS;
    const _localHeader = {
      extraLen: 0
    };
    const uint32 = (val) => Math.max(0, val) >>> 0;
    const uint16 = (val) => Math.max(0, val) & 65535;
    const uint8 = (val) => Math.max(0, val) & 255;
    _time = Utils.fromDate2DOS(new Date);
    return {
      get made() {
        return _verMade;
      },
      set made(val) {
        _verMade = val;
      },
      get version() {
        return _version;
      },
      set version(val) {
        _version = val;
      },
      get flags() {
        return _flags;
      },
      set flags(val) {
        _flags = val;
      },
      get flags_efs() {
        return (_flags & Constants.FLG_EFS) > 0;
      },
      set flags_efs(val) {
        if (val) {
          _flags |= Constants.FLG_EFS;
        } else {
          _flags &= ~Constants.FLG_EFS;
        }
      },
      get flags_desc() {
        return (_flags & Constants.FLG_DESC) > 0;
      },
      set flags_desc(val) {
        if (val) {
          _flags |= Constants.FLG_DESC;
        } else {
          _flags &= ~Constants.FLG_DESC;
        }
      },
      get method() {
        return _method;
      },
      set method(val) {
        switch (val) {
          case Constants.STORED:
            this.version = 10;
          case Constants.DEFLATED:
          default:
            this.version = 20;
        }
        _method = val;
      },
      get time() {
        return Utils.fromDOS2Date(this.timeval);
      },
      set time(val) {
        this.timeval = Utils.fromDate2DOS(val);
      },
      get timeval() {
        return _time;
      },
      set timeval(val) {
        _time = uint32(val);
      },
      get timeHighByte() {
        return uint8(_time >>> 8);
      },
      get crc() {
        return _crc;
      },
      set crc(val) {
        _crc = uint32(val);
      },
      get compressedSize() {
        return _compressedSize;
      },
      set compressedSize(val) {
        _compressedSize = uint32(val);
      },
      get size() {
        return _size;
      },
      set size(val) {
        _size = uint32(val);
      },
      get fileNameLength() {
        return _fnameLen;
      },
      set fileNameLength(val) {
        _fnameLen = val;
      },
      get extraLength() {
        return _extraLen;
      },
      set extraLength(val) {
        _extraLen = val;
      },
      get extraLocalLength() {
        return _localHeader.extraLen;
      },
      set extraLocalLength(val) {
        _localHeader.extraLen = val;
      },
      get commentLength() {
        return _comLen;
      },
      set commentLength(val) {
        _comLen = val;
      },
      get diskNumStart() {
        return _diskStart;
      },
      set diskNumStart(val) {
        _diskStart = uint32(val);
      },
      get inAttr() {
        return _inattr;
      },
      set inAttr(val) {
        _inattr = uint32(val);
      },
      get attr() {
        return _attr;
      },
      set attr(val) {
        _attr = uint32(val);
      },
      get fileAttr() {
        return (_attr || 0) >> 16 & 4095;
      },
      get offset() {
        return _offset;
      },
      set offset(val) {
        _offset = uint32(val);
      },
      get encrypted() {
        return (_flags & Constants.FLG_ENC) === Constants.FLG_ENC;
      },
      get centralHeaderSize() {
        return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
      },
      get realDataOffset() {
        return _offset + Constants.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
      },
      get localHeader() {
        return _localHeader;
      },
      loadLocalHeaderFromBinary: function(input) {
        var data = input.slice(_offset, _offset + Constants.LOCHDR);
        if (data.readUInt32LE(0) !== Constants.LOCSIG) {
          throw Utils.Errors.INVALID_LOC();
        }
        _localHeader.version = data.readUInt16LE(Constants.LOCVER);
        _localHeader.flags = data.readUInt16LE(Constants.LOCFLG);
        _localHeader.method = data.readUInt16LE(Constants.LOCHOW);
        _localHeader.time = data.readUInt32LE(Constants.LOCTIM);
        _localHeader.crc = data.readUInt32LE(Constants.LOCCRC);
        _localHeader.compressedSize = data.readUInt32LE(Constants.LOCSIZ);
        _localHeader.size = data.readUInt32LE(Constants.LOCLEN);
        _localHeader.fnameLen = data.readUInt16LE(Constants.LOCNAM);
        _localHeader.extraLen = data.readUInt16LE(Constants.LOCEXT);
        const extraStart = _offset + Constants.LOCHDR + _localHeader.fnameLen;
        const extraEnd = extraStart + _localHeader.extraLen;
        return input.slice(extraStart, extraEnd);
      },
      loadFromBinary: function(data) {
        if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
          throw Utils.Errors.INVALID_CEN();
        }
        _verMade = data.readUInt16LE(Constants.CENVEM);
        _version = data.readUInt16LE(Constants.CENVER);
        _flags = data.readUInt16LE(Constants.CENFLG);
        _method = data.readUInt16LE(Constants.CENHOW);
        _time = data.readUInt32LE(Constants.CENTIM);
        _crc = data.readUInt32LE(Constants.CENCRC);
        _compressedSize = data.readUInt32LE(Constants.CENSIZ);
        _size = data.readUInt32LE(Constants.CENLEN);
        _fnameLen = data.readUInt16LE(Constants.CENNAM);
        _extraLen = data.readUInt16LE(Constants.CENEXT);
        _comLen = data.readUInt16LE(Constants.CENCOM);
        _diskStart = data.readUInt16LE(Constants.CENDSK);
        _inattr = data.readUInt16LE(Constants.CENATT);
        _attr = data.readUInt32LE(Constants.CENATX);
        _offset = data.readUInt32LE(Constants.CENOFF);
      },
      localHeaderToBinary: function() {
        var data = Buffer.alloc(Constants.LOCHDR);
        data.writeUInt32LE(Constants.LOCSIG, 0);
        data.writeUInt16LE(_version, Constants.LOCVER);
        data.writeUInt16LE(_flags, Constants.LOCFLG);
        data.writeUInt16LE(_method, Constants.LOCHOW);
        data.writeUInt32LE(_time, Constants.LOCTIM);
        data.writeUInt32LE(_crc, Constants.LOCCRC);
        data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
        data.writeUInt32LE(_size, Constants.LOCLEN);
        data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
        data.writeUInt16LE(_localHeader.extraLen, Constants.LOCEXT);
        return data;
      },
      centralHeaderToBinary: function() {
        var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
        data.writeUInt32LE(Constants.CENSIG, 0);
        data.writeUInt16LE(_verMade, Constants.CENVEM);
        data.writeUInt16LE(_version, Constants.CENVER);
        data.writeUInt16LE(_flags, Constants.CENFLG);
        data.writeUInt16LE(_method, Constants.CENHOW);
        data.writeUInt32LE(_time, Constants.CENTIM);
        data.writeUInt32LE(_crc, Constants.CENCRC);
        data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
        data.writeUInt32LE(_size, Constants.CENLEN);
        data.writeUInt16LE(_fnameLen, Constants.CENNAM);
        data.writeUInt16LE(_extraLen, Constants.CENEXT);
        data.writeUInt16LE(_comLen, Constants.CENCOM);
        data.writeUInt16LE(_diskStart, Constants.CENDSK);
        data.writeUInt16LE(_inattr, Constants.CENATT);
        data.writeUInt32LE(_attr, Constants.CENATX);
        data.writeUInt32LE(_offset, Constants.CENOFF);
        return data;
      },
      toJSON: function() {
        const bytes = function(nr) {
          return nr + " bytes";
        };
        return {
          made: _verMade,
          version: _version,
          flags: _flags,
          method: Utils.methodToString(_method),
          time: this.time,
          crc: "0x" + _crc.toString(16).toUpperCase(),
          compressedSize: bytes(_compressedSize),
          size: bytes(_size),
          fileNameLength: bytes(_fnameLen),
          extraLength: bytes(_extraLen),
          commentLength: bytes(_comLen),
          diskNumStart: _diskStart,
          inAttr: _inattr,
          attr: _attr,
          offset: _offset,
          centralHeaderSize: bytes(Constants.CENHDR + _fnameLen + _extraLen + _comLen)
        };
      },
      toString: function() {
        return JSON.stringify(this.toJSON(), null, "\t");
      }
    };
  };
});

// node_modules/adm-zip/headers/mainHeader.js
var require_mainHeader = __commonJS((exports, module) => {
  var Utils = require_util();
  var Constants = Utils.Constants;
  module.exports = function() {
    var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
    return {
      get diskEntries() {
        return _volumeEntries;
      },
      set diskEntries(val) {
        _volumeEntries = _totalEntries = val;
      },
      get totalEntries() {
        return _totalEntries;
      },
      set totalEntries(val) {
        _totalEntries = _volumeEntries = val;
      },
      get size() {
        return _size;
      },
      set size(val) {
        _size = val;
      },
      get offset() {
        return _offset;
      },
      set offset(val) {
        _offset = val;
      },
      get commentLength() {
        return _commentLength;
      },
      set commentLength(val) {
        _commentLength = val;
      },
      get mainHeaderSize() {
        return Constants.ENDHDR + _commentLength;
      },
      loadFromBinary: function(data) {
        if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) && (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {
          throw Utils.Errors.INVALID_END();
        }
        if (data.readUInt32LE(0) === Constants.ENDSIG) {
          _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
          _totalEntries = data.readUInt16LE(Constants.ENDTOT);
          _size = data.readUInt32LE(Constants.ENDSIZ);
          _offset = data.readUInt32LE(Constants.ENDOFF);
          _commentLength = data.readUInt16LE(Constants.ENDCOM);
        } else {
          _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
          _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
          _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZE);
          _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);
          _commentLength = 0;
        }
      },
      toBinary: function() {
        var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
        b.writeUInt32LE(Constants.ENDSIG, 0);
        b.writeUInt32LE(0, 4);
        b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
        b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
        b.writeUInt32LE(_size, Constants.ENDSIZ);
        b.writeUInt32LE(_offset, Constants.ENDOFF);
        b.writeUInt16LE(_commentLength, Constants.ENDCOM);
        b.fill(" ", Constants.ENDHDR);
        return b;
      },
      toJSON: function() {
        const offset = function(nr, len) {
          let offs = nr.toString(16).toUpperCase();
          while (offs.length < len)
            offs = "0" + offs;
          return "0x" + offs;
        };
        return {
          diskEntries: _volumeEntries,
          totalEntries: _totalEntries,
          size: _size + " bytes",
          offset: offset(_offset, 4),
          commentLength: _commentLength
        };
      },
      toString: function() {
        return JSON.stringify(this.toJSON(), null, "\t");
      }
    };
  };
});

// node_modules/adm-zip/headers/index.js
var require_headers = __commonJS((exports) => {
  exports.EntryHeader = require_entryHeader();
  exports.MainHeader = require_mainHeader();
});

// node_modules/adm-zip/methods/deflater.js
var require_deflater = __commonJS((exports, module) => {
  module.exports = function(inbuf) {
    var zlib = __require("zlib");
    var opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
    return {
      deflate: function() {
        return zlib.deflateRawSync(inbuf, opts);
      },
      deflateAsync: function(callback) {
        var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
        tmp.on("data", function(data) {
          parts.push(data);
          total += data.length;
        });
        tmp.on("end", function() {
          var buf = Buffer.alloc(total), written = 0;
          buf.fill(0);
          for (var i = 0;i < parts.length; i++) {
            var part = parts[i];
            part.copy(buf, written);
            written += part.length;
          }
          callback && callback(buf);
        });
        tmp.end(inbuf);
      }
    };
  };
});

// node_modules/adm-zip/methods/inflater.js
var require_inflater = __commonJS((exports, module) => {
  var version = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
  module.exports = function(inbuf, expectedLength) {
    var zlib = __require("zlib");
    const option = version >= 15 && expectedLength > 0 ? { maxOutputLength: expectedLength } : {};
    return {
      inflate: function() {
        return zlib.inflateRawSync(inbuf, option);
      },
      inflateAsync: function(callback) {
        var tmp = zlib.createInflateRaw(option), parts = [], total = 0;
        tmp.on("data", function(data) {
          parts.push(data);
          total += data.length;
        });
        tmp.on("end", function() {
          var buf = Buffer.alloc(total), written = 0;
          buf.fill(0);
          for (var i = 0;i < parts.length; i++) {
            var part = parts[i];
            part.copy(buf, written);
            written += part.length;
          }
          callback && callback(buf);
        });
        tmp.end(inbuf);
      }
    };
  };
});

// node_modules/adm-zip/methods/zipcrypto.js
var require_zipcrypto = __commonJS((exports, module) => {
  var { randomFillSync } = __require("crypto");
  var Errors = require_errors();
  var crctable = new Uint32Array(256).map((t, crc) => {
    for (let j = 0;j < 8; j++) {
      if ((crc & 1) !== 0) {
        crc = crc >>> 1 ^ 3988292384;
      } else {
        crc >>>= 1;
      }
    }
    return crc >>> 0;
  });
  var uMul = (a, b) => Math.imul(a, b) >>> 0;
  var crc32update = (pCrc32, bval) => {
    return crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8;
  };
  var genSalt = () => {
    if (typeof randomFillSync === "function") {
      return randomFillSync(Buffer.alloc(12));
    } else {
      return genSalt.node();
    }
  };
  genSalt.node = () => {
    const salt = Buffer.alloc(12);
    const len = salt.length;
    for (let i = 0;i < len; i++)
      salt[i] = Math.random() * 256 & 255;
    return salt;
  };
  var config = {
    genSalt
  };
  function Initkeys(pw) {
    const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
    this.keys = new Uint32Array([305419896, 591751049, 878082192]);
    for (let i = 0;i < pass.length; i++) {
      this.updateKeys(pass[i]);
    }
  }
  Initkeys.prototype.updateKeys = function(byteValue) {
    const keys = this.keys;
    keys[0] = crc32update(keys[0], byteValue);
    keys[1] += keys[0] & 255;
    keys[1] = uMul(keys[1], 134775813) + 1;
    keys[2] = crc32update(keys[2], keys[1] >>> 24);
    return byteValue;
  };
  Initkeys.prototype.next = function() {
    const k = (this.keys[2] | 2) >>> 0;
    return uMul(k, k ^ 1) >> 8 & 255;
  };
  function make_decrypter(pwd) {
    const keys = new Initkeys(pwd);
    return function(data) {
      const result = Buffer.alloc(data.length);
      let pos = 0;
      for (let c of data) {
        result[pos++] = keys.updateKeys(c ^ keys.next());
      }
      return result;
    };
  }
  function make_encrypter(pwd) {
    const keys = new Initkeys(pwd);
    return function(data, result, pos = 0) {
      if (!result)
        result = Buffer.alloc(data.length);
      for (let c of data) {
        const k = keys.next();
        result[pos++] = c ^ k;
        keys.updateKeys(c);
      }
      return result;
    };
  }
  function decrypt(data, header, pwd) {
    if (!data || !Buffer.isBuffer(data) || data.length < 12) {
      return Buffer.alloc(0);
    }
    const decrypter = make_decrypter(pwd);
    const salt = decrypter(data.slice(0, 12));
    const verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
    if (salt[11] !== verifyByte) {
      throw Errors.WRONG_PASSWORD();
    }
    return decrypter(data.slice(12));
  }
  function _salter(data) {
    if (Buffer.isBuffer(data) && data.length >= 12) {
      config.genSalt = function() {
        return data.slice(0, 12);
      };
    } else if (data === "node") {
      config.genSalt = genSalt.node;
    } else {
      config.genSalt = genSalt;
    }
  }
  function encrypt(data, header, pwd, oldlike = false) {
    if (data == null)
      data = Buffer.alloc(0);
    if (!Buffer.isBuffer(data))
      data = Buffer.from(data.toString());
    const encrypter = make_encrypter(pwd);
    const salt = config.genSalt();
    salt[11] = header.crc >>> 24 & 255;
    if (oldlike)
      salt[10] = header.crc >>> 16 & 255;
    const result = Buffer.alloc(data.length + 12);
    encrypter(salt, result);
    return encrypter(data, result, 12);
  }
  module.exports = { decrypt, encrypt, _salter };
});

// node_modules/adm-zip/methods/index.js
var require_methods = __commonJS((exports) => {
  exports.Deflater = require_deflater();
  exports.Inflater = require_inflater();
  exports.ZipCrypto = require_zipcrypto();
});

// node_modules/adm-zip/zipEntry.js
var require_zipEntry = __commonJS((exports, module) => {
  var Utils = require_util();
  var Headers = require_headers();
  var Constants = Utils.Constants;
  var Methods = require_methods();
  module.exports = function(options, input) {
    var _centralHeader = new Headers.EntryHeader, _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = false, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = true;
    const opts = options;
    const decoder = typeof opts.decoder === "object" ? opts.decoder : Utils.decoder;
    _efs = decoder.hasOwnProperty("efs") ? decoder.efs : false;
    function getCompressedDataFromZip() {
      if (!input || !(input instanceof Uint8Array)) {
        return Buffer.alloc(0);
      }
      _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
      return input.slice(_centralHeader.realDataOffset, _centralHeader.realDataOffset + _centralHeader.compressedSize);
    }
    function crc32OK(data) {
      if (!_centralHeader.flags_desc) {
        if (Utils.crc32(data) !== _centralHeader.localHeader.crc) {
          return false;
        }
      } else {
        const descriptor = {};
        const dataEndOffset = _centralHeader.realDataOffset + _centralHeader.compressedSize;
        if (input.readUInt32LE(dataEndOffset) == Constants.LOCSIG || input.readUInt32LE(dataEndOffset) == Constants.CENSIG) {
          throw Utils.Errors.DESCRIPTOR_NOT_EXIST();
        }
        if (input.readUInt32LE(dataEndOffset) == Constants.EXTSIG) {
          descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC);
          descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ);
          descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN);
        } else if (input.readUInt16LE(dataEndOffset + 12) === 19280) {
          descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC - 4);
          descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ - 4);
          descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN - 4);
        } else {
          throw Utils.Errors.DESCRIPTOR_UNKNOWN();
        }
        if (descriptor.compressedSize !== _centralHeader.compressedSize || descriptor.size !== _centralHeader.size || descriptor.crc !== _centralHeader.crc) {
          throw Utils.Errors.DESCRIPTOR_FAULTY();
        }
        if (Utils.crc32(data) !== descriptor.crc) {
          return false;
        }
      }
      return true;
    }
    function decompress(async, callback, pass) {
      if (typeof callback === "undefined" && typeof async === "string") {
        pass = async;
        async = undefined;
      }
      if (_isDirectory) {
        if (async && callback) {
          callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR());
        }
        return Buffer.alloc(0);
      }
      var compressedData = getCompressedDataFromZip();
      if (compressedData.length === 0) {
        if (async && callback)
          callback(compressedData);
        return compressedData;
      }
      if (_centralHeader.encrypted) {
        if (typeof pass !== "string" && !Buffer.isBuffer(pass)) {
          throw Utils.Errors.INVALID_PASS_PARAM();
        }
        compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
      }
      var data = Buffer.alloc(_centralHeader.size);
      switch (_centralHeader.method) {
        case Utils.Constants.STORED:
          compressedData.copy(data);
          if (!crc32OK(data)) {
            if (async && callback)
              callback(data, Utils.Errors.BAD_CRC());
            throw Utils.Errors.BAD_CRC();
          } else {
            if (async && callback)
              callback(data);
            return data;
          }
        case Utils.Constants.DEFLATED:
          var inflater = new Methods.Inflater(compressedData, _centralHeader.size);
          if (!async) {
            const result = inflater.inflate(data);
            result.copy(data, 0);
            if (!crc32OK(data)) {
              throw Utils.Errors.BAD_CRC(`"${decoder.decode(_entryName)}"`);
            }
            return data;
          } else {
            inflater.inflateAsync(function(result) {
              result.copy(result, 0);
              if (callback) {
                if (!crc32OK(result)) {
                  callback(result, Utils.Errors.BAD_CRC());
                } else {
                  callback(result);
                }
              }
            });
          }
          break;
        default:
          if (async && callback)
            callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD());
          throw Utils.Errors.UNKNOWN_METHOD();
      }
    }
    function compress(async, callback) {
      if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
        if (async && callback)
          callback(getCompressedDataFromZip());
        return getCompressedDataFromZip();
      }
      if (uncompressedData.length && !_isDirectory) {
        var compressedData;
        switch (_centralHeader.method) {
          case Utils.Constants.STORED:
            _centralHeader.compressedSize = _centralHeader.size;
            compressedData = Buffer.alloc(uncompressedData.length);
            uncompressedData.copy(compressedData);
            if (async && callback)
              callback(compressedData);
            return compressedData;
          default:
          case Utils.Constants.DEFLATED:
            var deflater = new Methods.Deflater(uncompressedData);
            if (!async) {
              var deflated = deflater.deflate();
              _centralHeader.compressedSize = deflated.length;
              return deflated;
            } else {
              deflater.deflateAsync(function(data) {
                compressedData = Buffer.alloc(data.length);
                _centralHeader.compressedSize = data.length;
                data.copy(compressedData);
                callback && callback(compressedData);
              });
            }
            deflater = null;
            break;
        }
      } else if (async && callback) {
        callback(Buffer.alloc(0));
      } else {
        return Buffer.alloc(0);
      }
    }
    function readUInt64LE(buffer, offset) {
      return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
    }
    function parseExtra(data) {
      try {
        var offset = 0;
        var signature, size, part;
        while (offset + 4 < data.length) {
          signature = data.readUInt16LE(offset);
          offset += 2;
          size = data.readUInt16LE(offset);
          offset += 2;
          part = data.slice(offset, offset + size);
          offset += size;
          if (Constants.ID_ZIP64 === signature) {
            parseZip64ExtendedInformation(part);
          }
        }
      } catch (error) {
        throw Utils.Errors.EXTRA_FIELD_PARSE_ERROR();
      }
    }
    function parseZip64ExtendedInformation(data) {
      var size, compressedSize, offset, diskNumStart;
      if (data.length >= Constants.EF_ZIP64_SCOMP) {
        size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
        if (_centralHeader.size === Constants.EF_ZIP64_OR_32) {
          _centralHeader.size = size;
        }
      }
      if (data.length >= Constants.EF_ZIP64_RHO) {
        compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
        if (_centralHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
          _centralHeader.compressedSize = compressedSize;
        }
      }
      if (data.length >= Constants.EF_ZIP64_DSN) {
        offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
        if (_centralHeader.offset === Constants.EF_ZIP64_OR_32) {
          _centralHeader.offset = offset;
        }
      }
      if (data.length >= Constants.EF_ZIP64_DSN + 4) {
        diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
        if (_centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
          _centralHeader.diskNumStart = diskNumStart;
        }
      }
    }
    return {
      get entryName() {
        return decoder.decode(_entryName);
      },
      get rawEntryName() {
        return _entryName;
      },
      set entryName(val) {
        _entryName = Utils.toBuffer(val, decoder.encode);
        var lastChar = _entryName[_entryName.length - 1];
        _isDirectory = lastChar === 47 || lastChar === 92;
        _centralHeader.fileNameLength = _entryName.length;
      },
      get efs() {
        if (typeof _efs === "function") {
          return _efs(this.entryName);
        } else {
          return _efs;
        }
      },
      get extra() {
        return _extra;
      },
      set extra(val) {
        _extra = val;
        _centralHeader.extraLength = val.length;
        parseExtra(val);
      },
      get comment() {
        return decoder.decode(_comment);
      },
      set comment(val) {
        _comment = Utils.toBuffer(val, decoder.encode);
        _centralHeader.commentLength = _comment.length;
        if (_comment.length > 65535)
          throw Utils.Errors.COMMENT_TOO_LONG();
      },
      get name() {
        var n = decoder.decode(_entryName);
        return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop();
      },
      get isDirectory() {
        return _isDirectory;
      },
      getCompressedData: function() {
        return compress(false, null);
      },
      getCompressedDataAsync: function(callback) {
        compress(true, callback);
      },
      setData: function(value) {
        uncompressedData = Utils.toBuffer(value, Utils.decoder.encode);
        if (!_isDirectory && uncompressedData.length) {
          _centralHeader.size = uncompressedData.length;
          _centralHeader.method = Utils.Constants.DEFLATED;
          _centralHeader.crc = Utils.crc32(value);
          _centralHeader.changed = true;
        } else {
          _centralHeader.method = Utils.Constants.STORED;
        }
      },
      getData: function(pass) {
        if (_centralHeader.changed) {
          return uncompressedData;
        } else {
          return decompress(false, null, pass);
        }
      },
      getDataAsync: function(callback, pass) {
        if (_centralHeader.changed) {
          callback(uncompressedData);
        } else {
          decompress(true, callback, pass);
        }
      },
      set attr(attr) {
        _centralHeader.attr = attr;
      },
      get attr() {
        return _centralHeader.attr;
      },
      set header(data) {
        _centralHeader.loadFromBinary(data);
      },
      get header() {
        return _centralHeader;
      },
      packCentralHeader: function() {
        _centralHeader.flags_efs = this.efs;
        _centralHeader.extraLength = _extra.length;
        var header = _centralHeader.centralHeaderToBinary();
        var addpos = Utils.Constants.CENHDR;
        _entryName.copy(header, addpos);
        addpos += _entryName.length;
        _extra.copy(header, addpos);
        addpos += _centralHeader.extraLength;
        _comment.copy(header, addpos);
        return header;
      },
      packLocalHeader: function() {
        let addpos = 0;
        _centralHeader.flags_efs = this.efs;
        _centralHeader.extraLocalLength = _extralocal.length;
        const localHeaderBuf = _centralHeader.localHeaderToBinary();
        const localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
        localHeaderBuf.copy(localHeader, addpos);
        addpos += localHeaderBuf.length;
        _entryName.copy(localHeader, addpos);
        addpos += _entryName.length;
        _extralocal.copy(localHeader, addpos);
        addpos += _extralocal.length;
        return localHeader;
      },
      toJSON: function() {
        const bytes = function(nr) {
          return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
        };
        return {
          entryName: this.entryName,
          name: this.name,
          comment: this.comment,
          isDirectory: this.isDirectory,
          header: _centralHeader.toJSON(),
          compressedData: bytes(input),
          data: bytes(uncompressedData)
        };
      },
      toString: function() {
        return JSON.stringify(this.toJSON(), null, "\t");
      }
    };
  };
});

// node_modules/adm-zip/zipFile.js
var require_zipFile = __commonJS((exports, module) => {
  var ZipEntry = require_zipEntry();
  var Headers = require_headers();
  var Utils = require_util();
  module.exports = function(inBuffer, options) {
    var entryList = [], entryTable = {}, _comment = Buffer.alloc(0), mainHeader = new Headers.MainHeader, loadedEntries = false;
    var password = null;
    const temporary = new Set;
    const opts = options;
    const { noSort, decoder } = opts;
    if (inBuffer) {
      readMainHeader(opts.readEntries);
    } else {
      loadedEntries = true;
    }
    function makeTemporaryFolders() {
      const foldersList = new Set;
      for (const elem of Object.keys(entryTable)) {
        const elements = elem.split("/");
        elements.pop();
        if (!elements.length)
          continue;
        for (let i = 0;i < elements.length; i++) {
          const sub = elements.slice(0, i + 1).join("/") + "/";
          foldersList.add(sub);
        }
      }
      for (const elem of foldersList) {
        if (!(elem in entryTable)) {
          const tempfolder = new ZipEntry(opts);
          tempfolder.entryName = elem;
          tempfolder.attr = 16;
          tempfolder.temporary = true;
          entryList.push(tempfolder);
          entryTable[tempfolder.entryName] = tempfolder;
          temporary.add(tempfolder);
        }
      }
    }
    function readEntries() {
      loadedEntries = true;
      entryTable = {};
      if (mainHeader.diskEntries > (inBuffer.length - mainHeader.offset) / Utils.Constants.CENHDR) {
        throw Utils.Errors.DISK_ENTRY_TOO_LARGE();
      }
      entryList = new Array(mainHeader.diskEntries);
      var index = mainHeader.offset;
      for (var i = 0;i < entryList.length; i++) {
        var tmp = index, entry = new ZipEntry(opts, inBuffer);
        entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
        entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);
        if (entry.header.extraLength) {
          entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
        }
        if (entry.header.commentLength)
          entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);
        index += entry.header.centralHeaderSize;
        entryList[i] = entry;
        entryTable[entry.entryName] = entry;
      }
      temporary.clear();
      makeTemporaryFolders();
    }
    function readMainHeader(readNow) {
      var i = inBuffer.length - Utils.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
      const trailingSpace = typeof opts.trailingSpace === "boolean" ? opts.trailingSpace : false;
      if (trailingSpace)
        max = 0;
      for (i;i >= n; i--) {
        if (inBuffer[i] !== 80)
          continue;
        if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) {
          endOffset = i;
          commentEnd = i;
          endStart = i + Utils.Constants.ENDHDR;
          n = i - Utils.Constants.END64HDR;
          continue;
        }
        if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
          n = max;
          continue;
        }
        if (inBuffer.readUInt32LE(i) === Utils.Constants.ZIP64SIG) {
          endOffset = i;
          endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
          break;
        }
      }
      if (endOffset == -1)
        throw Utils.Errors.INVALID_FORMAT();
      mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
      if (mainHeader.commentLength) {
        _comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
      }
      if (readNow)
        readEntries();
    }
    function sortEntries() {
      if (entryList.length > 1 && !noSort) {
        entryList.sort((a, b) => a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase()));
      }
    }
    return {
      get entries() {
        if (!loadedEntries) {
          readEntries();
        }
        return entryList.filter((e) => !temporary.has(e));
      },
      get comment() {
        return decoder.decode(_comment);
      },
      set comment(val) {
        _comment = Utils.toBuffer(val, decoder.encode);
        mainHeader.commentLength = _comment.length;
      },
      getEntryCount: function() {
        if (!loadedEntries) {
          return mainHeader.diskEntries;
        }
        return entryList.length;
      },
      forEach: function(callback) {
        this.entries.forEach(callback);
      },
      getEntry: function(entryName) {
        if (!loadedEntries) {
          readEntries();
        }
        return entryTable[entryName] || null;
      },
      setEntry: function(entry) {
        if (!loadedEntries) {
          readEntries();
        }
        entryList.push(entry);
        entryTable[entry.entryName] = entry;
        mainHeader.totalEntries = entryList.length;
      },
      deleteFile: function(entryName, withsubfolders = true) {
        if (!loadedEntries) {
          readEntries();
        }
        const entry = entryTable[entryName];
        const list = this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName);
        list.forEach(this.deleteEntry);
      },
      deleteEntry: function(entryName) {
        if (!loadedEntries) {
          readEntries();
        }
        const entry = entryTable[entryName];
        const index = entryList.indexOf(entry);
        if (index >= 0) {
          entryList.splice(index, 1);
          delete entryTable[entryName];
          mainHeader.totalEntries = entryList.length;
        }
      },
      getEntryChildren: function(entry, subfolders = true) {
        if (!loadedEntries) {
          readEntries();
        }
        if (typeof entry === "object") {
          if (entry.isDirectory && subfolders) {
            const list = [];
            const name = entry.entryName;
            for (const zipEntry of entryList) {
              if (zipEntry.entryName.startsWith(name)) {
                list.push(zipEntry);
              }
            }
            return list;
          } else {
            return [entry];
          }
        }
        return [];
      },
      getChildCount: function(entry) {
        if (entry && entry.isDirectory) {
          const list = this.getEntryChildren(entry);
          return list.includes(entry) ? list.length - 1 : list.length;
        }
        return 0;
      },
      compressToBuffer: function() {
        if (!loadedEntries) {
          readEntries();
        }
        sortEntries();
        const dataBlock = [];
        const headerBlocks = [];
        let totalSize = 0;
        let dindex = 0;
        mainHeader.size = 0;
        mainHeader.offset = 0;
        let totalEntries = 0;
        for (const entry of this.entries) {
          const compressedData = entry.getCompressedData();
          entry.header.offset = dindex;
          const localHeader = entry.packLocalHeader();
          const dataLength = localHeader.length + compressedData.length;
          dindex += dataLength;
          dataBlock.push(localHeader);
          dataBlock.push(compressedData);
          const centralHeader = entry.packCentralHeader();
          headerBlocks.push(centralHeader);
          mainHeader.size += centralHeader.length;
          totalSize += dataLength + centralHeader.length;
          totalEntries++;
        }
        totalSize += mainHeader.mainHeaderSize;
        mainHeader.offset = dindex;
        mainHeader.totalEntries = totalEntries;
        dindex = 0;
        const outBuffer = Buffer.alloc(totalSize);
        for (const content of dataBlock) {
          content.copy(outBuffer, dindex);
          dindex += content.length;
        }
        for (const content of headerBlocks) {
          content.copy(outBuffer, dindex);
          dindex += content.length;
        }
        const mh = mainHeader.toBinary();
        if (_comment) {
          _comment.copy(mh, Utils.Constants.ENDHDR);
        }
        mh.copy(outBuffer, dindex);
        inBuffer = outBuffer;
        loadedEntries = false;
        return outBuffer;
      },
      toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
        try {
          if (!loadedEntries) {
            readEntries();
          }
          sortEntries();
          const dataBlock = [];
          const centralHeaders = [];
          let totalSize = 0;
          let dindex = 0;
          let totalEntries = 0;
          mainHeader.size = 0;
          mainHeader.offset = 0;
          const compress2Buffer = function(entryLists) {
            if (entryLists.length > 0) {
              const entry = entryLists.shift();
              const name = entry.entryName + entry.extra.toString();
              if (onItemStart)
                onItemStart(name);
              entry.getCompressedDataAsync(function(compressedData) {
                if (onItemEnd)
                  onItemEnd(name);
                entry.header.offset = dindex;
                const localHeader = entry.packLocalHeader();
                const dataLength = localHeader.length + compressedData.length;
                dindex += dataLength;
                dataBlock.push(localHeader);
                dataBlock.push(compressedData);
                const centalHeader = entry.packCentralHeader();
                centralHeaders.push(centalHeader);
                mainHeader.size += centalHeader.length;
                totalSize += dataLength + centalHeader.length;
                totalEntries++;
                compress2Buffer(entryLists);
              });
            } else {
              totalSize += mainHeader.mainHeaderSize;
              mainHeader.offset = dindex;
              mainHeader.totalEntries = totalEntries;
              dindex = 0;
              const outBuffer = Buffer.alloc(totalSize);
              dataBlock.forEach(function(content) {
                content.copy(outBuffer, dindex);
                dindex += content.length;
              });
              centralHeaders.forEach(function(content) {
                content.copy(outBuffer, dindex);
                dindex += content.length;
              });
              const mh = mainHeader.toBinary();
              if (_comment) {
                _comment.copy(mh, Utils.Constants.ENDHDR);
              }
              mh.copy(outBuffer, dindex);
              inBuffer = outBuffer;
              loadedEntries = false;
              onSuccess(outBuffer);
            }
          };
          compress2Buffer(Array.from(this.entries));
        } catch (e) {
          onFail(e);
        }
      }
    };
  };
});

// node_modules/adm-zip/adm-zip.js
var require_adm_zip = __commonJS((exports, module) => {
  var Utils = require_util();
  var pth = __require("path");
  var ZipEntry = require_zipEntry();
  var ZipFile = require_zipFile();
  var get_Bool = (...val) => Utils.findLast(val, (c) => typeof c === "boolean");
  var get_Str = (...val) => Utils.findLast(val, (c) => typeof c === "string");
  var get_Fun = (...val) => Utils.findLast(val, (c) => typeof c === "function");
  var defaultOptions = {
    noSort: false,
    readEntries: false,
    method: Utils.Constants.NONE,
    fs: null
  };
  module.exports = function(input, options) {
    let inBuffer = null;
    const opts = Object.assign(Object.create(null), defaultOptions);
    if (input && typeof input === "object") {
      if (!(input instanceof Uint8Array)) {
        Object.assign(opts, input);
        input = opts.input ? opts.input : undefined;
        if (opts.input)
          delete opts.input;
      }
      if (Buffer.isBuffer(input)) {
        inBuffer = input;
        opts.method = Utils.Constants.BUFFER;
        input = undefined;
      }
    }
    Object.assign(opts, options);
    const filetools = new Utils(opts);
    if (typeof opts.decoder !== "object" || typeof opts.decoder.encode !== "function" || typeof opts.decoder.decode !== "function") {
      opts.decoder = Utils.decoder;
    }
    if (input && typeof input === "string") {
      if (filetools.fs.existsSync(input)) {
        opts.method = Utils.Constants.FILE;
        opts.filename = input;
        inBuffer = filetools.fs.readFileSync(input);
      } else {
        throw Utils.Errors.INVALID_FILENAME();
      }
    }
    const _zip = new ZipFile(inBuffer, opts);
    const { canonical, sanitize, zipnamefix } = Utils;
    function getEntry(entry) {
      if (entry && _zip) {
        var item;
        if (typeof entry === "string")
          item = _zip.getEntry(pth.posix.normalize(entry));
        if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined")
          item = _zip.getEntry(entry.entryName);
        if (item) {
          return item;
        }
      }
      return null;
    }
    function fixPath(zipPath) {
      const { join, normalize, sep } = pth.posix;
      return join(".", normalize(sep + zipPath.split("\\").join(sep) + sep));
    }
    function filenameFilter(filterfn) {
      if (filterfn instanceof RegExp) {
        return function(rx) {
          return function(filename) {
            return rx.test(filename);
          };
        }(filterfn);
      } else if (typeof filterfn !== "function") {
        return () => true;
      }
      return filterfn;
    }
    const relativePath = (local, entry) => {
      let lastChar = entry.slice(-1);
      lastChar = lastChar === filetools.sep ? filetools.sep : "";
      return pth.relative(local, entry) + lastChar;
    };
    return {
      readFile: function(entry, pass) {
        var item = getEntry(entry);
        return item && item.getData(pass) || null;
      },
      childCount: function(entry) {
        const item = getEntry(entry);
        if (item) {
          return _zip.getChildCount(item);
        }
      },
      readFileAsync: function(entry, callback) {
        var item = getEntry(entry);
        if (item) {
          item.getDataAsync(callback);
        } else {
          callback(null, "getEntry failed for:" + entry);
        }
      },
      readAsText: function(entry, encoding) {
        var item = getEntry(entry);
        if (item) {
          var data = item.getData();
          if (data && data.length) {
            return data.toString(encoding || "utf8");
          }
        }
        return "";
      },
      readAsTextAsync: function(entry, callback, encoding) {
        var item = getEntry(entry);
        if (item) {
          item.getDataAsync(function(data, err) {
            if (err) {
              callback(data, err);
              return;
            }
            if (data && data.length) {
              callback(data.toString(encoding || "utf8"));
            } else {
              callback("");
            }
          });
        } else {
          callback("");
        }
      },
      deleteFile: function(entry, withsubfolders = true) {
        var item = getEntry(entry);
        if (item) {
          _zip.deleteFile(item.entryName, withsubfolders);
        }
      },
      deleteEntry: function(entry) {
        var item = getEntry(entry);
        if (item) {
          _zip.deleteEntry(item.entryName);
        }
      },
      addZipComment: function(comment) {
        _zip.comment = comment;
      },
      getZipComment: function() {
        return _zip.comment || "";
      },
      addZipEntryComment: function(entry, comment) {
        var item = getEntry(entry);
        if (item) {
          item.comment = comment;
        }
      },
      getZipEntryComment: function(entry) {
        var item = getEntry(entry);
        if (item) {
          return item.comment || "";
        }
        return "";
      },
      updateFile: function(entry, content) {
        var item = getEntry(entry);
        if (item) {
          item.setData(content);
        }
      },
      addLocalFile: function(localPath2, zipPath, zipName, comment) {
        if (filetools.fs.existsSync(localPath2)) {
          zipPath = zipPath ? fixPath(zipPath) : "";
          const p = pth.win32.basename(pth.win32.normalize(localPath2));
          zipPath += zipName ? zipName : p;
          const _attr = filetools.fs.statSync(localPath2);
          const data = _attr.isFile() ? filetools.fs.readFileSync(localPath2) : Buffer.alloc(0);
          if (_attr.isDirectory())
            zipPath += filetools.sep;
          this.addFile(zipPath, data, comment, _attr);
        } else {
          throw Utils.Errors.FILE_NOT_FOUND(localPath2);
        }
      },
      addLocalFileAsync: function(options2, callback) {
        options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
        const localPath2 = pth.resolve(options2.localPath);
        const { comment } = options2;
        let { zipPath, zipName } = options2;
        const self = this;
        filetools.fs.stat(localPath2, function(err, stats) {
          if (err)
            return callback(err, false);
          zipPath = zipPath ? fixPath(zipPath) : "";
          const p = pth.win32.basename(pth.win32.normalize(localPath2));
          zipPath += zipName ? zipName : p;
          if (stats.isFile()) {
            filetools.fs.readFile(localPath2, function(err2, data) {
              if (err2)
                return callback(err2, false);
              self.addFile(zipPath, data, comment, stats);
              return setImmediate(callback, undefined, true);
            });
          } else if (stats.isDirectory()) {
            zipPath += filetools.sep;
            self.addFile(zipPath, Buffer.alloc(0), comment, stats);
            return setImmediate(callback, undefined, true);
          }
        });
      },
      addLocalFolder: function(localPath2, zipPath, filter) {
        filter = filenameFilter(filter);
        zipPath = zipPath ? fixPath(zipPath) : "";
        localPath2 = pth.normalize(localPath2);
        if (filetools.fs.existsSync(localPath2)) {
          const items = filetools.findFiles(localPath2);
          const self = this;
          if (items.length) {
            for (const filepath of items) {
              const p = pth.join(zipPath, relativePath(localPath2, filepath));
              if (filter(p)) {
                self.addLocalFile(filepath, pth.dirname(p));
              }
            }
          }
        } else {
          throw Utils.Errors.FILE_NOT_FOUND(localPath2);
        }
      },
      addLocalFolderAsync: function(localPath2, callback, zipPath, filter) {
        filter = filenameFilter(filter);
        zipPath = zipPath ? fixPath(zipPath) : "";
        localPath2 = pth.normalize(localPath2);
        var self = this;
        filetools.fs.open(localPath2, "r", function(err) {
          if (err && err.code === "ENOENT") {
            callback(undefined, Utils.Errors.FILE_NOT_FOUND(localPath2));
          } else if (err) {
            callback(undefined, err);
          } else {
            var items = filetools.findFiles(localPath2);
            var i = -1;
            var next = function() {
              i += 1;
              if (i < items.length) {
                var filepath = items[i];
                var p = relativePath(localPath2, filepath).split("\\").join("/");
                p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
                if (filter(p)) {
                  filetools.fs.stat(filepath, function(er0, stats) {
                    if (er0)
                      callback(undefined, er0);
                    if (stats.isFile()) {
                      filetools.fs.readFile(filepath, function(er1, data) {
                        if (er1) {
                          callback(undefined, er1);
                        } else {
                          self.addFile(zipPath + p, data, "", stats);
                          next();
                        }
                      });
                    } else {
                      self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                      next();
                    }
                  });
                } else {
                  process.nextTick(() => {
                    next();
                  });
                }
              } else {
                callback(true, undefined);
              }
            };
            next();
          }
        });
      },
      addLocalFolderAsync2: function(options2, callback) {
        const self = this;
        options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
        localPath = pth.resolve(fixPath(options2.localPath));
        let { zipPath, filter, namefix } = options2;
        if (filter instanceof RegExp) {
          filter = function(rx) {
            return function(filename) {
              return rx.test(filename);
            };
          }(filter);
        } else if (typeof filter !== "function") {
          filter = function() {
            return true;
          };
        }
        zipPath = zipPath ? fixPath(zipPath) : "";
        if (namefix == "latin1") {
          namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
        }
        if (typeof namefix !== "function")
          namefix = (str) => str;
        const relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry)));
        const fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
        filetools.fs.open(localPath, "r", function(err) {
          if (err && err.code === "ENOENT") {
            callback(undefined, Utils.Errors.FILE_NOT_FOUND(localPath));
          } else if (err) {
            callback(undefined, err);
          } else {
            filetools.findFilesAsync(localPath, function(err2, fileEntries) {
              if (err2)
                return callback(err2);
              fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir)));
              if (!fileEntries.length)
                callback(undefined, false);
              setImmediate(fileEntries.reverse().reduce(function(next, entry) {
                return function(err3, done) {
                  if (err3 || done === false)
                    return setImmediate(next, err3, false);
                  self.addLocalFileAsync({
                    localPath: entry,
                    zipPath: pth.dirname(relPathFix(entry)),
                    zipName: fileNameFix(entry)
                  }, next);
                };
              }, callback));
            });
          }
        });
      },
      addLocalFolderPromise: function(localPath2, props) {
        return new Promise((resolve, reject) => {
          this.addLocalFolderAsync2(Object.assign({ localPath: localPath2 }, props), (err, done) => {
            if (err)
              reject(err);
            if (done)
              resolve(this);
          });
        });
      },
      addFile: function(entryName, content, comment, attr) {
        entryName = zipnamefix(entryName);
        let entry = getEntry(entryName);
        const update = entry != null;
        if (!update) {
          entry = new ZipEntry(opts);
          entry.entryName = entryName;
        }
        entry.comment = comment || "";
        const isStat = typeof attr === "object" && attr instanceof filetools.fs.Stats;
        if (isStat) {
          entry.header.time = attr.mtime;
        }
        var fileattr = entry.isDirectory ? 16 : 0;
        let unix = entry.isDirectory ? 16384 : 32768;
        if (isStat) {
          unix |= 4095 & attr.mode;
        } else if (typeof attr === "number") {
          unix |= 4095 & attr;
        } else {
          unix |= entry.isDirectory ? 493 : 420;
        }
        fileattr = (fileattr | unix << 16) >>> 0;
        entry.attr = fileattr;
        entry.setData(content);
        if (!update)
          _zip.setEntry(entry);
        return entry;
      },
      getEntries: function(password) {
        _zip.password = password;
        return _zip ? _zip.entries : [];
      },
      getEntry: function(name) {
        return getEntry(name);
      },
      getEntryCount: function() {
        return _zip.getEntryCount();
      },
      forEach: function(callback) {
        return _zip.forEach(callback);
      },
      extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
        overwrite = get_Bool(false, overwrite);
        keepOriginalPermission = get_Bool(false, keepOriginalPermission);
        maintainEntryPath = get_Bool(true, maintainEntryPath);
        outFileName = get_Str(keepOriginalPermission, outFileName);
        var item = getEntry(entry);
        if (!item) {
          throw Utils.Errors.NO_ENTRY();
        }
        var entryName = canonical(item.entryName);
        var target = sanitize(targetPath, outFileName && !item.isDirectory ? outFileName : maintainEntryPath ? entryName : pth.basename(entryName));
        if (item.isDirectory) {
          var children = _zip.getEntryChildren(item);
          children.forEach(function(child) {
            if (child.isDirectory)
              return;
            var content2 = child.getData();
            if (!content2) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
            var name = canonical(child.entryName);
            var childName = sanitize(targetPath, maintainEntryPath ? name : pth.basename(name));
            const fileAttr2 = keepOriginalPermission ? child.header.fileAttr : undefined;
            filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
          });
          return true;
        }
        var content = item.getData(_zip.password);
        if (!content)
          throw Utils.Errors.CANT_EXTRACT_FILE();
        if (filetools.fs.existsSync(target) && !overwrite) {
          throw Utils.Errors.CANT_OVERRIDE();
        }
        const fileAttr = keepOriginalPermission ? entry.header.fileAttr : undefined;
        filetools.writeFileTo(target, content, overwrite, fileAttr);
        return true;
      },
      test: function(pass) {
        if (!_zip) {
          return false;
        }
        for (var entry in _zip.entries) {
          try {
            if (entry.isDirectory) {
              continue;
            }
            var content = _zip.entries[entry].getData(pass);
            if (!content) {
              return false;
            }
          } catch (err) {
            return false;
          }
        }
        return true;
      },
      extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
        keepOriginalPermission = get_Bool(false, keepOriginalPermission);
        pass = get_Str(keepOriginalPermission, pass);
        overwrite = get_Bool(false, overwrite);
        if (!_zip)
          throw Utils.Errors.NO_ZIP();
        _zip.entries.forEach(function(entry) {
          var entryName = sanitize(targetPath, canonical(entry.entryName));
          if (entry.isDirectory) {
            filetools.makeDir(entryName);
            return;
          }
          var content = entry.getData(pass);
          if (!content) {
            throw Utils.Errors.CANT_EXTRACT_FILE();
          }
          const fileAttr = keepOriginalPermission ? entry.header.fileAttr : undefined;
          filetools.writeFileTo(entryName, content, overwrite, fileAttr);
          try {
            filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
          } catch (err) {
            throw Utils.Errors.CANT_EXTRACT_FILE();
          }
        });
      },
      extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
        callback = get_Fun(overwrite, keepOriginalPermission, callback);
        keepOriginalPermission = get_Bool(false, keepOriginalPermission);
        overwrite = get_Bool(false, overwrite);
        if (!callback) {
          return new Promise((resolve, reject) => {
            this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
              if (err) {
                reject(err);
              } else {
                resolve(this);
              }
            });
          });
        }
        if (!_zip) {
          callback(Utils.Errors.NO_ZIP());
          return;
        }
        targetPath = pth.resolve(targetPath);
        const getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName)));
        const getError = (msg, file) => new Error(msg + ': "' + file + '"');
        const dirEntries = [];
        const fileEntries = [];
        _zip.entries.forEach((e) => {
          if (e.isDirectory) {
            dirEntries.push(e);
          } else {
            fileEntries.push(e);
          }
        });
        for (const entry of dirEntries) {
          const dirPath = getPath(entry);
          const dirAttr = keepOriginalPermission ? entry.header.fileAttr : undefined;
          try {
            filetools.makeDir(dirPath);
            if (dirAttr)
              filetools.fs.chmodSync(dirPath, dirAttr);
            filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
          } catch (er) {
            callback(getError("Unable to create folder", dirPath));
          }
        }
        fileEntries.reverse().reduce(function(next, entry) {
          return function(err) {
            if (err) {
              next(err);
            } else {
              const entryName = pth.normalize(canonical(entry.entryName));
              const filePath = sanitize(targetPath, entryName);
              entry.getDataAsync(function(content, err_1) {
                if (err_1) {
                  next(err_1);
                } else if (!content) {
                  next(Utils.Errors.CANT_EXTRACT_FILE());
                } else {
                  const fileAttr = keepOriginalPermission ? entry.header.fileAttr : undefined;
                  filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                    if (!succ) {
                      next(getError("Unable to write file", filePath));
                    }
                    filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function(err_2) {
                      if (err_2) {
                        next(getError("Unable to set times", filePath));
                      } else {
                        next();
                      }
                    });
                  });
                }
              });
            }
          };
        }, callback)();
      },
      writeZip: function(targetFileName, callback) {
        if (arguments.length === 1) {
          if (typeof targetFileName === "function") {
            callback = targetFileName;
            targetFileName = "";
          }
        }
        if (!targetFileName && opts.filename) {
          targetFileName = opts.filename;
        }
        if (!targetFileName)
          return;
        var zipData = _zip.compressToBuffer();
        if (zipData) {
          var ok = filetools.writeFileTo(targetFileName, zipData, true);
          if (typeof callback === "function")
            callback(!ok ? new Error("failed") : null, "");
        }
      },
      writeZipPromise: function(targetFileName, props) {
        const { overwrite, perm } = Object.assign({ overwrite: true }, props);
        return new Promise((resolve, reject) => {
          if (!targetFileName && opts.filename)
            targetFileName = opts.filename;
          if (!targetFileName)
            reject("ADM-ZIP: ZIP File Name Missing");
          this.toBufferPromise().then((zipData) => {
            const ret = (done) => done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file");
            filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
          }, reject);
        });
      },
      toBufferPromise: function() {
        return new Promise((resolve, reject) => {
          _zip.toAsyncBuffer(resolve, reject);
        });
      },
      toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
        if (typeof onSuccess === "function") {
          _zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
          return null;
        }
        return _zip.compressToBuffer();
      }
    };
  };
});

// node_modules/nodemailer/lib/fetch/cookies.js
var require_cookies = __commonJS((exports, module) => {
  var urllib = __require("url");
  var SESSION_TIMEOUT = 1800;

  class Cookies {
    constructor(options) {
      this.options = options || {};
      this.cookies = [];
    }
    set(cookieStr, url) {
      let urlparts = urllib.parse(url || "");
      let cookie = this.parse(cookieStr);
      let domain;
      if (cookie.domain) {
        domain = cookie.domain.replace(/^\./, "");
        if (urlparts.hostname.length < domain.length || ("." + urlparts.hostname).substr(-domain.length + 1) !== "." + domain) {
          cookie.domain = urlparts.hostname;
        }
      } else {
        cookie.domain = urlparts.hostname;
      }
      if (!cookie.path) {
        cookie.path = this.getPath(urlparts.pathname);
      }
      if (!cookie.expires) {
        cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1000);
      }
      return this.add(cookie);
    }
    get(url) {
      return this.list(url).map((cookie) => cookie.name + "=" + cookie.value).join("; ");
    }
    list(url) {
      let result = [];
      let i;
      let cookie;
      for (i = this.cookies.length - 1;i >= 0; i--) {
        cookie = this.cookies[i];
        if (this.isExpired(cookie)) {
          this.cookies.splice(i, i);
          continue;
        }
        if (this.match(cookie, url)) {
          result.unshift(cookie);
        }
      }
      return result;
    }
    parse(cookieStr) {
      let cookie = {};
      (cookieStr || "").toString().split(";").forEach((cookiePart) => {
        let valueParts = cookiePart.split("=");
        let key = valueParts.shift().trim().toLowerCase();
        let value = valueParts.join("=").trim();
        let domain;
        if (!key) {
          return;
        }
        switch (key) {
          case "expires":
            value = new Date(value);
            if (value.toString() !== "Invalid Date") {
              cookie.expires = value;
            }
            break;
          case "path":
            cookie.path = value;
            break;
          case "domain":
            domain = value.toLowerCase();
            if (domain.length && domain.charAt(0) !== ".") {
              domain = "." + domain;
            }
            cookie.domain = domain;
            break;
          case "max-age":
            cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1000);
            break;
          case "secure":
            cookie.secure = true;
            break;
          case "httponly":
            cookie.httponly = true;
            break;
          default:
            if (!cookie.name) {
              cookie.name = key;
              cookie.value = value;
            }
        }
      });
      return cookie;
    }
    match(cookie, url) {
      let urlparts = urllib.parse(url || "");
      if (urlparts.hostname !== cookie.domain && (cookie.domain.charAt(0) !== "." || ("." + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)) {
        return false;
      }
      let path2 = this.getPath(urlparts.pathname);
      if (path2.substr(0, cookie.path.length) !== cookie.path) {
        return false;
      }
      if (cookie.secure && urlparts.protocol !== "https:") {
        return false;
      }
      return true;
    }
    add(cookie) {
      let i;
      let len;
      if (!cookie || !cookie.name) {
        return false;
      }
      for (i = 0, len = this.cookies.length;i < len; i++) {
        if (this.compare(this.cookies[i], cookie)) {
          if (this.isExpired(cookie)) {
            this.cookies.splice(i, 1);
            return false;
          }
          this.cookies[i] = cookie;
          return true;
        }
      }
      if (!this.isExpired(cookie)) {
        this.cookies.push(cookie);
      }
      return true;
    }
    compare(a, b) {
      return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === a.httponly;
    }
    isExpired(cookie) {
      return cookie.expires && cookie.expires < new Date || !cookie.value;
    }
    getPath(pathname) {
      let path2 = (pathname || "/").split("/");
      path2.pop();
      path2 = path2.join("/").trim();
      if (path2.charAt(0) !== "/") {
        path2 = "/" + path2;
      }
      if (path2.substr(-1) !== "/") {
        path2 += "/";
      }
      return path2;
    }
  }
  module.exports = Cookies;
});

// node_modules/nodemailer/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "nodemailer",
    version: "7.0.12",
    description: "Easy as cake e-mail sending from your Node.js applications",
    main: "lib/nodemailer.js",
    scripts: {
      test: "node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js",
      "test:coverage": "c8 node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js",
      format: 'prettier --write "**/*.{js,json,md}"',
      "format:check": 'prettier --check "**/*.{js,json,md}"',
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      update: "rm -rf node_modules/ package-lock.json && ncu -u && npm install"
    },
    repository: {
      type: "git",
      url: "https://github.com/nodemailer/nodemailer.git"
    },
    keywords: [
      "Nodemailer"
    ],
    author: "Andris Reinman",
    license: "MIT-0",
    bugs: {
      url: "https://github.com/nodemailer/nodemailer/issues"
    },
    homepage: "https://nodemailer.com/",
    devDependencies: {
      "@aws-sdk/client-sesv2": "3.940.0",
      bunyan: "1.8.15",
      c8: "10.1.3",
      eslint: "9.39.1",
      "eslint-config-prettier": "10.1.8",
      globals: "16.5.0",
      libbase64: "1.3.0",
      libmime: "5.3.7",
      libqp: "2.1.1",
      "nodemailer-ntlm-auth": "1.0.4",
      prettier: "3.6.2",
      proxy: "1.0.2",
      "proxy-test-server": "1.0.0",
      "smtp-server": "3.16.1"
    },
    engines: {
      node: ">=6.0.0"
    }
  };
});

// node_modules/nodemailer/lib/fetch/index.js
var require_fetch = __commonJS((exports, module) => {
  var http = __require("http");
  var https = __require("https");
  var urllib = __require("url");
  var zlib = __require("zlib");
  var PassThrough = __require("stream").PassThrough;
  var Cookies = require_cookies();
  var packageData = require_package();
  var net = __require("net");
  var MAX_REDIRECTS = 5;
  module.exports = function(url, options) {
    return nmfetch(url, options);
  };
  module.exports.Cookies = Cookies;
  function nmfetch(url, options) {
    options = options || {};
    options.fetchRes = options.fetchRes || new PassThrough;
    options.cookies = options.cookies || new Cookies;
    options.redirects = options.redirects || 0;
    options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;
    if (options.cookie) {
      [].concat(options.cookie || []).forEach((cookie) => {
        options.cookies.set(cookie, url);
      });
      options.cookie = false;
    }
    let fetchRes = options.fetchRes;
    let parsed = urllib.parse(url);
    let method = (options.method || "").toString().trim().toUpperCase() || "GET";
    let finished = false;
    let cookies;
    let body;
    let handler = parsed.protocol === "https:" ? https : http;
    let headers = {
      "accept-encoding": "gzip,deflate",
      "user-agent": "nodemailer/" + packageData.version
    };
    Object.keys(options.headers || {}).forEach((key) => {
      headers[key.toLowerCase().trim()] = options.headers[key];
    });
    if (options.userAgent) {
      headers["user-agent"] = options.userAgent;
    }
    if (parsed.auth) {
      headers.Authorization = "Basic " + Buffer.from(parsed.auth).toString("base64");
    }
    if (cookies = options.cookies.get(url)) {
      headers.cookie = cookies;
    }
    if (options.body) {
      if (options.contentType !== false) {
        headers["Content-Type"] = options.contentType || "application/x-www-form-urlencoded";
      }
      if (typeof options.body.pipe === "function") {
        headers["Transfer-Encoding"] = "chunked";
        body = options.body;
        body.on("error", (err) => {
          if (finished) {
            return;
          }
          finished = true;
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
        });
      } else {
        if (options.body instanceof Buffer) {
          body = options.body;
        } else if (typeof options.body === "object") {
          try {
            body = Buffer.from(Object.keys(options.body).map((key) => {
              let value = options.body[key].toString().trim();
              return encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }).join("&"));
          } catch (E) {
            if (finished) {
              return;
            }
            finished = true;
            E.type = "FETCH";
            E.sourceUrl = url;
            fetchRes.emit("error", E);
            return;
          }
        } else {
          body = Buffer.from(options.body.toString().trim());
        }
        headers["Content-Type"] = options.contentType || "application/x-www-form-urlencoded";
        headers["Content-Length"] = body.length;
      }
      method = (options.method || "").toString().trim().toUpperCase() || "POST";
    }
    let req;
    let reqOptions = {
      method,
      host: parsed.hostname,
      path: parsed.path,
      port: parsed.port ? parsed.port : parsed.protocol === "https:" ? 443 : 80,
      headers,
      rejectUnauthorized: false,
      agent: false
    };
    if (options.tls) {
      Object.keys(options.tls).forEach((key) => {
        reqOptions[key] = options.tls[key];
      });
    }
    if (parsed.protocol === "https:" && parsed.hostname && parsed.hostname !== reqOptions.host && !net.isIP(parsed.hostname) && !reqOptions.servername) {
      reqOptions.servername = parsed.hostname;
    }
    try {
      req = handler.request(reqOptions);
    } catch (E) {
      finished = true;
      setImmediate(() => {
        E.type = "FETCH";
        E.sourceUrl = url;
        fetchRes.emit("error", E);
      });
      return fetchRes;
    }
    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        if (finished) {
          return;
        }
        finished = true;
        req.abort();
        let err = new Error("Request Timeout");
        err.type = "FETCH";
        err.sourceUrl = url;
        fetchRes.emit("error", err);
      });
    }
    req.on("error", (err) => {
      if (finished) {
        return;
      }
      finished = true;
      err.type = "FETCH";
      err.sourceUrl = url;
      fetchRes.emit("error", err);
    });
    req.on("response", (res) => {
      let inflate;
      if (finished) {
        return;
      }
      switch (res.headers["content-encoding"]) {
        case "gzip":
        case "deflate":
          inflate = zlib.createUnzip();
          break;
      }
      if (res.headers["set-cookie"]) {
        [].concat(res.headers["set-cookie"] || []).forEach((cookie) => {
          options.cookies.set(cookie, url);
        });
      }
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        options.redirects++;
        if (options.redirects > options.maxRedirects) {
          finished = true;
          let err = new Error("Maximum redirect count exceeded");
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
          req.abort();
          return;
        }
        options.method = "GET";
        options.body = false;
        return nmfetch(urllib.resolve(url, res.headers.location), options);
      }
      fetchRes.statusCode = res.statusCode;
      fetchRes.headers = res.headers;
      if (res.statusCode >= 300 && !options.allowErrorResponse) {
        finished = true;
        let err = new Error("Invalid status code " + res.statusCode);
        err.type = "FETCH";
        err.sourceUrl = url;
        fetchRes.emit("error", err);
        req.abort();
        return;
      }
      res.on("error", (err) => {
        if (finished) {
          return;
        }
        finished = true;
        err.type = "FETCH";
        err.sourceUrl = url;
        fetchRes.emit("error", err);
        req.abort();
      });
      if (inflate) {
        res.pipe(inflate).pipe(fetchRes);
        inflate.on("error", (err) => {
          if (finished) {
            return;
          }
          finished = true;
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
          req.abort();
        });
      } else {
        res.pipe(fetchRes);
      }
    });
    setImmediate(() => {
      if (body) {
        try {
          if (typeof body.pipe === "function") {
            return body.pipe(req);
          } else {
            req.write(body);
          }
        } catch (err) {
          finished = true;
          err.type = "FETCH";
          err.sourceUrl = url;
          fetchRes.emit("error", err);
          return;
        }
      }
      req.end();
    });
    return fetchRes;
  }
});

// node_modules/nodemailer/lib/shared/index.js
var require_shared = __commonJS((exports, module) => {
  var urllib = __require("url");
  var util = __require("util");
  var fs2 = __require("fs");
  var nmfetch = require_fetch();
  var dns = __require("dns");
  var net = __require("net");
  var os2 = __require("os");
  var DNS_TTL = 5 * 60 * 1000;
  var CACHE_CLEANUP_INTERVAL = 30 * 1000;
  var MAX_CACHE_SIZE = 1000;
  var lastCacheCleanup = 0;
  exports._lastCacheCleanup = () => lastCacheCleanup;
  exports._resetCacheCleanup = () => {
    lastCacheCleanup = 0;
  };
  var networkInterfaces;
  try {
    networkInterfaces = os2.networkInterfaces();
  } catch (_err) {}
  exports.networkInterfaces = networkInterfaces;
  var isFamilySupported = (family, allowInternal) => {
    let networkInterfaces2 = exports.networkInterfaces;
    if (!networkInterfaces2) {
      return true;
    }
    const familySupported = Object.keys(networkInterfaces2).map((key) => networkInterfaces2[key]).reduce((acc, val) => acc.concat(val), []).filter((i) => !i.internal || allowInternal).filter((i) => i.family === "IPv" + family || i.family === family).length > 0;
    return familySupported;
  };
  var resolver = (family, hostname, options, callback) => {
    options = options || {};
    const familySupported = isFamilySupported(family, options.allowInternalNetworkInterfaces);
    if (!familySupported) {
      return callback(null, []);
    }
    const resolver2 = dns.Resolver ? new dns.Resolver(options) : dns;
    resolver2["resolve" + family](hostname, (err, addresses) => {
      if (err) {
        switch (err.code) {
          case dns.NODATA:
          case dns.NOTFOUND:
          case dns.NOTIMP:
          case dns.SERVFAIL:
          case dns.CONNREFUSED:
          case dns.REFUSED:
          case "EAI_AGAIN":
            return callback(null, []);
        }
        return callback(err);
      }
      return callback(null, Array.isArray(addresses) ? addresses : [].concat(addresses || []));
    });
  };
  var dnsCache = exports.dnsCache = new Map;
  var formatDNSValue = (value, extra) => {
    if (!value) {
      return Object.assign({}, extra || {});
    }
    return Object.assign({
      servername: value.servername,
      host: !value.addresses || !value.addresses.length ? null : value.addresses.length === 1 ? value.addresses[0] : value.addresses[Math.floor(Math.random() * value.addresses.length)]
    }, extra || {});
  };
  exports.resolveHostname = (options, callback) => {
    options = options || {};
    if (!options.host && options.servername) {
      options.host = options.servername;
    }
    if (!options.host || net.isIP(options.host)) {
      let value = {
        addresses: [options.host],
        servername: options.servername || false
      };
      return callback(null, formatDNSValue(value, {
        cached: false
      }));
    }
    let cached;
    if (dnsCache.has(options.host)) {
      cached = dnsCache.get(options.host);
      const now = Date.now();
      if (now - lastCacheCleanup > CACHE_CLEANUP_INTERVAL) {
        lastCacheCleanup = now;
        for (const [host, entry] of dnsCache.entries()) {
          if (entry.expires && entry.expires < now) {
            dnsCache.delete(host);
          }
        }
        if (dnsCache.size > MAX_CACHE_SIZE) {
          const toDelete = Math.floor(MAX_CACHE_SIZE * 0.1);
          const keys = Array.from(dnsCache.keys()).slice(0, toDelete);
          keys.forEach((key) => dnsCache.delete(key));
        }
      }
      if (!cached.expires || cached.expires >= now) {
        return callback(null, formatDNSValue(cached.value, {
          cached: true
        }));
      }
    }
    resolver(4, options.host, options, (err, addresses) => {
      if (err) {
        if (cached) {
          dnsCache.set(options.host, {
            value: cached.value,
            expires: Date.now() + (options.dnsTtl || DNS_TTL)
          });
          return callback(null, formatDNSValue(cached.value, {
            cached: true,
            error: err
          }));
        }
        return callback(err);
      }
      if (addresses && addresses.length) {
        let value = {
          addresses,
          servername: options.servername || options.host
        };
        dnsCache.set(options.host, {
          value,
          expires: Date.now() + (options.dnsTtl || DNS_TTL)
        });
        return callback(null, formatDNSValue(value, {
          cached: false
        }));
      }
      resolver(6, options.host, options, (err2, addresses2) => {
        if (err2) {
          if (cached) {
            dnsCache.set(options.host, {
              value: cached.value,
              expires: Date.now() + (options.dnsTtl || DNS_TTL)
            });
            return callback(null, formatDNSValue(cached.value, {
              cached: true,
              error: err2
            }));
          }
          return callback(err2);
        }
        if (addresses2 && addresses2.length) {
          let value = {
            addresses: addresses2,
            servername: options.servername || options.host
          };
          dnsCache.set(options.host, {
            value,
            expires: Date.now() + (options.dnsTtl || DNS_TTL)
          });
          return callback(null, formatDNSValue(value, {
            cached: false
          }));
        }
        try {
          dns.lookup(options.host, { all: true }, (err3, addresses3) => {
            if (err3) {
              if (cached) {
                dnsCache.set(options.host, {
                  value: cached.value,
                  expires: Date.now() + (options.dnsTtl || DNS_TTL)
                });
                return callback(null, formatDNSValue(cached.value, {
                  cached: true,
                  error: err3
                }));
              }
              return callback(err3);
            }
            let address = addresses3 ? addresses3.filter((addr) => isFamilySupported(addr.family)).map((addr) => addr.address).shift() : false;
            if (addresses3 && addresses3.length && !address) {
              console.warn(`Failed to resolve IPv${addresses3[0].family} addresses with current network`);
            }
            if (!address && cached) {
              return callback(null, formatDNSValue(cached.value, {
                cached: true
              }));
            }
            let value = {
              addresses: address ? [address] : [options.host],
              servername: options.servername || options.host
            };
            dnsCache.set(options.host, {
              value,
              expires: Date.now() + (options.dnsTtl || DNS_TTL)
            });
            return callback(null, formatDNSValue(value, {
              cached: false
            }));
          });
        } catch (_err) {
          if (cached) {
            dnsCache.set(options.host, {
              value: cached.value,
              expires: Date.now() + (options.dnsTtl || DNS_TTL)
            });
            return callback(null, formatDNSValue(cached.value, {
              cached: true,
              error: err2
            }));
          }
          return callback(err2);
        }
      });
    });
  };
  exports.parseConnectionUrl = (str) => {
    str = str || "";
    let options = {};
    [urllib.parse(str, true)].forEach((url) => {
      let auth;
      switch (url.protocol) {
        case "smtp:":
          options.secure = false;
          break;
        case "smtps:":
          options.secure = true;
          break;
        case "direct:":
          options.direct = true;
          break;
      }
      if (!isNaN(url.port) && Number(url.port)) {
        options.port = Number(url.port);
      }
      if (url.hostname) {
        options.host = url.hostname;
      }
      if (url.auth) {
        auth = url.auth.split(":");
        if (!options.auth) {
          options.auth = {};
        }
        options.auth.user = auth.shift();
        options.auth.pass = auth.join(":");
      }
      Object.keys(url.query || {}).forEach((key) => {
        let obj = options;
        let lKey = key;
        let value = url.query[key];
        if (!isNaN(value)) {
          value = Number(value);
        }
        switch (value) {
          case "true":
            value = true;
            break;
          case "false":
            value = false;
            break;
        }
        if (key.indexOf("tls.") === 0) {
          lKey = key.substr(4);
          if (!options.tls) {
            options.tls = {};
          }
          obj = options.tls;
        } else if (key.indexOf(".") >= 0) {
          return;
        }
        if (!(lKey in obj)) {
          obj[lKey] = value;
        }
      });
    });
    return options;
  };
  exports._logFunc = (logger, level, defaults, data, message, ...args) => {
    let entry = {};
    Object.keys(defaults || {}).forEach((key) => {
      if (key !== "level") {
        entry[key] = defaults[key];
      }
    });
    Object.keys(data || {}).forEach((key) => {
      if (key !== "level") {
        entry[key] = data[key];
      }
    });
    logger[level](entry, message, ...args);
  };
  exports.getLogger = (options, defaults) => {
    options = options || {};
    let response = {};
    let levels = ["trace", "debug", "info", "warn", "error", "fatal"];
    if (!options.logger) {
      levels.forEach((level) => {
        response[level] = () => false;
      });
      return response;
    }
    let logger = options.logger;
    if (options.logger === true) {
      logger = createDefaultLogger(levels);
    }
    levels.forEach((level) => {
      response[level] = (data, message, ...args) => {
        exports._logFunc(logger, level, defaults, data, message, ...args);
      };
    });
    return response;
  };
  exports.callbackPromise = (resolve, reject) => function() {
    let args = Array.from(arguments);
    let err = args.shift();
    if (err) {
      reject(err);
    } else {
      resolve(...args);
    }
  };
  exports.parseDataURI = (uri) => {
    if (typeof uri !== "string") {
      return null;
    }
    if (!uri.startsWith("data:")) {
      return null;
    }
    const commaPos = uri.indexOf(",");
    if (commaPos === -1) {
      return null;
    }
    const data = uri.substring(commaPos + 1);
    const metaStr = uri.substring("data:".length, commaPos);
    let encoding;
    const metaEntries = metaStr.split(";");
    if (metaEntries.length > 0) {
      const lastEntry = metaEntries[metaEntries.length - 1].toLowerCase().trim();
      if (["base64", "utf8", "utf-8"].includes(lastEntry) && lastEntry.indexOf("=") === -1) {
        encoding = lastEntry;
        metaEntries.pop();
      }
    }
    const contentType = metaEntries.length > 0 ? metaEntries.shift() : "application/octet-stream";
    const params = {};
    for (let i = 0;i < metaEntries.length; i++) {
      const entry = metaEntries[i];
      const sepPos = entry.indexOf("=");
      if (sepPos > 0) {
        const key = entry.substring(0, sepPos).trim();
        const value = entry.substring(sepPos + 1).trim();
        if (key) {
          params[key] = value;
        }
      }
    }
    let bufferData;
    try {
      if (encoding === "base64") {
        bufferData = Buffer.from(data, "base64");
      } else {
        try {
          bufferData = Buffer.from(decodeURIComponent(data));
        } catch (_decodeError) {
          bufferData = Buffer.from(data);
        }
      }
    } catch (_bufferError) {
      bufferData = Buffer.alloc(0);
    }
    return {
      data: bufferData,
      encoding: encoding || null,
      contentType: contentType || "application/octet-stream",
      params
    };
  };
  exports.resolveContent = (data, key, callback) => {
    let promise;
    if (!callback) {
      promise = new Promise((resolve, reject) => {
        callback = exports.callbackPromise(resolve, reject);
      });
    }
    let content = data && data[key] && data[key].content || data[key];
    let contentStream;
    let encoding = (typeof data[key] === "object" && data[key].encoding || "utf8").toString().toLowerCase().replace(/[-_\s]/g, "");
    if (!content) {
      return callback(null, content);
    }
    if (typeof content === "object") {
      if (typeof content.pipe === "function") {
        return resolveStream(content, (err, value) => {
          if (err) {
            return callback(err);
          }
          if (data[key].content) {
            data[key].content = value;
          } else {
            data[key] = value;
          }
          callback(null, value);
        });
      } else if (/^https?:\/\//i.test(content.path || content.href)) {
        contentStream = nmfetch(content.path || content.href);
        return resolveStream(contentStream, callback);
      } else if (/^data:/i.test(content.path || content.href)) {
        let parsedDataUri = exports.parseDataURI(content.path || content.href);
        if (!parsedDataUri || !parsedDataUri.data) {
          return callback(null, Buffer.from(0));
        }
        return callback(null, parsedDataUri.data);
      } else if (content.path) {
        return resolveStream(fs2.createReadStream(content.path), callback);
      }
    }
    if (typeof data[key].content === "string" && !["utf8", "usascii", "ascii"].includes(encoding)) {
      content = Buffer.from(data[key].content, encoding);
    }
    setImmediate(() => callback(null, content));
    return promise;
  };
  exports.assign = function() {
    let args = Array.from(arguments);
    let target = args.shift() || {};
    args.forEach((source) => {
      Object.keys(source || {}).forEach((key) => {
        if (["tls", "auth"].includes(key) && source[key] && typeof source[key] === "object") {
          if (!target[key]) {
            target[key] = {};
          }
          Object.keys(source[key]).forEach((subKey) => {
            target[key][subKey] = source[key][subKey];
          });
        } else {
          target[key] = source[key];
        }
      });
    });
    return target;
  };
  exports.encodeXText = (str) => {
    if (!/[^\x21-\x2A\x2C-\x3C\x3E-\x7E]/.test(str)) {
      return str;
    }
    let buf = Buffer.from(str);
    let result = "";
    for (let i = 0, len = buf.length;i < len; i++) {
      let c = buf[i];
      if (c < 33 || c > 126 || c === 43 || c === 61) {
        result += "+" + (c < 16 ? "0" : "") + c.toString(16).toUpperCase();
      } else {
        result += String.fromCharCode(c);
      }
    }
    return result;
  };
  function resolveStream(stream, callback) {
    let responded = false;
    let chunks = [];
    let chunklen = 0;
    stream.on("error", (err) => {
      if (responded) {
        return;
      }
      responded = true;
      callback(err);
    });
    stream.on("readable", () => {
      let chunk;
      while ((chunk = stream.read()) !== null) {
        chunks.push(chunk);
        chunklen += chunk.length;
      }
    });
    stream.on("end", () => {
      if (responded) {
        return;
      }
      responded = true;
      let value;
      try {
        value = Buffer.concat(chunks, chunklen);
      } catch (E) {
        return callback(E);
      }
      callback(null, value);
    });
  }
  function createDefaultLogger(levels) {
    let levelMaxLen = 0;
    let levelNames = new Map;
    levels.forEach((level) => {
      if (level.length > levelMaxLen) {
        levelMaxLen = level.length;
      }
    });
    levels.forEach((level) => {
      let levelName = level.toUpperCase();
      if (levelName.length < levelMaxLen) {
        levelName += " ".repeat(levelMaxLen - levelName.length);
      }
      levelNames.set(level, levelName);
    });
    let print = (level, entry, message, ...args) => {
      let prefix = "";
      if (entry) {
        if (entry.tnx === "server") {
          prefix = "S: ";
        } else if (entry.tnx === "client") {
          prefix = "C: ";
        }
        if (entry.sid) {
          prefix = "[" + entry.sid + "] " + prefix;
        }
        if (entry.cid) {
          prefix = "[#" + entry.cid + "] " + prefix;
        }
      }
      message = util.format(message, ...args);
      message.split(/\r?\n/).forEach((line) => {
        console.log("[%s] %s %s", new Date().toISOString().substr(0, 19).replace(/T/, " "), levelNames.get(level), prefix + line);
      });
    };
    let logger = {};
    levels.forEach((level) => {
      logger[level] = print.bind(null, level);
    });
    return logger;
  }
});

// node_modules/nodemailer/lib/mime-funcs/mime-types.js
var require_mime_types = __commonJS((exports, module) => {
  var path2 = __require("path");
  var defaultMimeType = "application/octet-stream";
  var defaultExtension = "bin";
  var mimeTypes = new Map([
    ["application/acad", "dwg"],
    ["application/applixware", "aw"],
    ["application/arj", "arj"],
    ["application/atom+xml", "xml"],
    ["application/atomcat+xml", "atomcat"],
    ["application/atomsvc+xml", "atomsvc"],
    ["application/base64", ["mm", "mme"]],
    ["application/binhex", "hqx"],
    ["application/binhex4", "hqx"],
    ["application/book", ["book", "boo"]],
    ["application/ccxml+xml,", "ccxml"],
    ["application/cdf", "cdf"],
    ["application/cdmi-capability", "cdmia"],
    ["application/cdmi-container", "cdmic"],
    ["application/cdmi-domain", "cdmid"],
    ["application/cdmi-object", "cdmio"],
    ["application/cdmi-queue", "cdmiq"],
    ["application/clariscad", "ccad"],
    ["application/commonground", "dp"],
    ["application/cu-seeme", "cu"],
    ["application/davmount+xml", "davmount"],
    ["application/drafting", "drw"],
    ["application/dsptype", "tsp"],
    ["application/dssc+der", "dssc"],
    ["application/dssc+xml", "xdssc"],
    ["application/dxf", "dxf"],
    ["application/ecmascript", ["js", "es"]],
    ["application/emma+xml", "emma"],
    ["application/envoy", "evy"],
    ["application/epub+zip", "epub"],
    ["application/excel", ["xls", "xl", "xla", "xlb", "xlc", "xld", "xlk", "xll", "xlm", "xlt", "xlv", "xlw"]],
    ["application/exi", "exi"],
    ["application/font-tdpfr", "pfr"],
    ["application/fractals", "fif"],
    ["application/freeloader", "frl"],
    ["application/futuresplash", "spl"],
    ["application/geo+json", "geojson"],
    ["application/gnutar", "tgz"],
    ["application/groupwise", "vew"],
    ["application/hlp", "hlp"],
    ["application/hta", "hta"],
    ["application/hyperstudio", "stk"],
    ["application/i-deas", "unv"],
    ["application/iges", ["iges", "igs"]],
    ["application/inf", "inf"],
    ["application/internet-property-stream", "acx"],
    ["application/ipfix", "ipfix"],
    ["application/java", "class"],
    ["application/java-archive", "jar"],
    ["application/java-byte-code", "class"],
    ["application/java-serialized-object", "ser"],
    ["application/java-vm", "class"],
    ["application/javascript", "js"],
    ["application/json", "json"],
    ["application/lha", "lha"],
    ["application/lzx", "lzx"],
    ["application/mac-binary", "bin"],
    ["application/mac-binhex", "hqx"],
    ["application/mac-binhex40", "hqx"],
    ["application/mac-compactpro", "cpt"],
    ["application/macbinary", "bin"],
    ["application/mads+xml", "mads"],
    ["application/marc", "mrc"],
    ["application/marcxml+xml", "mrcx"],
    ["application/mathematica", "ma"],
    ["application/mathml+xml", "mathml"],
    ["application/mbedlet", "mbd"],
    ["application/mbox", "mbox"],
    ["application/mcad", "mcd"],
    ["application/mediaservercontrol+xml", "mscml"],
    ["application/metalink4+xml", "meta4"],
    ["application/mets+xml", "mets"],
    ["application/mime", "aps"],
    ["application/mods+xml", "mods"],
    ["application/mp21", "m21"],
    ["application/mp4", "mp4"],
    ["application/mspowerpoint", ["ppt", "pot", "pps", "ppz"]],
    ["application/msword", ["doc", "dot", "w6w", "wiz", "word"]],
    ["application/mswrite", "wri"],
    ["application/mxf", "mxf"],
    ["application/netmc", "mcp"],
    ["application/octet-stream", ["*"]],
    ["application/oda", "oda"],
    ["application/oebps-package+xml", "opf"],
    ["application/ogg", "ogx"],
    ["application/olescript", "axs"],
    ["application/onenote", "onetoc"],
    ["application/patch-ops-error+xml", "xer"],
    ["application/pdf", "pdf"],
    ["application/pgp-encrypted", "asc"],
    ["application/pgp-signature", "pgp"],
    ["application/pics-rules", "prf"],
    ["application/pkcs-12", "p12"],
    ["application/pkcs-crl", "crl"],
    ["application/pkcs10", "p10"],
    ["application/pkcs7-mime", ["p7c", "p7m"]],
    ["application/pkcs7-signature", "p7s"],
    ["application/pkcs8", "p8"],
    ["application/pkix-attr-cert", "ac"],
    ["application/pkix-cert", ["cer", "crt"]],
    ["application/pkix-crl", "crl"],
    ["application/pkix-pkipath", "pkipath"],
    ["application/pkixcmp", "pki"],
    ["application/plain", "text"],
    ["application/pls+xml", "pls"],
    ["application/postscript", ["ps", "ai", "eps"]],
    ["application/powerpoint", "ppt"],
    ["application/pro_eng", ["part", "prt"]],
    ["application/prs.cww", "cww"],
    ["application/pskc+xml", "pskcxml"],
    ["application/rdf+xml", "rdf"],
    ["application/reginfo+xml", "rif"],
    ["application/relax-ng-compact-syntax", "rnc"],
    ["application/resource-lists+xml", "rl"],
    ["application/resource-lists-diff+xml", "rld"],
    ["application/ringing-tones", "rng"],
    ["application/rls-services+xml", "rs"],
    ["application/rsd+xml", "rsd"],
    ["application/rss+xml", "xml"],
    ["application/rtf", ["rtf", "rtx"]],
    ["application/sbml+xml", "sbml"],
    ["application/scvp-cv-request", "scq"],
    ["application/scvp-cv-response", "scs"],
    ["application/scvp-vp-request", "spq"],
    ["application/scvp-vp-response", "spp"],
    ["application/sdp", "sdp"],
    ["application/sea", "sea"],
    ["application/set", "set"],
    ["application/set-payment-initiation", "setpay"],
    ["application/set-registration-initiation", "setreg"],
    ["application/shf+xml", "shf"],
    ["application/sla", "stl"],
    ["application/smil", ["smi", "smil"]],
    ["application/smil+xml", "smi"],
    ["application/solids", "sol"],
    ["application/sounder", "sdr"],
    ["application/sparql-query", "rq"],
    ["application/sparql-results+xml", "srx"],
    ["application/srgs", "gram"],
    ["application/srgs+xml", "grxml"],
    ["application/sru+xml", "sru"],
    ["application/ssml+xml", "ssml"],
    ["application/step", ["step", "stp"]],
    ["application/streamingmedia", "ssm"],
    ["application/tei+xml", "tei"],
    ["application/thraud+xml", "tfi"],
    ["application/timestamped-data", "tsd"],
    ["application/toolbook", "tbk"],
    ["application/vda", "vda"],
    ["application/vnd.3gpp.pic-bw-large", "plb"],
    ["application/vnd.3gpp.pic-bw-small", "psb"],
    ["application/vnd.3gpp.pic-bw-var", "pvb"],
    ["application/vnd.3gpp2.tcap", "tcap"],
    ["application/vnd.3m.post-it-notes", "pwn"],
    ["application/vnd.accpac.simply.aso", "aso"],
    ["application/vnd.accpac.simply.imp", "imp"],
    ["application/vnd.acucobol", "acu"],
    ["application/vnd.acucorp", "atc"],
    ["application/vnd.adobe.air-application-installer-package+zip", "air"],
    ["application/vnd.adobe.fxp", "fxp"],
    ["application/vnd.adobe.xdp+xml", "xdp"],
    ["application/vnd.adobe.xfdf", "xfdf"],
    ["application/vnd.ahead.space", "ahead"],
    ["application/vnd.airzip.filesecure.azf", "azf"],
    ["application/vnd.airzip.filesecure.azs", "azs"],
    ["application/vnd.amazon.ebook", "azw"],
    ["application/vnd.americandynamics.acc", "acc"],
    ["application/vnd.amiga.ami", "ami"],
    ["application/vnd.android.package-archive", "apk"],
    ["application/vnd.anser-web-certificate-issue-initiation", "cii"],
    ["application/vnd.anser-web-funds-transfer-initiation", "fti"],
    ["application/vnd.antix.game-component", "atx"],
    ["application/vnd.apple.installer+xml", "mpkg"],
    ["application/vnd.apple.mpegurl", "m3u8"],
    ["application/vnd.aristanetworks.swi", "swi"],
    ["application/vnd.audiograph", "aep"],
    ["application/vnd.blueice.multipass", "mpm"],
    ["application/vnd.bmi", "bmi"],
    ["application/vnd.businessobjects", "rep"],
    ["application/vnd.chemdraw+xml", "cdxml"],
    ["application/vnd.chipnuts.karaoke-mmd", "mmd"],
    ["application/vnd.cinderella", "cdy"],
    ["application/vnd.claymore", "cla"],
    ["application/vnd.cloanto.rp9", "rp9"],
    ["application/vnd.clonk.c4group", "c4g"],
    ["application/vnd.cluetrust.cartomobile-config", "c11amc"],
    ["application/vnd.cluetrust.cartomobile-config-pkg", "c11amz"],
    ["application/vnd.commonspace", "csp"],
    ["application/vnd.contact.cmsg", "cdbcmsg"],
    ["application/vnd.cosmocaller", "cmc"],
    ["application/vnd.crick.clicker", "clkx"],
    ["application/vnd.crick.clicker.keyboard", "clkk"],
    ["application/vnd.crick.clicker.palette", "clkp"],
    ["application/vnd.crick.clicker.template", "clkt"],
    ["application/vnd.crick.clicker.wordbank", "clkw"],
    ["application/vnd.criticaltools.wbs+xml", "wbs"],
    ["application/vnd.ctc-posml", "pml"],
    ["application/vnd.cups-ppd", "ppd"],
    ["application/vnd.curl.car", "car"],
    ["application/vnd.curl.pcurl", "pcurl"],
    ["application/vnd.data-vision.rdz", "rdz"],
    ["application/vnd.denovo.fcselayout-link", "fe_launch"],
    ["application/vnd.dna", "dna"],
    ["application/vnd.dolby.mlp", "mlp"],
    ["application/vnd.dpgraph", "dpg"],
    ["application/vnd.dreamfactory", "dfac"],
    ["application/vnd.dvb.ait", "ait"],
    ["application/vnd.dvb.service", "svc"],
    ["application/vnd.dynageo", "geo"],
    ["application/vnd.ecowin.chart", "mag"],
    ["application/vnd.enliven", "nml"],
    ["application/vnd.epson.esf", "esf"],
    ["application/vnd.epson.msf", "msf"],
    ["application/vnd.epson.quickanime", "qam"],
    ["application/vnd.epson.salt", "slt"],
    ["application/vnd.epson.ssf", "ssf"],
    ["application/vnd.eszigno3+xml", "es3"],
    ["application/vnd.ezpix-album", "ez2"],
    ["application/vnd.ezpix-package", "ez3"],
    ["application/vnd.fdf", "fdf"],
    ["application/vnd.fdsn.seed", "seed"],
    ["application/vnd.flographit", "gph"],
    ["application/vnd.fluxtime.clip", "ftc"],
    ["application/vnd.framemaker", "fm"],
    ["application/vnd.frogans.fnc", "fnc"],
    ["application/vnd.frogans.ltf", "ltf"],
    ["application/vnd.fsc.weblaunch", "fsc"],
    ["application/vnd.fujitsu.oasys", "oas"],
    ["application/vnd.fujitsu.oasys2", "oa2"],
    ["application/vnd.fujitsu.oasys3", "oa3"],
    ["application/vnd.fujitsu.oasysgp", "fg5"],
    ["application/vnd.fujitsu.oasysprs", "bh2"],
    ["application/vnd.fujixerox.ddd", "ddd"],
    ["application/vnd.fujixerox.docuworks", "xdw"],
    ["application/vnd.fujixerox.docuworks.binder", "xbd"],
    ["application/vnd.fuzzysheet", "fzs"],
    ["application/vnd.genomatix.tuxedo", "txd"],
    ["application/vnd.geogebra.file", "ggb"],
    ["application/vnd.geogebra.tool", "ggt"],
    ["application/vnd.geometry-explorer", "gex"],
    ["application/vnd.geonext", "gxt"],
    ["application/vnd.geoplan", "g2w"],
    ["application/vnd.geospace", "g3w"],
    ["application/vnd.gmx", "gmx"],
    ["application/vnd.google-earth.kml+xml", "kml"],
    ["application/vnd.google-earth.kmz", "kmz"],
    ["application/vnd.grafeq", "gqf"],
    ["application/vnd.groove-account", "gac"],
    ["application/vnd.groove-help", "ghf"],
    ["application/vnd.groove-identity-message", "gim"],
    ["application/vnd.groove-injector", "grv"],
    ["application/vnd.groove-tool-message", "gtm"],
    ["application/vnd.groove-tool-template", "tpl"],
    ["application/vnd.groove-vcard", "vcg"],
    ["application/vnd.hal+xml", "hal"],
    ["application/vnd.handheld-entertainment+xml", "zmm"],
    ["application/vnd.hbci", "hbci"],
    ["application/vnd.hhe.lesson-player", "les"],
    ["application/vnd.hp-hpgl", ["hgl", "hpg", "hpgl"]],
    ["application/vnd.hp-hpid", "hpid"],
    ["application/vnd.hp-hps", "hps"],
    ["application/vnd.hp-jlyt", "jlt"],
    ["application/vnd.hp-pcl", "pcl"],
    ["application/vnd.hp-pclxl", "pclxl"],
    ["application/vnd.hydrostatix.sof-data", "sfd-hdstx"],
    ["application/vnd.hzn-3d-crossword", "x3d"],
    ["application/vnd.ibm.minipay", "mpy"],
    ["application/vnd.ibm.modcap", "afp"],
    ["application/vnd.ibm.rights-management", "irm"],
    ["application/vnd.ibm.secure-container", "sc"],
    ["application/vnd.iccprofile", "icc"],
    ["application/vnd.igloader", "igl"],
    ["application/vnd.immervision-ivp", "ivp"],
    ["application/vnd.immervision-ivu", "ivu"],
    ["application/vnd.insors.igm", "igm"],
    ["application/vnd.intercon.formnet", "xpw"],
    ["application/vnd.intergeo", "i2g"],
    ["application/vnd.intu.qbo", "qbo"],
    ["application/vnd.intu.qfx", "qfx"],
    ["application/vnd.ipunplugged.rcprofile", "rcprofile"],
    ["application/vnd.irepository.package+xml", "irp"],
    ["application/vnd.is-xpr", "xpr"],
    ["application/vnd.isac.fcs", "fcs"],
    ["application/vnd.jam", "jam"],
    ["application/vnd.jcp.javame.midlet-rms", "rms"],
    ["application/vnd.jisp", "jisp"],
    ["application/vnd.joost.joda-archive", "joda"],
    ["application/vnd.kahootz", "ktz"],
    ["application/vnd.kde.karbon", "karbon"],
    ["application/vnd.kde.kchart", "chrt"],
    ["application/vnd.kde.kformula", "kfo"],
    ["application/vnd.kde.kivio", "flw"],
    ["application/vnd.kde.kontour", "kon"],
    ["application/vnd.kde.kpresenter", "kpr"],
    ["application/vnd.kde.kspread", "ksp"],
    ["application/vnd.kde.kword", "kwd"],
    ["application/vnd.kenameaapp", "htke"],
    ["application/vnd.kidspiration", "kia"],
    ["application/vnd.kinar", "kne"],
    ["application/vnd.koan", "skp"],
    ["application/vnd.kodak-descriptor", "sse"],
    ["application/vnd.las.las+xml", "lasxml"],
    ["application/vnd.llamagraphics.life-balance.desktop", "lbd"],
    ["application/vnd.llamagraphics.life-balance.exchange+xml", "lbe"],
    ["application/vnd.lotus-1-2-3", "123"],
    ["application/vnd.lotus-approach", "apr"],
    ["application/vnd.lotus-freelance", "pre"],
    ["application/vnd.lotus-notes", "nsf"],
    ["application/vnd.lotus-organizer", "org"],
    ["application/vnd.lotus-screencam", "scm"],
    ["application/vnd.lotus-wordpro", "lwp"],
    ["application/vnd.macports.portpkg", "portpkg"],
    ["application/vnd.mcd", "mcd"],
    ["application/vnd.medcalcdata", "mc1"],
    ["application/vnd.mediastation.cdkey", "cdkey"],
    ["application/vnd.mfer", "mwf"],
    ["application/vnd.mfmp", "mfm"],
    ["application/vnd.micrografx.flo", "flo"],
    ["application/vnd.micrografx.igx", "igx"],
    ["application/vnd.mif", "mif"],
    ["application/vnd.mobius.daf", "daf"],
    ["application/vnd.mobius.dis", "dis"],
    ["application/vnd.mobius.mbk", "mbk"],
    ["application/vnd.mobius.mqy", "mqy"],
    ["application/vnd.mobius.msl", "msl"],
    ["application/vnd.mobius.plc", "plc"],
    ["application/vnd.mobius.txf", "txf"],
    ["application/vnd.mophun.application", "mpn"],
    ["application/vnd.mophun.certificate", "mpc"],
    ["application/vnd.mozilla.xul+xml", "xul"],
    ["application/vnd.ms-artgalry", "cil"],
    ["application/vnd.ms-cab-compressed", "cab"],
    ["application/vnd.ms-excel", ["xls", "xla", "xlc", "xlm", "xlt", "xlw", "xlb", "xll"]],
    ["application/vnd.ms-excel.addin.macroenabled.12", "xlam"],
    ["application/vnd.ms-excel.sheet.binary.macroenabled.12", "xlsb"],
    ["application/vnd.ms-excel.sheet.macroenabled.12", "xlsm"],
    ["application/vnd.ms-excel.template.macroenabled.12", "xltm"],
    ["application/vnd.ms-fontobject", "eot"],
    ["application/vnd.ms-htmlhelp", "chm"],
    ["application/vnd.ms-ims", "ims"],
    ["application/vnd.ms-lrm", "lrm"],
    ["application/vnd.ms-officetheme", "thmx"],
    ["application/vnd.ms-outlook", "msg"],
    ["application/vnd.ms-pki.certstore", "sst"],
    ["application/vnd.ms-pki.pko", "pko"],
    ["application/vnd.ms-pki.seccat", "cat"],
    ["application/vnd.ms-pki.stl", "stl"],
    ["application/vnd.ms-pkicertstore", "sst"],
    ["application/vnd.ms-pkiseccat", "cat"],
    ["application/vnd.ms-pkistl", "stl"],
    ["application/vnd.ms-powerpoint", ["ppt", "pot", "pps", "ppa", "pwz"]],
    ["application/vnd.ms-powerpoint.addin.macroenabled.12", "ppam"],
    ["application/vnd.ms-powerpoint.presentation.macroenabled.12", "pptm"],
    ["application/vnd.ms-powerpoint.slide.macroenabled.12", "sldm"],
    ["application/vnd.ms-powerpoint.slideshow.macroenabled.12", "ppsm"],
    ["application/vnd.ms-powerpoint.template.macroenabled.12", "potm"],
    ["application/vnd.ms-project", "mpp"],
    ["application/vnd.ms-word.document.macroenabled.12", "docm"],
    ["application/vnd.ms-word.template.macroenabled.12", "dotm"],
    ["application/vnd.ms-works", ["wks", "wcm", "wdb", "wps"]],
    ["application/vnd.ms-wpl", "wpl"],
    ["application/vnd.ms-xpsdocument", "xps"],
    ["application/vnd.mseq", "mseq"],
    ["application/vnd.musician", "mus"],
    ["application/vnd.muvee.style", "msty"],
    ["application/vnd.neurolanguage.nlu", "nlu"],
    ["application/vnd.noblenet-directory", "nnd"],
    ["application/vnd.noblenet-sealer", "nns"],
    ["application/vnd.noblenet-web", "nnw"],
    ["application/vnd.nokia.configuration-message", "ncm"],
    ["application/vnd.nokia.n-gage.data", "ngdat"],
    ["application/vnd.nokia.n-gage.symbian.install", "n-gage"],
    ["application/vnd.nokia.radio-preset", "rpst"],
    ["application/vnd.nokia.radio-presets", "rpss"],
    ["application/vnd.nokia.ringing-tone", "rng"],
    ["application/vnd.novadigm.edm", "edm"],
    ["application/vnd.novadigm.edx", "edx"],
    ["application/vnd.novadigm.ext", "ext"],
    ["application/vnd.oasis.opendocument.chart", "odc"],
    ["application/vnd.oasis.opendocument.chart-template", "otc"],
    ["application/vnd.oasis.opendocument.database", "odb"],
    ["application/vnd.oasis.opendocument.formula", "odf"],
    ["application/vnd.oasis.opendocument.formula-template", "odft"],
    ["application/vnd.oasis.opendocument.graphics", "odg"],
    ["application/vnd.oasis.opendocument.graphics-template", "otg"],
    ["application/vnd.oasis.opendocument.image", "odi"],
    ["application/vnd.oasis.opendocument.image-template", "oti"],
    ["application/vnd.oasis.opendocument.presentation", "odp"],
    ["application/vnd.oasis.opendocument.presentation-template", "otp"],
    ["application/vnd.oasis.opendocument.spreadsheet", "ods"],
    ["application/vnd.oasis.opendocument.spreadsheet-template", "ots"],
    ["application/vnd.oasis.opendocument.text", "odt"],
    ["application/vnd.oasis.opendocument.text-master", "odm"],
    ["application/vnd.oasis.opendocument.text-template", "ott"],
    ["application/vnd.oasis.opendocument.text-web", "oth"],
    ["application/vnd.olpc-sugar", "xo"],
    ["application/vnd.oma.dd2+xml", "dd2"],
    ["application/vnd.openofficeorg.extension", "oxt"],
    ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
    ["application/vnd.openxmlformats-officedocument.presentationml.slide", "sldx"],
    ["application/vnd.openxmlformats-officedocument.presentationml.slideshow", "ppsx"],
    ["application/vnd.openxmlformats-officedocument.presentationml.template", "potx"],
    ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
    ["application/vnd.openxmlformats-officedocument.spreadsheetml.template", "xltx"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.template", "dotx"],
    ["application/vnd.osgeo.mapguide.package", "mgp"],
    ["application/vnd.osgi.dp", "dp"],
    ["application/vnd.palm", "pdb"],
    ["application/vnd.pawaafile", "paw"],
    ["application/vnd.pg.format", "str"],
    ["application/vnd.pg.osasli", "ei6"],
    ["application/vnd.picsel", "efif"],
    ["application/vnd.pmi.widget", "wg"],
    ["application/vnd.pocketlearn", "plf"],
    ["application/vnd.powerbuilder6", "pbd"],
    ["application/vnd.previewsystems.box", "box"],
    ["application/vnd.proteus.magazine", "mgz"],
    ["application/vnd.publishare-delta-tree", "qps"],
    ["application/vnd.pvi.ptid1", "ptid"],
    ["application/vnd.quark.quarkxpress", "qxd"],
    ["application/vnd.realvnc.bed", "bed"],
    ["application/vnd.recordare.musicxml", "mxl"],
    ["application/vnd.recordare.musicxml+xml", "musicxml"],
    ["application/vnd.rig.cryptonote", "cryptonote"],
    ["application/vnd.rim.cod", "cod"],
    ["application/vnd.rn-realmedia", "rm"],
    ["application/vnd.rn-realplayer", "rnx"],
    ["application/vnd.route66.link66+xml", "link66"],
    ["application/vnd.sailingtracker.track", "st"],
    ["application/vnd.seemail", "see"],
    ["application/vnd.sema", "sema"],
    ["application/vnd.semd", "semd"],
    ["application/vnd.semf", "semf"],
    ["application/vnd.shana.informed.formdata", "ifm"],
    ["application/vnd.shana.informed.formtemplate", "itp"],
    ["application/vnd.shana.informed.interchange", "iif"],
    ["application/vnd.shana.informed.package", "ipk"],
    ["application/vnd.simtech-mindmapper", "twd"],
    ["application/vnd.smaf", "mmf"],
    ["application/vnd.smart.teacher", "teacher"],
    ["application/vnd.solent.sdkm+xml", "sdkm"],
    ["application/vnd.spotfire.dxp", "dxp"],
    ["application/vnd.spotfire.sfs", "sfs"],
    ["application/vnd.stardivision.calc", "sdc"],
    ["application/vnd.stardivision.draw", "sda"],
    ["application/vnd.stardivision.impress", "sdd"],
    ["application/vnd.stardivision.math", "smf"],
    ["application/vnd.stardivision.writer", "sdw"],
    ["application/vnd.stardivision.writer-global", "sgl"],
    ["application/vnd.stepmania.stepchart", "sm"],
    ["application/vnd.sun.xml.calc", "sxc"],
    ["application/vnd.sun.xml.calc.template", "stc"],
    ["application/vnd.sun.xml.draw", "sxd"],
    ["application/vnd.sun.xml.draw.template", "std"],
    ["application/vnd.sun.xml.impress", "sxi"],
    ["application/vnd.sun.xml.impress.template", "sti"],
    ["application/vnd.sun.xml.math", "sxm"],
    ["application/vnd.sun.xml.writer", "sxw"],
    ["application/vnd.sun.xml.writer.global", "sxg"],
    ["application/vnd.sun.xml.writer.template", "stw"],
    ["application/vnd.sus-calendar", "sus"],
    ["application/vnd.svd", "svd"],
    ["application/vnd.symbian.install", "sis"],
    ["application/vnd.syncml+xml", "xsm"],
    ["application/vnd.syncml.dm+wbxml", "bdm"],
    ["application/vnd.syncml.dm+xml", "xdm"],
    ["application/vnd.tao.intent-module-archive", "tao"],
    ["application/vnd.tmobile-livetv", "tmo"],
    ["application/vnd.trid.tpt", "tpt"],
    ["application/vnd.triscape.mxs", "mxs"],
    ["application/vnd.trueapp", "tra"],
    ["application/vnd.ufdl", "ufd"],
    ["application/vnd.uiq.theme", "utz"],
    ["application/vnd.umajin", "umj"],
    ["application/vnd.unity", "unityweb"],
    ["application/vnd.uoml+xml", "uoml"],
    ["application/vnd.vcx", "vcx"],
    ["application/vnd.visio", "vsd"],
    ["application/vnd.visionary", "vis"],
    ["application/vnd.vsf", "vsf"],
    ["application/vnd.wap.wbxml", "wbxml"],
    ["application/vnd.wap.wmlc", "wmlc"],
    ["application/vnd.wap.wmlscriptc", "wmlsc"],
    ["application/vnd.webturbo", "wtb"],
    ["application/vnd.wolfram.player", "nbp"],
    ["application/vnd.wordperfect", "wpd"],
    ["application/vnd.wqd", "wqd"],
    ["application/vnd.wt.stf", "stf"],
    ["application/vnd.xara", ["web", "xar"]],
    ["application/vnd.xfdl", "xfdl"],
    ["application/vnd.yamaha.hv-dic", "hvd"],
    ["application/vnd.yamaha.hv-script", "hvs"],
    ["application/vnd.yamaha.hv-voice", "hvp"],
    ["application/vnd.yamaha.openscoreformat", "osf"],
    ["application/vnd.yamaha.openscoreformat.osfpvg+xml", "osfpvg"],
    ["application/vnd.yamaha.smaf-audio", "saf"],
    ["application/vnd.yamaha.smaf-phrase", "spf"],
    ["application/vnd.yellowriver-custom-menu", "cmp"],
    ["application/vnd.zul", "zir"],
    ["application/vnd.zzazz.deck+xml", "zaz"],
    ["application/vocaltec-media-desc", "vmd"],
    ["application/vocaltec-media-file", "vmf"],
    ["application/voicexml+xml", "vxml"],
    ["application/widget", "wgt"],
    ["application/winhlp", "hlp"],
    ["application/wordperfect", ["wp", "wp5", "wp6", "wpd"]],
    ["application/wordperfect6.0", ["w60", "wp5"]],
    ["application/wordperfect6.1", "w61"],
    ["application/wsdl+xml", "wsdl"],
    ["application/wspolicy+xml", "wspolicy"],
    ["application/x-123", "wk1"],
    ["application/x-7z-compressed", "7z"],
    ["application/x-abiword", "abw"],
    ["application/x-ace-compressed", "ace"],
    ["application/x-aim", "aim"],
    ["application/x-authorware-bin", "aab"],
    ["application/x-authorware-map", "aam"],
    ["application/x-authorware-seg", "aas"],
    ["application/x-bcpio", "bcpio"],
    ["application/x-binary", "bin"],
    ["application/x-binhex40", "hqx"],
    ["application/x-bittorrent", "torrent"],
    ["application/x-bsh", ["bsh", "sh", "shar"]],
    ["application/x-bytecode.elisp", "elc"],
    ["application/x-bytecode.python", "pyc"],
    ["application/x-bzip", "bz"],
    ["application/x-bzip2", ["boz", "bz2"]],
    ["application/x-cdf", "cdf"],
    ["application/x-cdlink", "vcd"],
    ["application/x-chat", ["cha", "chat"]],
    ["application/x-chess-pgn", "pgn"],
    ["application/x-cmu-raster", "ras"],
    ["application/x-cocoa", "cco"],
    ["application/x-compactpro", "cpt"],
    ["application/x-compress", "z"],
    ["application/x-compressed", ["tgz", "gz", "z", "zip"]],
    ["application/x-conference", "nsc"],
    ["application/x-cpio", "cpio"],
    ["application/x-cpt", "cpt"],
    ["application/x-csh", "csh"],
    ["application/x-debian-package", "deb"],
    ["application/x-deepv", "deepv"],
    ["application/x-director", ["dir", "dcr", "dxr"]],
    ["application/x-doom", "wad"],
    ["application/x-dtbncx+xml", "ncx"],
    ["application/x-dtbook+xml", "dtb"],
    ["application/x-dtbresource+xml", "res"],
    ["application/x-dvi", "dvi"],
    ["application/x-elc", "elc"],
    ["application/x-envoy", ["env", "evy"]],
    ["application/x-esrehber", "es"],
    ["application/x-excel", ["xls", "xla", "xlb", "xlc", "xld", "xlk", "xll", "xlm", "xlt", "xlv", "xlw"]],
    ["application/x-font-bdf", "bdf"],
    ["application/x-font-ghostscript", "gsf"],
    ["application/x-font-linux-psf", "psf"],
    ["application/x-font-otf", "otf"],
    ["application/x-font-pcf", "pcf"],
    ["application/x-font-snf", "snf"],
    ["application/x-font-ttf", "ttf"],
    ["application/x-font-type1", "pfa"],
    ["application/x-font-woff", "woff"],
    ["application/x-frame", "mif"],
    ["application/x-freelance", "pre"],
    ["application/x-futuresplash", "spl"],
    ["application/x-gnumeric", "gnumeric"],
    ["application/x-gsp", "gsp"],
    ["application/x-gss", "gss"],
    ["application/x-gtar", "gtar"],
    ["application/x-gzip", ["gz", "gzip"]],
    ["application/x-hdf", "hdf"],
    ["application/x-helpfile", ["help", "hlp"]],
    ["application/x-httpd-imap", "imap"],
    ["application/x-ima", "ima"],
    ["application/x-internet-signup", ["ins", "isp"]],
    ["application/x-internett-signup", "ins"],
    ["application/x-inventor", "iv"],
    ["application/x-ip2", "ip"],
    ["application/x-iphone", "iii"],
    ["application/x-java-class", "class"],
    ["application/x-java-commerce", "jcm"],
    ["application/x-java-jnlp-file", "jnlp"],
    ["application/x-javascript", "js"],
    ["application/x-koan", ["skd", "skm", "skp", "skt"]],
    ["application/x-ksh", "ksh"],
    ["application/x-latex", ["latex", "ltx"]],
    ["application/x-lha", "lha"],
    ["application/x-lisp", "lsp"],
    ["application/x-livescreen", "ivy"],
    ["application/x-lotus", "wq1"],
    ["application/x-lotusscreencam", "scm"],
    ["application/x-lzh", "lzh"],
    ["application/x-lzx", "lzx"],
    ["application/x-mac-binhex40", "hqx"],
    ["application/x-macbinary", "bin"],
    ["application/x-magic-cap-package-1.0", "mc$"],
    ["application/x-mathcad", "mcd"],
    ["application/x-meme", "mm"],
    ["application/x-midi", ["mid", "midi"]],
    ["application/x-mif", "mif"],
    ["application/x-mix-transfer", "nix"],
    ["application/x-mobipocket-ebook", "prc"],
    ["application/x-mplayer2", "asx"],
    ["application/x-ms-application", "application"],
    ["application/x-ms-wmd", "wmd"],
    ["application/x-ms-wmz", "wmz"],
    ["application/x-ms-xbap", "xbap"],
    ["application/x-msaccess", "mdb"],
    ["application/x-msbinder", "obd"],
    ["application/x-mscardfile", "crd"],
    ["application/x-msclip", "clp"],
    ["application/x-msdownload", ["exe", "dll"]],
    ["application/x-msexcel", ["xls", "xla", "xlw"]],
    ["application/x-msmediaview", ["mvb", "m13", "m14"]],
    ["application/x-msmetafile", "wmf"],
    ["application/x-msmoney", "mny"],
    ["application/x-mspowerpoint", "ppt"],
    ["application/x-mspublisher", "pub"],
    ["application/x-msschedule", "scd"],
    ["application/x-msterminal", "trm"],
    ["application/x-mswrite", "wri"],
    ["application/x-navi-animation", "ani"],
    ["application/x-navidoc", "nvd"],
    ["application/x-navimap", "map"],
    ["application/x-navistyle", "stl"],
    ["application/x-netcdf", ["cdf", "nc"]],
    ["application/x-newton-compatible-pkg", "pkg"],
    ["application/x-nokia-9000-communicator-add-on-software", "aos"],
    ["application/x-omc", "omc"],
    ["application/x-omcdatamaker", "omcd"],
    ["application/x-omcregerator", "omcr"],
    ["application/x-pagemaker", ["pm4", "pm5"]],
    ["application/x-pcl", "pcl"],
    ["application/x-perfmon", ["pma", "pmc", "pml", "pmr", "pmw"]],
    ["application/x-pixclscript", "plx"],
    ["application/x-pkcs10", "p10"],
    ["application/x-pkcs12", ["p12", "pfx"]],
    ["application/x-pkcs7-certificates", ["p7b", "spc"]],
    ["application/x-pkcs7-certreqresp", "p7r"],
    ["application/x-pkcs7-mime", ["p7m", "p7c"]],
    ["application/x-pkcs7-signature", ["p7s", "p7a"]],
    ["application/x-pointplus", "css"],
    ["application/x-portable-anymap", "pnm"],
    ["application/x-project", ["mpc", "mpt", "mpv", "mpx"]],
    ["application/x-qpro", "wb1"],
    ["application/x-rar-compressed", "rar"],
    ["application/x-rtf", "rtf"],
    ["application/x-sdp", "sdp"],
    ["application/x-sea", "sea"],
    ["application/x-seelogo", "sl"],
    ["application/x-sh", "sh"],
    ["application/x-shar", ["shar", "sh"]],
    ["application/x-shockwave-flash", "swf"],
    ["application/x-silverlight-app", "xap"],
    ["application/x-sit", "sit"],
    ["application/x-sprite", ["spr", "sprite"]],
    ["application/x-stuffit", "sit"],
    ["application/x-stuffitx", "sitx"],
    ["application/x-sv4cpio", "sv4cpio"],
    ["application/x-sv4crc", "sv4crc"],
    ["application/x-tar", "tar"],
    ["application/x-tbook", ["sbk", "tbk"]],
    ["application/x-tcl", "tcl"],
    ["application/x-tex", "tex"],
    ["application/x-tex-tfm", "tfm"],
    ["application/x-texinfo", ["texi", "texinfo"]],
    ["application/x-troff", ["roff", "t", "tr"]],
    ["application/x-troff-man", "man"],
    ["application/x-troff-me", "me"],
    ["application/x-troff-ms", "ms"],
    ["application/x-troff-msvideo", "avi"],
    ["application/x-ustar", "ustar"],
    ["application/x-visio", ["vsd", "vst", "vsw"]],
    ["application/x-vnd.audioexplosion.mzz", "mzz"],
    ["application/x-vnd.ls-xpix", "xpix"],
    ["application/x-vrml", "vrml"],
    ["application/x-wais-source", ["src", "wsrc"]],
    ["application/x-winhelp", "hlp"],
    ["application/x-wintalk", "wtk"],
    ["application/x-world", ["wrl", "svr"]],
    ["application/x-wpwin", "wpd"],
    ["application/x-wri", "wri"],
    ["application/x-x509-ca-cert", ["cer", "crt", "der"]],
    ["application/x-x509-user-cert", "crt"],
    ["application/x-xfig", "fig"],
    ["application/x-xpinstall", "xpi"],
    ["application/x-zip-compressed", "zip"],
    ["application/xcap-diff+xml", "xdf"],
    ["application/xenc+xml", "xenc"],
    ["application/xhtml+xml", "xhtml"],
    ["application/xml", "xml"],
    ["application/xml-dtd", "dtd"],
    ["application/xop+xml", "xop"],
    ["application/xslt+xml", "xslt"],
    ["application/xspf+xml", "xspf"],
    ["application/xv+xml", "mxml"],
    ["application/yang", "yang"],
    ["application/yin+xml", "yin"],
    ["application/ynd.ms-pkipko", "pko"],
    ["application/zip", "zip"],
    ["audio/adpcm", "adp"],
    ["audio/aiff", ["aiff", "aif", "aifc"]],
    ["audio/basic", ["snd", "au"]],
    ["audio/it", "it"],
    ["audio/make", ["funk", "my", "pfunk"]],
    ["audio/make.my.funk", "pfunk"],
    ["audio/mid", ["mid", "rmi"]],
    ["audio/midi", ["midi", "kar", "mid"]],
    ["audio/mod", "mod"],
    ["audio/mp4", "mp4a"],
    ["audio/mpeg", ["mpga", "mp3", "m2a", "mp2", "mpa", "mpg"]],
    ["audio/mpeg3", "mp3"],
    ["audio/nspaudio", ["la", "lma"]],
    ["audio/ogg", "oga"],
    ["audio/s3m", "s3m"],
    ["audio/tsp-audio", "tsi"],
    ["audio/tsplayer", "tsp"],
    ["audio/vnd.dece.audio", "uva"],
    ["audio/vnd.digital-winds", "eol"],
    ["audio/vnd.dra", "dra"],
    ["audio/vnd.dts", "dts"],
    ["audio/vnd.dts.hd", "dtshd"],
    ["audio/vnd.lucent.voice", "lvp"],
    ["audio/vnd.ms-playready.media.pya", "pya"],
    ["audio/vnd.nuera.ecelp4800", "ecelp4800"],
    ["audio/vnd.nuera.ecelp7470", "ecelp7470"],
    ["audio/vnd.nuera.ecelp9600", "ecelp9600"],
    ["audio/vnd.qcelp", "qcp"],
    ["audio/vnd.rip", "rip"],
    ["audio/voc", "voc"],
    ["audio/voxware", "vox"],
    ["audio/wav", "wav"],
    ["audio/webm", "weba"],
    ["audio/x-aac", "aac"],
    ["audio/x-adpcm", "snd"],
    ["audio/x-aiff", ["aiff", "aif", "aifc"]],
    ["audio/x-au", "au"],
    ["audio/x-gsm", ["gsd", "gsm"]],
    ["audio/x-jam", "jam"],
    ["audio/x-liveaudio", "lam"],
    ["audio/x-mid", ["mid", "midi"]],
    ["audio/x-midi", ["midi", "mid"]],
    ["audio/x-mod", "mod"],
    ["audio/x-mpeg", "mp2"],
    ["audio/x-mpeg-3", "mp3"],
    ["audio/x-mpegurl", "m3u"],
    ["audio/x-mpequrl", "m3u"],
    ["audio/x-ms-wax", "wax"],
    ["audio/x-ms-wma", "wma"],
    ["audio/x-nspaudio", ["la", "lma"]],
    ["audio/x-pn-realaudio", ["ra", "ram", "rm", "rmm", "rmp"]],
    ["audio/x-pn-realaudio-plugin", ["ra", "rmp", "rpm"]],
    ["audio/x-psid", "sid"],
    ["audio/x-realaudio", "ra"],
    ["audio/x-twinvq", "vqf"],
    ["audio/x-twinvq-plugin", ["vqe", "vql"]],
    ["audio/x-vnd.audioexplosion.mjuicemediafile", "mjf"],
    ["audio/x-voc", "voc"],
    ["audio/x-wav", "wav"],
    ["audio/xm", "xm"],
    ["chemical/x-cdx", "cdx"],
    ["chemical/x-cif", "cif"],
    ["chemical/x-cmdf", "cmdf"],
    ["chemical/x-cml", "cml"],
    ["chemical/x-csml", "csml"],
    ["chemical/x-pdb", ["pdb", "xyz"]],
    ["chemical/x-xyz", "xyz"],
    ["drawing/x-dwf", "dwf"],
    ["i-world/i-vrml", "ivr"],
    ["image/bmp", ["bmp", "bm"]],
    ["image/cgm", "cgm"],
    ["image/cis-cod", "cod"],
    ["image/cmu-raster", ["ras", "rast"]],
    ["image/fif", "fif"],
    ["image/florian", ["flo", "turbot"]],
    ["image/g3fax", "g3"],
    ["image/gif", "gif"],
    ["image/ief", ["ief", "iefs"]],
    ["image/jpeg", ["jpeg", "jpe", "jpg", "jfif", "jfif-tbnl"]],
    ["image/jutvision", "jut"],
    ["image/ktx", "ktx"],
    ["image/naplps", ["nap", "naplps"]],
    ["image/pict", ["pic", "pict"]],
    ["image/pipeg", "jfif"],
    ["image/pjpeg", ["jfif", "jpe", "jpeg", "jpg"]],
    ["image/png", ["png", "x-png"]],
    ["image/prs.btif", "btif"],
    ["image/svg+xml", "svg"],
    ["image/tiff", ["tif", "tiff"]],
    ["image/vasa", "mcf"],
    ["image/vnd.adobe.photoshop", "psd"],
    ["image/vnd.dece.graphic", "uvi"],
    ["image/vnd.djvu", "djvu"],
    ["image/vnd.dvb.subtitle", "sub"],
    ["image/vnd.dwg", ["dwg", "dxf", "svf"]],
    ["image/vnd.dxf", "dxf"],
    ["image/vnd.fastbidsheet", "fbs"],
    ["image/vnd.fpx", "fpx"],
    ["image/vnd.fst", "fst"],
    ["image/vnd.fujixerox.edmics-mmr", "mmr"],
    ["image/vnd.fujixerox.edmics-rlc", "rlc"],
    ["image/vnd.ms-modi", "mdi"],
    ["image/vnd.net-fpx", ["fpx", "npx"]],
    ["image/vnd.rn-realflash", "rf"],
    ["image/vnd.rn-realpix", "rp"],
    ["image/vnd.wap.wbmp", "wbmp"],
    ["image/vnd.xiff", "xif"],
    ["image/webp", "webp"],
    ["image/x-cmu-raster", "ras"],
    ["image/x-cmx", "cmx"],
    ["image/x-dwg", ["dwg", "dxf", "svf"]],
    ["image/x-freehand", "fh"],
    ["image/x-icon", "ico"],
    ["image/x-jg", "art"],
    ["image/x-jps", "jps"],
    ["image/x-niff", ["niff", "nif"]],
    ["image/x-pcx", "pcx"],
    ["image/x-pict", ["pct", "pic"]],
    ["image/x-portable-anymap", "pnm"],
    ["image/x-portable-bitmap", "pbm"],
    ["image/x-portable-graymap", "pgm"],
    ["image/x-portable-greymap", "pgm"],
    ["image/x-portable-pixmap", "ppm"],
    ["image/x-quicktime", ["qif", "qti", "qtif"]],
    ["image/x-rgb", "rgb"],
    ["image/x-tiff", ["tif", "tiff"]],
    ["image/x-windows-bmp", "bmp"],
    ["image/x-xbitmap", "xbm"],
    ["image/x-xbm", "xbm"],
    ["image/x-xpixmap", ["xpm", "pm"]],
    ["image/x-xwd", "xwd"],
    ["image/x-xwindowdump", "xwd"],
    ["image/xbm", "xbm"],
    ["image/xpm", "xpm"],
    ["message/rfc822", ["eml", "mht", "mhtml", "nws", "mime"]],
    ["model/iges", ["iges", "igs"]],
    ["model/mesh", "msh"],
    ["model/vnd.collada+xml", "dae"],
    ["model/vnd.dwf", "dwf"],
    ["model/vnd.gdl", "gdl"],
    ["model/vnd.gtw", "gtw"],
    ["model/vnd.mts", "mts"],
    ["model/vnd.vtu", "vtu"],
    ["model/vrml", ["vrml", "wrl", "wrz"]],
    ["model/x-pov", "pov"],
    ["multipart/x-gzip", "gzip"],
    ["multipart/x-ustar", "ustar"],
    ["multipart/x-zip", "zip"],
    ["music/crescendo", ["mid", "midi"]],
    ["music/x-karaoke", "kar"],
    ["paleovu/x-pv", "pvu"],
    ["text/asp", "asp"],
    ["text/calendar", "ics"],
    ["text/css", "css"],
    ["text/csv", "csv"],
    ["text/ecmascript", "js"],
    ["text/h323", "323"],
    ["text/html", ["html", "htm", "stm", "acgi", "htmls", "htx", "shtml"]],
    ["text/iuls", "uls"],
    ["text/javascript", "js"],
    ["text/mcf", "mcf"],
    ["text/n3", "n3"],
    ["text/pascal", "pas"],
    [
      "text/plain",
      [
        "txt",
        "bas",
        "c",
        "h",
        "c++",
        "cc",
        "com",
        "conf",
        "cxx",
        "def",
        "f",
        "f90",
        "for",
        "g",
        "hh",
        "idc",
        "jav",
        "java",
        "list",
        "log",
        "lst",
        "m",
        "mar",
        "pl",
        "sdml",
        "text"
      ]
    ],
    ["text/plain-bas", "par"],
    ["text/prs.lines.tag", "dsc"],
    ["text/richtext", ["rtx", "rt", "rtf"]],
    ["text/scriplet", "wsc"],
    ["text/scriptlet", "sct"],
    ["text/sgml", ["sgm", "sgml"]],
    ["text/tab-separated-values", "tsv"],
    ["text/troff", "t"],
    ["text/turtle", "ttl"],
    ["text/uri-list", ["uni", "unis", "uri", "uris"]],
    ["text/vnd.abc", "abc"],
    ["text/vnd.curl", "curl"],
    ["text/vnd.curl.dcurl", "dcurl"],
    ["text/vnd.curl.mcurl", "mcurl"],
    ["text/vnd.curl.scurl", "scurl"],
    ["text/vnd.fly", "fly"],
    ["text/vnd.fmi.flexstor", "flx"],
    ["text/vnd.graphviz", "gv"],
    ["text/vnd.in3d.3dml", "3dml"],
    ["text/vnd.in3d.spot", "spot"],
    ["text/vnd.rn-realtext", "rt"],
    ["text/vnd.sun.j2me.app-descriptor", "jad"],
    ["text/vnd.wap.wml", "wml"],
    ["text/vnd.wap.wmlscript", "wmls"],
    ["text/webviewhtml", "htt"],
    ["text/x-asm", ["asm", "s"]],
    ["text/x-audiosoft-intra", "aip"],
    ["text/x-c", ["c", "cc", "cpp"]],
    ["text/x-component", "htc"],
    ["text/x-fortran", ["for", "f", "f77", "f90"]],
    ["text/x-h", ["h", "hh"]],
    ["text/x-java-source", ["java", "jav"]],
    ["text/x-java-source,java", "java"],
    ["text/x-la-asf", "lsx"],
    ["text/x-m", "m"],
    ["text/x-pascal", "p"],
    ["text/x-script", "hlb"],
    ["text/x-script.csh", "csh"],
    ["text/x-script.elisp", "el"],
    ["text/x-script.guile", "scm"],
    ["text/x-script.ksh", "ksh"],
    ["text/x-script.lisp", "lsp"],
    ["text/x-script.perl", "pl"],
    ["text/x-script.perl-module", "pm"],
    ["text/x-script.phyton", "py"],
    ["text/x-script.rexx", "rexx"],
    ["text/x-script.scheme", "scm"],
    ["text/x-script.sh", "sh"],
    ["text/x-script.tcl", "tcl"],
    ["text/x-script.tcsh", "tcsh"],
    ["text/x-script.zsh", "zsh"],
    ["text/x-server-parsed-html", ["shtml", "ssi"]],
    ["text/x-setext", "etx"],
    ["text/x-sgml", ["sgm", "sgml"]],
    ["text/x-speech", ["spc", "talk"]],
    ["text/x-uil", "uil"],
    ["text/x-uuencode", ["uu", "uue"]],
    ["text/x-vcalendar", "vcs"],
    ["text/x-vcard", "vcf"],
    ["text/xml", "xml"],
    ["video/3gpp", "3gp"],
    ["video/3gpp2", "3g2"],
    ["video/animaflex", "afl"],
    ["video/avi", "avi"],
    ["video/avs-video", "avs"],
    ["video/dl", "dl"],
    ["video/fli", "fli"],
    ["video/gl", "gl"],
    ["video/h261", "h261"],
    ["video/h263", "h263"],
    ["video/h264", "h264"],
    ["video/jpeg", "jpgv"],
    ["video/jpm", "jpm"],
    ["video/mj2", "mj2"],
    ["video/mp4", "mp4"],
    ["video/mpeg", ["mpeg", "mp2", "mpa", "mpe", "mpg", "mpv2", "m1v", "m2v", "mp3"]],
    ["video/msvideo", "avi"],
    ["video/ogg", "ogv"],
    ["video/quicktime", ["mov", "qt", "moov"]],
    ["video/vdo", "vdo"],
    ["video/vivo", ["viv", "vivo"]],
    ["video/vnd.dece.hd", "uvh"],
    ["video/vnd.dece.mobile", "uvm"],
    ["video/vnd.dece.pd", "uvp"],
    ["video/vnd.dece.sd", "uvs"],
    ["video/vnd.dece.video", "uvv"],
    ["video/vnd.fvt", "fvt"],
    ["video/vnd.mpegurl", "mxu"],
    ["video/vnd.ms-playready.media.pyv", "pyv"],
    ["video/vnd.rn-realvideo", "rv"],
    ["video/vnd.uvvu.mp4", "uvu"],
    ["video/vnd.vivo", ["viv", "vivo"]],
    ["video/vosaic", "vos"],
    ["video/webm", "webm"],
    ["video/x-amt-demorun", "xdr"],
    ["video/x-amt-showrun", "xsr"],
    ["video/x-atomic3d-feature", "fmf"],
    ["video/x-dl", "dl"],
    ["video/x-dv", ["dif", "dv"]],
    ["video/x-f4v", "f4v"],
    ["video/x-fli", "fli"],
    ["video/x-flv", "flv"],
    ["video/x-gl", "gl"],
    ["video/x-isvideo", "isu"],
    ["video/x-la-asf", ["lsf", "lsx"]],
    ["video/x-m4v", "m4v"],
    ["video/x-motion-jpeg", "mjpg"],
    ["video/x-mpeg", ["mp3", "mp2"]],
    ["video/x-mpeq2a", "mp2"],
    ["video/x-ms-asf", ["asf", "asr", "asx"]],
    ["video/x-ms-asf-plugin", "asx"],
    ["video/x-ms-wm", "wm"],
    ["video/x-ms-wmv", "wmv"],
    ["video/x-ms-wmx", "wmx"],
    ["video/x-ms-wvx", "wvx"],
    ["video/x-msvideo", "avi"],
    ["video/x-qtc", "qtc"],
    ["video/x-scm", "scm"],
    ["video/x-sgi-movie", ["movie", "mv"]],
    ["windows/metafile", "wmf"],
    ["www/mime", "mime"],
    ["x-conference/x-cooltalk", "ice"],
    ["x-music/x-midi", ["mid", "midi"]],
    ["x-world/x-3dmf", ["3dm", "3dmf", "qd3", "qd3d"]],
    ["x-world/x-svr", "svr"],
    ["x-world/x-vrml", ["flr", "vrml", "wrl", "wrz", "xaf", "xof"]],
    ["x-world/x-vrt", "vrt"],
    ["xgl/drawing", "xgz"],
    ["xgl/movie", "xmz"]
  ]);
  var extensions = new Map([
    ["123", "application/vnd.lotus-1-2-3"],
    ["323", "text/h323"],
    ["*", "application/octet-stream"],
    ["3dm", "x-world/x-3dmf"],
    ["3dmf", "x-world/x-3dmf"],
    ["3dml", "text/vnd.in3d.3dml"],
    ["3g2", "video/3gpp2"],
    ["3gp", "video/3gpp"],
    ["7z", "application/x-7z-compressed"],
    ["a", "application/octet-stream"],
    ["aab", "application/x-authorware-bin"],
    ["aac", "audio/x-aac"],
    ["aam", "application/x-authorware-map"],
    ["aas", "application/x-authorware-seg"],
    ["abc", "text/vnd.abc"],
    ["abw", "application/x-abiword"],
    ["ac", "application/pkix-attr-cert"],
    ["acc", "application/vnd.americandynamics.acc"],
    ["ace", "application/x-ace-compressed"],
    ["acgi", "text/html"],
    ["acu", "application/vnd.acucobol"],
    ["acx", "application/internet-property-stream"],
    ["adp", "audio/adpcm"],
    ["aep", "application/vnd.audiograph"],
    ["afl", "video/animaflex"],
    ["afp", "application/vnd.ibm.modcap"],
    ["ahead", "application/vnd.ahead.space"],
    ["ai", "application/postscript"],
    ["aif", ["audio/aiff", "audio/x-aiff"]],
    ["aifc", ["audio/aiff", "audio/x-aiff"]],
    ["aiff", ["audio/aiff", "audio/x-aiff"]],
    ["aim", "application/x-aim"],
    ["aip", "text/x-audiosoft-intra"],
    ["air", "application/vnd.adobe.air-application-installer-package+zip"],
    ["ait", "application/vnd.dvb.ait"],
    ["ami", "application/vnd.amiga.ami"],
    ["ani", "application/x-navi-animation"],
    ["aos", "application/x-nokia-9000-communicator-add-on-software"],
    ["apk", "application/vnd.android.package-archive"],
    ["application", "application/x-ms-application"],
    ["apr", "application/vnd.lotus-approach"],
    ["aps", "application/mime"],
    ["arc", "application/octet-stream"],
    ["arj", ["application/arj", "application/octet-stream"]],
    ["art", "image/x-jg"],
    ["asf", "video/x-ms-asf"],
    ["asm", "text/x-asm"],
    ["aso", "application/vnd.accpac.simply.aso"],
    ["asp", "text/asp"],
    ["asr", "video/x-ms-asf"],
    ["asx", ["video/x-ms-asf", "application/x-mplayer2", "video/x-ms-asf-plugin"]],
    ["atc", "application/vnd.acucorp"],
    ["atomcat", "application/atomcat+xml"],
    ["atomsvc", "application/atomsvc+xml"],
    ["atx", "application/vnd.antix.game-component"],
    ["au", ["audio/basic", "audio/x-au"]],
    ["avi", ["video/avi", "video/msvideo", "application/x-troff-msvideo", "video/x-msvideo"]],
    ["avs", "video/avs-video"],
    ["aw", "application/applixware"],
    ["axs", "application/olescript"],
    ["azf", "application/vnd.airzip.filesecure.azf"],
    ["azs", "application/vnd.airzip.filesecure.azs"],
    ["azw", "application/vnd.amazon.ebook"],
    ["bas", "text/plain"],
    ["bcpio", "application/x-bcpio"],
    ["bdf", "application/x-font-bdf"],
    ["bdm", "application/vnd.syncml.dm+wbxml"],
    ["bed", "application/vnd.realvnc.bed"],
    ["bh2", "application/vnd.fujitsu.oasysprs"],
    [
      "bin",
      ["application/octet-stream", "application/mac-binary", "application/macbinary", "application/x-macbinary", "application/x-binary"]
    ],
    ["bm", "image/bmp"],
    ["bmi", "application/vnd.bmi"],
    ["bmp", ["image/bmp", "image/x-windows-bmp"]],
    ["boo", "application/book"],
    ["book", "application/book"],
    ["box", "application/vnd.previewsystems.box"],
    ["boz", "application/x-bzip2"],
    ["bsh", "application/x-bsh"],
    ["btif", "image/prs.btif"],
    ["bz", "application/x-bzip"],
    ["bz2", "application/x-bzip2"],
    ["c", ["text/plain", "text/x-c"]],
    ["c++", "text/plain"],
    ["c11amc", "application/vnd.cluetrust.cartomobile-config"],
    ["c11amz", "application/vnd.cluetrust.cartomobile-config-pkg"],
    ["c4g", "application/vnd.clonk.c4group"],
    ["cab", "application/vnd.ms-cab-compressed"],
    ["car", "application/vnd.curl.car"],
    ["cat", ["application/vnd.ms-pkiseccat", "application/vnd.ms-pki.seccat"]],
    ["cc", ["text/plain", "text/x-c"]],
    ["ccad", "application/clariscad"],
    ["cco", "application/x-cocoa"],
    ["ccxml", "application/ccxml+xml,"],
    ["cdbcmsg", "application/vnd.contact.cmsg"],
    ["cdf", ["application/cdf", "application/x-cdf", "application/x-netcdf"]],
    ["cdkey", "application/vnd.mediastation.cdkey"],
    ["cdmia", "application/cdmi-capability"],
    ["cdmic", "application/cdmi-container"],
    ["cdmid", "application/cdmi-domain"],
    ["cdmio", "application/cdmi-object"],
    ["cdmiq", "application/cdmi-queue"],
    ["cdx", "chemical/x-cdx"],
    ["cdxml", "application/vnd.chemdraw+xml"],
    ["cdy", "application/vnd.cinderella"],
    ["cer", ["application/pkix-cert", "application/x-x509-ca-cert"]],
    ["cgm", "image/cgm"],
    ["cha", "application/x-chat"],
    ["chat", "application/x-chat"],
    ["chm", "application/vnd.ms-htmlhelp"],
    ["chrt", "application/vnd.kde.kchart"],
    ["cif", "chemical/x-cif"],
    ["cii", "application/vnd.anser-web-certificate-issue-initiation"],
    ["cil", "application/vnd.ms-artgalry"],
    ["cla", "application/vnd.claymore"],
    [
      "class",
      ["application/octet-stream", "application/java", "application/java-byte-code", "application/java-vm", "application/x-java-class"]
    ],
    ["clkk", "application/vnd.crick.clicker.keyboard"],
    ["clkp", "application/vnd.crick.clicker.palette"],
    ["clkt", "application/vnd.crick.clicker.template"],
    ["clkw", "application/vnd.crick.clicker.wordbank"],
    ["clkx", "application/vnd.crick.clicker"],
    ["clp", "application/x-msclip"],
    ["cmc", "application/vnd.cosmocaller"],
    ["cmdf", "chemical/x-cmdf"],
    ["cml", "chemical/x-cml"],
    ["cmp", "application/vnd.yellowriver-custom-menu"],
    ["cmx", "image/x-cmx"],
    ["cod", ["image/cis-cod", "application/vnd.rim.cod"]],
    ["com", ["application/octet-stream", "text/plain"]],
    ["conf", "text/plain"],
    ["cpio", "application/x-cpio"],
    ["cpp", "text/x-c"],
    ["cpt", ["application/mac-compactpro", "application/x-compactpro", "application/x-cpt"]],
    ["crd", "application/x-mscardfile"],
    ["crl", ["application/pkix-crl", "application/pkcs-crl"]],
    ["crt", ["application/pkix-cert", "application/x-x509-user-cert", "application/x-x509-ca-cert"]],
    ["cryptonote", "application/vnd.rig.cryptonote"],
    ["csh", ["text/x-script.csh", "application/x-csh"]],
    ["csml", "chemical/x-csml"],
    ["csp", "application/vnd.commonspace"],
    ["css", ["text/css", "application/x-pointplus"]],
    ["csv", "text/csv"],
    ["cu", "application/cu-seeme"],
    ["curl", "text/vnd.curl"],
    ["cww", "application/prs.cww"],
    ["cxx", "text/plain"],
    ["dae", "model/vnd.collada+xml"],
    ["daf", "application/vnd.mobius.daf"],
    ["davmount", "application/davmount+xml"],
    ["dcr", "application/x-director"],
    ["dcurl", "text/vnd.curl.dcurl"],
    ["dd2", "application/vnd.oma.dd2+xml"],
    ["ddd", "application/vnd.fujixerox.ddd"],
    ["deb", "application/x-debian-package"],
    ["deepv", "application/x-deepv"],
    ["def", "text/plain"],
    ["der", "application/x-x509-ca-cert"],
    ["dfac", "application/vnd.dreamfactory"],
    ["dif", "video/x-dv"],
    ["dir", "application/x-director"],
    ["dis", "application/vnd.mobius.dis"],
    ["djvu", "image/vnd.djvu"],
    ["dl", ["video/dl", "video/x-dl"]],
    ["dll", "application/x-msdownload"],
    ["dms", "application/octet-stream"],
    ["dna", "application/vnd.dna"],
    ["doc", "application/msword"],
    ["docm", "application/vnd.ms-word.document.macroenabled.12"],
    ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ["dot", "application/msword"],
    ["dotm", "application/vnd.ms-word.template.macroenabled.12"],
    ["dotx", "application/vnd.openxmlformats-officedocument.wordprocessingml.template"],
    ["dp", ["application/commonground", "application/vnd.osgi.dp"]],
    ["dpg", "application/vnd.dpgraph"],
    ["dra", "audio/vnd.dra"],
    ["drw", "application/drafting"],
    ["dsc", "text/prs.lines.tag"],
    ["dssc", "application/dssc+der"],
    ["dtb", "application/x-dtbook+xml"],
    ["dtd", "application/xml-dtd"],
    ["dts", "audio/vnd.dts"],
    ["dtshd", "audio/vnd.dts.hd"],
    ["dump", "application/octet-stream"],
    ["dv", "video/x-dv"],
    ["dvi", "application/x-dvi"],
    ["dwf", ["model/vnd.dwf", "drawing/x-dwf"]],
    ["dwg", ["application/acad", "image/vnd.dwg", "image/x-dwg"]],
    ["dxf", ["application/dxf", "image/vnd.dwg", "image/vnd.dxf", "image/x-dwg"]],
    ["dxp", "application/vnd.spotfire.dxp"],
    ["dxr", "application/x-director"],
    ["ecelp4800", "audio/vnd.nuera.ecelp4800"],
    ["ecelp7470", "audio/vnd.nuera.ecelp7470"],
    ["ecelp9600", "audio/vnd.nuera.ecelp9600"],
    ["edm", "application/vnd.novadigm.edm"],
    ["edx", "application/vnd.novadigm.edx"],
    ["efif", "application/vnd.picsel"],
    ["ei6", "application/vnd.pg.osasli"],
    ["el", "text/x-script.elisp"],
    ["elc", ["application/x-elc", "application/x-bytecode.elisp"]],
    ["eml", "message/rfc822"],
    ["emma", "application/emma+xml"],
    ["env", "application/x-envoy"],
    ["eol", "audio/vnd.digital-winds"],
    ["eot", "application/vnd.ms-fontobject"],
    ["eps", "application/postscript"],
    ["epub", "application/epub+zip"],
    ["es", ["application/ecmascript", "application/x-esrehber"]],
    ["es3", "application/vnd.eszigno3+xml"],
    ["esf", "application/vnd.epson.esf"],
    ["etx", "text/x-setext"],
    ["evy", ["application/envoy", "application/x-envoy"]],
    ["exe", ["application/octet-stream", "application/x-msdownload"]],
    ["exi", "application/exi"],
    ["ext", "application/vnd.novadigm.ext"],
    ["ez2", "application/vnd.ezpix-album"],
    ["ez3", "application/vnd.ezpix-package"],
    ["f", ["text/plain", "text/x-fortran"]],
    ["f4v", "video/x-f4v"],
    ["f77", "text/x-fortran"],
    ["f90", ["text/plain", "text/x-fortran"]],
    ["fbs", "image/vnd.fastbidsheet"],
    ["fcs", "application/vnd.isac.fcs"],
    ["fdf", "application/vnd.fdf"],
    ["fe_launch", "application/vnd.denovo.fcselayout-link"],
    ["fg5", "application/vnd.fujitsu.oasysgp"],
    ["fh", "image/x-freehand"],
    ["fif", ["application/fractals", "image/fif"]],
    ["fig", "application/x-xfig"],
    ["fli", ["video/fli", "video/x-fli"]],
    ["flo", ["image/florian", "application/vnd.micrografx.flo"]],
    ["flr", "x-world/x-vrml"],
    ["flv", "video/x-flv"],
    ["flw", "application/vnd.kde.kivio"],
    ["flx", "text/vnd.fmi.flexstor"],
    ["fly", "text/vnd.fly"],
    ["fm", "application/vnd.framemaker"],
    ["fmf", "video/x-atomic3d-feature"],
    ["fnc", "application/vnd.frogans.fnc"],
    ["for", ["text/plain", "text/x-fortran"]],
    ["fpx", ["image/vnd.fpx", "image/vnd.net-fpx"]],
    ["frl", "application/freeloader"],
    ["fsc", "application/vnd.fsc.weblaunch"],
    ["fst", "image/vnd.fst"],
    ["ftc", "application/vnd.fluxtime.clip"],
    ["fti", "application/vnd.anser-web-funds-transfer-initiation"],
    ["funk", "audio/make"],
    ["fvt", "video/vnd.fvt"],
    ["fxp", "application/vnd.adobe.fxp"],
    ["fzs", "application/vnd.fuzzysheet"],
    ["g", "text/plain"],
    ["g2w", "application/vnd.geoplan"],
    ["g3", "image/g3fax"],
    ["g3w", "application/vnd.geospace"],
    ["gac", "application/vnd.groove-account"],
    ["gdl", "model/vnd.gdl"],
    ["geo", "application/vnd.dynageo"],
    ["geojson", "application/geo+json"],
    ["gex", "application/vnd.geometry-explorer"],
    ["ggb", "application/vnd.geogebra.file"],
    ["ggt", "application/vnd.geogebra.tool"],
    ["ghf", "application/vnd.groove-help"],
    ["gif", "image/gif"],
    ["gim", "application/vnd.groove-identity-message"],
    ["gl", ["video/gl", "video/x-gl"]],
    ["gmx", "application/vnd.gmx"],
    ["gnumeric", "application/x-gnumeric"],
    ["gph", "application/vnd.flographit"],
    ["gqf", "application/vnd.grafeq"],
    ["gram", "application/srgs"],
    ["grv", "application/vnd.groove-injector"],
    ["grxml", "application/srgs+xml"],
    ["gsd", "audio/x-gsm"],
    ["gsf", "application/x-font-ghostscript"],
    ["gsm", "audio/x-gsm"],
    ["gsp", "application/x-gsp"],
    ["gss", "application/x-gss"],
    ["gtar", "application/x-gtar"],
    ["gtm", "application/vnd.groove-tool-message"],
    ["gtw", "model/vnd.gtw"],
    ["gv", "text/vnd.graphviz"],
    ["gxt", "application/vnd.geonext"],
    ["gz", ["application/x-gzip", "application/x-compressed"]],
    ["gzip", ["multipart/x-gzip", "application/x-gzip"]],
    ["h", ["text/plain", "text/x-h"]],
    ["h261", "video/h261"],
    ["h263", "video/h263"],
    ["h264", "video/h264"],
    ["hal", "application/vnd.hal+xml"],
    ["hbci", "application/vnd.hbci"],
    ["hdf", "application/x-hdf"],
    ["help", "application/x-helpfile"],
    ["hgl", "application/vnd.hp-hpgl"],
    ["hh", ["text/plain", "text/x-h"]],
    ["hlb", "text/x-script"],
    ["hlp", ["application/winhlp", "application/hlp", "application/x-helpfile", "application/x-winhelp"]],
    ["hpg", "application/vnd.hp-hpgl"],
    ["hpgl", "application/vnd.hp-hpgl"],
    ["hpid", "application/vnd.hp-hpid"],
    ["hps", "application/vnd.hp-hps"],
    [
      "hqx",
      [
        "application/mac-binhex40",
        "application/binhex",
        "application/binhex4",
        "application/mac-binhex",
        "application/x-binhex40",
        "application/x-mac-binhex40"
      ]
    ],
    ["hta", "application/hta"],
    ["htc", "text/x-component"],
    ["htke", "application/vnd.kenameaapp"],
    ["htm", "text/html"],
    ["html", "text/html"],
    ["htmls", "text/html"],
    ["htt", "text/webviewhtml"],
    ["htx", "text/html"],
    ["hvd", "application/vnd.yamaha.hv-dic"],
    ["hvp", "application/vnd.yamaha.hv-voice"],
    ["hvs", "application/vnd.yamaha.hv-script"],
    ["i2g", "application/vnd.intergeo"],
    ["icc", "application/vnd.iccprofile"],
    ["ice", "x-conference/x-cooltalk"],
    ["ico", "image/x-icon"],
    ["ics", "text/calendar"],
    ["idc", "text/plain"],
    ["ief", "image/ief"],
    ["iefs", "image/ief"],
    ["ifm", "application/vnd.shana.informed.formdata"],
    ["iges", ["application/iges", "model/iges"]],
    ["igl", "application/vnd.igloader"],
    ["igm", "application/vnd.insors.igm"],
    ["igs", ["application/iges", "model/iges"]],
    ["igx", "application/vnd.micrografx.igx"],
    ["iif", "application/vnd.shana.informed.interchange"],
    ["iii", "application/x-iphone"],
    ["ima", "application/x-ima"],
    ["imap", "application/x-httpd-imap"],
    ["imp", "application/vnd.accpac.simply.imp"],
    ["ims", "application/vnd.ms-ims"],
    ["inf", "application/inf"],
    ["ins", ["application/x-internet-signup", "application/x-internett-signup"]],
    ["ip", "application/x-ip2"],
    ["ipfix", "application/ipfix"],
    ["ipk", "application/vnd.shana.informed.package"],
    ["irm", "application/vnd.ibm.rights-management"],
    ["irp", "application/vnd.irepository.package+xml"],
    ["isp", "application/x-internet-signup"],
    ["isu", "video/x-isvideo"],
    ["it", "audio/it"],
    ["itp", "application/vnd.shana.informed.formtemplate"],
    ["iv", "application/x-inventor"],
    ["ivp", "application/vnd.immervision-ivp"],
    ["ivr", "i-world/i-vrml"],
    ["ivu", "application/vnd.immervision-ivu"],
    ["ivy", "application/x-livescreen"],
    ["jad", "text/vnd.sun.j2me.app-descriptor"],
    ["jam", ["application/vnd.jam", "audio/x-jam"]],
    ["jar", "application/java-archive"],
    ["jav", ["text/plain", "text/x-java-source"]],
    ["java", ["text/plain", "text/x-java-source,java", "text/x-java-source"]],
    ["jcm", "application/x-java-commerce"],
    ["jfif", ["image/pipeg", "image/jpeg", "image/pjpeg"]],
    ["jfif-tbnl", "image/jpeg"],
    ["jisp", "application/vnd.jisp"],
    ["jlt", "application/vnd.hp-jlyt"],
    ["jnlp", "application/x-java-jnlp-file"],
    ["joda", "application/vnd.joost.joda-archive"],
    ["jpe", ["image/jpeg", "image/pjpeg"]],
    ["jpeg", ["image/jpeg", "image/pjpeg"]],
    ["jpg", ["image/jpeg", "image/pjpeg"]],
    ["jpgv", "video/jpeg"],
    ["jpm", "video/jpm"],
    ["jps", "image/x-jps"],
    ["js", ["application/javascript", "application/ecmascript", "text/javascript", "text/ecmascript", "application/x-javascript"]],
    ["json", "application/json"],
    ["jut", "image/jutvision"],
    ["kar", ["audio/midi", "music/x-karaoke"]],
    ["karbon", "application/vnd.kde.karbon"],
    ["kfo", "application/vnd.kde.kformula"],
    ["kia", "application/vnd.kidspiration"],
    ["kml", "application/vnd.google-earth.kml+xml"],
    ["kmz", "application/vnd.google-earth.kmz"],
    ["kne", "application/vnd.kinar"],
    ["kon", "application/vnd.kde.kontour"],
    ["kpr", "application/vnd.kde.kpresenter"],
    ["ksh", ["application/x-ksh", "text/x-script.ksh"]],
    ["ksp", "application/vnd.kde.kspread"],
    ["ktx", "image/ktx"],
    ["ktz", "application/vnd.kahootz"],
    ["kwd", "application/vnd.kde.kword"],
    ["la", ["audio/nspaudio", "audio/x-nspaudio"]],
    ["lam", "audio/x-liveaudio"],
    ["lasxml", "application/vnd.las.las+xml"],
    ["latex", "application/x-latex"],
    ["lbd", "application/vnd.llamagraphics.life-balance.desktop"],
    ["lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"],
    ["les", "application/vnd.hhe.lesson-player"],
    ["lha", ["application/octet-stream", "application/lha", "application/x-lha"]],
    ["lhx", "application/octet-stream"],
    ["link66", "application/vnd.route66.link66+xml"],
    ["list", "text/plain"],
    ["lma", ["audio/nspaudio", "audio/x-nspaudio"]],
    ["log", "text/plain"],
    ["lrm", "application/vnd.ms-lrm"],
    ["lsf", "video/x-la-asf"],
    ["lsp", ["application/x-lisp", "text/x-script.lisp"]],
    ["lst", "text/plain"],
    ["lsx", ["video/x-la-asf", "text/x-la-asf"]],
    ["ltf", "application/vnd.frogans.ltf"],
    ["ltx", "application/x-latex"],
    ["lvp", "audio/vnd.lucent.voice"],
    ["lwp", "application/vnd.lotus-wordpro"],
    ["lzh", ["application/octet-stream", "application/x-lzh"]],
    ["lzx", ["application/lzx", "application/octet-stream", "application/x-lzx"]],
    ["m", ["text/plain", "text/x-m"]],
    ["m13", "application/x-msmediaview"],
    ["m14", "application/x-msmediaview"],
    ["m1v", "video/mpeg"],
    ["m21", "application/mp21"],
    ["m2a", "audio/mpeg"],
    ["m2v", "video/mpeg"],
    ["m3u", ["audio/x-mpegurl", "audio/x-mpequrl"]],
    ["m3u8", "application/vnd.apple.mpegurl"],
    ["m4v", "video/x-m4v"],
    ["ma", "application/mathematica"],
    ["mads", "application/mads+xml"],
    ["mag", "application/vnd.ecowin.chart"],
    ["man", "application/x-troff-man"],
    ["map", "application/x-navimap"],
    ["mar", "text/plain"],
    ["mathml", "application/mathml+xml"],
    ["mbd", "application/mbedlet"],
    ["mbk", "application/vnd.mobius.mbk"],
    ["mbox", "application/mbox"],
    ["mc$", "application/x-magic-cap-package-1.0"],
    ["mc1", "application/vnd.medcalcdata"],
    ["mcd", ["application/mcad", "application/vnd.mcd", "application/x-mathcad"]],
    ["mcf", ["image/vasa", "text/mcf"]],
    ["mcp", "application/netmc"],
    ["mcurl", "text/vnd.curl.mcurl"],
    ["mdb", "application/x-msaccess"],
    ["mdi", "image/vnd.ms-modi"],
    ["me", "application/x-troff-me"],
    ["meta4", "application/metalink4+xml"],
    ["mets", "application/mets+xml"],
    ["mfm", "application/vnd.mfmp"],
    ["mgp", "application/vnd.osgeo.mapguide.package"],
    ["mgz", "application/vnd.proteus.magazine"],
    ["mht", "message/rfc822"],
    ["mhtml", "message/rfc822"],
    ["mid", ["audio/mid", "audio/midi", "music/crescendo", "x-music/x-midi", "audio/x-midi", "application/x-midi", "audio/x-mid"]],
    ["midi", ["audio/midi", "music/crescendo", "x-music/x-midi", "audio/x-midi", "application/x-midi", "audio/x-mid"]],
    ["mif", ["application/vnd.mif", "application/x-mif", "application/x-frame"]],
    ["mime", ["message/rfc822", "www/mime"]],
    ["mj2", "video/mj2"],
    ["mjf", "audio/x-vnd.audioexplosion.mjuicemediafile"],
    ["mjpg", "video/x-motion-jpeg"],
    ["mlp", "application/vnd.dolby.mlp"],
    ["mm", ["application/base64", "application/x-meme"]],
    ["mmd", "application/vnd.chipnuts.karaoke-mmd"],
    ["mme", "application/base64"],
    ["mmf", "application/vnd.smaf"],
    ["mmr", "image/vnd.fujixerox.edmics-mmr"],
    ["mny", "application/x-msmoney"],
    ["mod", ["audio/mod", "audio/x-mod"]],
    ["mods", "application/mods+xml"],
    ["moov", "video/quicktime"],
    ["mov", "video/quicktime"],
    ["movie", "video/x-sgi-movie"],
    ["mp2", ["video/mpeg", "audio/mpeg", "video/x-mpeg", "audio/x-mpeg", "video/x-mpeq2a"]],
    ["mp3", ["audio/mpeg", "audio/mpeg3", "video/mpeg", "audio/x-mpeg-3", "video/x-mpeg"]],
    ["mp4", ["video/mp4", "application/mp4"]],
    ["mp4a", "audio/mp4"],
    ["mpa", ["video/mpeg", "audio/mpeg"]],
    ["mpc", ["application/vnd.mophun.certificate", "application/x-project"]],
    ["mpe", "video/mpeg"],
    ["mpeg", "video/mpeg"],
    ["mpg", ["video/mpeg", "audio/mpeg"]],
    ["mpga", "audio/mpeg"],
    ["mpkg", "application/vnd.apple.installer+xml"],
    ["mpm", "application/vnd.blueice.multipass"],
    ["mpn", "application/vnd.mophun.application"],
    ["mpp", "application/vnd.ms-project"],
    ["mpt", "application/x-project"],
    ["mpv", "application/x-project"],
    ["mpv2", "video/mpeg"],
    ["mpx", "application/x-project"],
    ["mpy", "application/vnd.ibm.minipay"],
    ["mqy", "application/vnd.mobius.mqy"],
    ["mrc", "application/marc"],
    ["mrcx", "application/marcxml+xml"],
    ["ms", "application/x-troff-ms"],
    ["mscml", "application/mediaservercontrol+xml"],
    ["mseq", "application/vnd.mseq"],
    ["msf", "application/vnd.epson.msf"],
    ["msg", "application/vnd.ms-outlook"],
    ["msh", "model/mesh"],
    ["msl", "application/vnd.mobius.msl"],
    ["msty", "application/vnd.muvee.style"],
    ["mts", "model/vnd.mts"],
    ["mus", "application/vnd.musician"],
    ["musicxml", "application/vnd.recordare.musicxml+xml"],
    ["mv", "video/x-sgi-movie"],
    ["mvb", "application/x-msmediaview"],
    ["mwf", "application/vnd.mfer"],
    ["mxf", "application/mxf"],
    ["mxl", "application/vnd.recordare.musicxml"],
    ["mxml", "application/xv+xml"],
    ["mxs", "application/vnd.triscape.mxs"],
    ["mxu", "video/vnd.mpegurl"],
    ["my", "audio/make"],
    ["mzz", "application/x-vnd.audioexplosion.mzz"],
    ["n-gage", "application/vnd.nokia.n-gage.symbian.install"],
    ["n3", "text/n3"],
    ["nap", "image/naplps"],
    ["naplps", "image/naplps"],
    ["nbp", "application/vnd.wolfram.player"],
    ["nc", "application/x-netcdf"],
    ["ncm", "application/vnd.nokia.configuration-message"],
    ["ncx", "application/x-dtbncx+xml"],
    ["ngdat", "application/vnd.nokia.n-gage.data"],
    ["nif", "image/x-niff"],
    ["niff", "image/x-niff"],
    ["nix", "application/x-mix-transfer"],
    ["nlu", "application/vnd.neurolanguage.nlu"],
    ["nml", "application/vnd.enliven"],
    ["nnd", "application/vnd.noblenet-directory"],
    ["nns", "application/vnd.noblenet-sealer"],
    ["nnw", "application/vnd.noblenet-web"],
    ["npx", "image/vnd.net-fpx"],
    ["nsc", "application/x-conference"],
    ["nsf", "application/vnd.lotus-notes"],
    ["nvd", "application/x-navidoc"],
    ["nws", "message/rfc822"],
    ["o", "application/octet-stream"],
    ["oa2", "application/vnd.fujitsu.oasys2"],
    ["oa3", "application/vnd.fujitsu.oasys3"],
    ["oas", "application/vnd.fujitsu.oasys"],
    ["obd", "application/x-msbinder"],
    ["oda", "application/oda"],
    ["odb", "application/vnd.oasis.opendocument.database"],
    ["odc", "application/vnd.oasis.opendocument.chart"],
    ["odf", "application/vnd.oasis.opendocument.formula"],
    ["odft", "application/vnd.oasis.opendocument.formula-template"],
    ["odg", "application/vnd.oasis.opendocument.graphics"],
    ["odi", "application/vnd.oasis.opendocument.image"],
    ["odm", "application/vnd.oasis.opendocument.text-master"],
    ["odp", "application/vnd.oasis.opendocument.presentation"],
    ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
    ["odt", "application/vnd.oasis.opendocument.text"],
    ["oga", "audio/ogg"],
    ["ogv", "video/ogg"],
    ["ogx", "application/ogg"],
    ["omc", "application/x-omc"],
    ["omcd", "application/x-omcdatamaker"],
    ["omcr", "application/x-omcregerator"],
    ["onetoc", "application/onenote"],
    ["opf", "application/oebps-package+xml"],
    ["org", "application/vnd.lotus-organizer"],
    ["osf", "application/vnd.yamaha.openscoreformat"],
    ["osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"],
    ["otc", "application/vnd.oasis.opendocument.chart-template"],
    ["otf", "application/x-font-otf"],
    ["otg", "application/vnd.oasis.opendocument.graphics-template"],
    ["oth", "application/vnd.oasis.opendocument.text-web"],
    ["oti", "application/vnd.oasis.opendocument.image-template"],
    ["otp", "application/vnd.oasis.opendocument.presentation-template"],
    ["ots", "application/vnd.oasis.opendocument.spreadsheet-template"],
    ["ott", "application/vnd.oasis.opendocument.text-template"],
    ["oxt", "application/vnd.openofficeorg.extension"],
    ["p", "text/x-pascal"],
    ["p10", ["application/pkcs10", "application/x-pkcs10"]],
    ["p12", ["application/pkcs-12", "application/x-pkcs12"]],
    ["p7a", "application/x-pkcs7-signature"],
    ["p7b", "application/x-pkcs7-certificates"],
    ["p7c", ["application/pkcs7-mime", "application/x-pkcs7-mime"]],
    ["p7m", ["application/pkcs7-mime", "application/x-pkcs7-mime"]],
    ["p7r", "application/x-pkcs7-certreqresp"],
    ["p7s", ["application/pkcs7-signature", "application/x-pkcs7-signature"]],
    ["p8", "application/pkcs8"],
    ["par", "text/plain-bas"],
    ["part", "application/pro_eng"],
    ["pas", "text/pascal"],
    ["paw", "application/vnd.pawaafile"],
    ["pbd", "application/vnd.powerbuilder6"],
    ["pbm", "image/x-portable-bitmap"],
    ["pcf", "application/x-font-pcf"],
    ["pcl", ["application/vnd.hp-pcl", "application/x-pcl"]],
    ["pclxl", "application/vnd.hp-pclxl"],
    ["pct", "image/x-pict"],
    ["pcurl", "application/vnd.curl.pcurl"],
    ["pcx", "image/x-pcx"],
    ["pdb", ["application/vnd.palm", "chemical/x-pdb"]],
    ["pdf", "application/pdf"],
    ["pfa", "application/x-font-type1"],
    ["pfr", "application/font-tdpfr"],
    ["pfunk", ["audio/make", "audio/make.my.funk"]],
    ["pfx", "application/x-pkcs12"],
    ["pgm", ["image/x-portable-graymap", "image/x-portable-greymap"]],
    ["pgn", "application/x-chess-pgn"],
    ["pgp", "application/pgp-signature"],
    ["pic", ["image/pict", "image/x-pict"]],
    ["pict", "image/pict"],
    ["pkg", "application/x-newton-compatible-pkg"],
    ["pki", "application/pkixcmp"],
    ["pkipath", "application/pkix-pkipath"],
    ["pko", ["application/ynd.ms-pkipko", "application/vnd.ms-pki.pko"]],
    ["pl", ["text/plain", "text/x-script.perl"]],
    ["plb", "application/vnd.3gpp.pic-bw-large"],
    ["plc", "application/vnd.mobius.plc"],
    ["plf", "application/vnd.pocketlearn"],
    ["pls", "application/pls+xml"],
    ["plx", "application/x-pixclscript"],
    ["pm", ["text/x-script.perl-module", "image/x-xpixmap"]],
    ["pm4", "application/x-pagemaker"],
    ["pm5", "application/x-pagemaker"],
    ["pma", "application/x-perfmon"],
    ["pmc", "application/x-perfmon"],
    ["pml", ["application/vnd.ctc-posml", "application/x-perfmon"]],
    ["pmr", "application/x-perfmon"],
    ["pmw", "application/x-perfmon"],
    ["png", "image/png"],
    ["pnm", ["application/x-portable-anymap", "image/x-portable-anymap"]],
    ["portpkg", "application/vnd.macports.portpkg"],
    ["pot", ["application/vnd.ms-powerpoint", "application/mspowerpoint"]],
    ["potm", "application/vnd.ms-powerpoint.template.macroenabled.12"],
    ["potx", "application/vnd.openxmlformats-officedocument.presentationml.template"],
    ["pov", "model/x-pov"],
    ["ppa", "application/vnd.ms-powerpoint"],
    ["ppam", "application/vnd.ms-powerpoint.addin.macroenabled.12"],
    ["ppd", "application/vnd.cups-ppd"],
    ["ppm", "image/x-portable-pixmap"],
    ["pps", ["application/vnd.ms-powerpoint", "application/mspowerpoint"]],
    ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroenabled.12"],
    ["ppsx", "application/vnd.openxmlformats-officedocument.presentationml.slideshow"],
    ["ppt", ["application/vnd.ms-powerpoint", "application/mspowerpoint", "application/powerpoint", "application/x-mspowerpoint"]],
    ["pptm", "application/vnd.ms-powerpoint.presentation.macroenabled.12"],
    ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    ["ppz", "application/mspowerpoint"],
    ["prc", "application/x-mobipocket-ebook"],
    ["pre", ["application/vnd.lotus-freelance", "application/x-freelance"]],
    ["prf", "application/pics-rules"],
    ["prt", "application/pro_eng"],
    ["ps", "application/postscript"],
    ["psb", "application/vnd.3gpp.pic-bw-small"],
    ["psd", ["application/octet-stream", "image/vnd.adobe.photoshop"]],
    ["psf", "application/x-font-linux-psf"],
    ["pskcxml", "application/pskc+xml"],
    ["ptid", "application/vnd.pvi.ptid1"],
    ["pub", "application/x-mspublisher"],
    ["pvb", "application/vnd.3gpp.pic-bw-var"],
    ["pvu", "paleovu/x-pv"],
    ["pwn", "application/vnd.3m.post-it-notes"],
    ["pwz", "application/vnd.ms-powerpoint"],
    ["py", "text/x-script.phyton"],
    ["pya", "audio/vnd.ms-playready.media.pya"],
    ["pyc", "application/x-bytecode.python"],
    ["pyv", "video/vnd.ms-playready.media.pyv"],
    ["qam", "application/vnd.epson.quickanime"],
    ["qbo", "application/vnd.intu.qbo"],
    ["qcp", "audio/vnd.qcelp"],
    ["qd3", "x-world/x-3dmf"],
    ["qd3d", "x-world/x-3dmf"],
    ["qfx", "application/vnd.intu.qfx"],
    ["qif", "image/x-quicktime"],
    ["qps", "application/vnd.publishare-delta-tree"],
    ["qt", "video/quicktime"],
    ["qtc", "video/x-qtc"],
    ["qti", "image/x-quicktime"],
    ["qtif", "image/x-quicktime"],
    ["qxd", "application/vnd.quark.quarkxpress"],
    ["ra", ["audio/x-realaudio", "audio/x-pn-realaudio", "audio/x-pn-realaudio-plugin"]],
    ["ram", "audio/x-pn-realaudio"],
    ["rar", "application/x-rar-compressed"],
    ["ras", ["image/cmu-raster", "application/x-cmu-raster", "image/x-cmu-raster"]],
    ["rast", "image/cmu-raster"],
    ["rcprofile", "application/vnd.ipunplugged.rcprofile"],
    ["rdf", "application/rdf+xml"],
    ["rdz", "application/vnd.data-vision.rdz"],
    ["rep", "application/vnd.businessobjects"],
    ["res", "application/x-dtbresource+xml"],
    ["rexx", "text/x-script.rexx"],
    ["rf", "image/vnd.rn-realflash"],
    ["rgb", "image/x-rgb"],
    ["rif", "application/reginfo+xml"],
    ["rip", "audio/vnd.rip"],
    ["rl", "application/resource-lists+xml"],
    ["rlc", "image/vnd.fujixerox.edmics-rlc"],
    ["rld", "application/resource-lists-diff+xml"],
    ["rm", ["application/vnd.rn-realmedia", "audio/x-pn-realaudio"]],
    ["rmi", "audio/mid"],
    ["rmm", "audio/x-pn-realaudio"],
    ["rmp", ["audio/x-pn-realaudio-plugin", "audio/x-pn-realaudio"]],
    ["rms", "application/vnd.jcp.javame.midlet-rms"],
    ["rnc", "application/relax-ng-compact-syntax"],
    ["rng", ["application/ringing-tones", "application/vnd.nokia.ringing-tone"]],
    ["rnx", "application/vnd.rn-realplayer"],
    ["roff", "application/x-troff"],
    ["rp", "image/vnd.rn-realpix"],
    ["rp9", "application/vnd.cloanto.rp9"],
    ["rpm", "audio/x-pn-realaudio-plugin"],
    ["rpss", "application/vnd.nokia.radio-presets"],
    ["rpst", "application/vnd.nokia.radio-preset"],
    ["rq", "application/sparql-query"],
    ["rs", "application/rls-services+xml"],
    ["rsd", "application/rsd+xml"],
    ["rt", ["text/richtext", "text/vnd.rn-realtext"]],
    ["rtf", ["application/rtf", "text/richtext", "application/x-rtf"]],
    ["rtx", ["text/richtext", "application/rtf"]],
    ["rv", "video/vnd.rn-realvideo"],
    ["s", "text/x-asm"],
    ["s3m", "audio/s3m"],
    ["saf", "application/vnd.yamaha.smaf-audio"],
    ["saveme", "application/octet-stream"],
    ["sbk", "application/x-tbook"],
    ["sbml", "application/sbml+xml"],
    ["sc", "application/vnd.ibm.secure-container"],
    ["scd", "application/x-msschedule"],
    [
      "scm",
      ["application/vnd.lotus-screencam", "video/x-scm", "text/x-script.guile", "application/x-lotusscreencam", "text/x-script.scheme"]
    ],
    ["scq", "application/scvp-cv-request"],
    ["scs", "application/scvp-cv-response"],
    ["sct", "text/scriptlet"],
    ["scurl", "text/vnd.curl.scurl"],
    ["sda", "application/vnd.stardivision.draw"],
    ["sdc", "application/vnd.stardivision.calc"],
    ["sdd", "application/vnd.stardivision.impress"],
    ["sdkm", "application/vnd.solent.sdkm+xml"],
    ["sdml", "text/plain"],
    ["sdp", ["application/sdp", "application/x-sdp"]],
    ["sdr", "application/sounder"],
    ["sdw", "application/vnd.stardivision.writer"],
    ["sea", ["application/sea", "application/x-sea"]],
    ["see", "application/vnd.seemail"],
    ["seed", "application/vnd.fdsn.seed"],
    ["sema", "application/vnd.sema"],
    ["semd", "application/vnd.semd"],
    ["semf", "application/vnd.semf"],
    ["ser", "application/java-serialized-object"],
    ["set", "application/set"],
    ["setpay", "application/set-payment-initiation"],
    ["setreg", "application/set-registration-initiation"],
    ["sfd-hdstx", "application/vnd.hydrostatix.sof-data"],
    ["sfs", "application/vnd.spotfire.sfs"],
    ["sgl", "application/vnd.stardivision.writer-global"],
    ["sgm", ["text/sgml", "text/x-sgml"]],
    ["sgml", ["text/sgml", "text/x-sgml"]],
    ["sh", ["application/x-shar", "application/x-bsh", "application/x-sh", "text/x-script.sh"]],
    ["shar", ["application/x-bsh", "application/x-shar"]],
    ["shf", "application/shf+xml"],
    ["shtml", ["text/html", "text/x-server-parsed-html"]],
    ["sid", "audio/x-psid"],
    ["sis", "application/vnd.symbian.install"],
    ["sit", ["application/x-stuffit", "application/x-sit"]],
    ["sitx", "application/x-stuffitx"],
    ["skd", "application/x-koan"],
    ["skm", "application/x-koan"],
    ["skp", ["application/vnd.koan", "application/x-koan"]],
    ["skt", "application/x-koan"],
    ["sl", "application/x-seelogo"],
    ["sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"],
    ["sldx", "application/vnd.openxmlformats-officedocument.presentationml.slide"],
    ["slt", "application/vnd.epson.salt"],
    ["sm", "application/vnd.stepmania.stepchart"],
    ["smf", "application/vnd.stardivision.math"],
    ["smi", ["application/smil", "application/smil+xml"]],
    ["smil", "application/smil"],
    ["snd", ["audio/basic", "audio/x-adpcm"]],
    ["snf", "application/x-font-snf"],
    ["sol", "application/solids"],
    ["spc", ["text/x-speech", "application/x-pkcs7-certificates"]],
    ["spf", "application/vnd.yamaha.smaf-phrase"],
    ["spl", ["application/futuresplash", "application/x-futuresplash"]],
    ["spot", "text/vnd.in3d.spot"],
    ["spp", "application/scvp-vp-response"],
    ["spq", "application/scvp-vp-request"],
    ["spr", "application/x-sprite"],
    ["sprite", "application/x-sprite"],
    ["src", "application/x-wais-source"],
    ["sru", "application/sru+xml"],
    ["srx", "application/sparql-results+xml"],
    ["sse", "application/vnd.kodak-descriptor"],
    ["ssf", "application/vnd.epson.ssf"],
    ["ssi", "text/x-server-parsed-html"],
    ["ssm", "application/streamingmedia"],
    ["ssml", "application/ssml+xml"],
    ["sst", ["application/vnd.ms-pkicertstore", "application/vnd.ms-pki.certstore"]],
    ["st", "application/vnd.sailingtracker.track"],
    ["stc", "application/vnd.sun.xml.calc.template"],
    ["std", "application/vnd.sun.xml.draw.template"],
    ["step", "application/step"],
    ["stf", "application/vnd.wt.stf"],
    ["sti", "application/vnd.sun.xml.impress.template"],
    ["stk", "application/hyperstudio"],
    ["stl", ["application/vnd.ms-pkistl", "application/sla", "application/vnd.ms-pki.stl", "application/x-navistyle"]],
    ["stm", "text/html"],
    ["stp", "application/step"],
    ["str", "application/vnd.pg.format"],
    ["stw", "application/vnd.sun.xml.writer.template"],
    ["sub", "image/vnd.dvb.subtitle"],
    ["sus", "application/vnd.sus-calendar"],
    ["sv4cpio", "application/x-sv4cpio"],
    ["sv4crc", "application/x-sv4crc"],
    ["svc", "application/vnd.dvb.service"],
    ["svd", "application/vnd.svd"],
    ["svf", ["image/vnd.dwg", "image/x-dwg"]],
    ["svg", "image/svg+xml"],
    ["svr", ["x-world/x-svr", "application/x-world"]],
    ["swf", "application/x-shockwave-flash"],
    ["swi", "application/vnd.aristanetworks.swi"],
    ["sxc", "application/vnd.sun.xml.calc"],
    ["sxd", "application/vnd.sun.xml.draw"],
    ["sxg", "application/vnd.sun.xml.writer.global"],
    ["sxi", "application/vnd.sun.xml.impress"],
    ["sxm", "application/vnd.sun.xml.math"],
    ["sxw", "application/vnd.sun.xml.writer"],
    ["t", ["text/troff", "application/x-troff"]],
    ["talk", "text/x-speech"],
    ["tao", "application/vnd.tao.intent-module-archive"],
    ["tar", "application/x-tar"],
    ["tbk", ["application/toolbook", "application/x-tbook"]],
    ["tcap", "application/vnd.3gpp2.tcap"],
    ["tcl", ["text/x-script.tcl", "application/x-tcl"]],
    ["tcsh", "text/x-script.tcsh"],
    ["teacher", "application/vnd.smart.teacher"],
    ["tei", "application/tei+xml"],
    ["tex", "application/x-tex"],
    ["texi", "application/x-texinfo"],
    ["texinfo", "application/x-texinfo"],
    ["text", ["application/plain", "text/plain"]],
    ["tfi", "application/thraud+xml"],
    ["tfm", "application/x-tex-tfm"],
    ["tgz", ["application/gnutar", "application/x-compressed"]],
    ["thmx", "application/vnd.ms-officetheme"],
    ["tif", ["image/tiff", "image/x-tiff"]],
    ["tiff", ["image/tiff", "image/x-tiff"]],
    ["tmo", "application/vnd.tmobile-livetv"],
    ["torrent", "application/x-bittorrent"],
    ["tpl", "application/vnd.groove-tool-template"],
    ["tpt", "application/vnd.trid.tpt"],
    ["tr", "application/x-troff"],
    ["tra", "application/vnd.trueapp"],
    ["trm", "application/x-msterminal"],
    ["tsd", "application/timestamped-data"],
    ["tsi", "audio/tsp-audio"],
    ["tsp", ["application/dsptype", "audio/tsplayer"]],
    ["tsv", "text/tab-separated-values"],
    ["ttf", "application/x-font-ttf"],
    ["ttl", "text/turtle"],
    ["turbot", "image/florian"],
    ["twd", "application/vnd.simtech-mindmapper"],
    ["txd", "application/vnd.genomatix.tuxedo"],
    ["txf", "application/vnd.mobius.txf"],
    ["txt", "text/plain"],
    ["ufd", "application/vnd.ufdl"],
    ["uil", "text/x-uil"],
    ["uls", "text/iuls"],
    ["umj", "application/vnd.umajin"],
    ["uni", "text/uri-list"],
    ["unis", "text/uri-list"],
    ["unityweb", "application/vnd.unity"],
    ["unv", "application/i-deas"],
    ["uoml", "application/vnd.uoml+xml"],
    ["uri", "text/uri-list"],
    ["uris", "text/uri-list"],
    ["ustar", ["application/x-ustar", "multipart/x-ustar"]],
    ["utz", "application/vnd.uiq.theme"],
    ["uu", ["application/octet-stream", "text/x-uuencode"]],
    ["uue", "text/x-uuencode"],
    ["uva", "audio/vnd.dece.audio"],
    ["uvh", "video/vnd.dece.hd"],
    ["uvi", "image/vnd.dece.graphic"],
    ["uvm", "video/vnd.dece.mobile"],
    ["uvp", "video/vnd.dece.pd"],
    ["uvs", "video/vnd.dece.sd"],
    ["uvu", "video/vnd.uvvu.mp4"],
    ["uvv", "video/vnd.dece.video"],
    ["vcd", "application/x-cdlink"],
    ["vcf", "text/x-vcard"],
    ["vcg", "application/vnd.groove-vcard"],
    ["vcs", "text/x-vcalendar"],
    ["vcx", "application/vnd.vcx"],
    ["vda", "application/vda"],
    ["vdo", "video/vdo"],
    ["vew", "application/groupwise"],
    ["vis", "application/vnd.visionary"],
    ["viv", ["video/vivo", "video/vnd.vivo"]],
    ["vivo", ["video/vivo", "video/vnd.vivo"]],
    ["vmd", "application/vocaltec-media-desc"],
    ["vmf", "application/vocaltec-media-file"],
    ["voc", ["audio/voc", "audio/x-voc"]],
    ["vos", "video/vosaic"],
    ["vox", "audio/voxware"],
    ["vqe", "audio/x-twinvq-plugin"],
    ["vqf", "audio/x-twinvq"],
    ["vql", "audio/x-twinvq-plugin"],
    ["vrml", ["model/vrml", "x-world/x-vrml", "application/x-vrml"]],
    ["vrt", "x-world/x-vrt"],
    ["vsd", ["application/vnd.visio", "application/x-visio"]],
    ["vsf", "application/vnd.vsf"],
    ["vst", "application/x-visio"],
    ["vsw", "application/x-visio"],
    ["vtu", "model/vnd.vtu"],
    ["vxml", "application/voicexml+xml"],
    ["w60", "application/wordperfect6.0"],
    ["w61", "application/wordperfect6.1"],
    ["w6w", "application/msword"],
    ["wad", "application/x-doom"],
    ["wav", ["audio/wav", "audio/x-wav"]],
    ["wax", "audio/x-ms-wax"],
    ["wb1", "application/x-qpro"],
    ["wbmp", "image/vnd.wap.wbmp"],
    ["wbs", "application/vnd.criticaltools.wbs+xml"],
    ["wbxml", "application/vnd.wap.wbxml"],
    ["wcm", "application/vnd.ms-works"],
    ["wdb", "application/vnd.ms-works"],
    ["web", "application/vnd.xara"],
    ["weba", "audio/webm"],
    ["webm", "video/webm"],
    ["webp", "image/webp"],
    ["wg", "application/vnd.pmi.widget"],
    ["wgt", "application/widget"],
    ["wiz", "application/msword"],
    ["wk1", "application/x-123"],
    ["wks", "application/vnd.ms-works"],
    ["wm", "video/x-ms-wm"],
    ["wma", "audio/x-ms-wma"],
    ["wmd", "application/x-ms-wmd"],
    ["wmf", ["windows/metafile", "application/x-msmetafile"]],
    ["wml", "text/vnd.wap.wml"],
    ["wmlc", "application/vnd.wap.wmlc"],
    ["wmls", "text/vnd.wap.wmlscript"],
    ["wmlsc", "application/vnd.wap.wmlscriptc"],
    ["wmv", "video/x-ms-wmv"],
    ["wmx", "video/x-ms-wmx"],
    ["wmz", "application/x-ms-wmz"],
    ["woff", "application/x-font-woff"],
    ["word", "application/msword"],
    ["wp", "application/wordperfect"],
    ["wp5", ["application/wordperfect", "application/wordperfect6.0"]],
    ["wp6", "application/wordperfect"],
    ["wpd", ["application/wordperfect", "application/vnd.wordperfect", "application/x-wpwin"]],
    ["wpl", "application/vnd.ms-wpl"],
    ["wps", "application/vnd.ms-works"],
    ["wq1", "application/x-lotus"],
    ["wqd", "application/vnd.wqd"],
    ["wri", ["application/mswrite", "application/x-wri", "application/x-mswrite"]],
    ["wrl", ["model/vrml", "x-world/x-vrml", "application/x-world"]],
    ["wrz", ["model/vrml", "x-world/x-vrml"]],
    ["wsc", "text/scriplet"],
    ["wsdl", "application/wsdl+xml"],
    ["wspolicy", "application/wspolicy+xml"],
    ["wsrc", "application/x-wais-source"],
    ["wtb", "application/vnd.webturbo"],
    ["wtk", "application/x-wintalk"],
    ["wvx", "video/x-ms-wvx"],
    ["x-png", "image/png"],
    ["x3d", "application/vnd.hzn-3d-crossword"],
    ["xaf", "x-world/x-vrml"],
    ["xap", "application/x-silverlight-app"],
    ["xar", "application/vnd.xara"],
    ["xbap", "application/x-ms-xbap"],
    ["xbd", "application/vnd.fujixerox.docuworks.binder"],
    ["xbm", ["image/xbm", "image/x-xbm", "image/x-xbitmap"]],
    ["xdf", "application/xcap-diff+xml"],
    ["xdm", "application/vnd.syncml.dm+xml"],
    ["xdp", "application/vnd.adobe.xdp+xml"],
    ["xdr", "video/x-amt-demorun"],
    ["xdssc", "application/dssc+xml"],
    ["xdw", "application/vnd.fujixerox.docuworks"],
    ["xenc", "application/xenc+xml"],
    ["xer", "application/patch-ops-error+xml"],
    ["xfdf", "application/vnd.adobe.xfdf"],
    ["xfdl", "application/vnd.xfdl"],
    ["xgz", "xgl/drawing"],
    ["xhtml", "application/xhtml+xml"],
    ["xif", "image/vnd.xiff"],
    ["xl", "application/excel"],
    ["xla", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
    ["xlam", "application/vnd.ms-excel.addin.macroenabled.12"],
    ["xlb", ["application/excel", "application/vnd.ms-excel", "application/x-excel"]],
    ["xlc", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
    ["xld", ["application/excel", "application/x-excel"]],
    ["xlk", ["application/excel", "application/x-excel"]],
    ["xll", ["application/excel", "application/vnd.ms-excel", "application/x-excel"]],
    ["xlm", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
    ["xls", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
    ["xlsb", "application/vnd.ms-excel.sheet.binary.macroenabled.12"],
    ["xlsm", "application/vnd.ms-excel.sheet.macroenabled.12"],
    ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    ["xlt", ["application/vnd.ms-excel", "application/excel", "application/x-excel"]],
    ["xltm", "application/vnd.ms-excel.template.macroenabled.12"],
    ["xltx", "application/vnd.openxmlformats-officedocument.spreadsheetml.template"],
    ["xlv", ["application/excel", "application/x-excel"]],
    ["xlw", ["application/vnd.ms-excel", "application/excel", "application/x-msexcel", "application/x-excel"]],
    ["xm", "audio/xm"],
    ["xml", ["application/xml", "text/xml", "application/atom+xml", "application/rss+xml"]],
    ["xmz", "xgl/movie"],
    ["xo", "application/vnd.olpc-sugar"],
    ["xof", "x-world/x-vrml"],
    ["xop", "application/xop+xml"],
    ["xpi", "application/x-xpinstall"],
    ["xpix", "application/x-vnd.ls-xpix"],
    ["xpm", ["image/xpm", "image/x-xpixmap"]],
    ["xpr", "application/vnd.is-xpr"],
    ["xps", "application/vnd.ms-xpsdocument"],
    ["xpw", "application/vnd.intercon.formnet"],
    ["xslt", "application/xslt+xml"],
    ["xsm", "application/vnd.syncml+xml"],
    ["xspf", "application/xspf+xml"],
    ["xsr", "video/x-amt-showrun"],
    ["xul", "application/vnd.mozilla.xul+xml"],
    ["xwd", ["image/x-xwd", "image/x-xwindowdump"]],
    ["xyz", ["chemical/x-xyz", "chemical/x-pdb"]],
    ["yang", "application/yang"],
    ["yin", "application/yin+xml"],
    ["z", ["application/x-compressed", "application/x-compress"]],
    ["zaz", "application/vnd.zzazz.deck+xml"],
    ["zip", ["application/zip", "multipart/x-zip", "application/x-zip-compressed", "application/x-compressed"]],
    ["zir", "application/vnd.zul"],
    ["zmm", "application/vnd.handheld-entertainment+xml"],
    ["zoo", "application/octet-stream"],
    ["zsh", "text/x-script.zsh"]
  ]);
  module.exports = {
    detectMimeType(filename) {
      if (!filename) {
        return defaultMimeType;
      }
      let parsed = path2.parse(filename);
      let extension = (parsed.ext.substr(1) || parsed.name || "").split("?").shift().trim().toLowerCase();
      let value = defaultMimeType;
      if (extensions.has(extension)) {
        value = extensions.get(extension);
      }
      if (Array.isArray(value)) {
        return value[0];
      }
      return value;
    },
    detectExtension(mimeType) {
      if (!mimeType) {
        return defaultExtension;
      }
      let parts = (mimeType || "").toLowerCase().trim().split("/");
      let rootType = parts.shift().trim();
      let subType = parts.join("/").trim();
      if (mimeTypes.has(rootType + "/" + subType)) {
        let value = mimeTypes.get(rootType + "/" + subType);
        if (Array.isArray(value)) {
          return value[0];
        }
        return value;
      }
      switch (rootType) {
        case "text":
          return "txt";
        default:
          return "bin";
      }
    }
  };
});

// node_modules/nodemailer/lib/punycode/index.js
var require_punycode = __commonJS((exports, module) => {
  var maxInt = 2147483647;
  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128;
  var delimiter = "-";
  var regexPunycode = /^xn--/;
  var regexNonASCII = /[^\0-\x7F]/;
  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
  var errors2 = {
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
  };
  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  function error(type) {
    throw new RangeError(errors2[type]);
  }
  function map(array, callback) {
    const result = [];
    let length = array.length;
    while (length--) {
      result[length] = callback(array[length]);
    }
    return result;
  }
  function mapDomain(domain, callback) {
    const parts = domain.split("@");
    let result = "";
    if (parts.length > 1) {
      result = parts[0] + "@";
      domain = parts[1];
    }
    domain = domain.replace(regexSeparators, ".");
    const labels = domain.split(".");
    const encoded = map(labels, callback).join(".");
    return result + encoded;
  }
  function ucs2decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;
    while (counter < length) {
      const value = string.charCodeAt(counter++);
      if (value >= 55296 && value <= 56319 && counter < length) {
        const extra = string.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
  var basicToDigit = function(codePoint) {
    if (codePoint >= 48 && codePoint < 58) {
      return 26 + (codePoint - 48);
    }
    if (codePoint >= 65 && codePoint < 91) {
      return codePoint - 65;
    }
    if (codePoint >= 97 && codePoint < 123) {
      return codePoint - 97;
    }
    return base;
  };
  var digitToBasic = function(digit, flag) {
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  };
  var adapt = function(delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for (;delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  };
  var decode = function(input) {
    const output = [];
    const inputLength = input.length;
    let i = 0;
    let n = initialN;
    let bias = initialBias;
    let basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
      basic = 0;
    }
    for (let j = 0;j < basic; ++j) {
      if (input.charCodeAt(j) >= 128) {
        error("not-basic");
      }
      output.push(input.charCodeAt(j));
    }
    for (let index = basic > 0 ? basic + 1 : 0;index < inputLength; ) {
      const oldi = i;
      for (let w = 1, k = base;; k += base) {
        if (index >= inputLength) {
          error("invalid-input");
        }
        const digit = basicToDigit(input.charCodeAt(index++));
        if (digit >= base) {
          error("invalid-input");
        }
        if (digit > floor((maxInt - i) / w)) {
          error("overflow");
        }
        i += digit * w;
        const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t) {
          break;
        }
        const baseMinusT = base - t;
        if (w > floor(maxInt / baseMinusT)) {
          error("overflow");
        }
        w *= baseMinusT;
      }
      const out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0);
      if (floor(i / out) > maxInt - n) {
        error("overflow");
      }
      n += floor(i / out);
      i %= out;
      output.splice(i++, 0, n);
    }
    return String.fromCodePoint(...output);
  };
  var encode = function(input) {
    const output = [];
    input = ucs2decode(input);
    const inputLength = input.length;
    let n = initialN;
    let delta = 0;
    let bias = initialBias;
    for (const currentValue of input) {
      if (currentValue < 128) {
        output.push(stringFromCharCode(currentValue));
      }
    }
    const basicLength = output.length;
    let handledCPCount = basicLength;
    if (basicLength) {
      output.push(delimiter);
    }
    while (handledCPCount < inputLength) {
      let m = maxInt;
      for (const currentValue of input) {
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }
      const handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error("overflow");
      }
      delta += (m - n) * handledCPCountPlusOne;
      n = m;
      for (const currentValue of input) {
        if (currentValue < n && ++delta > maxInt) {
          error("overflow");
        }
        if (currentValue === n) {
          let q = delta;
          for (let k = base;; k += base) {
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (q < t) {
              break;
            }
            const qMinusT = q - t;
            const baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }
          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }
      ++delta;
      ++n;
    }
    return output.join("");
  };
  var toUnicode = function(input) {
    return mapDomain(input, function(string) {
      return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
  };
  var toASCII = function(input) {
    return mapDomain(input, function(string) {
      return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
    });
  };
  var punycode = {
    version: "2.3.1",
    ucs2: {
      decode: ucs2decode,
      encode: ucs2encode
    },
    decode,
    encode,
    toASCII,
    toUnicode
  };
  module.exports = punycode;
});

// node_modules/nodemailer/lib/base64/index.js
var require_base64 = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;
  function encode(buffer) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer, "utf-8");
    }
    return buffer.toString("base64");
  }
  function wrap(str, lineLength) {
    str = (str || "").toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
      return str;
    }
    let result = [];
    let pos = 0;
    let chunkLength = lineLength * 1024;
    while (pos < str.length) {
      let wrappedLines = str.substr(pos, chunkLength).replace(new RegExp(".{" + lineLength + "}", "g"), `$&\r
`);
      result.push(wrappedLines);
      pos += chunkLength;
    }
    return result.join("");
  }

  class Encoder extends Transform {
    constructor(options) {
      super();
      this.options = options || {};
      if (this.options.lineLength !== false) {
        this.options.lineLength = this.options.lineLength || 76;
      }
      this._curLine = "";
      this._remainingBytes = false;
      this.inputBytes = 0;
      this.outputBytes = 0;
    }
    _transform(chunk, encoding, done) {
      if (encoding !== "buffer") {
        chunk = Buffer.from(chunk, encoding);
      }
      if (!chunk || !chunk.length) {
        return setImmediate(done);
      }
      this.inputBytes += chunk.length;
      if (this._remainingBytes && this._remainingBytes.length) {
        chunk = Buffer.concat([this._remainingBytes, chunk], this._remainingBytes.length + chunk.length);
        this._remainingBytes = false;
      }
      if (chunk.length % 3) {
        this._remainingBytes = chunk.slice(chunk.length - chunk.length % 3);
        chunk = chunk.slice(0, chunk.length - chunk.length % 3);
      } else {
        this._remainingBytes = false;
      }
      let b64 = this._curLine + encode(chunk);
      if (this.options.lineLength) {
        b64 = wrap(b64, this.options.lineLength);
        let lastLF = b64.lastIndexOf(`
`);
        if (lastLF < 0) {
          this._curLine = b64;
          b64 = "";
        } else {
          this._curLine = b64.substring(lastLF + 1);
          b64 = b64.substring(0, lastLF + 1);
          if (b64 && !b64.endsWith(`\r
`)) {
            b64 += `\r
`;
          }
        }
      } else {
        this._curLine = "";
      }
      if (b64) {
        this.outputBytes += b64.length;
        this.push(Buffer.from(b64, "ascii"));
      }
      setImmediate(done);
    }
    _flush(done) {
      if (this._remainingBytes && this._remainingBytes.length) {
        this._curLine += encode(this._remainingBytes);
      }
      if (this._curLine) {
        this.outputBytes += this._curLine.length;
        this.push(Buffer.from(this._curLine, "ascii"));
        this._curLine = "";
      }
      done();
    }
  }
  module.exports = {
    encode,
    wrap,
    Encoder
  };
});

// node_modules/nodemailer/lib/qp/index.js
var require_qp = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;
  function encode(buffer) {
    if (typeof buffer === "string") {
      buffer = Buffer.from(buffer, "utf-8");
    }
    let ranges = [
      [9],
      [10],
      [13],
      [32, 60],
      [62, 126]
    ];
    let result = "";
    let ord;
    for (let i = 0, len = buffer.length;i < len; i++) {
      ord = buffer[i];
      if (checkRanges(ord, ranges) && !((ord === 32 || ord === 9) && (i === len - 1 || buffer[i + 1] === 10 || buffer[i + 1] === 13))) {
        result += String.fromCharCode(ord);
        continue;
      }
      result += "=" + (ord < 16 ? "0" : "") + ord.toString(16).toUpperCase();
    }
    return result;
  }
  function wrap(str, lineLength) {
    str = (str || "").toString();
    lineLength = lineLength || 76;
    if (str.length <= lineLength) {
      return str;
    }
    let pos = 0;
    let len = str.length;
    let match, code, line;
    let lineMargin = Math.floor(lineLength / 3);
    let result = "";
    while (pos < len) {
      line = str.substr(pos, lineLength);
      if (match = line.match(/\r\n/)) {
        line = line.substr(0, match.index + match[0].length);
        result += line;
        pos += line.length;
        continue;
      }
      if (line.substr(-1) === `
`) {
        result += line;
        pos += line.length;
        continue;
      } else if (match = line.substr(-lineMargin).match(/\n.*?$/)) {
        line = line.substr(0, line.length - (match[0].length - 1));
        result += line;
        pos += line.length;
        continue;
      } else if (line.length > lineLength - lineMargin && (match = line.substr(-lineMargin).match(/[ \t.,!?][^ \t.,!?]*$/))) {
        line = line.substr(0, line.length - (match[0].length - 1));
      } else if (line.match(/[=][\da-f]{0,2}$/i)) {
        if (match = line.match(/[=][\da-f]{0,1}$/i)) {
          line = line.substr(0, line.length - match[0].length);
        }
        while (line.length > 3 && line.length < len - pos && !line.match(/^(?:=[\da-f]{2}){1,4}$/i) && (match = line.match(/[=][\da-f]{2}$/gi))) {
          code = parseInt(match[0].substr(1, 2), 16);
          if (code < 128) {
            break;
          }
          line = line.substr(0, line.length - 3);
          if (code >= 192) {
            break;
          }
        }
      }
      if (pos + line.length < len && line.substr(-1) !== `
`) {
        if (line.length === lineLength && line.match(/[=][\da-f]{2}$/i)) {
          line = line.substr(0, line.length - 3);
        } else if (line.length === lineLength) {
          line = line.substr(0, line.length - 1);
        }
        pos += line.length;
        line += `=\r
`;
      } else {
        pos += line.length;
      }
      result += line;
    }
    return result;
  }
  function checkRanges(nr, ranges) {
    for (let i = ranges.length - 1;i >= 0; i--) {
      if (!ranges[i].length) {
        continue;
      }
      if (ranges[i].length === 1 && nr === ranges[i][0]) {
        return true;
      }
      if (ranges[i].length === 2 && nr >= ranges[i][0] && nr <= ranges[i][1]) {
        return true;
      }
    }
    return false;
  }

  class Encoder extends Transform {
    constructor(options) {
      super();
      this.options = options || {};
      if (this.options.lineLength !== false) {
        this.options.lineLength = this.options.lineLength || 76;
      }
      this._curLine = "";
      this.inputBytes = 0;
      this.outputBytes = 0;
    }
    _transform(chunk, encoding, done) {
      let qp;
      if (encoding !== "buffer") {
        chunk = Buffer.from(chunk, encoding);
      }
      if (!chunk || !chunk.length) {
        return done();
      }
      this.inputBytes += chunk.length;
      if (this.options.lineLength) {
        qp = this._curLine + encode(chunk);
        qp = wrap(qp, this.options.lineLength);
        qp = qp.replace(/(^|\n)([^\n]*)$/, (match, lineBreak, lastLine) => {
          this._curLine = lastLine;
          return lineBreak;
        });
        if (qp) {
          this.outputBytes += qp.length;
          this.push(qp);
        }
      } else {
        qp = encode(chunk);
        this.outputBytes += qp.length;
        this.push(qp, "ascii");
      }
      done();
    }
    _flush(done) {
      if (this._curLine) {
        this.outputBytes += this._curLine.length;
        this.push(this._curLine, "ascii");
      }
      done();
    }
  }
  module.exports = {
    encode,
    wrap,
    Encoder
  };
});

// node_modules/nodemailer/lib/mime-funcs/index.js
var require_mime_funcs = __commonJS((exports, module) => {
  var base64 = require_base64();
  var qp = require_qp();
  var mimeTypes = require_mime_types();
  module.exports = {
    isPlainText(value, isParam) {
      const re = isParam ? /[\x00-\x08\x0b\x0c\x0e-\x1f"\u0080-\uFFFF]/ : /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/;
      if (typeof value !== "string" || re.test(value)) {
        return false;
      } else {
        return true;
      }
    },
    hasLongerLines(str, lineLength) {
      if (str.length > 128 * 1024) {
        return true;
      }
      return new RegExp("^.{" + (lineLength + 1) + ",}", "m").test(str);
    },
    encodeWord(data, mimeWordEncoding, maxLength) {
      mimeWordEncoding = (mimeWordEncoding || "Q").toString().toUpperCase().trim().charAt(0);
      maxLength = maxLength || 0;
      let encodedStr;
      let toCharset = "UTF-8";
      if (maxLength && maxLength > 7 + toCharset.length) {
        maxLength -= 7 + toCharset.length;
      }
      if (mimeWordEncoding === "Q") {
        encodedStr = qp.encode(data).replace(/[^a-z0-9!*+\-/=]/gi, (chr) => {
          let ord = chr.charCodeAt(0).toString(16).toUpperCase();
          if (chr === " ") {
            return "_";
          } else {
            return "=" + (ord.length === 1 ? "0" + ord : ord);
          }
        });
      } else if (mimeWordEncoding === "B") {
        encodedStr = typeof data === "string" ? data : base64.encode(data);
        maxLength = maxLength ? Math.max(3, (maxLength - maxLength % 4) / 4 * 3) : 0;
      }
      if (maxLength && (mimeWordEncoding !== "B" ? encodedStr : base64.encode(data)).length > maxLength) {
        if (mimeWordEncoding === "Q") {
          encodedStr = this.splitMimeEncodedString(encodedStr, maxLength).join("?= =?" + toCharset + "?" + mimeWordEncoding + "?");
        } else {
          let parts = [];
          let lpart = "";
          for (let i = 0, len = encodedStr.length;i < len; i++) {
            let chr = encodedStr.charAt(i);
            if (/[\ud83c\ud83d\ud83e]/.test(chr) && i < len - 1) {
              chr += encodedStr.charAt(++i);
            }
            if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
              lpart += chr;
            } else {
              parts.push(base64.encode(lpart));
              lpart = chr;
            }
          }
          if (lpart) {
            parts.push(base64.encode(lpart));
          }
          if (parts.length > 1) {
            encodedStr = parts.join("?= =?" + toCharset + "?" + mimeWordEncoding + "?");
          } else {
            encodedStr = parts.join("");
          }
        }
      } else if (mimeWordEncoding === "B") {
        encodedStr = base64.encode(data);
      }
      return "=?" + toCharset + "?" + mimeWordEncoding + "?" + encodedStr + (encodedStr.substr(-2) === "?=" ? "" : "?=");
    },
    encodeWords(value, mimeWordEncoding, maxLength, encodeAll) {
      maxLength = maxLength || 0;
      let encodedValue;
      let firstMatch = value.match(/(?:^|\s)([^\s]*["\u0080-\uFFFF])/);
      if (!firstMatch) {
        return value;
      }
      if (encodeAll) {
        return this.encodeWord(value, mimeWordEncoding, maxLength);
      }
      let lastMatch = value.match(/(["\u0080-\uFFFF][^\s]*)[^"\u0080-\uFFFF]*$/);
      if (!lastMatch) {
        return value;
      }
      let startIndex = firstMatch.index + (firstMatch[0].match(/[^\s]/) || {
        index: 0
      }).index;
      let endIndex = lastMatch.index + (lastMatch[1] || "").length;
      encodedValue = (startIndex ? value.substr(0, startIndex) : "") + this.encodeWord(value.substring(startIndex, endIndex), mimeWordEncoding || "Q", maxLength) + (endIndex < value.length ? value.substr(endIndex) : "");
      return encodedValue;
    },
    buildHeaderValue(structured) {
      let paramsArray = [];
      Object.keys(structured.params || {}).forEach((param) => {
        let value = structured.params[param];
        if (!this.isPlainText(value, true) || value.length >= 75) {
          this.buildHeaderParam(param, value, 50).forEach((encodedParam) => {
            if (!/[\s"\\;:/=(),<>@[\]?]|^[-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === "*") {
              paramsArray.push(encodedParam.key + "=" + encodedParam.value);
            } else {
              paramsArray.push(encodedParam.key + "=" + JSON.stringify(encodedParam.value));
            }
          });
        } else if (/[\s'"\\;:/=(),<>@[\]?]|^-/.test(value)) {
          paramsArray.push(param + "=" + JSON.stringify(value));
        } else {
          paramsArray.push(param + "=" + value);
        }
      });
      return structured.value + (paramsArray.length ? "; " + paramsArray.join("; ") : "");
    },
    buildHeaderParam(key, data, maxLength) {
      let list = [];
      let encodedStr = typeof data === "string" ? data : (data || "").toString();
      let encodedStrArr;
      let chr, ord;
      let line;
      let startPos = 0;
      let i, len;
      maxLength = maxLength || 50;
      if (this.isPlainText(data, true)) {
        if (encodedStr.length <= maxLength) {
          return [
            {
              key,
              value: encodedStr
            }
          ];
        }
        encodedStr = encodedStr.replace(new RegExp(".{" + maxLength + "}", "g"), (str) => {
          list.push({
            line: str
          });
          return "";
        });
        if (encodedStr) {
          list.push({
            line: encodedStr
          });
        }
      } else {
        if (/[\uD800-\uDBFF]/.test(encodedStr)) {
          encodedStrArr = [];
          for (i = 0, len = encodedStr.length;i < len; i++) {
            chr = encodedStr.charAt(i);
            ord = chr.charCodeAt(0);
            if (ord >= 55296 && ord <= 56319 && i < len - 1) {
              chr += encodedStr.charAt(i + 1);
              encodedStrArr.push(chr);
              i++;
            } else {
              encodedStrArr.push(chr);
            }
          }
          encodedStr = encodedStrArr;
        }
        line = "utf-8''";
        let encoded = true;
        startPos = 0;
        for (i = 0, len = encodedStr.length;i < len; i++) {
          chr = encodedStr[i];
          if (encoded) {
            chr = this.safeEncodeURIComponent(chr);
          } else {
            chr = chr === " " ? chr : this.safeEncodeURIComponent(chr);
            if (chr !== encodedStr[i]) {
              if ((this.safeEncodeURIComponent(line) + chr).length >= maxLength) {
                list.push({
                  line,
                  encoded
                });
                line = "";
                startPos = i - 1;
              } else {
                encoded = true;
                i = startPos;
                line = "";
                continue;
              }
            }
          }
          if ((line + chr).length >= maxLength) {
            list.push({
              line,
              encoded
            });
            line = chr = encodedStr[i] === " " ? " " : this.safeEncodeURIComponent(encodedStr[i]);
            if (chr === encodedStr[i]) {
              encoded = false;
              startPos = i - 1;
            } else {
              encoded = true;
            }
          } else {
            line += chr;
          }
        }
        if (line) {
          list.push({
            line,
            encoded
          });
        }
      }
      return list.map((item, i2) => ({
        key: key + "*" + i2 + (item.encoded ? "*" : ""),
        value: item.line
      }));
    },
    parseHeaderValue(str) {
      let response = {
        value: false,
        params: {}
      };
      let key = false;
      let value = "";
      let type = "value";
      let quote = false;
      let escaped = false;
      let chr;
      for (let i = 0, len = str.length;i < len; i++) {
        chr = str.charAt(i);
        if (type === "key") {
          if (chr === "=") {
            key = value.trim().toLowerCase();
            type = "value";
            value = "";
            continue;
          }
          value += chr;
        } else {
          if (escaped) {
            value += chr;
          } else if (chr === "\\") {
            escaped = true;
            continue;
          } else if (quote && chr === quote) {
            quote = false;
          } else if (!quote && chr === '"') {
            quote = chr;
          } else if (!quote && chr === ";") {
            if (key === false) {
              response.value = value.trim();
            } else {
              response.params[key] = value.trim();
            }
            type = "key";
            value = "";
          } else {
            value += chr;
          }
          escaped = false;
        }
      }
      if (type === "value") {
        if (key === false) {
          response.value = value.trim();
        } else {
          response.params[key] = value.trim();
        }
      } else if (value.trim()) {
        response.params[value.trim().toLowerCase()] = "";
      }
      Object.keys(response.params).forEach((key2) => {
        let actualKey, nr, match, value2;
        if (match = key2.match(/(\*(\d+)|\*(\d+)\*|\*)$/)) {
          actualKey = key2.substr(0, match.index);
          nr = Number(match[2] || match[3]) || 0;
          if (!response.params[actualKey] || typeof response.params[actualKey] !== "object") {
            response.params[actualKey] = {
              charset: false,
              values: []
            };
          }
          value2 = response.params[key2];
          if (nr === 0 && match[0].substr(-1) === "*" && (match = value2.match(/^([^']*)'[^']*'(.*)$/))) {
            response.params[actualKey].charset = match[1] || "iso-8859-1";
            value2 = match[2];
          }
          response.params[actualKey].values[nr] = value2;
          delete response.params[key2];
        }
      });
      Object.keys(response.params).forEach((key2) => {
        let value2;
        if (response.params[key2] && Array.isArray(response.params[key2].values)) {
          value2 = response.params[key2].values.map((val) => val || "").join("");
          if (response.params[key2].charset) {
            response.params[key2] = "=?" + response.params[key2].charset + "?Q?" + value2.replace(/[=?_\s]/g, (s) => {
              let c = s.charCodeAt(0).toString(16);
              if (s === " ") {
                return "_";
              } else {
                return "%" + (c.length < 2 ? "0" : "") + c;
              }
            }).replace(/%/g, "=") + "?=";
          } else {
            response.params[key2] = value2;
          }
        }
      });
      return response;
    },
    detectExtension: (mimeType) => mimeTypes.detectExtension(mimeType),
    detectMimeType: (extension) => mimeTypes.detectMimeType(extension),
    foldLines(str, lineLength, afterSpace) {
      str = (str || "").toString();
      lineLength = lineLength || 76;
      let pos = 0, len = str.length, result = "", line, match;
      while (pos < len) {
        line = str.substr(pos, lineLength);
        if (line.length < lineLength) {
          result += line;
          break;
        }
        if (match = line.match(/^[^\n\r]*(\r?\n|\r)/)) {
          line = match[0];
          result += line;
          pos += line.length;
          continue;
        } else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || "").length : 0) < line.length) {
          line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || "").length : 0)));
        } else if (match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/)) {
          line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || "").length : 0));
        }
        result += line;
        pos += line.length;
        if (pos < len) {
          result += `\r
`;
        }
      }
      return result;
    },
    splitMimeEncodedString: (str, maxlen) => {
      let curLine, match, chr, done, lines = [];
      maxlen = Math.max(maxlen || 0, 12);
      while (str.length) {
        curLine = str.substr(0, maxlen);
        if (match = curLine.match(/[=][0-9A-F]?$/i)) {
          curLine = curLine.substr(0, match.index);
        }
        done = false;
        while (!done) {
          done = true;
          if (match = str.substr(curLine.length).match(/^[=]([0-9A-F]{2})/i)) {
            chr = parseInt(match[1], 16);
            if (chr < 194 && chr > 127) {
              curLine = curLine.substr(0, curLine.length - 3);
              done = false;
            }
          }
        }
        if (curLine.length) {
          lines.push(curLine);
        }
        str = str.substr(curLine.length);
      }
      return lines;
    },
    encodeURICharComponent: (chr) => {
      let res = "";
      let ord = chr.charCodeAt(0).toString(16).toUpperCase();
      if (ord.length % 2) {
        ord = "0" + ord;
      }
      if (ord.length > 2) {
        for (let i = 0, len = ord.length / 2;i < len; i++) {
          res += "%" + ord.substr(i, 2);
        }
      } else {
        res += "%" + ord;
      }
      return res;
    },
    safeEncodeURIComponent(str) {
      str = (str || "").toString();
      try {
        str = encodeURIComponent(str);
      } catch (_E) {
        return str.replace(/[^\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]+/g, "");
      }
      return str.replace(/[\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]/g, (chr) => this.encodeURICharComponent(chr));
    }
  };
});

// node_modules/nodemailer/lib/addressparser/index.js
var require_addressparser = __commonJS((exports, module) => {
  function _handleAddress(tokens, depth) {
    let isGroup = false;
    let state = "text";
    let address;
    let addresses = [];
    let data = {
      address: [],
      comment: [],
      group: [],
      text: [],
      textWasQuoted: []
    };
    let i;
    let len;
    let insideQuotes = false;
    for (i = 0, len = tokens.length;i < len; i++) {
      let token = tokens[i];
      let prevToken = i ? tokens[i - 1] : null;
      if (token.type === "operator") {
        switch (token.value) {
          case "<":
            state = "address";
            insideQuotes = false;
            break;
          case "(":
            state = "comment";
            insideQuotes = false;
            break;
          case ":":
            state = "group";
            isGroup = true;
            insideQuotes = false;
            break;
          case '"':
            insideQuotes = !insideQuotes;
            state = "text";
            break;
          default:
            state = "text";
            insideQuotes = false;
            break;
        }
      } else if (token.value) {
        if (state === "address") {
          token.value = token.value.replace(/^[^<]*<\s*/, "");
        }
        if (prevToken && prevToken.noBreak && data[state].length) {
          data[state][data[state].length - 1] += token.value;
          if (state === "text" && insideQuotes) {
            data.textWasQuoted[data.textWasQuoted.length - 1] = true;
          }
        } else {
          data[state].push(token.value);
          if (state === "text") {
            data.textWasQuoted.push(insideQuotes);
          }
        }
      }
    }
    if (!data.text.length && data.comment.length) {
      data.text = data.comment;
      data.comment = [];
    }
    if (isGroup) {
      data.text = data.text.join(" ");
      let groupMembers = [];
      if (data.group.length) {
        let parsedGroup = addressparser(data.group.join(","), { _depth: depth + 1 });
        parsedGroup.forEach((member) => {
          if (member.group) {
            groupMembers = groupMembers.concat(member.group);
          } else {
            groupMembers.push(member);
          }
        });
      }
      addresses.push({
        name: data.text || address && address.name,
        group: groupMembers
      });
    } else {
      if (!data.address.length && data.text.length) {
        for (i = data.text.length - 1;i >= 0; i--) {
          if (!data.textWasQuoted[i] && data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
            data.address = data.text.splice(i, 1);
            data.textWasQuoted.splice(i, 1);
            break;
          }
        }
        let _regexHandler = function(address2) {
          if (!data.address.length) {
            data.address = [address2.trim()];
            return " ";
          } else {
            return address2;
          }
        };
        if (!data.address.length) {
          for (i = data.text.length - 1;i >= 0; i--) {
            if (!data.textWasQuoted[i]) {
              data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
              if (data.address.length) {
                break;
              }
            }
          }
        }
      }
      if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
      }
      if (data.address.length > 1) {
        data.text = data.text.concat(data.address.splice(1));
      }
      data.text = data.text.join(" ");
      data.address = data.address.join(" ");
      if (!data.address && isGroup) {
        return [];
      } else {
        address = {
          address: data.address || data.text || "",
          name: data.text || data.address || ""
        };
        if (address.address === address.name) {
          if ((address.address || "").match(/@/)) {
            address.name = "";
          } else {
            address.address = "";
          }
        }
        addresses.push(address);
      }
    }
    return addresses;
  }

  class Tokenizer {
    constructor(str) {
      this.str = (str || "").toString();
      this.operatorCurrent = "";
      this.operatorExpecting = "";
      this.node = null;
      this.escaped = false;
      this.list = [];
      this.operators = {
        '"': '"',
        "(": ")",
        "<": ">",
        ",": "",
        ":": ";",
        ";": ""
      };
    }
    tokenize() {
      let list = [];
      for (let i = 0, len = this.str.length;i < len; i++) {
        let chr = this.str.charAt(i);
        let nextChr = i < len - 1 ? this.str.charAt(i + 1) : null;
        this.checkChar(chr, nextChr);
      }
      this.list.forEach((node) => {
        node.value = (node.value || "").toString().trim();
        if (node.value) {
          list.push(node);
        }
      });
      return list;
    }
    checkChar(chr, nextChr) {
      if (this.escaped) {} else if (chr === this.operatorExpecting) {
        this.node = {
          type: "operator",
          value: chr
        };
        if (nextChr && ![" ", "\t", "\r", `
`, ",", ";"].includes(nextChr)) {
          this.node.noBreak = true;
        }
        this.list.push(this.node);
        this.node = null;
        this.operatorExpecting = "";
        this.escaped = false;
        return;
      } else if (!this.operatorExpecting && chr in this.operators) {
        this.node = {
          type: "operator",
          value: chr
        };
        this.list.push(this.node);
        this.node = null;
        this.operatorExpecting = this.operators[chr];
        this.escaped = false;
        return;
      } else if (['"', "'"].includes(this.operatorExpecting) && chr === "\\") {
        this.escaped = true;
        return;
      }
      if (!this.node) {
        this.node = {
          type: "text",
          value: ""
        };
        this.list.push(this.node);
      }
      if (chr === `
`) {
        chr = " ";
      }
      if (chr.charCodeAt(0) >= 33 || [" ", "\t"].includes(chr)) {
        this.node.value += chr;
      }
      this.escaped = false;
    }
  }
  var MAX_NESTED_GROUP_DEPTH = 50;
  function addressparser(str, options) {
    options = options || {};
    let depth = options._depth || 0;
    if (depth > MAX_NESTED_GROUP_DEPTH) {
      return [];
    }
    let tokenizer = new Tokenizer(str);
    let tokens = tokenizer.tokenize();
    let addresses = [];
    let address = [];
    let parsedAddresses = [];
    tokens.forEach((token) => {
      if (token.type === "operator" && (token.value === "," || token.value === ";")) {
        if (address.length) {
          addresses.push(address);
        }
        address = [];
      } else {
        address.push(token);
      }
    });
    if (address.length) {
      addresses.push(address);
    }
    addresses.forEach((address2) => {
      address2 = _handleAddress(address2, depth);
      if (address2.length) {
        parsedAddresses = parsedAddresses.concat(address2);
      }
    });
    if (options.flatten) {
      let addresses2 = [];
      let walkAddressList = (list) => {
        list.forEach((address2) => {
          if (address2.group) {
            return walkAddressList(address2.group);
          } else {
            addresses2.push(address2);
          }
        });
      };
      walkAddressList(parsedAddresses);
      return addresses2;
    }
    return parsedAddresses;
  }
  module.exports = addressparser;
});

// node_modules/nodemailer/lib/mime-node/last-newline.js
var require_last_newline = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;

  class LastNewline extends Transform {
    constructor() {
      super();
      this.lastByte = false;
    }
    _transform(chunk, encoding, done) {
      if (chunk.length) {
        this.lastByte = chunk[chunk.length - 1];
      }
      this.push(chunk);
      done();
    }
    _flush(done) {
      if (this.lastByte === 10) {
        return done();
      }
      if (this.lastByte === 13) {
        this.push(Buffer.from(`
`));
        return done();
      }
      this.push(Buffer.from(`\r
`));
      return done();
    }
  }
  module.exports = LastNewline;
});

// node_modules/nodemailer/lib/mime-node/le-windows.js
var require_le_windows = __commonJS((exports, module) => {
  var stream = __require("stream");
  var Transform = stream.Transform;

  class LeWindows extends Transform {
    constructor(options) {
      super(options);
      this.options = options || {};
      this.lastByte = false;
    }
    _transform(chunk, encoding, done) {
      let buf;
      let lastPos = 0;
      for (let i = 0, len = chunk.length;i < len; i++) {
        if (chunk[i] === 10) {
          if (i && chunk[i - 1] !== 13 || !i && this.lastByte !== 13) {
            if (i > lastPos) {
              buf = chunk.slice(lastPos, i);
              this.push(buf);
            }
            this.push(Buffer.from(`\r
`));
            lastPos = i + 1;
          }
        }
      }
      if (lastPos && lastPos < chunk.length) {
        buf = chunk.slice(lastPos);
        this.push(buf);
      } else if (!lastPos) {
        this.push(chunk);
      }
      this.lastByte = chunk[chunk.length - 1];
      done();
    }
  }
  module.exports = LeWindows;
});

// node_modules/nodemailer/lib/mime-node/le-unix.js
var require_le_unix = __commonJS((exports, module) => {
  var stream = __require("stream");
  var Transform = stream.Transform;

  class LeWindows extends Transform {
    constructor(options) {
      super(options);
      this.options = options || {};
    }
    _transform(chunk, encoding, done) {
      let buf;
      let lastPos = 0;
      for (let i = 0, len = chunk.length;i < len; i++) {
        if (chunk[i] === 13) {
          buf = chunk.slice(lastPos, i);
          lastPos = i + 1;
          this.push(buf);
        }
      }
      if (lastPos && lastPos < chunk.length) {
        buf = chunk.slice(lastPos);
        this.push(buf);
      } else if (!lastPos) {
        this.push(chunk);
      }
      done();
    }
  }
  module.exports = LeWindows;
});

// node_modules/nodemailer/lib/mime-node/index.js
var require_mime_node = __commonJS((exports, module) => {
  var crypto = __require("crypto");
  var fs2 = __require("fs");
  var punycode = require_punycode();
  var PassThrough = __require("stream").PassThrough;
  var shared = require_shared();
  var mimeFuncs = require_mime_funcs();
  var qp = require_qp();
  var base64 = require_base64();
  var addressparser = require_addressparser();
  var nmfetch = require_fetch();
  var LastNewline = require_last_newline();
  var LeWindows = require_le_windows();
  var LeUnix = require_le_unix();

  class MimeNode {
    constructor(contentType, options) {
      this.nodeCounter = 0;
      options = options || {};
      this.baseBoundary = options.baseBoundary || crypto.randomBytes(8).toString("hex");
      this.boundaryPrefix = options.boundaryPrefix || "--_NmP";
      this.disableFileAccess = !!options.disableFileAccess;
      this.disableUrlAccess = !!options.disableUrlAccess;
      this.normalizeHeaderKey = options.normalizeHeaderKey;
      this.date = new Date;
      this.rootNode = options.rootNode || this;
      this.keepBcc = !!options.keepBcc;
      if (options.filename) {
        this.filename = options.filename;
        if (!contentType) {
          contentType = mimeFuncs.detectMimeType(this.filename.split(".").pop());
        }
      }
      this.textEncoding = (options.textEncoding || "").toString().trim().charAt(0).toUpperCase();
      this.parentNode = options.parentNode;
      this.hostname = options.hostname;
      this.newline = options.newline;
      this.childNodes = [];
      this._nodeId = ++this.rootNode.nodeCounter;
      this._headers = [];
      this._isPlainText = false;
      this._hasLongLines = false;
      this._envelope = false;
      this._raw = false;
      this._transforms = [];
      this._processFuncs = [];
      if (contentType) {
        this.setHeader("Content-Type", contentType);
      }
    }
    createChild(contentType, options) {
      if (!options && typeof contentType === "object") {
        options = contentType;
        contentType = undefined;
      }
      let node = new MimeNode(contentType, options);
      this.appendChild(node);
      return node;
    }
    appendChild(childNode) {
      if (childNode.rootNode !== this.rootNode) {
        childNode.rootNode = this.rootNode;
        childNode._nodeId = ++this.rootNode.nodeCounter;
      }
      childNode.parentNode = this;
      this.childNodes.push(childNode);
      return childNode;
    }
    replace(node) {
      if (node === this) {
        return this;
      }
      this.parentNode.childNodes.forEach((childNode, i) => {
        if (childNode === this) {
          node.rootNode = this.rootNode;
          node.parentNode = this.parentNode;
          node._nodeId = this._nodeId;
          this.rootNode = this;
          this.parentNode = undefined;
          node.parentNode.childNodes[i] = node;
        }
      });
      return node;
    }
    remove() {
      if (!this.parentNode) {
        return this;
      }
      for (let i = this.parentNode.childNodes.length - 1;i >= 0; i--) {
        if (this.parentNode.childNodes[i] === this) {
          this.parentNode.childNodes.splice(i, 1);
          this.parentNode = undefined;
          this.rootNode = this;
          return this;
        }
      }
    }
    setHeader(key, value) {
      let added = false, headerValue;
      if (!value && key && typeof key === "object") {
        if (key.key && "value" in key) {
          this.setHeader(key.key, key.value);
        } else if (Array.isArray(key)) {
          key.forEach((i) => {
            this.setHeader(i.key, i.value);
          });
        } else {
          Object.keys(key).forEach((i) => {
            this.setHeader(i, key[i]);
          });
        }
        return this;
      }
      key = this._normalizeHeaderKey(key);
      headerValue = {
        key,
        value
      };
      for (let i = 0, len = this._headers.length;i < len; i++) {
        if (this._headers[i].key === key) {
          if (!added) {
            this._headers[i] = headerValue;
            added = true;
          } else {
            this._headers.splice(i, 1);
            i--;
            len--;
          }
        }
      }
      if (!added) {
        this._headers.push(headerValue);
      }
      return this;
    }
    addHeader(key, value) {
      if (!value && key && typeof key === "object") {
        if (key.key && key.value) {
          this.addHeader(key.key, key.value);
        } else if (Array.isArray(key)) {
          key.forEach((i) => {
            this.addHeader(i.key, i.value);
          });
        } else {
          Object.keys(key).forEach((i) => {
            this.addHeader(i, key[i]);
          });
        }
        return this;
      } else if (Array.isArray(value)) {
        value.forEach((val) => {
          this.addHeader(key, val);
        });
        return this;
      }
      this._headers.push({
        key: this._normalizeHeaderKey(key),
        value
      });
      return this;
    }
    getHeader(key) {
      key = this._normalizeHeaderKey(key);
      for (let i = 0, len = this._headers.length;i < len; i++) {
        if (this._headers[i].key === key) {
          return this._headers[i].value;
        }
      }
    }
    setContent(content) {
      this.content = content;
      if (typeof this.content.pipe === "function") {
        this._contentErrorHandler = (err) => {
          this.content.removeListener("error", this._contentErrorHandler);
          this.content = err;
        };
        this.content.once("error", this._contentErrorHandler);
      } else if (typeof this.content === "string") {
        this._isPlainText = mimeFuncs.isPlainText(this.content);
        if (this._isPlainText && mimeFuncs.hasLongerLines(this.content, 76)) {
          this._hasLongLines = true;
        }
      }
      return this;
    }
    build(callback) {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      let stream = this.createReadStream();
      let buf = [];
      let buflen = 0;
      let returned = false;
      stream.on("readable", () => {
        let chunk;
        while ((chunk = stream.read()) !== null) {
          buf.push(chunk);
          buflen += chunk.length;
        }
      });
      stream.once("error", (err) => {
        if (returned) {
          return;
        }
        returned = true;
        return callback(err);
      });
      stream.once("end", (chunk) => {
        if (returned) {
          return;
        }
        returned = true;
        if (chunk && chunk.length) {
          buf.push(chunk);
          buflen += chunk.length;
        }
        return callback(null, Buffer.concat(buf, buflen));
      });
      return promise;
    }
    getTransferEncoding() {
      let transferEncoding = false;
      let contentType = (this.getHeader("Content-Type") || "").toString().toLowerCase().trim();
      if (this.content) {
        transferEncoding = (this.getHeader("Content-Transfer-Encoding") || "").toString().toLowerCase().trim();
        if (!transferEncoding || !["base64", "quoted-printable"].includes(transferEncoding)) {
          if (/^text\//i.test(contentType)) {
            if (this._isPlainText && !this._hasLongLines) {
              transferEncoding = "7bit";
            } else if (typeof this.content === "string" || this.content instanceof Buffer) {
              transferEncoding = this._getTextEncoding(this.content) === "Q" ? "quoted-printable" : "base64";
            } else {
              transferEncoding = this.textEncoding === "B" ? "base64" : "quoted-printable";
            }
          } else if (!/^(multipart|message)\//i.test(contentType)) {
            transferEncoding = transferEncoding || "base64";
          }
        }
      }
      return transferEncoding;
    }
    buildHeaders() {
      let transferEncoding = this.getTransferEncoding();
      let headers = [];
      if (transferEncoding) {
        this.setHeader("Content-Transfer-Encoding", transferEncoding);
      }
      if (this.filename && !this.getHeader("Content-Disposition")) {
        this.setHeader("Content-Disposition", "attachment");
      }
      if (this.rootNode === this) {
        if (!this.getHeader("Date")) {
          this.setHeader("Date", this.date.toUTCString().replace(/GMT/, "+0000"));
        }
        this.messageId();
        if (!this.getHeader("MIME-Version")) {
          this.setHeader("MIME-Version", "1.0");
        }
        for (let i = this._headers.length - 2;i >= 0; i--) {
          let header = this._headers[i];
          if (header.key === "Content-Type") {
            this._headers.splice(i, 1);
            this._headers.push(header);
          }
        }
      }
      this._headers.forEach((header) => {
        let key = header.key;
        let value = header.value;
        let structured;
        let param;
        let options = {};
        let formattedHeaders = ["From", "Sender", "To", "Cc", "Bcc", "Reply-To", "Date", "References"];
        if (value && typeof value === "object" && !formattedHeaders.includes(key)) {
          Object.keys(value).forEach((key2) => {
            if (key2 !== "value") {
              options[key2] = value[key2];
            }
          });
          value = (value.value || "").toString();
          if (!value.trim()) {
            return;
          }
        }
        if (options.prepared) {
          if (options.foldLines) {
            headers.push(mimeFuncs.foldLines(key + ": " + value));
          } else {
            headers.push(key + ": " + value);
          }
          return;
        }
        switch (header.key) {
          case "Content-Disposition":
            structured = mimeFuncs.parseHeaderValue(value);
            if (this.filename) {
              structured.params.filename = this.filename;
            }
            value = mimeFuncs.buildHeaderValue(structured);
            break;
          case "Content-Type":
            structured = mimeFuncs.parseHeaderValue(value);
            this._handleContentType(structured);
            if (structured.value.match(/^text\/plain\b/) && typeof this.content === "string" && /[\u0080-\uFFFF]/.test(this.content)) {
              structured.params.charset = "utf-8";
            }
            value = mimeFuncs.buildHeaderValue(structured);
            if (this.filename) {
              param = this._encodeWords(this.filename);
              if (param !== this.filename || /[\s'"\\;:/=(),<>@[\]?]|^-/.test(param)) {
                param = '"' + param + '"';
              }
              value += "; name=" + param;
            }
            break;
          case "Bcc":
            if (!this.keepBcc) {
              return;
            }
            break;
        }
        value = this._encodeHeaderValue(key, value);
        if (!(value || "").toString().trim()) {
          return;
        }
        if (typeof this.normalizeHeaderKey === "function") {
          let normalized = this.normalizeHeaderKey(key, value);
          if (normalized && typeof normalized === "string" && normalized.length) {
            key = normalized;
          }
        }
        headers.push(mimeFuncs.foldLines(key + ": " + value, 76));
      });
      return headers.join(`\r
`);
    }
    createReadStream(options) {
      options = options || {};
      let stream = new PassThrough(options);
      let outputStream = stream;
      let transform;
      this.stream(stream, options, (err) => {
        if (err) {
          outputStream.emit("error", err);
          return;
        }
        stream.end();
      });
      for (let i = 0, len = this._transforms.length;i < len; i++) {
        transform = typeof this._transforms[i] === "function" ? this._transforms[i]() : this._transforms[i];
        outputStream.once("error", (err) => {
          transform.emit("error", err);
        });
        outputStream = outputStream.pipe(transform);
      }
      transform = new LastNewline;
      outputStream.once("error", (err) => {
        transform.emit("error", err);
      });
      outputStream = outputStream.pipe(transform);
      for (let i = 0, len = this._processFuncs.length;i < len; i++) {
        transform = this._processFuncs[i];
        outputStream = transform(outputStream);
      }
      if (this.newline) {
        const winbreak = ["win", "windows", "dos", `\r
`].includes(this.newline.toString().toLowerCase());
        const newlineTransform = winbreak ? new LeWindows : new LeUnix;
        const stream2 = outputStream.pipe(newlineTransform);
        outputStream.on("error", (err) => stream2.emit("error", err));
        return stream2;
      }
      return outputStream;
    }
    transform(transform) {
      this._transforms.push(transform);
    }
    processFunc(processFunc) {
      this._processFuncs.push(processFunc);
    }
    stream(outputStream, options, done) {
      let transferEncoding = this.getTransferEncoding();
      let contentStream;
      let localStream;
      let returned = false;
      let callback = (err) => {
        if (returned) {
          return;
        }
        returned = true;
        done(err);
      };
      let finalize = () => {
        let childId = 0;
        let processChildNode = () => {
          if (childId >= this.childNodes.length) {
            outputStream.write(`\r
--` + this.boundary + `--\r
`);
            return callback();
          }
          let child = this.childNodes[childId++];
          outputStream.write((childId > 1 ? `\r
` : "") + "--" + this.boundary + `\r
`);
          child.stream(outputStream, options, (err) => {
            if (err) {
              return callback(err);
            }
            setImmediate(processChildNode);
          });
        };
        if (this.multipart) {
          setImmediate(processChildNode);
        } else {
          return callback();
        }
      };
      let sendContent = () => {
        if (this.content) {
          if (Object.prototype.toString.call(this.content) === "[object Error]") {
            return callback(this.content);
          }
          if (typeof this.content.pipe === "function") {
            this.content.removeListener("error", this._contentErrorHandler);
            this._contentErrorHandler = (err) => callback(err);
            this.content.once("error", this._contentErrorHandler);
          }
          let createStream = () => {
            if (["quoted-printable", "base64"].includes(transferEncoding)) {
              contentStream = new (transferEncoding === "base64" ? base64 : qp).Encoder(options);
              contentStream.pipe(outputStream, {
                end: false
              });
              contentStream.once("end", finalize);
              contentStream.once("error", (err) => callback(err));
              localStream = this._getStream(this.content);
              localStream.pipe(contentStream);
            } else {
              localStream = this._getStream(this.content);
              localStream.pipe(outputStream, {
                end: false
              });
              localStream.once("end", finalize);
            }
            localStream.once("error", (err) => callback(err));
          };
          if (this.content._resolve) {
            let chunks = [];
            let chunklen = 0;
            let returned2 = false;
            let sourceStream = this._getStream(this.content);
            sourceStream.on("error", (err) => {
              if (returned2) {
                return;
              }
              returned2 = true;
              callback(err);
            });
            sourceStream.on("readable", () => {
              let chunk;
              while ((chunk = sourceStream.read()) !== null) {
                chunks.push(chunk);
                chunklen += chunk.length;
              }
            });
            sourceStream.on("end", () => {
              if (returned2) {
                return;
              }
              returned2 = true;
              this.content._resolve = false;
              this.content._resolvedValue = Buffer.concat(chunks, chunklen);
              setImmediate(createStream);
            });
          } else {
            setImmediate(createStream);
          }
          return;
        } else {
          return setImmediate(finalize);
        }
      };
      if (this._raw) {
        setImmediate(() => {
          if (Object.prototype.toString.call(this._raw) === "[object Error]") {
            return callback(this._raw);
          }
          if (typeof this._raw.pipe === "function") {
            this._raw.removeListener("error", this._contentErrorHandler);
          }
          let raw = this._getStream(this._raw);
          raw.pipe(outputStream, {
            end: false
          });
          raw.on("error", (err) => outputStream.emit("error", err));
          raw.on("end", finalize);
        });
      } else {
        outputStream.write(this.buildHeaders() + `\r
\r
`);
        setImmediate(sendContent);
      }
    }
    setEnvelope(envelope) {
      let list;
      this._envelope = {
        from: false,
        to: []
      };
      if (envelope.from) {
        list = [];
        this._convertAddresses(this._parseAddresses(envelope.from), list);
        list = list.filter((address) => address && address.address);
        if (list.length && list[0]) {
          this._envelope.from = list[0].address;
        }
      }
      ["to", "cc", "bcc"].forEach((key) => {
        if (envelope[key]) {
          this._convertAddresses(this._parseAddresses(envelope[key]), this._envelope.to);
        }
      });
      this._envelope.to = this._envelope.to.map((to) => to.address).filter((address) => address);
      let standardFields = ["to", "cc", "bcc", "from"];
      Object.keys(envelope).forEach((key) => {
        if (!standardFields.includes(key)) {
          this._envelope[key] = envelope[key];
        }
      });
      return this;
    }
    getAddresses() {
      let addresses = {};
      this._headers.forEach((header) => {
        let key = header.key.toLowerCase();
        if (["from", "sender", "reply-to", "to", "cc", "bcc"].includes(key)) {
          if (!Array.isArray(addresses[key])) {
            addresses[key] = [];
          }
          this._convertAddresses(this._parseAddresses(header.value), addresses[key]);
        }
      });
      return addresses;
    }
    getEnvelope() {
      if (this._envelope) {
        return this._envelope;
      }
      let envelope = {
        from: false,
        to: []
      };
      this._headers.forEach((header) => {
        let list = [];
        if (header.key === "From" || !envelope.from && ["Reply-To", "Sender"].includes(header.key)) {
          this._convertAddresses(this._parseAddresses(header.value), list);
          if (list.length && list[0]) {
            envelope.from = list[0].address;
          }
        } else if (["To", "Cc", "Bcc"].includes(header.key)) {
          this._convertAddresses(this._parseAddresses(header.value), envelope.to);
        }
      });
      envelope.to = envelope.to.map((to) => to.address);
      return envelope;
    }
    messageId() {
      let messageId = this.getHeader("Message-ID");
      if (!messageId) {
        messageId = this._generateMessageId();
        this.setHeader("Message-ID", messageId);
      }
      return messageId;
    }
    setRaw(raw) {
      this._raw = raw;
      if (this._raw && typeof this._raw.pipe === "function") {
        this._contentErrorHandler = (err) => {
          this._raw.removeListener("error", this._contentErrorHandler);
          this._raw = err;
        };
        this._raw.once("error", this._contentErrorHandler);
      }
      return this;
    }
    _getStream(content) {
      let contentStream;
      if (content._resolvedValue) {
        contentStream = new PassThrough;
        setImmediate(() => {
          try {
            contentStream.end(content._resolvedValue);
          } catch (_err) {
            contentStream.emit("error", _err);
          }
        });
        return contentStream;
      } else if (typeof content.pipe === "function") {
        return content;
      } else if (content && typeof content.path === "string" && !content.href) {
        if (this.disableFileAccess) {
          contentStream = new PassThrough;
          setImmediate(() => contentStream.emit("error", new Error("File access rejected for " + content.path)));
          return contentStream;
        }
        return fs2.createReadStream(content.path);
      } else if (content && typeof content.href === "string") {
        if (this.disableUrlAccess) {
          contentStream = new PassThrough;
          setImmediate(() => contentStream.emit("error", new Error("Url access rejected for " + content.href)));
          return contentStream;
        }
        return nmfetch(content.href, { headers: content.httpHeaders });
      } else {
        contentStream = new PassThrough;
        setImmediate(() => {
          try {
            contentStream.end(content || "");
          } catch (_err) {
            contentStream.emit("error", _err);
          }
        });
        return contentStream;
      }
    }
    _parseAddresses(addresses) {
      return [].concat.apply([], [].concat(addresses).map((address) => {
        if (address && address.address) {
          address.address = this._normalizeAddress(address.address);
          address.name = address.name || "";
          return [address];
        }
        return addressparser(address);
      }));
    }
    _normalizeHeaderKey(key) {
      key = (key || "").toString().replace(/\r?\n|\r/g, " ").trim().toLowerCase().replace(/^X-SMTPAPI$|^(MIME|DKIM|ARC|BIMI)\b|^[a-z]|-(SPF|FBL|ID|MD5)$|-[a-z]/gi, (c) => c.toUpperCase()).replace(/^Content-Features$/i, "Content-features");
      return key;
    }
    _handleContentType(structured) {
      this.contentType = structured.value.trim().toLowerCase();
      this.multipart = /^multipart\//i.test(this.contentType) ? this.contentType.substr(this.contentType.indexOf("/") + 1) : false;
      if (this.multipart) {
        this.boundary = structured.params.boundary = structured.params.boundary || this.boundary || this._generateBoundary();
      } else {
        this.boundary = false;
      }
    }
    _generateBoundary() {
      return this.rootNode.boundaryPrefix + "-" + this.rootNode.baseBoundary + "-Part_" + this._nodeId;
    }
    _encodeHeaderValue(key, value) {
      key = this._normalizeHeaderKey(key);
      switch (key) {
        case "From":
        case "Sender":
        case "To":
        case "Cc":
        case "Bcc":
        case "Reply-To":
          return this._convertAddresses(this._parseAddresses(value));
        case "Message-ID":
        case "In-Reply-To":
        case "Content-Id":
          value = (value || "").toString().replace(/\r?\n|\r/g, " ");
          if (value.charAt(0) !== "<") {
            value = "<" + value;
          }
          if (value.charAt(value.length - 1) !== ">") {
            value = value + ">";
          }
          return value;
        case "References":
          value = [].concat.apply([], [].concat(value || "").map((elm) => {
            elm = (elm || "").toString().replace(/\r?\n|\r/g, " ").trim();
            return elm.replace(/<[^>]*>/g, (str) => str.replace(/\s/g, "")).split(/\s+/);
          })).map((elm) => {
            if (elm.charAt(0) !== "<") {
              elm = "<" + elm;
            }
            if (elm.charAt(elm.length - 1) !== ">") {
              elm = elm + ">";
            }
            return elm;
          });
          return value.join(" ").trim();
        case "Date":
          if (Object.prototype.toString.call(value) === "[object Date]") {
            return value.toUTCString().replace(/GMT/, "+0000");
          }
          value = (value || "").toString().replace(/\r?\n|\r/g, " ");
          return this._encodeWords(value);
        case "Content-Type":
        case "Content-Disposition":
          return (value || "").toString().replace(/\r?\n|\r/g, " ");
        default:
          value = (value || "").toString().replace(/\r?\n|\r/g, " ");
          return this._encodeWords(value);
      }
    }
    _convertAddresses(addresses, uniqueList) {
      let values = [];
      uniqueList = uniqueList || [];
      [].concat(addresses || []).forEach((address) => {
        if (address.address) {
          address.address = this._normalizeAddress(address.address);
          if (!address.name) {
            values.push(address.address.indexOf(" ") >= 0 ? `<${address.address}>` : `${address.address}`);
          } else if (address.name) {
            values.push(`${this._encodeAddressName(address.name)} <${address.address}>`);
          }
          if (address.address) {
            if (!uniqueList.filter((a) => a.address === address.address).length) {
              uniqueList.push(address);
            }
          }
        } else if (address.group) {
          let groupListAddresses = (address.group.length ? this._convertAddresses(address.group, uniqueList) : "").trim();
          values.push(`${this._encodeAddressName(address.name)}:${groupListAddresses};`);
        }
      });
      return values.join(", ");
    }
    _normalizeAddress(address) {
      address = (address || "").toString().replace(/[\x00-\x1F<>]+/g, " ").trim();
      let lastAt = address.lastIndexOf("@");
      if (lastAt < 0) {
        return address;
      }
      let user = address.substr(0, lastAt);
      let domain = address.substr(lastAt + 1);
      let encodedDomain;
      try {
        encodedDomain = punycode.toASCII(domain.toLowerCase());
      } catch (_err) {}
      if (user.indexOf(" ") >= 0) {
        if (user.charAt(0) !== '"') {
          user = '"' + user;
        }
        if (user.substr(-1) !== '"') {
          user = user + '"';
        }
      }
      return `${user}@${encodedDomain}`;
    }
    _encodeAddressName(name) {
      if (!/^[\w ]*$/.test(name)) {
        if (/^[\x20-\x7e]*$/.test(name)) {
          return '"' + name.replace(/([\\"])/g, "\\$1") + '"';
        } else {
          return mimeFuncs.encodeWord(name, this._getTextEncoding(name), 52);
        }
      }
      return name;
    }
    _encodeWords(value) {
      return mimeFuncs.encodeWords(value, this._getTextEncoding(value), 52, true);
    }
    _getTextEncoding(value) {
      value = (value || "").toString();
      let encoding = this.textEncoding;
      let latinLen;
      let nonLatinLen;
      if (!encoding) {
        nonLatinLen = (value.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\u0080-\uFFFF]/g) || []).length;
        latinLen = (value.match(/[a-z]/gi) || []).length;
        encoding = nonLatinLen < latinLen ? "Q" : "B";
      }
      return encoding;
    }
    _generateMessageId() {
      return "<" + [2, 2, 2, 6].reduce((prev, len) => prev + "-" + crypto.randomBytes(len).toString("hex"), crypto.randomBytes(4).toString("hex")) + "@" + (this.getEnvelope().from || this.hostname || "localhost").split("@").pop() + ">";
    }
  }
  module.exports = MimeNode;
});

// node_modules/nodemailer/lib/mail-composer/index.js
var require_mail_composer = __commonJS((exports, module) => {
  var MimeNode = require_mime_node();
  var mimeFuncs = require_mime_funcs();
  var parseDataURI = require_shared().parseDataURI;

  class MailComposer {
    constructor(mail) {
      this.mail = mail || {};
      this.message = false;
    }
    compile() {
      this._alternatives = this.getAlternatives();
      this._htmlNode = this._alternatives.filter((alternative) => /^text\/html\b/i.test(alternative.contentType)).pop();
      this._attachments = this.getAttachments(!!this._htmlNode);
      this._useRelated = !!(this._htmlNode && this._attachments.related.length);
      this._useAlternative = this._alternatives.length > 1;
      this._useMixed = this._attachments.attached.length > 1 || this._alternatives.length && this._attachments.attached.length === 1;
      if (this.mail.raw) {
        this.message = new MimeNode("message/rfc822", { newline: this.mail.newline }).setRaw(this.mail.raw);
      } else if (this._useMixed) {
        this.message = this._createMixed();
      } else if (this._useAlternative) {
        this.message = this._createAlternative();
      } else if (this._useRelated) {
        this.message = this._createRelated();
      } else {
        this.message = this._createContentNode(false, [].concat(this._alternatives || []).concat(this._attachments.attached || []).shift() || {
          contentType: "text/plain",
          content: ""
        });
      }
      if (this.mail.headers) {
        this.message.addHeader(this.mail.headers);
      }
      ["from", "sender", "to", "cc", "bcc", "reply-to", "in-reply-to", "references", "subject", "message-id", "date"].forEach((header) => {
        let key = header.replace(/-(\w)/g, (o, c) => c.toUpperCase());
        if (this.mail[key]) {
          this.message.setHeader(header, this.mail[key]);
        }
      });
      if (this.mail.envelope) {
        this.message.setEnvelope(this.mail.envelope);
      }
      this.message.messageId();
      return this.message;
    }
    getAttachments(findRelated) {
      let icalEvent, eventObject;
      let attachments = [].concat(this.mail.attachments || []).map((attachment, i) => {
        let data;
        if (/^data:/i.test(attachment.path || attachment.href)) {
          attachment = this._processDataUrl(attachment);
        }
        let contentType = attachment.contentType || mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || "bin");
        let isImage = /^image\//i.test(contentType);
        let isMessageNode = /^message\//i.test(contentType);
        let contentDisposition = attachment.contentDisposition || (isMessageNode || isImage && attachment.cid ? "inline" : "attachment");
        let contentTransferEncoding;
        if ("contentTransferEncoding" in attachment) {
          contentTransferEncoding = attachment.contentTransferEncoding;
        } else if (isMessageNode) {
          contentTransferEncoding = "8bit";
        } else {
          contentTransferEncoding = "base64";
        }
        data = {
          contentType,
          contentDisposition,
          contentTransferEncoding
        };
        if (attachment.filename) {
          data.filename = attachment.filename;
        } else if (!isMessageNode && attachment.filename !== false) {
          data.filename = (attachment.path || attachment.href || "").split("/").pop().split("?").shift() || "attachment-" + (i + 1);
          if (data.filename.indexOf(".") < 0) {
            data.filename += "." + mimeFuncs.detectExtension(data.contentType);
          }
        }
        if (/^https?:\/\//i.test(attachment.path)) {
          attachment.href = attachment.path;
          attachment.path = undefined;
        }
        if (attachment.cid) {
          data.cid = attachment.cid;
        }
        if (attachment.raw) {
          data.raw = attachment.raw;
        } else if (attachment.path) {
          data.content = {
            path: attachment.path
          };
        } else if (attachment.href) {
          data.content = {
            href: attachment.href,
            httpHeaders: attachment.httpHeaders
          };
        } else {
          data.content = attachment.content || "";
        }
        if (attachment.encoding) {
          data.encoding = attachment.encoding;
        }
        if (attachment.headers) {
          data.headers = attachment.headers;
        }
        return data;
      });
      if (this.mail.icalEvent) {
        if (typeof this.mail.icalEvent === "object" && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
          icalEvent = this.mail.icalEvent;
        } else {
          icalEvent = {
            content: this.mail.icalEvent
          };
        }
        eventObject = {};
        Object.keys(icalEvent).forEach((key) => {
          eventObject[key] = icalEvent[key];
        });
        eventObject.contentType = "application/ics";
        if (!eventObject.headers) {
          eventObject.headers = {};
        }
        eventObject.filename = eventObject.filename || "invite.ics";
        eventObject.headers["Content-Disposition"] = "attachment";
        eventObject.headers["Content-Transfer-Encoding"] = "base64";
      }
      if (!findRelated) {
        return {
          attached: attachments.concat(eventObject || []),
          related: []
        };
      } else {
        return {
          attached: attachments.filter((attachment) => !attachment.cid).concat(eventObject || []),
          related: attachments.filter((attachment) => !!attachment.cid)
        };
      }
    }
    getAlternatives() {
      let alternatives = [], text, html, watchHtml, amp, icalEvent, eventObject;
      if (this.mail.text) {
        if (typeof this.mail.text === "object" && (this.mail.text.content || this.mail.text.path || this.mail.text.href || this.mail.text.raw)) {
          text = this.mail.text;
        } else {
          text = {
            content: this.mail.text
          };
        }
        text.contentType = "text/plain; charset=utf-8";
      }
      if (this.mail.watchHtml) {
        if (typeof this.mail.watchHtml === "object" && (this.mail.watchHtml.content || this.mail.watchHtml.path || this.mail.watchHtml.href || this.mail.watchHtml.raw)) {
          watchHtml = this.mail.watchHtml;
        } else {
          watchHtml = {
            content: this.mail.watchHtml
          };
        }
        watchHtml.contentType = "text/watch-html; charset=utf-8";
      }
      if (this.mail.amp) {
        if (typeof this.mail.amp === "object" && (this.mail.amp.content || this.mail.amp.path || this.mail.amp.href || this.mail.amp.raw)) {
          amp = this.mail.amp;
        } else {
          amp = {
            content: this.mail.amp
          };
        }
        amp.contentType = "text/x-amp-html; charset=utf-8";
      }
      if (this.mail.icalEvent) {
        if (typeof this.mail.icalEvent === "object" && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
          icalEvent = this.mail.icalEvent;
        } else {
          icalEvent = {
            content: this.mail.icalEvent
          };
        }
        eventObject = {};
        Object.keys(icalEvent).forEach((key) => {
          eventObject[key] = icalEvent[key];
        });
        if (eventObject.content && typeof eventObject.content === "object") {
          eventObject.content._resolve = true;
        }
        eventObject.filename = false;
        eventObject.contentType = "text/calendar; charset=utf-8; method=" + (eventObject.method || "PUBLISH").toString().trim().toUpperCase();
        if (!eventObject.headers) {
          eventObject.headers = {};
        }
      }
      if (this.mail.html) {
        if (typeof this.mail.html === "object" && (this.mail.html.content || this.mail.html.path || this.mail.html.href || this.mail.html.raw)) {
          html = this.mail.html;
        } else {
          html = {
            content: this.mail.html
          };
        }
        html.contentType = "text/html; charset=utf-8";
      }
      [].concat(text || []).concat(watchHtml || []).concat(amp || []).concat(html || []).concat(eventObject || []).concat(this.mail.alternatives || []).forEach((alternative) => {
        let data;
        if (/^data:/i.test(alternative.path || alternative.href)) {
          alternative = this._processDataUrl(alternative);
        }
        data = {
          contentType: alternative.contentType || mimeFuncs.detectMimeType(alternative.filename || alternative.path || alternative.href || "txt"),
          contentTransferEncoding: alternative.contentTransferEncoding
        };
        if (alternative.filename) {
          data.filename = alternative.filename;
        }
        if (/^https?:\/\//i.test(alternative.path)) {
          alternative.href = alternative.path;
          alternative.path = undefined;
        }
        if (alternative.raw) {
          data.raw = alternative.raw;
        } else if (alternative.path) {
          data.content = {
            path: alternative.path
          };
        } else if (alternative.href) {
          data.content = {
            href: alternative.href
          };
        } else {
          data.content = alternative.content || "";
        }
        if (alternative.encoding) {
          data.encoding = alternative.encoding;
        }
        if (alternative.headers) {
          data.headers = alternative.headers;
        }
        alternatives.push(data);
      });
      return alternatives;
    }
    _createMixed(parentNode) {
      let node;
      if (!parentNode) {
        node = new MimeNode("multipart/mixed", {
          baseBoundary: this.mail.baseBoundary,
          textEncoding: this.mail.textEncoding,
          boundaryPrefix: this.mail.boundaryPrefix,
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      } else {
        node = parentNode.createChild("multipart/mixed", {
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      }
      if (this._useAlternative) {
        this._createAlternative(node);
      } else if (this._useRelated) {
        this._createRelated(node);
      }
      [].concat(!this._useAlternative && this._alternatives || []).concat(this._attachments.attached || []).forEach((element) => {
        if (!this._useRelated || element !== this._htmlNode) {
          this._createContentNode(node, element);
        }
      });
      return node;
    }
    _createAlternative(parentNode) {
      let node;
      if (!parentNode) {
        node = new MimeNode("multipart/alternative", {
          baseBoundary: this.mail.baseBoundary,
          textEncoding: this.mail.textEncoding,
          boundaryPrefix: this.mail.boundaryPrefix,
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      } else {
        node = parentNode.createChild("multipart/alternative", {
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      }
      this._alternatives.forEach((alternative) => {
        if (this._useRelated && this._htmlNode === alternative) {
          this._createRelated(node);
        } else {
          this._createContentNode(node, alternative);
        }
      });
      return node;
    }
    _createRelated(parentNode) {
      let node;
      if (!parentNode) {
        node = new MimeNode('multipart/related; type="text/html"', {
          baseBoundary: this.mail.baseBoundary,
          textEncoding: this.mail.textEncoding,
          boundaryPrefix: this.mail.boundaryPrefix,
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      } else {
        node = parentNode.createChild('multipart/related; type="text/html"', {
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      }
      this._createContentNode(node, this._htmlNode);
      this._attachments.related.forEach((alternative) => this._createContentNode(node, alternative));
      return node;
    }
    _createContentNode(parentNode, element) {
      element = element || {};
      element.content = element.content || "";
      let node;
      let encoding = (element.encoding || "utf8").toString().toLowerCase().replace(/[-_\s]/g, "");
      if (!parentNode) {
        node = new MimeNode(element.contentType, {
          filename: element.filename,
          baseBoundary: this.mail.baseBoundary,
          textEncoding: this.mail.textEncoding,
          boundaryPrefix: this.mail.boundaryPrefix,
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      } else {
        node = parentNode.createChild(element.contentType, {
          filename: element.filename,
          textEncoding: this.mail.textEncoding,
          disableUrlAccess: this.mail.disableUrlAccess,
          disableFileAccess: this.mail.disableFileAccess,
          normalizeHeaderKey: this.mail.normalizeHeaderKey,
          newline: this.mail.newline
        });
      }
      if (element.headers) {
        node.addHeader(element.headers);
      }
      if (element.cid) {
        node.setHeader("Content-Id", "<" + element.cid.replace(/[<>]/g, "") + ">");
      }
      if (element.contentTransferEncoding) {
        node.setHeader("Content-Transfer-Encoding", element.contentTransferEncoding);
      } else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
        node.setHeader("Content-Transfer-Encoding", this.mail.encoding);
      }
      if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
        node.setHeader("Content-Disposition", element.contentDisposition || (element.cid && /^image\//i.test(element.contentType) ? "inline" : "attachment"));
      }
      if (typeof element.content === "string" && !["utf8", "usascii", "ascii"].includes(encoding)) {
        element.content = Buffer.from(element.content, encoding);
      }
      if (element.raw) {
        node.setRaw(element.raw);
      } else {
        node.setContent(element.content);
      }
      return node;
    }
    _processDataUrl(element) {
      const dataUrl = element.path || element.href;
      if (!dataUrl || typeof dataUrl !== "string") {
        return element;
      }
      if (!dataUrl.startsWith("data:")) {
        return element;
      }
      if (dataUrl.length > 52428800) {
        let detectedType = "application/octet-stream";
        const commaPos = dataUrl.indexOf(",");
        if (commaPos > 0 && commaPos < 200) {
          const header = dataUrl.substring(5, commaPos);
          const parts = header.split(";");
          if (parts[0] && parts[0].includes("/")) {
            detectedType = parts[0].trim();
          }
        }
        return Object.assign({}, element, {
          path: false,
          href: false,
          content: Buffer.alloc(0),
          contentType: element.contentType || detectedType
        });
      }
      let parsedDataUri;
      try {
        parsedDataUri = parseDataURI(dataUrl);
      } catch (_err) {
        return element;
      }
      if (!parsedDataUri) {
        return element;
      }
      element.content = parsedDataUri.data;
      element.contentType = element.contentType || parsedDataUri.contentType;
      if ("path" in element) {
        element.path = false;
      }
      if ("href" in element) {
        element.href = false;
      }
      return element;
    }
  }
  module.exports = MailComposer;
});

// node_modules/nodemailer/lib/dkim/message-parser.js
var require_message_parser = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;

  class MessageParser extends Transform {
    constructor(options) {
      super(options);
      this.lastBytes = Buffer.alloc(4);
      this.headersParsed = false;
      this.headerBytes = 0;
      this.headerChunks = [];
      this.rawHeaders = false;
      this.bodySize = 0;
    }
    updateLastBytes(data) {
      let lblen = this.lastBytes.length;
      let nblen = Math.min(data.length, lblen);
      for (let i = 0, len = lblen - nblen;i < len; i++) {
        this.lastBytes[i] = this.lastBytes[i + nblen];
      }
      for (let i = 1;i <= nblen; i++) {
        this.lastBytes[lblen - i] = data[data.length - i];
      }
    }
    checkHeaders(data) {
      if (this.headersParsed) {
        return true;
      }
      let lblen = this.lastBytes.length;
      let headerPos = 0;
      this.curLinePos = 0;
      for (let i = 0, len = this.lastBytes.length + data.length;i < len; i++) {
        let chr;
        if (i < lblen) {
          chr = this.lastBytes[i];
        } else {
          chr = data[i - lblen];
        }
        if (chr === 10 && i) {
          let pr1 = i - 1 < lblen ? this.lastBytes[i - 1] : data[i - 1 - lblen];
          let pr2 = i > 1 ? i - 2 < lblen ? this.lastBytes[i - 2] : data[i - 2 - lblen] : false;
          if (pr1 === 10) {
            this.headersParsed = true;
            headerPos = i - lblen + 1;
            this.headerBytes += headerPos;
            break;
          } else if (pr1 === 13 && pr2 === 10) {
            this.headersParsed = true;
            headerPos = i - lblen + 1;
            this.headerBytes += headerPos;
            break;
          }
        }
      }
      if (this.headersParsed) {
        this.headerChunks.push(data.slice(0, headerPos));
        this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
        this.headerChunks = null;
        this.emit("headers", this.parseHeaders());
        if (data.length - 1 > headerPos) {
          let chunk = data.slice(headerPos);
          this.bodySize += chunk.length;
          setImmediate(() => this.push(chunk));
        }
        return false;
      } else {
        this.headerBytes += data.length;
        this.headerChunks.push(data);
      }
      this.updateLastBytes(data);
      return false;
    }
    _transform(chunk, encoding, callback) {
      if (!chunk || !chunk.length) {
        return callback();
      }
      if (typeof chunk === "string") {
        chunk = Buffer.from(chunk, encoding);
      }
      let headersFound;
      try {
        headersFound = this.checkHeaders(chunk);
      } catch (E) {
        return callback(E);
      }
      if (headersFound) {
        this.bodySize += chunk.length;
        this.push(chunk);
      }
      setImmediate(callback);
    }
    _flush(callback) {
      if (this.headerChunks) {
        let chunk = Buffer.concat(this.headerChunks, this.headerBytes);
        this.bodySize += chunk.length;
        this.push(chunk);
        this.headerChunks = null;
      }
      callback();
    }
    parseHeaders() {
      let lines = (this.rawHeaders || "").toString().split(/\r?\n/);
      for (let i = lines.length - 1;i > 0; i--) {
        if (/^\s/.test(lines[i])) {
          lines[i - 1] += `
` + lines[i];
          lines.splice(i, 1);
        }
      }
      return lines.filter((line) => line.trim()).map((line) => ({
        key: line.substr(0, line.indexOf(":")).trim().toLowerCase(),
        line
      }));
    }
  }
  module.exports = MessageParser;
});

// node_modules/nodemailer/lib/dkim/relaxed-body.js
var require_relaxed_body = __commonJS((exports, module) => {
  var Transform = __require("stream").Transform;
  var crypto = __require("crypto");

  class RelaxedBody extends Transform {
    constructor(options) {
      super();
      options = options || {};
      this.chunkBuffer = [];
      this.chunkBufferLen = 0;
      this.bodyHash = crypto.createHash(options.hashAlgo || "sha1");
      this.remainder = "";
      this.byteLength = 0;
      this.debug = options.debug;
      this._debugBody = options.debug ? [] : false;
    }
    updateHash(chunk) {
      let bodyStr;
      let nextRemainder = "";
      let state = "file";
      for (let i = chunk.length - 1;i >= 0; i--) {
        let c = chunk[i];
        if (state === "file" && (c === 10 || c === 13)) {} else if (state === "file" && (c === 9 || c === 32)) {
          state = "line";
        } else if (state === "line" && (c === 9 || c === 32)) {} else if (state === "file" || state === "line") {
          state = "body";
          if (i === chunk.length - 1) {
            break;
          }
        }
        if (i === 0) {
          if (state === "file" && (!this.remainder || /[\r\n]$/.test(this.remainder)) || state === "line" && (!this.remainder || /[ \t]$/.test(this.remainder))) {
            this.remainder += chunk.toString("binary");
            return;
          } else if (state === "line" || state === "file") {
            nextRemainder = chunk.toString("binary");
            chunk = false;
            break;
          }
        }
        if (state !== "body") {
          continue;
        }
        nextRemainder = chunk.slice(i + 1).toString("binary");
        chunk = chunk.slice(0, i + 1);
        break;
      }
      let needsFixing = !!this.remainder;
      if (chunk && !needsFixing) {
        for (let i = 0, len = chunk.length;i < len; i++) {
          if (i && chunk[i] === 10 && chunk[i - 1] !== 13) {
            needsFixing = true;
            break;
          } else if (i && chunk[i] === 13 && chunk[i - 1] === 32) {
            needsFixing = true;
            break;
          } else if (i && chunk[i] === 32 && chunk[i - 1] === 32) {
            needsFixing = true;
            break;
          } else if (chunk[i] === 9) {
            needsFixing = true;
            break;
          }
        }
      }
      if (needsFixing) {
        bodyStr = this.remainder + (chunk ? chunk.toString("binary") : "");
        this.remainder = nextRemainder;
        bodyStr = bodyStr.replace(/\r?\n/g, `
`).replace(/[ \t]*$/gm, "").replace(/[ \t]+/gm, " ").replace(/\n/g, `\r
`);
        chunk = Buffer.from(bodyStr, "binary");
      } else if (nextRemainder) {
        this.remainder = nextRemainder;
      }
      if (this.debug) {
        this._debugBody.push(chunk);
      }
      this.bodyHash.update(chunk);
    }
    _transform(chunk, encoding, callback) {
      if (!chunk || !chunk.length) {
        return callback();
      }
      if (typeof chunk === "string") {
        chunk = Buffer.from(chunk, encoding);
      }
      this.updateHash(chunk);
      this.byteLength += chunk.length;
      this.push(chunk);
      callback();
    }
    _flush(callback) {
      if (/[\r\n]$/.test(this.remainder) && this.byteLength > 2) {
        this.bodyHash.update(Buffer.from(`\r
`));
      }
      if (!this.byteLength) {
        this.push(Buffer.from(`\r
`));
      }
      this.emit("hash", this.bodyHash.digest("base64"), this.debug ? Buffer.concat(this._debugBody) : false);
      callback();
    }
  }
  module.exports = RelaxedBody;
});

// node_modules/nodemailer/lib/dkim/sign.js
var require_sign = __commonJS((exports, module) => {
  var punycode = require_punycode();
  var mimeFuncs = require_mime_funcs();
  var crypto = __require("crypto");
  module.exports = (headers, hashAlgo, bodyHash, options) => {
    options = options || {};
    let defaultFieldNames = "From:Sender:Reply-To:Subject:Date:Message-ID:To:" + "Cc:MIME-Version:Content-Type:Content-Transfer-Encoding:Content-ID:" + "Content-Description:Resent-Date:Resent-From:Resent-Sender:" + "Resent-To:Resent-Cc:Resent-Message-ID:In-Reply-To:References:" + "List-Id:List-Help:List-Unsubscribe:List-Subscribe:List-Post:" + "List-Owner:List-Archive";
    let fieldNames = options.headerFieldNames || defaultFieldNames;
    let canonicalizedHeaderData = relaxedHeaders(headers, fieldNames, options.skipFields);
    let dkimHeader = generateDKIMHeader(options.domainName, options.keySelector, canonicalizedHeaderData.fieldNames, hashAlgo, bodyHash);
    let signer, signature;
    canonicalizedHeaderData.headers += "dkim-signature:" + relaxedHeaderLine(dkimHeader);
    signer = crypto.createSign(("rsa-" + hashAlgo).toUpperCase());
    signer.update(canonicalizedHeaderData.headers);
    try {
      signature = signer.sign(options.privateKey, "base64");
    } catch (_E) {
      return false;
    }
    return dkimHeader + signature.replace(/(^.{73}|.{75}(?!\r?\n|\r))/g, `$&\r
 `).trim();
  };
  module.exports.relaxedHeaders = relaxedHeaders;
  function generateDKIMHeader(domainName, keySelector, fieldNames, hashAlgo, bodyHash) {
    let dkim = [
      "v=1",
      "a=rsa-" + hashAlgo,
      "c=relaxed/relaxed",
      "d=" + punycode.toASCII(domainName),
      "q=dns/txt",
      "s=" + keySelector,
      "bh=" + bodyHash,
      "h=" + fieldNames
    ].join("; ");
    return mimeFuncs.foldLines("DKIM-Signature: " + dkim, 76) + `;\r
 b=`;
  }
  function relaxedHeaders(headers, fieldNames, skipFields) {
    let includedFields = new Set;
    let skip = new Set;
    let headerFields = new Map;
    (skipFields || "").toLowerCase().split(":").forEach((field) => {
      skip.add(field.trim());
    });
    (fieldNames || "").toLowerCase().split(":").filter((field) => !skip.has(field.trim())).forEach((field) => {
      includedFields.add(field.trim());
    });
    for (let i = headers.length - 1;i >= 0; i--) {
      let line = headers[i];
      if (includedFields.has(line.key) && !headerFields.has(line.key)) {
        headerFields.set(line.key, relaxedHeaderLine(line.line));
      }
    }
    let headersList = [];
    let fields = [];
    includedFields.forEach((field) => {
      if (headerFields.has(field)) {
        fields.push(field);
        headersList.push(field + ":" + headerFields.get(field));
      }
    });
    return {
      headers: headersList.join(`\r
`) + `\r
`,
      fieldNames: fields.join(":")
    };
  }
  function relaxedHeaderLine(line) {
    return line.substr(line.indexOf(":") + 1).replace(/\r?\n/g, "").replace(/\s+/g, " ").trim();
  }
});

// node_modules/nodemailer/lib/dkim/index.js
var require_dkim = __commonJS((exports, module) => {
  var MessageParser = require_message_parser();
  var RelaxedBody = require_relaxed_body();
  var sign = require_sign();
  var PassThrough = __require("stream").PassThrough;
  var fs2 = __require("fs");
  var path2 = __require("path");
  var crypto = __require("crypto");
  var DKIM_ALGO = "sha256";
  var MAX_MESSAGE_SIZE = 2 * 1024 * 1024;

  class DKIMSigner {
    constructor(options, keys, input, output) {
      this.options = options || {};
      this.keys = keys;
      this.cacheTreshold = Number(this.options.cacheTreshold) || MAX_MESSAGE_SIZE;
      this.hashAlgo = this.options.hashAlgo || DKIM_ALGO;
      this.cacheDir = this.options.cacheDir || false;
      this.chunks = [];
      this.chunklen = 0;
      this.readPos = 0;
      this.cachePath = this.cacheDir ? path2.join(this.cacheDir, "message." + Date.now() + "-" + crypto.randomBytes(14).toString("hex")) : false;
      this.cache = false;
      this.headers = false;
      this.bodyHash = false;
      this.parser = false;
      this.relaxedBody = false;
      this.input = input;
      this.output = output;
      this.output.usingCache = false;
      this.hasErrored = false;
      this.input.on("error", (err) => {
        this.hasErrored = true;
        this.cleanup();
        output.emit("error", err);
      });
    }
    cleanup() {
      if (!this.cache || !this.cachePath) {
        return;
      }
      fs2.unlink(this.cachePath, () => false);
    }
    createReadCache() {
      this.cache = fs2.createReadStream(this.cachePath);
      this.cache.once("error", (err) => {
        this.cleanup();
        this.output.emit("error", err);
      });
      this.cache.once("close", () => {
        this.cleanup();
      });
      this.cache.pipe(this.output);
    }
    sendNextChunk() {
      if (this.hasErrored) {
        return;
      }
      if (this.readPos >= this.chunks.length) {
        if (!this.cache) {
          return this.output.end();
        }
        return this.createReadCache();
      }
      let chunk = this.chunks[this.readPos++];
      if (this.output.write(chunk) === false) {
        return this.output.once("drain", () => {
          this.sendNextChunk();
        });
      }
      setImmediate(() => this.sendNextChunk());
    }
    sendSignedOutput() {
      let keyPos = 0;
      let signNextKey = () => {
        if (keyPos >= this.keys.length) {
          this.output.write(this.parser.rawHeaders);
          return setImmediate(() => this.sendNextChunk());
        }
        let key = this.keys[keyPos++];
        let dkimField = sign(this.headers, this.hashAlgo, this.bodyHash, {
          domainName: key.domainName,
          keySelector: key.keySelector,
          privateKey: key.privateKey,
          headerFieldNames: this.options.headerFieldNames,
          skipFields: this.options.skipFields
        });
        if (dkimField) {
          this.output.write(Buffer.from(dkimField + `\r
`));
        }
        return setImmediate(signNextKey);
      };
      if (this.bodyHash && this.headers) {
        return signNextKey();
      }
      this.output.write(this.parser.rawHeaders);
      this.sendNextChunk();
    }
    createWriteCache() {
      this.output.usingCache = true;
      this.cache = fs2.createWriteStream(this.cachePath);
      this.cache.once("error", (err) => {
        this.cleanup();
        this.relaxedBody.unpipe(this.cache);
        this.relaxedBody.on("readable", () => {
          while (this.relaxedBody.read() !== null) {}
        });
        this.hasErrored = true;
        this.output.emit("error", err);
      });
      this.cache.once("close", () => {
        this.sendSignedOutput();
      });
      this.relaxedBody.removeAllListeners("readable");
      this.relaxedBody.pipe(this.cache);
    }
    signStream() {
      this.parser = new MessageParser;
      this.relaxedBody = new RelaxedBody({
        hashAlgo: this.hashAlgo
      });
      this.parser.on("headers", (value) => {
        this.headers = value;
      });
      this.relaxedBody.on("hash", (value) => {
        this.bodyHash = value;
      });
      this.relaxedBody.on("readable", () => {
        let chunk;
        if (this.cache) {
          return;
        }
        while ((chunk = this.relaxedBody.read()) !== null) {
          this.chunks.push(chunk);
          this.chunklen += chunk.length;
          if (this.chunklen >= this.cacheTreshold && this.cachePath) {
            return this.createWriteCache();
          }
        }
      });
      this.relaxedBody.on("end", () => {
        if (this.cache) {
          return;
        }
        this.sendSignedOutput();
      });
      this.parser.pipe(this.relaxedBody);
      setImmediate(() => this.input.pipe(this.parser));
    }
  }

  class DKIM {
    constructor(options) {
      this.options = options || {};
      this.keys = [].concat(this.options.keys || {
        domainName: options.domainName,
        keySelector: options.keySelector,
        privateKey: options.privateKey
      });
    }
    sign(input, extraOptions) {
      let output = new PassThrough;
      let inputStream = input;
      let writeValue = false;
      if (Buffer.isBuffer(input)) {
        writeValue = input;
        inputStream = new PassThrough;
      } else if (typeof input === "string") {
        writeValue = Buffer.from(input);
        inputStream = new PassThrough;
      }
      let options = this.options;
      if (extraOptions && Object.keys(extraOptions).length) {
        options = {};
        Object.keys(this.options || {}).forEach((key) => {
          options[key] = this.options[key];
        });
        Object.keys(extraOptions || {}).forEach((key) => {
          if (!(key in options)) {
            options[key] = extraOptions[key];
          }
        });
      }
      let signer = new DKIMSigner(options, this.keys, inputStream, output);
      setImmediate(() => {
        signer.signStream();
        if (writeValue) {
          setImmediate(() => {
            inputStream.end(writeValue);
          });
        }
      });
      return output;
    }
  }
  module.exports = DKIM;
});

// node_modules/nodemailer/lib/smtp-connection/http-proxy-client.js
var require_http_proxy_client = __commonJS((exports, module) => {
  var net = __require("net");
  var tls = __require("tls");
  var urllib = __require("url");
  function httpProxyClient(proxyUrl, destinationPort, destinationHost, callback) {
    let proxy = urllib.parse(proxyUrl);
    let options;
    let connect;
    let socket;
    options = {
      host: proxy.hostname,
      port: Number(proxy.port) ? Number(proxy.port) : proxy.protocol === "https:" ? 443 : 80
    };
    if (proxy.protocol === "https:") {
      options.rejectUnauthorized = false;
      connect = tls.connect.bind(tls);
    } else {
      connect = net.connect.bind(net);
    }
    let finished = false;
    let tempSocketErr = (err) => {
      if (finished) {
        return;
      }
      finished = true;
      try {
        socket.destroy();
      } catch (_E) {}
      callback(err);
    };
    let timeoutErr = () => {
      let err = new Error("Proxy socket timed out");
      err.code = "ETIMEDOUT";
      tempSocketErr(err);
    };
    socket = connect(options, () => {
      if (finished) {
        return;
      }
      let reqHeaders = {
        Host: destinationHost + ":" + destinationPort,
        Connection: "close"
      };
      if (proxy.auth) {
        reqHeaders["Proxy-Authorization"] = "Basic " + Buffer.from(proxy.auth).toString("base64");
      }
      socket.write("CONNECT " + destinationHost + ":" + destinationPort + ` HTTP/1.1\r
` + Object.keys(reqHeaders).map((key) => key + ": " + reqHeaders[key]).join(`\r
`) + `\r
\r
`);
      let headers = "";
      let onSocketData = (chunk) => {
        let match;
        let remainder;
        if (finished) {
          return;
        }
        headers += chunk.toString("binary");
        if (match = headers.match(/\r\n\r\n/)) {
          socket.removeListener("data", onSocketData);
          remainder = headers.substr(match.index + match[0].length);
          headers = headers.substr(0, match.index);
          if (remainder) {
            socket.unshift(Buffer.from(remainder, "binary"));
          }
          finished = true;
          match = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
          if (!match || (match[1] || "").charAt(0) !== "2") {
            try {
              socket.destroy();
            } catch (_E) {}
            return callback(new Error("Invalid response from proxy" + (match && ": " + match[1] || "")));
          }
          socket.removeListener("error", tempSocketErr);
          socket.removeListener("timeout", timeoutErr);
          socket.setTimeout(0);
          return callback(null, socket);
        }
      };
      socket.on("data", onSocketData);
    });
    socket.setTimeout(httpProxyClient.timeout || 30 * 1000);
    socket.on("timeout", timeoutErr);
    socket.once("error", tempSocketErr);
  }
  module.exports = httpProxyClient;
});

// node_modules/nodemailer/lib/mailer/mail-message.js
var require_mail_message = __commonJS((exports, module) => {
  var shared = require_shared();
  var MimeNode = require_mime_node();
  var mimeFuncs = require_mime_funcs();

  class MailMessage {
    constructor(mailer, data) {
      this.mailer = mailer;
      this.data = {};
      this.message = null;
      data = data || {};
      let options = mailer.options || {};
      let defaults = mailer._defaults || {};
      Object.keys(data).forEach((key) => {
        this.data[key] = data[key];
      });
      this.data.headers = this.data.headers || {};
      Object.keys(defaults).forEach((key) => {
        if (!(key in this.data)) {
          this.data[key] = defaults[key];
        } else if (key === "headers") {
          Object.keys(defaults.headers).forEach((key2) => {
            if (!(key2 in this.data.headers)) {
              this.data.headers[key2] = defaults.headers[key2];
            }
          });
        }
      });
      ["disableFileAccess", "disableUrlAccess", "normalizeHeaderKey"].forEach((key) => {
        if (key in options) {
          this.data[key] = options[key];
        }
      });
    }
    resolveContent(...args) {
      return shared.resolveContent(...args);
    }
    resolveAll(callback) {
      let keys = [
        [this.data, "html"],
        [this.data, "text"],
        [this.data, "watchHtml"],
        [this.data, "amp"],
        [this.data, "icalEvent"]
      ];
      if (this.data.alternatives && this.data.alternatives.length) {
        this.data.alternatives.forEach((alternative, i) => {
          keys.push([this.data.alternatives, i]);
        });
      }
      if (this.data.attachments && this.data.attachments.length) {
        this.data.attachments.forEach((attachment, i) => {
          if (!attachment.filename) {
            attachment.filename = (attachment.path || attachment.href || "").split("/").pop().split("?").shift() || "attachment-" + (i + 1);
            if (attachment.filename.indexOf(".") < 0) {
              attachment.filename += "." + mimeFuncs.detectExtension(attachment.contentType);
            }
          }
          if (!attachment.contentType) {
            attachment.contentType = mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || "bin");
          }
          keys.push([this.data.attachments, i]);
        });
      }
      let mimeNode = new MimeNode;
      let addressKeys = ["from", "to", "cc", "bcc", "sender", "replyTo"];
      addressKeys.forEach((address) => {
        let value;
        if (this.message) {
          value = [].concat(mimeNode._parseAddresses(this.message.getHeader(address === "replyTo" ? "reply-to" : address)) || []);
        } else if (this.data[address]) {
          value = [].concat(mimeNode._parseAddresses(this.data[address]) || []);
        }
        if (value && value.length) {
          this.data[address] = value;
        } else if (address in this.data) {
          this.data[address] = null;
        }
      });
      let singleKeys = ["from", "sender"];
      singleKeys.forEach((address) => {
        if (this.data[address]) {
          this.data[address] = this.data[address].shift();
        }
      });
      let pos = 0;
      let resolveNext = () => {
        if (pos >= keys.length) {
          return callback(null, this.data);
        }
        let args = keys[pos++];
        if (!args[0] || !args[0][args[1]]) {
          return resolveNext();
        }
        shared.resolveContent(...args, (err, value) => {
          if (err) {
            return callback(err);
          }
          let node = {
            content: value
          };
          if (args[0][args[1]] && typeof args[0][args[1]] === "object" && !Buffer.isBuffer(args[0][args[1]])) {
            Object.keys(args[0][args[1]]).forEach((key) => {
              if (!(key in node) && !["content", "path", "href", "raw"].includes(key)) {
                node[key] = args[0][args[1]][key];
              }
            });
          }
          args[0][args[1]] = node;
          resolveNext();
        });
      };
      setImmediate(() => resolveNext());
    }
    normalize(callback) {
      let envelope = this.data.envelope || this.message.getEnvelope();
      let messageId = this.message.messageId();
      this.resolveAll((err, data) => {
        if (err) {
          return callback(err);
        }
        data.envelope = envelope;
        data.messageId = messageId;
        ["html", "text", "watchHtml", "amp"].forEach((key) => {
          if (data[key] && data[key].content) {
            if (typeof data[key].content === "string") {
              data[key] = data[key].content;
            } else if (Buffer.isBuffer(data[key].content)) {
              data[key] = data[key].content.toString();
            }
          }
        });
        if (data.icalEvent && Buffer.isBuffer(data.icalEvent.content)) {
          data.icalEvent.content = data.icalEvent.content.toString("base64");
          data.icalEvent.encoding = "base64";
        }
        if (data.alternatives && data.alternatives.length) {
          data.alternatives.forEach((alternative) => {
            if (alternative && alternative.content && Buffer.isBuffer(alternative.content)) {
              alternative.content = alternative.content.toString("base64");
              alternative.encoding = "base64";
            }
          });
        }
        if (data.attachments && data.attachments.length) {
          data.attachments.forEach((attachment) => {
            if (attachment && attachment.content && Buffer.isBuffer(attachment.content)) {
              attachment.content = attachment.content.toString("base64");
              attachment.encoding = "base64";
            }
          });
        }
        data.normalizedHeaders = {};
        Object.keys(data.headers || {}).forEach((key) => {
          let value = [].concat(data.headers[key] || []).shift();
          value = value && value.value || value;
          if (value) {
            if (["references", "in-reply-to", "message-id", "content-id"].includes(key)) {
              value = this.message._encodeHeaderValue(key, value);
            }
            data.normalizedHeaders[key] = value;
          }
        });
        if (data.list && typeof data.list === "object") {
          let listHeaders = this._getListHeaders(data.list);
          listHeaders.forEach((entry) => {
            data.normalizedHeaders[entry.key] = entry.value.map((val) => val && val.value || val).join(", ");
          });
        }
        if (data.references) {
          data.normalizedHeaders.references = this.message._encodeHeaderValue("references", data.references);
        }
        if (data.inReplyTo) {
          data.normalizedHeaders["in-reply-to"] = this.message._encodeHeaderValue("in-reply-to", data.inReplyTo);
        }
        return callback(null, data);
      });
    }
    setMailerHeader() {
      if (!this.message || !this.data.xMailer) {
        return;
      }
      this.message.setHeader("X-Mailer", this.data.xMailer);
    }
    setPriorityHeaders() {
      if (!this.message || !this.data.priority) {
        return;
      }
      switch ((this.data.priority || "").toString().toLowerCase()) {
        case "high":
          this.message.setHeader("X-Priority", "1 (Highest)");
          this.message.setHeader("X-MSMail-Priority", "High");
          this.message.setHeader("Importance", "High");
          break;
        case "low":
          this.message.setHeader("X-Priority", "5 (Lowest)");
          this.message.setHeader("X-MSMail-Priority", "Low");
          this.message.setHeader("Importance", "Low");
          break;
        default:
      }
    }
    setListHeaders() {
      if (!this.message || !this.data.list || typeof this.data.list !== "object") {
        return;
      }
      if (this.data.list && typeof this.data.list === "object") {
        this._getListHeaders(this.data.list).forEach((listHeader) => {
          listHeader.value.forEach((value) => {
            this.message.addHeader(listHeader.key, value);
          });
        });
      }
    }
    _getListHeaders(listData) {
      return Object.keys(listData).map((key) => ({
        key: "list-" + key.toLowerCase().trim(),
        value: [].concat(listData[key] || []).map((value) => ({
          prepared: true,
          foldLines: true,
          value: [].concat(value || []).map((value2) => {
            if (typeof value2 === "string") {
              value2 = {
                url: value2
              };
            }
            if (value2 && value2.url) {
              if (key.toLowerCase().trim() === "id") {
                let comment2 = value2.comment || "";
                if (mimeFuncs.isPlainText(comment2)) {
                  comment2 = '"' + comment2 + '"';
                } else {
                  comment2 = mimeFuncs.encodeWord(comment2);
                }
                return (value2.comment ? comment2 + " " : "") + this._formatListUrl(value2.url).replace(/^<[^:]+\/{,2}/, "");
              }
              let comment = value2.comment || "";
              if (!mimeFuncs.isPlainText(comment)) {
                comment = mimeFuncs.encodeWord(comment);
              }
              return this._formatListUrl(value2.url) + (value2.comment ? " (" + comment + ")" : "");
            }
            return "";
          }).filter((value2) => value2).join(", ")
        }))
      }));
    }
    _formatListUrl(url) {
      url = url.replace(/[\s<]+|[\s>]+/g, "");
      if (/^(https?|mailto|ftp):/.test(url)) {
        return "<" + url + ">";
      }
      if (/^[^@]+@[^@]+$/.test(url)) {
        return "<mailto:" + url + ">";
      }
      return "<http://" + url + ">";
    }
  }
  module.exports = MailMessage;
});

// node_modules/nodemailer/lib/mailer/index.js
var require_mailer = __commonJS((exports, module) => {
  var EventEmitter = __require("events");
  var shared = require_shared();
  var mimeTypes = require_mime_types();
  var MailComposer = require_mail_composer();
  var DKIM = require_dkim();
  var httpProxyClient = require_http_proxy_client();
  var util = __require("util");
  var urllib = __require("url");
  var packageData = require_package();
  var MailMessage = require_mail_message();
  var net = __require("net");
  var dns = __require("dns");
  var crypto = __require("crypto");

  class Mail extends EventEmitter {
    constructor(transporter, options, defaults) {
      super();
      this.options = options || {};
      this._defaults = defaults || {};
      this._defaultPlugins = {
        compile: [(...args) => this._convertDataImages(...args)],
        stream: []
      };
      this._userPlugins = {
        compile: [],
        stream: []
      };
      this.meta = new Map;
      this.dkim = this.options.dkim ? new DKIM(this.options.dkim) : false;
      this.transporter = transporter;
      this.transporter.mailer = this;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "mail"
      });
      this.logger.debug({
        tnx: "create"
      }, "Creating transport: %s", this.getVersionString());
      if (typeof this.transporter.on === "function") {
        this.transporter.on("log", (log) => {
          this.logger.debug({
            tnx: "transport"
          }, "%s: %s", log.type, log.message);
        });
        this.transporter.on("error", (err) => {
          this.logger.error({
            err,
            tnx: "transport"
          }, "Transport Error: %s", err.message);
          this.emit("error", err);
        });
        this.transporter.on("idle", (...args) => {
          this.emit("idle", ...args);
        });
        this.transporter.on("clear", (...args) => {
          this.emit("clear", ...args);
        });
      }
      ["close", "isIdle", "verify"].forEach((method) => {
        this[method] = (...args) => {
          if (typeof this.transporter[method] === "function") {
            if (method === "verify" && typeof this.getSocket === "function") {
              this.transporter.getSocket = this.getSocket;
              this.getSocket = false;
            }
            return this.transporter[method](...args);
          } else {
            this.logger.warn({
              tnx: "transport",
              methodName: method
            }, "Non existing method %s called for transport", method);
            return false;
          }
        };
      });
      if (this.options.proxy && typeof this.options.proxy === "string") {
        this.setupProxy(this.options.proxy);
      }
    }
    use(step, plugin) {
      step = (step || "").toString();
      if (!this._userPlugins.hasOwnProperty(step)) {
        this._userPlugins[step] = [plugin];
      } else {
        this._userPlugins[step].push(plugin);
      }
      return this;
    }
    sendMail(data, callback = null) {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      if (typeof this.getSocket === "function") {
        this.transporter.getSocket = this.getSocket;
        this.getSocket = false;
      }
      let mail = new MailMessage(this, data);
      this.logger.debug({
        tnx: "transport",
        name: this.transporter.name,
        version: this.transporter.version,
        action: "send"
      }, "Sending mail using %s/%s", this.transporter.name, this.transporter.version);
      this._processPlugins("compile", mail, (err) => {
        if (err) {
          this.logger.error({
            err,
            tnx: "plugin",
            action: "compile"
          }, "PluginCompile Error: %s", err.message);
          return callback(err);
        }
        mail.message = new MailComposer(mail.data).compile();
        mail.setMailerHeader();
        mail.setPriorityHeaders();
        mail.setListHeaders();
        this._processPlugins("stream", mail, (err2) => {
          if (err2) {
            this.logger.error({
              err: err2,
              tnx: "plugin",
              action: "stream"
            }, "PluginStream Error: %s", err2.message);
            return callback(err2);
          }
          if (mail.data.dkim || this.dkim) {
            mail.message.processFunc((input) => {
              let dkim = mail.data.dkim ? new DKIM(mail.data.dkim) : this.dkim;
              this.logger.debug({
                tnx: "DKIM",
                messageId: mail.message.messageId(),
                dkimDomains: dkim.keys.map((key) => key.keySelector + "." + key.domainName).join(", ")
              }, "Signing outgoing message with %s keys", dkim.keys.length);
              return dkim.sign(input, mail.data._dkim);
            });
          }
          this.transporter.send(mail, (...args) => {
            if (args[0]) {
              this.logger.error({
                err: args[0],
                tnx: "transport",
                action: "send"
              }, "Send Error: %s", args[0].message);
            }
            callback(...args);
          });
        });
      });
      return promise;
    }
    getVersionString() {
      return util.format("%s (%s; +%s; %s/%s)", packageData.name, packageData.version, packageData.homepage, this.transporter.name, this.transporter.version);
    }
    _processPlugins(step, mail, callback) {
      step = (step || "").toString();
      if (!this._userPlugins.hasOwnProperty(step)) {
        return callback();
      }
      let userPlugins = this._userPlugins[step] || [];
      let defaultPlugins = this._defaultPlugins[step] || [];
      if (userPlugins.length) {
        this.logger.debug({
          tnx: "transaction",
          pluginCount: userPlugins.length,
          step
        }, "Using %s plugins for %s", userPlugins.length, step);
      }
      if (userPlugins.length + defaultPlugins.length === 0) {
        return callback();
      }
      let pos = 0;
      let block = "default";
      let processPlugins = () => {
        let curplugins = block === "default" ? defaultPlugins : userPlugins;
        if (pos >= curplugins.length) {
          if (block === "default" && userPlugins.length) {
            block = "user";
            pos = 0;
            curplugins = userPlugins;
          } else {
            return callback();
          }
        }
        let plugin = curplugins[pos++];
        plugin(mail, (err) => {
          if (err) {
            return callback(err);
          }
          processPlugins();
        });
      };
      processPlugins();
    }
    setupProxy(proxyUrl) {
      let proxy = urllib.parse(proxyUrl);
      this.getSocket = (options, callback) => {
        let protocol = proxy.protocol.replace(/:$/, "").toLowerCase();
        if (this.meta.has("proxy_handler_" + protocol)) {
          return this.meta.get("proxy_handler_" + protocol)(proxy, options, callback);
        }
        switch (protocol) {
          case "http":
          case "https":
            httpProxyClient(proxy.href, options.port, options.host, (err, socket) => {
              if (err) {
                return callback(err);
              }
              return callback(null, {
                connection: socket
              });
            });
            return;
          case "socks":
          case "socks5":
          case "socks4":
          case "socks4a": {
            if (!this.meta.has("proxy_socks_module")) {
              return callback(new Error("Socks module not loaded"));
            }
            let connect = (ipaddress) => {
              let proxyV2 = !!this.meta.get("proxy_socks_module").SocksClient;
              let socksClient = proxyV2 ? this.meta.get("proxy_socks_module").SocksClient : this.meta.get("proxy_socks_module");
              let proxyType = Number(proxy.protocol.replace(/\D/g, "")) || 5;
              let connectionOpts = {
                proxy: {
                  ipaddress,
                  port: Number(proxy.port),
                  type: proxyType
                },
                [proxyV2 ? "destination" : "target"]: {
                  host: options.host,
                  port: options.port
                },
                command: "connect"
              };
              if (proxy.auth) {
                let username = decodeURIComponent(proxy.auth.split(":").shift());
                let password = decodeURIComponent(proxy.auth.split(":").pop());
                if (proxyV2) {
                  connectionOpts.proxy.userId = username;
                  connectionOpts.proxy.password = password;
                } else if (proxyType === 4) {
                  connectionOpts.userid = username;
                } else {
                  connectionOpts.authentication = {
                    username,
                    password
                  };
                }
              }
              socksClient.createConnection(connectionOpts, (err, info) => {
                if (err) {
                  return callback(err);
                }
                return callback(null, {
                  connection: info.socket || info
                });
              });
            };
            if (net.isIP(proxy.hostname)) {
              return connect(proxy.hostname);
            }
            return dns.resolve(proxy.hostname, (err, address) => {
              if (err) {
                return callback(err);
              }
              connect(Array.isArray(address) ? address[0] : address);
            });
          }
        }
        callback(new Error("Unknown proxy configuration"));
      };
    }
    _convertDataImages(mail, callback) {
      if (!this.options.attachDataUrls && !mail.data.attachDataUrls || !mail.data.html) {
        return callback();
      }
      mail.resolveContent(mail.data, "html", (err, html) => {
        if (err) {
          return callback(err);
        }
        let cidCounter = 0;
        html = (html || "").toString().replace(/(<img\b[^<>]{0,1024} src\s{0,20}=[\s"']{0,20})(data:([^;]+);[^"'>\s]+)/gi, (match, prefix, dataUri, mimeType) => {
          let cid = crypto.randomBytes(10).toString("hex") + "@localhost";
          if (!mail.data.attachments) {
            mail.data.attachments = [];
          }
          if (!Array.isArray(mail.data.attachments)) {
            mail.data.attachments = [].concat(mail.data.attachments || []);
          }
          mail.data.attachments.push({
            path: dataUri,
            cid,
            filename: "image-" + ++cidCounter + "." + mimeTypes.detectExtension(mimeType)
          });
          return prefix + "cid:" + cid;
        });
        mail.data.html = html;
        callback();
      });
    }
    set(key, value) {
      return this.meta.set(key, value);
    }
    get(key) {
      return this.meta.get(key);
    }
  }
  module.exports = Mail;
});

// node_modules/nodemailer/lib/smtp-connection/data-stream.js
var require_data_stream = __commonJS((exports, module) => {
  var stream = __require("stream");
  var Transform = stream.Transform;

  class DataStream extends Transform {
    constructor(options) {
      super(options);
      this.options = options || {};
      this._curLine = "";
      this.inByteCount = 0;
      this.outByteCount = 0;
      this.lastByte = false;
    }
    _transform(chunk, encoding, done) {
      let chunks = [];
      let chunklen = 0;
      let i, len, lastPos = 0;
      let buf;
      if (!chunk || !chunk.length) {
        return done();
      }
      if (typeof chunk === "string") {
        chunk = Buffer.from(chunk);
      }
      this.inByteCount += chunk.length;
      for (i = 0, len = chunk.length;i < len; i++) {
        if (chunk[i] === 46) {
          if (i && chunk[i - 1] === 10 || !i && (!this.lastByte || this.lastByte === 10)) {
            buf = chunk.slice(lastPos, i + 1);
            chunks.push(buf);
            chunks.push(Buffer.from("."));
            chunklen += buf.length + 1;
            lastPos = i + 1;
          }
        } else if (chunk[i] === 10) {
          if (i && chunk[i - 1] !== 13 || !i && this.lastByte !== 13) {
            if (i > lastPos) {
              buf = chunk.slice(lastPos, i);
              chunks.push(buf);
              chunklen += buf.length + 2;
            } else {
              chunklen += 2;
            }
            chunks.push(Buffer.from(`\r
`));
            lastPos = i + 1;
          }
        }
      }
      if (chunklen) {
        if (lastPos < chunk.length) {
          buf = chunk.slice(lastPos);
          chunks.push(buf);
          chunklen += buf.length;
        }
        this.outByteCount += chunklen;
        this.push(Buffer.concat(chunks, chunklen));
      } else {
        this.outByteCount += chunk.length;
        this.push(chunk);
      }
      this.lastByte = chunk[chunk.length - 1];
      done();
    }
    _flush(done) {
      let buf;
      if (this.lastByte === 10) {
        buf = Buffer.from(`.\r
`);
      } else if (this.lastByte === 13) {
        buf = Buffer.from(`
.\r
`);
      } else {
        buf = Buffer.from(`\r
.\r
`);
      }
      this.outByteCount += buf.length;
      this.push(buf);
      done();
    }
  }
  module.exports = DataStream;
});

// node_modules/nodemailer/lib/smtp-connection/index.js
var require_smtp_connection = __commonJS((exports, module) => {
  var packageInfo = require_package();
  var EventEmitter = __require("events").EventEmitter;
  var net = __require("net");
  var tls = __require("tls");
  var os2 = __require("os");
  var crypto = __require("crypto");
  var DataStream = require_data_stream();
  var PassThrough = __require("stream").PassThrough;
  var shared = require_shared();
  var CONNECTION_TIMEOUT = 2 * 60 * 1000;
  var SOCKET_TIMEOUT = 10 * 60 * 1000;
  var GREETING_TIMEOUT = 30 * 1000;
  var DNS_TIMEOUT = 30 * 1000;

  class SMTPConnection extends EventEmitter {
    constructor(options) {
      super(options);
      this.id = crypto.randomBytes(8).toString("base64").replace(/\W/g, "");
      this.stage = "init";
      this.options = options || {};
      this.secureConnection = !!this.options.secure;
      this.alreadySecured = !!this.options.secured;
      this.port = Number(this.options.port) || (this.secureConnection ? 465 : 587);
      this.host = this.options.host || "localhost";
      this.servername = this.options.servername ? this.options.servername : !net.isIP(this.host) ? this.host : false;
      this.allowInternalNetworkInterfaces = this.options.allowInternalNetworkInterfaces || false;
      if (typeof this.options.secure === "undefined" && this.port === 465) {
        this.secureConnection = true;
      }
      this.name = this.options.name || this._getHostname();
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "smtp-connection",
        sid: this.id
      });
      this.customAuth = new Map;
      Object.keys(this.options.customAuth || {}).forEach((key) => {
        let mapKey = (key || "").toString().trim().toUpperCase();
        if (!mapKey) {
          return;
        }
        this.customAuth.set(mapKey, this.options.customAuth[key]);
      });
      this.version = packageInfo.version;
      this.authenticated = false;
      this.destroyed = false;
      this.secure = !!this.secureConnection;
      this._remainder = "";
      this._responseQueue = [];
      this.lastServerResponse = false;
      this._socket = false;
      this._supportedAuth = [];
      this.allowsAuth = false;
      this._envelope = false;
      this._supportedExtensions = [];
      this._maxAllowedSize = 0;
      this._responseActions = [];
      this._recipientQueue = [];
      this._greetingTimeout = false;
      this._connectionTimeout = false;
      this._destroyed = false;
      this._closing = false;
      this._onSocketData = (chunk) => this._onData(chunk);
      this._onSocketError = (error) => this._onError(error, "ESOCKET", false, "CONN");
      this._onSocketClose = () => this._onClose();
      this._onSocketEnd = () => this._onEnd();
      this._onSocketTimeout = () => this._onTimeout();
    }
    connect(connectCallback) {
      if (typeof connectCallback === "function") {
        this.once("connect", () => {
          this.logger.debug({
            tnx: "smtp"
          }, "SMTP handshake finished");
          connectCallback();
        });
        const isDestroyedMessage = this._isDestroyedMessage("connect");
        if (isDestroyedMessage) {
          return connectCallback(this._formatError(isDestroyedMessage, "ECONNECTION", false, "CONN"));
        }
      }
      let opts = {
        port: this.port,
        host: this.host,
        allowInternalNetworkInterfaces: this.allowInternalNetworkInterfaces,
        timeout: this.options.dnsTimeout || DNS_TIMEOUT
      };
      if (this.options.localAddress) {
        opts.localAddress = this.options.localAddress;
      }
      let setupConnectionHandlers = () => {
        this._connectionTimeout = setTimeout(() => {
          this._onError("Connection timeout", "ETIMEDOUT", false, "CONN");
        }, this.options.connectionTimeout || CONNECTION_TIMEOUT);
        this._socket.on("error", this._onSocketError);
      };
      if (this.options.connection) {
        this._socket = this.options.connection;
        setupConnectionHandlers();
        if (this.secureConnection && !this.alreadySecured) {
          setImmediate(() => this._upgradeConnection((err) => {
            if (err) {
              this._onError(new Error("Error initiating TLS - " + (err.message || err)), "ETLS", false, "CONN");
              return;
            }
            this._onConnect();
          }));
        } else {
          setImmediate(() => this._onConnect());
        }
        return;
      } else if (this.options.socket) {
        this._socket = this.options.socket;
        return shared.resolveHostname(opts, (err, resolved) => {
          if (err) {
            return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
          }
          this.logger.debug({
            tnx: "dns",
            source: opts.host,
            resolved: resolved.host,
            cached: !!resolved.cached
          }, "Resolved %s as %s [cache %s]", opts.host, resolved.host, resolved.cached ? "hit" : "miss");
          Object.keys(resolved).forEach((key) => {
            if (key.charAt(0) !== "_" && resolved[key]) {
              opts[key] = resolved[key];
            }
          });
          try {
            this._socket.connect(this.port, this.host, () => {
              this._socket.setKeepAlive(true);
              this._onConnect();
            });
            setupConnectionHandlers();
          } catch (E) {
            return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
          }
        });
      } else if (this.secureConnection) {
        if (this.options.tls) {
          Object.keys(this.options.tls).forEach((key) => {
            opts[key] = this.options.tls[key];
          });
        }
        if (this.servername && !opts.servername) {
          opts.servername = this.servername;
        }
        return shared.resolveHostname(opts, (err, resolved) => {
          if (err) {
            return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
          }
          this.logger.debug({
            tnx: "dns",
            source: opts.host,
            resolved: resolved.host,
            cached: !!resolved.cached
          }, "Resolved %s as %s [cache %s]", opts.host, resolved.host, resolved.cached ? "hit" : "miss");
          Object.keys(resolved).forEach((key) => {
            if (key.charAt(0) !== "_" && resolved[key]) {
              opts[key] = resolved[key];
            }
          });
          try {
            this._socket = tls.connect(opts, () => {
              this._socket.setKeepAlive(true);
              this._onConnect();
            });
            setupConnectionHandlers();
          } catch (E) {
            return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
          }
        });
      } else {
        return shared.resolveHostname(opts, (err, resolved) => {
          if (err) {
            return setImmediate(() => this._onError(err, "EDNS", false, "CONN"));
          }
          this.logger.debug({
            tnx: "dns",
            source: opts.host,
            resolved: resolved.host,
            cached: !!resolved.cached
          }, "Resolved %s as %s [cache %s]", opts.host, resolved.host, resolved.cached ? "hit" : "miss");
          Object.keys(resolved).forEach((key) => {
            if (key.charAt(0) !== "_" && resolved[key]) {
              opts[key] = resolved[key];
            }
          });
          try {
            this._socket = net.connect(opts, () => {
              this._socket.setKeepAlive(true);
              this._onConnect();
            });
            setupConnectionHandlers();
          } catch (E) {
            return setImmediate(() => this._onError(E, "ECONNECTION", false, "CONN"));
          }
        });
      }
    }
    quit() {
      this._sendCommand("QUIT");
      this._responseActions.push(this.close);
    }
    close() {
      clearTimeout(this._connectionTimeout);
      clearTimeout(this._greetingTimeout);
      this._responseActions = [];
      if (this._closing) {
        return;
      }
      this._closing = true;
      let closeMethod = "end";
      if (this.stage === "init") {
        closeMethod = "destroy";
      }
      this.logger.debug({
        tnx: "smtp"
      }, 'Closing connection to the server using "%s"', closeMethod);
      let socket = this._socket && this._socket.socket || this._socket;
      if (socket && !socket.destroyed) {
        try {
          socket[closeMethod]();
        } catch (_E) {}
      }
      this._destroy();
    }
    login(authData, callback) {
      const isDestroyedMessage = this._isDestroyedMessage("login");
      if (isDestroyedMessage) {
        return callback(this._formatError(isDestroyedMessage, "ECONNECTION", false, "API"));
      }
      this._auth = authData || {};
      this._authMethod = (this._auth.method || "").toString().trim().toUpperCase() || false;
      if (!this._authMethod && this._auth.oauth2 && !this._auth.credentials) {
        this._authMethod = "XOAUTH2";
      } else if (!this._authMethod || this._authMethod === "XOAUTH2" && !this._auth.oauth2) {
        this._authMethod = (this._supportedAuth[0] || "PLAIN").toUpperCase().trim();
      }
      if (this._authMethod !== "XOAUTH2" && (!this._auth.credentials || !this._auth.credentials.user || !this._auth.credentials.pass)) {
        if (this._auth.user && this._auth.pass || this.customAuth.has(this._authMethod)) {
          this._auth.credentials = {
            user: this._auth.user,
            pass: this._auth.pass,
            options: this._auth.options
          };
        } else {
          return callback(this._formatError('Missing credentials for "' + this._authMethod + '"', "EAUTH", false, "API"));
        }
      }
      if (this.customAuth.has(this._authMethod)) {
        let handler = this.customAuth.get(this._authMethod);
        let lastResponse;
        let returned = false;
        let resolve = () => {
          if (returned) {
            return;
          }
          returned = true;
          this.logger.info({
            tnx: "smtp",
            username: this._auth.user,
            action: "authenticated",
            method: this._authMethod
          }, "User %s authenticated", JSON.stringify(this._auth.user));
          this.authenticated = true;
          callback(null, true);
        };
        let reject = (err) => {
          if (returned) {
            return;
          }
          returned = true;
          callback(this._formatError(err, "EAUTH", lastResponse, "AUTH " + this._authMethod));
        };
        let handlerResponse = handler({
          auth: this._auth,
          method: this._authMethod,
          extensions: [].concat(this._supportedExtensions),
          authMethods: [].concat(this._supportedAuth),
          maxAllowedSize: this._maxAllowedSize || false,
          sendCommand: (cmd, done) => {
            let promise;
            if (!done) {
              promise = new Promise((resolve2, reject2) => {
                done = shared.callbackPromise(resolve2, reject2);
              });
            }
            this._responseActions.push((str) => {
              lastResponse = str;
              let codes = str.match(/^(\d+)(?:\s(\d+\.\d+\.\d+))?\s/);
              let data = {
                command: cmd,
                response: str
              };
              if (codes) {
                data.status = Number(codes[1]) || 0;
                if (codes[2]) {
                  data.code = codes[2];
                }
                data.text = str.substr(codes[0].length);
              } else {
                data.text = str;
                data.status = 0;
              }
              done(null, data);
            });
            setImmediate(() => this._sendCommand(cmd));
            return promise;
          },
          resolve,
          reject
        });
        if (handlerResponse && typeof handlerResponse.catch === "function") {
          handlerResponse.then(resolve).catch(reject);
        }
        return;
      }
      switch (this._authMethod) {
        case "XOAUTH2":
          this._handleXOauth2Token(false, callback);
          return;
        case "LOGIN":
          this._responseActions.push((str) => {
            this._actionAUTH_LOGIN_USER(str, callback);
          });
          this._sendCommand("AUTH LOGIN");
          return;
        case "PLAIN":
          this._responseActions.push((str) => {
            this._actionAUTHComplete(str, callback);
          });
          this._sendCommand("AUTH PLAIN " + Buffer.from("\x00" + this._auth.credentials.user + "\x00" + this._auth.credentials.pass, "utf-8").toString("base64"), "AUTH PLAIN " + Buffer.from("\x00" + this._auth.credentials.user + "\x00" + "/* secret */", "utf-8").toString("base64"));
          return;
        case "CRAM-MD5":
          this._responseActions.push((str) => {
            this._actionAUTH_CRAM_MD5(str, callback);
          });
          this._sendCommand("AUTH CRAM-MD5");
          return;
      }
      return callback(this._formatError('Unknown authentication method "' + this._authMethod + '"', "EAUTH", false, "API"));
    }
    send(envelope, message, done) {
      if (!message) {
        return done(this._formatError("Empty message", "EMESSAGE", false, "API"));
      }
      const isDestroyedMessage = this._isDestroyedMessage("send message");
      if (isDestroyedMessage) {
        return done(this._formatError(isDestroyedMessage, "ECONNECTION", false, "API"));
      }
      if (this._maxAllowedSize && envelope.size > this._maxAllowedSize) {
        return setImmediate(() => {
          done(this._formatError("Message size larger than allowed " + this._maxAllowedSize, "EMESSAGE", false, "MAIL FROM"));
        });
      }
      let returned = false;
      let callback = function() {
        if (returned) {
          return;
        }
        returned = true;
        done(...arguments);
      };
      if (typeof message.on === "function") {
        message.on("error", (err) => callback(this._formatError(err, "ESTREAM", false, "API")));
      }
      let startTime = Date.now();
      this._setEnvelope(envelope, (err, info) => {
        if (err) {
          let stream2 = new PassThrough;
          if (typeof message.pipe === "function") {
            message.pipe(stream2);
          } else {
            stream2.write(message);
            stream2.end();
          }
          return callback(err);
        }
        let envelopeTime = Date.now();
        let stream = this._createSendStream((err2, str) => {
          if (err2) {
            return callback(err2);
          }
          info.envelopeTime = envelopeTime - startTime;
          info.messageTime = Date.now() - envelopeTime;
          info.messageSize = stream.outByteCount;
          info.response = str;
          return callback(null, info);
        });
        if (typeof message.pipe === "function") {
          message.pipe(stream);
        } else {
          stream.write(message);
          stream.end();
        }
      });
    }
    reset(callback) {
      this._sendCommand("RSET");
      this._responseActions.push((str) => {
        if (str.charAt(0) !== "2") {
          return callback(this._formatError("Could not reset session state. response=" + str, "EPROTOCOL", str, "RSET"));
        }
        this._envelope = false;
        return callback(null, true);
      });
    }
    _onConnect() {
      clearTimeout(this._connectionTimeout);
      this.logger.info({
        tnx: "network",
        localAddress: this._socket.localAddress,
        localPort: this._socket.localPort,
        remoteAddress: this._socket.remoteAddress,
        remotePort: this._socket.remotePort
      }, "%s established to %s:%s", this.secure ? "Secure connection" : "Connection", this._socket.remoteAddress, this._socket.remotePort);
      if (this._destroyed) {
        this.close();
        return;
      }
      this.stage = "connected";
      this._socket.removeListener("data", this._onSocketData);
      this._socket.removeListener("timeout", this._onSocketTimeout);
      this._socket.removeListener("close", this._onSocketClose);
      this._socket.removeListener("end", this._onSocketEnd);
      this._socket.on("data", this._onSocketData);
      this._socket.once("close", this._onSocketClose);
      this._socket.once("end", this._onSocketEnd);
      this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
      this._socket.on("timeout", this._onSocketTimeout);
      this._greetingTimeout = setTimeout(() => {
        if (this._socket && !this._destroyed && this._responseActions[0] === this._actionGreeting) {
          this._onError("Greeting never received", "ETIMEDOUT", false, "CONN");
        }
      }, this.options.greetingTimeout || GREETING_TIMEOUT);
      this._responseActions.push(this._actionGreeting);
      this._socket.resume();
    }
    _onData(chunk) {
      if (this._destroyed || !chunk || !chunk.length) {
        return;
      }
      let data = (chunk || "").toString("binary");
      let lines = (this._remainder + data).split(/\r?\n/);
      let lastline;
      this._remainder = lines.pop();
      for (let i = 0, len = lines.length;i < len; i++) {
        if (this._responseQueue.length) {
          lastline = this._responseQueue[this._responseQueue.length - 1];
          if (/^\d+-/.test(lastline.split(`
`).pop())) {
            this._responseQueue[this._responseQueue.length - 1] += `
` + lines[i];
            continue;
          }
        }
        this._responseQueue.push(lines[i]);
      }
      if (this._responseQueue.length) {
        lastline = this._responseQueue[this._responseQueue.length - 1];
        if (/^\d+-/.test(lastline.split(`
`).pop())) {
          return;
        }
      }
      this._processResponse();
    }
    _onError(err, type, data, command) {
      clearTimeout(this._connectionTimeout);
      clearTimeout(this._greetingTimeout);
      if (this._destroyed) {
        return;
      }
      err = this._formatError(err, type, data, command);
      this.logger.error(data, err.message);
      this.emit("error", err);
      this.close();
    }
    _formatError(message, type, response, command) {
      let err;
      if (/Error\]$/i.test(Object.prototype.toString.call(message))) {
        err = message;
      } else {
        err = new Error(message);
      }
      if (type && type !== "Error") {
        err.code = type;
      }
      if (response) {
        err.response = response;
        err.message += ": " + response;
      }
      let responseCode = typeof response === "string" && Number((response.match(/^\d+/) || [])[0]) || false;
      if (responseCode) {
        err.responseCode = responseCode;
      }
      if (command) {
        err.command = command;
      }
      return err;
    }
    _onClose() {
      let serverResponse = false;
      if (this._remainder && this._remainder.trim()) {
        if (this.options.debug || this.options.transactionLog) {
          this.logger.debug({
            tnx: "server"
          }, this._remainder.replace(/\r?\n$/, ""));
        }
        this.lastServerResponse = serverResponse = this._remainder.trim();
      }
      this.logger.info({
        tnx: "network"
      }, "Connection closed");
      if (this.upgrading && !this._destroyed) {
        return this._onError(new Error("Connection closed unexpectedly"), "ETLS", serverResponse, "CONN");
      } else if (![this._actionGreeting, this.close].includes(this._responseActions[0]) && !this._destroyed) {
        return this._onError(new Error("Connection closed unexpectedly"), "ECONNECTION", serverResponse, "CONN");
      } else if (/^[45]\d{2}\b/.test(serverResponse)) {
        return this._onError(new Error("Connection closed unexpectedly"), "ECONNECTION", serverResponse, "CONN");
      }
      this._destroy();
    }
    _onEnd() {
      if (this._socket && !this._socket.destroyed) {
        this._socket.destroy();
      }
    }
    _onTimeout() {
      return this._onError(new Error("Timeout"), "ETIMEDOUT", false, "CONN");
    }
    _destroy() {
      if (this._destroyed) {
        return;
      }
      this._destroyed = true;
      this.emit("end");
    }
    _upgradeConnection(callback) {
      this._socket.removeListener("data", this._onSocketData);
      this._socket.removeListener("timeout", this._onSocketTimeout);
      let socketPlain = this._socket;
      let opts = {
        socket: this._socket,
        host: this.host
      };
      Object.keys(this.options.tls || {}).forEach((key) => {
        opts[key] = this.options.tls[key];
      });
      if (this.servername && !opts.servername) {
        opts.servername = this.servername;
      }
      this.upgrading = true;
      try {
        this._socket = tls.connect(opts, () => {
          this.secure = true;
          this.upgrading = false;
          this._socket.on("data", this._onSocketData);
          socketPlain.removeListener("close", this._onSocketClose);
          socketPlain.removeListener("end", this._onSocketEnd);
          return callback(null, true);
        });
      } catch (err) {
        return callback(err);
      }
      this._socket.on("error", this._onSocketError);
      this._socket.once("close", this._onSocketClose);
      this._socket.once("end", this._onSocketEnd);
      this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
      this._socket.on("timeout", this._onSocketTimeout);
      socketPlain.resume();
    }
    _processResponse() {
      if (!this._responseQueue.length) {
        return false;
      }
      let str = this.lastServerResponse = (this._responseQueue.shift() || "").toString();
      if (/^\d+-/.test(str.split(`
`).pop())) {
        return;
      }
      if (this.options.debug || this.options.transactionLog) {
        this.logger.debug({
          tnx: "server"
        }, str.replace(/\r?\n$/, ""));
      }
      if (!str.trim()) {
        setImmediate(() => this._processResponse());
      }
      let action = this._responseActions.shift();
      if (typeof action === "function") {
        action.call(this, str);
        setImmediate(() => this._processResponse());
      } else {
        return this._onError(new Error("Unexpected Response"), "EPROTOCOL", str, "CONN");
      }
    }
    _sendCommand(str, logStr) {
      if (this._destroyed) {
        return;
      }
      if (this._socket.destroyed) {
        return this.close();
      }
      if (this.options.debug || this.options.transactionLog) {
        this.logger.debug({
          tnx: "client"
        }, (logStr || str || "").toString().replace(/\r?\n$/, ""));
      }
      this._socket.write(Buffer.from(str + `\r
`, "utf-8"));
    }
    _setEnvelope(envelope, callback) {
      let args = [];
      let useSmtpUtf8 = false;
      this._envelope = envelope || {};
      this._envelope.from = (this._envelope.from && this._envelope.from.address || this._envelope.from || "").toString().trim();
      this._envelope.to = [].concat(this._envelope.to || []).map((to) => (to && to.address || to || "").toString().trim());
      if (!this._envelope.to.length) {
        return callback(this._formatError("No recipients defined", "EENVELOPE", false, "API"));
      }
      if (this._envelope.from && /[\r\n<>]/.test(this._envelope.from)) {
        return callback(this._formatError("Invalid sender " + JSON.stringify(this._envelope.from), "EENVELOPE", false, "API"));
      }
      if (/[\x80-\uFFFF]/.test(this._envelope.from)) {
        useSmtpUtf8 = true;
      }
      for (let i = 0, len = this._envelope.to.length;i < len; i++) {
        if (!this._envelope.to[i] || /[\r\n<>]/.test(this._envelope.to[i])) {
          return callback(this._formatError("Invalid recipient " + JSON.stringify(this._envelope.to[i]), "EENVELOPE", false, "API"));
        }
        if (/[\x80-\uFFFF]/.test(this._envelope.to[i])) {
          useSmtpUtf8 = true;
        }
      }
      this._envelope.rcptQueue = JSON.parse(JSON.stringify(this._envelope.to || []));
      this._envelope.rejected = [];
      this._envelope.rejectedErrors = [];
      this._envelope.accepted = [];
      if (this._envelope.dsn) {
        try {
          this._envelope.dsn = this._setDsnEnvelope(this._envelope.dsn);
        } catch (err) {
          return callback(this._formatError("Invalid DSN " + err.message, "EENVELOPE", false, "API"));
        }
      }
      this._responseActions.push((str) => {
        this._actionMAIL(str, callback);
      });
      if (useSmtpUtf8 && this._supportedExtensions.includes("SMTPUTF8")) {
        args.push("SMTPUTF8");
        this._usingSmtpUtf8 = true;
      }
      if (this._envelope.use8BitMime && this._supportedExtensions.includes("8BITMIME")) {
        args.push("BODY=8BITMIME");
        this._using8BitMime = true;
      }
      if (this._envelope.size && this._supportedExtensions.includes("SIZE")) {
        args.push("SIZE=" + this._envelope.size);
      }
      if (this._envelope.dsn && this._supportedExtensions.includes("DSN")) {
        if (this._envelope.dsn.ret) {
          args.push("RET=" + shared.encodeXText(this._envelope.dsn.ret));
        }
        if (this._envelope.dsn.envid) {
          args.push("ENVID=" + shared.encodeXText(this._envelope.dsn.envid));
        }
      }
      if (this._envelope.requireTLSExtensionEnabled) {
        if (!this.secure) {
          return callback(this._formatError("REQUIRETLS can only be used over TLS connections (RFC 8689)", "EREQUIRETLS", false, "MAIL FROM"));
        }
        if (!this._supportedExtensions.includes("REQUIRETLS")) {
          return callback(this._formatError("Server does not support REQUIRETLS extension (RFC 8689)", "EREQUIRETLS", false, "MAIL FROM"));
        }
        args.push("REQUIRETLS");
      }
      this._sendCommand("MAIL FROM:<" + this._envelope.from + ">" + (args.length ? " " + args.join(" ") : ""));
    }
    _setDsnEnvelope(params) {
      let ret = (params.ret || params.return || "").toString().toUpperCase() || null;
      if (ret) {
        switch (ret) {
          case "HDRS":
          case "HEADERS":
            ret = "HDRS";
            break;
          case "FULL":
          case "BODY":
            ret = "FULL";
            break;
        }
      }
      if (ret && !["FULL", "HDRS"].includes(ret)) {
        throw new Error("ret: " + JSON.stringify(ret));
      }
      let envid = (params.envid || params.id || "").toString() || null;
      let notify = params.notify || null;
      if (notify) {
        if (typeof notify === "string") {
          notify = notify.split(",");
        }
        notify = notify.map((n) => n.trim().toUpperCase());
        let validNotify = ["NEVER", "SUCCESS", "FAILURE", "DELAY"];
        let invalidNotify = notify.filter((n) => !validNotify.includes(n));
        if (invalidNotify.length || notify.length > 1 && notify.includes("NEVER")) {
          throw new Error("notify: " + JSON.stringify(notify.join(",")));
        }
        notify = notify.join(",");
      }
      let orcpt = (params.recipient || params.orcpt || "").toString() || null;
      if (orcpt && orcpt.indexOf(";") < 0) {
        orcpt = "rfc822;" + orcpt;
      }
      return {
        ret,
        envid,
        notify,
        orcpt
      };
    }
    _getDsnRcptToArgs() {
      let args = [];
      if (this._envelope.dsn && this._supportedExtensions.includes("DSN")) {
        if (this._envelope.dsn.notify) {
          args.push("NOTIFY=" + shared.encodeXText(this._envelope.dsn.notify));
        }
        if (this._envelope.dsn.orcpt) {
          args.push("ORCPT=" + shared.encodeXText(this._envelope.dsn.orcpt));
        }
      }
      return args.length ? " " + args.join(" ") : "";
    }
    _createSendStream(callback) {
      let dataStream = new DataStream;
      let logStream;
      if (this.options.lmtp) {
        this._envelope.accepted.forEach((recipient, i) => {
          let final = i === this._envelope.accepted.length - 1;
          this._responseActions.push((str) => {
            this._actionLMTPStream(recipient, final, str, callback);
          });
        });
      } else {
        this._responseActions.push((str) => {
          this._actionSMTPStream(str, callback);
        });
      }
      dataStream.pipe(this._socket, {
        end: false
      });
      if (this.options.debug) {
        logStream = new PassThrough;
        logStream.on("readable", () => {
          let chunk;
          while (chunk = logStream.read()) {
            this.logger.debug({
              tnx: "message"
            }, chunk.toString("binary").replace(/\r?\n$/, ""));
          }
        });
        dataStream.pipe(logStream);
      }
      dataStream.once("end", () => {
        this.logger.info({
          tnx: "message",
          inByteCount: dataStream.inByteCount,
          outByteCount: dataStream.outByteCount
        }, "<%s bytes encoded mime message (source size %s bytes)>", dataStream.outByteCount, dataStream.inByteCount);
      });
      return dataStream;
    }
    _actionGreeting(str) {
      clearTimeout(this._greetingTimeout);
      if (str.substr(0, 3) !== "220") {
        this._onError(new Error("Invalid greeting. response=" + str), "EPROTOCOL", str, "CONN");
        return;
      }
      if (this.options.lmtp) {
        this._responseActions.push(this._actionLHLO);
        this._sendCommand("LHLO " + this.name);
      } else {
        this._responseActions.push(this._actionEHLO);
        this._sendCommand("EHLO " + this.name);
      }
    }
    _actionLHLO(str) {
      if (str.charAt(0) !== "2") {
        this._onError(new Error("Invalid LHLO. response=" + str), "EPROTOCOL", str, "LHLO");
        return;
      }
      this._actionEHLO(str);
    }
    _actionEHLO(str) {
      let match;
      if (str.substr(0, 3) === "421") {
        this._onError(new Error("Server terminates connection. response=" + str), "ECONNECTION", str, "EHLO");
        return;
      }
      if (str.charAt(0) !== "2") {
        if (this.options.requireTLS) {
          this._onError(new Error("EHLO failed but HELO does not support required STARTTLS. response=" + str), "ECONNECTION", str, "EHLO");
          return;
        }
        this._responseActions.push(this._actionHELO);
        this._sendCommand("HELO " + this.name);
        return;
      }
      this._ehloLines = str.split(/\r?\n/).map((line) => line.replace(/^\d+[ -]/, "").trim()).filter((line) => line).slice(1);
      if (!this.secure && !this.options.ignoreTLS && (/[ -]STARTTLS\b/im.test(str) || this.options.requireTLS)) {
        this._sendCommand("STARTTLS");
        this._responseActions.push(this._actionSTARTTLS);
        return;
      }
      if (/[ -]SMTPUTF8\b/im.test(str)) {
        this._supportedExtensions.push("SMTPUTF8");
      }
      if (/[ -]DSN\b/im.test(str)) {
        this._supportedExtensions.push("DSN");
      }
      if (/[ -]8BITMIME\b/im.test(str)) {
        this._supportedExtensions.push("8BITMIME");
      }
      if (/[ -]REQUIRETLS\b/im.test(str)) {
        this._supportedExtensions.push("REQUIRETLS");
      }
      if (/[ -]PIPELINING\b/im.test(str)) {
        this._supportedExtensions.push("PIPELINING");
      }
      if (/[ -]AUTH\b/i.test(str)) {
        this.allowsAuth = true;
      }
      if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str)) {
        this._supportedAuth.push("PLAIN");
      }
      if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str)) {
        this._supportedAuth.push("LOGIN");
      }
      if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str)) {
        this._supportedAuth.push("CRAM-MD5");
      }
      if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str)) {
        this._supportedAuth.push("XOAUTH2");
      }
      if (match = str.match(/[ -]SIZE(?:[ \t]+(\d+))?/im)) {
        this._supportedExtensions.push("SIZE");
        this._maxAllowedSize = Number(match[1]) || 0;
      }
      this.emit("connect");
    }
    _actionHELO(str) {
      if (str.charAt(0) !== "2") {
        this._onError(new Error("Invalid HELO. response=" + str), "EPROTOCOL", str, "HELO");
        return;
      }
      this.allowsAuth = true;
      this.emit("connect");
    }
    _actionSTARTTLS(str) {
      if (str.charAt(0) !== "2") {
        if (this.options.opportunisticTLS) {
          this.logger.info({
            tnx: "smtp"
          }, "Failed STARTTLS upgrade, continuing unencrypted");
          return this.emit("connect");
        }
        this._onError(new Error("Error upgrading connection with STARTTLS"), "ETLS", str, "STARTTLS");
        return;
      }
      this._upgradeConnection((err, secured) => {
        if (err) {
          this._onError(new Error("Error initiating TLS - " + (err.message || err)), "ETLS", false, "STARTTLS");
          return;
        }
        this.logger.info({
          tnx: "smtp"
        }, "Connection upgraded with STARTTLS");
        if (secured) {
          if (this.options.lmtp) {
            this._responseActions.push(this._actionLHLO);
            this._sendCommand("LHLO " + this.name);
          } else {
            this._responseActions.push(this._actionEHLO);
            this._sendCommand("EHLO " + this.name);
          }
        } else {
          this.emit("connect");
        }
      });
    }
    _actionAUTH_LOGIN_USER(str, callback) {
      if (!/^334[ -]/.test(str)) {
        callback(this._formatError('Invalid login sequence while waiting for "334 VXNlcm5hbWU6"', "EAUTH", str, "AUTH LOGIN"));
        return;
      }
      this._responseActions.push((str2) => {
        this._actionAUTH_LOGIN_PASS(str2, callback);
      });
      this._sendCommand(Buffer.from(this._auth.credentials.user + "", "utf-8").toString("base64"));
    }
    _actionAUTH_CRAM_MD5(str, callback) {
      let challengeMatch = str.match(/^334\s+(.+)$/);
      let challengeString = "";
      if (!challengeMatch) {
        return callback(this._formatError("Invalid login sequence while waiting for server challenge string", "EAUTH", str, "AUTH CRAM-MD5"));
      } else {
        challengeString = challengeMatch[1];
      }
      let base64decoded = Buffer.from(challengeString, "base64").toString("ascii"), hmacMD5 = crypto.createHmac("md5", this._auth.credentials.pass);
      hmacMD5.update(base64decoded);
      let prepended = this._auth.credentials.user + " " + hmacMD5.digest("hex");
      this._responseActions.push((str2) => {
        this._actionAUTH_CRAM_MD5_PASS(str2, callback);
      });
      this._sendCommand(Buffer.from(prepended).toString("base64"), Buffer.from(this._auth.credentials.user + " /* secret */").toString("base64"));
    }
    _actionAUTH_CRAM_MD5_PASS(str, callback) {
      if (!str.match(/^235\s+/)) {
        return callback(this._formatError('Invalid login sequence while waiting for "235"', "EAUTH", str, "AUTH CRAM-MD5"));
      }
      this.logger.info({
        tnx: "smtp",
        username: this._auth.user,
        action: "authenticated",
        method: this._authMethod
      }, "User %s authenticated", JSON.stringify(this._auth.user));
      this.authenticated = true;
      callback(null, true);
    }
    _actionAUTH_LOGIN_PASS(str, callback) {
      if (!/^334[ -]/.test(str)) {
        return callback(this._formatError('Invalid login sequence while waiting for "334 UGFzc3dvcmQ6"', "EAUTH", str, "AUTH LOGIN"));
      }
      this._responseActions.push((str2) => {
        this._actionAUTHComplete(str2, callback);
      });
      this._sendCommand(Buffer.from((this._auth.credentials.pass || "").toString(), "utf-8").toString("base64"), Buffer.from("/* secret */", "utf-8").toString("base64"));
    }
    _actionAUTHComplete(str, isRetry, callback) {
      if (!callback && typeof isRetry === "function") {
        callback = isRetry;
        isRetry = false;
      }
      if (str.substr(0, 3) === "334") {
        this._responseActions.push((str2) => {
          if (isRetry || this._authMethod !== "XOAUTH2") {
            this._actionAUTHComplete(str2, true, callback);
          } else {
            setImmediate(() => this._handleXOauth2Token(true, callback));
          }
        });
        this._sendCommand("");
        return;
      }
      if (str.charAt(0) !== "2") {
        this.logger.info({
          tnx: "smtp",
          username: this._auth.user,
          action: "authfail",
          method: this._authMethod
        }, "User %s failed to authenticate", JSON.stringify(this._auth.user));
        return callback(this._formatError("Invalid login", "EAUTH", str, "AUTH " + this._authMethod));
      }
      this.logger.info({
        tnx: "smtp",
        username: this._auth.user,
        action: "authenticated",
        method: this._authMethod
      }, "User %s authenticated", JSON.stringify(this._auth.user));
      this.authenticated = true;
      callback(null, true);
    }
    _actionMAIL(str, callback) {
      let message, curRecipient;
      if (Number(str.charAt(0)) !== 2) {
        if (this._usingSmtpUtf8 && /^550 /.test(str) && /[\x80-\uFFFF]/.test(this._envelope.from)) {
          message = "Internationalized mailbox name not allowed";
        } else {
          message = "Mail command failed";
        }
        return callback(this._formatError(message, "EENVELOPE", str, "MAIL FROM"));
      }
      if (!this._envelope.rcptQueue.length) {
        return callback(this._formatError("Can't send mail - no recipients defined", "EENVELOPE", false, "API"));
      } else {
        this._recipientQueue = [];
        if (this._supportedExtensions.includes("PIPELINING")) {
          while (this._envelope.rcptQueue.length) {
            curRecipient = this._envelope.rcptQueue.shift();
            this._recipientQueue.push(curRecipient);
            this._responseActions.push((str2) => {
              this._actionRCPT(str2, callback);
            });
            this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
          }
        } else {
          curRecipient = this._envelope.rcptQueue.shift();
          this._recipientQueue.push(curRecipient);
          this._responseActions.push((str2) => {
            this._actionRCPT(str2, callback);
          });
          this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
        }
      }
    }
    _actionRCPT(str, callback) {
      let message, err, curRecipient = this._recipientQueue.shift();
      if (Number(str.charAt(0)) !== 2) {
        if (this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)) {
          message = "Internationalized mailbox name not allowed";
        } else {
          message = "Recipient command failed";
        }
        this._envelope.rejected.push(curRecipient);
        err = this._formatError(message, "EENVELOPE", str, "RCPT TO");
        err.recipient = curRecipient;
        this._envelope.rejectedErrors.push(err);
      } else {
        this._envelope.accepted.push(curRecipient);
      }
      if (!this._envelope.rcptQueue.length && !this._recipientQueue.length) {
        if (this._envelope.rejected.length < this._envelope.to.length) {
          this._responseActions.push((str2) => {
            this._actionDATA(str2, callback);
          });
          this._sendCommand("DATA");
        } else {
          err = this._formatError("Can't send mail - all recipients were rejected", "EENVELOPE", str, "RCPT TO");
          err.rejected = this._envelope.rejected;
          err.rejectedErrors = this._envelope.rejectedErrors;
          return callback(err);
        }
      } else if (this._envelope.rcptQueue.length) {
        curRecipient = this._envelope.rcptQueue.shift();
        this._recipientQueue.push(curRecipient);
        this._responseActions.push((str2) => {
          this._actionRCPT(str2, callback);
        });
        this._sendCommand("RCPT TO:<" + curRecipient + ">" + this._getDsnRcptToArgs());
      }
    }
    _actionDATA(str, callback) {
      if (!/^[23]/.test(str)) {
        return callback(this._formatError("Data command failed", "EENVELOPE", str, "DATA"));
      }
      let response = {
        accepted: this._envelope.accepted,
        rejected: this._envelope.rejected
      };
      if (this._ehloLines && this._ehloLines.length) {
        response.ehlo = this._ehloLines;
      }
      if (this._envelope.rejectedErrors.length) {
        response.rejectedErrors = this._envelope.rejectedErrors;
      }
      callback(null, response);
    }
    _actionSMTPStream(str, callback) {
      if (Number(str.charAt(0)) !== 2) {
        return callback(this._formatError("Message failed", "EMESSAGE", str, "DATA"));
      } else {
        return callback(null, str);
      }
    }
    _actionLMTPStream(recipient, final, str, callback) {
      let err;
      if (Number(str.charAt(0)) !== 2) {
        err = this._formatError("Message failed for recipient " + recipient, "EMESSAGE", str, "DATA");
        err.recipient = recipient;
        this._envelope.rejected.push(recipient);
        this._envelope.rejectedErrors.push(err);
        for (let i = 0, len = this._envelope.accepted.length;i < len; i++) {
          if (this._envelope.accepted[i] === recipient) {
            this._envelope.accepted.splice(i, 1);
          }
        }
      }
      if (final) {
        return callback(null, str);
      }
    }
    _handleXOauth2Token(isRetry, callback) {
      this._auth.oauth2.getToken(isRetry, (err, accessToken) => {
        if (err) {
          this.logger.info({
            tnx: "smtp",
            username: this._auth.user,
            action: "authfail",
            method: this._authMethod
          }, "User %s failed to authenticate", JSON.stringify(this._auth.user));
          return callback(this._formatError(err, "EAUTH", false, "AUTH XOAUTH2"));
        }
        this._responseActions.push((str) => {
          this._actionAUTHComplete(str, isRetry, callback);
        });
        this._sendCommand("AUTH XOAUTH2 " + this._auth.oauth2.buildXOAuth2Token(accessToken), "AUTH XOAUTH2 " + this._auth.oauth2.buildXOAuth2Token("/* secret */"));
      });
    }
    _isDestroyedMessage(command) {
      if (this._destroyed) {
        return "Cannot " + command + " - smtp connection is already destroyed.";
      }
      if (this._socket) {
        if (this._socket.destroyed) {
          return "Cannot " + command + " - smtp connection socket is already destroyed.";
        }
        if (!this._socket.writable) {
          return "Cannot " + command + " - smtp connection socket is already half-closed.";
        }
      }
    }
    _getHostname() {
      let defaultHostname;
      try {
        defaultHostname = os2.hostname() || "";
      } catch (_err) {
        defaultHostname = "localhost";
      }
      if (!defaultHostname || defaultHostname.indexOf(".") < 0) {
        defaultHostname = "[127.0.0.1]";
      }
      if (defaultHostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        defaultHostname = "[" + defaultHostname + "]";
      }
      return defaultHostname;
    }
  }
  module.exports = SMTPConnection;
});

// node_modules/nodemailer/lib/xoauth2/index.js
var require_xoauth2 = __commonJS((exports, module) => {
  var Stream = __require("stream").Stream;
  var nmfetch = require_fetch();
  var crypto = __require("crypto");
  var shared = require_shared();

  class XOAuth2 extends Stream {
    constructor(options, logger) {
      super();
      this.options = options || {};
      if (options && options.serviceClient) {
        if (!options.privateKey || !options.user) {
          setImmediate(() => this.emit("error", new Error('Options "privateKey" and "user" are required for service account!')));
          return;
        }
        let serviceRequestTimeout = Math.min(Math.max(Number(this.options.serviceRequestTimeout) || 0, 0), 3600);
        this.options.serviceRequestTimeout = serviceRequestTimeout || 5 * 60;
      }
      this.logger = shared.getLogger({
        logger
      }, {
        component: this.options.component || "OAuth2"
      });
      this.provisionCallback = typeof this.options.provisionCallback === "function" ? this.options.provisionCallback : false;
      this.options.accessUrl = this.options.accessUrl || "https://accounts.google.com/o/oauth2/token";
      this.options.customHeaders = this.options.customHeaders || {};
      this.options.customParams = this.options.customParams || {};
      this.accessToken = this.options.accessToken || false;
      if (this.options.expires && Number(this.options.expires)) {
        this.expires = this.options.expires;
      } else {
        let timeout = Math.max(Number(this.options.timeout) || 0, 0);
        this.expires = timeout && Date.now() + timeout * 1000 || 0;
      }
      this.renewing = false;
      this.renewalQueue = [];
    }
    getToken(renew, callback) {
      if (!renew && this.accessToken && (!this.expires || this.expires > Date.now())) {
        this.logger.debug({
          tnx: "OAUTH2",
          user: this.options.user,
          action: "reuse"
        }, "Reusing existing access token for %s", this.options.user);
        return callback(null, this.accessToken);
      }
      if (!this.provisionCallback && !this.options.refreshToken && !this.options.serviceClient) {
        if (this.accessToken) {
          this.logger.debug({
            tnx: "OAUTH2",
            user: this.options.user,
            action: "reuse"
          }, "Reusing existing access token (no refresh capability) for %s", this.options.user);
          return callback(null, this.accessToken);
        }
        this.logger.error({
          tnx: "OAUTH2",
          user: this.options.user,
          action: "renew"
        }, "Cannot renew access token for %s: No refresh mechanism available", this.options.user);
        return callback(new Error("Can't create new access token for user"));
      }
      if (this.renewing) {
        return this.renewalQueue.push({ renew, callback });
      }
      this.renewing = true;
      const generateCallback = (err, accessToken) => {
        this.renewalQueue.forEach((item) => item.callback(err, accessToken));
        this.renewalQueue = [];
        this.renewing = false;
        if (err) {
          this.logger.error({
            err,
            tnx: "OAUTH2",
            user: this.options.user,
            action: "renew"
          }, "Failed generating new Access Token for %s", this.options.user);
        } else {
          this.logger.info({
            tnx: "OAUTH2",
            user: this.options.user,
            action: "renew"
          }, "Generated new Access Token for %s", this.options.user);
        }
        callback(err, accessToken);
      };
      if (this.provisionCallback) {
        this.provisionCallback(this.options.user, !!renew, (err, accessToken, expires) => {
          if (!err && accessToken) {
            this.accessToken = accessToken;
            this.expires = expires || 0;
          }
          generateCallback(err, accessToken);
        });
      } else {
        this.generateToken(generateCallback);
      }
    }
    updateToken(accessToken, timeout) {
      this.accessToken = accessToken;
      timeout = Math.max(Number(timeout) || 0, 0);
      this.expires = timeout && Date.now() + timeout * 1000 || 0;
      this.emit("token", {
        user: this.options.user,
        accessToken: accessToken || "",
        expires: this.expires
      });
    }
    generateToken(callback) {
      let urlOptions;
      let loggedUrlOptions;
      if (this.options.serviceClient) {
        let iat = Math.floor(Date.now() / 1000);
        let tokenData = {
          iss: this.options.serviceClient,
          scope: this.options.scope || "https://mail.google.com/",
          sub: this.options.user,
          aud: this.options.accessUrl,
          iat,
          exp: iat + this.options.serviceRequestTimeout
        };
        let token;
        try {
          token = this.jwtSignRS256(tokenData);
        } catch (_err) {
          return callback(new Error("Can't generate token. Check your auth options"));
        }
        urlOptions = {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: token
        };
        loggedUrlOptions = {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: tokenData
        };
      } else {
        if (!this.options.refreshToken) {
          return callback(new Error("Can't create new access token for user"));
        }
        urlOptions = {
          client_id: this.options.clientId || "",
          client_secret: this.options.clientSecret || "",
          refresh_token: this.options.refreshToken,
          grant_type: "refresh_token"
        };
        loggedUrlOptions = {
          client_id: this.options.clientId || "",
          client_secret: (this.options.clientSecret || "").substr(0, 6) + "...",
          refresh_token: (this.options.refreshToken || "").substr(0, 6) + "...",
          grant_type: "refresh_token"
        };
      }
      Object.keys(this.options.customParams).forEach((key) => {
        urlOptions[key] = this.options.customParams[key];
        loggedUrlOptions[key] = this.options.customParams[key];
      });
      this.logger.debug({
        tnx: "OAUTH2",
        user: this.options.user,
        action: "generate"
      }, "Requesting token using: %s", JSON.stringify(loggedUrlOptions));
      this.postRequest(this.options.accessUrl, urlOptions, this.options, (error, body) => {
        let data;
        if (error) {
          return callback(error);
        }
        try {
          data = JSON.parse(body.toString());
        } catch (E) {
          return callback(E);
        }
        if (!data || typeof data !== "object") {
          this.logger.debug({
            tnx: "OAUTH2",
            user: this.options.user,
            action: "post"
          }, "Response: %s", (body || "").toString());
          return callback(new Error("Invalid authentication response"));
        }
        let logData = {};
        Object.keys(data).forEach((key) => {
          if (key !== "access_token") {
            logData[key] = data[key];
          } else {
            logData[key] = (data[key] || "").toString().substr(0, 6) + "...";
          }
        });
        this.logger.debug({
          tnx: "OAUTH2",
          user: this.options.user,
          action: "post"
        }, "Response: %s", JSON.stringify(logData));
        if (data.error) {
          let errorMessage = data.error;
          if (data.error_description) {
            errorMessage += ": " + data.error_description;
          }
          if (data.error_uri) {
            errorMessage += " (" + data.error_uri + ")";
          }
          return callback(new Error(errorMessage));
        }
        if (data.access_token) {
          this.updateToken(data.access_token, data.expires_in);
          return callback(null, this.accessToken);
        }
        return callback(new Error("No access token"));
      });
    }
    buildXOAuth2Token(accessToken) {
      let authData = ["user=" + (this.options.user || ""), "auth=Bearer " + (accessToken || this.accessToken), "", ""];
      return Buffer.from(authData.join("\x01"), "utf-8").toString("base64");
    }
    postRequest(url, payload, params, callback) {
      let returned = false;
      let chunks = [];
      let chunklen = 0;
      let req = nmfetch(url, {
        method: "post",
        headers: params.customHeaders,
        body: payload,
        allowErrorResponse: true
      });
      req.on("readable", () => {
        let chunk;
        while ((chunk = req.read()) !== null) {
          chunks.push(chunk);
          chunklen += chunk.length;
        }
      });
      req.once("error", (err) => {
        if (returned) {
          return;
        }
        returned = true;
        return callback(err);
      });
      req.once("end", () => {
        if (returned) {
          return;
        }
        returned = true;
        return callback(null, Buffer.concat(chunks, chunklen));
      });
    }
    toBase64URL(data) {
      if (typeof data === "string") {
        data = Buffer.from(data);
      }
      return data.toString("base64").replace(/[=]+/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    jwtSignRS256(payload) {
      payload = ['{"alg":"RS256","typ":"JWT"}', JSON.stringify(payload)].map((val) => this.toBase64URL(val)).join(".");
      let signature = crypto.createSign("RSA-SHA256").update(payload).sign(this.options.privateKey);
      return payload + "." + this.toBase64URL(signature);
    }
  }
  module.exports = XOAuth2;
});

// node_modules/nodemailer/lib/smtp-pool/pool-resource.js
var require_pool_resource = __commonJS((exports, module) => {
  var SMTPConnection = require_smtp_connection();
  var assign = require_shared().assign;
  var XOAuth2 = require_xoauth2();
  var EventEmitter = __require("events");

  class PoolResource extends EventEmitter {
    constructor(pool) {
      super();
      this.pool = pool;
      this.options = pool.options;
      this.logger = this.pool.logger;
      if (this.options.auth) {
        switch ((this.options.auth.type || "").toString().toUpperCase()) {
          case "OAUTH2": {
            let oauth2 = new XOAuth2(this.options.auth, this.logger);
            oauth2.provisionCallback = this.pool.mailer && this.pool.mailer.get("oauth2_provision_cb") || oauth2.provisionCallback;
            this.auth = {
              type: "OAUTH2",
              user: this.options.auth.user,
              oauth2,
              method: "XOAUTH2"
            };
            oauth2.on("token", (token) => this.pool.mailer.emit("token", token));
            oauth2.on("error", (err) => this.emit("error", err));
            break;
          }
          default:
            if (!this.options.auth.user && !this.options.auth.pass) {
              break;
            }
            this.auth = {
              type: (this.options.auth.type || "").toString().toUpperCase() || "LOGIN",
              user: this.options.auth.user,
              credentials: {
                user: this.options.auth.user || "",
                pass: this.options.auth.pass,
                options: this.options.auth.options
              },
              method: (this.options.auth.method || "").trim().toUpperCase() || this.options.authMethod || false
            };
        }
      }
      this._connection = false;
      this._connected = false;
      this.messages = 0;
      this.available = true;
    }
    connect(callback) {
      this.pool.getSocket(this.options, (err, socketOptions) => {
        if (err) {
          return callback(err);
        }
        let returned = false;
        let options = this.options;
        if (socketOptions && socketOptions.connection) {
          this.logger.info({
            tnx: "proxy",
            remoteAddress: socketOptions.connection.remoteAddress,
            remotePort: socketOptions.connection.remotePort,
            destHost: options.host || "",
            destPort: options.port || "",
            action: "connected"
          }, "Using proxied socket from %s:%s to %s:%s", socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || "", options.port || "");
          options = assign(false, options);
          Object.keys(socketOptions).forEach((key) => {
            options[key] = socketOptions[key];
          });
        }
        this.connection = new SMTPConnection(options);
        this.connection.once("error", (err2) => {
          this.emit("error", err2);
          if (returned) {
            return;
          }
          returned = true;
          return callback(err2);
        });
        this.connection.once("end", () => {
          this.close();
          if (returned) {
            return;
          }
          returned = true;
          let timer = setTimeout(() => {
            if (returned) {
              return;
            }
            let err2 = new Error("Unexpected socket close");
            if (this.connection && this.connection._socket && this.connection._socket.upgrading) {
              err2.code = "ETLS";
            }
            callback(err2);
          }, 1000);
          try {
            timer.unref();
          } catch (_E) {}
        });
        this.connection.connect(() => {
          if (returned) {
            return;
          }
          if (this.auth && (this.connection.allowsAuth || options.forceAuth)) {
            this.connection.login(this.auth, (err2) => {
              if (returned) {
                return;
              }
              returned = true;
              if (err2) {
                this.connection.close();
                this.emit("error", err2);
                return callback(err2);
              }
              this._connected = true;
              callback(null, true);
            });
          } else {
            returned = true;
            this._connected = true;
            return callback(null, true);
          }
        });
      });
    }
    send(mail, callback) {
      if (!this._connected) {
        return this.connect((err) => {
          if (err) {
            return callback(err);
          }
          return this.send(mail, callback);
        });
      }
      let envelope = mail.message.getEnvelope();
      let messageId = mail.message.messageId();
      let recipients = [].concat(envelope.to || []);
      if (recipients.length > 3) {
        recipients.push("...and " + recipients.splice(2).length + " more");
      }
      this.logger.info({
        tnx: "send",
        messageId,
        cid: this.id
      }, "Sending message %s using #%s to <%s>", messageId, this.id, recipients.join(", "));
      if (mail.data.dsn) {
        envelope.dsn = mail.data.dsn;
      }
      if (mail.data.requireTLSExtensionEnabled) {
        envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
      }
      this.connection.send(envelope, mail.message.createReadStream(), (err, info) => {
        this.messages++;
        if (err) {
          this.connection.close();
          this.emit("error", err);
          return callback(err);
        }
        info.envelope = {
          from: envelope.from,
          to: envelope.to
        };
        info.messageId = messageId;
        setImmediate(() => {
          let err2;
          if (this.messages >= this.options.maxMessages) {
            err2 = new Error("Resource exhausted");
            err2.code = "EMAXLIMIT";
            this.connection.close();
            this.emit("error", err2);
          } else {
            this.pool._checkRateLimit(() => {
              this.available = true;
              this.emit("available");
            });
          }
        });
        callback(null, info);
      });
    }
    close() {
      this._connected = false;
      if (this.auth && this.auth.oauth2) {
        this.auth.oauth2.removeAllListeners();
      }
      if (this.connection) {
        this.connection.close();
      }
      this.emit("close");
    }
  }
  module.exports = PoolResource;
});

// node_modules/nodemailer/lib/well-known/services.json
var require_services = __commonJS((exports, module) => {
  module.exports = {
    "1und1": {
      description: "1&1 Mail (German hosting provider)",
      host: "smtp.1und1.de",
      port: 465,
      secure: true,
      authMethod: "LOGIN"
    },
    "126": {
      description: "126 Mail (NetEase)",
      host: "smtp.126.com",
      port: 465,
      secure: true
    },
    "163": {
      description: "163 Mail (NetEase)",
      host: "smtp.163.com",
      port: 465,
      secure: true
    },
    Aliyun: {
      description: "Alibaba Cloud Mail",
      domains: ["aliyun.com"],
      host: "smtp.aliyun.com",
      port: 465,
      secure: true
    },
    AliyunQiye: {
      description: "Alibaba Cloud Enterprise Mail",
      host: "smtp.qiye.aliyun.com",
      port: 465,
      secure: true
    },
    AOL: {
      description: "AOL Mail",
      domains: ["aol.com"],
      host: "smtp.aol.com",
      port: 587
    },
    Aruba: {
      description: "Aruba PEC (Italian email provider)",
      domains: ["aruba.it", "pec.aruba.it"],
      aliases: ["Aruba PEC"],
      host: "smtps.aruba.it",
      port: 465,
      secure: true,
      authMethod: "LOGIN"
    },
    Bluewin: {
      description: "Bluewin (Swiss email provider)",
      host: "smtpauths.bluewin.ch",
      domains: ["bluewin.ch"],
      port: 465
    },
    BOL: {
      description: "BOL Mail (Brazilian provider)",
      domains: ["bol.com.br"],
      host: "smtp.bol.com.br",
      port: 587,
      requireTLS: true
    },
    DebugMail: {
      description: "DebugMail (email testing service)",
      host: "debugmail.io",
      port: 25
    },
    Disroot: {
      description: "Disroot (privacy-focused provider)",
      domains: ["disroot.org"],
      host: "disroot.org",
      port: 587,
      secure: false,
      authMethod: "LOGIN"
    },
    DynectEmail: {
      description: "Dyn Email Delivery",
      aliases: ["Dynect"],
      host: "smtp.dynect.net",
      port: 25
    },
    ElasticEmail: {
      description: "Elastic Email",
      aliases: ["Elastic Email"],
      host: "smtp.elasticemail.com",
      port: 465,
      secure: true
    },
    Ethereal: {
      description: "Ethereal Email (email testing service)",
      aliases: ["ethereal.email"],
      host: "smtp.ethereal.email",
      port: 587
    },
    FastMail: {
      description: "FastMail",
      domains: ["fastmail.fm"],
      host: "smtp.fastmail.com",
      port: 465,
      secure: true
    },
    "Feishu Mail": {
      description: "Feishu Mail (Lark)",
      aliases: ["Feishu", "FeishuMail"],
      domains: ["www.feishu.cn"],
      host: "smtp.feishu.cn",
      port: 465,
      secure: true
    },
    "Forward Email": {
      description: "Forward Email (email forwarding service)",
      aliases: ["FE", "ForwardEmail"],
      domains: ["forwardemail.net"],
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true
    },
    GandiMail: {
      description: "Gandi Mail",
      aliases: ["Gandi", "Gandi Mail"],
      host: "mail.gandi.net",
      port: 587
    },
    Gmail: {
      description: "Gmail",
      aliases: ["Google Mail"],
      domains: ["gmail.com", "googlemail.com"],
      host: "smtp.gmail.com",
      port: 465,
      secure: true
    },
    GMX: {
      description: "GMX Mail",
      domains: ["gmx.com", "gmx.net", "gmx.de"],
      host: "mail.gmx.com",
      port: 587
    },
    Godaddy: {
      description: "GoDaddy Email (US)",
      host: "smtpout.secureserver.net",
      port: 25
    },
    GodaddyAsia: {
      description: "GoDaddy Email (Asia)",
      host: "smtp.asia.secureserver.net",
      port: 25
    },
    GodaddyEurope: {
      description: "GoDaddy Email (Europe)",
      host: "smtp.europe.secureserver.net",
      port: 25
    },
    "hot.ee": {
      description: "Hot.ee (Estonian email provider)",
      host: "mail.hot.ee"
    },
    Hotmail: {
      description: "Outlook.com / Hotmail",
      aliases: ["Outlook", "Outlook.com", "Hotmail.com"],
      domains: ["hotmail.com", "outlook.com"],
      host: "smtp-mail.outlook.com",
      port: 587
    },
    iCloud: {
      description: "iCloud Mail",
      aliases: ["Me", "Mac"],
      domains: ["me.com", "mac.com"],
      host: "smtp.mail.me.com",
      port: 587
    },
    Infomaniak: {
      description: "Infomaniak Mail (Swiss hosting provider)",
      host: "mail.infomaniak.com",
      domains: ["ik.me", "ikmail.com", "etik.com"],
      port: 587
    },
    KolabNow: {
      description: "KolabNow (secure email service)",
      domains: ["kolabnow.com"],
      aliases: ["Kolab"],
      host: "smtp.kolabnow.com",
      port: 465,
      secure: true,
      authMethod: "LOGIN"
    },
    Loopia: {
      description: "Loopia (Swedish hosting provider)",
      host: "mailcluster.loopia.se",
      port: 465
    },
    Loops: {
      description: "Loops",
      host: "smtp.loops.so",
      port: 587
    },
    "mail.ee": {
      description: "Mail.ee (Estonian email provider)",
      host: "smtp.mail.ee"
    },
    "Mail.ru": {
      description: "Mail.ru",
      host: "smtp.mail.ru",
      port: 465,
      secure: true
    },
    "Mailcatch.app": {
      description: "Mailcatch (email testing service)",
      host: "sandbox-smtp.mailcatch.app",
      port: 2525
    },
    Maildev: {
      description: "MailDev (local email testing)",
      port: 1025,
      ignoreTLS: true
    },
    MailerSend: {
      description: "MailerSend",
      host: "smtp.mailersend.net",
      port: 587
    },
    Mailgun: {
      description: "Mailgun",
      host: "smtp.mailgun.org",
      port: 465,
      secure: true
    },
    Mailjet: {
      description: "Mailjet",
      host: "in.mailjet.com",
      port: 587
    },
    Mailosaur: {
      description: "Mailosaur (email testing service)",
      host: "mailosaur.io",
      port: 25
    },
    Mailtrap: {
      description: "Mailtrap",
      host: "live.smtp.mailtrap.io",
      port: 587
    },
    Mandrill: {
      description: "Mandrill (by Mailchimp)",
      host: "smtp.mandrillapp.com",
      port: 587
    },
    Naver: {
      description: "Naver Mail (Korean email provider)",
      host: "smtp.naver.com",
      port: 587
    },
    OhMySMTP: {
      description: "OhMySMTP (email delivery service)",
      host: "smtp.ohmysmtp.com",
      port: 587,
      secure: false
    },
    One: {
      description: "One.com Email",
      host: "send.one.com",
      port: 465,
      secure: true
    },
    OpenMailBox: {
      description: "OpenMailBox",
      aliases: ["OMB", "openmailbox.org"],
      host: "smtp.openmailbox.org",
      port: 465,
      secure: true
    },
    Outlook365: {
      description: "Microsoft 365 / Office 365",
      host: "smtp.office365.com",
      port: 587,
      secure: false
    },
    Postmark: {
      description: "Postmark",
      aliases: ["PostmarkApp"],
      host: "smtp.postmarkapp.com",
      port: 2525
    },
    Proton: {
      description: "Proton Mail",
      aliases: ["ProtonMail", "Proton.me", "Protonmail.com", "Protonmail.ch"],
      domains: ["proton.me", "protonmail.com", "pm.me", "protonmail.ch"],
      host: "smtp.protonmail.ch",
      port: 587,
      requireTLS: true
    },
    "qiye.aliyun": {
      description: "Alibaba Mail Enterprise Edition",
      host: "smtp.mxhichina.com",
      port: "465",
      secure: true
    },
    QQ: {
      description: "QQ Mail",
      domains: ["qq.com"],
      host: "smtp.qq.com",
      port: 465,
      secure: true
    },
    QQex: {
      description: "QQ Enterprise Mail",
      aliases: ["QQ Enterprise"],
      domains: ["exmail.qq.com"],
      host: "smtp.exmail.qq.com",
      port: 465,
      secure: true
    },
    Resend: {
      description: "Resend",
      host: "smtp.resend.com",
      port: 465,
      secure: true
    },
    Runbox: {
      description: "Runbox (Norwegian email provider)",
      domains: ["runbox.com"],
      host: "smtp.runbox.com",
      port: 465,
      secure: true
    },
    SendCloud: {
      description: "SendCloud (Chinese email delivery)",
      host: "smtp.sendcloud.net",
      port: 2525
    },
    SendGrid: {
      description: "SendGrid",
      host: "smtp.sendgrid.net",
      port: 587
    },
    SendinBlue: {
      description: "Brevo (formerly Sendinblue)",
      aliases: ["Brevo"],
      host: "smtp-relay.brevo.com",
      port: 587
    },
    SendPulse: {
      description: "SendPulse",
      host: "smtp-pulse.com",
      port: 465,
      secure: true
    },
    SES: {
      description: "AWS SES US East (N. Virginia)",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-NORTHEAST-1": {
      description: "AWS SES Asia Pacific (Tokyo)",
      host: "email-smtp.ap-northeast-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-NORTHEAST-2": {
      description: "AWS SES Asia Pacific (Seoul)",
      host: "email-smtp.ap-northeast-2.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-NORTHEAST-3": {
      description: "AWS SES Asia Pacific (Osaka)",
      host: "email-smtp.ap-northeast-3.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-SOUTH-1": {
      description: "AWS SES Asia Pacific (Mumbai)",
      host: "email-smtp.ap-south-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-SOUTHEAST-1": {
      description: "AWS SES Asia Pacific (Singapore)",
      host: "email-smtp.ap-southeast-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-AP-SOUTHEAST-2": {
      description: "AWS SES Asia Pacific (Sydney)",
      host: "email-smtp.ap-southeast-2.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-CA-CENTRAL-1": {
      description: "AWS SES Canada (Central)",
      host: "email-smtp.ca-central-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-EU-CENTRAL-1": {
      description: "AWS SES Europe (Frankfurt)",
      host: "email-smtp.eu-central-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-EU-NORTH-1": {
      description: "AWS SES Europe (Stockholm)",
      host: "email-smtp.eu-north-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-EU-WEST-1": {
      description: "AWS SES Europe (Ireland)",
      host: "email-smtp.eu-west-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-EU-WEST-2": {
      description: "AWS SES Europe (London)",
      host: "email-smtp.eu-west-2.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-EU-WEST-3": {
      description: "AWS SES Europe (Paris)",
      host: "email-smtp.eu-west-3.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-SA-EAST-1": {
      description: "AWS SES South America (S\xE3o Paulo)",
      host: "email-smtp.sa-east-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-EAST-1": {
      description: "AWS SES US East (N. Virginia)",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-EAST-2": {
      description: "AWS SES US East (Ohio)",
      host: "email-smtp.us-east-2.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-GOV-EAST-1": {
      description: "AWS SES GovCloud (US-East)",
      host: "email-smtp.us-gov-east-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-GOV-WEST-1": {
      description: "AWS SES GovCloud (US-West)",
      host: "email-smtp.us-gov-west-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-WEST-1": {
      description: "AWS SES US West (N. California)",
      host: "email-smtp.us-west-1.amazonaws.com",
      port: 465,
      secure: true
    },
    "SES-US-WEST-2": {
      description: "AWS SES US West (Oregon)",
      host: "email-smtp.us-west-2.amazonaws.com",
      port: 465,
      secure: true
    },
    Seznam: {
      description: "Seznam Email (Czech email provider)",
      aliases: ["Seznam Email"],
      domains: ["seznam.cz", "email.cz", "post.cz", "spoluzaci.cz"],
      host: "smtp.seznam.cz",
      port: 465,
      secure: true
    },
    SMTP2GO: {
      description: "SMTP2GO",
      host: "mail.smtp2go.com",
      port: 2525
    },
    Sparkpost: {
      description: "SparkPost",
      aliases: ["SparkPost", "SparkPost Mail"],
      domains: ["sparkpost.com"],
      host: "smtp.sparkpostmail.com",
      port: 587,
      secure: false
    },
    Tipimail: {
      description: "Tipimail (email delivery service)",
      host: "smtp.tipimail.com",
      port: 587
    },
    Tutanota: {
      description: "Tutanota (Tuta Mail)",
      domains: ["tutanota.com", "tuta.com", "tutanota.de", "tuta.io"],
      host: "smtp.tutanota.com",
      port: 465,
      secure: true
    },
    Yahoo: {
      description: "Yahoo Mail",
      domains: ["yahoo.com"],
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true
    },
    Yandex: {
      description: "Yandex Mail",
      domains: ["yandex.ru"],
      host: "smtp.yandex.ru",
      port: 465,
      secure: true
    },
    Zimbra: {
      description: "Zimbra Mail Server",
      aliases: ["Zimbra Collaboration"],
      host: "smtp.zimbra.com",
      port: 587,
      requireTLS: true
    },
    Zoho: {
      description: "Zoho Mail",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      authMethod: "LOGIN"
    }
  };
});

// node_modules/nodemailer/lib/well-known/index.js
var require_well_known = __commonJS((exports, module) => {
  var services = require_services();
  var normalized = {};
  Object.keys(services).forEach((key) => {
    let service = services[key];
    normalized[normalizeKey(key)] = normalizeService(service);
    [].concat(service.aliases || []).forEach((alias) => {
      normalized[normalizeKey(alias)] = normalizeService(service);
    });
    [].concat(service.domains || []).forEach((domain) => {
      normalized[normalizeKey(domain)] = normalizeService(service);
    });
  });
  function normalizeKey(key) {
    return key.replace(/[^a-zA-Z0-9.-]/g, "").toLowerCase();
  }
  function normalizeService(service) {
    let filter = ["domains", "aliases"];
    let response = {};
    Object.keys(service).forEach((key) => {
      if (filter.indexOf(key) < 0) {
        response[key] = service[key];
      }
    });
    return response;
  }
  module.exports = function(key) {
    key = normalizeKey(key.split("@").pop());
    return normalized[key] || false;
  };
});

// node_modules/nodemailer/lib/smtp-pool/index.js
var require_smtp_pool = __commonJS((exports, module) => {
  var EventEmitter = __require("events");
  var PoolResource = require_pool_resource();
  var SMTPConnection = require_smtp_connection();
  var wellKnown = require_well_known();
  var shared = require_shared();
  var packageData = require_package();

  class SMTPPool extends EventEmitter {
    constructor(options) {
      super();
      options = options || {};
      if (typeof options === "string") {
        options = {
          url: options
        };
      }
      let urlData;
      let service = options.service;
      if (typeof options.getSocket === "function") {
        this.getSocket = options.getSocket;
      }
      if (options.url) {
        urlData = shared.parseConnectionUrl(options.url);
        service = service || urlData.service;
      }
      this.options = shared.assign(false, options, urlData, service && wellKnown(service));
      this.options.maxConnections = this.options.maxConnections || 5;
      this.options.maxMessages = this.options.maxMessages || 100;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "smtp-pool"
      });
      let connection = new SMTPConnection(this.options);
      this.name = "SMTP (pool)";
      this.version = packageData.version + "[client:" + connection.version + "]";
      this._rateLimit = {
        counter: 0,
        timeout: null,
        waiting: [],
        checkpoint: false,
        delta: Number(this.options.rateDelta) || 1000,
        limit: Number(this.options.rateLimit) || 0
      };
      this._closed = false;
      this._queue = [];
      this._connections = [];
      this._connectionCounter = 0;
      this.idling = true;
      setImmediate(() => {
        if (this.idling) {
          this.emit("idle");
        }
      });
    }
    getSocket(options, callback) {
      return setImmediate(() => callback(null, false));
    }
    send(mail, callback) {
      if (this._closed) {
        return false;
      }
      this._queue.push({
        mail,
        requeueAttempts: 0,
        callback
      });
      if (this.idling && this._queue.length >= this.options.maxConnections) {
        this.idling = false;
      }
      setImmediate(() => this._processMessages());
      return true;
    }
    close() {
      let connection;
      let len = this._connections.length;
      this._closed = true;
      clearTimeout(this._rateLimit.timeout);
      if (!len && !this._queue.length) {
        return;
      }
      for (let i = len - 1;i >= 0; i--) {
        if (this._connections[i] && this._connections[i].available) {
          connection = this._connections[i];
          connection.close();
          this.logger.info({
            tnx: "connection",
            cid: connection.id,
            action: "removed"
          }, "Connection #%s removed", connection.id);
        }
      }
      if (len && !this._connections.length) {
        this.logger.debug({
          tnx: "connection"
        }, "All connections removed");
      }
      if (!this._queue.length) {
        return;
      }
      let invokeCallbacks = () => {
        if (!this._queue.length) {
          this.logger.debug({
            tnx: "connection"
          }, "Pending queue entries cleared");
          return;
        }
        let entry = this._queue.shift();
        if (entry && typeof entry.callback === "function") {
          try {
            entry.callback(new Error("Connection pool was closed"));
          } catch (E) {
            this.logger.error({
              err: E,
              tnx: "callback",
              cid: connection.id
            }, "Callback error for #%s: %s", connection.id, E.message);
          }
        }
        setImmediate(invokeCallbacks);
      };
      setImmediate(invokeCallbacks);
    }
    _processMessages() {
      let connection;
      let i, len;
      if (this._closed) {
        return;
      }
      if (!this._queue.length) {
        if (!this.idling) {
          this.idling = true;
          this.emit("idle");
        }
        return;
      }
      for (i = 0, len = this._connections.length;i < len; i++) {
        if (this._connections[i].available) {
          connection = this._connections[i];
          break;
        }
      }
      if (!connection && this._connections.length < this.options.maxConnections) {
        connection = this._createConnection();
      }
      if (!connection) {
        this.idling = false;
        return;
      }
      if (!this.idling && this._queue.length < this.options.maxConnections) {
        this.idling = true;
        this.emit("idle");
      }
      let entry = connection.queueEntry = this._queue.shift();
      entry.messageId = (connection.queueEntry.mail.message.getHeader("message-id") || "").replace(/[<>\s]/g, "");
      connection.available = false;
      this.logger.debug({
        tnx: "pool",
        cid: connection.id,
        messageId: entry.messageId,
        action: "assign"
      }, "Assigned message <%s> to #%s (%s)", entry.messageId, connection.id, connection.messages + 1);
      if (this._rateLimit.limit) {
        this._rateLimit.counter++;
        if (!this._rateLimit.checkpoint) {
          this._rateLimit.checkpoint = Date.now();
        }
      }
      connection.send(entry.mail, (err, info) => {
        if (entry === connection.queueEntry) {
          try {
            entry.callback(err, info);
          } catch (E) {
            this.logger.error({
              err: E,
              tnx: "callback",
              cid: connection.id
            }, "Callback error for #%s: %s", connection.id, E.message);
          }
          connection.queueEntry = false;
        }
      });
    }
    _createConnection() {
      let connection = new PoolResource(this);
      connection.id = ++this._connectionCounter;
      this.logger.info({
        tnx: "pool",
        cid: connection.id,
        action: "conection"
      }, "Created new pool resource #%s", connection.id);
      connection.on("available", () => {
        this.logger.debug({
          tnx: "connection",
          cid: connection.id,
          action: "available"
        }, "Connection #%s became available", connection.id);
        if (this._closed) {
          this.close();
        } else {
          this._processMessages();
        }
      });
      connection.once("error", (err) => {
        if (err.code !== "EMAXLIMIT") {
          this.logger.error({
            err,
            tnx: "pool",
            cid: connection.id
          }, "Pool Error for #%s: %s", connection.id, err.message);
        } else {
          this.logger.debug({
            tnx: "pool",
            cid: connection.id,
            action: "maxlimit"
          }, "Max messages limit exchausted for #%s", connection.id);
        }
        if (connection.queueEntry) {
          try {
            connection.queueEntry.callback(err);
          } catch (E) {
            this.logger.error({
              err: E,
              tnx: "callback",
              cid: connection.id
            }, "Callback error for #%s: %s", connection.id, E.message);
          }
          connection.queueEntry = false;
        }
        this._removeConnection(connection);
        this._continueProcessing();
      });
      connection.once("close", () => {
        this.logger.info({
          tnx: "connection",
          cid: connection.id,
          action: "closed"
        }, "Connection #%s was closed", connection.id);
        this._removeConnection(connection);
        if (connection.queueEntry) {
          setTimeout(() => {
            if (connection.queueEntry) {
              if (this._shouldRequeuOnConnectionClose(connection.queueEntry)) {
                this._requeueEntryOnConnectionClose(connection);
              } else {
                this._failDeliveryOnConnectionClose(connection);
              }
            }
            this._continueProcessing();
          }, 50);
        } else {
          if (!this._closed && this.idling && !this._connections.length) {
            this.emit("clear");
          }
          this._continueProcessing();
        }
      });
      this._connections.push(connection);
      return connection;
    }
    _shouldRequeuOnConnectionClose(queueEntry) {
      if (this.options.maxRequeues === undefined || this.options.maxRequeues < 0) {
        return true;
      }
      return queueEntry.requeueAttempts < this.options.maxRequeues;
    }
    _failDeliveryOnConnectionClose(connection) {
      if (connection.queueEntry && connection.queueEntry.callback) {
        try {
          connection.queueEntry.callback(new Error("Reached maximum number of retries after connection was closed"));
        } catch (E) {
          this.logger.error({
            err: E,
            tnx: "callback",
            messageId: connection.queueEntry.messageId,
            cid: connection.id
          }, "Callback error for #%s: %s", connection.id, E.message);
        }
        connection.queueEntry = false;
      }
    }
    _requeueEntryOnConnectionClose(connection) {
      connection.queueEntry.requeueAttempts = connection.queueEntry.requeueAttempts + 1;
      this.logger.debug({
        tnx: "pool",
        cid: connection.id,
        messageId: connection.queueEntry.messageId,
        action: "requeue"
      }, "Re-queued message <%s> for #%s. Attempt: #%s", connection.queueEntry.messageId, connection.id, connection.queueEntry.requeueAttempts);
      this._queue.unshift(connection.queueEntry);
      connection.queueEntry = false;
    }
    _continueProcessing() {
      if (this._closed) {
        this.close();
      } else {
        setTimeout(() => this._processMessages(), 100);
      }
    }
    _removeConnection(connection) {
      let index = this._connections.indexOf(connection);
      if (index !== -1) {
        this._connections.splice(index, 1);
      }
    }
    _checkRateLimit(callback) {
      if (!this._rateLimit.limit) {
        return callback();
      }
      let now = Date.now();
      if (this._rateLimit.counter < this._rateLimit.limit) {
        return callback();
      }
      this._rateLimit.waiting.push(callback);
      if (this._rateLimit.checkpoint <= now - this._rateLimit.delta) {
        return this._clearRateLimit();
      } else if (!this._rateLimit.timeout) {
        this._rateLimit.timeout = setTimeout(() => this._clearRateLimit(), this._rateLimit.delta - (now - this._rateLimit.checkpoint));
        this._rateLimit.checkpoint = now;
      }
    }
    _clearRateLimit() {
      clearTimeout(this._rateLimit.timeout);
      this._rateLimit.timeout = null;
      this._rateLimit.counter = 0;
      this._rateLimit.checkpoint = false;
      while (this._rateLimit.waiting.length) {
        let cb = this._rateLimit.waiting.shift();
        setImmediate(cb);
      }
    }
    isIdle() {
      return this.idling;
    }
    verify(callback) {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      let auth = new PoolResource(this).auth;
      this.getSocket(this.options, (err, socketOptions) => {
        if (err) {
          return callback(err);
        }
        let options = this.options;
        if (socketOptions && socketOptions.connection) {
          this.logger.info({
            tnx: "proxy",
            remoteAddress: socketOptions.connection.remoteAddress,
            remotePort: socketOptions.connection.remotePort,
            destHost: options.host || "",
            destPort: options.port || "",
            action: "connected"
          }, "Using proxied socket from %s:%s to %s:%s", socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || "", options.port || "");
          options = shared.assign(false, options);
          Object.keys(socketOptions).forEach((key) => {
            options[key] = socketOptions[key];
          });
        }
        let connection = new SMTPConnection(options);
        let returned = false;
        connection.once("error", (err2) => {
          if (returned) {
            return;
          }
          returned = true;
          connection.close();
          return callback(err2);
        });
        connection.once("end", () => {
          if (returned) {
            return;
          }
          returned = true;
          return callback(new Error("Connection closed"));
        });
        let finalize = () => {
          if (returned) {
            return;
          }
          returned = true;
          connection.quit();
          return callback(null, true);
        };
        connection.connect(() => {
          if (returned) {
            return;
          }
          if (auth && (connection.allowsAuth || options.forceAuth)) {
            connection.login(auth, (err2) => {
              if (returned) {
                return;
              }
              if (err2) {
                returned = true;
                connection.close();
                return callback(err2);
              }
              finalize();
            });
          } else if (!auth && connection.allowsAuth && options.forceAuth) {
            let err2 = new Error("Authentication info was not provided");
            err2.code = "NoAuth";
            returned = true;
            connection.close();
            return callback(err2);
          } else {
            finalize();
          }
        });
      });
      return promise;
    }
  }
  module.exports = SMTPPool;
});

// node_modules/nodemailer/lib/smtp-transport/index.js
var require_smtp_transport = __commonJS((exports, module) => {
  var EventEmitter = __require("events");
  var SMTPConnection = require_smtp_connection();
  var wellKnown = require_well_known();
  var shared = require_shared();
  var XOAuth2 = require_xoauth2();
  var packageData = require_package();

  class SMTPTransport extends EventEmitter {
    constructor(options) {
      super();
      options = options || {};
      if (typeof options === "string") {
        options = {
          url: options
        };
      }
      let urlData;
      let service = options.service;
      if (typeof options.getSocket === "function") {
        this.getSocket = options.getSocket;
      }
      if (options.url) {
        urlData = shared.parseConnectionUrl(options.url);
        service = service || urlData.service;
      }
      this.options = shared.assign(false, options, urlData, service && wellKnown(service));
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "smtp-transport"
      });
      let connection = new SMTPConnection(this.options);
      this.name = "SMTP";
      this.version = packageData.version + "[client:" + connection.version + "]";
      if (this.options.auth) {
        this.auth = this.getAuth({});
      }
    }
    getSocket(options, callback) {
      return setImmediate(() => callback(null, false));
    }
    getAuth(authOpts) {
      if (!authOpts) {
        return this.auth;
      }
      let hasAuth = false;
      let authData = {};
      if (this.options.auth && typeof this.options.auth === "object") {
        Object.keys(this.options.auth).forEach((key) => {
          hasAuth = true;
          authData[key] = this.options.auth[key];
        });
      }
      if (authOpts && typeof authOpts === "object") {
        Object.keys(authOpts).forEach((key) => {
          hasAuth = true;
          authData[key] = authOpts[key];
        });
      }
      if (!hasAuth) {
        return false;
      }
      switch ((authData.type || "").toString().toUpperCase()) {
        case "OAUTH2": {
          if (!authData.service && !authData.user) {
            return false;
          }
          let oauth2 = new XOAuth2(authData, this.logger);
          oauth2.provisionCallback = this.mailer && this.mailer.get("oauth2_provision_cb") || oauth2.provisionCallback;
          oauth2.on("token", (token) => this.mailer.emit("token", token));
          oauth2.on("error", (err) => this.emit("error", err));
          return {
            type: "OAUTH2",
            user: authData.user,
            oauth2,
            method: "XOAUTH2"
          };
        }
        default:
          return {
            type: (authData.type || "").toString().toUpperCase() || "LOGIN",
            user: authData.user,
            credentials: {
              user: authData.user || "",
              pass: authData.pass,
              options: authData.options
            },
            method: (authData.method || "").trim().toUpperCase() || this.options.authMethod || false
          };
      }
    }
    send(mail, callback) {
      this.getSocket(this.options, (err, socketOptions) => {
        if (err) {
          return callback(err);
        }
        let returned = false;
        let options = this.options;
        if (socketOptions && socketOptions.connection) {
          this.logger.info({
            tnx: "proxy",
            remoteAddress: socketOptions.connection.remoteAddress,
            remotePort: socketOptions.connection.remotePort,
            destHost: options.host || "",
            destPort: options.port || "",
            action: "connected"
          }, "Using proxied socket from %s:%s to %s:%s", socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || "", options.port || "");
          options = shared.assign(false, options);
          Object.keys(socketOptions).forEach((key) => {
            options[key] = socketOptions[key];
          });
        }
        let connection = new SMTPConnection(options);
        connection.once("error", (err2) => {
          if (returned) {
            return;
          }
          returned = true;
          connection.close();
          return callback(err2);
        });
        connection.once("end", () => {
          if (returned) {
            return;
          }
          let timer = setTimeout(() => {
            if (returned) {
              return;
            }
            returned = true;
            let err2 = new Error("Unexpected socket close");
            if (connection && connection._socket && connection._socket.upgrading) {
              err2.code = "ETLS";
            }
            callback(err2);
          }, 1000);
          try {
            timer.unref();
          } catch (_E) {}
        });
        let sendMessage = () => {
          let envelope = mail.message.getEnvelope();
          let messageId = mail.message.messageId();
          let recipients = [].concat(envelope.to || []);
          if (recipients.length > 3) {
            recipients.push("...and " + recipients.splice(2).length + " more");
          }
          if (mail.data.dsn) {
            envelope.dsn = mail.data.dsn;
          }
          if (mail.data.requireTLSExtensionEnabled) {
            envelope.requireTLSExtensionEnabled = mail.data.requireTLSExtensionEnabled;
          }
          this.logger.info({
            tnx: "send",
            messageId
          }, "Sending message %s to <%s>", messageId, recipients.join(", "));
          connection.send(envelope, mail.message.createReadStream(), (err2, info) => {
            returned = true;
            connection.close();
            if (err2) {
              this.logger.error({
                err: err2,
                tnx: "send"
              }, "Send error for %s: %s", messageId, err2.message);
              return callback(err2);
            }
            info.envelope = {
              from: envelope.from,
              to: envelope.to
            };
            info.messageId = messageId;
            try {
              return callback(null, info);
            } catch (E) {
              this.logger.error({
                err: E,
                tnx: "callback"
              }, "Callback error for %s: %s", messageId, E.message);
            }
          });
        };
        connection.connect(() => {
          if (returned) {
            return;
          }
          let auth = this.getAuth(mail.data.auth);
          if (auth && (connection.allowsAuth || options.forceAuth)) {
            connection.login(auth, (err2) => {
              if (auth && auth !== this.auth && auth.oauth2) {
                auth.oauth2.removeAllListeners();
              }
              if (returned) {
                return;
              }
              if (err2) {
                returned = true;
                connection.close();
                return callback(err2);
              }
              sendMessage();
            });
          } else {
            sendMessage();
          }
        });
      });
    }
    verify(callback) {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      this.getSocket(this.options, (err, socketOptions) => {
        if (err) {
          return callback(err);
        }
        let options = this.options;
        if (socketOptions && socketOptions.connection) {
          this.logger.info({
            tnx: "proxy",
            remoteAddress: socketOptions.connection.remoteAddress,
            remotePort: socketOptions.connection.remotePort,
            destHost: options.host || "",
            destPort: options.port || "",
            action: "connected"
          }, "Using proxied socket from %s:%s to %s:%s", socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || "", options.port || "");
          options = shared.assign(false, options);
          Object.keys(socketOptions).forEach((key) => {
            options[key] = socketOptions[key];
          });
        }
        let connection = new SMTPConnection(options);
        let returned = false;
        connection.once("error", (err2) => {
          if (returned) {
            return;
          }
          returned = true;
          connection.close();
          return callback(err2);
        });
        connection.once("end", () => {
          if (returned) {
            return;
          }
          returned = true;
          return callback(new Error("Connection closed"));
        });
        let finalize = () => {
          if (returned) {
            return;
          }
          returned = true;
          connection.quit();
          return callback(null, true);
        };
        connection.connect(() => {
          if (returned) {
            return;
          }
          let authData = this.getAuth({});
          if (authData && (connection.allowsAuth || options.forceAuth)) {
            connection.login(authData, (err2) => {
              if (returned) {
                return;
              }
              if (err2) {
                returned = true;
                connection.close();
                return callback(err2);
              }
              finalize();
            });
          } else if (!authData && connection.allowsAuth && options.forceAuth) {
            let err2 = new Error("Authentication info was not provided");
            err2.code = "NoAuth";
            returned = true;
            connection.close();
            return callback(err2);
          } else {
            finalize();
          }
        });
      });
      return promise;
    }
    close() {
      if (this.auth && this.auth.oauth2) {
        this.auth.oauth2.removeAllListeners();
      }
      this.emit("close");
    }
  }
  module.exports = SMTPTransport;
});

// node_modules/nodemailer/lib/sendmail-transport/index.js
var require_sendmail_transport = __commonJS((exports, module) => {
  var spawn = __require("child_process").spawn;
  var packageData = require_package();
  var shared = require_shared();

  class SendmailTransport {
    constructor(options) {
      options = options || {};
      this._spawn = spawn;
      this.options = options || {};
      this.name = "Sendmail";
      this.version = packageData.version;
      this.path = "sendmail";
      this.args = false;
      this.winbreak = false;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "sendmail"
      });
      if (options) {
        if (typeof options === "string") {
          this.path = options;
        } else if (typeof options === "object") {
          if (options.path) {
            this.path = options.path;
          }
          if (Array.isArray(options.args)) {
            this.args = options.args;
          }
          this.winbreak = ["win", "windows", "dos", `\r
`].includes((options.newline || "").toString().toLowerCase());
        }
      }
    }
    send(mail, done) {
      mail.message.keepBcc = true;
      let envelope = mail.data.envelope || mail.message.getEnvelope();
      let messageId = mail.message.messageId();
      let args;
      let sendmail;
      let returned;
      const hasInvalidAddresses = [].concat(envelope.from || []).concat(envelope.to || []).some((addr) => /^-/.test(addr));
      if (hasInvalidAddresses) {
        return done(new Error("Can not send mail. Invalid envelope addresses."));
      }
      if (this.args) {
        args = ["-i"].concat(this.args).concat(envelope.to);
      } else {
        args = ["-i"].concat(envelope.from ? ["-f", envelope.from] : []).concat(envelope.to);
      }
      let callback = (err) => {
        if (returned) {
          return;
        }
        returned = true;
        if (typeof done === "function") {
          if (err) {
            return done(err);
          } else {
            return done(null, {
              envelope: mail.data.envelope || mail.message.getEnvelope(),
              messageId,
              response: "Messages queued for delivery"
            });
          }
        }
      };
      try {
        sendmail = this._spawn(this.path, args);
      } catch (E) {
        this.logger.error({
          err: E,
          tnx: "spawn",
          messageId
        }, "Error occurred while spawning sendmail. %s", E.message);
        return callback(E);
      }
      if (sendmail) {
        sendmail.on("error", (err) => {
          this.logger.error({
            err,
            tnx: "spawn",
            messageId
          }, "Error occurred when sending message %s. %s", messageId, err.message);
          callback(err);
        });
        sendmail.once("exit", (code) => {
          if (!code) {
            return callback();
          }
          let err;
          if (code === 127) {
            err = new Error("Sendmail command not found, process exited with code " + code);
          } else {
            err = new Error("Sendmail exited with code " + code);
          }
          this.logger.error({
            err,
            tnx: "stdin",
            messageId
          }, "Error sending message %s to sendmail. %s", messageId, err.message);
          callback(err);
        });
        sendmail.once("close", callback);
        sendmail.stdin.on("error", (err) => {
          this.logger.error({
            err,
            tnx: "stdin",
            messageId
          }, "Error occurred when piping message %s to sendmail. %s", messageId, err.message);
          callback(err);
        });
        let recipients = [].concat(envelope.to || []);
        if (recipients.length > 3) {
          recipients.push("...and " + recipients.splice(2).length + " more");
        }
        this.logger.info({
          tnx: "send",
          messageId
        }, "Sending message %s to <%s>", messageId, recipients.join(", "));
        let sourceStream = mail.message.createReadStream();
        sourceStream.once("error", (err) => {
          this.logger.error({
            err,
            tnx: "stdin",
            messageId
          }, "Error occurred when generating message %s. %s", messageId, err.message);
          sendmail.kill("SIGINT");
          callback(err);
        });
        sourceStream.pipe(sendmail.stdin);
      } else {
        return callback(new Error("sendmail was not found"));
      }
    }
  }
  module.exports = SendmailTransport;
});

// node_modules/nodemailer/lib/stream-transport/index.js
var require_stream_transport = __commonJS((exports, module) => {
  var packageData = require_package();
  var shared = require_shared();

  class StreamTransport {
    constructor(options) {
      options = options || {};
      this.options = options || {};
      this.name = "StreamTransport";
      this.version = packageData.version;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "stream-transport"
      });
      this.winbreak = ["win", "windows", "dos", `\r
`].includes((options.newline || "").toString().toLowerCase());
    }
    send(mail, done) {
      mail.message.keepBcc = true;
      let envelope = mail.data.envelope || mail.message.getEnvelope();
      let messageId = mail.message.messageId();
      let recipients = [].concat(envelope.to || []);
      if (recipients.length > 3) {
        recipients.push("...and " + recipients.splice(2).length + " more");
      }
      this.logger.info({
        tnx: "send",
        messageId
      }, "Sending message %s to <%s> using %s line breaks", messageId, recipients.join(", "), this.winbreak ? "<CR><LF>" : "<LF>");
      setImmediate(() => {
        let stream;
        try {
          stream = mail.message.createReadStream();
        } catch (E) {
          this.logger.error({
            err: E,
            tnx: "send",
            messageId
          }, "Creating send stream failed for %s. %s", messageId, E.message);
          return done(E);
        }
        if (!this.options.buffer) {
          stream.once("error", (err) => {
            this.logger.error({
              err,
              tnx: "send",
              messageId
            }, "Failed creating message for %s. %s", messageId, err.message);
          });
          return done(null, {
            envelope: mail.data.envelope || mail.message.getEnvelope(),
            messageId,
            message: stream
          });
        }
        let chunks = [];
        let chunklen = 0;
        stream.on("readable", () => {
          let chunk;
          while ((chunk = stream.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
          }
        });
        stream.once("error", (err) => {
          this.logger.error({
            err,
            tnx: "send",
            messageId
          }, "Failed creating message for %s. %s", messageId, err.message);
          return done(err);
        });
        stream.on("end", () => done(null, {
          envelope: mail.data.envelope || mail.message.getEnvelope(),
          messageId,
          message: Buffer.concat(chunks, chunklen)
        }));
      });
    }
  }
  module.exports = StreamTransport;
});

// node_modules/nodemailer/lib/json-transport/index.js
var require_json_transport = __commonJS((exports, module) => {
  var packageData = require_package();
  var shared = require_shared();

  class JSONTransport {
    constructor(options) {
      options = options || {};
      this.options = options || {};
      this.name = "JSONTransport";
      this.version = packageData.version;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "json-transport"
      });
    }
    send(mail, done) {
      mail.message.keepBcc = true;
      let envelope = mail.data.envelope || mail.message.getEnvelope();
      let messageId = mail.message.messageId();
      let recipients = [].concat(envelope.to || []);
      if (recipients.length > 3) {
        recipients.push("...and " + recipients.splice(2).length + " more");
      }
      this.logger.info({
        tnx: "send",
        messageId
      }, "Composing JSON structure of %s to <%s>", messageId, recipients.join(", "));
      setImmediate(() => {
        mail.normalize((err, data) => {
          if (err) {
            this.logger.error({
              err,
              tnx: "send",
              messageId
            }, "Failed building JSON structure for %s. %s", messageId, err.message);
            return done(err);
          }
          delete data.envelope;
          delete data.normalizedHeaders;
          return done(null, {
            envelope,
            messageId,
            message: this.options.skipEncoding ? data : JSON.stringify(data)
          });
        });
      });
    }
  }
  module.exports = JSONTransport;
});

// node_modules/nodemailer/lib/ses-transport/index.js
var require_ses_transport = __commonJS((exports, module) => {
  var EventEmitter = __require("events");
  var packageData = require_package();
  var shared = require_shared();
  var LeWindows = require_le_windows();
  var MimeNode = require_mime_node();

  class SESTransport extends EventEmitter {
    constructor(options) {
      super();
      options = options || {};
      this.options = options || {};
      this.ses = this.options.SES;
      this.name = "SESTransport";
      this.version = packageData.version;
      this.logger = shared.getLogger(this.options, {
        component: this.options.component || "ses-transport"
      });
    }
    getRegion(cb) {
      if (this.ses.sesClient.config && typeof this.ses.sesClient.config.region === "function") {
        return this.ses.sesClient.config.region().then((region) => cb(null, region)).catch((err) => cb(err));
      }
      return cb(null, false);
    }
    send(mail, callback) {
      let statObject = {
        ts: Date.now(),
        pending: true
      };
      let fromHeader = mail.message._headers.find((header) => /^from$/i.test(header.key));
      if (fromHeader) {
        let mimeNode = new MimeNode("text/plain");
        fromHeader = mimeNode._convertAddresses(mimeNode._parseAddresses(fromHeader.value));
      }
      let envelope = mail.data.envelope || mail.message.getEnvelope();
      let messageId = mail.message.messageId();
      let recipients = [].concat(envelope.to || []);
      if (recipients.length > 3) {
        recipients.push("...and " + recipients.splice(2).length + " more");
      }
      this.logger.info({
        tnx: "send",
        messageId
      }, "Sending message %s to <%s>", messageId, recipients.join(", "));
      let getRawMessage = (next) => {
        if (!mail.data._dkim) {
          mail.data._dkim = {};
        }
        if (mail.data._dkim.skipFields && typeof mail.data._dkim.skipFields === "string") {
          mail.data._dkim.skipFields += ":date:message-id";
        } else {
          mail.data._dkim.skipFields = "date:message-id";
        }
        let sourceStream = mail.message.createReadStream();
        let stream = sourceStream.pipe(new LeWindows);
        let chunks = [];
        let chunklen = 0;
        stream.on("readable", () => {
          let chunk;
          while ((chunk = stream.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
          }
        });
        sourceStream.once("error", (err) => stream.emit("error", err));
        stream.once("error", (err) => {
          next(err);
        });
        stream.once("end", () => next(null, Buffer.concat(chunks, chunklen)));
      };
      setImmediate(() => getRawMessage((err, raw) => {
        if (err) {
          this.logger.error({
            err,
            tnx: "send",
            messageId
          }, "Failed creating message for %s. %s", messageId, err.message);
          statObject.pending = false;
          return callback(err);
        }
        let sesMessage = {
          Content: {
            Raw: {
              Data: raw
            }
          },
          FromEmailAddress: fromHeader ? fromHeader : envelope.from,
          Destination: {
            ToAddresses: envelope.to
          }
        };
        Object.keys(mail.data.ses || {}).forEach((key) => {
          sesMessage[key] = mail.data.ses[key];
        });
        this.getRegion((err2, region) => {
          if (err2 || !region) {
            region = "us-east-1";
          }
          const command = new this.ses.SendEmailCommand(sesMessage);
          const sendPromise = this.ses.sesClient.send(command);
          sendPromise.then((data) => {
            if (region === "us-east-1") {
              region = "email";
            }
            statObject.pending = true;
            callback(null, {
              envelope: {
                from: envelope.from,
                to: envelope.to
              },
              messageId: "<" + data.MessageId + (!/@/.test(data.MessageId) ? "@" + region + ".amazonses.com" : "") + ">",
              response: data.MessageId,
              raw
            });
          }).catch((err3) => {
            this.logger.error({
              err: err3,
              tnx: "send"
            }, "Send error for %s: %s", messageId, err3.message);
            statObject.pending = false;
            callback(err3);
          });
        });
      }));
    }
    verify(callback) {
      let promise;
      if (!callback) {
        promise = new Promise((resolve, reject) => {
          callback = shared.callbackPromise(resolve, reject);
        });
      }
      const cb = (err) => {
        if (err && !["InvalidParameterValue", "MessageRejected"].includes(err.code || err.Code || err.name)) {
          return callback(err);
        }
        return callback(null, true);
      };
      const sesMessage = {
        Content: {
          Raw: {
            Data: Buffer.from(`From: <invalid@invalid>\r
To: <invalid@invalid>\r
 Subject: Invalid\r
\r
Invalid`)
          }
        },
        FromEmailAddress: "invalid@invalid",
        Destination: {
          ToAddresses: ["invalid@invalid"]
        }
      };
      this.getRegion((err, region) => {
        if (err || !region) {
          region = "us-east-1";
        }
        const command = new this.ses.SendEmailCommand(sesMessage);
        const sendPromise = this.ses.sesClient.send(command);
        sendPromise.then((data) => cb(null, data)).catch((err2) => cb(err2));
      });
      return promise;
    }
  }
  module.exports = SESTransport;
});

// node_modules/nodemailer/lib/nodemailer.js
var require_nodemailer = __commonJS((exports, module) => {
  var Mailer = require_mailer();
  var shared = require_shared();
  var SMTPPool = require_smtp_pool();
  var SMTPTransport = require_smtp_transport();
  var SendmailTransport = require_sendmail_transport();
  var StreamTransport = require_stream_transport();
  var JSONTransport = require_json_transport();
  var SESTransport = require_ses_transport();
  var nmfetch = require_fetch();
  var packageData = require_package();
  var ETHEREAL_API = (process.env.ETHEREAL_API || "https://api.nodemailer.com").replace(/\/+$/, "");
  var ETHEREAL_WEB = (process.env.ETHEREAL_WEB || "https://ethereal.email").replace(/\/+$/, "");
  var ETHEREAL_API_KEY = (process.env.ETHEREAL_API_KEY || "").replace(/\s*/g, "") || null;
  var ETHEREAL_CACHE = ["true", "yes", "y", "1"].includes((process.env.ETHEREAL_CACHE || "yes").toString().trim().toLowerCase());
  var testAccount = false;
  exports.createTransport = function(transporter, defaults) {
    let urlConfig;
    let options;
    let mailer;
    if (typeof transporter === "object" && typeof transporter.send !== "function" || typeof transporter === "string" && /^(smtps?|direct):/i.test(transporter)) {
      if (urlConfig = typeof transporter === "string" ? transporter : transporter.url) {
        options = shared.parseConnectionUrl(urlConfig);
      } else {
        options = transporter;
      }
      if (options.pool) {
        transporter = new SMTPPool(options);
      } else if (options.sendmail) {
        transporter = new SendmailTransport(options);
      } else if (options.streamTransport) {
        transporter = new StreamTransport(options);
      } else if (options.jsonTransport) {
        transporter = new JSONTransport(options);
      } else if (options.SES) {
        if (options.SES.ses && options.SES.aws) {
          let error = new Error("Using legacy SES configuration, expecting @aws-sdk/client-sesv2, see https://nodemailer.com/transports/ses/");
          error.code = "LegacyConfig";
          throw error;
        }
        transporter = new SESTransport(options);
      } else {
        transporter = new SMTPTransport(options);
      }
    }
    mailer = new Mailer(transporter, options, defaults);
    return mailer;
  };
  exports.createTestAccount = function(apiUrl, callback) {
    let promise;
    if (!callback && typeof apiUrl === "function") {
      callback = apiUrl;
      apiUrl = false;
    }
    if (!callback) {
      promise = new Promise((resolve, reject) => {
        callback = shared.callbackPromise(resolve, reject);
      });
    }
    if (ETHEREAL_CACHE && testAccount) {
      setImmediate(() => callback(null, testAccount));
      return promise;
    }
    apiUrl = apiUrl || ETHEREAL_API;
    let chunks = [];
    let chunklen = 0;
    let requestHeaders = {};
    let requestBody = {
      requestor: packageData.name,
      version: packageData.version
    };
    if (ETHEREAL_API_KEY) {
      requestHeaders.Authorization = "Bearer " + ETHEREAL_API_KEY;
    }
    let req = nmfetch(apiUrl + "/user", {
      contentType: "application/json",
      method: "POST",
      headers: requestHeaders,
      body: Buffer.from(JSON.stringify(requestBody))
    });
    req.on("readable", () => {
      let chunk;
      while ((chunk = req.read()) !== null) {
        chunks.push(chunk);
        chunklen += chunk.length;
      }
    });
    req.once("error", (err) => callback(err));
    req.once("end", () => {
      let res = Buffer.concat(chunks, chunklen);
      let data;
      let err;
      try {
        data = JSON.parse(res.toString());
      } catch (E) {
        err = E;
      }
      if (err) {
        return callback(err);
      }
      if (data.status !== "success" || data.error) {
        return callback(new Error(data.error || "Request failed"));
      }
      delete data.status;
      testAccount = data;
      callback(null, testAccount);
    });
    return promise;
  };
  exports.getTestMessageUrl = function(info) {
    if (!info || !info.response) {
      return false;
    }
    let infoProps = new Map;
    info.response.replace(/\[([^\]]+)\]$/, (m, props) => {
      props.replace(/\b([A-Z0-9]+)=([^\s]+)/g, (m2, key, value) => {
        infoProps.set(key, value);
      });
    });
    if (infoProps.has("STATUS") && infoProps.has("MSGID")) {
      return (testAccount.web || ETHEREAL_WEB) + "/message/" + infoProps.get("MSGID");
    }
    return false;
  };
});

// node_modules/node-cron/dist/esm/create-id.js
var require_create_id = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createID = createID;
  var node_crypto_1 = __importDefault(__require("crypto"));
  function createID(prefix = "", length = 16) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = node_crypto_1.default.randomBytes(length);
    const id = Array.from(values, (v) => charset[v % charset.length]).join("");
    return prefix ? `${prefix}-${id}` : id;
  }
});

// node_modules/node-cron/dist/esm/logger.js
var require_logger = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var levelColors = {
    INFO: "\x1B[36m",
    WARN: "\x1B[33m",
    ERROR: "\x1B[31m",
    DEBUG: "\x1B[35m"
  };
  var GREEN = "\x1B[32m";
  var RESET = "\x1B[0m";
  function log(level, message, extra) {
    const timestamp = new Date().toISOString();
    const color = levelColors[level] ?? "";
    const prefix = `[${timestamp}] [PID: ${process.pid}] ${GREEN}[NODE-CRON]${GREEN} ${color}[${level}]${RESET}`;
    const output = `${prefix} ${message}`;
    switch (level) {
      case "ERROR":
        console.error(output, extra ?? "");
        break;
      case "DEBUG":
        console.debug(output, extra ?? "");
        break;
      case "WARN":
        console.warn(output);
        break;
      case "INFO":
      default:
        console.info(output);
        break;
    }
  }
  var logger = {
    info(message) {
      log("INFO", message);
    },
    warn(message) {
      log("WARN", message);
    },
    error(message, err) {
      if (message instanceof Error) {
        log("ERROR", message.message, message);
      } else {
        log("ERROR", message, err);
      }
    },
    debug(message, err) {
      if (message instanceof Error) {
        log("DEBUG", message.message, message);
      } else {
        log("DEBUG", message, err);
      }
    }
  };
  exports.default = logger;
});

// node_modules/node-cron/dist/esm/promise/tracked-promise.js
var require_tracked_promise = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TrackedPromise = undefined;

  class TrackedPromise {
    promise;
    error;
    state;
    value;
    constructor(executor) {
      this.state = "pending";
      this.promise = new Promise((resolve, reject) => {
        executor((value) => {
          this.state = "fulfilled";
          this.value = value;
          resolve(value);
        }, (error) => {
          this.state = "rejected";
          this.error = error;
          reject(error);
        });
      });
    }
    getPromise() {
      return this.promise;
    }
    getState() {
      return this.state;
    }
    isPending() {
      return this.state === "pending";
    }
    isFulfilled() {
      return this.state === "fulfilled";
    }
    isRejected() {
      return this.state === "rejected";
    }
    getValue() {
      return this.value;
    }
    getError() {
      return this.error;
    }
    then(onfulfilled, onrejected) {
      return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.promise.catch(onrejected);
    }
    finally(onfinally) {
      return this.promise.finally(onfinally);
    }
  }
  exports.TrackedPromise = TrackedPromise;
});

// node_modules/node-cron/dist/esm/scheduler/runner.js
var require_runner = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Runner = undefined;
  var create_id_1 = require_create_id();
  var logger_1 = __importDefault(require_logger());
  var tracked_promise_1 = require_tracked_promise();
  function emptyOnFn() {}
  function emptyHookFn() {
    return true;
  }
  function defaultOnError(date, error) {
    logger_1.default.error("Task failed with error!", error);
  }

  class Runner {
    timeMatcher;
    onMatch;
    noOverlap;
    maxExecutions;
    maxRandomDelay;
    runCount;
    running;
    heartBeatTimeout;
    onMissedExecution;
    onOverlap;
    onError;
    beforeRun;
    onFinished;
    onMaxExecutions;
    constructor(timeMatcher, onMatch, options) {
      this.timeMatcher = timeMatcher;
      this.onMatch = onMatch;
      this.noOverlap = options == undefined || options.noOverlap === undefined ? false : options.noOverlap;
      this.maxExecutions = options?.maxExecutions;
      this.maxRandomDelay = options?.maxRandomDelay || 0;
      this.onMissedExecution = options?.onMissedExecution || emptyOnFn;
      this.onOverlap = options?.onOverlap || emptyOnFn;
      this.onError = options?.onError || defaultOnError;
      this.onFinished = options?.onFinished || emptyHookFn;
      this.beforeRun = options?.beforeRun || emptyHookFn;
      this.onMaxExecutions = options?.onMaxExecutions || emptyOnFn;
      this.runCount = 0;
      this.running = false;
    }
    start() {
      this.running = true;
      let lastExecution;
      let expectedNextExecution;
      const scheduleNextHeartBeat = (currentDate) => {
        if (this.running) {
          clearTimeout(this.heartBeatTimeout);
          this.heartBeatTimeout = setTimeout(heartBeat, getDelay(this.timeMatcher, currentDate));
        }
      };
      const runTask = (date) => {
        return new Promise(async (resolve) => {
          const execution = {
            id: (0, create_id_1.createID)("exec"),
            reason: "scheduled"
          };
          const shouldExecute = await this.beforeRun(date, execution);
          const randomDelay = Math.floor(Math.random() * this.maxRandomDelay);
          if (shouldExecute) {
            setTimeout(async () => {
              try {
                this.runCount++;
                execution.startedAt = new Date;
                const result = await this.onMatch(date, execution);
                execution.finishedAt = new Date;
                execution.result = result;
                this.onFinished(date, execution);
                if (this.maxExecutions && this.runCount >= this.maxExecutions) {
                  this.onMaxExecutions(date);
                  this.stop();
                }
              } catch (error) {
                execution.finishedAt = new Date;
                execution.error = error;
                this.onError(date, error, execution);
              }
              resolve(true);
            }, randomDelay);
          }
        });
      };
      const checkAndRun = (date) => {
        return new tracked_promise_1.TrackedPromise(async (resolve, reject) => {
          try {
            if (this.timeMatcher.match(date)) {
              await runTask(date);
            }
            resolve(true);
          } catch (err) {
            reject(err);
          }
        });
      };
      const heartBeat = async () => {
        const currentDate = nowWithoutMs();
        if (expectedNextExecution && expectedNextExecution.getTime() < currentDate.getTime()) {
          while (expectedNextExecution.getTime() < currentDate.getTime()) {
            logger_1.default.warn(`missed execution at ${expectedNextExecution}! Possible blocking IO or high CPU user at the same process used by node-cron.`);
            expectedNextExecution = this.timeMatcher.getNextMatch(expectedNextExecution);
            runAsync(this.onMissedExecution, expectedNextExecution, defaultOnError);
          }
        }
        if (lastExecution && lastExecution.getState() === "pending") {
          runAsync(this.onOverlap, currentDate, defaultOnError);
          if (this.noOverlap) {
            logger_1.default.warn("task still running, new execution blocked by overlap prevention!");
            expectedNextExecution = this.timeMatcher.getNextMatch(currentDate);
            scheduleNextHeartBeat(currentDate);
            return;
          }
        }
        lastExecution = checkAndRun(currentDate);
        expectedNextExecution = this.timeMatcher.getNextMatch(currentDate);
        scheduleNextHeartBeat(currentDate);
      };
      this.heartBeatTimeout = setTimeout(() => {
        heartBeat();
      }, getDelay(this.timeMatcher, nowWithoutMs()));
    }
    nextRun() {
      return this.timeMatcher.getNextMatch(new Date);
    }
    stop() {
      this.running = false;
      if (this.heartBeatTimeout) {
        clearTimeout(this.heartBeatTimeout);
        this.heartBeatTimeout = undefined;
      }
    }
    isStarted() {
      return !!this.heartBeatTimeout && this.running;
    }
    isStopped() {
      return !this.isStarted();
    }
    async execute() {
      const date = new Date;
      const execution = {
        id: (0, create_id_1.createID)("exec"),
        reason: "invoked"
      };
      try {
        const shouldExecute = await this.beforeRun(date, execution);
        if (shouldExecute) {
          this.runCount++;
          execution.startedAt = new Date;
          const result = await this.onMatch(date, execution);
          execution.finishedAt = new Date;
          execution.result = result;
          this.onFinished(date, execution);
        }
      } catch (error) {
        execution.finishedAt = new Date;
        execution.error = error;
        this.onError(date, error, execution);
      }
    }
  }
  exports.Runner = Runner;
  async function runAsync(fn, date, onError) {
    try {
      await fn(date);
    } catch (error) {
      onError(date, error);
    }
  }
  function getDelay(timeMatcher, currentDate) {
    const maxDelay = 86400000;
    const nextRun = timeMatcher.getNextMatch(currentDate);
    const now = new Date;
    const delay = nextRun.getTime() - now.getTime();
    if (delay > maxDelay) {
      return maxDelay;
    }
    return Math.max(0, delay);
  }
  function nowWithoutMs() {
    const date = new Date;
    date.setMilliseconds(0);
    return date;
  }
});

// node_modules/node-cron/dist/esm/pattern/convertion/month-names-conversion.js
var require_month_names_conversion = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = (() => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
    ];
    const shortMonths = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec"
    ];
    function convertMonthName(expression, items) {
      for (let i = 0;i < items.length; i++) {
        expression = expression.replace(new RegExp(items[i], "gi"), i + 1);
      }
      return expression;
    }
    function interprete(monthExpression) {
      monthExpression = convertMonthName(monthExpression, months);
      monthExpression = convertMonthName(monthExpression, shortMonths);
      return monthExpression;
    }
    return interprete;
  })();
});

// node_modules/node-cron/dist/esm/pattern/convertion/week-day-names-conversion.js
var require_week_day_names_conversion = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = (() => {
    const weekDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
    const shortWeekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    function convertWeekDayName(expression, items) {
      for (let i = 0;i < items.length; i++) {
        expression = expression.replace(new RegExp(items[i], "gi"), i);
      }
      return expression;
    }
    function convertWeekDays(expression) {
      expression = expression.replace("7", "0");
      expression = convertWeekDayName(expression, weekDays);
      return convertWeekDayName(expression, shortWeekDays);
    }
    return convertWeekDays;
  })();
});

// node_modules/node-cron/dist/esm/pattern/convertion/asterisk-to-range-conversion.js
var require_asterisk_to_range_conversion = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = (() => {
    function convertAsterisk(expression, replecement) {
      if (expression.indexOf("*") !== -1) {
        return expression.replace("*", replecement);
      }
      return expression;
    }
    function convertAsterisksToRanges(expressions) {
      expressions[0] = convertAsterisk(expressions[0], "0-59");
      expressions[1] = convertAsterisk(expressions[1], "0-59");
      expressions[2] = convertAsterisk(expressions[2], "0-23");
      expressions[3] = convertAsterisk(expressions[3], "1-31");
      expressions[4] = convertAsterisk(expressions[4], "1-12");
      expressions[5] = convertAsterisk(expressions[5], "0-6");
      return expressions;
    }
    return convertAsterisksToRanges;
  })();
});

// node_modules/node-cron/dist/esm/pattern/convertion/range-conversion.js
var require_range_conversion = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = (() => {
    function replaceWithRange(expression, text, init, end, stepTxt) {
      const step = parseInt(stepTxt);
      const numbers = [];
      let last = parseInt(end);
      let first = parseInt(init);
      if (first > last) {
        last = parseInt(init);
        first = parseInt(end);
      }
      for (let i = first;i <= last; i += step) {
        numbers.push(i);
      }
      return expression.replace(new RegExp(text, "i"), numbers.join());
    }
    function convertRange(expression) {
      const rangeRegEx = /(\d+)-(\d+)(\/(\d+)|)/;
      let match = rangeRegEx.exec(expression);
      while (match !== null && match.length > 0) {
        expression = replaceWithRange(expression, match[0], match[1], match[2], match[4] || "1");
        match = rangeRegEx.exec(expression);
      }
      return expression;
    }
    function convertAllRanges(expressions) {
      for (let i = 0;i < expressions.length; i++) {
        expressions[i] = convertRange(expressions[i]);
      }
      return expressions;
    }
    return convertAllRanges;
  })();
});

// node_modules/node-cron/dist/esm/pattern/convertion/index.js
var require_convertion = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var month_names_conversion_1 = __importDefault(require_month_names_conversion());
  var week_day_names_conversion_1 = __importDefault(require_week_day_names_conversion());
  var asterisk_to_range_conversion_1 = __importDefault(require_asterisk_to_range_conversion());
  var range_conversion_1 = __importDefault(require_range_conversion());
  exports.default = (() => {
    function appendSeccondExpression(expressions) {
      if (expressions.length === 5) {
        return ["0"].concat(expressions);
      }
      return expressions;
    }
    function removeSpaces(str) {
      return str.replace(/\s{2,}/g, " ").trim();
    }
    function normalizeIntegers(expressions) {
      for (let i = 0;i < expressions.length; i++) {
        const numbers = expressions[i].split(",");
        for (let j = 0;j < numbers.length; j++) {
          numbers[j] = parseInt(numbers[j]);
        }
        expressions[i] = numbers;
      }
      return expressions;
    }
    function interprete(expression) {
      let expressions = removeSpaces(`${expression}`).split(" ");
      expressions = appendSeccondExpression(expressions);
      expressions[4] = (0, month_names_conversion_1.default)(expressions[4]);
      expressions[5] = (0, week_day_names_conversion_1.default)(expressions[5]);
      expressions = (0, asterisk_to_range_conversion_1.default)(expressions);
      expressions = (0, range_conversion_1.default)(expressions);
      expressions = normalizeIntegers(expressions);
      return expressions;
    }
    return interprete;
  })();
});

// node_modules/node-cron/dist/esm/time/localized-time.js
var require_localized_time = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LocalizedTime = undefined;

  class LocalizedTime {
    timestamp;
    parts;
    timezone;
    constructor(date, timezone) {
      this.timestamp = date.getTime();
      this.timezone = timezone;
      this.parts = buildDateParts(date, timezone);
    }
    toDate() {
      return new Date(this.timestamp);
    }
    toISO() {
      const gmt = this.parts.gmt.replace(/^GMT/, "");
      const offset = gmt ? gmt : "Z";
      const pad = (n) => String(n).padStart(2, "0");
      return `${this.parts.year}-${pad(this.parts.month)}-${pad(this.parts.day)}` + `T${pad(this.parts.hour)}:${pad(this.parts.minute)}:${pad(this.parts.second)}` + `.${String(this.parts.milisecond).padStart(3, "0")}` + offset;
    }
    getParts() {
      return this.parts;
    }
    set(field, value) {
      this.parts[field] = value;
      const newDate = new Date(this.toISO());
      this.timestamp = newDate.getTime();
      this.parts = buildDateParts(newDate, this.timezone);
    }
  }
  exports.LocalizedTime = LocalizedTime;
  function buildDateParts(date, timezone) {
    const dftOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
      hour12: false
    };
    if (timezone) {
      dftOptions.timeZone = timezone;
    }
    const dateFormat = new Intl.DateTimeFormat("en-US", dftOptions);
    const parts = dateFormat.formatToParts(date).filter((part) => {
      return part.type !== "literal";
    }).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return {
      day: parseInt(parts.day),
      month: parseInt(parts.month),
      year: parseInt(parts.year),
      hour: parts.hour === "24" ? 0 : parseInt(parts.hour),
      minute: parseInt(parts.minute),
      second: parseInt(parts.second),
      milisecond: date.getMilliseconds(),
      weekday: parts.weekday,
      gmt: getTimezoneGMT(date, timezone)
    };
  }
  function getTimezoneGMT(date, timezone) {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    let offsetInMinutes = (utcDate.getTime() - tzDate.getTime()) / 60000;
    const sign = offsetInMinutes <= 0 ? "+" : "-";
    offsetInMinutes = Math.abs(offsetInMinutes);
    if (offsetInMinutes === 0)
      return "Z";
    const hours = Math.floor(offsetInMinutes / 60).toString().padStart(2, "0");
    const minutes = Math.floor(offsetInMinutes % 60).toString().padStart(2, "0");
    return `GMT${sign}${hours}:${minutes}`;
  }
});

// node_modules/node-cron/dist/esm/time/matcher-walker.js
var require_matcher_walker = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MatcherWalker = undefined;
  var convertion_1 = __importDefault(require_convertion());
  var localized_time_1 = require_localized_time();
  var time_matcher_1 = require_time_matcher();
  var week_day_names_conversion_1 = __importDefault(require_week_day_names_conversion());

  class MatcherWalker {
    cronExpression;
    baseDate;
    pattern;
    expressions;
    timeMatcher;
    timezone;
    constructor(cronExpression, baseDate, timezone) {
      this.cronExpression = cronExpression;
      this.baseDate = baseDate;
      this.timeMatcher = new time_matcher_1.TimeMatcher(cronExpression, timezone);
      this.timezone = timezone;
      this.expressions = (0, convertion_1.default)(cronExpression);
    }
    isMatching() {
      return this.timeMatcher.match(this.baseDate);
    }
    matchNext() {
      const findNextDateIgnoringWeekday = () => {
        const baseDate = new Date(this.baseDate.getTime());
        baseDate.setMilliseconds(0);
        const localTime = new localized_time_1.LocalizedTime(baseDate, this.timezone);
        const dateParts = localTime.getParts();
        const date2 = new localized_time_1.LocalizedTime(localTime.toDate(), this.timezone);
        const seconds = this.expressions[0];
        const nextSecond = availableValue(seconds, dateParts.second);
        if (nextSecond) {
          date2.set("second", nextSecond);
          if (this.timeMatcher.match(date2.toDate())) {
            return date2;
          }
        }
        date2.set("second", seconds[0]);
        const minutes = this.expressions[1];
        const nextMinute = availableValue(minutes, dateParts.minute);
        if (nextMinute) {
          date2.set("minute", nextMinute);
          if (this.timeMatcher.match(date2.toDate())) {
            return date2;
          }
        }
        date2.set("minute", minutes[0]);
        const hours = this.expressions[2];
        const nextHour = availableValue(hours, dateParts.hour);
        if (nextHour) {
          date2.set("hour", nextHour);
          if (this.timeMatcher.match(date2.toDate())) {
            return date2;
          }
        }
        date2.set("hour", hours[0]);
        const days = this.expressions[3];
        const nextDay = availableValue(days, dateParts.day);
        if (nextDay) {
          date2.set("day", nextDay);
          if (this.timeMatcher.match(date2.toDate())) {
            return date2;
          }
        }
        date2.set("day", days[0]);
        const months = this.expressions[4];
        const nextMonth = availableValue(months, dateParts.month);
        if (nextMonth) {
          date2.set("month", nextMonth);
          if (this.timeMatcher.match(date2.toDate())) {
            return date2;
          }
        }
        date2.set("year", date2.getParts().year + 1);
        date2.set("month", months[0]);
        return date2;
      };
      const date = findNextDateIgnoringWeekday();
      const weekdays = this.expressions[5];
      let currentWeekday = parseInt((0, week_day_names_conversion_1.default)(date.getParts().weekday));
      while (!(weekdays.indexOf(currentWeekday) > -1)) {
        date.set("year", date.getParts().year + 1);
        currentWeekday = parseInt((0, week_day_names_conversion_1.default)(date.getParts().weekday));
      }
      return date;
    }
  }
  exports.MatcherWalker = MatcherWalker;
  function availableValue(values, currentValue) {
    const availableValues = values.sort((a, b) => a - b).filter((s) => s > currentValue);
    if (availableValues.length > 0)
      return availableValues[0];
    return false;
  }
});

// node_modules/node-cron/dist/esm/time/time-matcher.js
var require_time_matcher = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TimeMatcher = undefined;
  var index_1 = __importDefault(require_convertion());
  var week_day_names_conversion_1 = __importDefault(require_week_day_names_conversion());
  var localized_time_1 = require_localized_time();
  var matcher_walker_1 = require_matcher_walker();
  function matchValue(allowedValues, value) {
    return allowedValues.indexOf(value) !== -1;
  }

  class TimeMatcher {
    timezone;
    pattern;
    expressions;
    constructor(pattern, timezone) {
      this.timezone = timezone;
      this.pattern = pattern;
      this.expressions = (0, index_1.default)(pattern);
    }
    match(date) {
      const localizedTime = new localized_time_1.LocalizedTime(date, this.timezone);
      const parts = localizedTime.getParts();
      const runOnSecond = matchValue(this.expressions[0], parts.second);
      const runOnMinute = matchValue(this.expressions[1], parts.minute);
      const runOnHour = matchValue(this.expressions[2], parts.hour);
      const runOnDay = matchValue(this.expressions[3], parts.day);
      const runOnMonth = matchValue(this.expressions[4], parts.month);
      const runOnWeekDay = matchValue(this.expressions[5], parseInt((0, week_day_names_conversion_1.default)(parts.weekday)));
      return runOnSecond && runOnMinute && runOnHour && runOnDay && runOnMonth && runOnWeekDay;
    }
    getNextMatch(date) {
      const walker = new matcher_walker_1.MatcherWalker(this.pattern, date, this.timezone);
      const next = walker.matchNext();
      return next.toDate();
    }
  }
  exports.TimeMatcher = TimeMatcher;
});

// node_modules/node-cron/dist/esm/tasks/state-machine.js
var require_state_machine = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.StateMachine = undefined;
  var allowedTransitions = {
    stopped: ["stopped", "idle", "destroyed"],
    idle: ["idle", "running", "stopped", "destroyed"],
    running: ["running", "idle", "stopped", "destroyed"],
    destroyed: ["destroyed"]
  };

  class StateMachine {
    state;
    constructor(initial = "stopped") {
      this.state = initial;
    }
    changeState(state) {
      if (allowedTransitions[this.state].includes(state)) {
        this.state = state;
      } else {
        throw new Error(`invalid transition from ${this.state} to ${state}`);
      }
    }
  }
  exports.StateMachine = StateMachine;
});

// node_modules/node-cron/dist/esm/tasks/inline-scheduled-task.js
var require_inline_scheduled_task = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.InlineScheduledTask = undefined;
  var events_1 = __importDefault(__require("events"));
  var runner_1 = require_runner();
  var time_matcher_1 = require_time_matcher();
  var create_id_1 = require_create_id();
  var state_machine_1 = require_state_machine();
  var logger_1 = __importDefault(require_logger());
  var localized_time_1 = require_localized_time();

  class TaskEmitter extends events_1.default {
  }

  class InlineScheduledTask {
    emitter;
    cronExpression;
    timeMatcher;
    runner;
    id;
    name;
    stateMachine;
    timezone;
    constructor(cronExpression, taskFn, options) {
      this.emitter = new TaskEmitter;
      this.cronExpression = cronExpression;
      this.id = (0, create_id_1.createID)("task", 12);
      this.name = options?.name || this.id;
      this.timezone = options?.timezone;
      this.timeMatcher = new time_matcher_1.TimeMatcher(cronExpression, options?.timezone);
      this.stateMachine = new state_machine_1.StateMachine;
      const runnerOptions = {
        timezone: options?.timezone,
        noOverlap: options?.noOverlap,
        maxExecutions: options?.maxExecutions,
        maxRandomDelay: options?.maxRandomDelay,
        beforeRun: (date, execution) => {
          if (execution.reason === "scheduled") {
            this.changeState("running");
          }
          this.emitter.emit("execution:started", this.createContext(date, execution));
          return true;
        },
        onFinished: (date, execution) => {
          if (execution.reason === "scheduled") {
            this.changeState("idle");
          }
          this.emitter.emit("execution:finished", this.createContext(date, execution));
          return true;
        },
        onError: (date, error, execution) => {
          logger_1.default.error(error);
          this.emitter.emit("execution:failed", this.createContext(date, execution));
          this.changeState("idle");
        },
        onOverlap: (date) => {
          this.emitter.emit("execution:overlap", this.createContext(date));
        },
        onMissedExecution: (date) => {
          this.emitter.emit("execution:missed", this.createContext(date));
        },
        onMaxExecutions: (date) => {
          this.emitter.emit("execution:maxReached", this.createContext(date));
          this.destroy();
        }
      };
      this.runner = new runner_1.Runner(this.timeMatcher, (date, execution) => {
        return taskFn(this.createContext(date, execution));
      }, runnerOptions);
    }
    getNextRun() {
      if (this.stateMachine.state !== "stopped") {
        return this.runner.nextRun();
      }
      return null;
    }
    changeState(state) {
      if (this.runner.isStarted()) {
        this.stateMachine.changeState(state);
      }
    }
    start() {
      if (this.runner.isStopped()) {
        this.runner.start();
        this.stateMachine.changeState("idle");
        this.emitter.emit("task:started", this.createContext(new Date));
      }
    }
    stop() {
      if (this.runner.isStarted()) {
        this.runner.stop();
        this.stateMachine.changeState("stopped");
        this.emitter.emit("task:stopped", this.createContext(new Date));
      }
    }
    getStatus() {
      return this.stateMachine.state;
    }
    destroy() {
      if (this.stateMachine.state === "destroyed")
        return;
      this.stop();
      this.stateMachine.changeState("destroyed");
      this.emitter.emit("task:destroyed", this.createContext(new Date));
    }
    execute() {
      return new Promise((resolve, reject) => {
        const onFail = (context) => {
          this.off("execution:finished", onFail);
          reject(context.execution?.error);
        };
        const onFinished = (context) => {
          this.off("execution:failed", onFail);
          resolve(context.execution?.result);
        };
        this.once("execution:finished", onFinished);
        this.once("execution:failed", onFail);
        this.runner.execute();
      });
    }
    on(event, fun) {
      this.emitter.on(event, fun);
    }
    off(event, fun) {
      this.emitter.off(event, fun);
    }
    once(event, fun) {
      this.emitter.once(event, fun);
    }
    createContext(executionDate, execution) {
      const localTime = new localized_time_1.LocalizedTime(executionDate, this.timezone);
      const ctx = {
        date: localTime.toDate(),
        dateLocalIso: localTime.toISO(),
        triggeredAt: new Date,
        task: this,
        execution
      };
      return ctx;
    }
  }
  exports.InlineScheduledTask = InlineScheduledTask;
});

// node_modules/node-cron/dist/esm/task-registry.js
var require_task_registry = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TaskRegistry = undefined;
  var tasks = new Map;

  class TaskRegistry {
    add(task) {
      if (this.has(task.id)) {
        throw Error(`task ${task.id} already registred!`);
      }
      tasks.set(task.id, task);
      task.on("task:destroyed", () => {
        this.remove(task);
      });
    }
    get(taskId) {
      return tasks.get(taskId);
    }
    remove(task) {
      if (this.has(task.id)) {
        task?.destroy();
        tasks.delete(task.id);
      }
    }
    all() {
      return tasks;
    }
    has(taskId) {
      return tasks.has(taskId);
    }
    killAll() {
      tasks.forEach((id) => this.remove(id));
    }
  }
  exports.TaskRegistry = TaskRegistry;
});

// node_modules/node-cron/dist/esm/pattern/validation/pattern-validation.js
var require_pattern_validation = __commonJS((exports) => {
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var index_1 = __importDefault(require_convertion());
  var validationRegex = /^(?:\d+|\*|\*\/\d+)$/;
  function isValidExpression(expression, min, max) {
    const options = expression;
    for (const option of options) {
      const optionAsInt = parseInt(option, 10);
      if (!Number.isNaN(optionAsInt) && (optionAsInt < min || optionAsInt > max) || !validationRegex.test(option))
        return false;
    }
    return true;
  }
  function isInvalidSecond(expression) {
    return !isValidExpression(expression, 0, 59);
  }
  function isInvalidMinute(expression) {
    return !isValidExpression(expression, 0, 59);
  }
  function isInvalidHour(expression) {
    return !isValidExpression(expression, 0, 23);
  }
  function isInvalidDayOfMonth(expression) {
    return !isValidExpression(expression, 1, 31);
  }
  function isInvalidMonth(expression) {
    return !isValidExpression(expression, 1, 12);
  }
  function isInvalidWeekDay(expression) {
    return !isValidExpression(expression, 0, 7);
  }
  function validateFields(patterns, executablePatterns) {
    if (isInvalidSecond(executablePatterns[0]))
      throw new Error(`${patterns[0]} is a invalid expression for second`);
    if (isInvalidMinute(executablePatterns[1]))
      throw new Error(`${patterns[1]} is a invalid expression for minute`);
    if (isInvalidHour(executablePatterns[2]))
      throw new Error(`${patterns[2]} is a invalid expression for hour`);
    if (isInvalidDayOfMonth(executablePatterns[3]))
      throw new Error(`${patterns[3]} is a invalid expression for day of month`);
    if (isInvalidMonth(executablePatterns[4]))
      throw new Error(`${patterns[4]} is a invalid expression for month`);
    if (isInvalidWeekDay(executablePatterns[5]))
      throw new Error(`${patterns[5]} is a invalid expression for week day`);
  }
  function validate(pattern) {
    if (typeof pattern !== "string")
      throw new TypeError("pattern must be a string!");
    const patterns = pattern.split(" ");
    const executablePatterns = (0, index_1.default)(pattern);
    if (patterns.length === 5)
      patterns.unshift("0");
    validateFields(patterns, executablePatterns);
  }
  exports.default = validate;
});

// node_modules/node-cron/dist/esm/tasks/background-scheduled-task/background-scheduled-task.js
var require_background_scheduled_task = __commonJS((exports) => {
  var __dirname = "/Users/bhargava_g/page_solutions/nse_bhavcopy/node_modules/node-cron/dist/esm/tasks/background-scheduled-task";
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var path_1 = __require("path");
  var child_process_1 = __require("child_process");
  var create_id_1 = require_create_id();
  var stream_1 = __require("stream");
  var state_machine_1 = require_state_machine();
  var localized_time_1 = require_localized_time();
  var logger_1 = __importDefault(require_logger());
  var time_matcher_1 = require_time_matcher();
  var daemonPath = (0, path_1.resolve)(__dirname, "daemon.js");

  class TaskEmitter extends stream_1.EventEmitter {
  }

  class BackgroundScheduledTask {
    emitter;
    id;
    name;
    cronExpression;
    taskPath;
    options;
    forkProcess;
    stateMachine;
    constructor(cronExpression, taskPath, options) {
      this.cronExpression = cronExpression;
      this.taskPath = taskPath;
      this.options = options;
      this.id = (0, create_id_1.createID)("task");
      this.name = options?.name || this.id;
      this.emitter = new TaskEmitter;
      this.stateMachine = new state_machine_1.StateMachine("stopped");
      this.on("task:stopped", () => {
        this.forkProcess?.kill();
        this.forkProcess = undefined;
        this.stateMachine.changeState("stopped");
      });
      this.on("task:destroyed", () => {
        this.forkProcess?.kill();
        this.forkProcess = undefined;
        this.stateMachine.changeState("destroyed");
      });
    }
    getNextRun() {
      if (this.stateMachine.state !== "stopped") {
        const timeMatcher = new time_matcher_1.TimeMatcher(this.cronExpression, this.options?.timezone);
        return timeMatcher.getNextMatch(new Date);
      }
      return null;
    }
    start() {
      return new Promise((resolve, reject) => {
        if (this.forkProcess) {
          return resolve(undefined);
        }
        const timeout = setTimeout(() => {
          reject(new Error("Start operation timed out"));
        }, 5000);
        try {
          this.forkProcess = (0, child_process_1.fork)(daemonPath);
          this.forkProcess.on("error", (err) => {
            clearTimeout(timeout);
            reject(new Error(`Error on daemon: ${err.message}`));
          });
          this.forkProcess.on("exit", (code, signal) => {
            if (code !== 0 && signal !== "SIGTERM") {
              const erro = new Error(`node-cron daemon exited with code ${code || signal}`);
              logger_1.default.error(erro);
              clearTimeout(timeout);
              reject(erro);
            }
          });
          this.forkProcess.on("message", (message) => {
            if (message.jsonError) {
              if (message.context?.execution) {
                message.context.execution.error = deserializeError(message.jsonError);
                delete message.jsonError;
              }
            }
            if (message.context?.task?.state) {
              this.stateMachine.changeState(message.context?.task?.state);
            }
            if (message.context) {
              const execution = message.context?.execution;
              delete execution?.hasError;
              const context = this.createContext(new Date(message.context.date), execution);
              this.emitter.emit(message.event, context);
            }
          });
          this.once("task:started", () => {
            this.stateMachine.changeState("idle");
            clearTimeout(timeout);
            resolve(undefined);
          });
          this.forkProcess.send({
            command: "task:start",
            path: this.taskPath,
            cron: this.cronExpression,
            options: this.options
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    stop() {
      return new Promise((resolve, reject) => {
        if (!this.forkProcess) {
          return resolve(undefined);
        }
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(new Error("Stop operation timed out"));
        }, 5000);
        const cleanupAndResolve = () => {
          clearTimeout(timeoutId);
          this.off("task:stopped", onStopped);
          this.forkProcess = undefined;
          resolve(undefined);
        };
        const onStopped = () => {
          cleanupAndResolve();
        };
        this.once("task:stopped", onStopped);
        this.forkProcess.send({
          command: "task:stop"
        });
      });
    }
    getStatus() {
      return this.stateMachine.state;
    }
    destroy() {
      return new Promise((resolve, reject) => {
        if (!this.forkProcess) {
          return resolve(undefined);
        }
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(new Error("Destroy operation timed out"));
        }, 5000);
        const onDestroy = () => {
          clearTimeout(timeoutId);
          this.off("task:destroyed", onDestroy);
          resolve(undefined);
        };
        this.once("task:destroyed", onDestroy);
        this.forkProcess.send({
          command: "task:destroy"
        });
      });
    }
    execute() {
      return new Promise((resolve, reject) => {
        if (!this.forkProcess) {
          return reject(new Error("Cannot execute background task because it hasn't been started yet. Please initialize the task using the start() method before attempting to execute it."));
        }
        const timeoutId = setTimeout(() => {
          cleanupListeners();
          reject(new Error("Execution timeout exceeded"));
        }, 5000);
        const cleanupListeners = () => {
          clearTimeout(timeoutId);
          this.off("execution:finished", onFinished);
          this.off("execution:failed", onFail);
        };
        const onFinished = (context) => {
          cleanupListeners();
          resolve(context.execution?.result);
        };
        const onFail = (context) => {
          cleanupListeners();
          reject(context.execution?.error || new Error("Execution failed without specific error"));
        };
        this.once("execution:finished", onFinished);
        this.once("execution:failed", onFail);
        this.forkProcess.send({
          command: "task:execute"
        });
      });
    }
    on(event, fun) {
      this.emitter.on(event, fun);
    }
    off(event, fun) {
      this.emitter.off(event, fun);
    }
    once(event, fun) {
      this.emitter.once(event, fun);
    }
    createContext(executionDate, execution) {
      const localTime = new localized_time_1.LocalizedTime(executionDate, this.options?.timezone);
      const ctx = {
        date: localTime.toDate(),
        dateLocalIso: localTime.toISO(),
        triggeredAt: new Date,
        task: this,
        execution
      };
      return ctx;
    }
  }
  function deserializeError(str) {
    const data = JSON.parse(str);
    const Err = globalThis[data.name] || Error;
    const err = new Err(data.message);
    if (data.stack) {
      err.stack = data.stack;
    }
    Object.keys(data).forEach((key) => {
      if (!["name", "message", "stack"].includes(key)) {
        err[key] = data[key];
      }
    });
    return err;
  }
  exports.default = BackgroundScheduledTask;
});

// node_modules/node-cron/dist/esm/node-cron.js
var require_node_cron = __commonJS((exports) => {
  var __filename = "/Users/bhargava_g/page_solutions/nse_bhavcopy/node_modules/node-cron/dist/esm/node-cron.js";
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.nodeCron = exports.getTask = exports.getTasks = undefined;
  exports.schedule = schedule;
  exports.createTask = createTask;
  exports.solvePath = solvePath;
  exports.validate = validate;
  var inline_scheduled_task_1 = require_inline_scheduled_task();
  var task_registry_1 = require_task_registry();
  var pattern_validation_1 = __importDefault(require_pattern_validation());
  var background_scheduled_task_1 = __importDefault(require_background_scheduled_task());
  var path_1 = __importDefault(__require("path"));
  var url_1 = __require("url");
  var registry = new task_registry_1.TaskRegistry;
  function schedule(expression, func, options) {
    const task = createTask(expression, func, options);
    task.start();
    return task;
  }
  function createTask(expression, func, options) {
    let task;
    if (func instanceof Function) {
      task = new inline_scheduled_task_1.InlineScheduledTask(expression, func, options);
    } else {
      const taskPath = solvePath(func);
      task = new background_scheduled_task_1.default(expression, taskPath, options);
    }
    registry.add(task);
    return task;
  }
  function solvePath(filePath) {
    if (path_1.default.isAbsolute(filePath))
      return (0, url_1.pathToFileURL)(filePath).href;
    if (filePath.startsWith("file://"))
      return filePath;
    const stackLines = new Error().stack?.split(`
`);
    if (stackLines) {
      stackLines?.shift();
      const callerLine = stackLines?.find((line) => {
        return line.indexOf(__filename) === -1;
      });
      const match = callerLine?.match(/(file:\/\/)?(((\/?)(\w:))?([/\\].+)):\d+:\d+/);
      if (match) {
        const dir = `${match[5] ?? ""}${path_1.default.dirname(match[6])}`;
        return (0, url_1.pathToFileURL)(path_1.default.resolve(dir, filePath)).href;
      }
    }
    throw new Error(`Could not locate task file ${filePath}`);
  }
  function validate(expression) {
    try {
      (0, pattern_validation_1.default)(expression);
      return true;
    } catch (e) {
      return false;
    }
  }
  exports.getTasks = registry.all;
  exports.getTask = registry.get;
  exports.nodeCron = {
    schedule,
    createTask,
    validate,
    getTasks: exports.getTasks,
    getTask: exports.getTask
  };
  exports.default = exports.nodeCron;
});

// node_modules/dotenv/package.json
var require_package2 = __commonJS((exports, module) => {
  module.exports = {
    name: "dotenv",
    version: "17.2.3",
    description: "Loads environment variables from .env file",
    main: "lib/main.js",
    types: "lib/main.d.ts",
    exports: {
      ".": {
        types: "./lib/main.d.ts",
        require: "./lib/main.js",
        default: "./lib/main.js"
      },
      "./config": "./config.js",
      "./config.js": "./config.js",
      "./lib/env-options": "./lib/env-options.js",
      "./lib/env-options.js": "./lib/env-options.js",
      "./lib/cli-options": "./lib/cli-options.js",
      "./lib/cli-options.js": "./lib/cli-options.js",
      "./package.json": "./package.json"
    },
    scripts: {
      "dts-check": "tsc --project tests/types/tsconfig.json",
      lint: "standard",
      pretest: "npm run lint && npm run dts-check",
      test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
      "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
      prerelease: "npm test",
      release: "standard-version"
    },
    repository: {
      type: "git",
      url: "git://github.com/motdotla/dotenv.git"
    },
    homepage: "https://github.com/motdotla/dotenv#readme",
    funding: "https://dotenvx.com",
    keywords: [
      "dotenv",
      "env",
      ".env",
      "environment",
      "variables",
      "config",
      "settings"
    ],
    readmeFilename: "README.md",
    license: "BSD-2-Clause",
    devDependencies: {
      "@types/node": "^18.11.3",
      decache: "^4.6.2",
      sinon: "^14.0.1",
      standard: "^17.0.0",
      "standard-version": "^9.5.0",
      tap: "^19.2.0",
      typescript: "^4.8.4"
    },
    engines: {
      node: ">=12"
    },
    browser: {
      fs: false
    }
  };
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module) => {
  var fs2 = __require("fs");
  var path3 = __require("path");
  var os2 = __require("os");
  var crypto = __require("crypto");
  var packageJson = require_package2();
  var version = packageJson.version;
  var TIPS = [
    "\uD83D\uDD10 encrypt with Dotenvx: https://dotenvx.com",
    "\uD83D\uDD10 prevent committing .env to code: https://dotenvx.com/precommit",
    "\uD83D\uDD10 prevent building .env in docker: https://dotenvx.com/prebuild",
    "\uD83D\uDCE1 add observability to secrets: https://dotenvx.com/ops",
    "\uD83D\uDC65 sync secrets across teammates & machines: https://dotenvx.com/ops",
    "\uD83D\uDDC2\uFE0F backup and recover secrets: https://dotenvx.com/ops",
    "\u2705 audit secrets and track compliance: https://dotenvx.com/ops",
    "\uD83D\uDD04 add secrets lifecycle management: https://dotenvx.com/ops",
    "\uD83D\uDD11 add access controls to secrets: https://dotenvx.com/ops",
    "\uD83D\uDEE0\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
    "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
    "\u2699\uFE0F  enable debug logging with { debug: true }",
    "\u2699\uFE0F  override existing env vars with { override: true }",
    "\u2699\uFE0F  suppress all logs with { quiet: true }",
    "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
    "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
  ];
  function _getRandomTip() {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
  }
  function parseBoolean(value) {
    if (typeof value === "string") {
      return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
    }
    return Boolean(value);
  }
  function supportsAnsi() {
    return process.stdout.isTTY;
  }
  function dim(text) {
    return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
  }
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function parse(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, `
`);
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, `
`);
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    options = options || {};
    const vaultPath = _vaultPath(options);
    options.path = vaultPath;
    const result = DotenvModule.configDotenv(options);
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  }
  function _warn(message) {
    console.error(`[dotenv@${version}][WARN] ${message}`);
  }
  function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  }
  function _log(message) {
    console.log(`[dotenv@${version}] ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs2.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
    }
    if (fs2.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path3.join(os2.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    const debug2 = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
    const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (debug2 || !quiet) {
      _log("Loading env from encrypted .env.vault");
    }
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
    const dotenvPath = path3.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    let debug2 = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
    let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug2) {
        _debug("No encoding is specified. UTF-8 is used by default");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path4 of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs2.readFileSync(path4, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug2) {
          _debug(`Failed to load ${path4} ${e.message}`);
        }
        lastError = e;
      }
    }
    const populated = DotenvModule.populate(processEnv, parsedAll, options);
    debug2 = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug2);
    quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
    if (debug2 || !quiet) {
      const keysCount = Object.keys(populated).length;
      const shortPaths = [];
      for (const filePath of optionPaths) {
        try {
          const relative = path3.relative(process.cwd(), filePath);
          shortPaths.push(relative);
        } catch (e) {
          if (debug2) {
            _debug(`Failed to load ${filePath} ${e.message}`);
          }
          lastError = e;
        }
      }
      _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
    }
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  }
  function config(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  }
  function populate(processEnv, parsed, options = {}) {
    const debug2 = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    const populated = {};
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
        if (debug2) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
        populated[key] = parsed[key];
      }
    }
    return populated;
  }
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  exports.configDotenv = DotenvModule.configDotenv;
  exports._configVault = DotenvModule._configVault;
  exports._parseVault = DotenvModule._parseVault;
  exports.config = DotenvModule.config;
  exports.decrypt = DotenvModule.decrypt;
  exports.parse = DotenvModule.parse;
  exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});

// node_modules/playwright-extra/dist/index.esm.js
var import_debug = __toESM(require_src(), 1);
/*!
 * playwright-extra v4.3.5 by berstend
 * https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra#readme
 * @license MIT
 */

class Loader {
  constructor(moduleName, packageNames) {
    this.moduleName = moduleName;
    this.packageNames = packageNames;
  }
  lazyloadExportOrDie(exportName) {
    const that = this;
    const trapHandler = Object.fromEntries(Object.getOwnPropertyNames(Reflect).map((name) => [
      name,
      function(target, ...args) {
        const moduleExport = that.loadModuleOrDie()[exportName];
        const customTarget = moduleExport;
        const result = Reflect[name](customTarget || target, ...args);
        return result;
      }
    ]));
    return new Proxy({}, trapHandler);
  }
  loadModule() {
    return requirePackages(this.packageNames);
  }
  loadModuleOrDie() {
    const module = requirePackages(this.packageNames);
    if (module) {
      return module;
    }
    throw this.requireError;
  }
  get requireError() {
    const moduleNamePretty = this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1);
    return new Error(`
  ${moduleNamePretty} is missing. :-)

  I've tried loading ${this.packageNames.map((p) => `"${p}"`).join(", ")} - no luck.

  Make sure you install one of those packages or use the named 'addExtra' export,
  to patch a specific (and maybe non-standard) implementation of ${moduleNamePretty}.

  To get the latest stable version of ${moduleNamePretty} run:
  'yarn add ${this.moduleName}' or 'npm i ${this.moduleName}'
  `);
  }
}
function requirePackages(packageNames) {
  for (const name of packageNames) {
    try {
      return __require(name);
    } catch (_) {
      continue;
    }
  }
  return;
}
var playwrightLoader = new Loader("playwright", [
  "playwright-core",
  "playwright"
]);
var debug = import_debug.default("playwright-extra:puppeteer-compat");
var isPlaywrightPage = (obj) => {
  return "unroute" in obj;
};
var isPlaywrightFrame = (obj) => {
  return ["parentFrame", "frameLocator"].every((x) => (x in obj));
};
var isPlaywrightBrowser = (obj) => {
  return "newContext" in obj;
};
var isPuppeteerCompat = (obj) => {
  return !!obj && typeof obj === "object" && !!obj.isCompatShim;
};
var cache = {
  objectToShim: new Map,
  cdpSession: {
    page: new Map,
    browser: new Map
  }
};
function addPuppeteerCompat(object) {
  if (!object || typeof object !== "object") {
    return object;
  }
  if (cache.objectToShim.has(object)) {
    return cache.objectToShim.get(object);
  }
  if (isPuppeteerCompat(object)) {
    return object;
  }
  debug("addPuppeteerCompat", cache.objectToShim.size);
  if (isPlaywrightPage(object) || isPlaywrightFrame(object)) {
    const shim = createPageShim(object);
    cache.objectToShim.set(object, shim);
    return shim;
  }
  if (isPlaywrightBrowser(object)) {
    const shim = createBrowserShim(object);
    cache.objectToShim.set(object, shim);
    return shim;
  }
  debug("Received unknown object:", Reflect.ownKeys(object));
  return object;
}
var dummyCDPClient = {
  send: async (...args) => {
    debug("dummy CDP client called", "send", args);
  },
  on: (...args) => {
    debug("dummy CDP client called", "on", args);
  }
};
async function getPageCDPSession(page) {
  let session = cache.cdpSession.page.get(page);
  if (session) {
    debug("getPageCDPSession: use existing");
    return session;
  }
  debug("getPageCDPSession: use new");
  const context = isPlaywrightFrame(page) ? page.page().context() : page.context();
  try {
    session = await context.newCDPSession(page);
    cache.cdpSession.page.set(page, session);
    return session;
  } catch (err) {
    debug("getPageCDPSession: error while creating session:", err.message);
    debug("getPageCDPSession: Unable create CDP session (most likely a different browser than chromium) - returning a dummy");
  }
  return dummyCDPClient;
}
async function getBrowserCDPSession(browser) {
  let session = cache.cdpSession.browser.get(browser);
  if (session) {
    debug("getBrowserCDPSession: use existing");
    return session;
  }
  debug("getBrowserCDPSession: use new");
  try {
    session = await browser.newBrowserCDPSession();
    cache.cdpSession.browser.set(browser, session);
    return session;
  } catch (err) {
    debug("getBrowserCDPSession: error while creating session:", err.message);
    debug("getBrowserCDPSession: Unable create CDP session (most likely a different browser than chromium) - returning a dummy");
  }
  return dummyCDPClient;
}
function createPageShim(page) {
  const objId = Math.random().toString(36).substring(2, 7);
  const shim = new Proxy(page, {
    get(target, prop) {
      if (prop === "isCompatShim" || prop === "isPlaywright") {
        return true;
      }
      debug("page - get", objId, prop);
      if (prop === "_client") {
        return () => ({
          send: async (method, params) => {
            const session = await getPageCDPSession(page);
            return await session.send(method, params);
          },
          on: (event, listener) => {
            getPageCDPSession(page).then((session) => {
              session.on(event, listener);
            });
          }
        });
      }
      if (prop === "setBypassCSP") {
        return async (enabled) => {
          const session = await getPageCDPSession(page);
          return await session.send("Page.setBypassCSP", {
            enabled
          });
        };
      }
      if (prop === "setUserAgent") {
        return async (userAgent, userAgentMetadata) => {
          const session = await getPageCDPSession(page);
          return await session.send("Emulation.setUserAgentOverride", {
            userAgent,
            userAgentMetadata
          });
        };
      }
      if (prop === "browser") {
        if (isPlaywrightPage(page)) {
          return () => {
            let browser = page.context().browser();
            if (!browser) {
              debug("page.browser() - not available, most likely due to launchPersistentContext");
              browser = page;
            }
            return addPuppeteerCompat(browser);
          };
        }
      }
      if (prop === "evaluateOnNewDocument") {
        if (isPlaywrightPage(page)) {
          return async function(pageFunction, ...args) {
            return await page.addInitScript(pageFunction, args[0]);
          };
        }
      }
      if (prop === "userAgent") {
        return async (enabled) => {
          const session = await getPageCDPSession(page);
          const data = await session.send("Browser.getVersion");
          return data.userAgent;
        };
      }
      return Reflect.get(target, prop);
    }
  });
  return shim;
}
function createBrowserShim(browser) {
  const objId = Math.random().toString(36).substring(2, 7);
  const shim = new Proxy(browser, {
    get(target, prop) {
      if (prop === "isCompatShim" || prop === "isPlaywright") {
        return true;
      }
      debug("browser - get", objId, prop);
      if (prop === "pages") {
        return () => browser.contexts().flatMap((c) => c.pages().map((page) => addPuppeteerCompat(page)));
      }
      if (prop === "userAgent") {
        return async () => {
          const session = await getBrowserCDPSession(browser);
          const data = await session.send("Browser.getVersion");
          return data.userAgent;
        };
      }
      return Reflect.get(target, prop);
    }
  });
  return shim;
}
var debug$1 = import_debug.default("playwright-extra:plugins");

class PluginList {
  constructor() {
    this._plugins = [];
    this._dependencyDefaults = new Map;
    this._dependencyResolution = new Map;
  }
  get list() {
    return this._plugins;
  }
  get names() {
    return this._plugins.map((p) => p.name);
  }
  add(plugin) {
    var _a;
    if (!this.isValidPluginInstance(plugin)) {
      return false;
    }
    if (!!plugin.onPluginRegistered) {
      plugin.onPluginRegistered({ framework: "playwright" });
    }
    if (!!plugin._registerChildClassMembers) {
      plugin._registerChildClassMembers(Object.getPrototypeOf(plugin));
    }
    if ((_a = plugin.requirements) === null || _a === undefined ? undefined : _a.has("dataFromPlugins")) {
      plugin.getDataFromPlugins = this.getData.bind(this);
    }
    this._plugins.push(plugin);
    return true;
  }
  isValidPluginInstance(plugin) {
    if (!plugin || typeof plugin !== "object" || !plugin._isPuppeteerExtraPlugin) {
      console.error(`Warning: Plugin is not derived from PuppeteerExtraPlugin, ignoring.`, plugin);
      return false;
    }
    if (!plugin.name) {
      console.error(`Warning: Plugin with no name registering, ignoring.`, plugin);
      return false;
    }
    return true;
  }
  onPluginError(plugin, method, err) {
    console.warn(`An error occured while executing "${method}" in plugin "${plugin.name}":`, err);
  }
  setDependencyDefaults(dependencyPath, opts) {
    this._dependencyDefaults.set(dependencyPath, opts);
    return this;
  }
  setDependencyResolution(dependencyPath, pluginModule) {
    this._dependencyResolution.set(dependencyPath, pluginModule);
    return this;
  }
  prepare() {
    this.resolveDependencies();
    this.order();
  }
  filterByMethod(methodName) {
    return this._plugins.filter((plugin) => {
      if (!!plugin._childClassMembers && Array.isArray(plugin._childClassMembers)) {
        return plugin._childClassMembers.includes(methodName);
      }
      return methodName in plugin;
    });
  }
  _addPuppeteerCompatIfNeeded(plugin, method, args) {
    const canUseShim = plugin._isPuppeteerExtraPlugin && !plugin.noPuppeteerShim;
    const methodWhitelist = [
      "onBrowser",
      "onPageCreated",
      "onPageClose",
      "afterConnect",
      "afterLaunch"
    ];
    const shouldUseShim = methodWhitelist.includes(method);
    if (!canUseShim || !shouldUseShim) {
      return args;
    }
    debug$1("add puppeteer compatibility", plugin.name, method);
    return [...args.map((arg) => addPuppeteerCompat(arg))];
  }
  dispatch(method, ...args) {
    var _a, _b;
    const plugins = this.filterByMethod(method);
    debug$1("dispatch", method, {
      all: this._plugins.length,
      filteredByMethod: plugins.length
    });
    for (const plugin of plugins) {
      try {
        args = this._addPuppeteerCompatIfNeeded.bind(this)(plugin, method, args);
        const fnType = (_b = (_a = plugin[method]) === null || _a === undefined ? undefined : _a.constructor) === null || _b === undefined ? undefined : _b.name;
        debug$1("dispatch to plugin", {
          plugin: plugin.name,
          method,
          fnType
        });
        if (fnType === "AsyncFunction") {
          plugin[method](...args).catch((err) => this.onPluginError(plugin, method, err));
        } else {
          plugin[method](...args);
        }
      } catch (err) {
        this.onPluginError(plugin, method, err);
      }
    }
  }
  async dispatchBlocking(method, ...args) {
    const plugins = this.filterByMethod(method);
    debug$1("dispatchBlocking", method, {
      all: this._plugins.length,
      filteredByMethod: plugins.length
    });
    let retValue = null;
    for (const plugin of plugins) {
      try {
        args = this._addPuppeteerCompatIfNeeded.bind(this)(plugin, method, args);
        retValue = await plugin[method](...args);
        if (retValue !== undefined) {
          args[0] = retValue;
        }
      } catch (err) {
        this.onPluginError(plugin, method, err);
        return retValue;
      }
    }
    return retValue;
  }
  order() {
    debug$1("order:before", this.names);
    const runLast = this._plugins.filter((p) => {
      var _a;
      return (_a = p.requirements) === null || _a === undefined ? undefined : _a.has("runLast");
    }).map((p) => p.name);
    for (const name of runLast) {
      const index = this._plugins.findIndex((p) => p.name === name);
      this._plugins.push(this._plugins.splice(index, 1)[0]);
    }
    debug$1("order:after", this.names);
  }
  getData(name) {
    const data = this._plugins.filter((p) => !!p.data).map((p) => Array.isArray(p.data) ? p.data : [p.data]).reduce((acc, arr) => [...acc, ...arr], []);
    return name ? data.filter((d) => d.name === name) : data;
  }
  resolvePluginsStanza() {
    debug$1("resolvePluginsStanza");
    const pluginNames = new Set(this.names);
    this._plugins.filter((p) => !!p.plugins && p.plugins.length).filter((p) => !pluginNames.has(p.name)).forEach((parent) => {
      (parent.plugins || []).forEach((p) => {
        debug$1(parent.name, "adding missing plugin", p.name);
        this.add(p);
      });
    });
  }
  resolveDependenciesStanza() {
    debug$1("resolveDependenciesStanza");
    const requireDependencyOrDie = (parentName, dependencyPath) => {
      if (this._dependencyResolution.has(dependencyPath)) {
        return this._dependencyResolution.get(dependencyPath);
      }
      const possiblePrefixes = ["puppeteer-extra-plugin-"];
      const isAlreadyPrefixed = possiblePrefixes.some((prefix) => dependencyPath.startsWith(prefix));
      const packagePaths = [];
      if (!isAlreadyPrefixed) {
        packagePaths.push(...possiblePrefixes.map((prefix) => prefix + dependencyPath));
      }
      packagePaths.push(dependencyPath);
      const pluginModule = requirePackages(packagePaths);
      if (pluginModule) {
        return pluginModule;
      }
      const explanation = `
The plugin '${parentName}' listed '${dependencyPath}' as dependency,
which could not be found. Please install it:

${packagePaths.map((packagePath) => `yarn add ${packagePath.split("/")[0]}`).join(`
 or:
`)}

Note: You don't need to require the plugin yourself,
unless you want to modify it's default settings.

If your bundler has issues with dynamic imports take a look at '.plugins.setDependencyResolution()'.
      `;
      console.warn(explanation);
      throw new Error("Plugin dependency not found");
    };
    const existingPluginNames = new Set(this.names);
    const recursivelyLoadMissingDependencies = ({ name: parentName, dependencies }) => {
      if (!dependencies) {
        return;
      }
      const processDependency = (dependencyPath, opts) => {
        const pluginModule = requireDependencyOrDie(parentName, dependencyPath);
        opts = opts || this._dependencyDefaults.get(dependencyPath) || {};
        const plugin = pluginModule(opts);
        if (existingPluginNames.has(plugin.name)) {
          debug$1(parentName, "=> dependency already exists:", plugin.name);
          return;
        }
        existingPluginNames.add(plugin.name);
        debug$1(parentName, "=> adding new dependency:", plugin.name, opts);
        this.add(plugin);
        return recursivelyLoadMissingDependencies(plugin);
      };
      if (dependencies instanceof Set || Array.isArray(dependencies)) {
        return [...dependencies].forEach((dependencyPath) => processDependency(dependencyPath));
      }
      if (dependencies instanceof Map) {
        return dependencies.forEach((v, k) => processDependency(k, v));
      }
    };
    this.list.forEach(recursivelyLoadMissingDependencies);
  }
  resolveDependencies() {
    debug$1("resolveDependencies");
    this.resolvePluginsStanza();
    this.resolveDependenciesStanza();
  }
}
var debug$2 = import_debug.default("playwright-extra");

class PlaywrightExtraClass {
  constructor(_launcher) {
    this._launcher = _launcher;
    this.plugins = new PluginList;
  }
  use(plugin) {
    const isValid = plugin && "name" in plugin;
    if (!isValid) {
      throw new Error("A plugin must be provided to .use()");
    }
    if (this.plugins.add(plugin)) {
      debug$2("Plugin registered", plugin.name);
    }
    return this;
  }
  get launcher() {
    if (!this._launcher) {
      throw playwrightLoader.requireError;
    }
    return this._launcher;
  }
  async launch(...args) {
    if (!this.launcher.launch) {
      throw new Error('Launcher does not support "launch"');
    }
    let [options] = args;
    options = Object.assign({ args: [] }, options || {});
    debug$2("launch", options);
    this.plugins.prepare();
    options = await this.plugins.dispatchBlocking("beforeLaunch", options) || options;
    debug$2("launch with options", options);
    if ("userDataDir" in options) {
      debug$2("A plugin defined userDataDir during .launch, which isn't supported by playwright - ignoring");
      delete options.userDataDir;
    }
    const browser = await this.launcher["launch"](options);
    await this.plugins.dispatchBlocking("onBrowser", browser);
    await this._bindBrowserEvents(browser);
    await this.plugins.dispatchBlocking("afterLaunch", browser);
    return browser;
  }
  async launchPersistentContext(...args) {
    if (!this.launcher.launchPersistentContext) {
      throw new Error('Launcher does not support "launchPersistentContext"');
    }
    let [userDataDir, options] = args;
    options = Object.assign({ args: [] }, options || {});
    debug$2("launchPersistentContext", options);
    this.plugins.prepare();
    options = await this.plugins.dispatchBlocking("beforeLaunch", options) || options;
    const context = await this.launcher["launchPersistentContext"](userDataDir, options);
    await this.plugins.dispatchBlocking("afterLaunch", context);
    this._bindBrowserContextEvents(context);
    return context;
  }
  async connect(wsEndpointOrOptions, wsOptions = {}) {
    if (!this.launcher.connect) {
      throw new Error('Launcher does not support "connect"');
    }
    this.plugins.prepare();
    let options = {};
    let wsEndpointAsString = false;
    if (typeof wsEndpointOrOptions === "object") {
      options = Object.assign(Object.assign({}, wsEndpointOrOptions), wsOptions);
    } else {
      wsEndpointAsString = true;
      options = Object.assign({ wsEndpoint: wsEndpointOrOptions }, wsOptions);
    }
    debug$2("connect", options);
    options = await this.plugins.dispatchBlocking("beforeConnect", options) || options;
    const args = [];
    const wsEndpoint = options.wsEndpoint;
    if (wsEndpointAsString) {
      delete options.wsEndpoint;
      args.push(wsEndpoint, options);
    } else {
      args.push(options);
    }
    const browser = await this.launcher["connect"](...args);
    await this.plugins.dispatchBlocking("onBrowser", browser);
    await this._bindBrowserEvents(browser);
    await this.plugins.dispatchBlocking("afterConnect", browser);
    return browser;
  }
  async connectOverCDP(wsEndpointOrOptions, wsOptions = {}) {
    if (!this.launcher.connectOverCDP) {
      throw new Error(`Launcher does not implement 'connectOverCDP'`);
    }
    this.plugins.prepare();
    let options = {};
    let wsEndpointAsString = false;
    if (typeof wsEndpointOrOptions === "object") {
      options = Object.assign(Object.assign({}, wsEndpointOrOptions), wsOptions);
    } else {
      wsEndpointAsString = true;
      options = Object.assign({ endpointURL: wsEndpointOrOptions }, wsOptions);
    }
    debug$2("connectOverCDP");
    options = await this.plugins.dispatchBlocking("beforeConnect", options) || options;
    const args = [];
    const endpointURL = options.endpointURL;
    if (wsEndpointAsString) {
      delete options.endpointURL;
      args.push(endpointURL, options);
    } else {
      args.push(options);
    }
    const browser = await this.launcher["connectOverCDP"](...args);
    await this.plugins.dispatchBlocking("onBrowser", browser);
    await this._bindBrowserEvents(browser);
    await this.plugins.dispatchBlocking("afterConnect", browser);
    return browser;
  }
  async _bindBrowserContextEvents(context, contextOptions) {
    debug$2("_bindBrowserContextEvents");
    this.plugins.dispatch("onContextCreated", context, contextOptions);
    context.newPage = ((originalMethod, ctx) => {
      return async () => {
        const page = await originalMethod.call(ctx);
        await page.goto("about:blank");
        return page;
      };
    })(context.newPage, context);
    context.on("close", () => {
      if (!context.browser()) {
        this.plugins.dispatch("onDisconnected");
      }
    });
    context.on("page", (page) => {
      this.plugins.dispatch("onPageCreated", page);
      page.on("close", () => {
        this.plugins.dispatch("onPageClose", page);
      });
    });
  }
  async _bindBrowserEvents(browser) {
    debug$2("_bindPlaywrightBrowserEvents");
    browser.on("disconnected", () => {
      this.plugins.dispatch("onDisconnected", browser);
    });
    browser.newContext = ((originalMethod, ctx) => {
      return async (options = {}) => {
        const contextOptions = await this.plugins.dispatchBlocking("beforeContext", options, browser) || options;
        const context = await originalMethod.call(ctx, contextOptions);
        this._bindBrowserContextEvents(context, contextOptions);
        return context;
      };
    })(browser.newContext, browser);
  }
}
var PlaywrightExtra = new Proxy(PlaywrightExtraClass, {
  construct(classTarget, args) {
    debug$2(`create instance of ${classTarget.name}`);
    const result = Reflect.construct(classTarget, args);
    return new Proxy(result, {
      get(target, prop) {
        if (prop in target) {
          return Reflect.get(target, prop);
        }
        debug$2("proxying property to original launcher: ", prop);
        return Reflect.get(target.launcher, prop);
      }
    });
  }
});
var addExtra = (launcher) => new PlaywrightExtra(launcher);
var chromium = addExtra((playwrightLoader.loadModule() || {}).chromium);
var firefox = addExtra((playwrightLoader.loadModule() || {}).firefox);
var webkit = addExtra((playwrightLoader.loadModule() || {}).webkit);
var _android = playwrightLoader.lazyloadExportOrDie("_android");
var _electron = playwrightLoader.lazyloadExportOrDie("_electron");
var request = playwrightLoader.lazyloadExportOrDie("request");
var selectors = playwrightLoader.lazyloadExportOrDie("selectors");
var devices = playwrightLoader.lazyloadExportOrDie("devices");
var errors = playwrightLoader.lazyloadExportOrDie("errors");

// src/scraper.ts
var import_puppeteer_extra_plugin_stealth = __toESM(require_puppeteer_extra_plugin_stealth(), 1);
var import_adm_zip = __toESM(require_adm_zip(), 1);
import path from "path";
import fs from "fs";
chromium.use(import_puppeteer_extra_plugin_stealth.default());

class FileScraper {
  browser = null;
  context = null;
  page = null;
  downloadPath;
  constructor(downloadPath = "downloads") {
    this.downloadPath = path.resolve(process.cwd(), downloadPath);
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true });
    }
  }
  async launch() {
    this.browser = await chromium.launch({
      headless: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-http2",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--dns-prefetch-disable"
      ]
    });
    this.context = await this.browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      acceptDownloads: true,
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        Referer: "https://www.nseindia.com/"
      }
    });
    this.page = await this.context.newPage();
    try {
      console.log("Visiting NSE homepage to establish session (launch)...");
      await this.page.goto("https://www.nseindia.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
      console.log("Homepage committed, waiting 5s...");
      await this.page.waitForTimeout(5000);
    } catch (e) {
      console.warn("Could not load homepage during launch, continuing...", e);
    }
  }
  async close() {
    if (this.page) {
      await this.page.close().catch(() => {});
      this.page = null;
    }
    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }
  async scrapeFile(url, triggerSelector) {
    if (!this.browser)
      await this.launch();
    const context = await this.browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      acceptDownloads: true,
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        Referer: "https://www.nseindia.com/"
      }
    });
    const page = await context.newPage();
    try {
      console.log(`Navigating to ${url}...`);
      if (url.includes("nseindia.com")) {
        try {
          console.log("Visiting NSE homepage to establish session...");
          await page.goto("https://www.nseindia.com/", { waitUntil: "commit", timeout: 15000 });
          console.log("Homepage committed, waiting 5s...");
          await page.waitForTimeout(5000);
        } catch (e) {
          console.warn("Could not load homepage, continuing...", e);
        }
      }
      const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
      if (triggerSelector) {
        await page.goto(url, { waitUntil: "networkidle" });
        console.log(`Clicking selector: ${triggerSelector}...`);
        await page.click(triggerSelector);
      } else {
        try {
          const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
          if (response) {
            console.log(`Response Status: ${response.status()}`);
            if (response.status() !== 200) {
              console.log(`Page Content: ${await page.content()}`);
            }
          }
        } catch (e) {
          console.log("Navigation might have been aborted by download (expected for direct links).");
        }
      }
      console.log("Waiting for download...");
      const download = await downloadPromise;
      const originalName = download.suggestedFilename();
      const savePath = path.join(this.downloadPath, originalName);
      console.log(`Downloading ${originalName}...`);
      await download.saveAs(savePath);
      console.log(`Saved to: ${savePath}`);
      return savePath;
    } catch (error) {
      console.error("Error during scraping:", error);
      return null;
    } finally {
      await page.close();
      await context.close();
    }
  }
  async unzipFile(filePath) {
    try {
      if (path.extname(filePath).toLowerCase() !== ".zip") {
        console.log("File is not a zip file, skipping extraction.");
        return null;
      }
      const fileName = path.basename(filePath, ".zip");
      const extractPath = path.join(path.dirname(filePath), fileName);
      console.log(`Extracting ${filePath} to ${extractPath}...`);
      const zip = new import_adm_zip.default(filePath);
      zip.extractAllTo(extractPath, true);
      console.log(`Extraction complete.`);
      return extractPath;
    } catch (error) {
      console.error("Error during extraction:", error);
      return null;
    }
  }
  async findLinkAndDownload(pageUrl, fileNamePattern) {
    if (!this.browser || !this.page)
      await this.launch();
    const page = this.page;
    try {
      console.log(`Navigating to ${pageUrl}...`);
      await page.goto(pageUrl, { waitUntil: "commit", timeout: 30000 });
      await page.waitForTimeout(5000);
      console.log(`Searching for link containing: ${fileNamePattern}`);
      const link = page.locator("a").filter({ hasText: fileNamePattern }).first();
      const hrefLink = page.locator(`a[href*="${fileNamePattern}"]`).first();
      let targetLocator = null;
      if (await link.count() > 0 && await link.isVisible()) {
        console.log("Found link by text.");
        targetLocator = link;
      } else if (await hrefLink.count() > 0) {
        console.log("Found link by href.");
        targetLocator = hrefLink;
      } else {
        console.log("File link not found on page.");
        try {
          const allZips = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("a")).map((a) => a.href).filter((h) => h.includes(".zip"));
          });
          console.log("DEBUG: Available .zip links on page:", JSON.stringify(allZips, null, 2));
        } catch (e) {
          console.log("DEBUG: Failed to list links");
        }
        return null;
      }
      const href = await targetLocator.getAttribute("href");
      const downloadPromise = page.waitForEvent("download", { timeout: 60000 });
      if (href) {
        console.log(`Navigating directly to download link: ${href}`);
        const downloadUrl = href.startsWith("http") ? href : new URL(href, pageUrl).toString();
        try {
          await page.goto(downloadUrl, { timeout: 30000 });
        } catch (e) {
          console.log("Navigation for download triggered (expected).");
        }
      } else {
        console.log("No href found, trying force click...");
        await targetLocator.click({ force: true });
      }
      const download = await downloadPromise;
      const originalName = download.suggestedFilename();
      const savePath = path.join(this.downloadPath, originalName);
      console.log(`Downloading ${originalName}...`);
      await download.saveAs(savePath);
      return savePath;
    } catch (error) {
      console.error(`Error in findLinkAndDownload: ${error}`);
      return null;
    }
  }
}

// src/email.ts
var import_nodemailer = __toESM(require_nodemailer(), 1);
import path2 from "path";

class EmailService {
  transporter;
  fromEmail;
  constructor() {
    this.fromEmail = process.env.SMTP_FROM || "bhargavagonugunta123@gmail.com";
    this.transporter = import_nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  async sendEmailWithAttachments(to, subject, text, attachmentPaths) {
    if (!process.env.SMTP_HOST) {
      console.log("SMTP_HOST not set. Mocking email send.");
      console.log(`To: ${to}, Subject: ${subject}, Attachments: ${attachmentPaths.join(", ")}`);
      return;
    }
    try {
      const attachments = attachmentPaths.map((p) => ({
        filename: path2.basename(p),
        path: p
      }));
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to,
        subject,
        text,
        attachments
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

// src/index.ts
var import_node_cron = __toESM(require_node_cron(), 1);
var import_dotenv = __toESM(require_main(), 1);
import path3 from "path";
import fs2 from "fs";
import_dotenv.default.config();
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var getFormattedDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};
var getYesterdaysFormattedDate = () => {
  const date = new Date;
  date.setDate(date.getDate() - 1);
  return getFormattedDate(date);
};
var RETRY_INTERVAL_MS = 30 * 60 * 1000;
async function runScheduler() {
  const scraper = new FileScraper;
  const emailService = new EmailService;
  const todayStr = getYesterdaysFormattedDate();
  console.log(`[Scheduler] Starting workflow for date: ${todayStr}`);
  const tasks = [
    {
      name: "Capital Market (CM)",
      pageUrl: "https://www.nseindia.com/all-reports",
      fileNamePattern: `BhavCopy_NSE_CM_0_0_0_${todayStr}_F_0000.csv.zip`
    },
    {
      name: "Derivatives (FO)",
      pageUrl: "https://www.nseindia.com/all-reports-derivatives",
      fileNamePattern: `BhavCopy_NSE_FO_0_0_0_${todayStr}_F_0000.csv.zip`
    }
  ];
  let completedTasks = new Set;
  let collectedAttachments = [];
  try {
    await scraper.launch();
    while (completedTasks.size < tasks.length) {
      console.log(`[Scheduler] Checking for files... (Completed: ${completedTasks.size}/${tasks.length})`);
      for (const task of tasks) {
        if (completedTasks.has(task.name))
          continue;
        console.log(`[Scheduler] Checking ${task.name}...`);
        const downloadedFile = await scraper.findLinkAndDownload(task.pageUrl, task.fileNamePattern);
        if (downloadedFile) {
          console.log(`[Scheduler] Success! Downloaded: ${downloadedFile}`);
          const extractedPath = await scraper.unzipFile(downloadedFile);
          let attachmentPath = downloadedFile;
          if (extractedPath) {
            try {
              const files = fs2.readdirSync(extractedPath);
              const csvFile = files.find((f) => f.endsWith(".csv"));
              if (csvFile) {
                attachmentPath = path3.join(extractedPath, csvFile);
              }
            } catch (e) {
              console.error("Error finding extracted CSV:", e);
            }
          }
          collectedAttachments.push(attachmentPath);
          completedTasks.add(task.name);
        } else {
          console.log(`[Scheduler] File ${task.fileNamePattern} not found yet.`);
        }
      }
      if (completedTasks.size < tasks.length) {
        console.log(`[Scheduler] Not all files found. Waiting 30 minutes before retry...`);
        await scraper.close();
        await delay(RETRY_INTERVAL_MS);
        await scraper.launch();
      }
    }
    console.log("[Scheduler] All tasks completed. Sending batch email...");
    const toEmail = process.env.SMTP_TO || "recipient@example.com";
    const subject = `NSE Reports For ${todayStr} (${collectedAttachments.length} items)`;
    const customMessage = `Processing Date: ${todayStr}

Attached Reports:
` + tasks.map((t) => `- ${t.name}`).join(`
`);
    await emailService.sendEmailWithAttachments(toEmail, subject, customMessage, collectedAttachments);
    console.log("[Scheduler] Workflow completed successfully.");
  } catch (error) {
    console.error("[Scheduler] Fatal error:", error);
  } finally {
    await scraper.close();
  }
}
console.log("[App] Initializing NSE Bhavcopy Scheduler...");
console.log("[App] Scheduled to run at 19:30 IST (Asia/Kolkata) Mon-Fri.");
import_node_cron.default.schedule("00 20 * * 1-5", () => {
  console.log(`[Cron] Triggering scheduled job at ${new Date().toISOString()}`);
  runScheduler();
}, {
  timezone: "Asia/Kolkata"
});
if (process.env.RUN_IMMEDIATELY === "true") {
  console.log("[App] RUN_IMMEDIATELY set. Running once now...");
  runScheduler();
} else {
  console.log("[App] Waiting for next scheduled run...");
  runScheduler();
}
