!function() {
    function g(n, r) {
        var t = (65535 & n) + (65535 & r);
        return (n >> 16) + (r >> 16) + (t >> 16) << 16 | 65535 & t;
    }
    function f(n, r, t, e, o, u) {
        return g((u = g(g(r, n), g(e, u))) << (o = o) | u >>> 32 - o, t);
    }
    function l(n, r, t, e, o, u, c) {
        return f(r & t | ~r & e, n, r, o, u, c);
    }
    function v(n, r, t, e, o, u, c) {
        return f(r & e | t & ~e, n, r, o, u, c);
    }
    function d(n, r, t, e, o, u, c) {
        return f(r ^ t ^ e, n, r, o, u, c);
    }
    function C(n, r, t, e, o, u, c) {
        return f(t ^ (r | ~e), n, r, o, u, c);
    }
    function c(n, r) {
        var t, e, o, u;
        n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r;
        for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16) c = l(t = c, e = f, o = i, u = a, n[h], 7, -680876936), 
        a = l(a, c, f, i, n[h + 1], 12, -389564586), i = l(i, a, c, f, n[h + 2], 17, 606105819), 
        f = l(f, i, a, c, n[h + 3], 22, -1044525330), c = l(c, f, i, a, n[h + 4], 7, -176418897), 
        a = l(a, c, f, i, n[h + 5], 12, 1200080426), i = l(i, a, c, f, n[h + 6], 17, -1473231341), 
        f = l(f, i, a, c, n[h + 7], 22, -45705983), c = l(c, f, i, a, n[h + 8], 7, 1770035416), 
        a = l(a, c, f, i, n[h + 9], 12, -1958414417), i = l(i, a, c, f, n[h + 10], 17, -42063), 
        f = l(f, i, a, c, n[h + 11], 22, -1990404162), c = l(c, f, i, a, n[h + 12], 7, 1804603682), 
        a = l(a, c, f, i, n[h + 13], 12, -40341101), i = l(i, a, c, f, n[h + 14], 17, -1502002290), 
        c = v(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510), 
        a = v(a, c, f, i, n[h + 6], 9, -1069501632), i = v(i, a, c, f, n[h + 11], 14, 643717713), 
        f = v(f, i, a, c, n[h], 20, -373897302), c = v(c, f, i, a, n[h + 5], 5, -701558691), 
        a = v(a, c, f, i, n[h + 10], 9, 38016083), i = v(i, a, c, f, n[h + 15], 14, -660478335), 
        f = v(f, i, a, c, n[h + 4], 20, -405537848), c = v(c, f, i, a, n[h + 9], 5, 568446438), 
        a = v(a, c, f, i, n[h + 14], 9, -1019803690), i = v(i, a, c, f, n[h + 3], 14, -187363961), 
        f = v(f, i, a, c, n[h + 8], 20, 1163531501), c = v(c, f, i, a, n[h + 13], 5, -1444681467), 
        a = v(a, c, f, i, n[h + 2], 9, -51403784), i = v(i, a, c, f, n[h + 7], 14, 1735328473), 
        c = d(c, f = v(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558), 
        a = d(a, c, f, i, n[h + 8], 11, -2022574463), i = d(i, a, c, f, n[h + 11], 16, 1839030562), 
        f = d(f, i, a, c, n[h + 14], 23, -35309556), c = d(c, f, i, a, n[h + 1], 4, -1530992060), 
        a = d(a, c, f, i, n[h + 4], 11, 1272893353), i = d(i, a, c, f, n[h + 7], 16, -155497632), 
        f = d(f, i, a, c, n[h + 10], 23, -1094730640), c = d(c, f, i, a, n[h + 13], 4, 681279174), 
        a = d(a, c, f, i, n[h], 11, -358537222), i = d(i, a, c, f, n[h + 3], 16, -722521979), 
        f = d(f, i, a, c, n[h + 6], 23, 76029189), c = d(c, f, i, a, n[h + 9], 4, -640364487), 
        a = d(a, c, f, i, n[h + 12], 11, -421815835), i = d(i, a, c, f, n[h + 15], 16, 530742520), 
        c = C(c, f = d(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844), 
        a = C(a, c, f, i, n[h + 7], 10, 1126891415), i = C(i, a, c, f, n[h + 14], 15, -1416354905), 
        f = C(f, i, a, c, n[h + 5], 21, -57434055), c = C(c, f, i, a, n[h + 12], 6, 1700485571), 
        a = C(a, c, f, i, n[h + 3], 10, -1894986606), i = C(i, a, c, f, n[h + 10], 15, -1051523), 
        f = C(f, i, a, c, n[h + 1], 21, -2054922799), c = C(c, f, i, a, n[h + 8], 6, 1873313359), 
        a = C(a, c, f, i, n[h + 15], 10, -30611744), i = C(i, a, c, f, n[h + 6], 15, -1560198380), 
        f = C(f, i, a, c, n[h + 13], 21, 1309151649), c = C(c, f, i, a, n[h + 4], 6, -145523070), 
        a = C(a, c, f, i, n[h + 11], 10, -1120210379), i = C(i, a, c, f, n[h + 2], 15, 718787259), 
        f = C(f, i, a, c, n[h + 9], 21, -343485551), c = g(c, t), f = g(f, e), i = g(i, o), 
        a = g(a, u);
        return [ c, f, i, a ];
    }
    function i(n) {
        for (var r = "", t = 32 * n.length, e = 0; e < t; e += 8) r += String.fromCharCode(n[e >> 5] >>> e % 32 & 255);
        return r;
    }
    function a(n) {
        var r = [];
        for (r[(n.length >> 2) - 1] = void 0, e = 0; e < r.length; e += 1) r[e] = 0;
        for (var t = 8 * n.length, e = 0; e < t; e += 8) r[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32;
        return r;
    }
    function e(n) {
        for (var r, t = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1) r = n.charCodeAt(o), 
        e += t.charAt(r >>> 4 & 15) + t.charAt(15 & r);
        return e;
    }
    function t(n) {
        return unescape(encodeURIComponent(n));
    }
    function o(n) {
        return i(c(a(n = t(n)), 8 * n.length));
    }
    function u(n, r) {
        return function(n, r) {
            var t, e = a(n), o = [], u = [];
            for (o[15] = u[15] = void 0, 16 < e.length && (e = c(e, 8 * n.length)), t = 0; t < 16; t += 1) o[t] = 909522486 ^ e[t], 
            u[t] = 1549556828 ^ e[t];
            return r = c(o.concat(a(r)), 512 + 8 * r.length), i(c(u.concat(r), 640));
        }(t(n), t(r));
    }
    module.exports = function(n, r, t) {
        return r ? t ? u(r, n) : e(u(r, n)) : t ? o(n) : e(o(n));
    };
}();