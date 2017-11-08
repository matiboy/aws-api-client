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

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AWS_SHA_256 = 'AWS4-HMAC-SHA256';
var AWS4_REQUEST = 'aws4_request';
var AWS4 = 'AWS4';
var X_AMZ_DATE = 'x-amz-date';
var X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
var HOST = 'host';
var AUTHORIZATION = 'Authorization';

var SigV4Client = function () {
	function SigV4Client(config) {
		_classCallCheck(this, SigV4Client);

		this.config = config;
		this.utils = new _Utils2.default();

		this.accessKey = this.utils.assertDefined(config.accessKey, 'accessKey');
		this.secretKey = this.utils.assertDefined(config.secretKey, 'secretKey');
		this.sessionToken = config.sessionToken;
		this.serviceName = this.utils.assertDefined(config.serviceName, 'serviceName');
		this.region = this.utils.assertDefined(config.region, 'region');
		this.endpoint = this.utils.assertDefined(config.endpoint, 'endpoint');
	}

	_createClass(SigV4Client, [{
		key: 'hash',
		value: function hash(value) {
			return _cryptoJs2.default.SHA256(value);
		}
	}, {
		key: 'hexEncode',
		value: function hexEncode(value) {
			return value.toString(_cryptoJs2.default.enc.Hex);
		}
	}, {
		key: 'hmac',
		value: function hmac(secret, value) {
			return _cryptoJs2.default.HmacSHA256(value, secret, { asBytes: true });
		}
	}, {
		key: 'buildCanonicalRequest',
		value: function buildCanonicalRequest(method, path, queryParams, headers, payload) {
			return method + '\n' + this.buildCanonicalUri(path) + '\n' + this.buildCanonicalQueryString(queryParams) + '\n' + this.buildCanonicalHeaders(headers) + '\n' + this.buildCanonicalSignedHeaders(headers) + '\n' + this.hexEncode(this.hash(payload));
		}
	}, {
		key: 'hashCanonicalRequest',
		value: function hashCanonicalRequest(request) {
			return this.hexEncode(this.hash(request));
		}
	}, {
		key: 'buildCanonicalUri',
		value: function buildCanonicalUri(uri) {
			return encodeURI(uri);
		}
	}, {
		key: 'buildCanonicalQueryString',
		value: function buildCanonicalQueryString(queryParams) {
			if (Object.keys(queryParams).length < 1) {
				return '';
			}

			var sortedQueryParams = [];
			for (var property in queryParams) {
				if (queryParams.hasOwnProperty(property)) {
					sortedQueryParams.push(property);
				}
			}
			sortedQueryParams.sort();

			var canonicalQueryString = '';
			for (var i = 0; i < sortedQueryParams.length; i++) {
				canonicalQueryString += sortedQueryParams[i] + '=' + this.fixedEncodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
			}
			return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
		}
	}, {
		key: 'fixedEncodeURIComponent',
		value: function fixedEncodeURIComponent(str) {
			return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
				return '%' + c.charCodeAt(0).toString(16);
			});
		}
	}, {
		key: 'buildCanonicalHeaders',
		value: function buildCanonicalHeaders(headers) {
			var canonicalHeaders = '';
			var sortedKeys = [];
			for (var property in headers) {
				if (headers.hasOwnProperty(property)) {
					sortedKeys.push(property);
				}
			}
			sortedKeys.sort();

			for (var i = 0; i < sortedKeys.length; i++) {
				canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
			}
			return canonicalHeaders;
		}
	}, {
		key: 'buildCanonicalSignedHeaders',
		value: function buildCanonicalSignedHeaders(headers) {
			var sortedKeys = [];
			for (var property in headers) {
				if (headers.hasOwnProperty(property)) {
					sortedKeys.push(property.toLowerCase());
				}
			}
			sortedKeys.sort();
			return sortedKeys.join(';');
		}
	}, {
		key: 'buildStringToSign',
		value: function buildStringToSign(datetime, credentialScope, hashedCanonicalRequest) {
			return AWS_SHA_256 + '\n' + datetime + '\n' + credentialScope + '\n' + hashedCanonicalRequest;
		}
	}, {
		key: 'buildCredentialScope',
		value: function buildCredentialScope(datetime, region, service) {
			return datetime.substr(0, 8) + '/' + region + '/' + service + '/' + AWS4_REQUEST;
		}
	}, {
		key: 'calculateSigningKey',
		value: function calculateSigningKey(secretKey, datetime, region, service) {
			var hmac = this.hmac;
			return hmac(hmac(hmac(hmac(AWS4 + secretKey, datetime.substr(0, 8)), region), service), AWS4_REQUEST);
		}
	}, {
		key: 'calculateSignature',
		value: function calculateSignature(key, stringToSign) {
			return this.hexEncode(this.hmac(key, stringToSign));
		}
	}, {
		key: 'buildAuthorizationHeader',
		value: function buildAuthorizationHeader(accessKey, credentialScope, headers, signature) {
			return AWS_SHA_256 + ' Credential=' + accessKey + '/' + credentialScope + ', SignedHeaders=' + this.buildCanonicalSignedHeaders(headers) + ', Signature=' + signature;
		}
	}, {
		key: 'makeRequest',
		value: function makeRequest(request) {
			var verb = this.utils.assertDefined(request.verb, 'verb');
			var path = this.utils.assertDefined(request.path, 'path');
			var config = this.config;
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
				headers['Content-Type'] = config.defaultContentType;
			}

			//If the user has not specified an override for Accept type the use default
			if (headers['Accept'] === undefined) {
				headers['Accept'] = config.defaultAcceptType;
			}

			var body = this.utils.copy(request.body);
			if (body === undefined || verb === 'GET') {
				// override request body and set to empty when signing GET requests
				body = '';
			} else {
				body = JSON.stringify(body);
			}

			//If there is no body remove the content-type header so it is not included in SigV4 calculation
			if (body === '' || body === undefined || body === null) {
				delete headers['Content-Type'];
			}

			var datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[:\-]|\.\d{3}/g, '');
			headers[X_AMZ_DATE] = datetime;
			var parser = document.createElement('a');
			parser.href = this.endpoint;
			headers[HOST] = parser.hostname;

			var canonicalRequest = this.buildCanonicalRequest(verb, path, queryParams, headers, body);
			var hashedCanonicalRequest = this.hashCanonicalRequest(canonicalRequest);
			var credentialScope = this.buildCredentialScope(datetime, this.region, this.serviceName);
			var stringToSign = this.buildStringToSign(datetime, credentialScope, hashedCanonicalRequest);
			var signingKey = this.calculateSigningKey(this.secretKey, datetime, this.region, this.serviceName);
			var signature = this.calculateSignature(signingKey, stringToSign);
			headers[AUTHORIZATION] = this.buildAuthorizationHeader(this.accessKey, credentialScope, headers, signature);
			if (this.sessionToken !== undefined && this.sessionToken !== '') {
				headers[X_AMZ_SECURITY_TOKEN] = this.sessionToken;
			}
			delete headers[HOST];

			var url = config.endpoint + path;
			var queryString = this.buildCanonicalQueryString(queryParams);
			if (queryString != '') {
				url += '?' + queryString;
			}

			//Need to re-attach Content-Type if it is not specified at this point
			if (headers['Content-Type'] === undefined) {
				headers['Content-Type'] = config.defaultContentType;
			}

			var signedRequest = {
				method: verb,
				url: url,
				headers: headers,
				data: body
			};
			return (0, _axios2.default)(signedRequest);
		}
	}]);

	return SigV4Client;
}();

exports.default = SigV4Client;