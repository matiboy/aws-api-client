'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Pedro on 3/29/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleHttpClient = function () {
	function SimpleHttpClient(config) {
		_classCallCheck(this, SimpleHttpClient);

		this.config = config;
		this.utils = new _Utils2.default();
		this.endpoint = this.utils.assertDefined(config.endpoint, 'endpoint');
	}

	_createClass(SimpleHttpClient, [{
		key: 'buildCanonicalQueryString',
		value: function buildCanonicalQueryString(queryParams) {
			//Build a properly encoded query string from a QueryParam object
			if (Object.keys(queryParams).length < 1) {
				return '';
			}

			var canonicalQueryString = '';
			for (var property in queryParams) {
				if (queryParams.hasOwnProperty(property)) {
					canonicalQueryString += encodeURIComponent(property) + '=' + encodeURIComponent(queryParams[property]) + '&';
				}
			}

			return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
		}
	}, {
		key: 'makeRequest',
		value: function makeRequest(request) {
			var verb = this.utils.assertDefined(request.verb, 'verb');
			var path = this.utils.assertDefined(request.path, 'path');
			var queryParams = this.utils.copy(request.queryParams);
			if (queryParams === undefined) {
				queryParams = {};
			}
			var headers = this.utils.copy(request.headers);
			if (headers === undefined) {
				headers = {};
			}

			//If the user has not specified an override for Content type the use default
			if (headers['Content-Type'] === undefined) {
				headers['Content-Type'] = this.config.defaultContentType;
			}

			//If the user has not specified an override for Accept type the use default
			if (headers['Accept'] === undefined) {
				headers['Accept'] = this.config.defaultAcceptType;
			}

			var body = this.utils.copy(request.body);
			if (body === undefined) {
				body = '';
			}

			var url = this.config.endpoint + path;
			var queryString = this.buildCanonicalQueryString(queryParams);
			if (queryString != '') {
				url += '?' + queryString;
			}
			var simpleHttpRequest = {
				method: verb,
				url: url,
				headers: headers,
				data: body
			};
			return (0, _axios2.default)(simpleHttpRequest);
		}
	}]);

	return SimpleHttpClient;
}();

exports.default = SimpleHttpClient;