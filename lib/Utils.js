"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Pedro on 3/29/2017.
 */

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);
	}

	_createClass(Utils, [{
		key: "assertDefined",
		value: function assertDefined(object, name) {
			if (object === undefined) {
				throw name + ' must be defined';
			} else {
				return object;
			}
		}
	}, {
		key: "assertParametersDefined",
		value: function assertParametersDefined(params, keys, ignore) {
			if (keys === undefined) {
				return;
			}
			if (keys.length > 0 && params === undefined) {
				params = {};
			}
			for (var i = 0; i < keys.length; i++) {
				if (!this.contains(ignore, keys[i])) {
					this.assertDefined(params[keys[i]], keys[i]);
				}
			}
		}
	}, {
		key: "parseParametersToObject",
		value: function parseParametersToObject(params, keys) {
			if (params === undefined) {
				return {};
			}
			var object = {};
			for (var i = 0; i < keys.length; i++) {
				object[keys[i]] = params[keys[i]];
			}
			return object;
		}
	}, {
		key: "contains",
		value: function contains(a, obj) {
			if (a === undefined) {
				return false;
			}
			var i = a.length;
			while (i--) {
				if (a[i] === obj) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "copy",
		value: function copy(obj) {
			if (null == obj || "object" != (typeof obj === "undefined" ? "undefined" : _typeof(obj))) return obj;
			var copy = obj.constructor();
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
			}
			return copy;
		}
	}, {
		key: "mergeInto",
		value: function mergeInto(baseObj, additionalProps) {
			if (null == baseObj || "object" != (typeof baseObj === "undefined" ? "undefined" : _typeof(baseObj))) return baseObj;
			var merged = baseObj.constructor();
			for (var attr in baseObj) {
				if (baseObj.hasOwnProperty(attr)) merged[attr] = baseObj[attr];
			}
			if (null == additionalProps || "object" != (typeof additionalProps === "undefined" ? "undefined" : _typeof(additionalProps))) return baseObj;
			for (attr in additionalProps) {
				if (additionalProps.hasOwnProperty(attr)) merged[attr] = additionalProps[attr];
			}
			return merged;
		}
	}]);

	return Utils;
}();

exports.default = Utils;