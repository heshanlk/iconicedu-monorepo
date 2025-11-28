"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var base = 'inline-flex items-center justify-center rounded-2xl px-3.5 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition';
var variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-500',
    secondary: 'bg-slate-800 text-slate-50 hover:bg-slate-700 focus-visible:ring-slate-500',
    ghost: 'bg-transparent text-slate-100 hover:bg-slate-800/60',
};
exports.Button = React.forwardRef(function (_a, ref) {
    var _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, className = _a.className, props = __rest(_a, ["variant", "className"]);
    return ((0, jsx_runtime_1.jsx)("button", __assign({ ref: ref, className: (0, clsx_1.default)(base, variants[variant], className) }, props)));
});
exports.Button.displayName = 'Button';
