/*!
 * 
 *     ===========================================================================
 *     
 *      Copyright (C) 2006-2018 Talend Inc. - www.talend.com
 *     
 *      This source code is available under agreement available at
 *      https://github.com/Talend/data-prep/blob/master/LICENSE
 *     
 *      You should have received a copy of the agreement
 *      along with this program; if not, write to Talend SA
 *      9 rue Pages 92150 Suresnes, France
 *     
 *     ===========================================================================
 * 
 */
! function(e) {
    function t(a) {
        if (n[a]) return n[a].exports;
        var r = n[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        return e[a].call(r.exports, r, r.exports, t), r.l = !0, r.exports
    }
    var n = {};
    t.m = e, t.c = n, t.i = function(e) {
        return e
    }, t.d = function(e, n, a) {
        t.o(e, n) || Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: a
        })
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return t.d(n, "a", n), n
    }, t.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, t.p = "", t(t.s = 123)
}([function(e, t, n) {
    (function(e) {
        ! function(t, n) {
            e.exports = n()
        }(0, function() {
            "use strict";

            function t() {
                return Sa.apply(null, arguments)
            }

            function a(e) {
                return e instanceof Array || "[object Array]" === Object.prototype.toString.call(e)
            }

            function r(e) {
                return null != e && "[object Object]" === Object.prototype.toString.call(e)
            }

            function s(e) {
                if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(e).length;
                var t;
                for (t in e)
                    if (e.hasOwnProperty(t)) return !1;
                return !0
            }

            function i(e) {
                return void 0 === e
            }

            function o(e) {
                return "number" == typeof e || "[object Number]" === Object.prototype.toString.call(e)
            }

            function _(e) {
                return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e)
            }

            function d(e, t) {
                var n, a = [];
                for (n = 0; n < e.length; ++n) a.push(t(e[n], n));
                return a
            }

            function u(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }

            function l(e, t) {
                for (var n in t) u(t, n) && (e[n] = t[n]);
                return u(t, "toString") && (e.toString = t.toString), u(t, "valueOf") && (e.valueOf = t.valueOf), e
            }

            function m(e, t, n, a) {
                return wt(e, t, n, a, !0).utc()
            }

            function c() {
                return {
                    empty: !1,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -2,
                    charsLeftOver: 0,
                    nullInput: !1,
                    invalidMonth: null,
                    invalidFormat: !1,
                    userInvalidated: !1,
                    iso: !1,
                    parsedDateParts: [],
                    meridiem: null,
                    rfc2822: !1,
                    weekdayMismatch: !1
                }
            }

            function h(e) {
                return null == e._pf && (e._pf = c()), e._pf
            }

            function f(e) {
                if (null == e._isValid) {
                    var t = h(e),
                        n = Ha.call(t.parsedDateParts, function(e) {
                            return null != e
                        }),
                        a = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && n);
                    if (e._strict && (a = a && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), null != Object.isFrozen && Object.isFrozen(e)) return a;
                    e._isValid = a
                }
                return e._isValid
            }

            function M(e) {
                var t = m(NaN);
                return null != e ? l(h(t), e) : h(t).userInvalidated = !0, t
            }

            function L(e, t) {
                var n, a, r;
                if (i(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject), i(t._i) || (e._i = t._i), i(t._f) || (e._f = t._f), i(t._l) || (e._l = t._l), i(t._strict) || (e._strict = t._strict), i(t._tzm) || (e._tzm = t._tzm), i(t._isUTC) || (e._isUTC = t._isUTC), i(t._offset) || (e._offset = t._offset), i(t._pf) || (e._pf = h(t)), i(t._locale) || (e._locale = t._locale), ja.length > 0)
                    for (n = 0; n < ja.length; n++) a = ja[n], r = t[a], i(r) || (e[a] = r);
                return e
            }

            function y(e) {
                L(this, e), this._d = new Date(null != e._d ? e._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === xa && (xa = !0, t.updateOffset(this), xa = !1)
            }

            function Y(e) {
                return e instanceof y || null != e && null != e._isAMomentObject
            }

            function p(e) {
                return e < 0 ? Math.ceil(e) || 0 : Math.floor(e)
            }

            function k(e) {
                var t = +e,
                    n = 0;
                return 0 !== t && isFinite(t) && (n = p(t)), n
            }

            function D(e, t, n) {
                var a, r = Math.min(e.length, t.length),
                    s = Math.abs(e.length - t.length),
                    i = 0;
                for (a = 0; a < r; a++)(n && e[a] !== t[a] || !n && k(e[a]) !== k(t[a])) && i++;
                return i + s
            }

            function g(e) {
                !1 === t.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + e)
            }

            function v(e, n) {
                var a = !0;
                return l(function() {
                    if (null != t.deprecationHandler && t.deprecationHandler(null, e), a) {
                        for (var r, s = [], i = 0; i < arguments.length; i++) {
                            if (r = "", "object" == typeof arguments[i]) {
                                r += "\n[" + i + "] ";
                                for (var o in arguments[0]) r += o + ": " + arguments[0][o] + ", ";
                                r = r.slice(0, -2)
                            } else r = arguments[i];
                            s.push(r)
                        }
                        g(e + "\nArguments: " + Array.prototype.slice.call(s).join("") + "\n" + (new Error).stack), a = !1
                    }
                    return n.apply(this, arguments)
                }, n)
            }

            function w(e, n) {
                null != t.deprecationHandler && t.deprecationHandler(e, n), Oa[e] || (g(n), Oa[e] = !0)
            }

            function T(e) {
                return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e)
            }

            function b(e) {
                var t, n;
                for (n in e) t = e[n], T(t) ? this[n] = t : this["_" + n] = t;
                this._config = e, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source)
            }

            function S(e, t) {
                var n, a = l({}, e);
                for (n in t) u(t, n) && (r(e[n]) && r(t[n]) ? (a[n] = {}, l(a[n], e[n]), l(a[n], t[n])) : null != t[n] ? a[n] = t[n] : delete a[n]);
                for (n in e) u(e, n) && !u(t, n) && r(e[n]) && (a[n] = l({}, a[n]));
                return a
            }

            function H(e) {
                null != e && this.set(e)
            }

            function j(e, t, n) {
                var a = this._calendar[e] || this._calendar.sameElse;
                return T(a) ? a.call(t, n) : a
            }

            function x(e) {
                var t = this._longDateFormat[e],
                    n = this._longDateFormat[e.toUpperCase()];
                return t || !n ? t : (this._longDateFormat[e] = n.replace(/MMMM|MM|DD|dddd/g, function(e) {
                    return e.slice(1)
                }), this._longDateFormat[e])
            }

            function O() {
                return this._invalidDate
            }

            function P(e) {
                return this._ordinal.replace("%d", e)
            }

            function W(e, t, n, a) {
                var r = this._relativeTime[n];
                return T(r) ? r(e, t, n, a) : r.replace(/%d/i, e)
            }

            function E(e, t) {
                var n = this._relativeTime[e > 0 ? "future" : "past"];
                return T(n) ? n(t) : n.replace(/%s/i, t)
            }

            function A(e, t) {
                var n = e.toLowerCase();
                za[n] = za[n + "s"] = za[t] = e
            }

            function F(e) {
                return "string" == typeof e ? za[e] || za[e.toLowerCase()] : void 0
            }

            function z(e) {
                var t, n, a = {};
                for (n in e) u(e, n) && (t = F(n)) && (a[t] = e[n]);
                return a
            }

            function J(e, t) {
                Ja[e] = t
            }

            function R(e) {
                var t = [];
                for (var n in e) t.push({
                    unit: n,
                    priority: Ja[n]
                });
                return t.sort(function(e, t) {
                    return e.priority - t.priority
                }), t
            }

            function I(e, t, n) {
                var a = "" + Math.abs(e),
                    r = t - a.length;
                return (e >= 0 ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + a
            }

            function N(e, t, n, a) {
                var r = a;
                "string" == typeof a && (r = function() {
                    return this[a]()
                }), e && (Ca[e] = r), t && (Ca[t[0]] = function() {
                    return I(r.apply(this, arguments), t[1], t[2])
                }), n && (Ca[n] = function() {
                    return this.localeData().ordinal(r.apply(this, arguments), e)
                })
            }

            function C(e) {
                return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
            }

            function U(e) {
                var t, n, a = e.match(Ra);
                for (t = 0, n = a.length; t < n; t++) Ca[a[t]] ? a[t] = Ca[a[t]] : a[t] = C(a[t]);
                return function(t) {
                    var r, s = "";
                    for (r = 0; r < n; r++) s += T(a[r]) ? a[r].call(t, e) : a[r];
                    return s
                }
            }

            function G(e, t) {
                return e.isValid() ? (t = V(t, e.localeData()), Na[t] = Na[t] || U(t), Na[t](e)) : e.localeData().invalidDate()
            }

            function V(e, t) {
                function n(e) {
                    return t.longDateFormat(e) || e
                }
                var a = 5;
                for (Ia.lastIndex = 0; a >= 0 && Ia.test(e);) e = e.replace(Ia, n), Ia.lastIndex = 0, a -= 1;
                return e
            }

            function $(e, t, n) {
                or[e] = T(t) ? t : function(e, a) {
                    return e && n ? n : t
                }
            }

            function Z(e, t) {
                return u(or, e) ? or[e](t._strict, t._locale) : new RegExp(B(e))
            }

            function B(e) {
                return K(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, a, r) {
                    return t || n || a || r
                }))
            }

            function K(e) {
                return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
            }

            function q(e, t) {
                var n, a = t;
                for ("string" == typeof e && (e = [e]), o(t) && (a = function(e, n) {
                        n[t] = k(e)
                    }), n = 0; n < e.length; n++) _r[e[n]] = a
            }

            function Q(e, t) {
                q(e, function(e, n, a, r) {
                    a._w = a._w || {}, t(e, a._w, a, r)
                })
            }

            function X(e, t, n) {
                null != t && u(_r, e) && _r[e](t, n._a, n, e)
            }

            function ee(e) {
                return te(e) ? 366 : 365
            }

            function te(e) {
                return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
            }

            function ne() {
                return te(this.year())
            }

            function ae(e, n) {
                return function(a) {
                    return null != a ? (se(this, e, a), t.updateOffset(this, n), this) : re(this, e)
                }
            }

            function re(e, t) {
                return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN
            }

            function se(e, t, n) {
                e.isValid() && !isNaN(n) && ("FullYear" === t && te(e.year()) ? e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), de(n, e.month())) : e._d["set" + (e._isUTC ? "UTC" : "") + t](n))
            }

            function ie(e) {
                return e = F(e), T(this[e]) ? this[e]() : this
            }

            function oe(e, t) {
                if ("object" == typeof e) {
                    e = z(e);
                    for (var n = R(e), a = 0; a < n.length; a++) this[n[a].unit](e[n[a].unit])
                } else if (e = F(e), T(this[e])) return this[e](t);
                return this
            }

            function _e(e, t) {
                return (e % t + t) % t
            }

            function de(e, t) {
                if (isNaN(e) || isNaN(t)) return NaN;
                var n = _e(t, 12);
                return e += (t - n) / 12, 1 === n ? te(e) ? 29 : 28 : 31 - n % 7 % 2
            }

            function ue(e, t) {
                return e ? a(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || pr).test(t) ? "format" : "standalone"][e.month()] : a(this._months) ? this._months : this._months.standalone
            }

            function le(e, t) {
                return e ? a(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[pr.test(t) ? "format" : "standalone"][e.month()] : a(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone
            }

            function me(e, t, n) {
                var a, r, s, i = e.toLocaleLowerCase();
                if (!this._monthsParse)
                    for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], a = 0; a < 12; ++a) s = m([2e3, a]), this._shortMonthsParse[a] = this.monthsShort(s, "").toLocaleLowerCase(), this._longMonthsParse[a] = this.months(s, "").toLocaleLowerCase();
                return n ? "MMM" === t ? (r = yr.call(this._shortMonthsParse, i), -1 !== r ? r : null) : (r = yr.call(this._longMonthsParse, i), -1 !== r ? r : null) : "MMM" === t ? -1 !== (r = yr.call(this._shortMonthsParse, i)) ? r : (r = yr.call(this._longMonthsParse, i), -1 !== r ? r : null) : -1 !== (r = yr.call(this._longMonthsParse, i)) ? r : (r = yr.call(this._shortMonthsParse, i), -1 !== r ? r : null)
            }

            function ce(e, t, n) {
                var a, r, s;
                if (this._monthsParseExact) return me.call(this, e, t, n);
                for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), a = 0; a < 12; a++) {
                    if (r = m([2e3, a]), n && !this._longMonthsParse[a] && (this._longMonthsParse[a] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i"), this._shortMonthsParse[a] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i")), n || this._monthsParse[a] || (s = "^" + this.months(r, "") + "|^" + this.monthsShort(r, ""), this._monthsParse[a] = new RegExp(s.replace(".", ""), "i")), n && "MMMM" === t && this._longMonthsParse[a].test(e)) return a;
                    if (n && "MMM" === t && this._shortMonthsParse[a].test(e)) return a;
                    if (!n && this._monthsParse[a].test(e)) return a
                }
            }

            function he(e, t) {
                var n;
                if (!e.isValid()) return e;
                if ("string" == typeof t)
                    if (/^\d+$/.test(t)) t = k(t);
                    else if (t = e.localeData().monthsParse(t), !o(t)) return e;
                return n = Math.min(e.date(), de(e.year(), t)), e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n), e
            }

            function fe(e) {
                return null != e ? (he(this, e), t.updateOffset(this, !0), this) : re(this, "Month")
            }

            function Me() {
                return de(this.year(), this.month())
            }

            function Le(e) {
                return this._monthsParseExact ? (u(this, "_monthsRegex") || Ye.call(this), e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (u(this, "_monthsShortRegex") || (this._monthsShortRegex = gr), this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex)
            }

            function ye(e) {
                return this._monthsParseExact ? (u(this, "_monthsRegex") || Ye.call(this), e ? this._monthsStrictRegex : this._monthsRegex) : (u(this, "_monthsRegex") || (this._monthsRegex = vr), this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex)
            }

            function Ye() {
                function e(e, t) {
                    return t.length - e.length
                }
                var t, n, a = [],
                    r = [],
                    s = [];
                for (t = 0; t < 12; t++) n = m([2e3, t]), a.push(this.monthsShort(n, "")), r.push(this.months(n, "")), s.push(this.months(n, "")), s.push(this.monthsShort(n, ""));
                for (a.sort(e), r.sort(e), s.sort(e), t = 0; t < 12; t++) a[t] = K(a[t]), r[t] = K(r[t]);
                for (t = 0; t < 24; t++) s[t] = K(s[t]);
                this._monthsRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + r.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + a.join("|") + ")", "i")
            }

            function pe(e, t, n, a, r, s, i) {
                var o = new Date(e, t, n, a, r, s, i);
                return e < 100 && e >= 0 && isFinite(o.getFullYear()) && o.setFullYear(e), o
            }

            function ke(e) {
                var t = new Date(Date.UTC.apply(null, arguments));
                return e < 100 && e >= 0 && isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e), t
            }

            function De(e, t, n) {
                var a = 7 + t - n;
                return -(7 + ke(e, 0, a).getUTCDay() - t) % 7 + a - 1
            }

            function ge(e, t, n, a, r) {
                var s, i, o = (7 + n - a) % 7,
                    _ = De(e, a, r),
                    d = 1 + 7 * (t - 1) + o + _;
                return d <= 0 ? (s = e - 1, i = ee(s) + d) : d > ee(e) ? (s = e + 1, i = d - ee(e)) : (s = e, i = d), {
                    year: s,
                    dayOfYear: i
                }
            }

            function ve(e, t, n) {
                var a, r, s = De(e.year(), t, n),
                    i = Math.floor((e.dayOfYear() - s - 1) / 7) + 1;
                return i < 1 ? (r = e.year() - 1, a = i + we(r, t, n)) : i > we(e.year(), t, n) ? (a = i - we(e.year(), t, n), r = e.year() + 1) : (r = e.year(), a = i), {
                    week: a,
                    year: r
                }
            }

            function we(e, t, n) {
                var a = De(e, t, n),
                    r = De(e + 1, t, n);
                return (ee(e) - a + r) / 7
            }

            function Te(e) {
                return ve(e, this._week.dow, this._week.doy).week
            }

            function be() {
                return this._week.dow
            }

            function Se() {
                return this._week.doy
            }

            function He(e) {
                var t = this.localeData().week(this);
                return null == e ? t : this.add(7 * (e - t), "d")
            }

            function je(e) {
                var t = ve(this, 1, 4).week;
                return null == e ? t : this.add(7 * (e - t), "d")
            }

            function xe(e, t) {
                return "string" != typeof e ? e : isNaN(e) ? (e = t.weekdaysParse(e), "number" == typeof e ? e : null) : parseInt(e, 10)
            }

            function Oe(e, t) {
                return "string" == typeof e ? t.weekdaysParse(e) % 7 || 7 : isNaN(e) ? null : e
            }

            function Pe(e, t) {
                return e ? a(this._weekdays) ? this._weekdays[e.day()] : this._weekdays[this._weekdays.isFormat.test(t) ? "format" : "standalone"][e.day()] : a(this._weekdays) ? this._weekdays : this._weekdays.standalone
            }

            function We(e) {
                return e ? this._weekdaysShort[e.day()] : this._weekdaysShort
            }

            function Ee(e) {
                return e ? this._weekdaysMin[e.day()] : this._weekdaysMin
            }

            function Ae(e, t, n) {
                var a, r, s, i = e.toLocaleLowerCase();
                if (!this._weekdaysParse)
                    for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], a = 0; a < 7; ++a) s = m([2e3, 1]).day(a), this._minWeekdaysParse[a] = this.weekdaysMin(s, "").toLocaleLowerCase(), this._shortWeekdaysParse[a] = this.weekdaysShort(s, "").toLocaleLowerCase(), this._weekdaysParse[a] = this.weekdays(s, "").toLocaleLowerCase();
                return n ? "dddd" === t ? (r = yr.call(this._weekdaysParse, i), -1 !== r ? r : null) : "ddd" === t ? (r = yr.call(this._shortWeekdaysParse, i), -1 !== r ? r : null) : (r = yr.call(this._minWeekdaysParse, i), -1 !== r ? r : null) : "dddd" === t ? -1 !== (r = yr.call(this._weekdaysParse, i)) ? r : -1 !== (r = yr.call(this._shortWeekdaysParse, i)) ? r : (r = yr.call(this._minWeekdaysParse, i), -1 !== r ? r : null) : "ddd" === t ? -1 !== (r = yr.call(this._shortWeekdaysParse, i)) ? r : -1 !== (r = yr.call(this._weekdaysParse, i)) ? r : (r = yr.call(this._minWeekdaysParse, i), -1 !== r ? r : null) : -1 !== (r = yr.call(this._minWeekdaysParse, i)) ? r : -1 !== (r = yr.call(this._weekdaysParse, i)) ? r : (r = yr.call(this._shortWeekdaysParse, i), -1 !== r ? r : null)
            }

            function Fe(e, t, n) {
                var a, r, s;
                if (this._weekdaysParseExact) return Ae.call(this, e, t, n);
                for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), a = 0; a < 7; a++) {
                    if (r = m([2e3, 1]).day(a), n && !this._fullWeekdaysParse[a] && (this._fullWeekdaysParse[a] = new RegExp("^" + this.weekdays(r, "").replace(".", ".?") + "$", "i"), this._shortWeekdaysParse[a] = new RegExp("^" + this.weekdaysShort(r, "").replace(".", ".?") + "$", "i"), this._minWeekdaysParse[a] = new RegExp("^" + this.weekdaysMin(r, "").replace(".", ".?") + "$", "i")), this._weekdaysParse[a] || (s = "^" + this.weekdays(r, "") + "|^" + this.weekdaysShort(r, "") + "|^" + this.weekdaysMin(r, ""), this._weekdaysParse[a] = new RegExp(s.replace(".", ""), "i")), n && "dddd" === t && this._fullWeekdaysParse[a].test(e)) return a;
                    if (n && "ddd" === t && this._shortWeekdaysParse[a].test(e)) return a;
                    if (n && "dd" === t && this._minWeekdaysParse[a].test(e)) return a;
                    if (!n && this._weekdaysParse[a].test(e)) return a
                }
            }

            function ze(e) {
                if (!this.isValid()) return null != e ? this : NaN;
                var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                return null != e ? (e = xe(e, this.localeData()), this.add(e - t, "d")) : t
            }

            function Je(e) {
                if (!this.isValid()) return null != e ? this : NaN;
                var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
                return null == e ? t : this.add(e - t, "d")
            }

            function Re(e) {
                if (!this.isValid()) return null != e ? this : NaN;
                if (null != e) {
                    var t = Oe(e, this.localeData());
                    return this.day(this.day() % 7 ? t : t - 7)
                }
                return this.day() || 7
            }

            function Ie(e) {
                return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ue.call(this), e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (u(this, "_weekdaysRegex") || (this._weekdaysRegex = Hr), this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex)
            }

            function Ne(e) {
                return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ue.call(this), e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (u(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = jr), this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
            }

            function Ce(e) {
                return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ue.call(this), e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (u(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = xr), this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
            }

            function Ue() {
                function e(e, t) {
                    return t.length - e.length
                }
                var t, n, a, r, s, i = [],
                    o = [],
                    _ = [],
                    d = [];
                for (t = 0; t < 7; t++) n = m([2e3, 1]).day(t), a = this.weekdaysMin(n, ""), r = this.weekdaysShort(n, ""), s = this.weekdays(n, ""), i.push(a), o.push(r), _.push(s), d.push(a), d.push(r), d.push(s);
                for (i.sort(e), o.sort(e), _.sort(e), d.sort(e), t = 0; t < 7; t++) o[t] = K(o[t]), _[t] = K(_[t]), d[t] = K(d[t]);
                this._weekdaysRegex = new RegExp("^(" + d.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + _.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + i.join("|") + ")", "i")
            }

            function Ge() {
                return this.hours() % 12 || 12
            }

            function Ve() {
                return this.hours() || 24
            }

            function $e(e, t) {
                N(e, 0, 0, function() {
                    return this.localeData().meridiem(this.hours(), this.minutes(), t)
                })
            }

            function Ze(e, t) {
                return t._meridiemParse
            }

            function Be(e) {
                return "p" === (e + "").toLowerCase().charAt(0)
            }

            function Ke(e, t, n) {
                return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
            }

            function qe(e) {
                return e ? e.toLowerCase().replace("_", "-") : e
            }

            function Qe(e) {
                for (var t, n, a, r, s = 0; s < e.length;) {
                    for (r = qe(e[s]).split("-"), t = r.length, n = qe(e[s + 1]), n = n ? n.split("-") : null; t > 0;) {
                        if (a = Xe(r.slice(0, t).join("-"))) return a;
                        if (n && n.length >= t && D(r, n, !0) >= t - 1) break;
                        t--
                    }
                    s++
                }
                return null
            }

            function Xe(t) {
                var a = null;
                if (!Ar[t] && void 0 !== e && e && e.exports) try {
                    a = Or._abbr;
                    n(122)("./" + t), et(a)
                } catch (e) {}
                return Ar[t]
            }

            function et(e, t) {
                var n;
                return e && (n = i(t) ? at(e) : tt(e, t)) && (Or = n), Or._abbr
            }

            function tt(e, t) {
                if (null !== t) {
                    var n = Er;
                    if (t.abbr = e, null != Ar[e]) w("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), n = Ar[e]._config;
                    else if (null != t.parentLocale) {
                        if (null == Ar[t.parentLocale]) return Fr[t.parentLocale] || (Fr[t.parentLocale] = []), Fr[t.parentLocale].push({
                            name: e,
                            config: t
                        }), null;
                        n = Ar[t.parentLocale]._config
                    }
                    return Ar[e] = new H(S(n, t)), Fr[e] && Fr[e].forEach(function(e) {
                        tt(e.name, e.config)
                    }), et(e), Ar[e]
                }
                return delete Ar[e], null
            }

            function nt(e, t) {
                if (null != t) {
                    var n, a = Er;
                    null != Ar[e] && (a = Ar[e]._config), t = S(a, t), n = new H(t), n.parentLocale = Ar[e], Ar[e] = n, et(e)
                } else null != Ar[e] && (null != Ar[e].parentLocale ? Ar[e] = Ar[e].parentLocale : null != Ar[e] && delete Ar[e]);
                return Ar[e]
            }

            function at(e) {
                var t;
                if (e && e._locale && e._locale._abbr && (e = e._locale._abbr), !e) return Or;
                if (!a(e)) {
                    if (t = Xe(e)) return t;
                    e = [e]
                }
                return Qe(e)
            }

            function rt() {
                return Pa(Ar)
            }

            function st(e) {
                var t, n = e._a;
                return n && -2 === h(e).overflow && (t = n[ur] < 0 || n[ur] > 11 ? ur : n[lr] < 1 || n[lr] > de(n[dr], n[ur]) ? lr : n[mr] < 0 || n[mr] > 24 || 24 === n[mr] && (0 !== n[cr] || 0 !== n[hr] || 0 !== n[fr]) ? mr : n[cr] < 0 || n[cr] > 59 ? cr : n[hr] < 0 || n[hr] > 59 ? hr : n[fr] < 0 || n[fr] > 999 ? fr : -1, h(e)._overflowDayOfYear && (t < dr || t > lr) && (t = lr), h(e)._overflowWeeks && -1 === t && (t = Mr), h(e)._overflowWeekday && -1 === t && (t = Lr), h(e).overflow = t), e
            }

            function it(e, t, n) {
                return null != e ? e : null != t ? t : n
            }

            function ot(e) {
                var n = new Date(t.now());
                return e._useUTC ? [n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()] : [n.getFullYear(), n.getMonth(), n.getDate()]
            }

            function _t(e) {
                var t, n, a, r, s = [];
                if (!e._d) {
                    for (a = ot(e), e._w && null == e._a[lr] && null == e._a[ur] && dt(e), null != e._dayOfYear && (r = it(e._a[dr], a[dr]), (e._dayOfYear > ee(r) || 0 === e._dayOfYear) && (h(e)._overflowDayOfYear = !0), n = ke(r, 0, e._dayOfYear), e._a[ur] = n.getUTCMonth(), e._a[lr] = n.getUTCDate()), t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = s[t] = a[t];
                    for (; t < 7; t++) e._a[t] = s[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
                    24 === e._a[mr] && 0 === e._a[cr] && 0 === e._a[hr] && 0 === e._a[fr] && (e._nextDay = !0, e._a[mr] = 0), e._d = (e._useUTC ? ke : pe).apply(null, s), null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), e._nextDay && (e._a[mr] = 24), e._w && void 0 !== e._w.d && e._w.d !== e._d.getDay() && (h(e).weekdayMismatch = !0)
                }
            }

            function dt(e) {
                var t, n, a, r, s, i, o, _;
                if (t = e._w, null != t.GG || null != t.W || null != t.E) s = 1, i = 4, n = it(t.GG, e._a[dr], ve(Tt(), 1, 4).year), a = it(t.W, 1), ((r = it(t.E, 1)) < 1 || r > 7) && (_ = !0);
                else {
                    s = e._locale._week.dow, i = e._locale._week.doy;
                    var d = ve(Tt(), s, i);
                    n = it(t.gg, e._a[dr], d.year), a = it(t.w, d.week), null != t.d ? ((r = t.d) < 0 || r > 6) && (_ = !0) : null != t.e ? (r = t.e + s, (t.e < 0 || t.e > 6) && (_ = !0)) : r = s
                }
                a < 1 || a > we(n, s, i) ? h(e)._overflowWeeks = !0 : null != _ ? h(e)._overflowWeekday = !0 : (o = ge(n, a, r, s, i), e._a[dr] = o.year, e._dayOfYear = o.dayOfYear)
            }

            function ut(e) {
                var t, n, a, r, s, i, o = e._i,
                    _ = zr.exec(o) || Jr.exec(o);
                if (_) {
                    for (h(e).iso = !0, t = 0, n = Ir.length; t < n; t++)
                        if (Ir[t][1].exec(_[1])) {
                            r = Ir[t][0], a = !1 !== Ir[t][2];
                            break
                        } if (null == r) return void(e._isValid = !1);
                    if (_[3]) {
                        for (t = 0, n = Nr.length; t < n; t++)
                            if (Nr[t][1].exec(_[3])) {
                                s = (_[2] || " ") + Nr[t][0];
                                break
                            } if (null == s) return void(e._isValid = !1)
                    }
                    if (!a && null != s) return void(e._isValid = !1);
                    if (_[4]) {
                        if (!Rr.exec(_[4])) return void(e._isValid = !1);
                        i = "Z"
                    }
                    e._f = r + (s || "") + (i || ""), yt(e)
                } else e._isValid = !1
            }

            function lt(e, t, n, a, r, s) {
                var i = [mt(e), Dr.indexOf(t), parseInt(n, 10), parseInt(a, 10), parseInt(r, 10)];
                return s && i.push(parseInt(s, 10)), i
            }

            function mt(e) {
                var t = parseInt(e, 10);
                return t <= 49 ? 2e3 + t : t <= 999 ? 1900 + t : t
            }

            function ct(e) {
                return e.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim()
            }

            function ht(e, t, n) {
                if (e) {
                    if (br.indexOf(e) !== new Date(t[0], t[1], t[2]).getDay()) return h(n).weekdayMismatch = !0, n._isValid = !1, !1
                }
                return !0
            }

            function ft(e, t, n) {
                if (e) return Gr[e];
                if (t) return 0;
                var a = parseInt(n, 10),
                    r = a % 100;
                return (a - r) / 100 * 60 + r
            }

            function Mt(e) {
                var t = Ur.exec(ct(e._i));
                if (t) {
                    var n = lt(t[4], t[3], t[2], t[5], t[6], t[7]);
                    if (!ht(t[1], n, e)) return;
                    e._a = n, e._tzm = ft(t[8], t[9], t[10]), e._d = ke.apply(null, e._a), e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm), h(e).rfc2822 = !0
                } else e._isValid = !1
            }

            function Lt(e) {
                var n = Cr.exec(e._i);
                if (null !== n) return void(e._d = new Date(+n[1]));
                ut(e), !1 === e._isValid && (delete e._isValid, Mt(e), !1 === e._isValid && (delete e._isValid, t.createFromInputFallback(e)))
            }

            function yt(e) {
                if (e._f === t.ISO_8601) return void ut(e);
                if (e._f === t.RFC_2822) return void Mt(e);
                e._a = [], h(e).empty = !0;
                var n, a, r, s, i, o = "" + e._i,
                    _ = o.length,
                    d = 0;
                for (r = V(e._f, e._locale).match(Ra) || [], n = 0; n < r.length; n++) s = r[n], a = (o.match(Z(s, e)) || [])[0], a && (i = o.substr(0, o.indexOf(a)), i.length > 0 && h(e).unusedInput.push(i), o = o.slice(o.indexOf(a) + a.length), d += a.length), Ca[s] ? (a ? h(e).empty = !1 : h(e).unusedTokens.push(s), X(s, a, e)) : e._strict && !a && h(e).unusedTokens.push(s);
                h(e).charsLeftOver = _ - d, o.length > 0 && h(e).unusedInput.push(o), e._a[mr] <= 12 && !0 === h(e).bigHour && e._a[mr] > 0 && (h(e).bigHour = void 0), h(e).parsedDateParts = e._a.slice(0), h(e).meridiem = e._meridiem, e._a[mr] = Yt(e._locale, e._a[mr], e._meridiem), _t(e), st(e)
            }

            function Yt(e, t, n) {
                var a;
                return null == n ? t : null != e.meridiemHour ? e.meridiemHour(t, n) : null != e.isPM ? (a = e.isPM(n), a && t < 12 && (t += 12), a || 12 !== t || (t = 0), t) : t
            }

            function pt(e) {
                var t, n, a, r, s;
                if (0 === e._f.length) return h(e).invalidFormat = !0, void(e._d = new Date(NaN));
                for (r = 0; r < e._f.length; r++) s = 0, t = L({}, e), null != e._useUTC && (t._useUTC = e._useUTC), t._f = e._f[r], yt(t), f(t) && (s += h(t).charsLeftOver, s += 10 * h(t).unusedTokens.length, h(t).score = s, (null == a || s < a) && (a = s, n = t));
                l(e, n || t)
            }

            function kt(e) {
                if (!e._d) {
                    var t = z(e._i);
                    e._a = d([t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], function(e) {
                        return e && parseInt(e, 10)
                    }), _t(e)
                }
            }

            function Dt(e) {
                var t = new y(st(gt(e)));
                return t._nextDay && (t.add(1, "d"), t._nextDay = void 0), t
            }

            function gt(e) {
                var t = e._i,
                    n = e._f;
                return e._locale = e._locale || at(e._l), null === t || void 0 === n && "" === t ? M({
                    nullInput: !0
                }) : ("string" == typeof t && (e._i = t = e._locale.preparse(t)), Y(t) ? new y(st(t)) : (_(t) ? e._d = t : a(n) ? pt(e) : n ? yt(e) : vt(e), f(e) || (e._d = null), e))
            }

            function vt(e) {
                var n = e._i;
                i(n) ? e._d = new Date(t.now()) : _(n) ? e._d = new Date(n.valueOf()) : "string" == typeof n ? Lt(e) : a(n) ? (e._a = d(n.slice(0), function(e) {
                    return parseInt(e, 10)
                }), _t(e)) : r(n) ? kt(e) : o(n) ? e._d = new Date(n) : t.createFromInputFallback(e)
            }

            function wt(e, t, n, i, o) {
                var _ = {};
                return !0 !== n && !1 !== n || (i = n, n = void 0), (r(e) && s(e) || a(e) && 0 === e.length) && (e = void 0), _._isAMomentObject = !0, _._useUTC = _._isUTC = o, _._l = n, _._i = e, _._f = t, _._strict = i, Dt(_)
            }

            function Tt(e, t, n, a) {
                return wt(e, t, n, a, !1)
            }

            function bt(e, t) {
                var n, r;
                if (1 === t.length && a(t[0]) && (t = t[0]), !t.length) return Tt();
                for (n = t[0], r = 1; r < t.length; ++r) t[r].isValid() && !t[r][e](n) || (n = t[r]);
                return n
            }

            function St() {
                return bt("isBefore", [].slice.call(arguments, 0))
            }

            function Ht() {
                return bt("isAfter", [].slice.call(arguments, 0))
            }

            function jt(e) {
                for (var t in e)
                    if (-1 === yr.call(Br, t) || null != e[t] && isNaN(e[t])) return !1;
                for (var n = !1, a = 0; a < Br.length; ++a)
                    if (e[Br[a]]) {
                        if (n) return !1;
                        parseFloat(e[Br[a]]) !== k(e[Br[a]]) && (n = !0)
                    } return !0
            }

            function xt() {
                return this._isValid
            }

            function Ot() {
                return qt(NaN)
            }

            function Pt(e) {
                var t = z(e),
                    n = t.year || 0,
                    a = t.quarter || 0,
                    r = t.month || 0,
                    s = t.week || 0,
                    i = t.day || 0,
                    o = t.hour || 0,
                    _ = t.minute || 0,
                    d = t.second || 0,
                    u = t.millisecond || 0;
                this._isValid = jt(t), this._milliseconds = +u + 1e3 * d + 6e4 * _ + 1e3 * o * 60 * 60, this._days = +i + 7 * s, this._months = +r + 3 * a + 12 * n, this._data = {}, this._locale = at(), this._bubble()
            }

            function Wt(e) {
                return e instanceof Pt
            }

            function Et(e) {
                return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e)
            }

            function At(e, t) {
                N(e, 0, 0, function() {
                    var e = this.utcOffset(),
                        n = "+";
                    return e < 0 && (e = -e, n = "-"), n + I(~~(e / 60), 2) + t + I(~~e % 60, 2)
                })
            }

            function Ft(e, t) {
                var n = (t || "").match(e);
                if (null === n) return null;
                var a = n[n.length - 1] || [],
                    r = (a + "").match(Kr) || ["-", 0, 0],
                    s = 60 * r[1] + k(r[2]);
                return 0 === s ? 0 : "+" === r[0] ? s : -s
            }

            function zt(e, n) {
                var a, r;
                return n._isUTC ? (a = n.clone(), r = (Y(e) || _(e) ? e.valueOf() : Tt(e).valueOf()) - a.valueOf(), a._d.setTime(a._d.valueOf() + r), t.updateOffset(a, !1), a) : Tt(e).local()
            }

            function Jt(e) {
                return 15 * -Math.round(e._d.getTimezoneOffset() / 15)
            }

            function Rt(e, n, a) {
                var r, s = this._offset || 0;
                if (!this.isValid()) return null != e ? this : NaN;
                if (null != e) {
                    if ("string" == typeof e) {
                        if (null === (e = Ft(rr, e))) return this
                    } else Math.abs(e) < 16 && !a && (e *= 60);
                    return !this._isUTC && n && (r = Jt(this)), this._offset = e, this._isUTC = !0, null != r && this.add(r, "m"), s !== e && (!n || this._changeInProgress ? nn(this, qt(e - s, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, t.updateOffset(this, !0), this._changeInProgress = null)), this
                }
                return this._isUTC ? s : Jt(this)
            }

            function It(e, t) {
                return null != e ? ("string" != typeof e && (e = -e), this.utcOffset(e, t), this) : -this.utcOffset()
            }

            function Nt(e) {
                return this.utcOffset(0, e)
            }

            function Ct(e) {
                return this._isUTC && (this.utcOffset(0, e), this._isUTC = !1, e && this.subtract(Jt(this), "m")), this
            }

            function Ut() {
                if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);
                else if ("string" == typeof this._i) {
                    var e = Ft(ar, this._i);
                    null != e ? this.utcOffset(e) : this.utcOffset(0, !0)
                }
                return this
            }

            function Gt(e) {
                return !!this.isValid() && (e = e ? Tt(e).utcOffset() : 0, (this.utcOffset() - e) % 60 == 0)
            }

            function Vt() {
                return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
            }

            function $t() {
                if (!i(this._isDSTShifted)) return this._isDSTShifted;
                var e = {};
                if (L(e, this), e = gt(e), e._a) {
                    var t = e._isUTC ? m(e._a) : Tt(e._a);
                    this._isDSTShifted = this.isValid() && D(e._a, t.toArray()) > 0
                } else this._isDSTShifted = !1;
                return this._isDSTShifted
            }

            function Zt() {
                return !!this.isValid() && !this._isUTC
            }

            function Bt() {
                return !!this.isValid() && this._isUTC
            }

            function Kt() {
                return !!this.isValid() && (this._isUTC && 0 === this._offset)
            }

            function qt(e, t) {
                var n, a, r, s = e,
                    i = null;
                return Wt(e) ? s = {
                    ms: e._milliseconds,
                    d: e._days,
                    M: e._months
                } : o(e) ? (s = {}, t ? s[t] = e : s.milliseconds = e) : (i = qr.exec(e)) ? (n = "-" === i[1] ? -1 : 1, s = {
                    y: 0,
                    d: k(i[lr]) * n,
                    h: k(i[mr]) * n,
                    m: k(i[cr]) * n,
                    s: k(i[hr]) * n,
                    ms: k(Et(1e3 * i[fr])) * n
                }) : (i = Qr.exec(e)) ? (n = "-" === i[1] ? -1 : (i[1], 1), s = {
                    y: Qt(i[2], n),
                    M: Qt(i[3], n),
                    w: Qt(i[4], n),
                    d: Qt(i[5], n),
                    h: Qt(i[6], n),
                    m: Qt(i[7], n),
                    s: Qt(i[8], n)
                }) : null == s ? s = {} : "object" == typeof s && ("from" in s || "to" in s) && (r = en(Tt(s.from), Tt(s.to)), s = {}, s.ms = r.milliseconds, s.M = r.months), a = new Pt(s), Wt(e) && u(e, "_locale") && (a._locale = e._locale), a
            }

            function Qt(e, t) {
                var n = e && parseFloat(e.replace(",", "."));
                return (isNaN(n) ? 0 : n) * t
            }

            function Xt(e, t) {
                var n = {
                    milliseconds: 0,
                    months: 0
                };
                return n.months = t.month() - e.month() + 12 * (t.year() - e.year()), e.clone().add(n.months, "M").isAfter(t) && --n.months, n.milliseconds = +t - +e.clone().add(n.months, "M"), n
            }

            function en(e, t) {
                var n;
                return e.isValid() && t.isValid() ? (t = zt(t, e), e.isBefore(t) ? n = Xt(e, t) : (n = Xt(t, e), n.milliseconds = -n.milliseconds, n.months = -n.months), n) : {
                    milliseconds: 0,
                    months: 0
                }
            }

            function tn(e, t) {
                return function(n, a) {
                    var r, s;
                    return null === a || isNaN(+a) || (w(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), s = n, n = a, a = s), n = "string" == typeof n ? +n : n, r = qt(n, a), nn(this, r, e), this
                }
            }

            function nn(e, n, a, r) {
                var s = n._milliseconds,
                    i = Et(n._days),
                    o = Et(n._months);
                e.isValid() && (r = null == r || r, o && he(e, re(e, "Month") + o * a), i && se(e, "Date", re(e, "Date") + i * a), s && e._d.setTime(e._d.valueOf() + s * a), r && t.updateOffset(e, i || o))
            }

            function an(e, t) {
                var n = e.diff(t, "days", !0);
                return n < -6 ? "sameElse" : n < -1 ? "lastWeek" : n < 0 ? "lastDay" : n < 1 ? "sameDay" : n < 2 ? "nextDay" : n < 7 ? "nextWeek" : "sameElse"
            }

            function rn(e, n) {
                var a = e || Tt(),
                    r = zt(a, this).startOf("day"),
                    s = t.calendarFormat(this, r) || "sameElse",
                    i = n && (T(n[s]) ? n[s].call(this, a) : n[s]);
                return this.format(i || this.localeData().calendar(s, this, Tt(a)))
            }

            function sn() {
                return new y(this)
            }

            function on(e, t) {
                var n = Y(e) ? e : Tt(e);
                return !(!this.isValid() || !n.isValid()) && (t = F(i(t) ? "millisecond" : t), "millisecond" === t ? this.valueOf() > n.valueOf() : n.valueOf() < this.clone().startOf(t).valueOf())
            }

            function _n(e, t) {
                var n = Y(e) ? e : Tt(e);
                return !(!this.isValid() || !n.isValid()) && (t = F(i(t) ? "millisecond" : t), "millisecond" === t ? this.valueOf() < n.valueOf() : this.clone().endOf(t).valueOf() < n.valueOf())
            }

            function dn(e, t, n, a) {
                return a = a || "()", ("(" === a[0] ? this.isAfter(e, n) : !this.isBefore(e, n)) && (")" === a[1] ? this.isBefore(t, n) : !this.isAfter(t, n))
            }

            function un(e, t) {
                var n, a = Y(e) ? e : Tt(e);
                return !(!this.isValid() || !a.isValid()) && (t = F(t || "millisecond"), "millisecond" === t ? this.valueOf() === a.valueOf() : (n = a.valueOf(), this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf()))
            }

            function ln(e, t) {
                return this.isSame(e, t) || this.isAfter(e, t)
            }

            function mn(e, t) {
                return this.isSame(e, t) || this.isBefore(e, t)
            }

            function cn(e, t, n) {
                var a, r, s;
                if (!this.isValid()) return NaN;
                if (a = zt(e, this), !a.isValid()) return NaN;
                switch (r = 6e4 * (a.utcOffset() - this.utcOffset()), t = F(t)) {
                    case "year":
                        s = hn(this, a) / 12;
                        break;
                    case "month":
                        s = hn(this, a);
                        break;
                    case "quarter":
                        s = hn(this, a) / 3;
                        break;
                    case "second":
                        s = (this - a) / 1e3;
                        break;
                    case "minute":
                        s = (this - a) / 6e4;
                        break;
                    case "hour":
                        s = (this - a) / 36e5;
                        break;
                    case "day":
                        s = (this - a - r) / 864e5;
                        break;
                    case "week":
                        s = (this - a - r) / 6048e5;
                        break;
                    default:
                        s = this - a
                }
                return n ? s : p(s)
            }

            function hn(e, t) {
                var n, a, r = 12 * (t.year() - e.year()) + (t.month() - e.month()),
                    s = e.clone().add(r, "months");
                return t - s < 0 ? (n = e.clone().add(r - 1, "months"), a = (t - s) / (s - n)) : (n = e.clone().add(r + 1, "months"), a = (t - s) / (n - s)), -(r + a) || 0
            }

            function fn() {
                return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
            }

            function Mn() {
                if (!this.isValid()) return null;
                var e = this.clone().utc();
                return e.year() < 0 || e.year() > 9999 ? G(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : T(Date.prototype.toISOString) ? this.toDate().toISOString() : G(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            }

            function Ln() {
                if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
                var e = "moment",
                    t = "";
                this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", t = "Z");
                var n = "[" + e + '("]',
                    a = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY",
                    r = t + '[")]';
                return this.format(n + a + "-MM-DD[T]HH:mm:ss.SSS" + r)
            }

            function yn(e) {
                e || (e = this.isUtc() ? t.defaultFormatUtc : t.defaultFormat);
                var n = G(this, e);
                return this.localeData().postformat(n)
            }

            function Yn(e, t) {
                return this.isValid() && (Y(e) && e.isValid() || Tt(e).isValid()) ? qt({
                    to: this,
                    from: e
                }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
            }

            function pn(e) {
                return this.from(Tt(), e)
            }

            function kn(e, t) {
                return this.isValid() && (Y(e) && e.isValid() || Tt(e).isValid()) ? qt({
                    from: this,
                    to: e
                }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
            }

            function Dn(e) {
                return this.to(Tt(), e)
            }

            function gn(e) {
                var t;
                return void 0 === e ? this._locale._abbr : (t = at(e), null != t && (this._locale = t), this)
            }

            function vn() {
                return this._locale
            }

            function wn(e) {
                switch (e = F(e)) {
                    case "year":
                        this.month(0);
                    case "quarter":
                    case "month":
                        this.date(1);
                    case "week":
                    case "isoWeek":
                    case "day":
                    case "date":
                        this.hours(0);
                    case "hour":
                        this.minutes(0);
                    case "minute":
                        this.seconds(0);
                    case "second":
                        this.milliseconds(0)
                }
                return "week" === e && this.weekday(0), "isoWeek" === e && this.isoWeekday(1), "quarter" === e && this.month(3 * Math.floor(this.month() / 3)), this
            }

            function Tn(e) {
                return void 0 === (e = F(e)) || "millisecond" === e ? this : ("date" === e && (e = "day"), this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms"))
            }

            function bn() {
                return this._d.valueOf() - 6e4 * (this._offset || 0)
            }

            function Sn() {
                return Math.floor(this.valueOf() / 1e3)
            }

            function Hn() {
                return new Date(this.valueOf())
            }

            function jn() {
                var e = this;
                return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()]
            }

            function xn() {
                var e = this;
                return {
                    years: e.year(),
                    months: e.month(),
                    date: e.date(),
                    hours: e.hours(),
                    minutes: e.minutes(),
                    seconds: e.seconds(),
                    milliseconds: e.milliseconds()
                }
            }

            function On() {
                return this.isValid() ? this.toISOString() : null
            }

            function Pn() {
                return f(this)
            }

            function Wn() {
                return l({}, h(this))
            }

            function En() {
                return h(this).overflow
            }

            function An() {
                return {
                    input: this._i,
                    format: this._f,
                    locale: this._locale,
                    isUTC: this._isUTC,
                    strict: this._strict
                }
            }

            function Fn(e, t) {
                N(0, [e, e.length], 0, t)
            }

            function zn(e) {
                return Nn.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
            }

            function Jn(e) {
                return Nn.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4)
            }

            function Rn() {
                return we(this.year(), 1, 4)
            }

            function In() {
                var e = this.localeData()._week;
                return we(this.year(), e.dow, e.doy)
            }

            function Nn(e, t, n, a, r) {
                var s;
                return null == e ? ve(this, a, r).year : (s = we(e, a, r), t > s && (t = s), Cn.call(this, e, t, n, a, r))
            }

            function Cn(e, t, n, a, r) {
                var s = ge(e, t, n, a, r),
                    i = ke(s.year, 0, s.dayOfYear);
                return this.year(i.getUTCFullYear()), this.month(i.getUTCMonth()), this.date(i.getUTCDate()), this
            }

            function Un(e) {
                return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3)
            }

            function Gn(e) {
                var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
                return null == e ? t : this.add(e - t, "d")
            }

            function Vn(e, t) {
                t[fr] = k(1e3 * ("0." + e))
            }

            function $n() {
                return this._isUTC ? "UTC" : ""
            }

            function Zn() {
                return this._isUTC ? "Coordinated Universal Time" : ""
            }

            function Bn(e) {
                return Tt(1e3 * e)
            }

            function Kn() {
                return Tt.apply(null, arguments).parseZone()
            }

            function qn(e) {
                return e
            }

            function Qn(e, t, n, a) {
                var r = at(),
                    s = m().set(a, t);
                return r[n](s, e)
            }

            function Xn(e, t, n) {
                if (o(e) && (t = e, e = void 0), e = e || "", null != t) return Qn(e, t, n, "month");
                var a, r = [];
                for (a = 0; a < 12; a++) r[a] = Qn(e, a, n, "month");
                return r
            }

            function ea(e, t, n, a) {
                "boolean" == typeof e ? (o(t) && (n = t, t = void 0), t = t || "") : (t = e, n = t, e = !1, o(t) && (n = t, t = void 0), t = t || "");
                var r = at(),
                    s = e ? r._week.dow : 0;
                if (null != n) return Qn(t, (n + s) % 7, a, "day");
                var i, _ = [];
                for (i = 0; i < 7; i++) _[i] = Qn(t, (i + s) % 7, a, "day");
                return _
            }

            function ta(e, t) {
                return Xn(e, t, "months")
            }

            function na(e, t) {
                return Xn(e, t, "monthsShort")
            }

            function aa(e, t, n) {
                return ea(e, t, n, "weekdays")
            }

            function ra(e, t, n) {
                return ea(e, t, n, "weekdaysShort")
            }

            function sa(e, t, n) {
                return ea(e, t, n, "weekdaysMin")
            }

            function ia() {
                var e = this._data;
                return this._milliseconds = ds(this._milliseconds), this._days = ds(this._days), this._months = ds(this._months), e.milliseconds = ds(e.milliseconds), e.seconds = ds(e.seconds), e.minutes = ds(e.minutes), e.hours = ds(e.hours), e.months = ds(e.months), e.years = ds(e.years), this
            }

            function oa(e, t, n, a) {
                var r = qt(t, n);
                return e._milliseconds += a * r._milliseconds, e._days += a * r._days, e._months += a * r._months, e._bubble()
            }

            function _a(e, t) {
                return oa(this, e, t, 1)
            }

            function da(e, t) {
                return oa(this, e, t, -1)
            }

            function ua(e) {
                return e < 0 ? Math.floor(e) : Math.ceil(e)
            }

            function la() {
                var e, t, n, a, r, s = this._milliseconds,
                    i = this._days,
                    o = this._months,
                    _ = this._data;
                return s >= 0 && i >= 0 && o >= 0 || s <= 0 && i <= 0 && o <= 0 || (s += 864e5 * ua(ca(o) + i), i = 0, o = 0), _.milliseconds = s % 1e3, e = p(s / 1e3), _.seconds = e % 60, t = p(e / 60), _.minutes = t % 60, n = p(t / 60), _.hours = n % 24, i += p(n / 24), r = p(ma(i)), o += r, i -= ua(ca(r)), a = p(o / 12), o %= 12, _.days = i, _.months = o, _.years = a, this
            }

            function ma(e) {
                return 4800 * e / 146097
            }

            function ca(e) {
                return 146097 * e / 4800
            }

            function ha(e) {
                if (!this.isValid()) return NaN;
                var t, n, a = this._milliseconds;
                if ("month" === (e = F(e)) || "year" === e) return t = this._days + a / 864e5, n = this._months + ma(t), "month" === e ? n : n / 12;
                switch (t = this._days + Math.round(ca(this._months)), e) {
                    case "week":
                        return t / 7 + a / 6048e5;
                    case "day":
                        return t + a / 864e5;
                    case "hour":
                        return 24 * t + a / 36e5;
                    case "minute":
                        return 1440 * t + a / 6e4;
                    case "second":
                        return 86400 * t + a / 1e3;
                    case "millisecond":
                        return Math.floor(864e5 * t) + a;
                    default:
                        throw new Error("Unknown unit " + e)
                }
            }

            function fa() {
                return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * k(this._months / 12) : NaN
            }

            function Ma(e) {
                return function() {
                    return this.as(e)
                }
            }

            function La() {
                return qt(this)
            }

            function ya(e) {
                return e = F(e), this.isValid() ? this[e + "s"]() : NaN
            }

            function Ya(e) {
                return function() {
                    return this.isValid() ? this._data[e] : NaN
                }
            }

            function pa() {
                return p(this.days() / 7)
            }

            function ka(e, t, n, a, r) {
                return r.relativeTime(t || 1, !!n, e, a)
            }

            function Da(e, t, n) {
                var a = qt(e).abs(),
                    r = ws(a.as("s")),
                    s = ws(a.as("m")),
                    i = ws(a.as("h")),
                    o = ws(a.as("d")),
                    _ = ws(a.as("M")),
                    d = ws(a.as("y")),
                    u = r <= Ts.ss && ["s", r] || r < Ts.s && ["ss", r] || s <= 1 && ["m"] || s < Ts.m && ["mm", s] || i <= 1 && ["h"] || i < Ts.h && ["hh", i] || o <= 1 && ["d"] || o < Ts.d && ["dd", o] || _ <= 1 && ["M"] || _ < Ts.M && ["MM", _] || d <= 1 && ["y"] || ["yy", d];
                return u[2] = t, u[3] = +e > 0, u[4] = n, ka.apply(null, u)
            }

            function ga(e) {
                return void 0 === e ? ws : "function" == typeof e && (ws = e, !0)
            }

            function va(e, t) {
                return void 0 !== Ts[e] && (void 0 === t ? Ts[e] : (Ts[e] = t, "s" === e && (Ts.ss = t - 1), !0))
            }

            function wa(e) {
                if (!this.isValid()) return this.localeData().invalidDate();
                var t = this.localeData(),
                    n = Da(this, !e, t);
                return e && (n = t.pastFuture(+this, n)), t.postformat(n)
            }

            function Ta(e) {
                return (e > 0) - (e < 0) || +e
            }

            function ba() {
                if (!this.isValid()) return this.localeData().invalidDate();
                var e, t, n, a = bs(this._milliseconds) / 1e3,
                    r = bs(this._days),
                    s = bs(this._months);
                e = p(a / 60), t = p(e / 60), a %= 60, e %= 60, n = p(s / 12), s %= 12;
                var i = n,
                    o = s,
                    _ = r,
                    d = t,
                    u = e,
                    l = a ? a.toFixed(3).replace(/\.?0+$/, "") : "",
                    m = this.asSeconds();
                if (!m) return "P0D";
                var c = m < 0 ? "-" : "",
                    h = Ta(this._months) !== Ta(m) ? "-" : "",
                    f = Ta(this._days) !== Ta(m) ? "-" : "",
                    M = Ta(this._milliseconds) !== Ta(m) ? "-" : "";
                return c + "P" + (i ? h + i + "Y" : "") + (o ? h + o + "M" : "") + (_ ? f + _ + "D" : "") + (d || u || l ? "T" : "") + (d ? M + d + "H" : "") + (u ? M + u + "M" : "") + (l ? M + l + "S" : "")
            }
            var Sa, Ha;
            Ha = Array.prototype.some ? Array.prototype.some : function(e) {
                for (var t = Object(this), n = t.length >>> 0, a = 0; a < n; a++)
                    if (a in t && e.call(this, t[a], a, t)) return !0;
                return !1
            };
            var ja = t.momentProperties = [],
                xa = !1,
                Oa = {};
            t.suppressDeprecationWarnings = !1, t.deprecationHandler = null;
            var Pa;
            Pa = Object.keys ? Object.keys : function(e) {
                var t, n = [];
                for (t in e) u(e, t) && n.push(t);
                return n
            };
            var Wa = {
                    sameDay: "[Today at] LT",
                    nextDay: "[Tomorrow at] LT",
                    nextWeek: "dddd [at] LT",
                    lastDay: "[Yesterday at] LT",
                    lastWeek: "[Last] dddd [at] LT",
                    sameElse: "L"
                },
                Ea = {
                    LTS: "h:mm:ss A",
                    LT: "h:mm A",
                    L: "MM/DD/YYYY",
                    LL: "MMMM D, YYYY",
                    LLL: "MMMM D, YYYY h:mm A",
                    LLLL: "dddd, MMMM D, YYYY h:mm A"
                },
                Aa = /\d{1,2}/,
                Fa = {
                    future: "in %s",
                    past: "%s ago",
                    s: "a few seconds",
                    ss: "%d seconds",
                    m: "a minute",
                    mm: "%d minutes",
                    h: "an hour",
                    hh: "%d hours",
                    d: "a day",
                    dd: "%d days",
                    M: "a month",
                    MM: "%d months",
                    y: "a year",
                    yy: "%d years"
                },
                za = {},
                Ja = {},
                Ra = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
                Ia = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
                Na = {},
                Ca = {},
                Ua = /\d/,
                Ga = /\d\d/,
                Va = /\d{3}/,
                $a = /\d{4}/,
                Za = /[+-]?\d{6}/,
                Ba = /\d\d?/,
                Ka = /\d\d\d\d?/,
                qa = /\d\d\d\d\d\d?/,
                Qa = /\d{1,3}/,
                Xa = /\d{1,4}/,
                er = /[+-]?\d{1,6}/,
                tr = /\d+/,
                nr = /[+-]?\d+/,
                ar = /Z|[+-]\d\d:?\d\d/gi,
                rr = /Z|[+-]\d\d(?::?\d\d)?/gi,
                sr = /[+-]?\d+(\.\d{1,3})?/,
                ir = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
                or = {},
                _r = {},
                dr = 0,
                ur = 1,
                lr = 2,
                mr = 3,
                cr = 4,
                hr = 5,
                fr = 6,
                Mr = 7,
                Lr = 8;
            N("Y", 0, 0, function() {
                var e = this.year();
                return e <= 9999 ? "" + e : "+" + e
            }), N(0, ["YY", 2], 0, function() {
                return this.year() % 100
            }), N(0, ["YYYY", 4], 0, "year"), N(0, ["YYYYY", 5], 0, "year"), N(0, ["YYYYYY", 6, !0], 0, "year"), A("year", "y"), J("year", 1), $("Y", nr), $("YY", Ba, Ga), $("YYYY", Xa, $a), $("YYYYY", er, Za), $("YYYYYY", er, Za), q(["YYYYY", "YYYYYY"], dr), q("YYYY", function(e, n) {
                n[dr] = 2 === e.length ? t.parseTwoDigitYear(e) : k(e)
            }), q("YY", function(e, n) {
                n[dr] = t.parseTwoDigitYear(e)
            }), q("Y", function(e, t) {
                t[dr] = parseInt(e, 10)
            }), t.parseTwoDigitYear = function(e) {
                return k(e) + (k(e) > 68 ? 1900 : 2e3)
            };
            var yr, Yr = ae("FullYear", !0);
            yr = Array.prototype.indexOf ? Array.prototype.indexOf : function(e) {
                var t;
                for (t = 0; t < this.length; ++t)
                    if (this[t] === e) return t;
                return -1
            }, N("M", ["MM", 2], "Mo", function() {
                return this.month() + 1
            }), N("MMM", 0, 0, function(e) {
                return this.localeData().monthsShort(this, e)
            }), N("MMMM", 0, 0, function(e) {
                return this.localeData().months(this, e)
            }), A("month", "M"), J("month", 8), $("M", Ba), $("MM", Ba, Ga), $("MMM", function(e, t) {
                return t.monthsShortRegex(e)
            }), $("MMMM", function(e, t) {
                return t.monthsRegex(e)
            }), q(["M", "MM"], function(e, t) {
                t[ur] = k(e) - 1
            }), q(["MMM", "MMMM"], function(e, t, n, a) {
                var r = n._locale.monthsParse(e, a, n._strict);
                null != r ? t[ur] = r : h(n).invalidMonth = e
            });
            var pr = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
                kr = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
                Dr = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
                gr = ir,
                vr = ir;
            N("w", ["ww", 2], "wo", "week"), N("W", ["WW", 2], "Wo", "isoWeek"), A("week", "w"), A("isoWeek", "W"), J("week", 5), J("isoWeek", 5), $("w", Ba), $("ww", Ba, Ga), $("W", Ba), $("WW", Ba, Ga), Q(["w", "ww", "W", "WW"], function(e, t, n, a) {
                t[a.substr(0, 1)] = k(e)
            });
            var wr = {
                dow: 0,
                doy: 6
            };
            N("d", 0, "do", "day"), N("dd", 0, 0, function(e) {
                return this.localeData().weekdaysMin(this, e)
            }), N("ddd", 0, 0, function(e) {
                return this.localeData().weekdaysShort(this, e)
            }), N("dddd", 0, 0, function(e) {
                return this.localeData().weekdays(this, e)
            }), N("e", 0, 0, "weekday"), N("E", 0, 0, "isoWeekday"), A("day", "d"), A("weekday", "e"), A("isoWeekday", "E"), J("day", 11), J("weekday", 11), J("isoWeekday", 11), $("d", Ba), $("e", Ba), $("E", Ba), $("dd", function(e, t) {
                return t.weekdaysMinRegex(e)
            }), $("ddd", function(e, t) {
                return t.weekdaysShortRegex(e)
            }), $("dddd", function(e, t) {
                return t.weekdaysRegex(e)
            }), Q(["dd", "ddd", "dddd"], function(e, t, n, a) {
                var r = n._locale.weekdaysParse(e, a, n._strict);
                null != r ? t.d = r : h(n).invalidWeekday = e
            }), Q(["d", "e", "E"], function(e, t, n, a) {
                t[a] = k(e)
            });
            var Tr = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
                br = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
                Sr = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
                Hr = ir,
                jr = ir,
                xr = ir;
            N("H", ["HH", 2], 0, "hour"), N("h", ["hh", 2], 0, Ge), N("k", ["kk", 2], 0, Ve), N("hmm", 0, 0, function() {
                return "" + Ge.apply(this) + I(this.minutes(), 2)
            }), N("hmmss", 0, 0, function() {
                return "" + Ge.apply(this) + I(this.minutes(), 2) + I(this.seconds(), 2)
            }), N("Hmm", 0, 0, function() {
                return "" + this.hours() + I(this.minutes(), 2)
            }), N("Hmmss", 0, 0, function() {
                return "" + this.hours() + I(this.minutes(), 2) + I(this.seconds(), 2)
            }), $e("a", !0), $e("A", !1), A("hour", "h"), J("hour", 13), $("a", Ze), $("A", Ze), $("H", Ba), $("h", Ba), $("k", Ba), $("HH", Ba, Ga), $("hh", Ba, Ga), $("kk", Ba, Ga), $("hmm", Ka), $("hmmss", qa), $("Hmm", Ka), $("Hmmss", qa), q(["H", "HH"], mr), q(["k", "kk"], function(e, t, n) {
                var a = k(e);
                t[mr] = 24 === a ? 0 : a
            }), q(["a", "A"], function(e, t, n) {
                n._isPm = n._locale.isPM(e), n._meridiem = e
            }), q(["h", "hh"], function(e, t, n) {
                t[mr] = k(e), h(n).bigHour = !0
            }), q("hmm", function(e, t, n) {
                var a = e.length - 2;
                t[mr] = k(e.substr(0, a)), t[cr] = k(e.substr(a)), h(n).bigHour = !0
            }), q("hmmss", function(e, t, n) {
                var a = e.length - 4,
                    r = e.length - 2;
                t[mr] = k(e.substr(0, a)), t[cr] = k(e.substr(a, 2)), t[hr] = k(e.substr(r)), h(n).bigHour = !0
            }), q("Hmm", function(e, t, n) {
                var a = e.length - 2;
                t[mr] = k(e.substr(0, a)), t[cr] = k(e.substr(a))
            }), q("Hmmss", function(e, t, n) {
                var a = e.length - 4,
                    r = e.length - 2;
                t[mr] = k(e.substr(0, a)), t[cr] = k(e.substr(a, 2)), t[hr] = k(e.substr(r))
            });
            var Or, Pr = /[ap]\.?m?\.?/i,
                Wr = ae("Hours", !0),
                Er = {
                    calendar: Wa,
                    longDateFormat: Ea,
                    invalidDate: "Invalid date",
                    ordinal: "%d",
                    dayOfMonthOrdinalParse: Aa,
                    relativeTime: Fa,
                    months: kr,
                    monthsShort: Dr,
                    week: wr,
                    weekdays: Tr,
                    weekdaysMin: Sr,
                    weekdaysShort: br,
                    meridiemParse: Pr
                },
                Ar = {},
                Fr = {},
                zr = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                Jr = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
                Rr = /Z|[+-]\d\d(?::?\d\d)?/,
                Ir = [
                    ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
                    ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
                    ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
                    ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
                    ["YYYY-DDD", /\d{4}-\d{3}/],
                    ["YYYY-MM", /\d{4}-\d\d/, !1],
                    ["YYYYYYMMDD", /[+-]\d{10}/],
                    ["YYYYMMDD", /\d{8}/],
                    ["GGGG[W]WWE", /\d{4}W\d{3}/],
                    ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
                    ["YYYYDDD", /\d{7}/]
                ],
                Nr = [
                    ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
                    ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
                    ["HH:mm:ss", /\d\d:\d\d:\d\d/],
                    ["HH:mm", /\d\d:\d\d/],
                    ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
                    ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
                    ["HHmmss", /\d\d\d\d\d\d/],
                    ["HHmm", /\d\d\d\d/],
                    ["HH", /\d\d/]
                ],
                Cr = /^\/?Date\((\-?\d+)/i,
                Ur = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
                Gr = {
                    UT: 0,
                    GMT: 0,
                    EDT: -240,
                    EST: -300,
                    CDT: -300,
                    CST: -360,
                    MDT: -360,
                    MST: -420,
                    PDT: -420,
                    PST: -480
                };
            t.createFromInputFallback = v("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(e) {
                e._d = new Date(e._i + (e._useUTC ? " UTC" : ""))
            }), t.ISO_8601 = function() {}, t.RFC_2822 = function() {};
            var Vr = v("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
                    var e = Tt.apply(null, arguments);
                    return this.isValid() && e.isValid() ? e < this ? this : e : M()
                }),
                $r = v("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
                    var e = Tt.apply(null, arguments);
                    return this.isValid() && e.isValid() ? e > this ? this : e : M()
                }),
                Zr = function() {
                    return Date.now ? Date.now() : +new Date
                },
                Br = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];
            At("Z", ":"), At("ZZ", ""), $("Z", rr), $("ZZ", rr), q(["Z", "ZZ"], function(e, t, n) {
                n._useUTC = !0, n._tzm = Ft(rr, e)
            });
            var Kr = /([\+\-]|\d\d)/gi;
            t.updateOffset = function() {};
            var qr = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,
                Qr = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
            qt.fn = Pt.prototype, qt.invalid = Ot;
            var Xr = tn(1, "add"),
                es = tn(-1, "subtract");
            t.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", t.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
            var ts = v("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
                return void 0 === e ? this.localeData() : this.locale(e)
            });
            N(0, ["gg", 2], 0, function() {
                return this.weekYear() % 100
            }), N(0, ["GG", 2], 0, function() {
                return this.isoWeekYear() % 100
            }), Fn("gggg", "weekYear"), Fn("ggggg", "weekYear"), Fn("GGGG", "isoWeekYear"), Fn("GGGGG", "isoWeekYear"), A("weekYear", "gg"), A("isoWeekYear", "GG"), J("weekYear", 1), J("isoWeekYear", 1), $("G", nr), $("g", nr), $("GG", Ba, Ga), $("gg", Ba, Ga), $("GGGG", Xa, $a), $("gggg", Xa, $a), $("GGGGG", er, Za), $("ggggg", er, Za), Q(["gggg", "ggggg", "GGGG", "GGGGG"], function(e, t, n, a) {
                t[a.substr(0, 2)] = k(e)
            }), Q(["gg", "GG"], function(e, n, a, r) {
                n[r] = t.parseTwoDigitYear(e)
            }), N("Q", 0, "Qo", "quarter"), A("quarter", "Q"), J("quarter", 7), $("Q", Ua), q("Q", function(e, t) {
                t[ur] = 3 * (k(e) - 1)
            }), N("D", ["DD", 2], "Do", "date"), A("date", "D"), J("date", 9), $("D", Ba), $("DD", Ba, Ga), $("Do", function(e, t) {
                return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient
            }), q(["D", "DD"], lr), q("Do", function(e, t) {
                t[lr] = k(e.match(Ba)[0], 10)
            });
            var ns = ae("Date", !0);
            N("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), A("dayOfYear", "DDD"), J("dayOfYear", 4), $("DDD", Qa), $("DDDD", Va), q(["DDD", "DDDD"], function(e, t, n) {
                n._dayOfYear = k(e)
            }), N("m", ["mm", 2], 0, "minute"), A("minute", "m"), J("minute", 14), $("m", Ba), $("mm", Ba, Ga), q(["m", "mm"], cr);
            var as = ae("Minutes", !1);
            N("s", ["ss", 2], 0, "second"), A("second", "s"), J("second", 15), $("s", Ba), $("ss", Ba, Ga), q(["s", "ss"], hr);
            var rs = ae("Seconds", !1);
            N("S", 0, 0, function() {
                return ~~(this.millisecond() / 100)
            }), N(0, ["SS", 2], 0, function() {
                return ~~(this.millisecond() / 10)
            }), N(0, ["SSS", 3], 0, "millisecond"), N(0, ["SSSS", 4], 0, function() {
                return 10 * this.millisecond()
            }), N(0, ["SSSSS", 5], 0, function() {
                return 100 * this.millisecond()
            }), N(0, ["SSSSSS", 6], 0, function() {
                return 1e3 * this.millisecond()
            }), N(0, ["SSSSSSS", 7], 0, function() {
                return 1e4 * this.millisecond()
            }), N(0, ["SSSSSSSS", 8], 0, function() {
                return 1e5 * this.millisecond()
            }), N(0, ["SSSSSSSSS", 9], 0, function() {
                return 1e6 * this.millisecond()
            }), A("millisecond", "ms"), J("millisecond", 16), $("S", Qa, Ua), $("SS", Qa, Ga), $("SSS", Qa, Va);
            var ss;
            for (ss = "SSSS"; ss.length <= 9; ss += "S") $(ss, tr);
            for (ss = "S"; ss.length <= 9; ss += "S") q(ss, Vn);
            var is = ae("Milliseconds", !1);
            N("z", 0, 0, "zoneAbbr"), N("zz", 0, 0, "zoneName");
            var os = y.prototype;
            os.add = Xr, os.calendar = rn, os.clone = sn, os.diff = cn, os.endOf = Tn, os.format = yn, os.from = Yn, os.fromNow = pn, os.to = kn, os.toNow = Dn, os.get = ie, os.invalidAt = En, os.isAfter = on, os.isBefore = _n, os.isBetween = dn, os.isSame = un, os.isSameOrAfter = ln, os.isSameOrBefore = mn, os.isValid = Pn, os.lang = ts, os.locale = gn, os.localeData = vn, os.max = $r, os.min = Vr, os.parsingFlags = Wn, os.set = oe, os.startOf = wn, os.subtract = es, os.toArray = jn, os.toObject = xn, os.toDate = Hn, os.toISOString = Mn, os.inspect = Ln, os.toJSON = On, os.toString = fn, os.unix = Sn, os.valueOf = bn, os.creationData = An, os.year = Yr, os.isLeapYear = ne, os.weekYear = zn, os.isoWeekYear = Jn, os.quarter = os.quarters = Un, os.month = fe, os.daysInMonth = Me, os.week = os.weeks = He, os.isoWeek = os.isoWeeks = je, os.weeksInYear = In, os.isoWeeksInYear = Rn, os.date = ns, os.day = os.days = ze, os.weekday = Je, os.isoWeekday = Re, os.dayOfYear = Gn, os.hour = os.hours = Wr, os.minute = os.minutes = as, os.second = os.seconds = rs, os.millisecond = os.milliseconds = is, os.utcOffset = Rt, os.utc = Nt, os.local = Ct, os.parseZone = Ut, os.hasAlignedHourOffset = Gt, os.isDST = Vt, os.isLocal = Zt, os.isUtcOffset = Bt, os.isUtc = Kt, os.isUTC = Kt, os.zoneAbbr = $n, os.zoneName = Zn, os.dates = v("dates accessor is deprecated. Use date instead.", ns), os.months = v("months accessor is deprecated. Use month instead", fe), os.years = v("years accessor is deprecated. Use year instead", Yr), os.zone = v("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", It), os.isDSTShifted = v("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", $t);
            var _s = H.prototype;
            _s.calendar = j, _s.longDateFormat = x, _s.invalidDate = O, _s.ordinal = P, _s.preparse = qn, _s.postformat = qn, _s.relativeTime = W, _s.pastFuture = E, _s.set = b, _s.months = ue, _s.monthsShort = le, _s.monthsParse = ce, _s.monthsRegex = ye, _s.monthsShortRegex = Le, _s.week = Te, _s.firstDayOfYear = Se, _s.firstDayOfWeek = be, _s.weekdays = Pe, _s.weekdaysMin = Ee, _s.weekdaysShort = We, _s.weekdaysParse = Fe, _s.weekdaysRegex = Ie, _s.weekdaysShortRegex = Ne, _s.weekdaysMinRegex = Ce, _s.isPM = Be, _s.meridiem = Ke, et("en", {
                dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
                ordinal: function(e) {
                    var t = e % 10;
                    return e + (1 === k(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
                }
            }), t.lang = v("moment.lang is deprecated. Use moment.locale instead.", et), t.langData = v("moment.langData is deprecated. Use moment.localeData instead.", at);
            var ds = Math.abs,
                us = Ma("ms"),
                ls = Ma("s"),
                ms = Ma("m"),
                cs = Ma("h"),
                hs = Ma("d"),
                fs = Ma("w"),
                Ms = Ma("M"),
                Ls = Ma("y"),
                ys = Ya("milliseconds"),
                Ys = Ya("seconds"),
                ps = Ya("minutes"),
                ks = Ya("hours"),
                Ds = Ya("days"),
                gs = Ya("months"),
                vs = Ya("years"),
                ws = Math.round,
                Ts = {
                    ss: 44,
                    s: 45,
                    m: 45,
                    h: 22,
                    d: 26,
                    M: 11
                },
                bs = Math.abs,
                Ss = Pt.prototype;
            return Ss.isValid = xt, Ss.abs = ia, Ss.add = _a, Ss.subtract = da, Ss.as = ha, Ss.asMilliseconds = us, Ss.asSeconds = ls, Ss.asMinutes = ms, Ss.asHours = cs, Ss.asDays = hs, Ss.asWeeks = fs, Ss.asMonths = Ms, Ss.asYears = Ls, Ss.valueOf = fa, Ss._bubble = la, Ss.clone = La, Ss.get = ya, Ss.milliseconds = ys, Ss.seconds = Ys, Ss.minutes = ps, Ss.hours = ks, Ss.days = Ds, Ss.weeks = pa, Ss.months = gs, Ss.years = vs, Ss.humanize = wa, Ss.toISOString = ba, Ss.toString = ba, Ss.toJSON = ba, Ss.locale = gn, Ss.localeData = vn, Ss.toIsoString = v("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", ba), Ss.lang = ts, N("X", 0, 0, "unix"), N("x", 0, 0, "valueOf"), $("x", nr), $("X", sr), q("X", function(e, t, n) {
                    n._d = new Date(1e3 * parseFloat(e, 10))
                }), q("x", function(e, t, n) {
                    n._d = new Date(k(e))
                }), t.version = "2.19.1",
                function(e) {
                    Sa = e
                }(Tt), t.fn = os, t.min = St, t.max = Ht, t.now = Zr, t.utc = m, t.unix = Bn, t.months = ta, t.isDate = _, t.locale = et, t.invalid = M, t.duration = qt, t.isMoment = Y, t.weekdays = aa, t.parseZone = Kn, t.localeData = at, t.isDuration = Wt, t.monthsShort = na, t.weekdaysMin = sa, t.defineLocale = tt, t.updateLocale = nt, t.locales = rt, t.weekdaysShort = ra, t.normalizeUnits = F, t.relativeTimeRounding = ga, t.relativeTimeThreshold = va, t.calendarFormat = an, t.prototype = os, t
        })
    }).call(t, n(1)(e))
}, function(e, t) {
    e.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function() {
                return e.l
            }
        }), Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function() {
                return e.i
            }
        }), e.webpackPolyfill = 1), e
    }
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("af", {
            months: "Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),
            weekdaysShort: "Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),
            weekdaysMin: "So_Ma_Di_Wo_Do_Vr_Sa".split("_"),
            meridiemParse: /vm|nm/i,
            isPM: function(e) {
                return /^nm$/i.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 12 ? n ? "vm" : "VM" : n ? "nm" : "NM"
            },
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Vandag om] LT",
                nextDay: "[Môre om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[Gister om] LT",
                lastWeek: "[Laas] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "oor %s",
                past: "%s gelede",
                s: "'n paar sekondes",
                m: "'n minuut",
                mm: "%d minute",
                h: "'n uur",
                hh: "%d ure",
                d: "'n dag",
                dd: "%d dae",
                M: "'n maand",
                MM: "%d maande",
                y: "'n jaar",
                yy: "%d jaar"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ar-dz", {
            months: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "أح_إث_ثلا_أر_خم_جم_سب".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 0,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ar-kw", {
            months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 0,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9",
                0: "0"
            },
            n = function(e) {
                return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5
            },
            a = {
                s: ["أقل من ثانية", "ثانية واحدة", ["ثانيتان", "ثانيتين"], "%d ثوان", "%d ثانية", "%d ثانية"],
                m: ["أقل من دقيقة", "دقيقة واحدة", ["دقيقتان", "دقيقتين"], "%d دقائق", "%d دقيقة", "%d دقيقة"],
                h: ["أقل من ساعة", "ساعة واحدة", ["ساعتان", "ساعتين"], "%d ساعات", "%d ساعة", "%d ساعة"],
                d: ["أقل من يوم", "يوم واحد", ["يومان", "يومين"], "%d أيام", "%d يومًا", "%d يوم"],
                M: ["أقل من شهر", "شهر واحد", ["شهران", "شهرين"], "%d أشهر", "%d شهرا", "%d شهر"],
                y: ["أقل من عام", "عام واحد", ["عامان", "عامين"], "%d أعوام", "%d عامًا", "%d عام"]
            },
            r = function(e) {
                return function(t, r, s, i) {
                    var o = n(t),
                        _ = a[e][n(t)];
                    return 2 === o && (_ = _[r ? 0 : 1]), _.replace(/%d/i, t)
                }
            },
            s = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return e.defineLocale("ar-ly", {
            months: s,
            monthsShort: s,
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "D/‏M/‏YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            meridiemParse: /ص|م/,
            isPM: function(e) {
                return "م" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "ص" : "م"
            },
            calendar: {
                sameDay: "[اليوم عند الساعة] LT",
                nextDay: "[غدًا عند الساعة] LT",
                nextWeek: "dddd [عند الساعة] LT",
                lastDay: "[أمس عند الساعة] LT",
                lastWeek: "dddd [عند الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "بعد %s",
                past: "منذ %s",
                s: r("s"),
                m: r("m"),
                mm: r("m"),
                h: r("h"),
                hh: r("h"),
                d: r("d"),
                dd: r("d"),
                M: r("M"),
                MM: r("M"),
                y: r("y"),
                yy: r("y")
            },
            preparse: function(e) {
                return e.replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                }).replace(/,/g, "،")
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ar-ma", {
            months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "١",
                2: "٢",
                3: "٣",
                4: "٤",
                5: "٥",
                6: "٦",
                7: "٧",
                8: "٨",
                9: "٩",
                0: "٠"
            },
            n = {
                "١": "1",
                "٢": "2",
                "٣": "3",
                "٤": "4",
                "٥": "5",
                "٦": "6",
                "٧": "7",
                "٨": "8",
                "٩": "9",
                "٠": "0"
            };
        return e.defineLocale("ar-sa", {
            months: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            meridiemParse: /ص|م/,
            isPM: function(e) {
                return "م" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "ص" : "م"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            preparse: function(e) {
                return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(e) {
                    return n[e]
                }).replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                }).replace(/,/g, "،")
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ar-tn", {
            months: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            monthsShort: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "١",
                2: "٢",
                3: "٣",
                4: "٤",
                5: "٥",
                6: "٦",
                7: "٧",
                8: "٨",
                9: "٩",
                0: "٠"
            },
            n = {
                "١": "1",
                "٢": "2",
                "٣": "3",
                "٤": "4",
                "٥": "5",
                "٦": "6",
                "٧": "7",
                "٨": "8",
                "٩": "9",
                "٠": "0"
            },
            a = function(e) {
                return 0 === e ? 0 : 1 === e ? 1 : 2 === e ? 2 : e % 100 >= 3 && e % 100 <= 10 ? 3 : e % 100 >= 11 ? 4 : 5
            },
            r = {
                s: ["أقل من ثانية", "ثانية واحدة", ["ثانيتان", "ثانيتين"], "%d ثوان", "%d ثانية", "%d ثانية"],
                m: ["أقل من دقيقة", "دقيقة واحدة", ["دقيقتان", "دقيقتين"], "%d دقائق", "%d دقيقة", "%d دقيقة"],
                h: ["أقل من ساعة", "ساعة واحدة", ["ساعتان", "ساعتين"], "%d ساعات", "%d ساعة", "%d ساعة"],
                d: ["أقل من يوم", "يوم واحد", ["يومان", "يومين"], "%d أيام", "%d يومًا", "%d يوم"],
                M: ["أقل من شهر", "شهر واحد", ["شهران", "شهرين"], "%d أشهر", "%d شهرا", "%d شهر"],
                y: ["أقل من عام", "عام واحد", ["عامان", "عامين"], "%d أعوام", "%d عامًا", "%d عام"]
            },
            s = function(e) {
                return function(t, n, s, i) {
                    var o = a(t),
                        _ = r[e][a(t)];
                    return 2 === o && (_ = _[n ? 0 : 1]), _.replace(/%d/i, t)
                }
            },
            i = ["كانون الثاني يناير", "شباط فبراير", "آذار مارس", "نيسان أبريل", "أيار مايو", "حزيران يونيو", "تموز يوليو", "آب أغسطس", "أيلول سبتمبر", "تشرين الأول أكتوبر", "تشرين الثاني نوفمبر", "كانون الأول ديسمبر"];
        return e.defineLocale("ar", {
            months: i,
            monthsShort: i,
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "D/‏M/‏YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            meridiemParse: /ص|م/,
            isPM: function(e) {
                return "م" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "ص" : "م"
            },
            calendar: {
                sameDay: "[اليوم عند الساعة] LT",
                nextDay: "[غدًا عند الساعة] LT",
                nextWeek: "dddd [عند الساعة] LT",
                lastDay: "[أمس عند الساعة] LT",
                lastWeek: "dddd [عند الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "بعد %s",
                past: "منذ %s",
                s: s("s"),
                m: s("m"),
                mm: s("m"),
                h: s("h"),
                hh: s("h"),
                d: s("d"),
                dd: s("d"),
                M: s("M"),
                MM: s("M"),
                y: s("y"),
                yy: s("y")
            },
            preparse: function(e) {
                return e.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(e) {
                    return n[e]
                }).replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                }).replace(/,/g, "،")
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            1: "-inci",
            5: "-inci",
            8: "-inci",
            70: "-inci",
            80: "-inci",
            2: "-nci",
            7: "-nci",
            20: "-nci",
            50: "-nci",
            3: "-üncü",
            4: "-üncü",
            100: "-üncü",
            6: "-ncı",
            9: "-uncu",
            10: "-uncu",
            30: "-uncu",
            60: "-ıncı",
            90: "-ıncı"
        };
        return e.defineLocale("az", {
            months: "yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),
            monthsShort: "yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),
            weekdays: "Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),
            weekdaysShort: "Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),
            weekdaysMin: "Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[bugün saat] LT",
                nextDay: "[sabah saat] LT",
                nextWeek: "[gələn həftə] dddd [saat] LT",
                lastDay: "[dünən] LT",
                lastWeek: "[keçən həftə] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s sonra",
                past: "%s əvvəl",
                s: "birneçə saniyyə",
                m: "bir dəqiqə",
                mm: "%d dəqiqə",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir il",
                yy: "%d il"
            },
            meridiemParse: /gecə|səhər|gündüz|axşam/,
            isPM: function(e) {
                return /^(gündüz|axşam)$/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "gecə" : e < 12 ? "səhər" : e < 17 ? "gündüz" : "axşam"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
            ordinal: function(e) {
                if (0 === e) return e + "-ıncı";
                var n = e % 10,
                    a = e % 100 - n,
                    r = e >= 100 ? 100 : null;
                return e + (t[n] || t[a] || t[r])
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t) {
            var n = e.split("_");
            return t % 10 == 1 && t % 100 != 11 ? n[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? n[1] : n[2]
        }

        function n(e, n, a) {
            var r = {
                mm: n ? "хвіліна_хвіліны_хвілін" : "хвіліну_хвіліны_хвілін",
                hh: n ? "гадзіна_гадзіны_гадзін" : "гадзіну_гадзіны_гадзін",
                dd: "дзень_дні_дзён",
                MM: "месяц_месяцы_месяцаў",
                yy: "год_гады_гадоў"
            };
            return "m" === a ? n ? "хвіліна" : "хвіліну" : "h" === a ? n ? "гадзіна" : "гадзіну" : e + " " + t(r[a], +e)
        }
        return e.defineLocale("be", {
            months: {
                format: "студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_"),
                standalone: "студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_")
            },
            monthsShort: "студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),
            weekdays: {
                format: "нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_"),
                standalone: "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),
                isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
            },
            weekdaysShort: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            weekdaysMin: "нд_пн_ат_ср_чц_пт_сб".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY г.",
                LLL: "D MMMM YYYY г., HH:mm",
                LLLL: "dddd, D MMMM YYYY г., HH:mm"
            },
            calendar: {
                sameDay: "[Сёння ў] LT",
                nextDay: "[Заўтра ў] LT",
                lastDay: "[Учора ў] LT",
                nextWeek: function() {
                    return "[У] dddd [ў] LT"
                },
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return "[У мінулую] dddd [ў] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[У мінулы] dddd [ў] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "праз %s",
                past: "%s таму",
                s: "некалькі секунд",
                m: n,
                mm: n,
                h: n,
                hh: n,
                d: "дзень",
                dd: n,
                M: "месяц",
                MM: n,
                y: "год",
                yy: n
            },
            meridiemParse: /ночы|раніцы|дня|вечара/,
            isPM: function(e) {
                return /^(дня|вечара)$/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "ночы" : e < 12 ? "раніцы" : e < 17 ? "дня" : "вечара"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "M":
                    case "d":
                    case "DDD":
                    case "w":
                    case "W":
                        return e % 10 != 2 && e % 10 != 3 || e % 100 == 12 || e % 100 == 13 ? e + "-ы" : e + "-і";
                    case "D":
                        return e + "-га";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("bg", {
            months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
            weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY H:mm",
                LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[Днес в] LT",
                nextDay: "[Утре в] LT",
                nextWeek: "dddd [в] LT",
                lastDay: "[Вчера в] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[В изминалата] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[В изминалия] dddd [в] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "след %s",
                past: "преди %s",
                s: "няколко секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дни",
                M: "месец",
                MM: "%d месеца",
                y: "година",
                yy: "%d години"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function(e) {
                var t = e % 10,
                    n = e % 100;
                return 0 === e ? e + "-ев" : 0 === n ? e + "-ен" : n > 10 && n < 20 ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("bm", {
            months: "Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo".split("_"),
            monthsShort: "Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des".split("_"),
            weekdays: "Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri".split("_"),
            weekdaysShort: "Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib".split("_"),
            weekdaysMin: "Ka_Nt_Ta_Ar_Al_Ju_Si".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "MMMM [tile] D [san] YYYY",
                LLL: "MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm",
                LLLL: "dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm"
            },
            calendar: {
                sameDay: "[Bi lɛrɛ] LT",
                nextDay: "[Sini lɛrɛ] LT",
                nextWeek: "dddd [don lɛrɛ] LT",
                lastDay: "[Kunu lɛrɛ] LT",
                lastWeek: "dddd [tɛmɛnen lɛrɛ] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s kɔnɔ",
                past: "a bɛ %s bɔ",
                s: "sanga dama dama",
                m: "miniti kelen",
                mm: "miniti %d",
                h: "lɛrɛ kelen",
                hh: "lɛrɛ %d",
                d: "tile kelen",
                dd: "tile %d",
                M: "kalo kelen",
                MM: "kalo %d",
                y: "san kelen",
                yy: "san %d"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "১",
                2: "২",
                3: "৩",
                4: "৪",
                5: "৫",
                6: "৬",
                7: "৭",
                8: "৮",
                9: "৯",
                0: "০"
            },
            n = {
                "১": "1",
                "২": "2",
                "৩": "3",
                "৪": "4",
                "৫": "5",
                "৬": "6",
                "৭": "7",
                "৮": "8",
                "৯": "9",
                "০": "0"
            };
        return e.defineLocale("bn", {
            months: "জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),
            monthsShort: "জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে".split("_"),
            weekdays: "রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split("_"),
            weekdaysShort: "রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),
            weekdaysMin: "রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি".split("_"),
            longDateFormat: {
                LT: "A h:mm সময়",
                LTS: "A h:mm:ss সময়",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm সময়",
                LLLL: "dddd, D MMMM YYYY, A h:mm সময়"
            },
            calendar: {
                sameDay: "[আজ] LT",
                nextDay: "[আগামীকাল] LT",
                nextWeek: "dddd, LT",
                lastDay: "[গতকাল] LT",
                lastWeek: "[গত] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s পরে",
                past: "%s আগে",
                s: "কয়েক সেকেন্ড",
                m: "এক মিনিট",
                mm: "%d মিনিট",
                h: "এক ঘন্টা",
                hh: "%d ঘন্টা",
                d: "এক দিন",
                dd: "%d দিন",
                M: "এক মাস",
                MM: "%d মাস",
                y: "এক বছর",
                yy: "%d বছর"
            },
            preparse: function(e) {
                return e.replace(/[১২৩৪৫৬৭৮৯০]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "রাত" === t && e >= 4 || "দুপুর" === t && e < 5 || "বিকাল" === t ? e + 12 : e
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "রাত" : e < 10 ? "সকাল" : e < 17 ? "দুপুর" : e < 20 ? "বিকাল" : "রাত"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "༡",
                2: "༢",
                3: "༣",
                4: "༤",
                5: "༥",
                6: "༦",
                7: "༧",
                8: "༨",
                9: "༩",
                0: "༠"
            },
            n = {
                "༡": "1",
                "༢": "2",
                "༣": "3",
                "༤": "4",
                "༥": "5",
                "༦": "6",
                "༧": "7",
                "༨": "8",
                "༩": "9",
                "༠": "0"
            };
        return e.defineLocale("bo", {
            months: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            monthsShort: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),
            weekdays: "གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),
            weekdaysShort: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            weekdaysMin: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),
            longDateFormat: {
                LT: "A h:mm",
                LTS: "A h:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm",
                LLLL: "dddd, D MMMM YYYY, A h:mm"
            },
            calendar: {
                sameDay: "[དི་རིང] LT",
                nextDay: "[སང་ཉིན] LT",
                nextWeek: "[བདུན་ཕྲག་རྗེས་མ], LT",
                lastDay: "[ཁ་སང] LT",
                lastWeek: "[བདུན་ཕྲག་མཐའ་མ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ལ་",
                past: "%s སྔན་ལ",
                s: "ལམ་སང",
                m: "སྐར་མ་གཅིག",
                mm: "%d སྐར་མ",
                h: "ཆུ་ཚོད་གཅིག",
                hh: "%d ཆུ་ཚོད",
                d: "ཉིན་གཅིག",
                dd: "%d ཉིན་",
                M: "ཟླ་བ་གཅིག",
                MM: "%d ཟླ་བ",
                y: "ལོ་གཅིག",
                yy: "%d ལོ"
            },
            preparse: function(e) {
                return e.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "མཚན་མོ" === t && e >= 4 || "ཉིན་གུང" === t && e < 5 || "དགོང་དག" === t ? e + 12 : e
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "མཚན་མོ" : e < 10 ? "ཞོགས་ཀས" : e < 17 ? "ཉིན་གུང" : e < 20 ? "དགོང་དག" : "མཚན་མོ"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n) {
            return e + " " + r({
                mm: "munutenn",
                MM: "miz",
                dd: "devezh"
            } [n], e)
        }

        function n(e) {
            switch (a(e)) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                    return e + " bloaz";
                default:
                    return e + " vloaz"
            }
        }

        function a(e) {
            return e > 9 ? a(e % 10) : e
        }

        function r(e, t) {
            return 2 === t ? s(e) : e
        }

        function s(e) {
            var t = {
                m: "v",
                b: "v",
                d: "z"
            };
            return void 0 === t[e.charAt(0)] ? e : t[e.charAt(0)] + e.substring(1)
        }
        return e.defineLocale("br", {
            months: "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),
            monthsShort: "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
            weekdays: "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),
            weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "h[e]mm A",
                LTS: "h[e]mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D [a viz] MMMM YYYY",
                LLL: "D [a viz] MMMM YYYY h[e]mm A",
                LLLL: "dddd, D [a viz] MMMM YYYY h[e]mm A"
            },
            calendar: {
                sameDay: "[Hiziv da] LT",
                nextDay: "[Warc'hoazh da] LT",
                nextWeek: "dddd [da] LT",
                lastDay: "[Dec'h da] LT",
                lastWeek: "dddd [paset da] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "a-benn %s",
                past: "%s 'zo",
                s: "un nebeud segondennoù",
                m: "ur vunutenn",
                mm: t,
                h: "un eur",
                hh: "%d eur",
                d: "un devezh",
                dd: t,
                M: "ur miz",
                MM: t,
                y: "ur bloaz",
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
            ordinal: function(e) {
                return e + (1 === e ? "añ" : "vet")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n) {
            var a = e + " ";
            switch (n) {
                case "m":
                    return t ? "jedna minuta" : "jedne minute";
                case "mm":
                    return a += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
                case "h":
                    return t ? "jedan sat" : "jednog sata";
                case "hh":
                    return a += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
                case "dd":
                    return a += 1 === e ? "dan" : "dana";
                case "MM":
                    return a += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
                case "yy":
                    return a += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
            }
        }
        return e.defineLocale("bs", {
            months: "januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "dan",
                dd: t,
                M: "mjesec",
                MM: t,
                y: "godinu",
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ca", {
            months: {
                standalone: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),
                format: "de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split("_"),
                isFormat: /D[oD]?(\s)+MMMM/
            },
            monthsShort: "gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.".split("_"),
            monthsParseExact: !0,
            weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),
            weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
            weekdaysMin: "dg_dl_dt_dc_dj_dv_ds".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM [de] YYYY",
                ll: "D MMM YYYY",
                LLL: "D MMMM [de] YYYY [a les] H:mm",
                lll: "D MMM YYYY, H:mm",
                LLLL: "dddd D MMMM [de] YYYY [a les] H:mm",
                llll: "ddd D MMM YYYY, H:mm"
            },
            calendar: {
                sameDay: function() {
                    return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                nextDay: function() {
                    return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                lastDay: function() {
                    return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "d'aquí %s",
                past: "fa %s",
                s: "uns segons",
                m: "un minut",
                mm: "%d minuts",
                h: "una hora",
                hh: "%d hores",
                d: "un dia",
                dd: "%d dies",
                M: "un mes",
                MM: "%d mesos",
                y: "un any",
                yy: "%d anys"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
            ordinal: function(e, t) {
                var n = 1 === e ? "r" : 2 === e ? "n" : 3 === e ? "r" : 4 === e ? "t" : "è";
                return "w" !== t && "W" !== t || (n = "a"), e + n
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            return e > 1 && e < 5 && 1 != ~~(e / 10)
        }

        function n(e, n, a, r) {
            var s = e + " ";
            switch (a) {
                case "s":
                    return n || r ? "pár sekund" : "pár sekundami";
                case "m":
                    return n ? "minuta" : r ? "minutu" : "minutou";
                case "mm":
                    return n || r ? s + (t(e) ? "minuty" : "minut") : s + "minutami";
                case "h":
                    return n ? "hodina" : r ? "hodinu" : "hodinou";
                case "hh":
                    return n || r ? s + (t(e) ? "hodiny" : "hodin") : s + "hodinami";
                case "d":
                    return n || r ? "den" : "dnem";
                case "dd":
                    return n || r ? s + (t(e) ? "dny" : "dní") : s + "dny";
                case "M":
                    return n || r ? "měsíc" : "měsícem";
                case "MM":
                    return n || r ? s + (t(e) ? "měsíce" : "měsíců") : s + "měsíci";
                case "y":
                    return n || r ? "rok" : "rokem";
                case "yy":
                    return n || r ? s + (t(e) ? "roky" : "let") : s + "lety"
            }
        }
        var a = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
            r = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");
        return e.defineLocale("cs", {
            months: a,
            monthsShort: r,
            monthsParse: function(e, t) {
                var n, a = [];
                for (n = 0; n < 12; n++) a[n] = new RegExp("^" + e[n] + "$|^" + t[n] + "$", "i");
                return a
            }(a, r),
            shortMonthsParse: function(e) {
                var t, n = [];
                for (t = 0; t < 12; t++) n[t] = new RegExp("^" + e[t] + "$", "i");
                return n
            }(r),
            longMonthsParse: function(e) {
                var t, n = [];
                for (t = 0; t < 12; t++) n[t] = new RegExp("^" + e[t] + "$", "i");
                return n
            }(a),
            weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
            weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
            weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd D. MMMM YYYY H:mm",
                l: "D. M. YYYY"
            },
            calendar: {
                sameDay: "[dnes v] LT",
                nextDay: "[zítra v] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v neděli v] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [v] LT";
                        case 3:
                            return "[ve středu v] LT";
                        case 4:
                            return "[ve čtvrtek v] LT";
                        case 5:
                            return "[v pátek v] LT";
                        case 6:
                            return "[v sobotu v] LT"
                    }
                },
                lastDay: "[včera v] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[minulou neděli v] LT";
                        case 1:
                        case 2:
                            return "[minulé] dddd [v] LT";
                        case 3:
                            return "[minulou středu v] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [v] LT";
                        case 6:
                            return "[minulou sobotu v] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "před %s",
                s: n,
                m: n,
                mm: n,
                h: n,
                hh: n,
                d: n,
                dd: n,
                M: n,
                MM: n,
                y: n,
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("cv", {
            months: "кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),
            monthsShort: "кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),
            weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),
            weekdaysShort: "выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),
            weekdaysMin: "вр_тн_ыт_юн_кҫ_эр_шм".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD-MM-YYYY",
                LL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",
                LLL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",
                LLLL: "dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"
            },
            calendar: {
                sameDay: "[Паян] LT [сехетре]",
                nextDay: "[Ыран] LT [сехетре]",
                lastDay: "[Ӗнер] LT [сехетре]",
                nextWeek: "[Ҫитес] dddd LT [сехетре]",
                lastWeek: "[Иртнӗ] dddd LT [сехетре]",
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return e + (/сехет$/i.exec(e) ? "рен" : /ҫул$/i.exec(e) ? "тан" : "ран")
                },
                past: "%s каялла",
                s: "пӗр-ик ҫеккунт",
                m: "пӗр минут",
                mm: "%d минут",
                h: "пӗр сехет",
                hh: "%d сехет",
                d: "пӗр кун",
                dd: "%d кун",
                M: "пӗр уйӑх",
                MM: "%d уйӑх",
                y: "пӗр ҫул",
                yy: "%d ҫул"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
            ordinal: "%d-мӗш",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("cy", {
            months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),
            monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),
            weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),
            weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Heddiw am] LT",
                nextDay: "[Yfory am] LT",
                nextWeek: "dddd [am] LT",
                lastDay: "[Ddoe am] LT",
                lastWeek: "dddd [diwethaf am] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "mewn %s",
                past: "%s yn ôl",
                s: "ychydig eiliadau",
                m: "munud",
                mm: "%d munud",
                h: "awr",
                hh: "%d awr",
                d: "diwrnod",
                dd: "%d diwrnod",
                M: "mis",
                MM: "%d mis",
                y: "blwyddyn",
                yy: "%d flynedd"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
            ordinal: function(e) {
                var t = e,
                    n = "",
                    a = ["", "af", "il", "ydd", "ydd", "ed", "ed", "ed", "fed", "fed", "fed", "eg", "fed", "eg", "eg", "fed", "eg", "eg", "fed", "eg", "fed"];
                return t > 20 ? n = 40 === t || 50 === t || 60 === t || 80 === t || 100 === t ? "fed" : "ain" : t > 0 && (n = a[t]), e + n
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("da", {
            months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY HH:mm",
                LLLL: "dddd [d.] D. MMMM YYYY [kl.] HH:mm"
            },
            calendar: {
                sameDay: "[i dag kl.] LT",
                nextDay: "[i morgen kl.] LT",
                nextWeek: "på dddd [kl.] LT",
                lastDay: "[i går kl.] LT",
                lastWeek: "[i] dddd[s kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "%s siden",
                s: "få sekunder",
                m: "et minut",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dage",
                M: "en måned",
                MM: "%d måneder",
                y: "et år",
                yy: "%d år"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                m: ["eine Minute", "einer Minute"],
                h: ["eine Stunde", "einer Stunde"],
                d: ["ein Tag", "einem Tag"],
                dd: [e + " Tage", e + " Tagen"],
                M: ["ein Monat", "einem Monat"],
                MM: [e + " Monate", e + " Monaten"],
                y: ["ein Jahr", "einem Jahr"],
                yy: [e + " Jahre", e + " Jahren"]
            };
            return t ? r[n][0] : r[n][1]
        }
        return e.defineLocale("de-at", {
            months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
            monthsParseExact: !0,
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY HH:mm",
                LLLL: "dddd, D. MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: t,
                mm: "%d Minuten",
                h: t,
                hh: "%d Stunden",
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                m: ["eine Minute", "einer Minute"],
                h: ["eine Stunde", "einer Stunde"],
                d: ["ein Tag", "einem Tag"],
                dd: [e + " Tage", e + " Tagen"],
                M: ["ein Monat", "einem Monat"],
                MM: [e + " Monate", e + " Monaten"],
                y: ["ein Jahr", "einem Jahr"],
                yy: [e + " Jahre", e + " Jahren"]
            };
            return t ? r[n][0] : r[n][1]
        }
        return e.defineLocale("de-ch", {
            months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
            monthsParseExact: !0,
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY HH.mm",
                LLLL: "dddd, D. MMMM YYYY HH.mm"
            },
            calendar: {
                sameDay: "[heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: t,
                mm: "%d Minuten",
                h: t,
                hh: "%d Stunden",
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                m: ["eine Minute", "einer Minute"],
                h: ["eine Stunde", "einer Stunde"],
                d: ["ein Tag", "einem Tag"],
                dd: [e + " Tage", e + " Tagen"],
                M: ["ein Monat", "einem Monat"],
                MM: [e + " Monate", e + " Monaten"],
                y: ["ein Jahr", "einem Jahr"],
                yy: [e + " Jahre", e + " Jahren"]
            };
            return t ? r[n][0] : r[n][1]
        }
        return e.defineLocale("de", {
            months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
            monthsParseExact: !0,
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY HH:mm",
                LLLL: "dddd, D. MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[heute um] LT [Uhr]",
                sameElse: "L",
                nextDay: "[morgen um] LT [Uhr]",
                nextWeek: "dddd [um] LT [Uhr]",
                lastDay: "[gestern um] LT [Uhr]",
                lastWeek: "[letzten] dddd [um] LT [Uhr]"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: t,
                mm: "%d Minuten",
                h: t,
                hh: "%d Stunden",
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = ["ޖެނުއަރީ", "ފެބްރުއަރީ", "މާރިޗު", "އޭޕްރީލު", "މޭ", "ޖޫން", "ޖުލައި", "އޯގަސްޓު", "ސެޕްޓެމްބަރު", "އޮކްޓޯބަރު", "ނޮވެމްބަރު", "ޑިސެމްބަރު"],
            n = ["އާދިއްތަ", "ހޯމަ", "އަންގާރަ", "ބުދަ", "ބުރާސްފަތި", "ހުކުރު", "ހޮނިހިރު"];
        return e.defineLocale("dv", {
            months: t,
            monthsShort: t,
            weekdays: n,
            weekdaysShort: n,
            weekdaysMin: "އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "D/M/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            meridiemParse: /މކ|މފ/,
            isPM: function(e) {
                return "މފ" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "މކ" : "މފ"
            },
            calendar: {
                sameDay: "[މިއަދު] LT",
                nextDay: "[މާދަމާ] LT",
                nextWeek: "dddd LT",
                lastDay: "[އިއްޔެ] LT",
                lastWeek: "[ފާއިތުވި] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ތެރޭގައި %s",
                past: "ކުރިން %s",
                s: "ސިކުންތުކޮޅެއް",
                m: "މިނިޓެއް",
                mm: "މިނިޓު %d",
                h: "ގަޑިއިރެއް",
                hh: "ގަޑިއިރު %d",
                d: "ދުވަހެއް",
                dd: "ދުވަސް %d",
                M: "މަހެއް",
                MM: "މަސް %d",
                y: "އަހަރެއް",
                yy: "އަހަރު %d"
            },
            preparse: function(e) {
                return e.replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/,/g, "،")
            },
            week: {
                dow: 7,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e)
        }
        return e.defineLocale("el", {
            monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
            monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
            months: function(e, t) {
                return e ? "string" == typeof t && /D/.test(t.substring(0, t.indexOf("MMMM"))) ? this._monthsGenitiveEl[e.month()] : this._monthsNominativeEl[e.month()] : this._monthsNominativeEl
            },
            monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
            weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
            weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
            weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
            meridiem: function(e, t, n) {
                return e > 11 ? n ? "μμ" : "ΜΜ" : n ? "πμ" : "ΠΜ"
            },
            isPM: function(e) {
                return "μ" === (e + "").toLowerCase()[0]
            },
            meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendarEl: {
                sameDay: "[Σήμερα {}] LT",
                nextDay: "[Αύριο {}] LT",
                nextWeek: "dddd [{}] LT",
                lastDay: "[Χθες {}] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 6:
                            return "[το προηγούμενο] dddd [{}] LT";
                        default:
                            return "[την προηγούμενη] dddd [{}] LT"
                    }
                },
                sameElse: "L"
            },
            calendar: function(e, n) {
                var a = this._calendarEl[e],
                    r = n && n.hours();
                return t(a) && (a = a.apply(n)), a.replace("{}", r % 12 == 1 ? "στη" : "στις")
            },
            relativeTime: {
                future: "σε %s",
                past: "%s πριν",
                s: "λίγα δευτερόλεπτα",
                m: "ένα λεπτό",
                mm: "%d λεπτά",
                h: "μία ώρα",
                hh: "%d ώρες",
                d: "μία μέρα",
                dd: "%d μέρες",
                M: "ένας μήνας",
                MM: "%d μήνες",
                y: "ένας χρόνος",
                yy: "%d χρόνια"
            },
            dayOfMonthOrdinalParse: /\d{1,2}η/,
            ordinal: "%dη",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("en-au", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("en-ca", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "YYYY-MM-DD",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY h:mm A",
                LLLL: "dddd, MMMM D, YYYY h:mm A"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("en-gb", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("en-ie", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("en-nz", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("eo", {
            months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
            weekdays: "dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato".split("_"),
            weekdaysShort: "dim_lun_mard_merk_ĵaŭ_ven_sab".split("_"),
            weekdaysMin: "di_lu_ma_me_ĵa_ve_sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "D[-a de] MMMM, YYYY",
                LLL: "D[-a de] MMMM, YYYY HH:mm",
                LLLL: "dddd, [la] D[-a de] MMMM, YYYY HH:mm"
            },
            meridiemParse: /[ap]\.t\.m/i,
            isPM: function(e) {
                return "p" === e.charAt(0).toLowerCase()
            },
            meridiem: function(e, t, n) {
                return e > 11 ? n ? "p.t.m." : "P.T.M." : n ? "a.t.m." : "A.T.M."
            },
            calendar: {
                sameDay: "[Hodiaŭ je] LT",
                nextDay: "[Morgaŭ je] LT",
                nextWeek: "dddd [je] LT",
                lastDay: "[Hieraŭ je] LT",
                lastWeek: "[pasinta] dddd [je] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "post %s",
                past: "antaŭ %s",
                s: "sekundoj",
                m: "minuto",
                mm: "%d minutoj",
                h: "horo",
                hh: "%d horoj",
                d: "tago",
                dd: "%d tagoj",
                M: "monato",
                MM: "%d monatoj",
                y: "jaro",
                yy: "%d jaroj"
            },
            dayOfMonthOrdinalParse: /\d{1,2}a/,
            ordinal: "%da",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
            n = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),
            a = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i],
            r = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        return e.defineLocale("es-do", {
            months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsRegex: r,
            monthsShortRegex: r,
            monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
            monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
            monthsParse: a,
            longMonthsParse: a,
            shortMonthsParse: a,
            weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
            weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY h:mm A",
                LLLL: "dddd, D [de] MMMM [de] YYYY h:mm A"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
            n = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");
        return e.defineLocale("es-us", {
            months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsParseExact: !0,
            weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
            weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "MM/DD/YYYY",
                LL: "MMMM [de] D [de] YYYY",
                LLL: "MMMM [de] D [de] YYYY H:mm",
                LLLL: "dddd, MMMM [de] D [de] YYYY H:mm"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
            n = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"),
            a = [/^ene/i, /^feb/i, /^mar/i, /^abr/i, /^may/i, /^jun/i, /^jul/i, /^ago/i, /^sep/i, /^oct/i, /^nov/i, /^dic/i],
            r = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
        return e.defineLocale("es", {
            months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsRegex: r,
            monthsShortRegex: r,
            monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
            monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
            monthsParse: a,
            longMonthsParse: a,
            shortMonthsParse: a,
            weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
            weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY H:mm",
                LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                s: ["mõne sekundi", "mõni sekund", "paar sekundit"],
                m: ["ühe minuti", "üks minut"],
                mm: [e + " minuti", e + " minutit"],
                h: ["ühe tunni", "tund aega", "üks tund"],
                hh: [e + " tunni", e + " tundi"],
                d: ["ühe päeva", "üks päev"],
                M: ["kuu aja", "kuu aega", "üks kuu"],
                MM: [e + " kuu", e + " kuud"],
                y: ["ühe aasta", "aasta", "üks aasta"],
                yy: [e + " aasta", e + " aastat"]
            };
            return t ? r[n][2] ? r[n][2] : r[n][1] : a ? r[n][0] : r[n][1]
        }
        return e.defineLocale("et", {
            months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
            monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
            weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
            weekdaysShort: "P_E_T_K_N_R_L".split("_"),
            weekdaysMin: "P_E_T_K_N_R_L".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[Täna,] LT",
                nextDay: "[Homme,] LT",
                nextWeek: "[Järgmine] dddd LT",
                lastDay: "[Eile,] LT",
                lastWeek: "[Eelmine] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s pärast",
                past: "%s tagasi",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: "%d päeva",
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("eu", {
            months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
            monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
            monthsParseExact: !0,
            weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
            weekdaysShort: "ig._al._ar._az._og._ol._lr.".split("_"),
            weekdaysMin: "ig_al_ar_az_og_ol_lr".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY[ko] MMMM[ren] D[a]",
                LLL: "YYYY[ko] MMMM[ren] D[a] HH:mm",
                LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",
                l: "YYYY-M-D",
                ll: "YYYY[ko] MMM D[a]",
                lll: "YYYY[ko] MMM D[a] HH:mm",
                llll: "ddd, YYYY[ko] MMM D[a] HH:mm"
            },
            calendar: {
                sameDay: "[gaur] LT[etan]",
                nextDay: "[bihar] LT[etan]",
                nextWeek: "dddd LT[etan]",
                lastDay: "[atzo] LT[etan]",
                lastWeek: "[aurreko] dddd LT[etan]",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s barru",
                past: "duela %s",
                s: "segundo batzuk",
                m: "minutu bat",
                mm: "%d minutu",
                h: "ordu bat",
                hh: "%d ordu",
                d: "egun bat",
                dd: "%d egun",
                M: "hilabete bat",
                MM: "%d hilabete",
                y: "urte bat",
                yy: "%d urte"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "۱",
                2: "۲",
                3: "۳",
                4: "۴",
                5: "۵",
                6: "۶",
                7: "۷",
                8: "۸",
                9: "۹",
                0: "۰"
            },
            n = {
                "۱": "1",
                "۲": "2",
                "۳": "3",
                "۴": "4",
                "۵": "5",
                "۶": "6",
                "۷": "7",
                "۸": "8",
                "۹": "9",
                "۰": "0"
            };
        return e.defineLocale("fa", {
            months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            meridiemParse: /قبل از ظهر|بعد از ظهر/,
            isPM: function(e) {
                return /بعد از ظهر/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "قبل از ظهر" : "بعد از ظهر"
            },
            calendar: {
                sameDay: "[امروز ساعت] LT",
                nextDay: "[فردا ساعت] LT",
                nextWeek: "dddd [ساعت] LT",
                lastDay: "[دیروز ساعت] LT",
                lastWeek: "dddd [پیش] [ساعت] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "در %s",
                past: "%s پیش",
                s: "چند ثانیه",
                m: "یک دقیقه",
                mm: "%d دقیقه",
                h: "یک ساعت",
                hh: "%d ساعت",
                d: "یک روز",
                dd: "%d روز",
                M: "یک ماه",
                MM: "%d ماه",
                y: "یک سال",
                yy: "%d سال"
            },
            preparse: function(e) {
                return e.replace(/[۰-۹]/g, function(e) {
                    return n[e]
                }).replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                }).replace(/,/g, "،")
            },
            dayOfMonthOrdinalParse: /\d{1,2}م/,
            ordinal: "%dم",
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, a, r) {
            var s = "";
            switch (a) {
                case "s":
                    return r ? "muutaman sekunnin" : "muutama sekunti";
                case "m":
                    return r ? "minuutin" : "minuutti";
                case "mm":
                    s = r ? "minuutin" : "minuuttia";
                    break;
                case "h":
                    return r ? "tunnin" : "tunti";
                case "hh":
                    s = r ? "tunnin" : "tuntia";
                    break;
                case "d":
                    return r ? "päivän" : "päivä";
                case "dd":
                    s = r ? "päivän" : "päivää";
                    break;
                case "M":
                    return r ? "kuukauden" : "kuukausi";
                case "MM":
                    s = r ? "kuukauden" : "kuukautta";
                    break;
                case "y":
                    return r ? "vuoden" : "vuosi";
                case "yy":
                    s = r ? "vuoden" : "vuotta"
            }
            return s = n(e, r) + " " + s
        }

        function n(e, t) {
            return e < 10 ? t ? r[e] : a[e] : e
        }
        var a = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),
            r = ["nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", a[7], a[8], a[9]];
        return e.defineLocale("fi", {
            months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
            monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
            weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
            weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
            weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD.MM.YYYY",
                LL: "Do MMMM[ta] YYYY",
                LLL: "Do MMMM[ta] YYYY, [klo] HH.mm",
                LLLL: "dddd, Do MMMM[ta] YYYY, [klo] HH.mm",
                l: "D.M.YYYY",
                ll: "Do MMM YYYY",
                lll: "Do MMM YYYY, [klo] HH.mm",
                llll: "ddd, Do MMM YYYY, [klo] HH.mm"
            },
            calendar: {
                sameDay: "[tänään] [klo] LT",
                nextDay: "[huomenna] [klo] LT",
                nextWeek: "dddd [klo] LT",
                lastDay: "[eilen] [klo] LT",
                lastWeek: "[viime] dddd[na] [klo] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s päästä",
                past: "%s sitten",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("fo", {
            months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),
            weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split("_"),
            weekdaysMin: "su_má_tý_mi_hó_fr_le".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D. MMMM, YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Í dag kl.] LT",
                nextDay: "[Í morgin kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[Í gjár kl.] LT",
                lastWeek: "[síðstu] dddd [kl] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "um %s",
                past: "%s síðani",
                s: "fá sekund",
                m: "ein minutt",
                mm: "%d minuttir",
                h: "ein tími",
                hh: "%d tímar",
                d: "ein dagur",
                dd: "%d dagar",
                M: "ein mánaði",
                MM: "%d mánaðir",
                y: "eitt ár",
                yy: "%d ár"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("fr-ca", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            monthsParseExact: !0,
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Aujourd’hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
            ordinal: function(e, t) {
                switch (t) {
                    default:
                    case "M":
                    case "Q":
                    case "D":
                    case "DDD":
                    case "d":
                        return e + (1 === e ? "er" : "e");
                    case "w":
                    case "W":
                        return e + (1 === e ? "re" : "e")
                }
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("fr-ch", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            monthsParseExact: !0,
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Aujourd’hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
            ordinal: function(e, t) {
                switch (t) {
                    default:
                    case "M":
                    case "Q":
                    case "D":
                    case "DDD":
                    case "d":
                        return e + (1 === e ? "er" : "e");
                    case "w":
                    case "W":
                        return e + (1 === e ? "re" : "e")
                }
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("fr", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            monthsParseExact: !0,
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Aujourd’hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "D":
                        return e + (1 === e ? "er" : "");
                    default:
                    case "M":
                    case "Q":
                    case "DDD":
                    case "d":
                        return e + (1 === e ? "er" : "e");
                    case "w":
                    case "W":
                        return e + (1 === e ? "re" : "e")
                }
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),
            n = "jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");
        return e.defineLocale("fy", {
            months: "jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsParseExact: !0,
            weekdays: "snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),
            weekdaysShort: "si._mo._ti._wo._to._fr._so.".split("_"),
            weekdaysMin: "Si_Mo_Ti_Wo_To_Fr_So".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[hjoed om] LT",
                nextDay: "[moarn om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[juster om] LT",
                lastWeek: "[ôfrûne] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "oer %s",
                past: "%s lyn",
                s: "in pear sekonden",
                m: "ien minút",
                mm: "%d minuten",
                h: "ien oere",
                hh: "%d oeren",
                d: "ien dei",
                dd: "%d dagen",
                M: "ien moanne",
                MM: "%d moannen",
                y: "ien jier",
                yy: "%d jierren"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = ["Am Faoilleach", "An Gearran", "Am Màrt", "An Giblean", "An Cèitean", "An t-Ògmhios", "An t-Iuchar", "An Lùnastal", "An t-Sultain", "An Dàmhair", "An t-Samhain", "An Dùbhlachd"],
            n = ["Faoi", "Gear", "Màrt", "Gibl", "Cèit", "Ògmh", "Iuch", "Lùn", "Sult", "Dàmh", "Samh", "Dùbh"],
            a = ["Didòmhnaich", "Diluain", "Dimàirt", "Diciadain", "Diardaoin", "Dihaoine", "Disathairne"],
            r = ["Did", "Dil", "Dim", "Dic", "Dia", "Dih", "Dis"],
            s = ["Dò", "Lu", "Mà", "Ci", "Ar", "Ha", "Sa"];
        return e.defineLocale("gd", {
            months: t,
            monthsShort: n,
            monthsParseExact: !0,
            weekdays: a,
            weekdaysShort: r,
            weekdaysMin: s,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[An-diugh aig] LT",
                nextDay: "[A-màireach aig] LT",
                nextWeek: "dddd [aig] LT",
                lastDay: "[An-dè aig] LT",
                lastWeek: "dddd [seo chaidh] [aig] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ann an %s",
                past: "bho chionn %s",
                s: "beagan diogan",
                m: "mionaid",
                mm: "%d mionaidean",
                h: "uair",
                hh: "%d uairean",
                d: "latha",
                dd: "%d latha",
                M: "mìos",
                MM: "%d mìosan",
                y: "bliadhna",
                yy: "%d bliadhna"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
            ordinal: function(e) {
                return e + (1 === e ? "d" : e % 10 == 2 ? "na" : "mh")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("gl", {
            months: "xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro".split("_"),
            monthsShort: "xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "domingo_luns_martes_mércores_xoves_venres_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mér._xov._ven._sáb.".split("_"),
            weekdaysMin: "do_lu_ma_mé_xo_ve_sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY H:mm",
                LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
            },
            calendar: {
                sameDay: function() {
                    return "[hoxe " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                },
                nextDay: function() {
                    return "[mañá " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [" + (1 !== this.hours() ? "ás" : "a") + "] LT"
                },
                lastDay: function() {
                    return "[onte " + (1 !== this.hours() ? "á" : "a") + "] LT"
                },
                lastWeek: function() {
                    return "[o] dddd [pasado " + (1 !== this.hours() ? "ás" : "a") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return 0 === e.indexOf("un") ? "n" + e : "en " + e
                },
                past: "hai %s",
                s: "uns segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "unha hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un ano",
                yy: "%d anos"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                s: ["thodde secondanim", "thodde second"],
                m: ["eka mintan", "ek minute"],
                mm: [e + " mintanim", e + " mintam"],
                h: ["eka horan", "ek hor"],
                hh: [e + " horanim", e + " hor"],
                d: ["eka disan", "ek dis"],
                dd: [e + " disanim", e + " dis"],
                M: ["eka mhoinean", "ek mhoino"],
                MM: [e + " mhoineanim", e + " mhoine"],
                y: ["eka vorsan", "ek voros"],
                yy: [e + " vorsanim", e + " vorsam"]
            };
            return t ? r[n][0] : r[n][1]
        }
        return e.defineLocale("gom-latn", {
            months: "Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr".split("_"),
            monthsShort: "Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.".split("_"),
            monthsParseExact: !0,
            weekdays: "Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son'var".split("_"),
            weekdaysShort: "Ait._Som._Mon._Bud._Bre._Suk._Son.".split("_"),
            weekdaysMin: "Ai_Sm_Mo_Bu_Br_Su_Sn".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "A h:mm [vazta]",
                LTS: "A h:mm:ss [vazta]",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY A h:mm [vazta]",
                LLLL: "dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]",
                llll: "ddd, D MMM YYYY, A h:mm [vazta]"
            },
            calendar: {
                sameDay: "[Aiz] LT",
                nextDay: "[Faleam] LT",
                nextWeek: "[Ieta to] dddd[,] LT",
                lastDay: "[Kal] LT",
                lastWeek: "[Fatlo] dddd[,] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s",
                past: "%s adim",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}(er)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "D":
                        return e + "er";
                    default:
                    case "M":
                    case "Q":
                    case "DDD":
                    case "d":
                    case "w":
                    case "W":
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 4
            },
            meridiemParse: /rati|sokalli|donparam|sanje/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "rati" === t ? e < 4 ? e : e + 12 : "sokalli" === t ? e : "donparam" === t ? e > 12 ? e : e + 12 : "sanje" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "rati" : e < 12 ? "sokalli" : e < 16 ? "donparam" : e < 20 ? "sanje" : "rati"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "૧",
                2: "૨",
                3: "૩",
                4: "૪",
                5: "૫",
                6: "૬",
                7: "૭",
                8: "૮",
                9: "૯",
                0: "૦"
            },
            n = {
                "૧": "1",
                "૨": "2",
                "૩": "3",
                "૪": "4",
                "૫": "5",
                "૬": "6",
                "૭": "7",
                "૮": "8",
                "૯": "9",
                "૦": "0"
            };
        return e.defineLocale("gu", {
            months: "જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર".split("_"),
            monthsShort: "જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.".split("_"),
            monthsParseExact: !0,
            weekdays: "રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર".split("_"),
            weekdaysShort: "રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ".split("_"),
            weekdaysMin: "ર_સો_મં_બુ_ગુ_શુ_શ".split("_"),
            longDateFormat: {
                LT: "A h:mm વાગ્યે",
                LTS: "A h:mm:ss વાગ્યે",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm વાગ્યે",
                LLLL: "dddd, D MMMM YYYY, A h:mm વાગ્યે"
            },
            calendar: {
                sameDay: "[આજ] LT",
                nextDay: "[કાલે] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ગઇકાલે] LT",
                lastWeek: "[પાછલા] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s મા",
                past: "%s પેહલા",
                s: "અમુક પળો",
                m: "એક મિનિટ",
                mm: "%d મિનિટ",
                h: "એક કલાક",
                hh: "%d કલાક",
                d: "એક દિવસ",
                dd: "%d દિવસ",
                M: "એક મહિનો",
                MM: "%d મહિનો",
                y: "એક વર્ષ",
                yy: "%d વર્ષ"
            },
            preparse: function(e) {
                return e.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "રાત" === t ? e < 4 ? e : e + 12 : "સવાર" === t ? e : "બપોર" === t ? e >= 10 ? e : e + 12 : "સાંજ" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "રાત" : e < 10 ? "સવાર" : e < 17 ? "બપોર" : e < 20 ? "સાંજ" : "રાત"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("he", {
            months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
            monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
            weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
            weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
            weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [ב]MMMM YYYY",
                LLL: "D [ב]MMMM YYYY HH:mm",
                LLLL: "dddd, D [ב]MMMM YYYY HH:mm",
                l: "D/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd, D MMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[היום ב־]LT",
                nextDay: "[מחר ב־]LT",
                nextWeek: "dddd [בשעה] LT",
                lastDay: "[אתמול ב־]LT",
                lastWeek: "[ביום] dddd [האחרון בשעה] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "בעוד %s",
                past: "לפני %s",
                s: "מספר שניות",
                m: "דקה",
                mm: "%d דקות",
                h: "שעה",
                hh: function(e) {
                    return 2 === e ? "שעתיים" : e + " שעות"
                },
                d: "יום",
                dd: function(e) {
                    return 2 === e ? "יומיים" : e + " ימים"
                },
                M: "חודש",
                MM: function(e) {
                    return 2 === e ? "חודשיים" : e + " חודשים"
                },
                y: "שנה",
                yy: function(e) {
                    return 2 === e ? "שנתיים" : e % 10 == 0 && 10 !== e ? e + " שנה" : e + " שנים"
                }
            },
            meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
            isPM: function(e) {
                return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 5 ? "לפנות בוקר" : e < 10 ? "בבוקר" : e < 12 ? n ? 'לפנה"צ' : "לפני הצהריים" : e < 18 ? n ? 'אחה"צ' : "אחרי הצהריים" : "בערב"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "१",
                2: "२",
                3: "३",
                4: "४",
                5: "५",
                6: "६",
                7: "७",
                8: "८",
                9: "९",
                0: "०"
            },
            n = {
                "१": "1",
                "२": "2",
                "३": "3",
                "४": "4",
                "५": "5",
                "६": "6",
                "७": "7",
                "८": "8",
                "९": "9",
                "०": "0"
            };
        return e.defineLocale("hi", {
            months: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),
            monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),
            monthsParseExact: !0,
            weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm बजे",
                LTS: "A h:mm:ss बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm बजे",
                LLLL: "dddd, D MMMM YYYY, A h:mm बजे"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[कल] LT",
                nextWeek: "dddd, LT",
                lastDay: "[कल] LT",
                lastWeek: "[पिछले] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s में",
                past: "%s पहले",
                s: "कुछ ही क्षण",
                m: "एक मिनट",
                mm: "%d मिनट",
                h: "एक घंटा",
                hh: "%d घंटे",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महीने",
                MM: "%d महीने",
                y: "एक वर्ष",
                yy: "%d वर्ष"
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /रात|सुबह|दोपहर|शाम/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "रात" === t ? e < 4 ? e : e + 12 : "सुबह" === t ? e : "दोपहर" === t ? e >= 10 ? e : e + 12 : "शाम" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "रात" : e < 10 ? "सुबह" : e < 17 ? "दोपहर" : e < 20 ? "शाम" : "रात"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n) {
            var a = e + " ";
            switch (n) {
                case "m":
                    return t ? "jedna minuta" : "jedne minute";
                case "mm":
                    return a += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
                case "h":
                    return t ? "jedan sat" : "jednog sata";
                case "hh":
                    return a += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
                case "dd":
                    return a += 1 === e ? "dan" : "dana";
                case "MM":
                    return a += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
                case "yy":
                    return a += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
            }
        }
        return e.defineLocale("hr", {
            months: {
                format: "siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split("_"),
                standalone: "siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_")
            },
            monthsShort: "sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),
            monthsParseExact: !0,
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "dan",
                dd: t,
                M: "mjesec",
                MM: t,
                y: "godinu",
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = e;
            switch (n) {
                case "s":
                    return a || t ? "néhány másodperc" : "néhány másodperce";
                case "m":
                    return "egy" + (a || t ? " perc" : " perce");
                case "mm":
                    return r + (a || t ? " perc" : " perce");
                case "h":
                    return "egy" + (a || t ? " óra" : " órája");
                case "hh":
                    return r + (a || t ? " óra" : " órája");
                case "d":
                    return "egy" + (a || t ? " nap" : " napja");
                case "dd":
                    return r + (a || t ? " nap" : " napja");
                case "M":
                    return "egy" + (a || t ? " hónap" : " hónapja");
                case "MM":
                    return r + (a || t ? " hónap" : " hónapja");
                case "y":
                    return "egy" + (a || t ? " év" : " éve");
                case "yy":
                    return r + (a || t ? " év" : " éve")
            }
            return ""
        }

        function n(e) {
            return (e ? "" : "[múlt] ") + "[" + a[this.day()] + "] LT[-kor]"
        }
        var a = "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");
        return e.defineLocale("hu", {
            months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
            monthsShort: "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
            weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
            weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
            weekdaysMin: "v_h_k_sze_cs_p_szo".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "YYYY.MM.DD.",
                LL: "YYYY. MMMM D.",
                LLL: "YYYY. MMMM D. H:mm",
                LLLL: "YYYY. MMMM D., dddd H:mm"
            },
            meridiemParse: /de|du/i,
            isPM: function(e) {
                return "u" === e.charAt(1).toLowerCase()
            },
            meridiem: function(e, t, n) {
                return e < 12 ? !0 === n ? "de" : "DE" : !0 === n ? "du" : "DU"
            },
            calendar: {
                sameDay: "[ma] LT[-kor]",
                nextDay: "[holnap] LT[-kor]",
                nextWeek: function() {
                    return n.call(this, !0)
                },
                lastDay: "[tegnap] LT[-kor]",
                lastWeek: function() {
                    return n.call(this, !1)
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s múlva",
                past: "%s",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("hy-am", {
            months: {
                format: "հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_"),
                standalone: "հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_")
            },
            monthsShort: "հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),
            weekdays: "կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_"),
            weekdaysShort: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            weekdaysMin: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY թ.",
                LLL: "D MMMM YYYY թ., HH:mm",
                LLLL: "dddd, D MMMM YYYY թ., HH:mm"
            },
            calendar: {
                sameDay: "[այսօր] LT",
                nextDay: "[վաղը] LT",
                lastDay: "[երեկ] LT",
                nextWeek: function() {
                    return "dddd [օրը ժամը] LT"
                },
                lastWeek: function() {
                    return "[անցած] dddd [օրը ժամը] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s հետո",
                past: "%s առաջ",
                s: "մի քանի վայրկյան",
                m: "րոպե",
                mm: "%d րոպե",
                h: "ժամ",
                hh: "%d ժամ",
                d: "օր",
                dd: "%d օր",
                M: "ամիս",
                MM: "%d ամիս",
                y: "տարի",
                yy: "%d տարի"
            },
            meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
            isPM: function(e) {
                return /^(ցերեկվա|երեկոյան)$/.test(e)
            },
            meridiem: function(e) {
                return e < 4 ? "գիշերվա" : e < 12 ? "առավոտվա" : e < 17 ? "ցերեկվա" : "երեկոյան"
            },
            dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "DDD":
                    case "w":
                    case "W":
                    case "DDDo":
                        return 1 === e ? e + "-ին" : e + "-րդ";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("id", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] HH.mm",
                LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
            },
            meridiemParse: /pagi|siang|sore|malam/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "siang" === t ? e >= 11 ? e : e + 12 : "sore" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 11 ? "pagi" : e < 15 ? "siang" : e < 19 ? "sore" : "malam"
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Besok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kemarin pukul] LT",
                lastWeek: "dddd [lalu pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lalu",
                s: "beberapa detik",
                m: "semenit",
                mm: "%d menit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            return e % 100 == 11 || e % 10 != 1
        }

        function n(e, n, a, r) {
            var s = e + " ";
            switch (a) {
                case "s":
                    return n || r ? "nokkrar sekúndur" : "nokkrum sekúndum";
                case "m":
                    return n ? "mínúta" : "mínútu";
                case "mm":
                    return t(e) ? s + (n || r ? "mínútur" : "mínútum") : n ? s + "mínúta" : s + "mínútu";
                case "hh":
                    return t(e) ? s + (n || r ? "klukkustundir" : "klukkustundum") : s + "klukkustund";
                case "d":
                    return n ? "dagur" : r ? "dag" : "degi";
                case "dd":
                    return t(e) ? n ? s + "dagar" : s + (r ? "daga" : "dögum") : n ? s + "dagur" : s + (r ? "dag" : "degi");
                case "M":
                    return n ? "mánuður" : r ? "mánuð" : "mánuði";
                case "MM":
                    return t(e) ? n ? s + "mánuðir" : s + (r ? "mánuði" : "mánuðum") : n ? s + "mánuður" : s + (r ? "mánuð" : "mánuði");
                case "y":
                    return n || r ? "ár" : "ári";
                case "yy":
                    return t(e) ? s + (n || r ? "ár" : "árum") : s + (n || r ? "ár" : "ári")
            }
        }
        return e.defineLocale("is", {
            months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
            weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
            weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split("_"),
            weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] H:mm",
                LLLL: "dddd, D. MMMM YYYY [kl.] H:mm"
            },
            calendar: {
                sameDay: "[í dag kl.] LT",
                nextDay: "[á morgun kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[í gær kl.] LT",
                lastWeek: "[síðasta] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "eftir %s",
                past: "fyrir %s síðan",
                s: n,
                m: n,
                mm: n,
                h: "klukkustund",
                hh: n,
                d: n,
                dd: n,
                M: n,
                MM: n,
                y: n,
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("it", {
            months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),
            monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
            weekdays: "domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split("_"),
            weekdaysShort: "dom_lun_mar_mer_gio_ven_sab".split("_"),
            weekdaysMin: "do_lu_ma_me_gi_ve_sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Oggi alle] LT",
                nextDay: "[Domani alle] LT",
                nextWeek: "dddd [alle] LT",
                lastDay: "[Ieri alle] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[la scorsa] dddd [alle] LT";
                        default:
                            return "[lo scorso] dddd [alle] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return (/^[0-9].+$/.test(e) ? "tra" : "in") + " " + e
                },
                past: "%s fa",
                s: "alcuni secondi",
                m: "un minuto",
                mm: "%d minuti",
                h: "un'ora",
                hh: "%d ore",
                d: "un giorno",
                dd: "%d giorni",
                M: "un mese",
                MM: "%d mesi",
                y: "un anno",
                yy: "%d anni"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ja", {
            months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
            weekdaysShort: "日_月_火_水_木_金_土".split("_"),
            weekdaysMin: "日_月_火_水_木_金_土".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY/MM/DD",
                LL: "YYYY年M月D日",
                LLL: "YYYY年M月D日 HH:mm",
                LLLL: "YYYY年M月D日 HH:mm dddd",
                l: "YYYY/MM/DD",
                ll: "YYYY年M月D日",
                lll: "YYYY年M月D日 HH:mm",
                llll: "YYYY年M月D日 HH:mm dddd"
            },
            meridiemParse: /午前|午後/i,
            isPM: function(e) {
                return "午後" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "午前" : "午後"
            },
            calendar: {
                sameDay: "[今日] LT",
                nextDay: "[明日] LT",
                nextWeek: "[来週]dddd LT",
                lastDay: "[昨日] LT",
                lastWeek: "[前週]dddd LT",
                sameElse: "L"
            },
            dayOfMonthOrdinalParse: /\d{1,2}日/,
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s後",
                past: "%s前",
                s: "数秒",
                m: "1分",
                mm: "%d分",
                h: "1時間",
                hh: "%d時間",
                d: "1日",
                dd: "%d日",
                M: "1ヶ月",
                MM: "%dヶ月",
                y: "1年",
                yy: "%d年"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("jv", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),
            weekdays: "Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] HH.mm",
                LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
            },
            meridiemParse: /enjing|siyang|sonten|ndalu/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "enjing" === t ? e : "siyang" === t ? e >= 11 ? e : e + 12 : "sonten" === t || "ndalu" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 11 ? "enjing" : e < 15 ? "siyang" : e < 19 ? "sonten" : "ndalu"
            },
            calendar: {
                sameDay: "[Dinten puniko pukul] LT",
                nextDay: "[Mbenjang pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kala wingi pukul] LT",
                lastWeek: "dddd [kepengker pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "wonten ing %s",
                past: "%s ingkang kepengker",
                s: "sawetawis detik",
                m: "setunggal menit",
                mm: "%d menit",
                h: "setunggal jam",
                hh: "%d jam",
                d: "sedinten",
                dd: "%d dinten",
                M: "sewulan",
                MM: "%d wulan",
                y: "setaun",
                yy: "%d taun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ka", {
            months: {
                standalone: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),
                format: "იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")
            },
            monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
            weekdays: {
                standalone: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),
                format: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_"),
                isFormat: /(წინა|შემდეგ)/
            },
            weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
            weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendar: {
                sameDay: "[დღეს] LT[-ზე]",
                nextDay: "[ხვალ] LT[-ზე]",
                lastDay: "[გუშინ] LT[-ზე]",
                nextWeek: "[შემდეგ] dddd LT[-ზე]",
                lastWeek: "[წინა] dddd LT-ზე",
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return /(წამი|წუთი|საათი|წელი)/.test(e) ? e.replace(/ი$/, "ში") : e + "ში"
                },
                past: function(e) {
                    return /(წამი|წუთი|საათი|დღე|თვე)/.test(e) ? e.replace(/(ი|ე)$/, "ის უკან") : /წელი/.test(e) ? e.replace(/წელი$/, "წლის უკან") : void 0
                },
                s: "რამდენიმე წამი",
                m: "წუთი",
                mm: "%d წუთი",
                h: "საათი",
                hh: "%d საათი",
                d: "დღე",
                dd: "%d დღე",
                M: "თვე",
                MM: "%d თვე",
                y: "წელი",
                yy: "%d წელი"
            },
            dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
            ordinal: function(e) {
                return 0 === e ? e : 1 === e ? e + "-ლი" : e < 20 || e <= 100 && e % 20 == 0 || e % 100 == 0 ? "მე-" + e : e + "-ე"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            0: "-ші",
            1: "-ші",
            2: "-ші",
            3: "-ші",
            4: "-ші",
            5: "-ші",
            6: "-шы",
            7: "-ші",
            8: "-ші",
            9: "-шы",
            10: "-шы",
            20: "-шы",
            30: "-шы",
            40: "-шы",
            50: "-ші",
            60: "-шы",
            70: "-ші",
            80: "-ші",
            90: "-шы",
            100: "-ші"
        };
        return e.defineLocale("kk", {
            months: "қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split("_"),
            monthsShort: "қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),
            weekdays: "жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split("_"),
            weekdaysShort: "жек_дүй_сей_сәр_бей_жұм_сен".split("_"),
            weekdaysMin: "жк_дй_сй_ср_бй_жм_сн".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Бүгін сағат] LT",
                nextDay: "[Ертең сағат] LT",
                nextWeek: "dddd [сағат] LT",
                lastDay: "[Кеше сағат] LT",
                lastWeek: "[Өткен аптаның] dddd [сағат] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ішінде",
                past: "%s бұрын",
                s: "бірнеше секунд",
                m: "бір минут",
                mm: "%d минут",
                h: "бір сағат",
                hh: "%d сағат",
                d: "бір күн",
                dd: "%d күн",
                M: "бір ай",
                MM: "%d ай",
                y: "бір жыл",
                yy: "%d жыл"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
            ordinal: function(e) {
                var n = e % 10,
                    a = e >= 100 ? 100 : null;
                return e + (t[e] || t[n] || t[a])
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("km", {
            months: "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            monthsShort: "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),
            weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysShort: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            weekdaysMin: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[ថ្ងៃនេះ ម៉ោង] LT",
                nextDay: "[ស្អែក ម៉ោង] LT",
                nextWeek: "dddd [ម៉ោង] LT",
                lastDay: "[ម្សិលមិញ ម៉ោង] LT",
                lastWeek: "dddd [សប្តាហ៍មុន] [ម៉ោង] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sទៀត",
                past: "%sមុន",
                s: "ប៉ុន្មានវិនាទី",
                m: "មួយនាទី",
                mm: "%d នាទី",
                h: "មួយម៉ោង",
                hh: "%d ម៉ោង",
                d: "មួយថ្ងៃ",
                dd: "%d ថ្ងៃ",
                M: "មួយខែ",
                MM: "%d ខែ",
                y: "មួយឆ្នាំ",
                yy: "%d ឆ្នាំ"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "೧",
                2: "೨",
                3: "೩",
                4: "೪",
                5: "೫",
                6: "೬",
                7: "೭",
                8: "೮",
                9: "೯",
                0: "೦"
            },
            n = {
                "೧": "1",
                "೨": "2",
                "೩": "3",
                "೪": "4",
                "೫": "5",
                "೬": "6",
                "೭": "7",
                "೮": "8",
                "೯": "9",
                "೦": "0"
            };
        return e.defineLocale("kn", {
            months: "ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್".split("_"),
            monthsShort: "ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬ_ಅಕ್ಟೋಬ_ನವೆಂಬ_ಡಿಸೆಂಬ".split("_"),
            monthsParseExact: !0,
            weekdays: "ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ".split("_"),
            weekdaysShort: "ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ".split("_"),
            weekdaysMin: "ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ".split("_"),
            longDateFormat: {
                LT: "A h:mm",
                LTS: "A h:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm",
                LLLL: "dddd, D MMMM YYYY, A h:mm"
            },
            calendar: {
                sameDay: "[ಇಂದು] LT",
                nextDay: "[ನಾಳೆ] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ನಿನ್ನೆ] LT",
                lastWeek: "[ಕೊನೆಯ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ನಂತರ",
                past: "%s ಹಿಂದೆ",
                s: "ಕೆಲವು ಕ್ಷಣಗಳು",
                m: "ಒಂದು ನಿಮಿಷ",
                mm: "%d ನಿಮಿಷ",
                h: "ಒಂದು ಗಂಟೆ",
                hh: "%d ಗಂಟೆ",
                d: "ಒಂದು ದಿನ",
                dd: "%d ದಿನ",
                M: "ಒಂದು ತಿಂಗಳು",
                MM: "%d ತಿಂಗಳು",
                y: "ಒಂದು ವರ್ಷ",
                yy: "%d ವರ್ಷ"
            },
            preparse: function(e) {
                return e.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "ರಾತ್ರಿ" === t ? e < 4 ? e : e + 12 : "ಬೆಳಿಗ್ಗೆ" === t ? e : "ಮಧ್ಯಾಹ್ನ" === t ? e >= 10 ? e : e + 12 : "ಸಂಜೆ" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "ರಾತ್ರಿ" : e < 10 ? "ಬೆಳಿಗ್ಗೆ" : e < 17 ? "ಮಧ್ಯಾಹ್ನ" : e < 20 ? "ಸಂಜೆ" : "ರಾತ್ರಿ"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
            ordinal: function(e) {
                return e + "ನೇ"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ko", {
            months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
            weekdaysShort: "일_월_화_수_목_금_토".split("_"),
            weekdaysMin: "일_월_화_수_목_금_토".split("_"),
            longDateFormat: {
                LT: "A h:mm",
                LTS: "A h:mm:ss",
                L: "YYYY.MM.DD",
                LL: "YYYY년 MMMM D일",
                LLL: "YYYY년 MMMM D일 A h:mm",
                LLLL: "YYYY년 MMMM D일 dddd A h:mm",
                l: "YYYY.MM.DD",
                ll: "YYYY년 MMMM D일",
                lll: "YYYY년 MMMM D일 A h:mm",
                llll: "YYYY년 MMMM D일 dddd A h:mm"
            },
            calendar: {
                sameDay: "오늘 LT",
                nextDay: "내일 LT",
                nextWeek: "dddd LT",
                lastDay: "어제 LT",
                lastWeek: "지난주 dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s 후",
                past: "%s 전",
                s: "몇 초",
                ss: "%d초",
                m: "1분",
                mm: "%d분",
                h: "한 시간",
                hh: "%d시간",
                d: "하루",
                dd: "%d일",
                M: "한 달",
                MM: "%d달",
                y: "일 년",
                yy: "%d년"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "일";
                    case "M":
                        return e + "월";
                    case "w":
                    case "W":
                        return e + "주";
                    default:
                        return e
                }
            },
            meridiemParse: /오전|오후/,
            isPM: function(e) {
                return "오후" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "오전" : "오후"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            0: "-чү",
            1: "-чи",
            2: "-чи",
            3: "-чү",
            4: "-чү",
            5: "-чи",
            6: "-чы",
            7: "-чи",
            8: "-чи",
            9: "-чу",
            10: "-чу",
            20: "-чы",
            30: "-чу",
            40: "-чы",
            50: "-чү",
            60: "-чы",
            70: "-чи",
            80: "-чи",
            90: "-чу",
            100: "-чү"
        };
        return e.defineLocale("ky", {
            months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            monthsShort: "янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),
            weekdays: "Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split("_"),
            weekdaysShort: "Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),
            weekdaysMin: "Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Бүгүн саат] LT",
                nextDay: "[Эртең саат] LT",
                nextWeek: "dddd [саат] LT",
                lastDay: "[Кече саат] LT",
                lastWeek: "[Өткен аптанын] dddd [күнү] [саат] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ичинде",
                past: "%s мурун",
                s: "бирнече секунд",
                m: "бир мүнөт",
                mm: "%d мүнөт",
                h: "бир саат",
                hh: "%d саат",
                d: "бир күн",
                dd: "%d күн",
                M: "бир ай",
                MM: "%d ай",
                y: "бир жыл",
                yy: "%d жыл"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
            ordinal: function(e) {
                var n = e % 10,
                    a = e >= 100 ? 100 : null;
                return e + (t[e] || t[n] || t[a])
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                m: ["eng Minutt", "enger Minutt"],
                h: ["eng Stonn", "enger Stonn"],
                d: ["een Dag", "engem Dag"],
                M: ["ee Mount", "engem Mount"],
                y: ["ee Joer", "engem Joer"]
            };
            return t ? r[n][0] : r[n][1]
        }

        function n(e) {
            return r(e.substr(0, e.indexOf(" "))) ? "a " + e : "an " + e
        }

        function a(e) {
            return r(e.substr(0, e.indexOf(" "))) ? "viru " + e : "virun " + e
        }

        function r(e) {
            if (e = parseInt(e, 10), isNaN(e)) return !1;
            if (e < 0) return !0;
            if (e < 10) return 4 <= e && e <= 7;
            if (e < 100) {
                var t = e % 10,
                    n = e / 10;
                return r(0 === t ? n : t)
            }
            if (e < 1e4) {
                for (; e >= 10;) e /= 10;
                return r(e)
            }
            return e /= 1e3, r(e)
        }
        return e.defineLocale("lb", {
            months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            monthsParseExact: !0,
            weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),
            weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm [Auer]",
                LTS: "H:mm:ss [Auer]",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm [Auer]",
                LLLL: "dddd, D. MMMM YYYY H:mm [Auer]"
            },
            calendar: {
                sameDay: "[Haut um] LT",
                sameElse: "L",
                nextDay: "[Muer um] LT",
                nextWeek: "dddd [um] LT",
                lastDay: "[Gëschter um] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 2:
                        case 4:
                            return "[Leschten] dddd [um] LT";
                        default:
                            return "[Leschte] dddd [um] LT"
                    }
                }
            },
            relativeTime: {
                future: n,
                past: a,
                s: "e puer Sekonnen",
                m: t,
                mm: "%d Minutten",
                h: t,
                hh: "%d Stonnen",
                d: t,
                dd: "%d Deeg",
                M: t,
                MM: "%d Méint",
                y: t,
                yy: "%d Joer"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("lo", {
            months: "ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),
            monthsShort: "ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split("_"),
            weekdays: "ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),
            weekdaysShort: "ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),
            weekdaysMin: "ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "ວັນdddd D MMMM YYYY HH:mm"
            },
            meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
            isPM: function(e) {
                return "ຕອນແລງ" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "ຕອນເຊົ້າ" : "ຕອນແລງ"
            },
            calendar: {
                sameDay: "[ມື້ນີ້ເວລາ] LT",
                nextDay: "[ມື້ອື່ນເວລາ] LT",
                nextWeek: "[ວັນ]dddd[ໜ້າເວລາ] LT",
                lastDay: "[ມື້ວານນີ້ເວລາ] LT",
                lastWeek: "[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ອີກ %s",
                past: "%sຜ່ານມາ",
                s: "ບໍ່ເທົ່າໃດວິນາທີ",
                m: "1 ນາທີ",
                mm: "%d ນາທີ",
                h: "1 ຊົ່ວໂມງ",
                hh: "%d ຊົ່ວໂມງ",
                d: "1 ມື້",
                dd: "%d ມື້",
                M: "1 ເດືອນ",
                MM: "%d ເດືອນ",
                y: "1 ປີ",
                yy: "%d ປີ"
            },
            dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
            ordinal: function(e) {
                return "ທີ່" + e
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            return t ? "kelios sekundės" : a ? "kelių sekundžių" : "kelias sekundes"
        }

        function n(e, t, n, a) {
            return t ? r(n)[0] : a ? r(n)[1] : r(n)[2]
        }

        function a(e) {
            return e % 10 == 0 || e > 10 && e < 20
        }

        function r(e) {
            return i[e].split("_")
        }

        function s(e, t, s, i) {
            var o = e + " ";
            return 1 === e ? o + n(e, t, s[0], i) : t ? o + (a(e) ? r(s)[1] : r(s)[0]) : i ? o + r(s)[1] : o + (a(e) ? r(s)[1] : r(s)[2])
        }
        var i = {
            m: "minutė_minutės_minutę",
            mm: "minutės_minučių_minutes",
            h: "valanda_valandos_valandą",
            hh: "valandos_valandų_valandas",
            d: "diena_dienos_dieną",
            dd: "dienos_dienų_dienas",
            M: "mėnuo_mėnesio_mėnesį",
            MM: "mėnesiai_mėnesių_mėnesius",
            y: "metai_metų_metus",
            yy: "metai_metų_metus"
        };
        return e.defineLocale("lt", {
            months: {
                format: "sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),
                standalone: "sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),
                isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
            },
            monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
            weekdays: {
                format: "sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split("_"),
                standalone: "sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),
                isFormat: /dddd HH:mm/
            },
            weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
            weekdaysMin: "S_P_A_T_K_Pn_Š".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "YYYY [m.] MMMM D [d.]",
                LLL: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
                LLLL: "YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",
                l: "YYYY-MM-DD",
                ll: "YYYY [m.] MMMM D [d.]",
                lll: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
                llll: "YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"
            },
            calendar: {
                sameDay: "[Šiandien] LT",
                nextDay: "[Rytoj] LT",
                nextWeek: "dddd LT",
                lastDay: "[Vakar] LT",
                lastWeek: "[Praėjusį] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "po %s",
                past: "prieš %s",
                s: t,
                m: n,
                mm: s,
                h: n,
                hh: s,
                d: n,
                dd: s,
                M: n,
                MM: s,
                y: n,
                yy: s
            },
            dayOfMonthOrdinalParse: /\d{1,2}-oji/,
            ordinal: function(e) {
                return e + "-oji"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n) {
            return n ? t % 10 == 1 && t % 100 != 11 ? e[2] : e[3] : t % 10 == 1 && t % 100 != 11 ? e[0] : e[1]
        }

        function n(e, n, a) {
            return e + " " + t(s[a], e, n)
        }

        function a(e, n, a) {
            return t(s[a], e, n)
        }

        function r(e, t) {
            return t ? "dažas sekundes" : "dažām sekundēm"
        }
        var s = {
            m: "minūtes_minūtēm_minūte_minūtes".split("_"),
            mm: "minūtes_minūtēm_minūte_minūtes".split("_"),
            h: "stundas_stundām_stunda_stundas".split("_"),
            hh: "stundas_stundām_stunda_stundas".split("_"),
            d: "dienas_dienām_diena_dienas".split("_"),
            dd: "dienas_dienām_diena_dienas".split("_"),
            M: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
            MM: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
            y: "gada_gadiem_gads_gadi".split("_"),
            yy: "gada_gadiem_gads_gadi".split("_")
        };
        return e.defineLocale("lv", {
            months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
            weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
            weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
            weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY.",
                LL: "YYYY. [gada] D. MMMM",
                LLL: "YYYY. [gada] D. MMMM, HH:mm",
                LLLL: "YYYY. [gada] D. MMMM, dddd, HH:mm"
            },
            calendar: {
                sameDay: "[Šodien pulksten] LT",
                nextDay: "[Rīt pulksten] LT",
                nextWeek: "dddd [pulksten] LT",
                lastDay: "[Vakar pulksten] LT",
                lastWeek: "[Pagājušā] dddd [pulksten] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "pēc %s",
                past: "pirms %s",
                s: r,
                m: a,
                mm: n,
                h: a,
                hh: n,
                d: a,
                dd: n,
                M: a,
                MM: n,
                y: a,
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            words: {
                m: ["jedan minut", "jednog minuta"],
                mm: ["minut", "minuta", "minuta"],
                h: ["jedan sat", "jednog sata"],
                hh: ["sat", "sata", "sati"],
                dd: ["dan", "dana", "dana"],
                MM: ["mjesec", "mjeseca", "mjeseci"],
                yy: ["godina", "godine", "godina"]
            },
            correctGrammaticalCase: function(e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            },
            translate: function(e, n, a) {
                var r = t.words[a];
                return 1 === a.length ? n ? r[0] : r[1] : e + " " + t.correctGrammaticalCase(e, r)
            }
        };
        return e.defineLocale("me", {
            months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sjutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[juče u] LT",
                lastWeek: function() {
                    return ["[prošle] [nedjelje] [u] LT", "[prošlog] [ponedjeljka] [u] LT", "[prošlog] [utorka] [u] LT", "[prošle] [srijede] [u] LT", "[prošlog] [četvrtka] [u] LT", "[prošlog] [petka] [u] LT", "[prošle] [subote] [u] LT"][this.day()]
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "nekoliko sekundi",
                m: t.translate,
                mm: t.translate,
                h: t.translate,
                hh: t.translate,
                d: "dan",
                dd: t.translate,
                M: "mjesec",
                MM: t.translate,
                y: "godinu",
                yy: t.translate
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("mi", {
            months: "Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea".split("_"),
            monthsShort: "Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split("_"),
            monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
            monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
            monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
            monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
            weekdays: "Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei".split("_"),
            weekdaysShort: "Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),
            weekdaysMin: "Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [i] HH:mm",
                LLLL: "dddd, D MMMM YYYY [i] HH:mm"
            },
            calendar: {
                sameDay: "[i teie mahana, i] LT",
                nextDay: "[apopo i] LT",
                nextWeek: "dddd [i] LT",
                lastDay: "[inanahi i] LT",
                lastWeek: "dddd [whakamutunga i] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "i roto i %s",
                past: "%s i mua",
                s: "te hēkona ruarua",
                m: "he meneti",
                mm: "%d meneti",
                h: "te haora",
                hh: "%d haora",
                d: "he ra",
                dd: "%d ra",
                M: "he marama",
                MM: "%d marama",
                y: "he tau",
                yy: "%d tau"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("mk", {
            months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),
            weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split("_"),
            weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY H:mm",
                LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[Денес во] LT",
                nextDay: "[Утре во] LT",
                nextWeek: "[Во] dddd [во] LT",
                lastDay: "[Вчера во] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[Изминатата] dddd [во] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[Изминатиот] dddd [во] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "после %s",
                past: "пред %s",
                s: "неколку секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дена",
                M: "месец",
                MM: "%d месеци",
                y: "година",
                yy: "%d години"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
            ordinal: function(e) {
                var t = e % 10,
                    n = e % 100;
                return 0 === e ? e + "-ев" : 0 === n ? e + "-ен" : n > 10 && n < 20 ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ml", {
            months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),
            monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),
            monthsParseExact: !0,
            weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),
            weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),
            weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),
            longDateFormat: {
                LT: "A h:mm -നു",
                LTS: "A h:mm:ss -നു",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm -നു",
                LLLL: "dddd, D MMMM YYYY, A h:mm -നു"
            },
            calendar: {
                sameDay: "[ഇന്ന്] LT",
                nextDay: "[നാളെ] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ഇന്നലെ] LT",
                lastWeek: "[കഴിഞ്ഞ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s കഴിഞ്ഞ്",
                past: "%s മുൻപ്",
                s: "അൽപ നിമിഷങ്ങൾ",
                m: "ഒരു മിനിറ്റ്",
                mm: "%d മിനിറ്റ്",
                h: "ഒരു മണിക്കൂർ",
                hh: "%d മണിക്കൂർ",
                d: "ഒരു ദിവസം",
                dd: "%d ദിവസം",
                M: "ഒരു മാസം",
                MM: "%d മാസം",
                y: "ഒരു വർഷം",
                yy: "%d വർഷം"
            },
            meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "രാത്രി" === t && e >= 4 || "ഉച്ച കഴിഞ്ഞ്" === t || "വൈകുന്നേരം" === t ? e + 12 : e
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "രാത്രി" : e < 12 ? "രാവിലെ" : e < 17 ? "ഉച്ച കഴിഞ്ഞ്" : e < 20 ? "വൈകുന്നേരം" : "രാത്രി"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = "";
            if (t) switch (n) {
                case "s":
                    r = "काही सेकंद";
                    break;
                case "m":
                    r = "एक मिनिट";
                    break;
                case "mm":
                    r = "%d मिनिटे";
                    break;
                case "h":
                    r = "एक तास";
                    break;
                case "hh":
                    r = "%d तास";
                    break;
                case "d":
                    r = "एक दिवस";
                    break;
                case "dd":
                    r = "%d दिवस";
                    break;
                case "M":
                    r = "एक महिना";
                    break;
                case "MM":
                    r = "%d महिने";
                    break;
                case "y":
                    r = "एक वर्ष";
                    break;
                case "yy":
                    r = "%d वर्षे"
            } else switch (n) {
                case "s":
                    r = "काही सेकंदां";
                    break;
                case "m":
                    r = "एका मिनिटा";
                    break;
                case "mm":
                    r = "%d मिनिटां";
                    break;
                case "h":
                    r = "एका तासा";
                    break;
                case "hh":
                    r = "%d तासां";
                    break;
                case "d":
                    r = "एका दिवसा";
                    break;
                case "dd":
                    r = "%d दिवसां";
                    break;
                case "M":
                    r = "एका महिन्या";
                    break;
                case "MM":
                    r = "%d महिन्यां";
                    break;
                case "y":
                    r = "एका वर्षा";
                    break;
                case "yy":
                    r = "%d वर्षां"
            }
            return r.replace(/%d/i, e)
        }
        var n = {
                1: "१",
                2: "२",
                3: "३",
                4: "४",
                5: "५",
                6: "६",
                7: "७",
                8: "८",
                9: "९",
                0: "०"
            },
            a = {
                "१": "1",
                "२": "2",
                "३": "3",
                "४": "4",
                "५": "5",
                "६": "6",
                "७": "7",
                "८": "8",
                "९": "9",
                "०": "0"
            };
        return e.defineLocale("mr", {
            months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),
            monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),
            monthsParseExact: !0,
            weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm वाजता",
                LTS: "A h:mm:ss वाजता",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm वाजता",
                LLLL: "dddd, D MMMM YYYY, A h:mm वाजता"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[उद्या] LT",
                nextWeek: "dddd, LT",
                lastDay: "[काल] LT",
                lastWeek: "[मागील] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sमध्ये",
                past: "%sपूर्वी",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return a[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return n[e]
                })
            },
            meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "रात्री" === t ? e < 4 ? e : e + 12 : "सकाळी" === t ? e : "दुपारी" === t ? e >= 10 ? e : e + 12 : "सायंकाळी" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "रात्री" : e < 10 ? "सकाळी" : e < 17 ? "दुपारी" : e < 20 ? "सायंकाळी" : "रात्री"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ms-my", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] HH.mm",
                LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
            },
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "tengahari" === t ? e >= 11 ? e : e + 12 : "petang" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 11 ? "pagi" : e < 15 ? "tengahari" : e < 19 ? "petang" : "malam"
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Esok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kelmarin pukul] LT",
                lastWeek: "dddd [lepas pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ms", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] HH.mm",
                LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
            },
            meridiemParse: /pagi|tengahari|petang|malam/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "pagi" === t ? e : "tengahari" === t ? e >= 11 ? e : e + 12 : "petang" === t || "malam" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 11 ? "pagi" : e < 15 ? "tengahari" : e < 19 ? "petang" : "malam"
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Esok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kelmarin pukul] LT",
                lastWeek: "dddd [lepas pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "၁",
                2: "၂",
                3: "၃",
                4: "၄",
                5: "၅",
                6: "၆",
                7: "၇",
                8: "၈",
                9: "၉",
                0: "၀"
            },
            n = {
                "၁": "1",
                "၂": "2",
                "၃": "3",
                "၄": "4",
                "၅": "5",
                "၆": "6",
                "၇": "7",
                "၈": "8",
                "၉": "9",
                "၀": "0"
            };
        return e.defineLocale("my", {
            months: "ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),
            monthsShort: "ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),
            weekdays: "တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),
            weekdaysShort: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            weekdaysMin: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[ယနေ.] LT [မှာ]",
                nextDay: "[မနက်ဖြန်] LT [မှာ]",
                nextWeek: "dddd LT [မှာ]",
                lastDay: "[မနေ.က] LT [မှာ]",
                lastWeek: "[ပြီးခဲ့သော] dddd LT [မှာ]",
                sameElse: "L"
            },
            relativeTime: {
                future: "လာမည့် %s မှာ",
                past: "လွန်ခဲ့သော %s က",
                s: "စက္ကန်.အနည်းငယ်",
                m: "တစ်မိနစ်",
                mm: "%d မိနစ်",
                h: "တစ်နာရီ",
                hh: "%d နာရီ",
                d: "တစ်ရက်",
                dd: "%d ရက်",
                M: "တစ်လ",
                MM: "%d လ",
                y: "တစ်နှစ်",
                yy: "%d နှစ်"
            },
            preparse: function(e) {
                return e.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("nb", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),
            monthsParseExact: !0,
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "sø._ma._ti._on._to._fr._lø.".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] HH:mm",
                LLLL: "dddd D. MMMM YYYY [kl.] HH:mm"
            },
            calendar: {
                sameDay: "[i dag kl.] LT",
                nextDay: "[i morgen kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[i går kl.] LT",
                lastWeek: "[forrige] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "%s siden",
                s: "noen sekunder",
                m: "ett minutt",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dager",
                M: "en måned",
                MM: "%d måneder",
                y: "ett år",
                yy: "%d år"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "१",
                2: "२",
                3: "३",
                4: "४",
                5: "५",
                6: "६",
                7: "७",
                8: "८",
                9: "९",
                0: "०"
            },
            n = {
                "१": "1",
                "२": "2",
                "३": "3",
                "४": "4",
                "५": "5",
                "६": "6",
                "७": "7",
                "८": "8",
                "९": "9",
                "०": "0"
            };
        return e.defineLocale("ne", {
            months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),
            monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),
            monthsParseExact: !0,
            weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),
            weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),
            weekdaysMin: "आ._सो._मं._बु._बि._शु._श.".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "Aको h:mm बजे",
                LTS: "Aको h:mm:ss बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, Aको h:mm बजे",
                LLLL: "dddd, D MMMM YYYY, Aको h:mm बजे"
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "राति" === t ? e < 4 ? e : e + 12 : "बिहान" === t ? e : "दिउँसो" === t ? e >= 10 ? e : e + 12 : "साँझ" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 3 ? "राति" : e < 12 ? "बिहान" : e < 16 ? "दिउँसो" : e < 20 ? "साँझ" : "राति"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[भोलि] LT",
                nextWeek: "[आउँदो] dddd[,] LT",
                lastDay: "[हिजो] LT",
                lastWeek: "[गएको] dddd[,] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sमा",
                past: "%s अगाडि",
                s: "केही क्षण",
                m: "एक मिनेट",
                mm: "%d मिनेट",
                h: "एक घण्टा",
                hh: "%d घण्टा",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महिना",
                MM: "%d महिना",
                y: "एक बर्ष",
                yy: "%d बर्ष"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
            n = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),
            a = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i],
            r = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
        return e.defineLocale("nl-be", {
            months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsRegex: r,
            monthsShortRegex: r,
            monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
            monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
            monthsParse: a,
            longMonthsParse: a,
            shortMonthsParse: a,
            weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
            weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[vandaag om] LT",
                nextDay: "[morgen om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[gisteren om] LT",
                lastWeek: "[afgelopen] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "over %s",
                past: "%s geleden",
                s: "een paar seconden",
                m: "één minuut",
                mm: "%d minuten",
                h: "één uur",
                hh: "%d uur",
                d: "één dag",
                dd: "%d dagen",
                M: "één maand",
                MM: "%d maanden",
                y: "één jaar",
                yy: "%d jaar"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
            n = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),
            a = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i],
            r = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
        return e.defineLocale("nl", {
            months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort: function(e, a) {
                return e ? /-MMM-/.test(a) ? n[e.month()] : t[e.month()] : t
            },
            monthsRegex: r,
            monthsShortRegex: r,
            monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
            monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
            monthsParse: a,
            longMonthsParse: a,
            shortMonthsParse: a,
            weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
            weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[vandaag om] LT",
                nextDay: "[morgen om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[gisteren om] LT",
                lastWeek: "[afgelopen] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "over %s",
                past: "%s geleden",
                s: "een paar seconden",
                m: "één minuut",
                mm: "%d minuten",
                h: "één uur",
                hh: "%d uur",
                d: "één dag",
                dd: "%d dagen",
                M: "één maand",
                MM: "%d maanden",
                y: "één jaar",
                yy: "%d jaar"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
            ordinal: function(e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("nn", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
            weekdaysShort: "sun_mån_tys_ons_tor_fre_lau".split("_"),
            weekdaysMin: "su_må_ty_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] H:mm",
                LLLL: "dddd D. MMMM YYYY [kl.] HH:mm"
            },
            calendar: {
                sameDay: "[I dag klokka] LT",
                nextDay: "[I morgon klokka] LT",
                nextWeek: "dddd [klokka] LT",
                lastDay: "[I går klokka] LT",
                lastWeek: "[Føregåande] dddd [klokka] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "%s sidan",
                s: "nokre sekund",
                m: "eit minutt",
                mm: "%d minutt",
                h: "ein time",
                hh: "%d timar",
                d: "ein dag",
                dd: "%d dagar",
                M: "ein månad",
                MM: "%d månader",
                y: "eit år",
                yy: "%d år"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "੧",
                2: "੨",
                3: "੩",
                4: "੪",
                5: "੫",
                6: "੬",
                7: "੭",
                8: "੮",
                9: "੯",
                0: "੦"
            },
            n = {
                "੧": "1",
                "੨": "2",
                "੩": "3",
                "੪": "4",
                "੫": "5",
                "੬": "6",
                "੭": "7",
                "੮": "8",
                "੯": "9",
                "੦": "0"
            };
        return e.defineLocale("pa-in", {
            months: "ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),
            monthsShort: "ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split("_"),
            weekdays: "ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split("_"),
            weekdaysShort: "ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),
            weekdaysMin: "ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),
            longDateFormat: {
                LT: "A h:mm ਵਜੇ",
                LTS: "A h:mm:ss ਵਜੇ",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm ਵਜੇ",
                LLLL: "dddd, D MMMM YYYY, A h:mm ਵਜੇ"
            },
            calendar: {
                sameDay: "[ਅਜ] LT",
                nextDay: "[ਕਲ] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ਕਲ] LT",
                lastWeek: "[ਪਿਛਲੇ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s ਵਿੱਚ",
                past: "%s ਪਿਛਲੇ",
                s: "ਕੁਝ ਸਕਿੰਟ",
                m: "ਇਕ ਮਿੰਟ",
                mm: "%d ਮਿੰਟ",
                h: "ਇੱਕ ਘੰਟਾ",
                hh: "%d ਘੰਟੇ",
                d: "ਇੱਕ ਦਿਨ",
                dd: "%d ਦਿਨ",
                M: "ਇੱਕ ਮਹੀਨਾ",
                MM: "%d ਮਹੀਨੇ",
                y: "ਇੱਕ ਸਾਲ",
                yy: "%d ਸਾਲ"
            },
            preparse: function(e) {
                return e.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "ਰਾਤ" === t ? e < 4 ? e : e + 12 : "ਸਵੇਰ" === t ? e : "ਦੁਪਹਿਰ" === t ? e >= 10 ? e : e + 12 : "ਸ਼ਾਮ" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "ਰਾਤ" : e < 10 ? "ਸਵੇਰ" : e < 17 ? "ਦੁਪਹਿਰ" : e < 20 ? "ਸ਼ਾਮ" : "ਰਾਤ"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            return e % 10 < 5 && e % 10 > 1 && ~~(e / 10) % 10 != 1
        }

        function n(e, n, a) {
            var r = e + " ";
            switch (a) {
                case "m":
                    return n ? "minuta" : "minutę";
                case "mm":
                    return r + (t(e) ? "minuty" : "minut");
                case "h":
                    return n ? "godzina" : "godzinę";
                case "hh":
                    return r + (t(e) ? "godziny" : "godzin");
                case "MM":
                    return r + (t(e) ? "miesiące" : "miesięcy");
                case "yy":
                    return r + (t(e) ? "lata" : "lat")
            }
        }
        var a = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
            r = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");
        return e.defineLocale("pl", {
            months: function(e, t) {
                return e ? "" === t ? "(" + r[e.month()] + "|" + a[e.month()] + ")" : /D MMMM/.test(t) ? r[e.month()] : a[e.month()] : a
            },
            monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
            weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
            weekdaysShort: "ndz_pon_wt_śr_czw_pt_sob".split("_"),
            weekdaysMin: "Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Dziś o] LT",
                nextDay: "[Jutro o] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[W niedzielę o] LT";
                        case 2:
                            return "[We wtorek o] LT";
                        case 3:
                            return "[W środę o] LT";
                        case 6:
                            return "[W sobotę o] LT";
                        default:
                            return "[W] dddd [o] LT"
                    }
                },
                lastDay: "[Wczoraj o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[W zeszłą niedzielę o] LT";
                        case 3:
                            return "[W zeszłą środę o] LT";
                        case 6:
                            return "[W zeszłą sobotę o] LT";
                        default:
                            return "[W zeszły] dddd [o] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "%s temu",
                s: "kilka sekund",
                m: n,
                mm: n,
                h: n,
                hh: n,
                d: "1 dzień",
                dd: "%d dni",
                M: "miesiąc",
                MM: n,
                y: "rok",
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("pt-br", {
            months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
            monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
            weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY [às] HH:mm",
                LLLL: "dddd, D [de] MMMM [de] YYYY [às] HH:mm"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "poucos segundos",
                ss: "%d segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº"
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("pt", {
            months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
            monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
            weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY HH:mm",
                LLLL: "dddd, D [de] MMMM [de] YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "há %s",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            dayOfMonthOrdinalParse: /\d{1,2}º/,
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n) {
            var a = {
                    mm: "minute",
                    hh: "ore",
                    dd: "zile",
                    MM: "luni",
                    yy: "ani"
                },
                r = " ";
            return (e % 100 >= 20 || e >= 100 && e % 100 == 0) && (r = " de "), e + r + a[n]
        }
        return e.defineLocale("ro", {
            months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),
            monthsShort: "ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
            weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
            weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY H:mm",
                LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[azi la] LT",
                nextDay: "[mâine la] LT",
                nextWeek: "dddd [la] LT",
                lastDay: "[ieri la] LT",
                lastWeek: "[fosta] dddd [la] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "peste %s",
                past: "%s în urmă",
                s: "câteva secunde",
                m: "un minut",
                mm: t,
                h: "o oră",
                hh: t,
                d: "o zi",
                dd: t,
                M: "o lună",
                MM: t,
                y: "un an",
                yy: t
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t) {
            var n = e.split("_");
            return t % 10 == 1 && t % 100 != 11 ? n[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? n[1] : n[2]
        }

        function n(e, n, a) {
            var r = {
                mm: n ? "минута_минуты_минут" : "минуту_минуты_минут",
                hh: "час_часа_часов",
                dd: "день_дня_дней",
                MM: "месяц_месяца_месяцев",
                yy: "год_года_лет"
            };
            return "m" === a ? n ? "минута" : "минуту" : e + " " + t(r[a], +e)
        }
        var a = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];
        return e.defineLocale("ru", {
            months: {
                format: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),
                standalone: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_")
            },
            monthsShort: {
                format: "янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),
                standalone: "янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_")
            },
            weekdays: {
                standalone: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
                format: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_"),
                isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
            },
            weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            monthsParse: a,
            longMonthsParse: a,
            shortMonthsParse: a,
            monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
            monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
            monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
            monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY г.",
                LLL: "D MMMM YYYY г., HH:mm",
                LLLL: "dddd, D MMMM YYYY г., HH:mm"
            },
            calendar: {
                sameDay: "[Сегодня в] LT",
                nextDay: "[Завтра в] LT",
                lastDay: "[Вчера в] LT",
                nextWeek: function(e) {
                    if (e.week() === this.week()) return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
                    switch (this.day()) {
                        case 0:
                            return "[В следующее] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[В следующий] dddd [в] LT";
                        case 3:
                        case 5:
                        case 6:
                            return "[В следующую] dddd [в] LT"
                    }
                },
                lastWeek: function(e) {
                    if (e.week() === this.week()) return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT";
                    switch (this.day()) {
                        case 0:
                            return "[В прошлое] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[В прошлый] dddd [в] LT";
                        case 3:
                        case 5:
                        case 6:
                            return "[В прошлую] dddd [в] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "через %s",
                past: "%s назад",
                s: "несколько секунд",
                m: n,
                mm: n,
                h: "час",
                hh: n,
                d: "день",
                dd: n,
                M: "месяц",
                MM: n,
                y: "год",
                yy: n
            },
            meridiemParse: /ночи|утра|дня|вечера/i,
            isPM: function(e) {
                return /^(дня|вечера)$/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "ночи" : e < 12 ? "утра" : e < 17 ? "дня" : "вечера"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "M":
                    case "d":
                    case "DDD":
                        return e + "-й";
                    case "D":
                        return e + "-го";
                    case "w":
                    case "W":
                        return e + "-я";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = ["جنوري", "فيبروري", "مارچ", "اپريل", "مئي", "جون", "جولاءِ", "آگسٽ", "سيپٽمبر", "آڪٽوبر", "نومبر", "ڊسمبر"],
            n = ["آچر", "سومر", "اڱارو", "اربع", "خميس", "جمع", "ڇنڇر"];
        return e.defineLocale("sd", {
            months: t,
            monthsShort: t,
            weekdays: n,
            weekdaysShort: n,
            weekdaysMin: n,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd، D MMMM YYYY HH:mm"
            },
            meridiemParse: /صبح|شام/,
            isPM: function(e) {
                return "شام" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "صبح" : "شام"
            },
            calendar: {
                sameDay: "[اڄ] LT",
                nextDay: "[سڀاڻي] LT",
                nextWeek: "dddd [اڳين هفتي تي] LT",
                lastDay: "[ڪالهه] LT",
                lastWeek: "[گزريل هفتي] dddd [تي] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s پوء",
                past: "%s اڳ",
                s: "چند سيڪنڊ",
                m: "هڪ منٽ",
                mm: "%d منٽ",
                h: "هڪ ڪلاڪ",
                hh: "%d ڪلاڪ",
                d: "هڪ ڏينهن",
                dd: "%d ڏينهن",
                M: "هڪ مهينو",
                MM: "%d مهينا",
                y: "هڪ سال",
                yy: "%d سال"
            },
            preparse: function(e) {
                return e.replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/,/g, "،")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("se", {
            months: "ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split("_"),
            monthsShort: "ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),
            weekdays: "sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split("_"),
            weekdaysShort: "sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),
            weekdaysMin: "s_v_m_g_d_b_L".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "MMMM D. [b.] YYYY",
                LLL: "MMMM D. [b.] YYYY [ti.] HH:mm",
                LLLL: "dddd, MMMM D. [b.] YYYY [ti.] HH:mm"
            },
            calendar: {
                sameDay: "[otne ti] LT",
                nextDay: "[ihttin ti] LT",
                nextWeek: "dddd [ti] LT",
                lastDay: "[ikte ti] LT",
                lastWeek: "[ovddit] dddd [ti] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s geažes",
                past: "maŋit %s",
                s: "moadde sekunddat",
                m: "okta minuhta",
                mm: "%d minuhtat",
                h: "okta diimmu",
                hh: "%d diimmut",
                d: "okta beaivi",
                dd: "%d beaivvit",
                M: "okta mánnu",
                MM: "%d mánut",
                y: "okta jahki",
                yy: "%d jagit"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("si", {
            months: "ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),
            monthsShort: "ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),
            weekdays: "ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),
            weekdaysShort: "ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),
            weekdaysMin: "ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "a h:mm",
                LTS: "a h:mm:ss",
                L: "YYYY/MM/DD",
                LL: "YYYY MMMM D",
                LLL: "YYYY MMMM D, a h:mm",
                LLLL: "YYYY MMMM D [වැනි] dddd, a h:mm:ss"
            },
            calendar: {
                sameDay: "[අද] LT[ට]",
                nextDay: "[හෙට] LT[ට]",
                nextWeek: "dddd LT[ට]",
                lastDay: "[ඊයේ] LT[ට]",
                lastWeek: "[පසුගිය] dddd LT[ට]",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sකින්",
                past: "%sකට පෙර",
                s: "තත්පර කිහිපය",
                m: "මිනිත්තුව",
                mm: "මිනිත්තු %d",
                h: "පැය",
                hh: "පැය %d",
                d: "දිනය",
                dd: "දින %d",
                M: "මාසය",
                MM: "මාස %d",
                y: "වසර",
                yy: "වසර %d"
            },
            dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
            ordinal: function(e) {
                return e + " වැනි"
            },
            meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
            isPM: function(e) {
                return "ප.ව." === e || "පස් වරු" === e
            },
            meridiem: function(e, t, n) {
                return e > 11 ? n ? "ප.ව." : "පස් වරු" : n ? "පෙ.ව." : "පෙර වරු"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            return e > 1 && e < 5
        }

        function n(e, n, a, r) {
            var s = e + " ";
            switch (a) {
                case "s":
                    return n || r ? "pár sekúnd" : "pár sekundami";
                case "m":
                    return n ? "minúta" : r ? "minútu" : "minútou";
                case "mm":
                    return n || r ? s + (t(e) ? "minúty" : "minút") : s + "minútami";
                case "h":
                    return n ? "hodina" : r ? "hodinu" : "hodinou";
                case "hh":
                    return n || r ? s + (t(e) ? "hodiny" : "hodín") : s + "hodinami";
                case "d":
                    return n || r ? "deň" : "dňom";
                case "dd":
                    return n || r ? s + (t(e) ? "dni" : "dní") : s + "dňami";
                case "M":
                    return n || r ? "mesiac" : "mesiacom";
                case "MM":
                    return n || r ? s + (t(e) ? "mesiace" : "mesiacov") : s + "mesiacmi";
                case "y":
                    return n || r ? "rok" : "rokom";
                case "yy":
                    return n || r ? s + (t(e) ? "roky" : "rokov") : s + "rokmi"
            }
        }
        var a = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),
            r = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");
        return e.defineLocale("sk", {
            months: a,
            monthsShort: r,
            weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
            weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
            weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[dnes o] LT",
                nextDay: "[zajtra o] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [o] LT";
                        case 3:
                            return "[v stredu o] LT";
                        case 4:
                            return "[vo štvrtok o] LT";
                        case 5:
                            return "[v piatok o] LT";
                        case 6:
                            return "[v sobotu o] LT"
                    }
                },
                lastDay: "[včera o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[minulú nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[minulý] dddd [o] LT";
                        case 3:
                            return "[minulú stredu o] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [o] LT";
                        case 6:
                            return "[minulú sobotu o] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pred %s",
                s: n,
                m: n,
                mm: n,
                h: n,
                hh: n,
                d: n,
                dd: n,
                M: n,
                MM: n,
                y: n,
                yy: n
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = e + " ";
            switch (n) {
                case "s":
                    return t || a ? "nekaj sekund" : "nekaj sekundami";
                case "m":
                    return t ? "ena minuta" : "eno minuto";
                case "mm":
                    return r += 1 === e ? t ? "minuta" : "minuto" : 2 === e ? t || a ? "minuti" : "minutama" : e < 5 ? t || a ? "minute" : "minutami" : t || a ? "minut" : "minutami";
                case "h":
                    return t ? "ena ura" : "eno uro";
                case "hh":
                    return r += 1 === e ? t ? "ura" : "uro" : 2 === e ? t || a ? "uri" : "urama" : e < 5 ? t || a ? "ure" : "urami" : t || a ? "ur" : "urami";
                case "d":
                    return t || a ? "en dan" : "enim dnem";
                case "dd":
                    return r += 1 === e ? t || a ? "dan" : "dnem" : 2 === e ? t || a ? "dni" : "dnevoma" : t || a ? "dni" : "dnevi";
                case "M":
                    return t || a ? "en mesec" : "enim mesecem";
                case "MM":
                    return r += 1 === e ? t || a ? "mesec" : "mesecem" : 2 === e ? t || a ? "meseca" : "mesecema" : e < 5 ? t || a ? "mesece" : "meseci" : t || a ? "mesecev" : "meseci";
                case "y":
                    return t || a ? "eno leto" : "enim letom";
                case "yy":
                    return r += 1 === e ? t || a ? "leto" : "letom" : 2 === e ? t || a ? "leti" : "letoma" : e < 5 ? t || a ? "leta" : "leti" : t || a ? "let" : "leti"
            }
        }
        return e.defineLocale("sl", {
            months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
            weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
            weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[danes ob] LT",
                nextDay: "[jutri ob] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v] [nedeljo] [ob] LT";
                        case 3:
                            return "[v] [sredo] [ob] LT";
                        case 6:
                            return "[v] [soboto] [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[v] dddd [ob] LT"
                    }
                },
                lastDay: "[včeraj ob] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[prejšnjo] [nedeljo] [ob] LT";
                        case 3:
                            return "[prejšnjo] [sredo] [ob] LT";
                        case 6:
                            return "[prejšnjo] [soboto] [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prejšnji] dddd [ob] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "čez %s",
                past: "pred %s",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("sq", {
            months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),
            monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
            weekdays: "E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),
            weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
            weekdaysMin: "D_H_Ma_Më_E_P_Sh".split("_"),
            weekdaysParseExact: !0,
            meridiemParse: /PD|MD/,
            isPM: function(e) {
                return "M" === e.charAt(0)
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "PD" : "MD"
            },
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Sot në] LT",
                nextDay: "[Nesër në] LT",
                nextWeek: "dddd [në] LT",
                lastDay: "[Dje në] LT",
                lastWeek: "dddd [e kaluar në] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "në %s",
                past: "%s më parë",
                s: "disa sekonda",
                m: "një minutë",
                mm: "%d minuta",
                h: "një orë",
                hh: "%d orë",
                d: "një ditë",
                dd: "%d ditë",
                M: "një muaj",
                MM: "%d muaj",
                y: "një vit",
                yy: "%d vite"
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            words: {
                m: ["један минут", "једне минуте"],
                mm: ["минут", "минуте", "минута"],
                h: ["један сат", "једног сата"],
                hh: ["сат", "сата", "сати"],
                dd: ["дан", "дана", "дана"],
                MM: ["месец", "месеца", "месеци"],
                yy: ["година", "године", "година"]
            },
            correctGrammaticalCase: function(e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            },
            translate: function(e, n, a) {
                var r = t.words[a];
                return 1 === a.length ? n ? r[0] : r[1] : e + " " + t.correctGrammaticalCase(e, r)
            }
        };
        return e.defineLocale("sr-cyrl", {
            months: "јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split("_"),
            monthsShort: "јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),
            monthsParseExact: !0,
            weekdays: "недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),
            weekdaysShort: "нед._пон._уто._сре._чет._пет._суб.".split("_"),
            weekdaysMin: "не_по_ут_ср_че_пе_су".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[данас у] LT",
                nextDay: "[сутра у] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[у] [недељу] [у] LT";
                        case 3:
                            return "[у] [среду] [у] LT";
                        case 6:
                            return "[у] [суботу] [у] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[у] dddd [у] LT"
                    }
                },
                lastDay: "[јуче у] LT",
                lastWeek: function() {
                    return ["[прошле] [недеље] [у] LT", "[прошлог] [понедељка] [у] LT", "[прошлог] [уторка] [у] LT", "[прошле] [среде] [у] LT", "[прошлог] [четвртка] [у] LT", "[прошлог] [петка] [у] LT", "[прошле] [суботе] [у] LT"][this.day()]
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "пре %s",
                s: "неколико секунди",
                m: t.translate,
                mm: t.translate,
                h: t.translate,
                hh: t.translate,
                d: "дан",
                dd: t.translate,
                M: "месец",
                MM: t.translate,
                y: "годину",
                yy: t.translate
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            words: {
                m: ["jedan minut", "jedne minute"],
                mm: ["minut", "minute", "minuta"],
                h: ["jedan sat", "jednog sata"],
                hh: ["sat", "sata", "sati"],
                dd: ["dan", "dana", "dana"],
                MM: ["mesec", "meseca", "meseci"],
                yy: ["godina", "godine", "godina"]
            },
            correctGrammaticalCase: function(e, t) {
                return 1 === e ? t[0] : e >= 2 && e <= 4 ? t[1] : t[2]
            },
            translate: function(e, n, a) {
                var r = t.words[a];
                return 1 === a.length ? n ? r[0] : r[1] : e + " " + t.correctGrammaticalCase(e, r)
            }
        };
        return e.defineLocale("sr", {
            months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),
            monthsParseExact: !0,
            weekdays: "nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sre._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY H:mm",
                LLLL: "dddd, D. MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedelju] [u] LT";
                        case 3:
                            return "[u] [sredu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[juče u] LT",
                lastWeek: function() {
                    return ["[prošle] [nedelje] [u] LT", "[prošlog] [ponedeljka] [u] LT", "[prošlog] [utorka] [u] LT", "[prošle] [srede] [u] LT", "[prošlog] [četvrtka] [u] LT", "[prošlog] [petka] [u] LT", "[prošle] [subote] [u] LT"][this.day()]
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pre %s",
                s: "nekoliko sekundi",
                m: t.translate,
                mm: t.translate,
                h: t.translate,
                hh: t.translate,
                d: "dan",
                dd: t.translate,
                M: "mesec",
                MM: t.translate,
                y: "godinu",
                yy: t.translate
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("ss", {
            months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split("_"),
            monthsShort: "Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),
            weekdays: "Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split("_"),
            weekdaysShort: "Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),
            weekdaysMin: "Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendar: {
                sameDay: "[Namuhla nga] LT",
                nextDay: "[Kusasa nga] LT",
                nextWeek: "dddd [nga] LT",
                lastDay: "[Itolo nga] LT",
                lastWeek: "dddd [leliphelile] [nga] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "nga %s",
                past: "wenteka nga %s",
                s: "emizuzwana lomcane",
                m: "umzuzu",
                mm: "%d emizuzu",
                h: "lihora",
                hh: "%d emahora",
                d: "lilanga",
                dd: "%d emalanga",
                M: "inyanga",
                MM: "%d tinyanga",
                y: "umnyaka",
                yy: "%d iminyaka"
            },
            meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
            meridiem: function(e, t, n) {
                return e < 11 ? "ekuseni" : e < 15 ? "emini" : e < 19 ? "entsambama" : "ebusuku"
            },
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "ekuseni" === t ? e : "emini" === t ? e >= 11 ? e : e + 12 : "entsambama" === t || "ebusuku" === t ? 0 === e ? 0 : e + 12 : void 0
            },
            dayOfMonthOrdinalParse: /\d{1,2}/,
            ordinal: "%d",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("sv", {
            months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
            weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
            weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [kl.] HH:mm",
                LLLL: "dddd D MMMM YYYY [kl.] HH:mm",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd D MMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Idag] LT",
                nextDay: "[Imorgon] LT",
                lastDay: "[Igår] LT",
                nextWeek: "[På] dddd LT",
                lastWeek: "[I] dddd[s] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "för %s sedan",
                s: "några sekunder",
                m: "en minut",
                mm: "%d minuter",
                h: "en timme",
                hh: "%d timmar",
                d: "en dag",
                dd: "%d dagar",
                M: "en månad",
                MM: "%d månader",
                y: "ett år",
                yy: "%d år"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(e|a)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "e" : 1 === t ? "a" : 2 === t ? "a" : "e")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("sw", {
            months: "Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),
            weekdaysShort: "Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),
            weekdaysMin: "J2_J3_J4_J5_Al_Ij_J1".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[leo saa] LT",
                nextDay: "[kesho saa] LT",
                nextWeek: "[wiki ijayo] dddd [saat] LT",
                lastDay: "[jana] LT",
                lastWeek: "[wiki iliyopita] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s baadaye",
                past: "tokea %s",
                s: "hivi punde",
                m: "dakika moja",
                mm: "dakika %d",
                h: "saa limoja",
                hh: "masaa %d",
                d: "siku moja",
                dd: "masiku %d",
                M: "mwezi mmoja",
                MM: "miezi %d",
                y: "mwaka mmoja",
                yy: "miaka %d"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
                1: "௧",
                2: "௨",
                3: "௩",
                4: "௪",
                5: "௫",
                6: "௬",
                7: "௭",
                8: "௮",
                9: "௯",
                0: "௦"
            },
            n = {
                "௧": "1",
                "௨": "2",
                "௩": "3",
                "௪": "4",
                "௫": "5",
                "௬": "6",
                "௭": "7",
                "௮": "8",
                "௯": "9",
                "௦": "0"
            };
        return e.defineLocale("ta", {
            months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),
            weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),
            weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, HH:mm",
                LLLL: "dddd, D MMMM YYYY, HH:mm"
            },
            calendar: {
                sameDay: "[இன்று] LT",
                nextDay: "[நாளை] LT",
                nextWeek: "dddd, LT",
                lastDay: "[நேற்று] LT",
                lastWeek: "[கடந்த வாரம்] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s இல்",
                past: "%s முன்",
                s: "ஒரு சில விநாடிகள்",
                m: "ஒரு நிமிடம்",
                mm: "%d நிமிடங்கள்",
                h: "ஒரு மணி நேரம்",
                hh: "%d மணி நேரம்",
                d: "ஒரு நாள்",
                dd: "%d நாட்கள்",
                M: "ஒரு மாதம்",
                MM: "%d மாதங்கள்",
                y: "ஒரு வருடம்",
                yy: "%d ஆண்டுகள்"
            },
            dayOfMonthOrdinalParse: /\d{1,2}வது/,
            ordinal: function(e) {
                return e + "வது"
            },
            preparse: function(e) {
                return e.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function(e) {
                    return n[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
            meridiem: function(e, t, n) {
                return e < 2 ? " யாமம்" : e < 6 ? " வைகறை" : e < 10 ? " காலை" : e < 14 ? " நண்பகல்" : e < 18 ? " எற்பாடு" : e < 22 ? " மாலை" : " யாமம்"
            },
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "யாமம்" === t ? e < 2 ? e : e + 12 : "வைகறை" === t || "காலை" === t ? e : "நண்பகல்" === t && e >= 10 ? e : e + 12
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("te", {
            months: "జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split("_"),
            monthsShort: "జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split("_"),
            monthsParseExact: !0,
            weekdays: "ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split("_"),
            weekdaysShort: "ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),
            weekdaysMin: "ఆ_సో_మం_బు_గు_శు_శ".split("_"),
            longDateFormat: {
                LT: "A h:mm",
                LTS: "A h:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, A h:mm",
                LLLL: "dddd, D MMMM YYYY, A h:mm"
            },
            calendar: {
                sameDay: "[నేడు] LT",
                nextDay: "[రేపు] LT",
                nextWeek: "dddd, LT",
                lastDay: "[నిన్న] LT",
                lastWeek: "[గత] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s లో",
                past: "%s క్రితం",
                s: "కొన్ని క్షణాలు",
                m: "ఒక నిమిషం",
                mm: "%d నిమిషాలు",
                h: "ఒక గంట",
                hh: "%d గంటలు",
                d: "ఒక రోజు",
                dd: "%d రోజులు",
                M: "ఒక నెల",
                MM: "%d నెలలు",
                y: "ఒక సంవత్సరం",
                yy: "%d సంవత్సరాలు"
            },
            dayOfMonthOrdinalParse: /\d{1,2}వ/,
            ordinal: "%dవ",
            meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "రాత్రి" === t ? e < 4 ? e : e + 12 : "ఉదయం" === t ? e : "మధ్యాహ్నం" === t ? e >= 10 ? e : e + 12 : "సాయంత్రం" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "రాత్రి" : e < 10 ? "ఉదయం" : e < 17 ? "మధ్యాహ్నం" : e < 20 ? "సాయంత్రం" : "రాత్రి"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("tet", {
            months: "Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru".split("_"),
            monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez".split("_"),
            weekdays: "Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu".split("_"),
            weekdaysShort: "Dom_Seg_Ters_Kua_Kint_Sext_Sab".split("_"),
            weekdaysMin: "Do_Seg_Te_Ku_Ki_Sex_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Ohin iha] LT",
                nextDay: "[Aban iha] LT",
                nextWeek: "dddd [iha] LT",
                lastDay: "[Horiseik iha] LT",
                lastWeek: "dddd [semana kotuk] [iha] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "iha %s",
                past: "%s liuba",
                s: "minutu balun",
                m: "minutu ida",
                mm: "minutus %d",
                h: "horas ida",
                hh: "horas %d",
                d: "loron ida",
                dd: "loron %d",
                M: "fulan ida",
                MM: "fulan %d",
                y: "tinan ida",
                yy: "tinan %d"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("th", {
            months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
            monthsShort: "ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),
            monthsParseExact: !0,
            weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
            weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),
            weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "H:mm",
                LTS: "H:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY เวลา H:mm",
                LLLL: "วันddddที่ D MMMM YYYY เวลา H:mm"
            },
            meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
            isPM: function(e) {
                return "หลังเที่ยง" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "ก่อนเที่ยง" : "หลังเที่ยง"
            },
            calendar: {
                sameDay: "[วันนี้ เวลา] LT",
                nextDay: "[พรุ่งนี้ เวลา] LT",
                nextWeek: "dddd[หน้า เวลา] LT",
                lastDay: "[เมื่อวานนี้ เวลา] LT",
                lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "อีก %s",
                past: "%sที่แล้ว",
                s: "ไม่กี่วินาที",
                m: "1 นาที",
                mm: "%d นาที",
                h: "1 ชั่วโมง",
                hh: "%d ชั่วโมง",
                d: "1 วัน",
                dd: "%d วัน",
                M: "1 เดือน",
                MM: "%d เดือน",
                y: "1 ปี",
                yy: "%d ปี"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("tl-ph", {
            months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),
            monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
            weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),
            weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
            weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "MM/D/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY HH:mm",
                LLLL: "dddd, MMMM DD, YYYY HH:mm"
            },
            calendar: {
                sameDay: "LT [ngayong araw]",
                nextDay: "[Bukas ng] LT",
                nextWeek: "LT [sa susunod na] dddd",
                lastDay: "LT [kahapon]",
                lastWeek: "LT [noong nakaraang] dddd",
                sameElse: "L"
            },
            relativeTime: {
                future: "sa loob ng %s",
                past: "%s ang nakalipas",
                s: "ilang segundo",
                m: "isang minuto",
                mm: "%d minuto",
                h: "isang oras",
                hh: "%d oras",
                d: "isang araw",
                dd: "%d araw",
                M: "isang buwan",
                MM: "%d buwan",
                y: "isang taon",
                yy: "%d taon"
            },
            dayOfMonthOrdinalParse: /\d{1,2}/,
            ordinal: function(e) {
                return e
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e) {
            var t = e;
            return t = -1 !== e.indexOf("jaj") ? t.slice(0, -3) + "leS" : -1 !== e.indexOf("jar") ? t.slice(0, -3) + "waQ" : -1 !== e.indexOf("DIS") ? t.slice(0, -3) + "nem" : t + " pIq"
        }

        function n(e) {
            var t = e;
            return t = -1 !== e.indexOf("jaj") ? t.slice(0, -3) + "Hu’" : -1 !== e.indexOf("jar") ? t.slice(0, -3) + "wen" : -1 !== e.indexOf("DIS") ? t.slice(0, -3) + "ben" : t + " ret"
        }

        function a(e, t, n, a) {
            var s = r(e);
            switch (n) {
                case "mm":
                    return s + " tup";
                case "hh":
                    return s + " rep";
                case "dd":
                    return s + " jaj";
                case "MM":
                    return s + " jar";
                case "yy":
                    return s + " DIS"
            }
        }

        function r(e) {
            var t = Math.floor(e % 1e3 / 100),
                n = Math.floor(e % 100 / 10),
                a = e % 10,
                r = "";
            return t > 0 && (r += s[t] + "vatlh"), n > 0 && (r += ("" !== r ? " " : "") + s[n] + "maH"), a > 0 && (r += ("" !== r ? " " : "") + s[a]), "" === r ? "pagh" : r
        }
        var s = "pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");
        return e.defineLocale("tlh", {
            months: "tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split("_"),
            monthsShort: "jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split("_"),
            monthsParseExact: !0,
            weekdays: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),
            weekdaysShort: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),
            weekdaysMin: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[DaHjaj] LT",
                nextDay: "[wa’leS] LT",
                nextWeek: "LLL",
                lastDay: "[wa’Hu’] LT",
                lastWeek: "LLL",
                sameElse: "L"
            },
            relativeTime: {
                future: t,
                past: n,
                s: "puS lup",
                m: "wa’ tup",
                mm: a,
                h: "wa’ rep",
                hh: a,
                d: "wa’ jaj",
                dd: a,
                M: "wa’ jar",
                MM: a,
                y: "wa’ DIS",
                yy: a
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = {
            1: "'inci",
            5: "'inci",
            8: "'inci",
            70: "'inci",
            80: "'inci",
            2: "'nci",
            7: "'nci",
            20: "'nci",
            50: "'nci",
            3: "'üncü",
            4: "'üncü",
            100: "'üncü",
            6: "'ncı",
            9: "'uncu",
            10: "'uncu",
            30: "'uncu",
            60: "'ıncı",
            90: "'ıncı"
        };
        return e.defineLocale("tr", {
            months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
            monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
            weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
            weekdaysShort: "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
            weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[bugün saat] LT",
                nextDay: "[yarın saat] LT",
                nextWeek: "[gelecek] dddd [saat] LT",
                lastDay: "[dün] LT",
                lastWeek: "[geçen] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s sonra",
                past: "%s önce",
                s: "birkaç saniye",
                m: "bir dakika",
                mm: "%d dakika",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir yıl",
                yy: "%d yıl"
            },
            dayOfMonthOrdinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
            ordinal: function(e) {
                if (0 === e) return e + "'ıncı";
                var n = e % 10,
                    a = e % 100 - n,
                    r = e >= 100 ? 100 : null;
                return e + (t[n] || t[a] || t[r])
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t, n, a) {
            var r = {
                s: ["viensas secunds", "'iensas secunds"],
                m: ["'n míut", "'iens míut"],
                mm: [e + " míuts", e + " míuts"],
                h: ["'n þora", "'iensa þora"],
                hh: [e + " þoras", e + " þoras"],
                d: ["'n ziua", "'iensa ziua"],
                dd: [e + " ziuas", e + " ziuas"],
                M: ["'n mes", "'iens mes"],
                MM: [e + " mesen", e + " mesen"],
                y: ["'n ar", "'iens ar"],
                yy: [e + " ars", e + " ars"]
            };
            return a ? r[n][0] : t ? r[n][0] : r[n][1]
        }
        return e.defineLocale("tzl", {
            months: "Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),
            monthsShort: "Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),
            weekdays: "Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),
            weekdaysShort: "Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),
            weekdaysMin: "Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                LTS: "HH.mm.ss",
                L: "DD.MM.YYYY",
                LL: "D. MMMM [dallas] YYYY",
                LLL: "D. MMMM [dallas] YYYY HH.mm",
                LLLL: "dddd, [li] D. MMMM [dallas] YYYY HH.mm"
            },
            meridiemParse: /d\'o|d\'a/i,
            isPM: function(e) {
                return "d'o" === e.toLowerCase()
            },
            meridiem: function(e, t, n) {
                return e > 11 ? n ? "d'o" : "D'O" : n ? "d'a" : "D'A"
            },
            calendar: {
                sameDay: "[oxhi à] LT",
                nextDay: "[demà à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[ieiri à] LT",
                lastWeek: "[sür el] dddd [lasteu à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "osprei %s",
                past: "ja%s",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            dayOfMonthOrdinalParse: /\d{1,2}\./,
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("tzm-latn", {
            months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[asdkh g] LT",
                nextDay: "[aska g] LT",
                nextWeek: "dddd [g] LT",
                lastDay: "[assant g] LT",
                lastWeek: "dddd [g] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dadkh s yan %s",
                past: "yan %s",
                s: "imik",
                m: "minuḍ",
                mm: "%d minuḍ",
                h: "saɛa",
                hh: "%d tassaɛin",
                d: "ass",
                dd: "%d ossan",
                M: "ayowr",
                MM: "%d iyyirn",
                y: "asgas",
                yy: "%d isgasn"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("tzm", {
            months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
                nextDay: "[ⴰⵙⴽⴰ ⴴ] LT",
                nextWeek: "dddd [ⴴ] LT",
                lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT",
                lastWeek: "dddd [ⴴ] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
                past: "ⵢⴰⵏ %s",
                s: "ⵉⵎⵉⴽ",
                m: "ⵎⵉⵏⵓⴺ",
                mm: "%d ⵎⵉⵏⵓⴺ",
                h: "ⵙⴰⵄⴰ",
                hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
                d: "ⴰⵙⵙ",
                dd: "%d oⵙⵙⴰⵏ",
                M: "ⴰⵢoⵓⵔ",
                MM: "%d ⵉⵢⵢⵉⵔⵏ",
                y: "ⴰⵙⴳⴰⵙ",
                yy: "%d ⵉⵙⴳⴰⵙⵏ"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";

        function t(e, t) {
            var n = e.split("_");
            return t % 10 == 1 && t % 100 != 11 ? n[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? n[1] : n[2]
        }

        function n(e, n, a) {
            var r = {
                mm: n ? "хвилина_хвилини_хвилин" : "хвилину_хвилини_хвилин",
                hh: n ? "година_години_годин" : "годину_години_годин",
                dd: "день_дні_днів",
                MM: "місяць_місяці_місяців",
                yy: "рік_роки_років"
            };
            return "m" === a ? n ? "хвилина" : "хвилину" : "h" === a ? n ? "година" : "годину" : e + " " + t(r[a], +e)
        }

        function a(e, t) {
            var n = {
                nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),
                accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),
                genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")
            };
            return e ? n[/(\[[ВвУу]\]) ?dddd/.test(t) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t) ? "genitive" : "nominative"][e.day()] : n.nominative
        }

        function r(e) {
            return function() {
                return e + "о" + (11 === this.hours() ? "б" : "") + "] LT"
            }
        }
        return e.defineLocale("uk", {
            months: {
                format: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),
                standalone: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")
            },
            monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
            weekdays: a,
            weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY р.",
                LLL: "D MMMM YYYY р., HH:mm",
                LLLL: "dddd, D MMMM YYYY р., HH:mm"
            },
            calendar: {
                sameDay: r("[Сьогодні "),
                nextDay: r("[Завтра "),
                lastDay: r("[Вчора "),
                nextWeek: r("[У] dddd ["),
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return r("[Минулої] dddd [").call(this);
                        case 1:
                        case 2:
                        case 4:
                            return r("[Минулого] dddd [").call(this)
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "%s тому",
                s: "декілька секунд",
                m: n,
                mm: n,
                h: "годину",
                hh: n,
                d: "день",
                dd: n,
                M: "місяць",
                MM: n,
                y: "рік",
                yy: n
            },
            meridiemParse: /ночі|ранку|дня|вечора/,
            isPM: function(e) {
                return /^(дня|вечора)$/.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 4 ? "ночі" : e < 12 ? "ранку" : e < 17 ? "дня" : "вечора"
            },
            dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "M":
                    case "d":
                    case "DDD":
                    case "w":
                    case "W":
                        return e + "-й";
                    case "D":
                        return e + "-го";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        var t = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"],
            n = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
        return e.defineLocale("ur", {
            months: t,
            monthsShort: t,
            weekdays: n,
            weekdaysShort: n,
            weekdaysMin: n,
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd، D MMMM YYYY HH:mm"
            },
            meridiemParse: /صبح|شام/,
            isPM: function(e) {
                return "شام" === e
            },
            meridiem: function(e, t, n) {
                return e < 12 ? "صبح" : "شام"
            },
            calendar: {
                sameDay: "[آج بوقت] LT",
                nextDay: "[کل بوقت] LT",
                nextWeek: "dddd [بوقت] LT",
                lastDay: "[گذشتہ روز بوقت] LT",
                lastWeek: "[گذشتہ] dddd [بوقت] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s بعد",
                past: "%s قبل",
                s: "چند سیکنڈ",
                m: "ایک منٹ",
                mm: "%d منٹ",
                h: "ایک گھنٹہ",
                hh: "%d گھنٹے",
                d: "ایک دن",
                dd: "%d دن",
                M: "ایک ماہ",
                MM: "%d ماہ",
                y: "ایک سال",
                yy: "%d سال"
            },
            preparse: function(e) {
                return e.replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/,/g, "،")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("uz-latn", {
            months: "Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split("_"),
            monthsShort: "Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),
            weekdays: "Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split("_"),
            weekdaysShort: "Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),
            weekdaysMin: "Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "D MMMM YYYY, dddd HH:mm"
            },
            calendar: {
                sameDay: "[Bugun soat] LT [da]",
                nextDay: "[Ertaga] LT [da]",
                nextWeek: "dddd [kuni soat] LT [da]",
                lastDay: "[Kecha soat] LT [da]",
                lastWeek: "[O'tgan] dddd [kuni soat] LT [da]",
                sameElse: "L"
            },
            relativeTime: {
                future: "Yaqin %s ichida",
                past: "Bir necha %s oldin",
                s: "soniya",
                m: "bir daqiqa",
                mm: "%d daqiqa",
                h: "bir soat",
                hh: "%d soat",
                d: "bir kun",
                dd: "%d kun",
                M: "bir oy",
                MM: "%d oy",
                y: "bir yil",
                yy: "%d yil"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("uz", {
            months: "январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split("_"),
            monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
            weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
            weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
            weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "D MMMM YYYY, dddd HH:mm"
            },
            calendar: {
                sameDay: "[Бугун соат] LT [да]",
                nextDay: "[Эртага] LT [да]",
                nextWeek: "dddd [куни соат] LT [да]",
                lastDay: "[Кеча соат] LT [да]",
                lastWeek: "[Утган] dddd [куни соат] LT [да]",
                sameElse: "L"
            },
            relativeTime: {
                future: "Якин %s ичида",
                past: "Бир неча %s олдин",
                s: "фурсат",
                m: "бир дакика",
                mm: "%d дакика",
                h: "бир соат",
                hh: "%d соат",
                d: "бир кун",
                dd: "%d кун",
                M: "бир ой",
                MM: "%d ой",
                y: "бир йил",
                yy: "%d йил"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("vi", {
            months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),
            monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
            monthsParseExact: !0,
            weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
            weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysParseExact: !0,
            meridiemParse: /sa|ch/i,
            isPM: function(e) {
                return /^ch$/i.test(e)
            },
            meridiem: function(e, t, n) {
                return e < 12 ? n ? "sa" : "SA" : n ? "ch" : "CH"
            },
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "DD/MM/YYYY",
                LL: "D MMMM [năm] YYYY",
                LLL: "D MMMM [năm] YYYY HH:mm",
                LLLL: "dddd, D MMMM [năm] YYYY HH:mm",
                l: "DD/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY HH:mm",
                llll: "ddd, D MMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[Hôm nay lúc] LT",
                nextDay: "[Ngày mai lúc] LT",
                nextWeek: "dddd [tuần tới lúc] LT",
                lastDay: "[Hôm qua lúc] LT",
                lastWeek: "dddd [tuần rồi lúc] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s tới",
                past: "%s trước",
                s: "vài giây",
                m: "một phút",
                mm: "%d phút",
                h: "một giờ",
                hh: "%d giờ",
                d: "một ngày",
                dd: "%d ngày",
                M: "một tháng",
                MM: "%d tháng",
                y: "một năm",
                yy: "%d năm"
            },
            dayOfMonthOrdinalParse: /\d{1,2}/,
            ordinal: function(e) {
                return e
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("x-pseudo", {
            months: "J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split("_"),
            monthsShort: "J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split("_"),
            monthsParseExact: !0,
            weekdays: "S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split("_"),
            weekdaysShort: "S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),
            weekdaysMin: "S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),
            weekdaysParseExact: !0,
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY HH:mm",
                LLLL: "dddd, D MMMM YYYY HH:mm"
            },
            calendar: {
                sameDay: "[T~ódá~ý át] LT",
                nextDay: "[T~ómó~rró~w át] LT",
                nextWeek: "dddd [át] LT",
                lastDay: "[Ý~ést~érdá~ý át] LT",
                lastWeek: "[L~ást] dddd [át] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "í~ñ %s",
                past: "%s á~gó",
                s: "á ~féw ~sécó~ñds",
                m: "á ~míñ~úté",
                mm: "%d m~íñú~tés",
                h: "á~ñ hó~úr",
                hh: "%d h~óúrs",
                d: "á ~dáý",
                dd: "%d d~áýs",
                M: "á ~móñ~th",
                MM: "%d m~óñt~hs",
                y: "á ~ýéár",
                yy: "%d ý~éárs"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("yo", {
            months: "Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀".split("_"),
            monthsShort: "Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀".split("_"),
            weekdays: "Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta".split("_"),
            weekdaysShort: "Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá".split("_"),
            weekdaysMin: "Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                LTS: "h:mm:ss A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY h:mm A",
                LLLL: "dddd, D MMMM YYYY h:mm A"
            },
            calendar: {
                sameDay: "[Ònì ni] LT",
                nextDay: "[Ọ̀la ni] LT",
                nextWeek: "dddd [Ọsẹ̀ tón'bọ] [ni] LT",
                lastDay: "[Àna ni] LT",
                lastWeek: "dddd [Ọsẹ̀ tólọ́] [ni] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ní %s",
                past: "%s kọjá",
                s: "ìsẹjú aayá die",
                m: "ìsẹjú kan",
                mm: "ìsẹjú %d",
                h: "wákati kan",
                hh: "wákati %d",
                d: "ọjọ́ kan",
                dd: "ọjọ́ %d",
                M: "osù kan",
                MM: "osù %d",
                y: "ọdún kan",
                yy: "ọdún %d"
            },
            dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
            ordinal: "ọjọ́ %d",
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("zh-cn", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日Ah点mm分",
                LLLL: "YYYY年MMMD日ddddAh点mm分",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日 HH:mm",
                llll: "YYYY年MMMD日dddd HH:mm"
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "凌晨" === t || "早上" === t || "上午" === t ? e : "下午" === t || "晚上" === t ? e + 12 : e >= 11 ? e : e + 12
            },
            meridiem: function(e, t, n) {
                var a = 100 * e + t;
                return a < 600 ? "凌晨" : a < 900 ? "早上" : a < 1130 ? "上午" : a < 1230 ? "中午" : a < 1800 ? "下午" : "晚上"
            },
            calendar: {
                sameDay: "[今天]LT",
                nextDay: "[明天]LT",
                nextWeek: "[下]ddddLT",
                lastDay: "[昨天]LT",
                lastWeek: "[上]ddddLT",
                sameElse: "L"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    case "M":
                        return e + "月";
                    case "w":
                    case "W":
                        return e + "周";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s内",
                past: "%s前",
                s: "几秒",
                m: "1 分钟",
                mm: "%d 分钟",
                h: "1 小时",
                hh: "%d 小时",
                d: "1 天",
                dd: "%d 天",
                M: "1 个月",
                MM: "%d 个月",
                y: "1 年",
                yy: "%d 年"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("zh-hk", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日 HH:mm",
                LLLL: "YYYY年MMMD日dddd HH:mm",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日 HH:mm",
                llll: "YYYY年MMMD日dddd HH:mm"
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "凌晨" === t || "早上" === t || "上午" === t ? e : "中午" === t ? e >= 11 ? e : e + 12 : "下午" === t || "晚上" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                var a = 100 * e + t;
                return a < 600 ? "凌晨" : a < 900 ? "早上" : a < 1130 ? "上午" : a < 1230 ? "中午" : a < 1800 ? "下午" : "晚上"
            },
            calendar: {
                sameDay: "[今天]LT",
                nextDay: "[明天]LT",
                nextWeek: "[下]ddddLT",
                lastDay: "[昨天]LT",
                lastWeek: "[上]ddddLT",
                sameElse: "L"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    case "M":
                        return e + "月";
                    case "w":
                    case "W":
                        return e + "週";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s內",
                past: "%s前",
                s: "幾秒",
                m: "1 分鐘",
                mm: "%d 分鐘",
                h: "1 小時",
                hh: "%d 小時",
                d: "1 天",
                dd: "%d 天",
                M: "1 個月",
                MM: "%d 個月",
                y: "1 年",
                yy: "%d 年"
            }
        })
    })
}, function(e, t, n) {
    ! function(e, t) {
        t(n(0))
    }(0, function(e) {
        "use strict";
        return e.defineLocale("zh-tw", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                LTS: "HH:mm:ss",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日 HH:mm",
                LLLL: "YYYY年MMMD日dddd HH:mm",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日 HH:mm",
                llll: "YYYY年MMMD日dddd HH:mm"
            },
            meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
            meridiemHour: function(e, t) {
                return 12 === e && (e = 0), "凌晨" === t || "早上" === t || "上午" === t ? e : "中午" === t ? e >= 11 ? e : e + 12 : "下午" === t || "晚上" === t ? e + 12 : void 0
            },
            meridiem: function(e, t, n) {
                var a = 100 * e + t;
                return a < 600 ? "凌晨" : a < 900 ? "早上" : a < 1130 ? "上午" : a < 1230 ? "中午" : a < 1800 ? "下午" : "晚上"
            },
            calendar: {
                sameDay: "[今天]LT",
                nextDay: "[明天]LT",
                nextWeek: "[下]ddddLT",
                lastDay: "[昨天]LT",
                lastWeek: "[上]ddddLT",
                sameElse: "L"
            },
            dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    case "M":
                        return e + "月";
                    case "w":
                    case "W":
                        return e + "週";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s內",
                past: "%s前",
                s: "幾秒",
                m: "1 分鐘",
                mm: "%d 分鐘",
                h: "1 小時",
                hh: "%d 小時",
                d: "1 天",
                dd: "%d 天",
                M: "1 個月",
                MM: "%d 個月",
                y: "1 年",
                yy: "%d 年"
            }
        })
    })
}, function(e, t, n) {
    (function(e, a) {
        var r;
        (function() {
            function s(e, t) {
                if (e !== t) {
                    var n = null === e,
                        a = e === b,
                        r = e === e,
                        s = null === t,
                        i = t === b,
                        o = t === t;
                    if (e > t && !s || !r || n && !i && o || a && o) return 1;
                    if (e < t && !n || !o || s && !a && r || i && r) return -1
                }
                return 0
            }

            function i(e, t, n) {
                for (var a = e.length, r = n ? a : -1; n ? r-- : ++r < a;)
                    if (t(e[r], r, e)) return r;
                return -1
            }

            function o(e, t, n) {
                if (t !== t) return y(e, n);
                for (var a = n - 1, r = e.length; ++a < r;)
                    if (e[a] === t) return a;
                return -1
            }

            function _(e) {
                return "function" == typeof e || !1
            }

            function d(e) {
                return null == e ? "" : e + ""
            }

            function u(e, t) {
                for (var n = -1, a = e.length; ++n < a && t.indexOf(e.charAt(n)) > -1;);
                return n
            }

            function l(e, t) {
                for (var n = e.length; n-- && t.indexOf(e.charAt(n)) > -1;);
                return n
            }

            function m(e, t) {
                return s(e.criteria, t.criteria) || e.index - t.index
            }

            function c(e, t, n) {
                for (var a = -1, r = e.criteria, i = t.criteria, o = r.length, _ = n.length; ++a < o;) {
                    var d = s(r[a], i[a]);
                    if (d) {
                        if (a >= _) return d;
                        var u = n[a];
                        return d * ("asc" === u || !0 === u ? 1 : -1)
                    }
                }
                return e.index - t.index
            }

            function h(e) {
                return Ce[e]
            }

            function f(e) {
                return Ue[e]
            }

            function M(e, t, n) {
                return t ? e = $e[e] : n && (e = Ze[e]), "\\" + e
            }

            function L(e) {
                return "\\" + Ze[e]
            }

            function y(e, t, n) {
                for (var a = e.length, r = t + (n ? 0 : -1); n ? r-- : ++r < a;) {
                    var s = e[r];
                    if (s !== s) return r
                }
                return -1
            }

            function Y(e) {
                return !!e && "object" == typeof e
            }

            function p(e) {
                return e <= 160 && e >= 9 && e <= 13 || 32 == e || 160 == e || 5760 == e || 6158 == e || e >= 8192 && (e <= 8202 || 8232 == e || 8233 == e || 8239 == e || 8287 == e || 12288 == e || 65279 == e)
            }

            function k(e, t) {
                for (var n = -1, a = e.length, r = -1, s = []; ++n < a;) e[n] === t && (e[n] = V, s[++r] = n);
                return s
            }

            function D(e, t) {
                for (var n, a = -1, r = e.length, s = -1, i = []; ++a < r;) {
                    var o = e[a],
                        _ = t ? t(o, a, e) : o;
                    a && n === _ || (n = _, i[++s] = o)
                }
                return i
            }

            function g(e) {
                for (var t = -1, n = e.length; ++t < n && p(e.charCodeAt(t)););
                return t
            }

            function v(e) {
                for (var t = e.length; t-- && p(e.charCodeAt(t)););
                return t
            }

            function w(e) {
                return Ge[e]
            }

            function T(e) {
                function t(e) {
                    if (Y(e) && !Ho(e) && !(e instanceof r)) {
                        if (e instanceof a) return e;
                        if (ei.call(e, "__chain__") && ei.call(e, "__wrapped__")) return ca(e)
                    }
                    return new a(e)
                }

                function n() {}

                function a(e, t, n) {
                    this.__wrapped__ = e, this.__actions__ = n || [], this.__chain__ = !!t
                }

                function r(e) {
                    this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = bi, this.__views__ = []
                }

                function p() {
                    var e = new r(this.__wrapped__);
                    return e.__actions__ = nt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = nt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = nt(this.__views__), e
                }

                function Ce() {
                    if (this.__filtered__) {
                        var e = new r(this);
                        e.__dir__ = -1, e.__filtered__ = !0
                    } else e = this.clone(), e.__dir__ *= -1;
                    return e
                }

                function Ue() {
                    var e = this.__wrapped__.value(),
                        t = this.__dir__,
                        n = Ho(e),
                        a = t < 0,
                        r = n ? e.length : 0,
                        s = Vn(0, r, this.__views__),
                        i = s.start,
                        o = s.end,
                        _ = o - i,
                        d = a ? o : i - 1,
                        u = this.__iteratees__,
                        l = u.length,
                        m = 0,
                        c = Di(_, this.__takeCount__);
                    if (!n || r < N || r == _ && c == _) return nn(a && n ? e.reverse() : e, this.__actions__);
                    var h = [];
                    e: for (; _-- && m < c;) {
                        d += t;
                        for (var f = -1, M = e[d]; ++f < l;) {
                            var L = u[f],
                                y = L.iteratee,
                                Y = L.type,
                                p = y(M);
                            if (Y == U) M = p;
                            else if (!p) {
                                if (Y == C) continue e;
                                break e
                            }
                        }
                        h[m++] = M
                    }
                    return h
                }

                function Ge() {
                    this.__data__ = {}
                }

                function Ve(e) {
                    return this.has(e) && delete this.__data__[e]
                }

                function $e(e) {
                    return "__proto__" == e ? b : this.__data__[e]
                }

                function Ze(e) {
                    return "__proto__" != e && ei.call(this.__data__, e)
                }

                function Be(e, t) {
                    return "__proto__" != e && (this.__data__[e] = t), this
                }

                function Ke(e) {
                    var t = e ? e.length : 0;
                    for (this.data = {
                            hash: Mi(null),
                            set: new ui
                        }; t--;) this.push(e[t])
                }

                function qe(e, t) {
                    var n = e.data;
                    return ("string" == typeof t || Wr(t) ? n.set.has(t) : n.hash[t]) ? 0 : -1
                }

                function Qe(e) {
                    var t = this.data;
                    "string" == typeof e || Wr(e) ? t.set.add(e) : t.hash[e] = !0
                }

                function Xe(e, t) {
                    for (var n = -1, a = e.length, r = -1, s = t.length, i = Rs(a + s); ++n < a;) i[n] = e[n];
                    for (; ++r < s;) i[n++] = t[r];
                    return i
                }

                function nt(e, t) {
                    var n = -1,
                        a = e.length;
                    for (t || (t = Rs(a)); ++n < a;) t[n] = e[n];
                    return t
                }

                function at(e, t) {
                    for (var n = -1, a = e.length; ++n < a && !1 !== t(e[n], n, e););
                    return e
                }

                function rt(e, t) {
                    for (var n = e.length; n-- && !1 !== t(e[n], n, e););
                    return e
                }

                function st(e, t) {
                    for (var n = -1, a = e.length; ++n < a;)
                        if (!t(e[n], n, e)) return !1;
                    return !0
                }

                function it(e, t, n, a) {
                    for (var r = -1, s = e.length, i = a, o = i; ++r < s;) {
                        var _ = e[r],
                            d = +t(_);
                        n(d, i) && (i = d, o = _)
                    }
                    return o
                }

                function ot(e, t) {
                    for (var n = -1, a = e.length, r = -1, s = []; ++n < a;) {
                        var i = e[n];
                        t(i, n, e) && (s[++r] = i)
                    }
                    return s
                }

                function _t(e, t) {
                    for (var n = -1, a = e.length, r = Rs(a); ++n < a;) r[n] = t(e[n], n, e);
                    return r
                }

                function dt(e, t) {
                    for (var n = -1, a = t.length, r = e.length; ++n < a;) e[r + n] = t[n];
                    return e
                }

                function ut(e, t, n, a) {
                    var r = -1,
                        s = e.length;
                    for (a && s && (n = e[++r]); ++r < s;) n = t(n, e[r], r, e);
                    return n
                }

                function lt(e, t, n, a) {
                    var r = e.length;
                    for (a && r && (n = e[--r]); r--;) n = t(n, e[r], r, e);
                    return n
                }

                function mt(e, t) {
                    for (var n = -1, a = e.length; ++n < a;)
                        if (t(e[n], n, e)) return !0;
                    return !1
                }

                function ct(e, t) {
                    for (var n = e.length, a = 0; n--;) a += +t(e[n]) || 0;
                    return a
                }

                function ht(e, t) {
                    return e === b ? t : e
                }

                function ft(e, t, n, a) {
                    return e !== b && ei.call(a, n) ? e : t
                }

                function Mt(e, t, n) {
                    for (var a = -1, r = Ro(t), s = r.length; ++a < s;) {
                        var i = r[a],
                            o = e[i],
                            _ = n(o, t[i], i, e, t);
                        (_ === _ ? _ === o : o !== o) && (o !== b || i in e) || (e[i] = _)
                    }
                    return e
                }

                function Lt(e, t) {
                    return null == t ? e : Yt(t, Ro(t), e)
                }

                function yt(e, t) {
                    for (var n = -1, a = null == e, r = !a && qn(e), s = r ? e.length : 0, i = t.length, o = Rs(i); ++n < i;) {
                        var _ = t[n];
                        o[n] = r ? Qn(_, s) ? e[_] : b : a ? b : e[_]
                    }
                    return o
                }

                function Yt(e, t, n) {
                    n || (n = {});
                    for (var a = -1, r = t.length; ++a < r;) {
                        var s = t[a];
                        n[s] = e[s]
                    }
                    return n
                }

                function pt(e, t, n) {
                    var a = typeof e;
                    return "function" == a ? t === b ? e : sn(e, t, n) : null == e ? bs : "object" == a ? Jt(e) : t === b ? Ps(e) : Rt(e, t)
                }

                function kt(e, t, n, a, r, s, i) {
                    var o;
                    if (n && (o = r ? n(e, a, r) : n(e)), o !== b) return o;
                    if (!Wr(e)) return e;
                    var _ = Ho(e);
                    if (_) {
                        if (o = $n(e), !t) return nt(e, o)
                    } else {
                        var d = ni.call(e),
                            u = d == Q;
                        if (d != ee && d != $ && (!u || r)) return Ne[d] ? Bn(e, d, t) : r ? e : {};
                        if (o = Zn(u ? {} : e), !t) return Lt(o, e)
                    }
                    s || (s = []), i || (i = []);
                    for (var l = s.length; l--;)
                        if (s[l] == e) return i[l];
                    return s.push(e), i.push(o), (_ ? at : xt)(e, function(a, r) {
                        o[r] = kt(a, t, n, r, e, s, i)
                    }), o
                }

                function Dt(e, t, n) {
                    if ("function" != typeof e) throw new Bs(G);
                    return li(function() {
                        e.apply(b, n)
                    }, t)
                }

                function gt(e, t) {
                    var n = e ? e.length : 0,
                        a = [];
                    if (!n) return a;
                    var r = -1,
                        s = Cn(),
                        i = s == o,
                        _ = i && t.length >= N ? fn(t) : null,
                        d = t.length;
                    _ && (s = qe, i = !1, t = _);
                    e: for (; ++r < n;) {
                        var u = e[r];
                        if (i && u === u) {
                            for (var l = d; l--;)
                                if (t[l] === u) continue e;
                            a.push(u)
                        } else s(t, u, 0) < 0 && a.push(u)
                    }
                    return a
                }

                function vt(e, t) {
                    var n = !0;
                    return Ei(e, function(e, a, r) {
                        return n = !!t(e, a, r)
                    }), n
                }

                function wt(e, t, n, a) {
                    var r = a,
                        s = r;
                    return Ei(e, function(e, i, o) {
                        var _ = +t(e, i, o);
                        (n(_, r) || _ === a && _ === s) && (r = _, s = e)
                    }), s
                }

                function Tt(e, t, n, a) {
                    var r = e.length;
                    for (n = null == n ? 0 : +n || 0, n < 0 && (n = -n > r ? 0 : r + n), a = a === b || a > r ? r : +a || 0, a < 0 && (a += r), r = n > a ? 0 : a >>> 0, n >>>= 0; n < r;) e[n++] = t;
                    return e
                }

                function bt(e, t) {
                    var n = [];
                    return Ei(e, function(e, a, r) {
                        t(e, a, r) && n.push(e)
                    }), n
                }

                function St(e, t, n, a) {
                    var r;
                    return n(e, function(e, n, s) {
                        if (t(e, n, s)) return r = a ? n : e, !1
                    }), r
                }

                function Ht(e, t, n, a) {
                    a || (a = []);
                    for (var r = -1, s = e.length; ++r < s;) {
                        var i = e[r];
                        Y(i) && qn(i) && (n || Ho(i) || wr(i)) ? t ? Ht(i, t, n, a) : dt(a, i) : n || (a[a.length] = i)
                    }
                    return a
                }

                function jt(e, t) {
                    return Fi(e, t, es)
                }

                function xt(e, t) {
                    return Fi(e, t, Ro)
                }

                function Ot(e, t) {
                    return zi(e, t, Ro)
                }

                function Pt(e, t) {
                    for (var n = -1, a = t.length, r = -1, s = []; ++n < a;) {
                        var i = t[n];
                        Pr(e[i]) && (s[++r] = i)
                    }
                    return s
                }

                function Wt(e, t, n) {
                    if (null != e) {
                        n !== b && n in la(e) && (t = [n]);
                        for (var a = 0, r = t.length; null != e && a < r;) e = e[t[a++]];
                        return a && a == r ? e : b
                    }
                }

                function Et(e, t, n, a, r, s) {
                    return e === t || (null == e || null == t || !Wr(e) && !Y(t) ? e !== e && t !== t : At(e, t, Et, n, a, r, s))
                }

                function At(e, t, n, a, r, s, i) {
                    var o = Ho(e),
                        _ = Ho(t),
                        d = Z,
                        u = Z;
                    o || (d = ni.call(e), d == $ ? d = ee : d != ee && (o = Cr(e))), _ || (u = ni.call(t), u == $ ? u = ee : u != ee && (_ = Cr(t)));
                    var l = d == ee,
                        m = u == ee,
                        c = d == u;
                    if (c && !o && !l) return Jn(e, t, d);
                    if (!r) {
                        var h = l && ei.call(e, "__wrapped__"),
                            f = m && ei.call(t, "__wrapped__");
                        if (h || f) return n(h ? e.value() : e, f ? t.value() : t, a, r, s, i)
                    }
                    if (!c) return !1;
                    s || (s = []), i || (i = []);
                    for (var M = s.length; M--;)
                        if (s[M] == e) return i[M] == t;
                    s.push(e), i.push(t);
                    var L = (o ? zn : Rn)(e, t, n, a, r, s, i);
                    return s.pop(), i.pop(), L
                }

                function Ft(e, t, n) {
                    var a = t.length,
                        r = a,
                        s = !n;
                    if (null == e) return !r;
                    for (e = la(e); a--;) {
                        var i = t[a];
                        if (s && i[2] ? i[1] !== e[i[0]] : !(i[0] in e)) return !1
                    }
                    for (; ++a < r;) {
                        i = t[a];
                        var o = i[0],
                            _ = e[o],
                            d = i[1];
                        if (s && i[2]) {
                            if (_ === b && !(o in e)) return !1
                        } else {
                            var u = n ? n(_, d, o) : b;
                            if (!(u === b ? Et(d, _, n, !0) : u)) return !1
                        }
                    }
                    return !0
                }

                function zt(e, t) {
                    var n = -1,
                        a = qn(e) ? Rs(e.length) : [];
                    return Ei(e, function(e, r, s) {
                        a[++n] = t(e, r, s)
                    }), a
                }

                function Jt(e) {
                    var t = Un(e);
                    if (1 == t.length && t[0][2]) {
                        var n = t[0][0],
                            a = t[0][1];
                        return function(e) {
                            return null != e && (e[n] === a && (a !== b || n in la(e)))
                        }
                    }
                    return function(e) {
                        return Ft(e, t)
                    }
                }

                function Rt(e, t) {
                    var n = Ho(e),
                        a = ea(e) && aa(t),
                        r = e + "";
                    return e = ma(e),
                        function(s) {
                            if (null == s) return !1;
                            var i = r;
                            if (s = la(s), (n || !a) && !(i in s)) {
                                if (null == (s = 1 == e.length ? s : Wt(s, Zt(e, 0, -1)))) return !1;
                                i = Ta(e), s = la(s)
                            }
                            return s[i] === t ? t !== b || i in s : Et(t, s[i], b, !0)
                        }
                }

                function It(e, t, n, a, r) {
                    if (!Wr(e)) return e;
                    var s = qn(t) && (Ho(t) || Cr(t)),
                        i = s ? b : Ro(t);
                    return at(i || t, function(o, _) {
                        if (i && (_ = o, o = t[_]), Y(o)) a || (a = []), r || (r = []), Nt(e, t, _, It, n, a, r);
                        else {
                            var d = e[_],
                                u = n ? n(d, o, _, e, t) : b,
                                l = u === b;
                            l && (u = o), u === b && (!s || _ in e) || !l && (u === u ? u === d : d !== d) || (e[_] = u)
                        }
                    }), e
                }

                function Nt(e, t, n, a, r, s, i) {
                    for (var o = s.length, _ = t[n]; o--;)
                        if (s[o] == _) return void(e[n] = i[o]);
                    var d = e[n],
                        u = r ? r(d, _, n, e, t) : b,
                        l = u === b;
                    l && (u = _, qn(_) && (Ho(_) || Cr(_)) ? u = Ho(d) ? d : qn(d) ? nt(d) : [] : Rr(_) || wr(_) ? u = wr(d) ? Zr(d) : Rr(d) ? d : {} : l = !1), s.push(_), i.push(u), l ? e[n] = a(u, _, r, s, i) : (u === u ? u !== d : d === d) && (e[n] = u)
                }

                function Ct(e) {
                    return function(t) {
                        return null == t ? b : t[e]
                    }
                }

                function Ut(e) {
                    var t = e + "";
                    return e = ma(e),
                        function(n) {
                            return Wt(n, e, t)
                        }
                }

                function Gt(e, t) {
                    for (var n = e ? t.length : 0; n--;) {
                        var a = t[n];
                        if (a != r && Qn(a)) {
                            var r = a;
                            mi.call(e, a, 1)
                        }
                    }
                    return e
                }

                function Vt(e, t) {
                    return e + Li(wi() * (t - e + 1))
                }

                function $t(e, t, n, a, r) {
                    return r(e, function(e, r, s) {
                        n = a ? (a = !1, e) : t(n, e, r, s)
                    }), n
                }

                function Zt(e, t, n) {
                    var a = -1,
                        r = e.length;
                    t = null == t ? 0 : +t || 0, t < 0 && (t = -t > r ? 0 : r + t), n = n === b || n > r ? r : +n || 0, n < 0 && (n += r), r = t > n ? 0 : n - t >>> 0, t >>>= 0;
                    for (var s = Rs(r); ++a < r;) s[a] = e[a + t];
                    return s
                }

                function Bt(e, t) {
                    var n;
                    return Ei(e, function(e, a, r) {
                        return !(n = t(e, a, r))
                    }), !!n
                }

                function Kt(e, t) {
                    var n = e.length;
                    for (e.sort(t); n--;) e[n] = e[n].value;
                    return e
                }

                function qt(e, t, n) {
                    var a = In(),
                        r = -1;
                    return t = _t(t, function(e) {
                        return a(e)
                    }), Kt(zt(e, function(e) {
                        return {
                            criteria: _t(t, function(t) {
                                return t(e)
                            }),
                            index: ++r,
                            value: e
                        }
                    }), function(e, t) {
                        return c(e, t, n)
                    })
                }

                function Qt(e, t) {
                    var n = 0;
                    return Ei(e, function(e, a, r) {
                        n += +t(e, a, r) || 0
                    }), n
                }

                function Xt(e, t) {
                    var n = -1,
                        a = Cn(),
                        r = e.length,
                        s = a == o,
                        i = s && r >= N,
                        _ = i ? fn() : null,
                        d = [];
                    _ ? (a = qe, s = !1) : (i = !1, _ = t ? [] : d);
                    e: for (; ++n < r;) {
                        var u = e[n],
                            l = t ? t(u, n, e) : u;
                        if (s && u === u) {
                            for (var m = _.length; m--;)
                                if (_[m] === l) continue e;
                            t && _.push(l), d.push(u)
                        } else a(_, l, 0) < 0 && ((t || i) && _.push(l), d.push(u))
                    }
                    return d
                }

                function en(e, t) {
                    for (var n = -1, a = t.length, r = Rs(a); ++n < a;) r[n] = e[t[n]];
                    return r
                }

                function tn(e, t, n, a) {
                    for (var r = e.length, s = a ? r : -1;
                        (a ? s-- : ++s < r) && t(e[s], s, e););
                    return n ? Zt(e, a ? 0 : s, a ? s + 1 : r) : Zt(e, a ? s + 1 : 0, a ? r : s)
                }

                function nn(e, t) {
                    var n = e;
                    n instanceof r && (n = n.value());
                    for (var a = -1, s = t.length; ++a < s;) {
                        var i = t[a];
                        n = i.func.apply(i.thisArg, dt([n], i.args))
                    }
                    return n
                }

                function an(e, t, n) {
                    var a = 0,
                        r = e ? e.length : a;
                    if ("number" == typeof t && t === t && r <= ji) {
                        for (; a < r;) {
                            var s = a + r >>> 1,
                                i = e[s];
                            (n ? i <= t : i < t) && null !== i ? a = s + 1 : r = s
                        }
                        return r
                    }
                    return rn(e, t, bs, n)
                }

                function rn(e, t, n, a) {
                    t = n(t);
                    for (var r = 0, s = e ? e.length : 0, i = t !== t, o = null === t, _ = t === b; r < s;) {
                        var d = Li((r + s) / 2),
                            u = n(e[d]),
                            l = u !== b,
                            m = u === u;
                        if (i) var c = m || a;
                        else c = o ? m && l && (a || null != u) : _ ? m && (a || l) : null != u && (a ? u <= t : u < t);
                        c ? r = d + 1 : s = d
                    }
                    return Di(s, Hi)
                }

                function sn(e, t, n) {
                    if ("function" != typeof e) return bs;
                    if (t === b) return e;
                    switch (n) {
                        case 1:
                            return function(n) {
                                return e.call(t, n)
                            };
                        case 3:
                            return function(n, a, r) {
                                return e.call(t, n, a, r)
                            };
                        case 4:
                            return function(n, a, r, s) {
                                return e.call(t, n, a, r, s)
                            };
                        case 5:
                            return function(n, a, r, s, i) {
                                return e.call(t, n, a, r, s, i)
                            }
                    }
                    return function() {
                        return e.apply(t, arguments)
                    }
                }

                function on(e) {
                    var t = new si(e.byteLength);
                    return new ci(t).set(new ci(e)), t
                }

                function _n(e, t, n) {
                    for (var a = n.length, r = -1, s = ki(e.length - a, 0), i = -1, o = t.length, _ = Rs(o + s); ++i < o;) _[i] = t[i];
                    for (; ++r < a;) _[n[r]] = e[r];
                    for (; s--;) _[i++] = e[r++];
                    return _
                }

                function dn(e, t, n) {
                    for (var a = -1, r = n.length, s = -1, i = ki(e.length - r, 0), o = -1, _ = t.length, d = Rs(i + _); ++s < i;) d[s] = e[s];
                    for (var u = s; ++o < _;) d[u + o] = t[o];
                    for (; ++a < r;) d[u + n[a]] = e[s++];
                    return d
                }

                function un(e, t) {
                    return function(n, a, r) {
                        var s = t ? t() : {};
                        if (a = In(a, r, 3), Ho(n))
                            for (var i = -1, o = n.length; ++i < o;) {
                                var _ = n[i];
                                e(s, _, a(_, i, n), n)
                            } else Ei(n, function(t, n, r) {
                                e(s, t, a(t, n, r), r)
                            });
                        return s
                    }
                }

                function ln(e) {
                    return Lr(function(t, n) {
                        var a = -1,
                            r = null == t ? 0 : n.length,
                            s = r > 2 ? n[r - 2] : b,
                            i = r > 2 ? n[2] : b,
                            o = r > 1 ? n[r - 1] : b;
                        for ("function" == typeof s ? (s = sn(s, o, 5), r -= 2) : (s = "function" == typeof o ? o : b, r -= s ? 1 : 0), i && Xn(n[0], n[1], i) && (s = r < 3 ? b : s, r = 1); ++a < r;) {
                            var _ = n[a];
                            _ && e(t, _, s)
                        }
                        return t
                    })
                }

                function mn(e, t) {
                    return function(n, a) {
                        var r = n ? Ii(n) : 0;
                        if (!na(r)) return e(n, a);
                        for (var s = t ? r : -1, i = la(n);
                            (t ? s-- : ++s < r) && !1 !== a(i[s], s, i););
                        return n
                    }
                }

                function cn(e) {
                    return function(t, n, a) {
                        for (var r = la(t), s = a(t), i = s.length, o = e ? i : -1; e ? o-- : ++o < i;) {
                            var _ = s[o];
                            if (!1 === n(r[_], _, r)) break
                        }
                        return t
                    }
                }

                function hn(e, t) {
                    function n() {
                        return (this && this !== et && this instanceof n ? a : e).apply(t, arguments)
                    }
                    var a = Ln(e);
                    return n
                }

                function fn(e) {
                    return Mi && ui ? new Ke(e) : null
                }

                function Mn(e) {
                    return function(t) {
                        for (var n = -1, a = vs(us(t)), r = a.length, s = ""; ++n < r;) s = e(s, a[n], n);
                        return s
                    }
                }

                function Ln(e) {
                    return function() {
                        var t = arguments;
                        switch (t.length) {
                            case 0:
                                return new e;
                            case 1:
                                return new e(t[0]);
                            case 2:
                                return new e(t[0], t[1]);
                            case 3:
                                return new e(t[0], t[1], t[2]);
                            case 4:
                                return new e(t[0], t[1], t[2], t[3]);
                            case 5:
                                return new e(t[0], t[1], t[2], t[3], t[4]);
                            case 6:
                                return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                            case 7:
                                return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6])
                        }
                        var n = Wi(e.prototype),
                            a = e.apply(n, t);
                        return Wr(a) ? a : n
                    }
                }

                function yn(e) {
                    function t(n, a, r) {
                        r && Xn(n, a, r) && (a = b);
                        var s = Fn(n, e, b, b, b, b, b, a);
                        return s.placeholder = t.placeholder, s
                    }
                    return t
                }

                function Yn(e, t) {
                    return Lr(function(n) {
                        var a = n[0];
                        return null == a ? a : (n.push(t), e.apply(b, n))
                    })
                }

                function pn(e, t) {
                    return function(n, a, r) {
                        if (r && Xn(n, a, r) && (a = b), a = In(a, r, 3), 1 == a.length) {
                            n = Ho(n) ? n : ua(n);
                            var s = it(n, a, e, t);
                            if (!n.length || s !== t) return s
                        }
                        return wt(n, a, e, t)
                    }
                }

                function kn(e, t) {
                    return function(n, a, r) {
                        if (a = In(a, r, 3), Ho(n)) {
                            var s = i(n, a, t);
                            return s > -1 ? n[s] : b
                        }
                        return St(n, a, e)
                    }
                }

                function Dn(e) {
                    return function(t, n, a) {
                        return t && t.length ? (n = In(n, a, 3), i(t, n, e)) : -1
                    }
                }

                function gn(e) {
                    return function(t, n, a) {
                        return n = In(n, a, 3), St(t, n, e, !0)
                    }
                }

                function vn(e) {
                    return function() {
                        for (var t, n = arguments.length, r = e ? n : -1, s = 0, i = Rs(n); e ? r-- : ++r < n;) {
                            var o = i[s++] = arguments[r];
                            if ("function" != typeof o) throw new Bs(G);
                            !t && a.prototype.thru && "wrapper" == Nn(o) && (t = new a([], !0))
                        }
                        for (r = t ? -1 : n; ++r < n;) {
                            o = i[r];
                            var _ = Nn(o),
                                d = "wrapper" == _ ? Ri(o) : b;
                            t = d && ta(d[0]) && d[1] == (A | O | W | F) && !d[4].length && 1 == d[9] ? t[Nn(d[0])].apply(t, d[3]) : 1 == o.length && ta(o) ? t[_]() : t.thru(o)
                        }
                        return function() {
                            var e = arguments,
                                a = e[0];
                            if (t && 1 == e.length && Ho(a) && a.length >= N) return t.plant(a).value();
                            for (var r = 0, s = n ? i[r].apply(this, e) : a; ++r < n;) s = i[r].call(this, s);
                            return s
                        }
                    }
                }

                function wn(e, t) {
                    return function(n, a, r) {
                        return "function" == typeof a && r === b && Ho(n) ? e(n, a) : t(n, sn(a, r, 3))
                    }
                }

                function Tn(e) {
                    return function(t, n, a) {
                        return "function" == typeof n && a === b || (n = sn(n, a, 3)), e(t, n, es)
                    }
                }

                function bn(e) {
                    return function(t, n, a) {
                        return "function" == typeof n && a === b || (n = sn(n, a, 3)), e(t, n)
                    }
                }

                function Sn(e) {
                    return function(t, n, a) {
                        var r = {};
                        return n = In(n, a, 3), xt(t, function(t, a, s) {
                            var i = n(t, a, s);
                            a = e ? i : a, t = e ? t : i, r[a] = t
                        }), r
                    }
                }

                function Hn(e) {
                    return function(t, n, a) {
                        return t = d(t), (e ? t : "") + Pn(t, n, a) + (e ? "" : t)
                    }
                }

                function jn(e) {
                    var t = Lr(function(n, a) {
                        var r = k(a, t.placeholder);
                        return Fn(n, e, b, a, r)
                    });
                    return t
                }

                function xn(e, t) {
                    return function(n, a, r, s) {
                        var i = arguments.length < 3;
                        return "function" == typeof a && s === b && Ho(n) ? e(n, a, r, i) : $t(n, In(a, s, 4), r, i, t)
                    }
                }

                function On(e, t, n, a, r, s, i, o, _, d) {
                    function u() {
                        for (var y = arguments.length, Y = y, p = Rs(y); Y--;) p[Y] = arguments[Y];
                        if (a && (p = _n(p, a, r)), s && (p = dn(p, s, i)), h || M) {
                            var D = u.placeholder,
                                g = k(p, D);
                            if ((y -= g.length) < d) {
                                var v = o ? nt(o) : b,
                                    w = ki(d - y, 0),
                                    T = h ? g : b,
                                    S = h ? b : g,
                                    x = h ? p : b,
                                    O = h ? b : p;
                                t |= h ? W : E, t &= ~(h ? E : W), f || (t &= ~(H | j));
                                var P = [e, t, n, x, T, O, S, v, _, w],
                                    A = On.apply(b, P);
                                return ta(e) && Ni(A, P), A.placeholder = D, A
                            }
                        }
                        var F = m ? n : this,
                            z = c ? F[e] : e;
                        return o && (p = _a(p, o)), l && _ < p.length && (p.length = _), this && this !== et && this instanceof u && (z = L || Ln(e)), z.apply(F, p)
                    }
                    var l = t & A,
                        m = t & H,
                        c = t & j,
                        h = t & O,
                        f = t & x,
                        M = t & P,
                        L = c ? b : Ln(e);
                    return u
                }

                function Pn(e, t, n) {
                    var a = e.length;
                    if (t = +t, a >= t || !Yi(t)) return "";
                    var r = t - a;
                    return n = null == n ? " " : n + "", Ms(n, fi(r / n.length)).slice(0, r)
                }

                function Wn(e, t, n, a) {
                    function r() {
                        for (var t = -1, o = arguments.length, _ = -1, d = a.length, u = Rs(d + o); ++_ < d;) u[_] = a[_];
                        for (; o--;) u[_++] = arguments[++t];
                        return (this && this !== et && this instanceof r ? i : e).apply(s ? n : this, u)
                    }
                    var s = t & H,
                        i = Ln(e);
                    return r
                }

                function En(e) {
                    var t = Us[e];
                    return function(e, n) {
                        return n = n === b ? 0 : +n || 0, n ? (n = _i(10, n), t(e * n) / n) : t(e)
                    }
                }

                function An(e) {
                    return function(t, n, a, r) {
                        var s = In(a);
                        return null == a && s === pt ? an(t, n, e) : rn(t, n, s(a, r, 1), e)
                    }
                }

                function Fn(e, t, n, a, r, s, i, o) {
                    var _ = t & j;
                    if (!_ && "function" != typeof e) throw new Bs(G);
                    var d = a ? a.length : 0;
                    if (d || (t &= ~(W | E), a = r = b), d -= r ? r.length : 0, t & E) {
                        var u = a,
                            l = r;
                        a = r = b
                    }
                    var m = _ ? b : Ri(e),
                        c = [e, t, n, a, r, u, l, s, i, o];
                    if (m && (ra(c, m), t = c[1], o = c[9]), c[9] = null == o ? _ ? 0 : e.length : ki(o - d, 0) || 0, t == H) var h = hn(c[0], c[2]);
                    else h = t != W && t != (H | W) || c[4].length ? On.apply(b, c) : Wn.apply(b, c);
                    return (m ? Ji : Ni)(h, c)
                }

                function zn(e, t, n, a, r, s, i) {
                    var o = -1,
                        _ = e.length,
                        d = t.length;
                    if (_ != d && !(r && d > _)) return !1;
                    for (; ++o < _;) {
                        var u = e[o],
                            l = t[o],
                            m = a ? a(r ? l : u, r ? u : l, o) : b;
                        if (m !== b) {
                            if (m) continue;
                            return !1
                        }
                        if (r) {
                            if (!mt(t, function(e) {
                                    return u === e || n(u, e, a, r, s, i)
                                })) return !1
                        } else if (u !== l && !n(u, l, a, r, s, i)) return !1
                    }
                    return !0
                }

                function Jn(e, t, n) {
                    switch (n) {
                        case B:
                        case K:
                            return +e == +t;
                        case q:
                            return e.name == t.name && e.message == t.message;
                        case X:
                            return e != +e ? t != +t : e == +t;
                        case te:
                        case ne:
                            return e == t + ""
                    }
                    return !1
                }

                function Rn(e, t, n, a, r, s, i) {
                    var o = Ro(e),
                        _ = o.length;
                    if (_ != Ro(t).length && !r) return !1;
                    for (var d = _; d--;) {
                        var u = o[d];
                        if (!(r ? u in t : ei.call(t, u))) return !1
                    }
                    for (var l = r; ++d < _;) {
                        u = o[d];
                        var m = e[u],
                            c = t[u],
                            h = a ? a(r ? c : m, r ? m : c, u) : b;
                        if (!(h === b ? n(m, c, a, r, s, i) : h)) return !1;
                        l || (l = "constructor" == u)
                    }
                    if (!l) {
                        var f = e.constructor,
                            M = t.constructor;
                        if (f != M && "constructor" in e && "constructor" in t && !("function" == typeof f && f instanceof f && "function" == typeof M && M instanceof M)) return !1
                    }
                    return !0
                }

                function In(e, n, a) {
                    var r = t.callback || ws;
                    return r = r === ws ? pt : r, a ? r(e, n, a) : r
                }

                function Nn(e) {
                    for (var t = e.name, n = Pi[t], a = n ? n.length : 0; a--;) {
                        var r = n[a],
                            s = r.func;
                        if (null == s || s == e) return r.name
                    }
                    return t
                }

                function Cn(e, n, a) {
                    var r = t.indexOf || va;
                    return r = r === va ? o : r, e ? r(e, n, a) : r
                }

                function Un(e) {
                    for (var t = ts(e), n = t.length; n--;) t[n][2] = aa(t[n][1]);
                    return t
                }

                function Gn(e, t) {
                    var n = null == e ? b : e[t];
                    return Fr(n) ? n : b
                }

                function Vn(e, t, n) {
                    for (var a = -1, r = n.length; ++a < r;) {
                        var s = n[a],
                            i = s.size;
                        switch (s.type) {
                            case "drop":
                                e += i;
                                break;
                            case "dropRight":
                                t -= i;
                                break;
                            case "take":
                                t = Di(t, e + i);
                                break;
                            case "takeRight":
                                e = ki(e, t - i)
                        }
                    }
                    return {
                        start: e,
                        end: t
                    }
                }

                function $n(e) {
                    var t = e.length,
                        n = new e.constructor(t);
                    return t && "string" == typeof e[0] && ei.call(e, "index") && (n.index = e.index, n.input = e.input), n
                }

                function Zn(e) {
                    var t = e.constructor;
                    return "function" == typeof t && t instanceof t || (t = Vs), new t
                }

                function Bn(e, t, n) {
                    var a = e.constructor;
                    switch (t) {
                        case ae:
                            return on(e);
                        case B:
                        case K:
                            return new a(+e);
                        case re:
                        case se:
                        case ie:
                        case oe:
                        case _e:
                        case de:
                        case ue:
                        case le:
                        case me:
                            var r = e.buffer;
                            return new a(n ? on(r) : r, e.byteOffset, e.length);
                        case X:
                        case ne:
                            return new a(e);
                        case te:
                            var s = new a(e.source, xe.exec(e));
                            s.lastIndex = e.lastIndex
                    }
                    return s
                }

                function Kn(e, t, n) {
                    null == e || ea(t, e) || (t = ma(t), e = 1 == t.length ? e : Wt(e, Zt(t, 0, -1)), t = Ta(t));
                    var a = null == e ? e : e[t];
                    return null == a ? b : a.apply(e, n)
                }

                function qn(e) {
                    return null != e && na(Ii(e))
                }

                function Qn(e, t) {
                    return e = "number" == typeof e || We.test(e) ? +e : -1, t = null == t ? xi : t, e > -1 && e % 1 == 0 && e < t
                }

                function Xn(e, t, n) {
                    if (!Wr(n)) return !1;
                    var a = typeof t;
                    if ("number" == a ? qn(n) && Qn(t, n.length) : "string" == a && t in n) {
                        var r = n[t];
                        return e === e ? e === r : r !== r
                    }
                    return !1
                }

                function ea(e, t) {
                    var n = typeof e;
                    return !!("string" == n && ve.test(e) || "number" == n) || !Ho(e) && (!ge.test(e) || null != t && e in la(t))
                }

                function ta(e) {
                    var n = Nn(e);
                    if (!(n in r.prototype)) return !1;
                    var a = t[n];
                    if (e === a) return !0;
                    var s = Ri(a);
                    return !!s && e === s[0]
                }

                function na(e) {
                    return "number" == typeof e && e > -1 && e % 1 == 0 && e <= xi
                }

                function aa(e) {
                    return e === e && !Wr(e)
                }

                function ra(e, t) {
                    var n = e[1],
                        a = t[1],
                        r = n | a,
                        s = r < A,
                        i = a == A && n == O || a == A && n == F && e[7].length <= t[8] || a == (A | F) && n == O;
                    if (!s && !i) return e;
                    a & H && (e[2] = t[2], r |= n & H ? 0 : x);
                    var o = t[3];
                    if (o) {
                        var _ = e[3];
                        e[3] = _ ? _n(_, o, t[4]) : nt(o), e[4] = _ ? k(e[3], V) : nt(t[4])
                    }
                    return o = t[5], o && (_ = e[5], e[5] = _ ? dn(_, o, t[6]) : nt(o), e[6] = _ ? k(e[5], V) : nt(t[6])), o = t[7], o && (e[7] = nt(o)), a & A && (e[8] = null == e[8] ? t[8] : Di(e[8], t[8])), null == e[9] && (e[9] = t[9]), e[0] = t[0], e[1] = r, e
                }

                function sa(e, t) {
                    return e === b ? t : jo(e, t, sa)
                }

                function ia(e, t) {
                    e = la(e);
                    for (var n = -1, a = t.length, r = {}; ++n < a;) {
                        var s = t[n];
                        s in e && (r[s] = e[s])
                    }
                    return r
                }

                function oa(e, t) {
                    var n = {};
                    return jt(e, function(e, a, r) {
                        t(e, a, r) && (n[a] = e)
                    }), n
                }

                function _a(e, t) {
                    for (var n = e.length, a = Di(t.length, n), r = nt(e); a--;) {
                        var s = t[a];
                        e[a] = Qn(s, n) ? r[s] : b
                    }
                    return e
                }

                function da(e) {
                    for (var t = es(e), n = t.length, a = n && e.length, r = !!a && na(a) && (Ho(e) || wr(e)), s = -1, i = []; ++s < n;) {
                        var o = t[s];
                        (r && Qn(o, a) || ei.call(e, o)) && i.push(o)
                    }
                    return i
                }

                function ua(e) {
                    return null == e ? [] : qn(e) ? Wr(e) ? e : Vs(e) : ss(e)
                }

                function la(e) {
                    return Wr(e) ? e : Vs(e)
                }

                function ma(e) {
                    if (Ho(e)) return e;
                    var t = [];
                    return d(e).replace(we, function(e, n, a, r) {
                        t.push(a ? r.replace(He, "$1") : n || e)
                    }), t
                }

                function ca(e) {
                    return e instanceof r ? e.clone() : new a(e.__wrapped__, e.__chain__, nt(e.__actions__))
                }

                function ha(e, t, n) {
                    t = (n ? Xn(e, t, n) : null == t) ? 1 : ki(Li(t) || 1, 1);
                    for (var a = 0, r = e ? e.length : 0, s = -1, i = Rs(fi(r / t)); a < r;) i[++s] = Zt(e, a, a += t);
                    return i
                }

                function fa(e) {
                    for (var t = -1, n = e ? e.length : 0, a = -1, r = []; ++t < n;) {
                        var s = e[t];
                        s && (r[++a] = s)
                    }
                    return r
                }

                function Ma(e, t, n) {
                    return (e ? e.length : 0) ? ((n ? Xn(e, t, n) : null == t) && (t = 1), Zt(e, t < 0 ? 0 : t)) : []
                }

                function La(e, t, n) {
                    var a = e ? e.length : 0;
                    return a ? ((n ? Xn(e, t, n) : null == t) && (t = 1), t = a - (+t || 0), Zt(e, 0, t < 0 ? 0 : t)) : []
                }

                function ya(e, t, n) {
                    return e && e.length ? tn(e, In(t, n, 3), !0, !0) : []
                }

                function Ya(e, t, n) {
                    return e && e.length ? tn(e, In(t, n, 3), !0) : []
                }

                function pa(e, t, n, a) {
                    var r = e ? e.length : 0;
                    return r ? (n && "number" != typeof n && Xn(e, t, n) && (n = 0, a = r), Tt(e, t, n, a)) : []
                }

                function ka(e) {
                    return e ? e[0] : b
                }

                function Da(e, t, n) {
                    var a = e ? e.length : 0;
                    return n && Xn(e, t, n) && (t = !1), a ? Ht(e, t) : []
                }

                function ga(e) {
                    return (e ? e.length : 0) ? Ht(e, !0) : []
                }

                function va(e, t, n) {
                    var a = e ? e.length : 0;
                    if (!a) return -1;
                    if ("number" == typeof n) n = n < 0 ? ki(a + n, 0) : n;
                    else if (n) {
                        var r = an(e, t);
                        return r < a && (t === t ? t === e[r] : e[r] !== e[r]) ? r : -1
                    }
                    return o(e, t, n || 0)
                }

                function wa(e) {
                    return La(e, 1)
                }

                function Ta(e) {
                    var t = e ? e.length : 0;
                    return t ? e[t - 1] : b
                }

                function ba(e, t, n) {
                    var a = e ? e.length : 0;
                    if (!a) return -1;
                    var r = a;
                    if ("number" == typeof n) r = (n < 0 ? ki(a + n, 0) : Di(n || 0, a - 1)) + 1;
                    else if (n) {
                        r = an(e, t, !0) - 1;
                        var s = e[r];
                        return (t === t ? t === s : s !== s) ? r : -1
                    }
                    if (t !== t) return y(e, r, !0);
                    for (; r--;)
                        if (e[r] === t) return r;
                    return -1
                }

                function Sa() {
                    var e = arguments,
                        t = e[0];
                    if (!t || !t.length) return t;
                    for (var n = 0, a = Cn(), r = e.length; ++n < r;)
                        for (var s = 0, i = e[n];
                            (s = a(t, i, s)) > -1;) mi.call(t, s, 1);
                    return t
                }

                function Ha(e, t, n) {
                    var a = [];
                    if (!e || !e.length) return a;
                    var r = -1,
                        s = [],
                        i = e.length;
                    for (t = In(t, n, 3); ++r < i;) {
                        var o = e[r];
                        t(o, r, e) && (a.push(o), s.push(r))
                    }
                    return Gt(e, s), a
                }

                function ja(e) {
                    return Ma(e, 1)
                }

                function xa(e, t, n) {
                    var a = e ? e.length : 0;
                    return a ? (n && "number" != typeof n && Xn(e, t, n) && (t = 0, n = a), Zt(e, t, n)) : []
                }

                function Oa(e, t, n) {
                    return (e ? e.length : 0) ? ((n ? Xn(e, t, n) : null == t) && (t = 1), Zt(e, 0, t < 0 ? 0 : t)) : []
                }

                function Pa(e, t, n) {
                    var a = e ? e.length : 0;
                    return a ? ((n ? Xn(e, t, n) : null == t) && (t = 1), t = a - (+t || 0), Zt(e, t < 0 ? 0 : t)) : []
                }

                function Wa(e, t, n) {
                    return e && e.length ? tn(e, In(t, n, 3), !1, !0) : []
                }

                function Ea(e, t, n) {
                    return e && e.length ? tn(e, In(t, n, 3)) : []
                }

                function Aa(e, t, n, a) {
                    if (!(e ? e.length : 0)) return [];
                    null != t && "boolean" != typeof t && (a = n, n = Xn(e, t, a) ? b : t, t = !1);
                    var r = In();
                    return null == n && r === pt || (n = r(n, a, 3)), t && Cn() == o ? D(e, n) : Xt(e, n)
                }

                function Fa(e) {
                    if (!e || !e.length) return [];
                    var t = -1,
                        n = 0;
                    e = ot(e, function(e) {
                        if (qn(e)) return n = ki(e.length, n), !0
                    });
                    for (var a = Rs(n); ++t < n;) a[t] = _t(e, Ct(t));
                    return a
                }

                function za(e, t, n) {
                    if (!(e ? e.length : 0)) return [];
                    var a = Fa(e);
                    return null == t ? a : (t = sn(t, n, 4), _t(a, function(e) {
                        return ut(e, t, b, !0)
                    }))
                }

                function Ja() {
                    for (var e = -1, t = arguments.length; ++e < t;) {
                        var n = arguments[e];
                        if (qn(n)) var a = a ? dt(gt(a, n), gt(n, a)) : n
                    }
                    return a ? Xt(a) : []
                }

                function Ra(e, t) {
                    var n = -1,
                        a = e ? e.length : 0,
                        r = {};
                    for (!a || t || Ho(e[0]) || (t = []); ++n < a;) {
                        var s = e[n];
                        t ? r[s] = t[n] : s && (r[s[0]] = s[1])
                    }
                    return r
                }

                function Ia(e) {
                    var n = t(e);
                    return n.__chain__ = !0, n
                }

                function Na(e, t, n) {
                    return t.call(n, e), e
                }

                function Ca(e, t, n) {
                    return t.call(n, e)
                }

                function Ua() {
                    return Ia(this)
                }

                function Ga() {
                    return new a(this.value(), this.__chain__)
                }

                function Va(e) {
                    for (var t, a = this; a instanceof n;) {
                        var r = ca(a);
                        t ? s.__wrapped__ = r : t = r;
                        var s = r;
                        a = a.__wrapped__
                    }
                    return s.__wrapped__ = e, t
                }

                function $a() {
                    var e = this.__wrapped__,
                        t = function(e) {
                            return n && n.__dir__ < 0 ? e : e.reverse()
                        };
                    if (e instanceof r) {
                        var n = e;
                        return this.__actions__.length && (n = new r(this)), n = n.reverse(), n.__actions__.push({
                            func: Ca,
                            args: [t],
                            thisArg: b
                        }), new a(n, this.__chain__)
                    }
                    return this.thru(t)
                }

                function Za() {
                    return this.value() + ""
                }

                function Ba() {
                    return nn(this.__wrapped__, this.__actions__)
                }

                function Ka(e, t, n) {
                    var a = Ho(e) ? st : vt;
                    return n && Xn(e, t, n) && (t = b), "function" == typeof t && n === b || (t = In(t, n, 3)), a(e, t)
                }

                function qa(e, t, n) {
                    var a = Ho(e) ? ot : bt;
                    return t = In(t, n, 3), a(e, t)
                }

                function Qa(e, t) {
                    return ao(e, Jt(t))
                }

                function Xa(e, t, n, a) {
                    var r = e ? Ii(e) : 0;
                    return na(r) || (e = ss(e), r = e.length), n = "number" != typeof n || a && Xn(t, n, a) ? 0 : n < 0 ? ki(r + n, 0) : n || 0, "string" == typeof e || !Ho(e) && Nr(e) ? n <= r && e.indexOf(t, n) > -1 : !!r && Cn(e, t, n) > -1
                }

                function er(e, t, n) {
                    var a = Ho(e) ? _t : zt;
                    return t = In(t, n, 3), a(e, t)
                }

                function tr(e, t) {
                    return er(e, Ps(t))
                }

                function nr(e, t, n) {
                    var a = Ho(e) ? ot : bt;
                    return t = In(t, n, 3), a(e, function(e, n, a) {
                        return !t(e, n, a)
                    })
                }

                function ar(e, t, n) {
                    if (n ? Xn(e, t, n) : null == t) {
                        e = ua(e);
                        var a = e.length;
                        return a > 0 ? e[Vt(0, a - 1)] : b
                    }
                    var r = -1,
                        s = $r(e),
                        a = s.length,
                        i = a - 1;
                    for (t = Di(t < 0 ? 0 : +t || 0, a); ++r < t;) {
                        var o = Vt(r, i),
                            _ = s[o];
                        s[o] = s[r], s[r] = _
                    }
                    return s.length = t, s
                }

                function rr(e) {
                    return ar(e, bi)
                }

                function sr(e) {
                    var t = e ? Ii(e) : 0;
                    return na(t) ? t : Ro(e).length
                }

                function ir(e, t, n) {
                    var a = Ho(e) ? mt : Bt;
                    return n && Xn(e, t, n) && (t = b), "function" == typeof t && n === b || (t = In(t, n, 3)), a(e, t)
                }

                function or(e, t, n) {
                    if (null == e) return [];
                    n && Xn(e, t, n) && (t = b);
                    var a = -1;
                    return t = In(t, n, 3), Kt(zt(e, function(e, n, r) {
                        return {
                            criteria: t(e, n, r),
                            index: ++a,
                            value: e
                        }
                    }), m)
                }

                function _r(e, t, n, a) {
                    return null == e ? [] : (a && Xn(t, n, a) && (n = b), Ho(t) || (t = null == t ? [] : [t]), Ho(n) || (n = null == n ? [] : [n]), qt(e, t, n))
                }

                function dr(e, t) {
                    return qa(e, Jt(t))
                }

                function ur(e, t) {
                    if ("function" != typeof t) {
                        if ("function" != typeof e) throw new Bs(G);
                        var n = e;
                        e = t, t = n
                    }
                    return e = Yi(e = +e) ? e : 0,
                        function() {
                            if (--e < 1) return t.apply(this, arguments)
                        }
                }

                function lr(e, t, n) {
                    return n && Xn(e, t, n) && (t = b), t = e && null == t ? e.length : ki(+t || 0, 0), Fn(e, A, b, b, b, b, t)
                }

                function mr(e, t) {
                    var n;
                    if ("function" != typeof t) {
                        if ("function" != typeof e) throw new Bs(G);
                        var a = e;
                        e = t, t = a
                    }
                    return function() {
                        return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = b), n
                    }
                }

                function cr(e, t, n) {
                    function a() {
                        c && ii(c), d && ii(d), f = 0, d = c = h = b
                    }

                    function r(t, n) {
                        n && ii(n), d = c = h = b, t && (f = fo(), u = e.apply(m, _), c || d || (_ = m = b))
                    }

                    function s() {
                        var e = t - (fo() - l);
                        e <= 0 || e > t ? r(h, d) : c = li(s, e)
                    }

                    function i() {
                        r(L, c)
                    }

                    function o() {
                        if (_ = arguments, l = fo(), m = this, h = L && (c || !y), !1 === M) var n = y && !c;
                        else {
                            d || y || (f = l);
                            var a = M - (l - f),
                                r = a <= 0 || a > M;
                            r ? (d && (d = ii(d)), f = l, u = e.apply(m, _)) : d || (d = li(i, a))
                        }
                        return r && c ? c = ii(c) : c || t === M || (c = li(s, t)), n && (r = !0, u = e.apply(m, _)), !r || c || d || (_ = m = b), u
                    }
                    var _, d, u, l, m, c, h, f = 0,
                        M = !1,
                        L = !0;
                    if ("function" != typeof e) throw new Bs(G);
                    if (t = t < 0 ? 0 : +t || 0, !0 === n) {
                        var y = !0;
                        L = !1
                    } else Wr(n) && (y = !!n.leading, M = "maxWait" in n && ki(+n.maxWait || 0, t), L = "trailing" in n ? !!n.trailing : L);
                    return o.cancel = a, o
                }

                function hr(e, t) {
                    if ("function" != typeof e || t && "function" != typeof t) throw new Bs(G);
                    var n = function() {
                        var a = arguments,
                            r = t ? t.apply(this, a) : a[0],
                            s = n.cache;
                        if (s.has(r)) return s.get(r);
                        var i = e.apply(this, a);
                        return n.cache = s.set(r, i), i
                    };
                    return n.cache = new hr.Cache, n
                }

                function fr(e) {
                    if ("function" != typeof e) throw new Bs(G);
                    return function() {
                        return !e.apply(this, arguments)
                    }
                }

                function Mr(e) {
                    return mr(2, e)
                }

                function Lr(e, t) {
                    if ("function" != typeof e) throw new Bs(G);
                    return t = ki(t === b ? e.length - 1 : +t || 0, 0),
                        function() {
                            for (var n = arguments, a = -1, r = ki(n.length - t, 0), s = Rs(r); ++a < r;) s[a] = n[t + a];
                            switch (t) {
                                case 0:
                                    return e.call(this, s);
                                case 1:
                                    return e.call(this, n[0], s);
                                case 2:
                                    return e.call(this, n[0], n[1], s)
                            }
                            var i = Rs(t + 1);
                            for (a = -1; ++a < t;) i[a] = n[a];
                            return i[t] = s, e.apply(this, i)
                        }
                }

                function yr(e) {
                    if ("function" != typeof e) throw new Bs(G);
                    return function(t) {
                        return e.apply(this, t)
                    }
                }

                function Yr(e, t, n) {
                    var a = !0,
                        r = !0;
                    if ("function" != typeof e) throw new Bs(G);
                    return !1 === n ? a = !1 : Wr(n) && (a = "leading" in n ? !!n.leading : a, r = "trailing" in n ? !!n.trailing : r), cr(e, t, {
                        leading: a,
                        maxWait: +t,
                        trailing: r
                    })
                }

                function pr(e, t) {
                    return t = null == t ? bs : t, Fn(t, W, b, [e], [])
                }

                function kr(e, t, n, a) {
                    return t && "boolean" != typeof t && Xn(e, t, n) ? t = !1 : "function" == typeof t && (a = n, n = t, t = !1), "function" == typeof n ? kt(e, t, sn(n, a, 1)) : kt(e, t)
                }

                function Dr(e, t, n) {
                    return "function" == typeof t ? kt(e, !0, sn(t, n, 1)) : kt(e, !0)
                }

                function gr(e, t) {
                    return e > t
                }

                function vr(e, t) {
                    return e >= t
                }

                function wr(e) {
                    return Y(e) && qn(e) && ei.call(e, "callee") && !di.call(e, "callee")
                }

                function Tr(e) {
                    return !0 === e || !1 === e || Y(e) && ni.call(e) == B
                }

                function br(e) {
                    return Y(e) && ni.call(e) == K
                }

                function Sr(e) {
                    return !!e && 1 === e.nodeType && Y(e) && !Rr(e)
                }

                function Hr(e) {
                    return null == e || (qn(e) && (Ho(e) || Nr(e) || wr(e) || Y(e) && Pr(e.splice)) ? !e.length : !Ro(e).length)
                }

                function jr(e, t, n, a) {
                    n = "function" == typeof n ? sn(n, a, 3) : b;
                    var r = n ? n(e, t) : b;
                    return r === b ? Et(e, t, n) : !!r
                }

                function xr(e) {
                    return Y(e) && "string" == typeof e.message && ni.call(e) == q
                }

                function Or(e) {
                    return "number" == typeof e && Yi(e)
                }

                function Pr(e) {
                    return Wr(e) && ni.call(e) == Q
                }

                function Wr(e) {
                    var t = typeof e;
                    return !!e && ("object" == t || "function" == t)
                }

                function Er(e, t, n, a) {
                    return n = "function" == typeof n ? sn(n, a, 3) : b, Ft(e, Un(t), n)
                }

                function Ar(e) {
                    return Jr(e) && e != +e
                }

                function Fr(e) {
                    return null != e && (Pr(e) ? ri.test(Xs.call(e)) : Y(e) && Pe.test(e))
                }

                function zr(e) {
                    return null === e
                }

                function Jr(e) {
                    return "number" == typeof e || Y(e) && ni.call(e) == X
                }

                function Rr(e) {
                    var t;
                    if (!Y(e) || ni.call(e) != ee || wr(e) || !ei.call(e, "constructor") && "function" == typeof(t = e.constructor) && !(t instanceof t)) return !1;
                    var n;
                    return jt(e, function(e, t) {
                        n = t
                    }), n === b || ei.call(e, n)
                }

                function Ir(e) {
                    return Wr(e) && ni.call(e) == te
                }

                function Nr(e) {
                    return "string" == typeof e || Y(e) && ni.call(e) == ne
                }

                function Cr(e) {
                    return Y(e) && na(e.length) && !!Ie[ni.call(e)]
                }

                function Ur(e) {
                    return e === b
                }

                function Gr(e, t) {
                    return e < t
                }

                function Vr(e, t) {
                    return e <= t
                }

                function $r(e) {
                    var t = e ? Ii(e) : 0;
                    return na(t) ? t ? nt(e) : [] : ss(e)
                }

                function Zr(e) {
                    return Yt(e, es(e))
                }

                function Br(e, t, n) {
                    var a = Wi(e);
                    return n && Xn(e, t, n) && (t = b), t ? Lt(a, t) : a
                }

                function Kr(e) {
                    return Pt(e, es(e))
                }

                function qr(e, t, n) {
                    var a = null == e ? b : Wt(e, ma(t), t + "");
                    return a === b ? n : a
                }

                function Qr(e, t) {
                    if (null == e) return !1;
                    var n = ei.call(e, t);
                    if (!n && !ea(t)) {
                        if (t = ma(t), null == (e = 1 == t.length ? e : Wt(e, Zt(t, 0, -1)))) return !1;
                        t = Ta(t), n = ei.call(e, t)
                    }
                    return n || na(e.length) && Qn(t, e.length) && (Ho(e) || wr(e))
                }

                function Xr(e, t, n) {
                    n && Xn(e, t, n) && (t = b);
                    for (var a = -1, r = Ro(e), s = r.length, i = {}; ++a < s;) {
                        var o = r[a],
                            _ = e[o];
                        t ? ei.call(i, _) ? i[_].push(o) : i[_] = [o] : i[_] = o
                    }
                    return i
                }

                function es(e) {
                    if (null == e) return [];
                    Wr(e) || (e = Vs(e));
                    var t = e.length;
                    t = t && na(t) && (Ho(e) || wr(e)) && t || 0;
                    for (var n = e.constructor, a = -1, r = "function" == typeof n && n.prototype === e, s = Rs(t), i = t > 0; ++a < t;) s[a] = a + "";
                    for (var o in e) i && Qn(o, t) || "constructor" == o && (r || !ei.call(e, o)) || s.push(o);
                    return s
                }

                function ts(e) {
                    e = la(e);
                    for (var t = -1, n = Ro(e), a = n.length, r = Rs(a); ++t < a;) {
                        var s = n[t];
                        r[t] = [s, e[s]]
                    }
                    return r
                }

                function ns(e, t, n) {
                    var a = null == e ? b : e[t];
                    return a === b && (null == e || ea(t, e) || (t = ma(t), e = 1 == t.length ? e : Wt(e, Zt(t, 0, -1)), a = null == e ? b : e[Ta(t)]), a = a === b ? n : a), Pr(a) ? a.call(e) : a
                }

                function as(e, t, n) {
                    if (null == e) return e;
                    var a = t + "";
                    t = null != e[a] || ea(t, e) ? [a] : ma(t);
                    for (var r = -1, s = t.length, i = s - 1, o = e; null != o && ++r < s;) {
                        var _ = t[r];
                        Wr(o) && (r == i ? o[_] = n : null == o[_] && (o[_] = Qn(t[r + 1]) ? [] : {})), o = o[_]
                    }
                    return e
                }

                function rs(e, t, n, a) {
                    var r = Ho(e) || Cr(e);
                    if (t = In(t, a, 4), null == n)
                        if (r || Wr(e)) {
                            var s = e.constructor;
                            n = r ? Ho(e) ? new s : [] : Wi(Pr(s) ? s.prototype : b)
                        } else n = {};
                    return (r ? at : xt)(e, function(e, a, r) {
                        return t(n, e, a, r)
                    }), n
                }

                function ss(e) {
                    return en(e, Ro(e))
                }

                function is(e) {
                    return en(e, es(e))
                }

                function os(e, t, n) {
                    return t = +t || 0, n === b ? (n = t, t = 0) : n = +n || 0, e >= Di(t, n) && e < ki(t, n)
                }

                function _s(e, t, n) {
                    n && Xn(e, t, n) && (t = n = b);
                    var a = null == e,
                        r = null == t;
                    if (null == n && (r && "boolean" == typeof e ? (n = e, e = 1) : "boolean" == typeof t && (n = t, r = !0)), a && r && (t = 1, r = !1), e = +e || 0, r ? (t = e, e = 0) : t = +t || 0, n || e % 1 || t % 1) {
                        var s = wi();
                        return Di(e + s * (t - e + oi("1e-" + ((s + "").length - 1))), t)
                    }
                    return Vt(e, t)
                }

                function ds(e) {
                    return (e = d(e)) && e.charAt(0).toUpperCase() + e.slice(1)
                }

                function us(e) {
                    return (e = d(e)) && e.replace(Ee, h).replace(Se, "")
                }

                function ls(e, t, n) {
                    e = d(e), t += "";
                    var a = e.length;
                    return n = n === b ? a : Di(n < 0 ? 0 : +n || 0, a), (n -= t.length) >= 0 && e.indexOf(t, n) == n
                }

                function ms(e) {
                    return e = d(e), e && Ye.test(e) ? e.replace(Le, f) : e
                }

                function cs(e) {
                    return e = d(e), e && be.test(e) ? e.replace(Te, M) : e || "(?:)"
                }

                function hs(e, t, n) {
                    e = d(e), t = +t;
                    var a = e.length;
                    if (a >= t || !Yi(t)) return e;
                    var r = (t - a) / 2,
                        s = Li(r);
                    return n = Pn("", fi(r), n), n.slice(0, s) + e + n
                }

                function fs(e, t, n) {
                    return (n ? Xn(e, t, n) : null == t) ? t = 0 : t && (t = +t), e = Ys(e), vi(e, t || (Oe.test(e) ? 16 : 10))
                }

                function Ms(e, t) {
                    var n = "";
                    if (e = d(e), (t = +t) < 1 || !e || !Yi(t)) return n;
                    do {
                        t % 2 && (n += e), t = Li(t / 2), e += e
                    } while (t);
                    return n
                }

                function Ls(e, t, n) {
                    return e = d(e), n = null == n ? 0 : Di(n < 0 ? 0 : +n || 0, e.length), e.lastIndexOf(t, n) == n
                }

                function ys(e, n, a) {
                    var r = t.templateSettings;
                    a && Xn(e, n, a) && (n = a = b), e = d(e), n = Mt(Lt({}, a || n), r, ft);
                    var s, i, o = Mt(Lt({}, n.imports), r.imports, ft),
                        _ = Ro(o),
                        u = en(o, _),
                        l = 0,
                        m = n.interpolate || Ae,
                        c = "__p += '",
                        h = $s((n.escape || Ae).source + "|" + m.source + "|" + (m === De ? je : Ae).source + "|" + (n.evaluate || Ae).source + "|$", "g"),
                        f = "//# sourceURL=" + ("sourceURL" in n ? n.sourceURL : "lodash.templateSources[" + ++Re + "]") + "\n";
                    e.replace(h, function(t, n, a, r, o, _) {
                        return a || (a = r), c += e.slice(l, _).replace(Fe, L), n && (s = !0, c += "' +\n__e(" + n + ") +\n'"), o && (i = !0, c += "';\n" + o + ";\n__p += '"), a && (c += "' +\n((__t = (" + a + ")) == null ? '' : __t) +\n'"), l = _ + t.length, t
                    }), c += "';\n";
                    var M = n.variable;
                    M || (c = "with (obj) {\n" + c + "\n}\n"), c = (i ? c.replace(ce, "") : c).replace(he, "$1").replace(fe, "$1;"), c = "function(" + (M || "obj") + ") {\n" + (M ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (s ? ", __e = _.escape" : "") + (i ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + c + "return __p\n}";
                    var y = qo(function() {
                        return Cs(_, f + "return " + c).apply(b, u)
                    });
                    if (y.source = c, xr(y)) throw y;
                    return y
                }

                function Ys(e, t, n) {
                    var a = e;
                    return (e = d(e)) ? (n ? Xn(a, t, n) : null == t) ? e.slice(g(e), v(e) + 1) : (t += "", e.slice(u(e, t), l(e, t) + 1)) : e
                }

                function ps(e, t, n) {
                    var a = e;
                    return e = d(e), e ? (n ? Xn(a, t, n) : null == t) ? e.slice(g(e)) : e.slice(u(e, t + "")) : e
                }

                function ks(e, t, n) {
                    var a = e;
                    return e = d(e), e ? (n ? Xn(a, t, n) : null == t) ? e.slice(0, v(e) + 1) : e.slice(0, l(e, t + "") + 1) : e
                }

                function Ds(e, t, n) {
                    n && Xn(e, t, n) && (t = b);
                    var a = z,
                        r = J;
                    if (null != t)
                        if (Wr(t)) {
                            var s = "separator" in t ? t.separator : s;
                            a = "length" in t ? +t.length || 0 : a, r = "omission" in t ? d(t.omission) : r
                        } else a = +t || 0;
                    if (e = d(e), a >= e.length) return e;
                    var i = a - r.length;
                    if (i < 1) return r;
                    var o = e.slice(0, i);
                    if (null == s) return o + r;
                    if (Ir(s)) {
                        if (e.slice(i).search(s)) {
                            var _, u, l = e.slice(0, i);
                            for (s.global || (s = $s(s.source, (xe.exec(s) || "") + "g")), s.lastIndex = 0; _ = s.exec(l);) u = _.index;
                            o = o.slice(0, null == u ? i : u)
                        }
                    } else if (e.indexOf(s, i) != i) {
                        var m = o.lastIndexOf(s);
                        m > -1 && (o = o.slice(0, m))
                    }
                    return o + r
                }

                function gs(e) {
                    return e = d(e), e && ye.test(e) ? e.replace(Me, w) : e
                }

                function vs(e, t, n) {
                    return n && Xn(e, t, n) && (t = b), e = d(e), e.match(t || ze) || []
                }

                function ws(e, t, n) {
                    return n && Xn(e, t, n) && (t = b), Y(e) ? Ss(e) : pt(e, t)
                }

                function Ts(e) {
                    return function() {
                        return e
                    }
                }

                function bs(e) {
                    return e
                }

                function Ss(e) {
                    return Jt(kt(e, !0))
                }

                function Hs(e, t) {
                    return Rt(e, kt(t, !0))
                }

                function js(e, t, n) {
                    if (null == n) {
                        var a = Wr(t),
                            r = a ? Ro(t) : b,
                            s = r && r.length ? Pt(t, r) : b;
                        (s ? s.length : a) || (s = !1, n = t, t = e, e = this)
                    }
                    s || (s = Pt(t, Ro(t)));
                    var i = !0,
                        o = -1,
                        _ = Pr(e),
                        d = s.length;
                    !1 === n ? i = !1 : Wr(n) && "chain" in n && (i = n.chain);
                    for (; ++o < d;) {
                        var u = s[o],
                            l = t[u];
                        e[u] = l, _ && (e.prototype[u] = function(t) {
                            return function() {
                                var n = this.__chain__;
                                if (i || n) {
                                    var a = e(this.__wrapped__);
                                    return (a.__actions__ = nt(this.__actions__)).push({
                                        func: t,
                                        args: arguments,
                                        thisArg: e
                                    }), a.__chain__ = n, a
                                }
                                return t.apply(e, dt([this.value()], arguments))
                            }
                        }(l))
                    }
                    return e
                }

                function xs() {
                    return et._ = ai, this
                }

                function Os() {}

                function Ps(e) {
                    return ea(e) ? Ct(e) : Ut(e)
                }

                function Ws(e) {
                    return function(t) {
                        return Wt(e, ma(t), t + "")
                    }
                }

                function Es(e, t, n) {
                    n && Xn(e, t, n) && (t = n = b), e = +e || 0, n = null == n ? 1 : +n || 0, null == t ? (t = e, e = 0) : t = +t || 0;
                    for (var a = -1, r = ki(fi((t - e) / (n || 1)), 0), s = Rs(r); ++a < r;) s[a] = e, e += n;
                    return s
                }

                function As(e, t, n) {
                    if ((e = Li(e)) < 1 || !Yi(e)) return [];
                    var a = -1,
                        r = Rs(Di(e, Si));
                    for (t = sn(t, n, 1); ++a < e;) a < Si ? r[a] = t(a) : t(a);
                    return r
                }

                function Fs(e) {
                    var t = ++ti;
                    return d(e) + t
                }

                function zs(e, t) {
                    return (+e || 0) + (+t || 0)
                }

                function Js(e, t, n) {
                    return n && Xn(e, t, n) && (t = b), t = In(t, n, 3), 1 == t.length ? ct(Ho(e) ? e : ua(e), t) : Qt(e, t)
                }
                e = e ? tt.defaults(et.Object(), e, tt.pick(et, Je)) : et;
                var Rs = e.Array,
                    Is = e.Date,
                    Ns = e.Error,
                    Cs = e.Function,
                    Us = e.Math,
                    Gs = e.Number,
                    Vs = e.Object,
                    $s = e.RegExp,
                    Zs = e.String,
                    Bs = e.TypeError,
                    Ks = Rs.prototype,
                    qs = Vs.prototype,
                    Qs = Zs.prototype,
                    Xs = Cs.prototype.toString,
                    ei = qs.hasOwnProperty,
                    ti = 0,
                    ni = qs.toString,
                    ai = et._,
                    ri = $s("^" + Xs.call(ei).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                    si = e.ArrayBuffer,
                    ii = e.clearTimeout,
                    oi = e.parseFloat,
                    _i = Us.pow,
                    di = qs.propertyIsEnumerable,
                    ui = Gn(e, "Set"),
                    li = e.setTimeout,
                    mi = Ks.splice,
                    ci = e.Uint8Array,
                    hi = Gn(e, "WeakMap"),
                    fi = Us.ceil,
                    Mi = Gn(Vs, "create"),
                    Li = Us.floor,
                    yi = Gn(Rs, "isArray"),
                    Yi = e.isFinite,
                    pi = Gn(Vs, "keys"),
                    ki = Us.max,
                    Di = Us.min,
                    gi = Gn(Is, "now"),
                    vi = e.parseInt,
                    wi = Us.random,
                    Ti = Gs.NEGATIVE_INFINITY,
                    bi = Gs.POSITIVE_INFINITY,
                    Si = 4294967295,
                    Hi = Si - 1,
                    ji = Si >>> 1,
                    xi = 9007199254740991,
                    Oi = hi && new hi,
                    Pi = {};
                t.support = {};
                t.templateSettings = {
                    escape: pe,
                    evaluate: ke,
                    interpolate: De,
                    variable: "",
                    imports: {
                        _: t
                    }
                };
                var Wi = function() {
                        function e() {}
                        return function(t) {
                            if (Wr(t)) {
                                e.prototype = t;
                                var n = new e;
                                e.prototype = b
                            }
                            return n || {}
                        }
                    }(),
                    Ei = mn(xt),
                    Ai = mn(Ot, !0),
                    Fi = cn(),
                    zi = cn(!0),
                    Ji = Oi ? function(e, t) {
                        return Oi.set(e, t), e
                    } : bs,
                    Ri = Oi ? function(e) {
                        return Oi.get(e)
                    } : Os,
                    Ii = Ct("length"),
                    Ni = function() {
                        var e = 0,
                            t = 0;
                        return function(n, a) {
                            var r = fo(),
                                s = I - (r - t);
                            if (t = r, s > 0) {
                                if (++e >= R) return n
                            } else e = 0;
                            return Ji(n, a)
                        }
                    }(),
                    Ci = Lr(function(e, t) {
                        return Y(e) && qn(e) ? gt(e, Ht(t, !1, !0)) : []
                    }),
                    Ui = Dn(),
                    Gi = Dn(!0),
                    Vi = Lr(function(e) {
                        for (var t = e.length, n = t, a = Rs(l), r = Cn(), s = r == o, i = []; n--;) {
                            var _ = e[n] = qn(_ = e[n]) ? _ : [];
                            a[n] = s && _.length >= 120 ? fn(n && _) : null
                        }
                        var d = e[0],
                            u = -1,
                            l = d ? d.length : 0,
                            m = a[0];
                        e: for (; ++u < l;)
                            if (_ = d[u], (m ? qe(m, _) : r(i, _, 0)) < 0) {
                                for (var n = t; --n;) {
                                    var c = a[n];
                                    if ((c ? qe(c, _) : r(e[n], _, 0)) < 0) continue e
                                }
                                m && m.push(_), i.push(_)
                            }
                        return i
                    }),
                    $i = Lr(function(e, t) {
                        t = Ht(t);
                        var n = yt(e, t);
                        return Gt(e, t.sort(s)), n
                    }),
                    Zi = An(),
                    Bi = An(!0),
                    Ki = Lr(function(e) {
                        return Xt(Ht(e, !1, !0))
                    }),
                    qi = Lr(function(e, t) {
                        return qn(e) ? gt(e, t) : []
                    }),
                    Qi = Lr(Fa),
                    Xi = Lr(function(e) {
                        var t = e.length,
                            n = t > 2 ? e[t - 2] : b,
                            a = t > 1 ? e[t - 1] : b;
                        return t > 2 && "function" == typeof n ? t -= 2 : (n = t > 1 && "function" == typeof a ? (--t, a) : b, a = b), e.length = t, za(e, n, a)
                    }),
                    eo = Lr(function(e) {
                        return e = Ht(e), this.thru(function(t) {
                            return Xe(Ho(t) ? t : [la(t)], e)
                        })
                    }),
                    to = Lr(function(e, t) {
                        return yt(e, Ht(t))
                    }),
                    no = un(function(e, t, n) {
                        ei.call(e, n) ? ++e[n] : e[n] = 1
                    }),
                    ao = kn(Ei),
                    ro = kn(Ai, !0),
                    so = wn(at, Ei),
                    io = wn(rt, Ai),
                    oo = un(function(e, t, n) {
                        ei.call(e, n) ? e[n].push(t) : e[n] = [t]
                    }),
                    _o = un(function(e, t, n) {
                        e[n] = t
                    }),
                    uo = Lr(function(e, t, n) {
                        var a = -1,
                            r = "function" == typeof t,
                            s = ea(t),
                            i = qn(e) ? Rs(e.length) : [];
                        return Ei(e, function(e) {
                            var o = r ? t : s && null != e ? e[t] : b;
                            i[++a] = o ? o.apply(e, n) : Kn(e, t, n)
                        }), i
                    }),
                    lo = un(function(e, t, n) {
                        e[n ? 0 : 1].push(t)
                    }, function() {
                        return [
                            [],
                            []
                        ]
                    }),
                    mo = xn(ut, Ei),
                    co = xn(lt, Ai),
                    ho = Lr(function(e, t) {
                        if (null == e) return [];
                        var n = t[2];
                        return n && Xn(t[0], t[1], n) && (t.length = 1), qt(e, Ht(t), [])
                    }),
                    fo = gi || function() {
                        return (new Is).getTime()
                    },
                    Mo = Lr(function(e, t, n) {
                        var a = H;
                        if (n.length) {
                            var r = k(n, Mo.placeholder);
                            a |= W
                        }
                        return Fn(e, a, t, n, r)
                    }),
                    Lo = Lr(function(e, t) {
                        t = t.length ? Ht(t) : Kr(e);
                        for (var n = -1, a = t.length; ++n < a;) {
                            var r = t[n];
                            e[r] = Fn(e[r], H, e)
                        }
                        return e
                    }),
                    yo = Lr(function(e, t, n) {
                        var a = H | j;
                        if (n.length) {
                            var r = k(n, yo.placeholder);
                            a |= W
                        }
                        return Fn(t, a, e, n, r)
                    }),
                    Yo = yn(O),
                    po = yn(P),
                    ko = Lr(function(e, t) {
                        return Dt(e, 1, t)
                    }),
                    Do = Lr(function(e, t, n) {
                        return Dt(e, t, n)
                    }),
                    go = vn(),
                    vo = vn(!0),
                    wo = Lr(function(e, t) {
                        if (t = Ht(t), "function" != typeof e || !st(t, _)) throw new Bs(G);
                        var n = t.length;
                        return Lr(function(a) {
                            for (var r = Di(a.length, n); r--;) a[r] = t[r](a[r]);
                            return e.apply(this, a)
                        })
                    }),
                    To = jn(W),
                    bo = jn(E),
                    So = Lr(function(e, t) {
                        return Fn(e, F, b, b, b, Ht(t))
                    }),
                    Ho = yi || function(e) {
                        return Y(e) && na(e.length) && ni.call(e) == Z
                    },
                    jo = ln(It),
                    xo = ln(function(e, t, n) {
                        return n ? Mt(e, t, n) : Lt(e, t)
                    }),
                    Oo = Yn(xo, ht),
                    Po = Yn(jo, sa),
                    Wo = gn(xt),
                    Eo = gn(Ot),
                    Ao = Tn(Fi),
                    Fo = Tn(zi),
                    zo = bn(xt),
                    Jo = bn(Ot),
                    Ro = pi ? function(e) {
                        var t = null == e ? b : e.constructor;
                        return "function" == typeof t && t.prototype === e || "function" != typeof e && qn(e) ? da(e) : Wr(e) ? pi(e) : []
                    } : da,
                    Io = Sn(!0),
                    No = Sn(),
                    Co = Lr(function(e, t) {
                        if (null == e) return {};
                        if ("function" != typeof t[0]) {
                            var t = _t(Ht(t), Zs);
                            return ia(e, gt(es(e), t))
                        }
                        var n = sn(t[0], t[1], 3);
                        return oa(e, function(e, t, a) {
                            return !n(e, t, a)
                        })
                    }),
                    Uo = Lr(function(e, t) {
                        return null == e ? {} : "function" == typeof t[0] ? oa(e, sn(t[0], t[1], 3)) : ia(e, Ht(t))
                    }),
                    Go = Mn(function(e, t, n) {
                        return t = t.toLowerCase(), e + (n ? t.charAt(0).toUpperCase() + t.slice(1) : t)
                    }),
                    Vo = Mn(function(e, t, n) {
                        return e + (n ? "-" : "") + t.toLowerCase()
                    }),
                    $o = Hn(),
                    Zo = Hn(!0),
                    Bo = Mn(function(e, t, n) {
                        return e + (n ? "_" : "") + t.toLowerCase()
                    }),
                    Ko = Mn(function(e, t, n) {
                        return e + (n ? " " : "") + (t.charAt(0).toUpperCase() + t.slice(1))
                    }),
                    qo = Lr(function(e, t) {
                        try {
                            return e.apply(b, t)
                        } catch (e) {
                            return xr(e) ? e : new Ns(e)
                        }
                    }),
                    Qo = Lr(function(e, t) {
                        return function(n) {
                            return Kn(n, e, t)
                        }
                    }),
                    Xo = Lr(function(e, t) {
                        return function(n) {
                            return Kn(e, n, t)
                        }
                    }),
                    e_ = En("ceil"),
                    t_ = En("floor"),
                    n_ = pn(gr, Ti),
                    a_ = pn(Gr, bi),
                    r_ = En("round");
                return t.prototype = n.prototype, a.prototype = Wi(n.prototype), a.prototype.constructor = a, r.prototype = Wi(n.prototype), r.prototype.constructor = r, Ge.prototype.delete = Ve, Ge.prototype.get = $e, Ge.prototype.has = Ze, Ge.prototype.set = Be, Ke.prototype.push = Qe, hr.Cache = Ge, t.after = ur, t.ary = lr, t.assign = xo, t.at = to, t.before = mr, t.bind = Mo, t.bindAll = Lo, t.bindKey = yo, t.callback = ws, t.chain = Ia, t.chunk = ha, t.compact = fa, t.constant = Ts, t.countBy = no, t.create = Br, t.curry = Yo, t.curryRight = po, t.debounce = cr, t.defaults = Oo, t.defaultsDeep = Po, t.defer = ko, t.delay = Do, t.difference = Ci, t.drop = Ma, t.dropRight = La, t.dropRightWhile = ya, t.dropWhile = Ya, t.fill = pa, t.filter = qa, t.flatten = Da, t.flattenDeep = ga, t.flow = go, t.flowRight = vo, t.forEach = so, t.forEachRight = io, t.forIn = Ao, t.forInRight = Fo, t.forOwn = zo, t.forOwnRight = Jo, t.functions = Kr, t.groupBy = oo, t.indexBy = _o, t.initial = wa, t.intersection = Vi, t.invert = Xr, t.invoke = uo, t.keys = Ro, t.keysIn = es, t.map = er, t.mapKeys = Io, t.mapValues = No, t.matches = Ss, t.matchesProperty = Hs, t.memoize = hr, t.merge = jo, t.method = Qo, t.methodOf = Xo, t.mixin = js, t.modArgs = wo, t.negate = fr, t.omit = Co, t.once = Mr, t.pairs = ts, t.partial = To, t.partialRight = bo, t.partition = lo, t.pick = Uo, t.pluck = tr, t.property = Ps, t.propertyOf = Ws, t.pull = Sa, t.pullAt = $i, t.range = Es, t.rearg = So, t.reject = nr, t.remove = Ha, t.rest = ja, t.restParam = Lr, t.set = as, t.shuffle = rr, t.slice = xa, t.sortBy = or, t.sortByAll = ho, t.sortByOrder = _r, t.spread = yr, t.take = Oa, t.takeRight = Pa, t.takeRightWhile = Wa, t.takeWhile = Ea, t.tap = Na, t.throttle = Yr, t.thru = Ca, t.times = As, t.toArray = $r, t.toPlainObject = Zr, t.transform = rs, t.union = Ki, t.uniq = Aa, t.unzip = Fa, t.unzipWith = za, t.values = ss, t.valuesIn = is, t.where = dr, t.without = qi, t.wrap = pr, t.xor = Ja, t.zip = Qi, t.zipObject = Ra, t.zipWith = Xi, t.backflow = vo, t.collect = er, t.compose = vo, t.each = so, t.eachRight = io, t.extend = xo, t.iteratee = ws, t.methods = Kr, t.object = Ra, t.select = qa, t.tail = ja, t.unique = Aa, js(t, t), t.add = zs, t.attempt = qo, t.camelCase = Go, t.capitalize = ds, t.ceil = e_, t.clone = kr, t.cloneDeep = Dr, t.deburr = us, t.endsWith = ls, t.escape = ms, t.escapeRegExp = cs, t.every = Ka, t.find = ao, t.findIndex = Ui, t.findKey = Wo, t.findLast = ro, t.findLastIndex = Gi, t.findLastKey = Eo, t.findWhere = Qa, t.first = ka, t.floor = t_, t.get = qr, t.gt = gr, t.gte = vr, t.has = Qr, t.identity = bs, t.includes = Xa, t.indexOf = va, t.inRange = os, t.isArguments = wr, t.isArray = Ho, t.isBoolean = Tr, t.isDate = br, t.isElement = Sr, t.isEmpty = Hr, t.isEqual = jr, t.isError = xr, t.isFinite = Or, t.isFunction = Pr, t.isMatch = Er, t.isNaN = Ar, t.isNative = Fr, t.isNull = zr, t.isNumber = Jr, t.isObject = Wr, t.isPlainObject = Rr, t.isRegExp = Ir, t.isString = Nr, t.isTypedArray = Cr, t.isUndefined = Ur, t.kebabCase = Vo, t.last = Ta, t.lastIndexOf = ba, t.lt = Gr, t.lte = Vr, t.max = n_, t.min = a_, t.noConflict = xs, t.noop = Os, t.now = fo, t.pad = hs, t.padLeft = $o, t.padRight = Zo, t.parseInt = fs, t.random = _s, t.reduce = mo, t.reduceRight = co, t.repeat = Ms, t.result = ns, t.round = r_, t.runInContext = T, t.size = sr, t.snakeCase = Bo, t.some = ir, t.sortedIndex = Zi, t.sortedLastIndex = Bi, t.startCase = Ko, t.startsWith = Ls, t.sum = Js, t.template = ys, t.trim = Ys, t.trimLeft = ps, t.trimRight = ks, t.trunc = Ds, t.unescape = gs, t.uniqueId = Fs, t.words = vs, t.all = Ka, t.any = ir, t.contains = Xa, t.eq = jr, t.detect = ao, t.foldl = mo, t.foldr = co, t.head = ka, t.include = Xa, t.inject = mo, js(t, function() {
                    var e = {};
                    return xt(t, function(n, a) {
                        t.prototype[a] || (e[a] = n)
                    }), e
                }(), !1), t.sample = ar, t.prototype.sample = function(e) {
                    return this.__chain__ || null != e ? this.thru(function(t) {
                        return ar(t, e)
                    }) : ar(this.value())
                }, t.VERSION = S, at(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
                    t[e].placeholder = t
                }), at(["drop", "take"], function(e, t) {
                    r.prototype[e] = function(n) {
                        var a = this.__filtered__;
                        if (a && !t) return new r(this);
                        n = null == n ? 1 : ki(Li(n) || 0, 0);
                        var s = this.clone();
                        return a ? s.__takeCount__ = Di(s.__takeCount__, n) : s.__views__.push({
                            size: n,
                            type: e + (s.__dir__ < 0 ? "Right" : "")
                        }), s
                    }, r.prototype[e + "Right"] = function(t) {
                        return this.reverse()[e](t).reverse()
                    }
                }), at(["filter", "map", "takeWhile"], function(e, t) {
                    var n = t + 1,
                        a = n != U;
                    r.prototype[e] = function(e, t) {
                        var r = this.clone();
                        return r.__iteratees__.push({
                            iteratee: In(e, t, 1),
                            type: n
                        }), r.__filtered__ = r.__filtered__ || a, r
                    }
                }), at(["first", "last"], function(e, t) {
                    var n = "take" + (t ? "Right" : "");
                    r.prototype[e] = function() {
                        return this[n](1).value()[0]
                    }
                }), at(["initial", "rest"], function(e, t) {
                    var n = "drop" + (t ? "" : "Right");
                    r.prototype[e] = function() {
                        return this.__filtered__ ? new r(this) : this[n](1)
                    }
                }), at(["pluck", "where"], function(e, t) {
                    var n = t ? "filter" : "map",
                        a = t ? Jt : Ps;
                    r.prototype[e] = function(e) {
                        return this[n](a(e))
                    }
                }), r.prototype.compact = function() {
                    return this.filter(bs)
                }, r.prototype.reject = function(e, t) {
                    return e = In(e, t, 1), this.filter(function(t) {
                        return !e(t)
                    })
                }, r.prototype.slice = function(e, t) {
                    e = null == e ? 0 : +e || 0;
                    var n = this;
                    return n.__filtered__ && (e > 0 || t < 0) ? new r(n) : (e < 0 ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== b && (t = +t || 0, n = t < 0 ? n.dropRight(-t) : n.take(t - e)), n)
                }, r.prototype.takeRightWhile = function(e, t) {
                    return this.reverse().takeWhile(e, t).reverse()
                }, r.prototype.toArray = function() {
                    return this.take(bi)
                }, xt(r.prototype, function(e, n) {
                    var s = /^(?:filter|map|reject)|While$/.test(n),
                        i = /^(?:first|last)$/.test(n),
                        o = t[i ? "take" + ("last" == n ? "Right" : "") : n];
                    o && (t.prototype[n] = function() {
                        var t = i ? [1] : arguments,
                            n = this.__chain__,
                            _ = this.__wrapped__,
                            d = !!this.__actions__.length,
                            u = _ instanceof r,
                            l = t[0],
                            m = u || Ho(_);
                        m && s && "function" == typeof l && 1 != l.length && (u = m = !1);
                        var c = function(e) {
                                return i && n ? o(e, 1)[0] : o.apply(b, dt([e], t))
                            },
                            h = {
                                func: Ca,
                                args: [c],
                                thisArg: b
                            },
                            f = u && !d;
                        if (i && !n) return f ? (_ = _.clone(), _.__actions__.push(h), e.call(_)) : o.call(b, this.value())[0];
                        if (!i && m) {
                            _ = f ? _ : new r(this);
                            var M = e.apply(_, t);
                            return M.__actions__.push(h), new a(M, n)
                        }
                        return this.thru(c)
                    })
                }), at(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function(e) {
                    var n = (/^(?:replace|split)$/.test(e) ? Qs : Ks)[e],
                        a = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru",
                        r = /^(?:join|pop|replace|shift)$/.test(e);
                    t.prototype[e] = function() {
                        var e = arguments;
                        return r && !this.__chain__ ? n.apply(this.value(), e) : this[a](function(t) {
                            return n.apply(t, e)
                        })
                    }
                }), xt(r.prototype, function(e, n) {
                    var a = t[n];
                    if (a) {
                        var r = a.name;
                        (Pi[r] || (Pi[r] = [])).push({
                            name: n,
                            func: a
                        })
                    }
                }), Pi[On(b, j).name] = [{
                    name: "wrapper",
                    func: b
                }], r.prototype.clone = p, r.prototype.reverse = Ce, r.prototype.value = Ue, t.prototype.chain = Ua, t.prototype.commit = Ga, t.prototype.concat = eo, t.prototype.plant = Va, t.prototype.reverse = $a, t.prototype.toString = Za, t.prototype.run = t.prototype.toJSON = t.prototype.valueOf = t.prototype.value = Ba, t.prototype.collect = t.prototype.map, t.prototype.head = t.prototype.first, t.prototype.select = t.prototype.filter, t.prototype.tail = t.prototype.rest, t
            }
            var b, S = "3.10.1",
                H = 1,
                j = 2,
                x = 4,
                O = 8,
                P = 16,
                W = 32,
                E = 64,
                A = 128,
                F = 256,
                z = 30,
                J = "...",
                R = 150,
                I = 16,
                N = 200,
                C = 1,
                U = 2,
                G = "Expected a function",
                V = "__lodash_placeholder__",
                $ = "[object Arguments]",
                Z = "[object Array]",
                B = "[object Boolean]",
                K = "[object Date]",
                q = "[object Error]",
                Q = "[object Function]",
                X = "[object Number]",
                ee = "[object Object]",
                te = "[object RegExp]",
                ne = "[object String]",
                ae = "[object ArrayBuffer]",
                re = "[object Float32Array]",
                se = "[object Float64Array]",
                ie = "[object Int8Array]",
                oe = "[object Int16Array]",
                _e = "[object Int32Array]",
                de = "[object Uint8Array]",
                ue = "[object Uint8ClampedArray]",
                le = "[object Uint16Array]",
                me = "[object Uint32Array]",
                ce = /\b__p \+= '';/g,
                he = /\b(__p \+=) '' \+/g,
                fe = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                Me = /&(?:amp|lt|gt|quot|#39|#96);/g,
                Le = /[&<>"'`]/g,
                ye = RegExp(Me.source),
                Ye = RegExp(Le.source),
                pe = /<%-([\s\S]+?)%>/g,
                ke = /<%([\s\S]+?)%>/g,
                De = /<%=([\s\S]+?)%>/g,
                ge = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
                ve = /^\w*$/,
                we = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
                Te = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
                be = RegExp(Te.source),
                Se = /[\u0300-\u036f\ufe20-\ufe23]/g,
                He = /\\(\\)?/g,
                je = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                xe = /\w*$/,
                Oe = /^0[xX]/,
                Pe = /^\[object .+?Constructor\]$/,
                We = /^\d+$/,
                Ee = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
                Ae = /($^)/,
                Fe = /['\n\r\u2028\u2029\\]/g,
                ze = function() {
                    var e = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
                        t = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
                    return RegExp(e + "+(?=" + e + t + ")|" + e + "?" + t + "|" + e + "+|[0-9]+", "g")
                }(),
                Je = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"],
                Re = -1,
                Ie = {};
            Ie[re] = Ie[se] = Ie[ie] = Ie[oe] = Ie[_e] = Ie[de] = Ie[ue] = Ie[le] = Ie[me] = !0, Ie[$] = Ie[Z] = Ie[ae] = Ie[B] = Ie[K] = Ie[q] = Ie[Q] = Ie["[object Map]"] = Ie[X] = Ie[ee] = Ie[te] = Ie["[object Set]"] = Ie[ne] = Ie["[object WeakMap]"] = !1;
            var Ne = {};
            Ne[$] = Ne[Z] = Ne[ae] = Ne[B] = Ne[K] = Ne[re] = Ne[se] = Ne[ie] = Ne[oe] = Ne[_e] = Ne[X] = Ne[ee] = Ne[te] = Ne[ne] = Ne[de] = Ne[ue] = Ne[le] = Ne[me] = !0, Ne[q] = Ne[Q] = Ne["[object Map]"] = Ne["[object Set]"] = Ne["[object WeakMap]"] = !1;
            var Ce = {
                    "À": "A",
                    "Á": "A",
                    "Â": "A",
                    "Ã": "A",
                    "Ä": "A",
                    "Å": "A",
                    "à": "a",
                    "á": "a",
                    "â": "a",
                    "ã": "a",
                    "ä": "a",
                    "å": "a",
                    "Ç": "C",
                    "ç": "c",
                    "Ð": "D",
                    "ð": "d",
                    "È": "E",
                    "É": "E",
                    "Ê": "E",
                    "Ë": "E",
                    "è": "e",
                    "é": "e",
                    "ê": "e",
                    "ë": "e",
                    "Ì": "I",
                    "Í": "I",
                    "Î": "I",
                    "Ï": "I",
                    "ì": "i",
                    "í": "i",
                    "î": "i",
                    "ï": "i",
                    "Ñ": "N",
                    "ñ": "n",
                    "Ò": "O",
                    "Ó": "O",
                    "Ô": "O",
                    "Õ": "O",
                    "Ö": "O",
                    "Ø": "O",
                    "ò": "o",
                    "ó": "o",
                    "ô": "o",
                    "õ": "o",
                    "ö": "o",
                    "ø": "o",
                    "Ù": "U",
                    "Ú": "U",
                    "Û": "U",
                    "Ü": "U",
                    "ù": "u",
                    "ú": "u",
                    "û": "u",
                    "ü": "u",
                    "Ý": "Y",
                    "ý": "y",
                    "ÿ": "y",
                    "Æ": "Ae",
                    "æ": "ae",
                    "Þ": "Th",
                    "þ": "th",
                    "ß": "ss"
                },
                Ue = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "`": "&#96;"
                },
                Ge = {
                    "&amp;": "&",
                    "&lt;": "<",
                    "&gt;": ">",
                    "&quot;": '"',
                    "&#39;": "'",
                    "&#96;": "`"
                },
                Ve = {
                    function: !0,
                    object: !0
                },
                $e = {
                    0: "x30",
                    1: "x31",
                    2: "x32",
                    3: "x33",
                    4: "x34",
                    5: "x35",
                    6: "x36",
                    7: "x37",
                    8: "x38",
                    9: "x39",
                    A: "x41",
                    B: "x42",
                    C: "x43",
                    D: "x44",
                    E: "x45",
                    F: "x46",
                    a: "x61",
                    b: "x62",
                    c: "x63",
                    d: "x64",
                    e: "x65",
                    f: "x66",
                    n: "x6e",
                    r: "x72",
                    t: "x74",
                    u: "x75",
                    v: "x76",
                    x: "x78"
                },
                Ze = {
                    "\\": "\\",
                    "'": "'",
                    "\n": "n",
                    "\r": "r",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                Be = Ve[typeof t] && t && !t.nodeType && t,
                Ke = Ve[typeof e] && e && !e.nodeType && e,
                qe = Be && Ke && "object" == typeof a && a && a.Object && a,
                Qe = Ve[typeof self] && self && self.Object && self,
                Xe = Ve[typeof window] && window && window.Object && window,
                et = (Ke && Ke.exports, qe || Xe !== (this && this.window) && Xe || Qe || this),
                tt = T();
            et._ = tt, (r = function() {
                return tt
            }.call(t, n, t, e)) !== b && (e.exports = r)
        }).call(this)
    }).call(t, n(1)(e), n(124))
}, function(e, t, n) {
    (function(e) {
        (function() {
            function t(t) {
                t.fn.__translateJavaFormat = o, t.fn.toMomentFormatString = function(e) {
                    return a[e] || (a[e] = o(e, s)), a[e]
                }, t.fn.formatWithJDF = function(e) {
                    return this.format(this.toMomentFormatString(e))
                }, t.fn.toJDFString = function(e) {
                    return r[e] || (r[e] = o(e, i)), r[e]
                }, void 0 !== e && null !== e ? e.exports = t : this.moment = t
            }
            var a = {},
                r = {},
                s = {
                    d: "D",
                    dd: "DD",
                    y: "YYYY",
                    yy: "YY",
                    yyy: "YYYY",
                    yyyy: "YYYY",
                    a: "a",
                    A: "A",
                    M: "M",
                    MM: "MM",
                    MMM: "MMM",
                    MMMM: "MMMM",
                    h: "h",
                    hh: "hh",
                    H: "H",
                    HH: "HH",
                    m: "m",
                    mm: "mm",
                    s: "s",
                    ss: "ss",
                    S: "SSS",
                    SS: "SSS",
                    SSS: "SSS",
                    E: "ddd",
                    EE: "ddd",
                    EEE: "ddd",
                    EEEE: "dddd",
                    EEEEE: "dddd",
                    EEEEEE: "dddd",
                    D: "DDD",
                    w: "W",
                    ww: "WW",
                    z: "ZZ",
                    zzzz: "Z",
                    Z: "ZZ",
                    X: "ZZ",
                    XX: "ZZ",
                    XXX: "Z",
                    u: "E"
                },
                i = {
                    D: "d",
                    DD: "dd",
                    YY: "yy",
                    YYY: "yyyy",
                    YYYY: "yyyy",
                    a: "a",
                    A: "A",
                    M: "M",
                    MM: "MM",
                    MMM: "MMM",
                    MMMM: "MMMM",
                    h: "h",
                    hh: "hh",
                    H: "H",
                    HH: "HH",
                    m: "m",
                    mm: "mm",
                    s: "s",
                    ss: "ss",
                    S: "S",
                    SS: "S",
                    SSS: "S",
                    ddd: "E",
                    dddd: "EEEE",
                    DDD: "D",
                    W: "w",
                    WW: "ww",
                    ZZ: "z",
                    Z: "XXX",
                    E: "u"
                };
            this.moment ? t(this.moment) : e && e.exports ? t(n(0)) : new Promise(function(e) {
                e()
            }).then(function() {
                var e = [n(0)];
                (function(e) {
                    t(e)
                }).apply(null, e)
            }).catch(n.oe);
            var o = function(e, t) {
                    for (var n = e.length, a = 0, r = -1, s = null, i = "", o = ""; a < n; a++) i = e.charAt(a), null !== s && s === i || (o = _(e, t, r, a, o), r = a), s = i;
                    return _(e, t, r, a, o)
                },
                _ = function(e, t, n, a, r) {
                    var s;
                    return -1 !== n && (s = e.substring(n, a), t[s] && (s = t[s]), r = r.concat(s)), r
                }
        }).call(this)
    }).call(t, n(1)(e))
}, function(e, t, n) {
    function a(e) {
        return n(r(e))
    }

    function r(e) {
        var t = s[e];
        if (!(t + 1)) throw new Error("Cannot find module '" + e + "'.");
        return t
    }
    var s = {
        "./af": 2,
        "./af.js": 2,
        "./ar": 9,
        "./ar-dz": 3,
        "./ar-dz.js": 3,
        "./ar-kw": 4,
        "./ar-kw.js": 4,
        "./ar-ly": 5,
        "./ar-ly.js": 5,
        "./ar-ma": 6,
        "./ar-ma.js": 6,
        "./ar-sa": 7,
        "./ar-sa.js": 7,
        "./ar-tn": 8,
        "./ar-tn.js": 8,
        "./ar.js": 9,
        "./az": 10,
        "./az.js": 10,
        "./be": 11,
        "./be.js": 11,
        "./bg": 12,
        "./bg.js": 12,
        "./bm": 13,
        "./bm.js": 13,
        "./bn": 14,
        "./bn.js": 14,
        "./bo": 15,
        "./bo.js": 15,
        "./br": 16,
        "./br.js": 16,
        "./bs": 17,
        "./bs.js": 17,
        "./ca": 18,
        "./ca.js": 18,
        "./cs": 19,
        "./cs.js": 19,
        "./cv": 20,
        "./cv.js": 20,
        "./cy": 21,
        "./cy.js": 21,
        "./da": 22,
        "./da.js": 22,
        "./de": 25,
        "./de-at": 23,
        "./de-at.js": 23,
        "./de-ch": 24,
        "./de-ch.js": 24,
        "./de.js": 25,
        "./dv": 26,
        "./dv.js": 26,
        "./el": 27,
        "./el.js": 27,
        "./en-au": 28,
        "./en-au.js": 28,
        "./en-ca": 29,
        "./en-ca.js": 29,
        "./en-gb": 30,
        "./en-gb.js": 30,
        "./en-ie": 31,
        "./en-ie.js": 31,
        "./en-nz": 32,
        "./en-nz.js": 32,
        "./eo": 33,
        "./eo.js": 33,
        "./es": 36,
        "./es-do": 34,
        "./es-do.js": 34,
        "./es-us": 35,
        "./es-us.js": 35,
        "./es.js": 36,
        "./et": 37,
        "./et.js": 37,
        "./eu": 38,
        "./eu.js": 38,
        "./fa": 39,
        "./fa.js": 39,
        "./fi": 40,
        "./fi.js": 40,
        "./fo": 41,
        "./fo.js": 41,
        "./fr": 44,
        "./fr-ca": 42,
        "./fr-ca.js": 42,
        "./fr-ch": 43,
        "./fr-ch.js": 43,
        "./fr.js": 44,
        "./fy": 45,
        "./fy.js": 45,
        "./gd": 46,
        "./gd.js": 46,
        "./gl": 47,
        "./gl.js": 47,
        "./gom-latn": 48,
        "./gom-latn.js": 48,
        "./gu": 49,
        "./gu.js": 49,
        "./he": 50,
        "./he.js": 50,
        "./hi": 51,
        "./hi.js": 51,
        "./hr": 52,
        "./hr.js": 52,
        "./hu": 53,
        "./hu.js": 53,
        "./hy-am": 54,
        "./hy-am.js": 54,
        "./id": 55,
        "./id.js": 55,
        "./is": 56,
        "./is.js": 56,
        "./it": 57,
        "./it.js": 57,
        "./ja": 58,
        "./ja.js": 58,
        "./jv": 59,
        "./jv.js": 59,
        "./ka": 60,
        "./ka.js": 60,
        "./kk": 61,
        "./kk.js": 61,
        "./km": 62,
        "./km.js": 62,
        "./kn": 63,
        "./kn.js": 63,
        "./ko": 64,
        "./ko.js": 64,
        "./ky": 65,
        "./ky.js": 65,
        "./lb": 66,
        "./lb.js": 66,
        "./lo": 67,
        "./lo.js": 67,
        "./lt": 68,
        "./lt.js": 68,
        "./lv": 69,
        "./lv.js": 69,
        "./me": 70,
        "./me.js": 70,
        "./mi": 71,
        "./mi.js": 71,
        "./mk": 72,
        "./mk.js": 72,
        "./ml": 73,
        "./ml.js": 73,
        "./mr": 74,
        "./mr.js": 74,
        "./ms": 76,
        "./ms-my": 75,
        "./ms-my.js": 75,
        "./ms.js": 76,
        "./my": 77,
        "./my.js": 77,
        "./nb": 78,
        "./nb.js": 78,
        "./ne": 79,
        "./ne.js": 79,
        "./nl": 81,
        "./nl-be": 80,
        "./nl-be.js": 80,
        "./nl.js": 81,
        "./nn": 82,
        "./nn.js": 82,
        "./pa-in": 83,
        "./pa-in.js": 83,
        "./pl": 84,
        "./pl.js": 84,
        "./pt": 86,
        "./pt-br": 85,
        "./pt-br.js": 85,
        "./pt.js": 86,
        "./ro": 87,
        "./ro.js": 87,
        "./ru": 88,
        "./ru.js": 88,
        "./sd": 89,
        "./sd.js": 89,
        "./se": 90,
        "./se.js": 90,
        "./si": 91,
        "./si.js": 91,
        "./sk": 92,
        "./sk.js": 92,
        "./sl": 93,
        "./sl.js": 93,
        "./sq": 94,
        "./sq.js": 94,
        "./sr": 96,
        "./sr-cyrl": 95,
        "./sr-cyrl.js": 95,
        "./sr.js": 96,
        "./ss": 97,
        "./ss.js": 97,
        "./sv": 98,
        "./sv.js": 98,
        "./sw": 99,
        "./sw.js": 99,
        "./ta": 100,
        "./ta.js": 100,
        "./te": 101,
        "./te.js": 101,
        "./tet": 102,
        "./tet.js": 102,
        "./th": 103,
        "./th.js": 103,
        "./tl-ph": 104,
        "./tl-ph.js": 104,
        "./tlh": 105,
        "./tlh.js": 105,
        "./tr": 106,
        "./tr.js": 106,
        "./tzl": 107,
        "./tzl.js": 107,
        "./tzm": 109,
        "./tzm-latn": 108,
        "./tzm-latn.js": 108,
        "./tzm.js": 109,
        "./uk": 110,
        "./uk.js": 110,
        "./ur": 111,
        "./ur.js": 111,
        "./uz": 113,
        "./uz-latn": 112,
        "./uz-latn.js": 112,
        "./uz.js": 113,
        "./vi": 114,
        "./vi.js": 114,
        "./x-pseudo": 115,
        "./x-pseudo.js": 115,
        "./yo": 116,
        "./yo.js": 116,
        "./zh-cn": 117,
        "./zh-cn.js": 117,
        "./zh-hk": 118,
        "./zh-hk.js": 118,
        "./zh-tw": 119,
        "./zh-tw.js": 119
    };
    a.keys = function() {
        return Object.keys(s)
    }, a.resolve = r, e.exports = a, a.id = 122
}, function(e, t, n) {
    "use strict";

    function a(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function r(e, t, n) {
        return function(a) {
            var r = o.default.chain(n).map(function(e) {
                return (0, d.default)(a, e, !0)
            }).find(function(e) {
                return e.isValid()
            }).value();
            if (!r) return !1;
            var s = r.toDate().getTime();
            return s === e || s > e && s < t
        }
    }

    function s(e) {
        var t = e.rangeData,
            n = e.patterns,
            a = e.filteredOccurrences;
        return o.default.forEach(t, function(e) {
            var t = e.data.min,
                s = e.data.max;
            e.filteredOccurrences = a ? o.default.chain(a).keys().filter(r(t, s, n)).map(function(e) {
                return a[e]
            }).reduce(function(e, t) {
                return e + t
            }, 0).value() : e.occurrences
        }), t
    }
    var i = n(120),
        o = a(i);
    n(0);
    var _ = n(121),
        d = a(_);
    onmessage = function(e) {
        var t = s(e.data);
        postMessage(t)
    }
}, function(e, t) {
    var n;
    n = function() {
        return this
    }();
    try {
        n = n || Function("return this")() || (0, eval)("this")
    } catch (e) {
        "object" == typeof window && (n = window)
    }
    e.exports = n
}]);
