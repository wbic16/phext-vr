var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// ../../../node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "../../../node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// ../../../node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "../../../node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// ../../../node_modules/buffer/index.js
var require_buffer = __commonJS({
  "../../../node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// ../../../node_modules/xxh3-ts/xxh3.js
var require_xxh3 = __commonJS({
  "../../../node_modules/xxh3-ts/xxh3.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XXH3_128 = void 0;
    if (!globalThis.Buffer) {
      globalThis.Buffer = require_buffer().Buffer;
    }
    var n = (n2) => BigInt(n2);
    var PRIME32_1 = n("0x9E3779B1");
    var PRIME32_2 = n("0x85EBCA77");
    var PRIME32_3 = n("0xC2B2AE3D");
    var PRIME64_1 = n("0x9E3779B185EBCA87");
    var PRIME64_2 = n("0xC2B2AE3D27D4EB4F");
    var PRIME64_3 = n("0x165667B19E3779F9");
    var PRIME64_4 = n("0x85EBCA77C2B2AE63");
    var PRIME64_5 = n("0x27D4EB2F165667C5");
    var PRIME_MX1 = n("0x165667919E3779F9");
    var PRIME_MX2 = n("0x9FB21C651E98DF25");
    var kkey = Buffer.from("b8fe6c3923a44bbe7c01812cf721ad1cded46de9839097db7240a4a4b7b3671fcb79e64eccc0e578825ad07dccff7221b8084674f743248ee03590e6813a264c3c2852bb91c300cb88d0658b1b532ea371644897a20df94e3819ef46a9deacd8a8fa763fe39c343ff9dcbbc7c70b4f1d8a51e04bcdb45931c89f7ec9d9787364eac5ac8334d3ebc3c581a0fffa1363eb170ddd51b7f0da49d316552629d4689e2b16be587d47a1fc8ff8b8d17ad031ce45cb3a8f95160428afd7fbcabb4b407e", "hex");
    var mask128 = (n(1) << n(128)) - n(1);
    var mask64 = (n(1) << n(64)) - n(1);
    var mask32 = (n(1) << n(32)) - n(1);
    var STRIPE_LEN = 64;
    var STRIPE_ELTS = STRIPE_LEN / 4;
    var ACC_NB = STRIPE_LEN / 8;
    var _U64 = 8;
    var _U32 = 4;
    function getView(buf, offset = 0) {
      return Buffer.from(buf.buffer, buf.byteOffset + offset, buf.length - offset);
    }
    var bswap64 = (a) => {
      const scratchbuf = Buffer.allocUnsafe(8);
      scratchbuf.writeBigUInt64LE(a);
      return scratchbuf.readBigUInt64BE();
    };
    var bswap32 = (a) => {
      a = (a & n(65535)) << n(16) | (a & n(4294901760)) >> n(16);
      a = (a & n(16711935)) << n(8) | (a & n(4278255360)) >> n(8);
      return a;
    };
    var XXH_mult32to64 = (a, b) => (a & mask32) * (b & mask32) & mask64;
    var assert = (a) => {
      if (!a)
        throw new Error("Assert failed");
    };
    function rotl32(a, b) {
      return (a << b | a >> n(32) - b) & mask32;
    }
    function XXH3_accumulate_512(acc, data, key) {
      for (let i = 0; i < ACC_NB; i++) {
        const data_val = data.readBigUInt64LE(i * 8);
        const data_key = data_val ^ key.readBigUInt64LE(i * 8);
        acc[i ^ 1] += data_val;
        acc[i] += XXH_mult32to64(data_key, data_key >> n(32));
      }
      return acc;
    }
    function XXH3_accumulate(acc, data, key, nbStripes) {
      for (let n2 = 0; n2 < nbStripes; n2++) {
        XXH3_accumulate_512(acc, getView(data, n2 * STRIPE_LEN), getView(key, n2 * 8));
      }
      return acc;
    }
    function XXH3_scrambleAcc(acc, key) {
      for (let i = 0; i < ACC_NB; i++) {
        const key64 = key.readBigUInt64LE(i * 8);
        let acc64 = acc[i];
        acc64 = xorshift64(acc64, n(47));
        acc64 ^= key64;
        acc64 *= PRIME32_1;
        acc[i] = acc64 & mask64;
      }
      return acc;
    }
    function XXH3_mix2Accs(acc, key) {
      return XXH3_mul128_fold64(acc[0] ^ key.readBigUInt64LE(0), acc[1] ^ key.readBigUInt64LE(_U64));
    }
    function XXH3_mergeAccs(acc, key, start) {
      let result64 = start;
      result64 += XXH3_mix2Accs(acc.slice(0), getView(key, 0 * _U32));
      result64 += XXH3_mix2Accs(acc.slice(2), getView(key, 4 * _U32));
      result64 += XXH3_mix2Accs(acc.slice(4), getView(key, 8 * _U32));
      result64 += XXH3_mix2Accs(acc.slice(6), getView(key, 12 * _U32));
      return XXH3_avalanche(result64 & mask64);
    }
    function XXH3_hashLong(acc, data, secret, f_acc, f_scramble) {
      const nbStripesPerBlock = Math.floor((secret.byteLength - STRIPE_LEN) / 8);
      const block_len = STRIPE_LEN * nbStripesPerBlock;
      const nb_blocks = Math.floor((data.byteLength - 1) / block_len);
      for (let n2 = 0; n2 < nb_blocks; n2++) {
        acc = XXH3_accumulate(acc, getView(data, n2 * block_len), secret, nbStripesPerBlock);
        acc = f_scramble(acc, getView(secret, secret.byteLength - STRIPE_LEN));
      }
      {
        const nbStripes = Math.floor((data.byteLength - 1 - block_len * nb_blocks) / STRIPE_LEN);
        acc = XXH3_accumulate(acc, getView(data, nb_blocks * block_len), secret, nbStripes);
        acc = f_acc(acc, getView(data, data.byteLength - STRIPE_LEN), getView(secret, secret.byteLength - STRIPE_LEN - 7));
      }
      return acc;
    }
    function XXH3_hashLong_128b(data, secret, seed) {
      let acc = new BigUint64Array([PRIME32_3, PRIME64_1, PRIME64_2, PRIME64_3, PRIME64_4, PRIME32_2, PRIME64_5, PRIME32_1]);
      assert(data.length > 128);
      acc = XXH3_hashLong(acc, data, secret, XXH3_accumulate_512, XXH3_scrambleAcc);
      assert(acc.length * 8 == 64);
      {
        const low64 = XXH3_mergeAccs(acc, getView(secret, 11), n(data.byteLength) * PRIME64_1 & mask64);
        const high64 = XXH3_mergeAccs(acc, getView(secret, secret.byteLength - STRIPE_LEN - 11), ~(n(data.byteLength) * PRIME64_2) & mask64);
        return high64 << n(64) | low64;
      }
    }
    function XXH3_mul128_fold64(a, b) {
      const lll = a * b & mask128;
      return lll & mask64 ^ lll >> n(64);
    }
    function XXH3_mix16B(data, key, seed) {
      return XXH3_mul128_fold64((data.readBigUInt64LE(0) ^ key.readBigUInt64LE(0) + seed) & mask64, (data.readBigUInt64LE(8) ^ key.readBigUInt64LE(8) - seed) & mask64);
    }
    function XXH3_mix32B(acc, data1, data2, key, seed) {
      let accl = acc & mask64;
      let acch = acc >> n(64) & mask64;
      accl += XXH3_mix16B(data1, key, seed);
      accl ^= data2.readBigUInt64LE(0) + data2.readBigUInt64LE(8);
      accl &= mask64;
      acch += XXH3_mix16B(data2, getView(key, 16), seed);
      acch ^= data1.readBigUInt64LE(0) + data1.readBigUInt64LE(8);
      acch &= mask64;
      return acch << n(64) | accl;
    }
    function XXH3_avalanche(h64) {
      h64 ^= h64 >> n(37);
      h64 *= PRIME_MX1;
      h64 &= mask64;
      h64 ^= h64 >> n(32);
      return h64;
    }
    function XXH3_avalanche64(h64) {
      h64 ^= h64 >> n(33);
      h64 *= PRIME64_2;
      h64 &= mask64;
      h64 ^= h64 >> n(29);
      h64 *= PRIME64_3;
      h64 &= mask64;
      h64 ^= h64 >> n(32);
      return h64;
    }
    function XXH3_len_1to3_128b(data, key32, seed) {
      const len = data.byteLength;
      assert(len > 0 && len <= 3);
      const combined = n(data.readUInt8(len - 1)) | n(len << 8) | n(data.readUInt8(0) << 16) | n(data.readUInt8(len >> 1) << 24);
      const blow = (n(key32.readUInt32LE(0)) ^ n(key32.readUInt32LE(4))) + seed;
      const low = (combined ^ blow) & mask64;
      const bhigh = (n(key32.readUInt32LE(8)) ^ n(key32.readUInt32LE(12))) - seed;
      const high = (rotl32(bswap32(combined), n(13)) ^ bhigh) & mask64;
      return (XXH3_avalanche64(high) & mask64) << n(64) | XXH3_avalanche64(low);
    }
    function xorshift64(b, shift) {
      return b ^ b >> shift;
    }
    function XXH3_len_4to8_128b(data, key32, seed) {
      const len = data.byteLength;
      assert(len >= 4 && len <= 8);
      {
        const l1 = data.readUInt32LE(0);
        const l2 = data.readUInt32LE(len - 4);
        const l64 = n(l1) | n(l2) << n(32);
        const bitflip = (key32.readBigUInt64LE(16) ^ key32.readBigUInt64LE(24)) + seed & mask64;
        const keyed = l64 ^ bitflip;
        let m128 = keyed * (PRIME64_1 + (n(len) << n(2))) & mask128;
        m128 += (m128 & mask64) << n(65);
        m128 &= mask128;
        m128 ^= m128 >> n(67);
        return xorshift64(xorshift64(m128 & mask64, n(35)) * PRIME_MX2 & mask64, n(28)) | XXH3_avalanche(m128 >> n(64)) << n(64);
      }
    }
    function XXH3_len_9to16_128b(data, key64, seed) {
      const len = data.byteLength;
      assert(len >= 9 && len <= 16);
      {
        const bitflipl = (key64.readBigUInt64LE(32) ^ key64.readBigUInt64LE(40)) + seed & mask64;
        const bitfliph = (key64.readBigUInt64LE(48) ^ key64.readBigUInt64LE(56)) - seed & mask64;
        const ll1 = data.readBigUInt64LE();
        let ll2 = data.readBigUInt64LE(len - 8);
        let m128 = (ll1 ^ ll2 ^ bitflipl) * PRIME64_1;
        const m128_l = (m128 & mask64) + (n(len - 1) << n(54));
        m128 = m128 & (mask128 ^ mask64) | m128_l;
        ll2 ^= bitfliph;
        m128 += ll2 + (ll2 & mask32) * (PRIME32_2 - n(1)) << n(64);
        m128 &= mask128;
        m128 ^= bswap64(m128 >> n(64));
        let h128 = (m128 & mask64) * PRIME64_2;
        h128 += (m128 >> n(64)) * PRIME64_2 << n(64);
        h128 &= mask128;
        return XXH3_avalanche(h128 & mask64) | XXH3_avalanche(h128 >> n(64)) << n(64);
      }
    }
    function XXH3_len_0to16_128b(data, seed) {
      const len = data.byteLength;
      assert(len <= 16);
      if (len > 8)
        return XXH3_len_9to16_128b(data, kkey, seed);
      if (len >= 4)
        return XXH3_len_4to8_128b(data, kkey, seed);
      if (len > 0)
        return XXH3_len_1to3_128b(data, kkey, seed);
      return XXH3_avalanche64(seed ^ kkey.readBigUInt64LE(64) ^ kkey.readBigUInt64LE(72)) | XXH3_avalanche64(seed ^ kkey.readBigUInt64LE(80) ^ kkey.readBigUInt64LE(88)) << n(64);
    }
    function inv64(x) {
      return ~x + n(1) & mask64;
    }
    function XXH3_len_17to128_128b(data, secret, seed) {
      let acc = n(data.byteLength) * PRIME64_1 & mask64;
      let i = n(data.byteLength - 1) / n(32);
      while (i >= 0) {
        let ni = Number(i);
        acc = XXH3_mix32B(acc, getView(data, 16 * ni), getView(data, data.byteLength - 16 * (ni + 1)), getView(secret, 32 * ni), seed);
        i--;
      }
      let h128l = acc + (acc >> n(64)) & mask64;
      h128l = XXH3_avalanche(h128l);
      let h128h = (acc & mask64) * PRIME64_1 + (acc >> n(64)) * PRIME64_4 + (n(data.byteLength) - seed & mask64) * PRIME64_2;
      h128h &= mask64;
      h128h = inv64(XXH3_avalanche(h128h));
      return h128l | h128h << n(64);
    }
    function XXH3_len_129to240_128b(data, secret, seed) {
      let acc = n(data.byteLength) * PRIME64_1 & mask64;
      for (let i = 32; i < 160; i += 32) {
        acc = XXH3_mix32B(acc, getView(data, i - 32), getView(data, i - 16), getView(secret, i - 32), seed);
      }
      acc = XXH3_avalanche(acc & mask64) | XXH3_avalanche(acc >> n(64)) << n(64);
      for (let i = 160; i <= data.byteLength; i += 32) {
        acc = XXH3_mix32B(acc, getView(data, i - 32), getView(data, i - 16), getView(secret, 3 + i - 160), seed);
      }
      acc = XXH3_mix32B(acc, getView(data, data.byteLength - 16), getView(data, data.byteLength - 32), getView(secret, 136 - 17 - 16), inv64(seed));
      let h128l = acc + (acc >> n(64)) & mask64;
      h128l = XXH3_avalanche(h128l);
      let h128h = (acc & mask64) * PRIME64_1 + (acc >> n(64)) * PRIME64_4 + (n(data.byteLength) - seed & mask64) * PRIME64_2;
      h128h &= mask64;
      h128h = inv64(XXH3_avalanche(h128h));
      return h128l | h128h << n(64);
    }
    function XXH3_1282(data, seed = n(0)) {
      const len = data.byteLength;
      if (len <= 16)
        return XXH3_len_0to16_128b(data, seed);
      if (len <= 128)
        return XXH3_len_17to128_128b(data, kkey, seed);
      if (len <= 240)
        return XXH3_len_129to240_128b(data, kkey, seed);
      const acc = new BigUint64Array([PRIME32_3, PRIME64_1, PRIME64_2, PRIME64_3, PRIME64_4, PRIME32_2, PRIME64_5, PRIME32_1]);
      return XXH3_hashLong_128b(data, kkey, seed);
    }
    exports.XXH3_128 = XXH3_1282;
  }
});

// ../../../node_modules/xxh3-ts/xxh64.js
var require_xxh64 = __commonJS({
  "../../../node_modules/xxh3-ts/xxh64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.XXH64 = void 0;
    if (!globalThis.Buffer) {
      globalThis.Buffer = require_buffer().Buffer;
    }
    var n = (n2) => BigInt(n2);
    var PRIME64_1 = n("11400714785074694791");
    var PRIME64_2 = n("14029467366897019727");
    var PRIME64_3 = n("1609587929392839161");
    var PRIME64_4 = n("9650029242287828579");
    var PRIME64_5 = n("2870177450012600261");
    var mask64 = (n(1) << n(64)) - n(1);
    function getView(buf, offset = 0) {
      return Buffer.from(buf.buffer, buf.byteOffset + offset, buf.length - offset);
    }
    function Rotl64(a, b) {
      return a << b | a >> n(64) - b & mask64;
    }
    function round(acc, lane) {
      acc = acc + lane * PRIME64_2 & mask64;
      acc = Rotl64(acc, n(31)) & mask64;
      return acc * PRIME64_1 & mask64;
    }
    function XH64_mergeAccumulator(acc, accN) {
      acc = acc ^ round(n(0), accN);
      acc = acc * PRIME64_1 & mask64;
      return acc + PRIME64_4 & mask64;
    }
    function XH64_convergeAccumulator(accs) {
      let acc = Rotl64(accs[0], n(1)) + Rotl64(accs[1], n(7)) + Rotl64(accs[2], n(12)) + Rotl64(accs[3], n(18));
      acc = XH64_mergeAccumulator(acc, accs[0]);
      acc = XH64_mergeAccumulator(acc, accs[1]);
      acc = XH64_mergeAccumulator(acc, accs[2]);
      acc = XH64_mergeAccumulator(acc, accs[3]);
      return acc;
    }
    function XH64_accumulateRemainder(data, acc) {
      let offset = 0;
      while (data.byteLength - offset >= 8) {
        let lane = data.readBigUInt64LE(offset);
        acc = acc ^ round(n(0), lane);
        acc = Rotl64(acc, n(27)) * PRIME64_1;
        acc = acc + PRIME64_4 & mask64;
        offset += 8;
      }
      if (data.byteLength - offset >= 4) {
        let lane = BigInt(data.readUInt32LE(offset));
        acc = (acc ^ lane * PRIME64_1) & mask64;
        acc = Rotl64(acc, n(23)) * PRIME64_2 & mask64;
        acc = acc + PRIME64_3 & mask64;
        offset += 4;
      }
      while (data.byteLength - offset >= 1) {
        let lane = BigInt(data.readUInt8(offset));
        acc = (acc ^ lane * PRIME64_5) & mask64;
        acc = Rotl64(acc, n(11)) * PRIME64_1 & mask64;
        offset += 1;
      }
      return acc;
    }
    function XH64_accumulate(data, accs) {
      const fullStripes = Math.floor(data.byteLength / 32);
      for (let i = 0; i < fullStripes; i++) {
        for (let j = 0; j < 4; j++) {
          let lane = data.readBigUInt64LE(i * 32 + j * 8);
          accs[j] = round(accs[j], lane);
        }
      }
      let acc = XH64_convergeAccumulator(accs);
      acc += BigInt(data.byteLength);
      if (fullStripes != data.byteLength / 32) {
        acc = XH64_accumulateRemainder(getView(data, fullStripes * 32), acc);
      }
      return XH64_mix(acc);
    }
    function XH64_mix(acc) {
      acc = acc ^ acc >> n(33);
      acc = acc * PRIME64_2 & mask64;
      acc = acc ^ acc >> n(29);
      acc = acc * PRIME64_3 & mask64;
      acc = acc ^ acc >> n(32);
      return acc;
    }
    function XXH64_small(data, seed) {
      let acc = seed + PRIME64_5 & mask64;
      acc += n(data.byteLength);
      acc = XH64_accumulateRemainder(data, acc);
      return XH64_mix(acc);
    }
    function XXH64(data, seed = n(0)) {
      if (data.byteLength < 32)
        return XXH64_small(data, seed);
      const acc = new BigUint64Array([
        seed + PRIME64_1 + PRIME64_2,
        seed + PRIME64_2,
        seed,
        seed - PRIME64_1
      ]);
      return XH64_accumulate(data, acc);
    }
    exports.XXH64 = XXH64;
  }
});

// ../../../node_modules/xxh3-ts/index.js
var require_xxh3_ts = __commonJS({
  "../../../node_modules/xxh3-ts/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
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
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_xxh3(), exports);
    __exportStar(require_xxh64(), exports);
  }
});

// ../vendor-src/index.ts
var import_buffer = __toESM(require_buffer(), 1);
var xxhash = __toESM(require_xxh3_ts(), 1);

// lzma-stub.js
function compress() {
  throw new Error("phext-vr: seal_phext is unavailable in the browser build (lzma-native is Node-only). Parsing is unaffected.");
}
function decompress() {
  throw new Error("phext-vr: unseal_phext is unavailable in the browser build (lzma-native is Node-only). Parsing is unaffected.");
}

// ../vendor-src/index.ts
var MAX_COMPONENT = Number.MAX_SAFE_INTEGER;
var BINARY_SCROLL_HEADER = "phext-binary:1:base64";
var SEAL_PRESET = 6;
var Phext = class {
  constructor() {
    __publicField(this, "COORDINATE_MINIMUM");
    __publicField(this, "MAX_COMPONENT");
    __publicField(this, "LIBRARY_BREAK");
    __publicField(this, "CHAIN_BREAK");
    __publicField(this, "CHAIN_CLOSE");
    __publicField(this, "MORE_COWBELL");
    __publicField(this, "LINE_BREAK");
    __publicField(this, "SCROLL_BREAK");
    __publicField(this, "SECTION_BREAK");
    __publicField(this, "CHAPTER_BREAK");
    __publicField(this, "BOOK_BREAK");
    __publicField(this, "VOLUME_BREAK");
    __publicField(this, "COLLECTION_BREAK");
    __publicField(this, "SERIES_BREAK");
    __publicField(this, "SHELF_BREAK");
    __publicField(this, "ADDRESS_MICRO_BREAK");
    __publicField(this, "ADDRESS_MACRO_BREAK");
    __publicField(this, "ADDRESS_MACRO_ALT");
    __publicField(this, "create_range", (start, end) => {
      return new Range(start, end);
    });
    __publicField(this, "default_coordinate", () => {
      return new Coordinate();
    });
    __publicField(this, "create_positioned_scroll", (coord, scroll, next = "", remaining = "") => {
      return new PositionedScroll(coord, scroll, new Coordinate(next), remaining);
    });
    __publicField(this, "check_for_cowbell", (phext) => {
      for (var i = 0; i < phext.length; ++i) {
        if (phext[i] == this.MORE_COWBELL) {
          return true;
        }
      }
      return false;
    });
    __publicField(this, "get_subspace_coordinates", (subspace, target) => {
      var walker = new Coordinate();
      var fallback = new Coordinate();
      var insertion = new Coordinate();
      var subspace_index = 0;
      var start = 0;
      var end = 0;
      var stage = 0;
      var max = subspace.length;
      while (subspace_index < max) {
        var next = subspace[subspace_index];
        if (stage == 0) {
          if (walker.equals(target)) {
            stage = 1;
            start = subspace_index;
            fallback = this.to_coordinate(walker.to_string());
            insertion = this.to_coordinate(walker.to_string());
          }
          if (walker.less_than(target)) {
            fallback = this.to_coordinate(walker.to_string());
            insertion = this.to_coordinate(walker.to_string());
          }
        }
        if (stage < 2 && walker.greater_than(target)) {
          if (stage == 0) {
            start = subspace_index - 1;
          }
          end = subspace_index - 1;
          insertion = fallback;
          stage = 2;
        }
        if (this.is_phext_break(next)) {
          if (next == this.SCROLL_BREAK) {
            walker.scroll_break();
          }
          if (next == this.SECTION_BREAK) {
            walker.section_break();
          }
          if (next == this.CHAPTER_BREAK) {
            walker.chapter_break();
          }
          if (next == this.BOOK_BREAK) {
            walker.book_break();
          }
          if (next == this.VOLUME_BREAK) {
            walker.volume_break();
          }
          if (next == this.COLLECTION_BREAK) {
            walker.collection_break();
          }
          if (next == this.SERIES_BREAK) {
            walker.series_break();
          }
          if (next == this.SHELF_BREAK) {
            walker.shelf_break();
          }
          if (next == this.LIBRARY_BREAK) {
            walker.library_break();
          }
        }
        ++subspace_index;
      }
      if (stage == 1 && walker.equals(target)) {
        end = max;
        insertion = walker;
        stage = 2;
      }
      if (stage == 0) {
        start = max;
        end = max;
        insertion = walker;
      }
      var result = new OffsetsAndCoordinate(start, end, insertion, fallback);
      return result;
    });
    __publicField(this, "remove", (phext, location) => {
      var phase1 = this.replace(phext, location, "");
      return this.normalize(phase1);
    });
    __publicField(this, "create_summary", (phext) => {
      var limit = 32;
      if (phext.length == 0) {
        return "No Summary";
      }
      const parts = this.phokenize(phext);
      const text = parts[0].scroll.split("\n")[0];
      if (text.length < 32) {
        limit = text.length;
      }
      var result = text.substring(0, limit);
      if (result.length < phext.length) {
        result += "...";
      }
      return result;
    });
    __publicField(this, "navmap", (urlbase, phext) => {
      const phokens = this.phokenize(phext);
      var result = "";
      const max = phokens.length;
      if (max > 0) {
        result += "<ul>\n";
      }
      for (var i = 0; i < max; ++i) {
        const phoken = phokens[i];
        const urle = phoken.coord.to_urlencoded();
        const address = phoken.coord.to_string();
        const summary = this.create_summary(phoken.scroll);
        result += `<li><a href="${urlbase}${urle}">${address} ${summary}</a></li>
`;
      }
      if (max > 0) {
        result += "</ul>\n";
      }
      return result;
    });
    __publicField(this, "textmap", (phext) => {
      var phokens = this.phokenize(phext);
      var result = "";
      for (var i = 0; i < phokens.length; ++i) {
        var phoken = phokens[i];
        result += `* ${phoken.coord.to_string()}: ${this.create_summary(phoken.scroll)}
`;
      }
      return result;
    });
    // XXH3-128 checksum, byte-identical to libphext-rs (xxhash-rust 0.8.5).
    // This was disabled while xxh3-ts lagged the reference; xxh3-ts 2.0.1 (a
    // pure-TS port, no native code — it bundles where xxhash-addon could not)
    // reproduces rs exactly on every XXH3 length class: 0-3, 4-8, 9-16,
    // 17-128, 129-240, >240 bytes, multi-KB, and unicode inputs, all measured
    // against the rs build. It consumes a Node-style Buffer; in browsers the
    // 'buffer' package (a dependency of this library) provides one.
    __publicField(this, "checksum", (phext) => {
      const buffer = import_buffer.Buffer.from(phext);
      const hash = xxhash.XXH3_128(buffer);
      return hash.toString(16).padStart(32, "0");
    });
    // Replace every scroll in the document with its checksum — rs's manifest().
    __publicField(this, "manifest", (phext) => {
      var phokens = this.phokenize(phext);
      for (var i = 0; i < phokens.length; ++i) {
        phokens[i].scroll = this.checksum(phokens[i].scroll);
      }
      return this.dephokenize(phokens);
    });
    __publicField(this, "soundex_internal", (buffer) => {
      var letter1 = "bpfv";
      var letter2 = "cskgjqxz";
      var letter3 = "dt";
      var letter4 = "l";
      var letter5 = "mn";
      var letter6 = "r";
      var value = 1;
      for (var i = 0; i < buffer.length; ++i) {
        var c = buffer[i];
        if (letter1.indexOf(c) >= 0) {
          value += 1;
          continue;
        }
        if (letter2.indexOf(c) >= 0) {
          value += 2;
          continue;
        }
        if (letter3.indexOf(c) >= 0) {
          value += 3;
          continue;
        }
        if (letter4.indexOf(c) >= 0) {
          value += 4;
          continue;
        }
        if (letter5.indexOf(c) >= 0) {
          value += 5;
          continue;
        }
        if (letter6.indexOf(c) >= 0) {
          value += 6;
          continue;
        }
      }
      return value % 99;
    });
    __publicField(this, "soundex_v1", (phext) => {
      var phokens = this.phokenize(phext);
      var result = "";
      var coord = new Coordinate();
      for (var i = 0; i < phokens.length; ++i) {
        const soundex = this.soundex_internal(phokens[i].scroll);
        result += coord.advance_to(phokens[i].coord);
        result += soundex;
      }
      return result;
    });
    __publicField(this, "index_phokens", (phext) => {
      var phokens = this.phokenize(phext);
      var offset = 0;
      var coord = new Coordinate();
      var output = new Array();
      for (var i = 0; i < phokens.length; ++i) {
        const delims = coord.advance_to(phokens[i].coord);
        offset += utf8_length(delims);
        const new_coord = new Coordinate(coord.to_string());
        output.push(new PositionedScroll(new_coord, `${offset}`, new_coord, ""));
        offset += utf8_length(phokens[i].scroll);
      }
      return output;
    });
    __publicField(this, "index", (phext) => {
      var output = this.index_phokens(phext);
      return this.dephokenize(output);
    });
    __publicField(this, "offset", (phext, coord) => {
      var output = this.index_phokens(phext);
      var best = new Coordinate();
      var matched = false;
      var fetch_coord = coord;
      for (var i = 0; i < output.length; ++i) {
        var phoken = output[i];
        if (phoken.coord.less_than(coord) || phoken.coord.equals(coord)) {
          best = phoken.coord;
        }
        if (phoken.coord == coord) {
          matched = true;
        }
      }
      if (matched == false) {
        fetch_coord = best;
      }
      let index = this.dephokenize(output);
      return parseInt(this.fetch(index, fetch_coord));
    });
    __publicField(this, "replace", (phext, location, scroll) => {
      const phokens = this.phokenize(phext);
      var coord = new Coordinate();
      var result = "";
      var inserted = scroll.length == 0;
      for (var i = 0; i < phokens.length; ++i) {
        var ith = phokens[i];
        if (ith.coord.equals(location)) {
          if (!inserted) {
            result += coord.advance_to(location);
            result += scroll;
            inserted = true;
          }
        } else {
          if (inserted == false && ith.coord.greater_than(location)) {
            result += coord.advance_to(location);
            result += scroll;
            inserted = true;
          }
          if (ith.scroll.length > 0) {
            result += coord.advance_to(ith.coord);
            result += ith.scroll;
          }
        }
      }
      if (inserted == false) {
        result += coord.advance_to(location);
        result += scroll;
        inserted = true;
      }
      return result;
    });
    __publicField(this, "range_replace", (phext, location, scroll) => {
      var parts_start = this.get_subspace_coordinates(phext, location.start);
      var parts_end = this.get_subspace_coordinates(phext, location.end);
      var start = parts_start.start;
      var end = parts_end.end;
      const max = phext.length;
      if (end > max) {
        end = max;
      }
      const left = phext.substring(0, start);
      const right = phext.substring(end);
      const result = left + scroll + right;
      return result;
    });
    __publicField(this, "insert", (buffer, location, scroll) => {
      var parts = this.get_subspace_coordinates(buffer, location);
      const end = parts.end;
      var fixup = "";
      var subspace_coordinate = parts.coord;
      fixup += subspace_coordinate.advance_to(location);
      const left = buffer.substring(0, end);
      const right = buffer.substring(end);
      const result = left + fixup + scroll + right;
      return result;
    });
    __publicField(this, "next_scroll", (phext, start) => {
      var location = start;
      var output = "";
      var remaining = "";
      var pi = 0;
      var begin = start;
      var pmax = phext.length;
      while (pi < pmax) {
        var test = phext[pi];
        var dimension_break = false;
        if (test == this.SCROLL_BREAK) {
          location.scroll_break();
          dimension_break = true;
        }
        if (test == this.SECTION_BREAK) {
          location.section_break();
          dimension_break = true;
        }
        if (test == this.CHAPTER_BREAK) {
          location.chapter_break();
          dimension_break = true;
        }
        if (test == this.BOOK_BREAK) {
          location.book_break();
          dimension_break = true;
        }
        if (test == this.VOLUME_BREAK) {
          location.volume_break();
          dimension_break = true;
        }
        if (test == this.COLLECTION_BREAK) {
          location.collection_break();
          dimension_break = true;
        }
        if (test == this.SERIES_BREAK) {
          location.series_break();
          dimension_break = true;
        }
        if (test == this.SHELF_BREAK) {
          location.shelf_break();
          dimension_break = true;
        }
        if (test == this.LIBRARY_BREAK) {
          location.library_break();
          dimension_break = true;
        }
        if (dimension_break) {
          if (output.length > 0) {
            pi += 1;
            break;
          }
        } else {
          begin = new Coordinate(location.to_string());
          output += phext[pi];
        }
        ++pi;
      }
      if (pi < pmax) {
        remaining = phext.substring(pi);
      }
      const out_scroll = new PositionedScroll(begin, output, location, remaining);
      return out_scroll;
    });
    __publicField(this, "phokenize", (phext) => {
      var result = Array();
      var coord = new Coordinate();
      var temp = phext;
      while (true) {
        var ith_result = this.next_scroll(temp, coord);
        if (ith_result.scroll.length == 0) {
          break;
        }
        result.push(ith_result);
        coord = ith_result.next;
        temp = ith_result.remaining;
        if (ith_result.remaining.length == 0) {
          break;
        }
      }
      return result;
    });
    __publicField(this, "merge", (left, right) => {
      const tl = this.phokenize(left);
      const tr = this.phokenize(right);
      var tli = 0;
      var tri = 0;
      const maxtl = tl.length;
      const maxtr = tr.length;
      var result = "";
      var coord = new Coordinate();
      while (true) {
        const have_left = tli < maxtl;
        const have_right = tri < maxtr;
        const tl_lte = have_left && have_right && (tl[tli].coord.less_than(tr[tri].coord) || tl[tli].coord.equals(tr[tri].coord));
        const tr_lte = have_left && have_right && (tr[tri].coord.less_than(tl[tli].coord) || tr[tri].coord.equals(tl[tli].coord));
        const pick_left = have_left && (have_right == false || tl_lte);
        const pick_right = have_right && (have_left == false || tr_lte);
        if (pick_left) {
          result += this.append_scroll(tl[tli], coord);
          coord = new Coordinate(tl[tli].coord.to_string());
          ++tli;
        }
        if (pick_right) {
          result += this.append_scroll(tr[tri], coord);
          coord = new Coordinate(tr[tri].coord.to_string());
          ++tri;
        }
        if (pick_left == false && pick_right == false) {
          break;
        }
      }
      return result;
    });
    __publicField(this, "fetch", (phext, target) => {
      var parts = this.get_subspace_coordinates(phext, target);
      var start = parts.start;
      var end = parts.end;
      if (end > start) {
        var result = phext.substring(start, end);
        return result;
      }
      return "";
    });
    __publicField(this, "expand", (phext) => {
      var result = "";
      for (var i = 0; i < phext.length; ++i) {
        var next = phext[i];
        switch (next) {
          case this.LINE_BREAK:
            result += this.SCROLL_BREAK;
            break;
          case this.SCROLL_BREAK:
            result += this.SECTION_BREAK;
            break;
          case this.SECTION_BREAK:
            result += this.CHAPTER_BREAK;
            break;
          case this.CHAPTER_BREAK:
            result += this.BOOK_BREAK;
            break;
          case this.BOOK_BREAK:
            result += this.VOLUME_BREAK;
            break;
          case this.VOLUME_BREAK:
            result += this.COLLECTION_BREAK;
            break;
          case this.COLLECTION_BREAK:
            result += this.SERIES_BREAK;
            break;
          case this.SERIES_BREAK:
            result += this.SHELF_BREAK;
            break;
          case this.SHELF_BREAK:
            result += this.LIBRARY_BREAK;
            break;
          default:
            result += phext[i];
            break;
        }
      }
      return result;
    });
    __publicField(this, "contract", (phext) => {
      var result = "";
      for (var i = 0; i < phext.length; ++i) {
        var next = phext[i];
        switch (next) {
          // nop: case phext.LINE_BREAK
          case this.SCROLL_BREAK:
            result += this.LINE_BREAK;
            break;
          case this.SECTION_BREAK:
            result += this.SCROLL_BREAK;
            break;
          case this.CHAPTER_BREAK:
            result += this.SECTION_BREAK;
            break;
          case this.BOOK_BREAK:
            result += this.CHAPTER_BREAK;
            break;
          case this.VOLUME_BREAK:
            result += this.BOOK_BREAK;
            break;
          case this.COLLECTION_BREAK:
            result += this.VOLUME_BREAK;
            break;
          case this.SERIES_BREAK:
            result += this.COLLECTION_BREAK;
            break;
          case this.SHELF_BREAK:
            result += this.SERIES_BREAK;
            break;
          case this.LIBRARY_BREAK:
            result += this.SHELF_BREAK;
            break;
          default:
            result += phext[i];
            break;
        }
      }
      return result;
    });
    __publicField(this, "dephokenize", (phokens) => {
      var result = "";
      var coord = new Coordinate();
      for (var i = 0; i < phokens.length; ++i) {
        var ph = phokens[i];
        if (ph.scroll && ph.scroll.length > 0) {
          result += coord.advance_to(ph.coord);
          result += ph.scroll;
        }
      }
      return result;
    });
    __publicField(this, "append_scroll", (token, coord) => {
      var output = coord.advance_to(token.coord);
      output += token.scroll;
      return output;
    });
    __publicField(this, "subtract", (left, right) => {
      const pl = this.phokenize(left);
      const pr = this.phokenize(right);
      var result = "";
      var pri = 0;
      const max = pr.length;
      var coord = new Coordinate();
      for (var i = 0; i < pl.length; ++i) {
        var token = pl[i];
        var do_append = false;
        if (pri == max) {
          do_append = true;
        }
        if (pri < max) {
          let compare = pr[pri];
          if (token.coord.less_than(compare.coord)) {
            do_append = true;
          } else if (token.coord.equals(compare.coord)) {
            ++pri;
          }
        }
        if (do_append) {
          result += this.append_scroll(token, coord);
          coord.advance_to(token.coord);
        }
      }
      return result;
    });
    __publicField(this, "is_phext_break", (byte) => {
      return byte == this.LINE_BREAK || byte == this.SCROLL_BREAK || byte == this.SECTION_BREAK || byte == this.CHAPTER_BREAK || byte == this.BOOK_BREAK || byte == this.VOLUME_BREAK || byte == this.COLLECTION_BREAK || byte == this.SERIES_BREAK || byte == this.SHELF_BREAK || byte == this.LIBRARY_BREAK;
    });
    __publicField(this, "normalize", (phext) => {
      var arr = this.phokenize(phext);
      return this.dephokenize(arr);
    });
    // Explode a phext document into a Map from canonical coordinate strings
    // ("1.1.1/1.1.1/1.1.1") to scroll text — the JS counterpart of libphext-rs's
    // explode(). rs keys a HashMap by Coordinate; a JS Map keys primitives by
    // value, so the canonical string is the key here. Coordinate.to_string()
    // produces it and new Coordinate(key) parses it back; Coordinate.equals()
    // gives the value-equality story.
    __publicField(this, "explode", (phext) => {
      var result = /* @__PURE__ */ new Map();
      const phokens = this.phokenize(phext);
      for (var i = 0; i < phokens.length; ++i) {
        result.set(phokens[i].coord.to_string(), phokens[i].scroll);
      }
      return result;
    });
    // Serialize a Map of coordinate strings to scroll text back into a phext
    // document — the counterpart of rs's implode(). Entries are sorted by
    // coordinate before serialization. Entries with empty scroll text are
    // dropped, exactly as rs's implode drops them via dephokenize.
    __publicField(this, "implode", (map) => {
      var phokens = new Array();
      map.forEach((scroll, address) => {
        phokens.push(new PositionedScroll(new Coordinate(address), scroll, new Coordinate(), ""));
      });
      phokens.sort((a, b) => {
        if (a.coord.less_than(b.coord)) {
          return -1;
        }
        if (a.coord.greater_than(b.coord)) {
          return 1;
        }
        return 0;
      });
      return this.dephokenize(phokens);
    });
    __publicField(this, "to_coordinate", (address) => {
      var result = new Coordinate();
      var index = 0;
      var value = 0;
      var exp = 10;
      for (var i = 0; i < address.length; ++i) {
        var byte = address[i];
        if (byte == this.ADDRESS_MICRO_BREAK || byte == this.ADDRESS_MACRO_BREAK || byte == this.ADDRESS_MACRO_ALT) {
          switch (index) {
            case 1:
              result.z.library = sanitize_component(value);
              index += 1;
              break;
            case 2:
              result.z.shelf = sanitize_component(value);
              index += 1;
              break;
            case 3:
              result.z.series = sanitize_component(value);
              index += 1;
              break;
            case 4:
              result.y.collection = sanitize_component(value);
              index += 1;
              break;
            case 5:
              result.y.volume = sanitize_component(value);
              index += 1;
              break;
            case 6:
              result.y.book = sanitize_component(value);
              index += 1;
              break;
            case 7:
              result.x.chapter = sanitize_component(value);
              index += 1;
              break;
            case 8:
              result.x.section = sanitize_component(value);
              index += 1;
              break;
          }
          value = 0;
        }
        if (byte >= "0" && byte <= "9") {
          value = exp * value + parseInt(byte);
          if (value > MAX_COMPONENT) {
            throw new Error(`libphext: coordinate component in "${address}" exceeds MAX_COMPONENT (${MAX_COMPONENT}) \u2014 a JS number cannot represent it exactly`);
          }
          if (index == 0) {
            index = 1;
          }
        }
      }
      if (index > 0) {
        result.x.scroll = sanitize_component(value);
      }
      return result;
    });
    // -------------------------------------------------------------------------------------------------------
    // Binary scrolls (0.5.0) — ported 1:1 from libphext-rs src/binary.rs.
    //
    // Phext scrolls are text (valid UTF-8). Arbitrary binary data rides as
    // text via base64, in the one canonical binary scroll format:
    //
    //   phext-binary:1:base64
    //   <base64 body>
    //
    // Line 1 is exactly `phext-binary:1:base64` plus a single line break.
    // The body is RFC 4648 base64: standard alphabet, padding required, no
    // line wrapping, no whitespace. An empty payload is the header line
    // alone. A scroll whose content begins with the header line is a binary
    // scroll by definition; a prefix-matching scroll whose body is not
    // strict base64 is a *malformed* binary scroll.
    //
    // The ingestion rule (canonical behaviour, all ports): when non-UTF-8
    // data is observed in an incoming scroll update, we encode it with
    // base64 verbatim. Byte-oriented entry points (insert_bytes,
    // replace_bytes, ingest) never reject and never throw on non-UTF-8
    // scroll data: valid UTF-8 is stored as ordinary text; anything else is
    // stored as a binary scroll holding the base64 of the exact observed
    // bytes — verbatim, with no normalisation — so the matching fetch
    // returns the original bytes exactly.
    // -------------------------------------------------------------------------------------------------------
    // true when `scroll` carries the binary scroll header. Decoding
    // success is a separate question — see decode_scroll.
    __publicField(this, "is_binary_scroll", (scroll) => {
      return scroll.startsWith(BINARY_SCROLL_PREFIX);
    });
    // encodes raw bytes as a binary scroll (header line + base64 body)
    __publicField(this, "encode_scroll", (payload) => {
      return BINARY_SCROLL_PREFIX + import_buffer.Buffer.from(payload).toString("base64");
    });
    // decodes a binary scroll back to its raw bytes. Returns null when the
    // scroll is not a binary scroll, or when its body is not strict base64.
    __publicField(this, "decode_scroll", (scroll) => {
      if (!scroll.startsWith(BINARY_SCROLL_PREFIX)) {
        return null;
      }
      const body = scroll.substring(BINARY_SCROLL_PREFIX.length);
      return strict_base64_decode(body);
    });
    // stores `payload` at `location` as a binary scroll, unconditionally:
    // the caller has declared this scroll binary, even if the bytes happen
    // to be valid UTF-8.
    __publicField(this, "insert_binary", (input, location, payload) => {
      return this.insert(input, location, this.encode_scroll(payload));
    });
    // replaces the scroll at `location` with `payload`, stored as a binary
    // scroll (see insert_binary).
    __publicField(this, "replace_binary", (input, location, payload) => {
      return this.replace(input, location, this.encode_scroll(payload));
    });
    // retrieves the bytes held at `target`. A well-formed binary scroll
    // decodes to its payload. Any other scroll — plain text, a malformed
    // binary scroll, or no scroll at all — yields the scroll's own UTF-8
    // bytes (empty when the coordinate is unoccupied), mirroring how
    // fetch returns "" there. This function is total: it never throws and
    // never loses scroll content.
    __publicField(this, "fetch_binary", (input, target) => {
      const scroll = this.fetch(input, target);
      const decoded = this.decode_scroll(scroll);
      if (decoded !== null) {
        return decoded;
      }
      return import_buffer.Buffer.from(scroll, "utf-8");
    });
    // byte-oriented insert: stores `payload` at `location` under the
    // ingestion rule (UTF-8 as text, non-UTF-8 as a base64-verbatim binary
    // scroll).
    __publicField(this, "insert_bytes", (input, location, payload) => {
      return this.insert(input, location, stored_form(this, payload));
    });
    // byte-oriented replace: stores `payload` at `location` under the
    // ingestion rule (UTF-8 as text, non-UTF-8 as a base64-verbatim binary
    // scroll).
    __publicField(this, "replace_bytes", (input, location, payload) => {
      return this.replace(input, location, stored_form(this, payload));
    });
    // the byte-level twin of phokenize: walks a raw byte stream and
    // returns each scroll's coordinate and raw bytes, with identical
    // segmentation. Dimension-break bytes are ASCII, so byte offsets are
    // exact; scroll bodies are returned uninterpreted, valid UTF-8 or not.
    // A literal translation of libphext-rs binary::phokenize_bytes.
    __publicField(this, "phokenize_bytes", (input) => {
      const data = import_buffer.Buffer.from(input);
      const result = [];
      const max = data.length;
      var coord = new Coordinate();
      var pi = 0;
      while (true) {
        const begin0 = new Coordinate(coord.to_string());
        var begin = begin0;
        var text_start = -1;
        var text_end = max;
        while (pi < max) {
          const byte = data[pi];
          if (is_structural_break(byte)) {
            apply_break(coord, byte);
            if (text_start >= 0) {
              text_end = pi;
              pi += 1;
              break;
            }
          } else if (text_start < 0) {
            text_start = pi;
            begin = new Coordinate(coord.to_string());
          }
          pi += 1;
        }
        const scroll = text_start >= 0 ? import_buffer.Buffer.from(data.subarray(text_start, text_end)) : import_buffer.Buffer.alloc(0);
        result.push({ coord: begin, bytes: scroll });
        if (pi >= max) {
          break;
        }
      }
      return result;
    });
    // ingests an externally supplied phext byte stream. Every scroll is
    // observed as raw bytes: valid UTF-8 scrolls pass through verbatim, and
    // any scroll whose bytes are not valid UTF-8 is stored as a binary
    // scroll holding the base64 of the exact observed bytes (the ingestion
    // rule), so fetch_binary at its coordinate returns the original bytes
    // exactly. Never rejects, never throws. The result is the canonical
    // serialization (the same normal form as implode of explode).
    __publicField(this, "ingest", (data) => {
      const parts = this.phokenize_bytes(data);
      const map = /* @__PURE__ */ new Map();
      for (const part of parts) {
        const text = try_utf8_decode(part.bytes);
        map.set(part.coord.to_string(), text !== null ? text : this.encode_scroll(part.bytes));
      }
      return this.implode(map);
    });
    // -------------------------------------------------------------------------------------------------------
    // Chains (0.6.0) — ported 1:1 from libphext-rs src/phext.rs (chain
    // layer + multiverse addressing).
    //
    // A chain is an ordered series of complete phexts within one stream,
    // joined by CHAIN_BREAK (0x02) and optionally terminated by CHAIN_CLOSE
    // (0x03). The chain layer is a stream-level layer, one rung above the
    // library break: the nine dimension breaks structure a single phext,
    // while the two chain bytes structure a stream of phexts. Each member
    // is a whole phext; read in succession, a chain's members are editions
    // in sequence — the chain is how a phext stream encodes time.
    //
    // `closed` records how the chain ended: true when a CHAIN_CLOSE
    // terminated it, false when the stream simply ran out (EOF). A chain
    // that ends at EOF is unclosed — possibly truncated — and is never
    // silently promoted to closed. A stream with no chain bytes at all is
    // a single unclosed chain holding one member phext: every pre-0.6
    // phext reads this way.
    //
    // Multiverse addressing: inside a chain, members are universes indexed
    // from 1. "$N:<address>" fetches the scroll at <address> in universe N
    // of that chain; a bare <address> means universe 1.
    // -------------------------------------------------------------------------------------------------------
    // splits a stream into its chains. CHAIN_BREAK separates the member
    // phexts of a chain; CHAIN_CLOSE terminates a chain, and whatever
    // follows it opens the next one — so one stream may hold many chains.
    // The stream's final chain is closed only when the stream ends with
    // CHAIN_CLOSE. Splitting follows split semantics, so empty members
    // and empty chains are preserved exactly: parse and serialize are
    // byte-exact inverses for every stream.
    __publicField(this, "parse_chains", (input) => {
      const ends_closed = input.endsWith(this.CHAIN_CLOSE);
      var segments = input.split(this.CHAIN_CLOSE);
      if (ends_closed) {
        segments.pop();
      }
      const count = segments.length;
      const chains = [];
      for (var i = 0; i < count; ++i) {
        const closed = ends_closed || i + 1 < count;
        chains.push(new Chain(segments[i].split(this.CHAIN_BREAK), closed));
      }
      return chains;
    });
    // serializes a stream of chains back into stream bytes: the inverse
    // of parse_chains.
    __publicField(this, "serialize_chains", (chains) => {
      var result = "";
      for (const chain of chains) {
        result += chain.serialize();
      }
      return result;
    });
    // parses a multiverse address into [universe, coordinate], or null
    // when the universe prefix is malformed ($0:, a missing colon, or a
    // non-numeric universe). A bare address is universe 1.
    __publicField(this, "parse_universe_address", (address) => {
      var universe = 1;
      var coord_part = address;
      if (address.startsWith("$")) {
        const rest = address.substring(1);
        const colon = rest.indexOf(":");
        if (colon < 0) {
          return null;
        }
        const num = rest.substring(0, colon);
        if (!/^[0-9]+$/.test(num)) {
          return null;
        }
        universe = parseInt(num, 10);
        if (universe < 1) {
          return null;
        }
        coord_part = rest.substring(colon + 1);
      }
      return [universe, this.to_coordinate(coord_part)];
    });
    // -------------------------------------------------------------------------------------------------------
    // Line/column addressing (0.6.1) — ported 1:1 from libphext-rs
    // src/phext.rs (the addressing section at the end of that file).
    //
    // A point address is "[$N:]<9D coordinate>@<line>,<column>": the
    // multiverse prefix and the coordinate exactly as in
    // parse_universe_address, plus a within-scroll caret position. Line
    // and column are 1-based; a position names a caret boundary (column 1
    // is the boundary before the line's first character; a line of n
    // characters has valid columns 1..n+1), and columns count Unicode
    // scalar values — JS strings are UTF-16, so all counting here walks
    // code points (for..of / Array.from), never .length or indexing. A
    // point may carry "+<offsetChars>": select forward that many
    // characters (scalars) from the point, counted within the scroll,
    // terminating at the scroll boundary.
    //
    // A range address is two point addresses joined by one hyphen:
    // "<point>-<point>". The endpoints may span scrolls and universes; an
    // endpoint without "@" names its whole scroll (as start: its first
    // boundary; as end: its last). Canonical form: endpoints in ascending
    // (universe, coordinate, line, column) order — direction is
    // discarded — "$1:" never written, integers in minimal decimal form.
    // Out-of-range endpoints fail at resolution, never clamp.
    // -------------------------------------------------------------------------------------------------------
    // parses a v0.6.1 point address:
    // "[$N:]<coordinate>[@<line>,<column>[+<offsetChars>]]". Returns null
    // on any malformed input: universe 0, a coordinate component below
    // 1, a line or column below 1, a sign anywhere, or trailing
    // structure. "$1:" is accepted on input; the canonical serialized
    // form never emits it.
    __publicField(this, "parse_point_address", (address) => {
      var universe = 1;
      var rest = address;
      if (address.startsWith("$")) {
        const stripped = address.substring(1);
        const colon = stripped.indexOf(":");
        if (colon < 0) {
          return null;
        }
        const n = parse_address_uint(stripped.substring(0, colon));
        if (n === null || n < 1) {
          return null;
        }
        universe = n;
        rest = stripped.substring(colon + 1);
      }
      var coord_part = rest;
      var pos_part = null;
      const at_index = rest.indexOf("@");
      if (at_index >= 0) {
        coord_part = rest.substring(0, at_index);
        pos_part = rest.substring(at_index + 1);
        if (pos_part.indexOf("@") >= 0) {
          return null;
        }
      }
      const coordinate = parse_address_coordinate(coord_part);
      if (coordinate === null) {
        return null;
      }
      var position = null;
      var offset = null;
      if (pos_part !== null) {
        const comma = pos_part.indexOf(",");
        if (comma < 0) {
          return null;
        }
        const line = parse_address_uint(pos_part.substring(0, comma));
        if (line === null) {
          return null;
        }
        const col_part = pos_part.substring(comma + 1);
        var col_text = col_part;
        var offset_value = null;
        const plus = col_part.indexOf("+");
        if (plus >= 0) {
          col_text = col_part.substring(0, plus);
          offset_value = parse_address_uint(col_part.substring(plus + 1));
          if (offset_value === null) {
            return null;
          }
        }
        const column = parse_address_uint(col_text);
        if (column === null) {
          return null;
        }
        if (line < 1 || column < 1) {
          return null;
        }
        position = { line, column };
        offset = offset_value;
      }
      return { universe, coordinate, position, offset };
    });
    // parses a v0.6.1 range address: exactly two point addresses joined
    // by one hyphen. The endpoints are normalized to ascending order
    // (direction is discarded, per the ratified spec). Range endpoints
    // may not carry a "+offset" — the offset form never takes a second
    // endpoint. Returns null on malformed input.
    __publicField(this, "parse_range_address", (address) => {
      const dash = address.indexOf("-");
      if (dash < 0) {
        return null;
      }
      const first = address.substring(0, dash);
      const second = address.substring(dash + 1);
      if (second.indexOf("-") >= 0) {
        return null;
      }
      const a = this.parse_point_address(first);
      if (a === null) {
        return null;
      }
      const b = this.parse_point_address(second);
      if (b === null) {
        return null;
      }
      if (a.offset !== null || b.offset !== null) {
        return null;
      }
      if (endpoint_cmp(a, true, b, false) > 0) {
        return { start: b, end: a };
      }
      return { start: a, end: b };
    });
    // the canonical serialization of a point address (the counterpart of
    // libphext-rs's Display for PointAddress): "$1:" never written,
    // integers in minimal decimal form.
    __publicField(this, "serialize_point_address", (point) => {
      var result = "";
      if (point.universe > 1) {
        result += `$${point.universe}:`;
      }
      result += point.coordinate.to_string();
      if (point.position !== null) {
        result += `@${point.position.line},${point.position.column}`;
        if (point.offset !== null) {
          result += `+${point.offset}`;
        }
      }
      return result;
    });
    // the canonical serialization of a range address: its two endpoints
    // in ascending order, joined by one hyphen.
    __publicField(this, "serialize_range_address", (range) => {
      return `${this.serialize_point_address(range.start)}-${this.serialize_point_address(range.end)}`;
    });
    // The scroll text at a coordinate in one member phext, in the
    // phokenize sense of presence: a coordinate is present exactly when
    // phokenize enumerates it. The byte-level walker carries the
    // reference enumeration (the text phokenize stops at the first empty
    // scroll — see the chain-fixture suite), so presence and text are
    // read from phokenize_bytes; member text is valid UTF-8, so each
    // enumerated scroll's bytes decode back exactly.
    __publicField(this, "addressed_scroll_text", (member, target) => {
      const scrolls = this.phokenize_bytes(import_buffer.Buffer.from(member, "utf-8"));
      for (const s of scrolls) {
        if (s.coord.equals(target)) {
          return s.bytes.toString("utf-8");
        }
      }
      return null;
    });
    // -------------------------------------------------------------------------------------------------------
    // The xz seal (0.5.0) — semantics ported 1:1 from libphext-rs
    // src/seal.rs; call shape adapted to the Node binding.
    //
    // Compression is a seal, not a working format. A phext is authored,
    // edited, and queried as plain text; when a phext is finished —
    // archived, published, or transported — it may be sealed:
    // xz-compressed as a whole. Unsealing restores the exact original
    // bytes.
    //
    // * The seal is a standard xz stream (liblzma, via the lzma-native
    //   binding) over the phext's exact bytes. Decoders in any
    //   implementation must accept any valid xz stream.
    // * This implementation encodes at preset 6 with the CRC64 check —
    //   the same encoder settings as libphext-rs (xz2 preset 6, CRC64) —
    //   so sealed bytes are byte-identical across implementations for the
    //   same input. The preset is an encoder choice, not a format
    //   requirement; seals produced at other presets unseal identically.
    // * Sealing is deterministic for a given encoder and preset.
    //
    // Call shape: lzma-native exposes compression only through its
    // async (callback/promise) API — there is no synchronous entry point —
    // so the seal functions return Promises where the Rust functions
    // return values. The byte format is unchanged.
    // -------------------------------------------------------------------------------------------------------
    // seals a phext: xz-compresses its full UTF-8 bytes.
    __publicField(this, "seal", async (input) => {
      return this.seal_bytes(import_buffer.Buffer.from(input, "utf-8"));
    });
    // seals raw phext bytes (see seal).
    __publicField(this, "seal_bytes", async (input) => {
      return compress(import_buffer.Buffer.from(input), { preset: SEAL_PRESET, check: LZMA_CHECK_CRC64 });
    });
    // unseals a sealed phext back to its exact original bytes. Rejects
    // when the data is not a valid xz stream.
    __publicField(this, "unseal", async (data) => {
      return decompress(import_buffer.Buffer.from(data));
    });
    // unseals directly to text. Rejects when the unsealed bytes are not
    // valid UTF-8; to unseal foreign content that may carry non-UTF-8
    // scrolls, unseal to bytes and pass them through ingest, which
    // applies the base64-verbatim ingestion rule instead of failing.
    __publicField(this, "unseal_string", async (data) => {
      const bytes = await this.unseal(data);
      const text = try_utf8_decode(bytes);
      if (text === null) {
        throw new Error("libphext: unsealed bytes are not valid UTF-8");
      }
      return text;
    });
    this.COORDINATE_MINIMUM = 1;
    this.MAX_COMPONENT = MAX_COMPONENT;
    this.LIBRARY_BREAK = "";
    this.CHAIN_BREAK = "";
    this.CHAIN_CLOSE = "";
    this.MORE_COWBELL = "\x07";
    this.LINE_BREAK = "\n";
    this.SCROLL_BREAK = "";
    this.SECTION_BREAK = "";
    this.CHAPTER_BREAK = "";
    this.BOOK_BREAK = "";
    this.VOLUME_BREAK = "";
    this.COLLECTION_BREAK = "";
    this.SERIES_BREAK = "";
    this.SHELF_BREAK = "";
    this.ADDRESS_MICRO_BREAK = ".";
    this.ADDRESS_MACRO_BREAK = "/";
    this.ADDRESS_MACRO_ALT = ";";
  }
};
var Chain = class _Chain {
  constructor(members = [], closed = false) {
    __publicField(this, "members");
    __publicField(this, "closed");
    // serializes this chain alone: its members joined by CHAIN_BREAK,
    // with a trailing CHAIN_CLOSE when the chain is closed. See
    // Phext.serialize_chains for whole streams.
    __publicField(this, "serialize", () => {
      var result = this.members.join(__internal_phext.CHAIN_BREAK);
      if (this.closed) {
        result += __internal_phext.CHAIN_CLOSE;
      }
      return result;
    });
    // Fetch a scroll by multiverse address: "$N:coord", or a bare
    // coordinate (universe 1). Out-of-range universes, malformed universe
    // prefixes, and missing scrolls all yield an empty string, as fetch
    // does for a missing scroll.
    __publicField(this, "fetch", (address) => {
      const parsed = __internal_phext.parse_universe_address(address);
      if (parsed === null) {
        return "";
      }
      const [universe, coord] = parsed;
      const member = this.members[universe - 1];
      if (member === void 0) {
        return "";
      }
      return __internal_phext.fetch(member, coord);
    });
    // resolves a point address against this chain: [universe,
    // coordinate, character offset within the scroll] — the counterpart
    // of libphext-rs Chain::resolve_point's (usize, Coordinate, usize)
    // tuple. A point without "@" resolves to offset 0 of its scroll.
    // Null when the universe or scroll is absent or the position is out
    // of range — never clamps.
    __publicField(this, "resolve_point", (point) => {
      if (point.universe < 1 || point.universe > this.members.length) {
        return null;
      }
      const text = __internal_phext.addressed_scroll_text(this.members[point.universe - 1], point.coordinate);
      if (text === null) {
        return null;
      }
      var offset = 0;
      if (point.position !== null) {
        const resolved = resolve_scroll_offset(text, point.position);
        if (resolved === null) {
          return null;
        }
        offset = resolved;
      }
      return [point.universe, point.coordinate, offset];
    });
    // fetches a point address string. A bare point is a caret: it
    // fetches the empty string. The offset form fetches the selected
    // characters: from the point, forward `offset` characters (scalars)
    // within the scroll, terminating at the scroll boundary. Any parse
    // or resolution failure fetches the empty string, as fetch does.
    __publicField(this, "fetch_point", (address) => {
      const point = __internal_phext.parse_point_address(address);
      if (point === null) {
        return "";
      }
      if (point.offset === null) {
        return "";
      }
      const resolved = this.resolve_point(point);
      if (resolved === null) {
        return "";
      }
      const text = __internal_phext.addressed_scroll_text(this.members[point.universe - 1], point.coordinate);
      if (text === null) {
        return "";
      }
      return Array.from(text).slice(resolved[2], resolved[2] + point.offset).join("");
    });
    // resolves a range against this chain into per-scroll segments:
    // [universe, coordinate, segment text] in ascending order. Middle
    // scrolls contribute their whole text; the endpoint scrolls
    // contribute from/to their endpoint boundaries (an endpoint without
    // "@" contributes its whole scroll). Null when either endpoint fails
    // to resolve — an out-of-range endpoint is an error, never a clamp.
    __publicField(this, "resolve_range", (range) => {
      const start = range.start;
      const end = range.end;
      if (start.universe < 1 || end.universe > this.members.length || start.universe > end.universe) {
        return null;
      }
      if (this.resolve_point({ universe: start.universe, coordinate: start.coordinate, position: start.position, offset: null }) === null) {
        return null;
      }
      if (this.resolve_point({ universe: end.universe, coordinate: end.coordinate, position: end.position, offset: null }) === null) {
        return null;
      }
      const segments = [];
      for (var universe = start.universe; universe <= end.universe; ++universe) {
        const member = this.members[universe - 1];
        const scrolls = __internal_phext.phokenize_bytes(import_buffer.Buffer.from(member, "utf-8"));
        scrolls.sort((a, b) => {
          if (a.coord.less_than(b.coord)) {
            return -1;
          }
          if (a.coord.greater_than(b.coord)) {
            return 1;
          }
          return 0;
        });
        for (const s of scrolls) {
          const coord = s.coord;
          if (universe == start.universe && coord.less_than(start.coordinate)) {
            continue;
          }
          if (universe == end.universe && coord.greater_than(end.coordinate)) {
            continue;
          }
          const scroll_text = s.bytes.toString("utf-8");
          const chars = Array.from(scroll_text);
          var lo = 0;
          var hi = chars.length;
          if (universe == start.universe && coord.equals(start.coordinate)) {
            if (start.position !== null) {
              const r = resolve_scroll_offset(scroll_text, start.position);
              if (r === null) {
                return null;
              }
              lo = r;
            }
          }
          if (universe == end.universe && coord.equals(end.coordinate)) {
            if (end.position !== null) {
              const r = resolve_scroll_offset(scroll_text, end.position);
              if (r === null) {
                return null;
              }
              hi = r;
            } else {
              hi = chars.length;
            }
          }
          if (lo > hi) {
            return null;
          }
          segments.push([universe, coord, chars.slice(lo, hi).join("")]);
        }
      }
      return segments;
    });
    // fetches a range address string: the spanned text with phext
    // structure bytes preserved — the covered segments re-assembled at
    // their coordinates into a phext (chain) fragment (scroll breaks
    // between covered scrolls inside a universe, CHAIN_BREAK between
    // universes, never a trailing CHAIN_CLOSE: a fragment is an
    // excerpt, not a terminated chain), so the result round-trips as a
    // phext fragment. Empty segments contribute nothing. Any parse or
    // resolution failure fetches the empty string, as fetch does.
    __publicField(this, "fetch_range", (address) => {
      const range = __internal_phext.parse_range_address(address);
      if (range === null) {
        return "";
      }
      const segments = this.resolve_range(range);
      if (segments === null) {
        return "";
      }
      const members = [];
      for (var universe = range.start.universe; universe <= range.end.universe; ++universe) {
        var member = "";
        for (const seg of segments) {
          if (seg[0] != universe) {
            continue;
          }
          if (seg[2].length > 0) {
            member = __internal_phext.insert(member, seg[1], seg[2]);
          }
        }
        members.push(member);
      }
      return new _Chain(members, false).serialize();
    });
    this.members = members;
    this.closed = closed;
  }
};
function parse_address_uint(text) {
  if (text.length == 0 || !/^[0-9]+$/.test(text)) {
    return null;
  }
  const value = Number(text);
  if (!Number.isSafeInteger(value)) {
    return null;
  }
  return value;
}
function parse_address_coordinate(text) {
  const arms = text.split("/");
  if (arms.length != 3) {
    return null;
  }
  const values = [];
  for (const arm of arms) {
    const parts = arm.split(".");
    if (parts.length != 3) {
      return null;
    }
    for (const part of parts) {
      const value = parse_address_uint(part);
      if (value === null || value < 1) {
        return null;
      }
      values.push(value);
    }
  }
  const canonical = `${values[0]}.${values[1]}.${values[2]}/${values[3]}.${values[4]}.${values[5]}/${values[6]}.${values[7]}.${values[8]}`;
  return new Coordinate(canonical);
}
function endpoint_position_key(point, is_start) {
  if (point.position !== null) {
    return [point.position.line, point.position.column];
  }
  return is_start ? [1, 1] : [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
}
function endpoint_cmp(a, a_is_start, b, b_is_start) {
  if (a.universe != b.universe) {
    return a.universe < b.universe ? -1 : 1;
  }
  if (a.coordinate.less_than(b.coordinate)) {
    return -1;
  }
  if (a.coordinate.greater_than(b.coordinate)) {
    return 1;
  }
  const ka = endpoint_position_key(a, a_is_start);
  const kb = endpoint_position_key(b, b_is_start);
  if (ka[0] != kb[0]) {
    return ka[0] < kb[0] ? -1 : 1;
  }
  if (ka[1] != kb[1]) {
    return ka[1] < kb[1] ? -1 : 1;
  }
  return 0;
}
function resolve_scroll_offset(text, pos) {
  if (pos.line < 1 || pos.column < 1) {
    return null;
  }
  var line = 1;
  var column = 1;
  var offset = 0;
  for (const ch of text) {
    if (line == pos.line && column == pos.column) {
      return offset;
    }
    if (ch == "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
    offset += 1;
  }
  if (line == pos.line && column == pos.column) {
    return offset;
  }
  return null;
}
var BINARY_SCROLL_PREFIX = BINARY_SCROLL_HEADER + "\n";
var LZMA_CHECK_CRC64 = 4;
function strict_base64_decode(body) {
  if (body.length % 4 != 0) {
    return null;
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(body)) {
    return null;
  }
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  if (body.endsWith("==")) {
    if (body.length < 4) {
      return null;
    }
    if ((alphabet.indexOf(body[body.length - 3]) & 15) != 0) {
      return null;
    }
  } else if (body.endsWith("=")) {
    if (body.length < 4) {
      return null;
    }
    if ((alphabet.indexOf(body[body.length - 2]) & 3) != 0) {
      return null;
    }
  }
  return import_buffer.Buffer.from(body, "base64");
}
var __utf8_decoder = new TextDecoder("utf-8", { fatal: true });
function try_utf8_decode(data) {
  try {
    return __utf8_decoder.decode(data);
  } catch (e) {
    return null;
  }
}
function stored_form(phext, payload) {
  const text = try_utf8_decode(payload);
  return text !== null ? text : phext.encode_scroll(payload);
}
function is_structural_break(byte) {
  return byte == 23 || // SCROLL_BREAK
  byte == 24 || // SECTION_BREAK
  byte == 25 || // CHAPTER_BREAK
  byte == 26 || // BOOK_BREAK
  byte == 28 || // VOLUME_BREAK
  byte == 29 || // COLLECTION_BREAK
  byte == 30 || // SERIES_BREAK
  byte == 31 || // SHELF_BREAK
  byte == 1;
}
function apply_break(coord, byte) {
  if (byte == 23) {
    coord.scroll_break();
  }
  if (byte == 24) {
    coord.section_break();
  }
  if (byte == 25) {
    coord.chapter_break();
  }
  if (byte == 26) {
    coord.book_break();
  }
  if (byte == 28) {
    coord.volume_break();
  }
  if (byte == 29) {
    coord.collection_break();
  }
  if (byte == 30) {
    coord.series_break();
  }
  if (byte == 31) {
    coord.shelf_break();
  }
  if (byte == 1) {
    coord.library_break();
  }
}
var Coordinate = class {
  constructor(value = "") {
    __publicField(this, "z");
    __publicField(this, "y");
    __publicField(this, "x");
    __publicField(this, "equals", (other) => {
      return this.z.library == other.z.library && this.z.shelf == other.z.shelf && this.z.series == other.z.series && this.y.collection == other.y.collection && this.y.volume == other.y.volume && this.y.book == other.y.book && this.x.chapter == other.x.chapter && this.x.section == other.x.section && this.x.scroll == other.x.scroll;
    });
    __publicField(this, "less_than", (other) => {
      if (this.z.library < other.z.library) {
        return true;
      }
      if (this.z.library > other.z.library) {
        return false;
      }
      if (this.z.shelf < other.z.shelf) {
        return true;
      }
      if (this.z.shelf > other.z.shelf) {
        return false;
      }
      if (this.z.series < other.z.series) {
        return true;
      }
      if (this.z.series > other.z.series) {
        return false;
      }
      if (this.y.collection < other.y.collection) {
        return true;
      }
      if (this.y.collection > other.y.collection) {
        return false;
      }
      if (this.y.volume < other.y.volume) {
        return true;
      }
      if (this.y.volume > other.y.volume) {
        return false;
      }
      if (this.y.book < other.y.book) {
        return true;
      }
      if (this.y.book > other.y.book) {
        return false;
      }
      if (this.x.chapter < other.x.chapter) {
        return true;
      }
      if (this.x.chapter > other.x.chapter) {
        return false;
      }
      if (this.x.section < other.x.section) {
        return true;
      }
      if (this.x.section > other.x.section) {
        return false;
      }
      if (this.x.scroll < other.x.scroll) {
        return true;
      }
      return false;
    });
    __publicField(this, "greater_than", (other) => {
      if (this.z.library > other.z.library) {
        return true;
      }
      if (this.z.library < other.z.library) {
        return false;
      }
      if (this.z.shelf > other.z.shelf) {
        return true;
      }
      if (this.z.shelf < other.z.shelf) {
        return false;
      }
      if (this.z.series > other.z.series) {
        return true;
      }
      if (this.z.series < other.z.series) {
        return false;
      }
      if (this.y.collection > other.y.collection) {
        return true;
      }
      if (this.y.collection < other.y.collection) {
        return false;
      }
      if (this.y.volume > other.y.volume) {
        return true;
      }
      if (this.y.volume < other.y.volume) {
        return false;
      }
      if (this.y.book > other.y.book) {
        return true;
      }
      if (this.y.book < other.y.book) {
        return false;
      }
      if (this.x.chapter > other.x.chapter) {
        return true;
      }
      if (this.x.chapter < other.x.chapter) {
        return false;
      }
      if (this.x.section > other.x.section) {
        return true;
      }
      if (this.x.section < other.x.section) {
        return false;
      }
      if (this.x.scroll > other.x.scroll) {
        return true;
      }
      return false;
    });
    __publicField(this, "advance_to", (other) => {
      var output = "";
      while (this.less_than(other)) {
        if (this.z.library < other.z.library) {
          output += __internal_phext.LIBRARY_BREAK;
          this.library_break();
          continue;
        }
        if (this.z.shelf < other.z.shelf) {
          output += __internal_phext.SHELF_BREAK;
          this.shelf_break();
          continue;
        }
        if (this.z.series < other.z.series) {
          output += __internal_phext.SERIES_BREAK;
          this.series_break();
          continue;
        }
        if (this.y.collection < other.y.collection) {
          output += __internal_phext.COLLECTION_BREAK;
          this.collection_break();
          continue;
        }
        if (this.y.volume < other.y.volume) {
          output += __internal_phext.VOLUME_BREAK;
          this.volume_break();
          continue;
        }
        if (this.y.book < other.y.book) {
          output += __internal_phext.BOOK_BREAK;
          this.book_break();
          continue;
        }
        if (this.x.chapter < other.x.chapter) {
          output += __internal_phext.CHAPTER_BREAK;
          this.chapter_break();
          continue;
        }
        if (this.x.section < other.x.section) {
          output += __internal_phext.SECTION_BREAK;
          this.section_break();
          continue;
        }
        if (this.x.scroll < other.x.scroll) {
          output += __internal_phext.SCROLL_BREAK;
          this.scroll_break();
          continue;
        }
      }
      return output;
    });
    __publicField(this, "validate_index", (index) => {
      return index >= __internal_phext.COORDINATE_MINIMUM;
    });
    __publicField(this, "validate_coordinate", () => {
      let ok = this.validate_index(this.z.library) && this.validate_index(this.z.shelf) && this.validate_index(this.z.series) && this.validate_index(this.y.collection) && this.validate_index(this.y.volume) && this.validate_index(this.y.book) && this.validate_index(this.x.chapter) && this.validate_index(this.x.section) && this.validate_index(this.x.scroll);
      return ok;
    });
    __publicField(this, "to_string", () => {
      return `${this.z.library}.${this.z.shelf}.${this.z.series}/${this.y.collection}.${this.y.volume}.${this.y.book}/${this.x.chapter}.${this.x.section}.${this.x.scroll}`;
    });
    __publicField(this, "to_urlencoded", () => {
      return this.to_string().replace(/\//g, ";");
    });
    __publicField(this, "advance_coordinate", (index) => {
      if (Number.isNaN(index)) {
        return __internal_phext.COORDINATE_MINIMUM;
      }
      return sanitize_component(index + 1);
    });
    __publicField(this, "library_break", () => {
      this.z.library = this.advance_coordinate(this.z.library);
      this.z.shelf = 1;
      this.z.series = 1;
      this.y = new YCoordinate();
      this.x = new XCoordinate();
    });
    __publicField(this, "shelf_break", () => {
      this.z.shelf = this.advance_coordinate(this.z.shelf);
      this.z.series = 1;
      this.y = new YCoordinate();
      this.x = new XCoordinate();
    });
    __publicField(this, "series_break", () => {
      this.z.series = this.advance_coordinate(this.z.series);
      this.y = new YCoordinate();
      this.x = new XCoordinate();
    });
    __publicField(this, "collection_break", () => {
      this.y.collection = this.advance_coordinate(this.y.collection);
      this.y.volume = 1;
      this.y.book = 1;
      this.x = new XCoordinate();
    });
    __publicField(this, "volume_break", () => {
      this.y.volume = this.advance_coordinate(this.y.volume);
      this.y.book = 1;
      this.x = new XCoordinate();
    });
    __publicField(this, "book_break", () => {
      this.y.book = this.advance_coordinate(this.y.book);
      this.x = new XCoordinate();
    });
    __publicField(this, "chapter_break", () => {
      this.x.chapter = this.advance_coordinate(this.x.chapter);
      this.x.section = 1;
      this.x.scroll = 1;
    });
    __publicField(this, "section_break", () => {
      this.x.section = this.advance_coordinate(this.x.section);
      this.x.scroll = 1;
    });
    __publicField(this, "scroll_break", () => {
      this.x.scroll = this.advance_coordinate(this.x.scroll);
    });
    this.z = new ZCoordinate(1, 1, 1);
    this.y = new YCoordinate(1, 1, 1);
    this.x = new XCoordinate(1, 1, 1);
    if (value.length > 0) {
      var parts = value.replace(/\//g, ".").split(".");
      var fields = [
        (n) => {
          this.z.library = n;
        },
        (n) => {
          this.z.shelf = n;
        },
        (n) => {
          this.z.series = n;
        },
        (n) => {
          this.y.collection = n;
        },
        (n) => {
          this.y.volume = n;
        },
        (n) => {
          this.y.book = n;
        },
        (n) => {
          this.x.chapter = n;
        },
        (n) => {
          this.x.section = n;
        },
        (n) => {
          this.x.scroll = n;
        }
      ];
      for (var i = 0; i < parts.length && i < fields.length; ++i) {
        fields[i](sanitize_component(parseInt(parts[i])));
      }
    }
  }
};
var __utf8_encoder = new TextEncoder();
function utf8_length(text) {
  return __utf8_encoder.encode(text).length;
}
function sanitize_component(value) {
  if (Number.isNaN(value)) {
    return __internal_phext.COORDINATE_MINIMUM;
  }
  if (value > MAX_COMPONENT) {
    throw new Error(`libphext: coordinate component ${value} exceeds MAX_COMPONENT (${MAX_COMPONENT}) \u2014 a JS number cannot represent it exactly`);
  }
  if (value < __internal_phext.COORDINATE_MINIMUM) {
    return __internal_phext.COORDINATE_MINIMUM;
  }
  return value;
}
var __internal_phext = new Phext();
var OffsetsAndCoordinate = class {
  constructor(start, end, coord, fallback) {
    __publicField(this, "start");
    __publicField(this, "end");
    __publicField(this, "coord");
    __publicField(this, "fallback");
    this.start = start;
    this.end = end;
    this.coord = coord;
    this.fallback = fallback;
  }
};
var PositionedScroll = class {
  constructor(coord, scroll, next, remaining) {
    __publicField(this, "coord");
    __publicField(this, "scroll");
    __publicField(this, "next");
    __publicField(this, "remaining");
    this.coord = coord;
    this.scroll = scroll;
    this.next = next;
    this.remaining = remaining;
  }
};
var Range = class {
  constructor(start, end) {
    __publicField(this, "start");
    __publicField(this, "end");
    this.start = start;
    this.end = end;
  }
};
var ZCoordinate = class {
  constructor(library = 1, shelf = 1, series = 1) {
    __publicField(this, "library");
    __publicField(this, "shelf");
    __publicField(this, "series");
    this.library = sanitize_component(library);
    this.shelf = sanitize_component(shelf);
    this.series = sanitize_component(series);
  }
};
var YCoordinate = class {
  constructor(collection = 1, volume = 1, book = 1) {
    __publicField(this, "collection");
    __publicField(this, "volume");
    __publicField(this, "book");
    this.collection = sanitize_component(collection);
    this.volume = sanitize_component(volume);
    this.book = sanitize_component(book);
  }
};
var XCoordinate = class {
  constructor(chapter = 1, section = 1, scroll = 1) {
    __publicField(this, "chapter");
    __publicField(this, "section");
    __publicField(this, "scroll");
    this.chapter = sanitize_component(chapter);
    this.section = sanitize_component(section);
    this.scroll = sanitize_component(scroll);
  }
};
export {
  BINARY_SCROLL_HEADER,
  Chain,
  Coordinate,
  MAX_COMPONENT,
  Phext,
  SEAL_PRESET
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
