'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Pedro on 3/29/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _SimpleHttpClient = require('./SimpleHttpClient');

var _SimpleHttpClient2 = _interopRequireDefault(_SimpleHttpClient);

var _SigV4Client = require('./SigV4Client');

var _SigV4Client2 = _interopRequireDefault(_SigV4Client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APIGatewayClient = function () {
	function APIGatewayClient(simpleHttpClientConfig, sigV4ClientConfig) {
		_classCallCheck(this, APIGatewayClient);

		this.utils = new _Utils2.default();
		this.sigV4Client = new _SigV4Client2.default(sigV4ClientConfig);
		this.simpleHttpClient = new _SimpleHttpClient2.default(simpleHttpClientConfig);
	}

	_createClass(APIGatewayClient, [{
		key: 'makeRequest',
		value: function makeRequest(request, authType, additionalParams, apiKey) {
			//Default the request to use the simple http client
			var clientToUse = this.simpleHttpClient;

			//Attach the apiKey to the headers request if one was provided
			if (apiKey !== undefined && apiKey !== '' && apiKey !== null) {
				request.headers['x-api-key'] = apiKey;
			}

			if (request.body === undefined || request.body === '' || request.body === null || Object.keys(request.body).length === 0) {
				request.body = undefined;
			}

			// If the user specified any additional headers or query params that may not have been modeled
			// merge them into the appropriate request properties
			request.headers = this.utils.mergeInto(request.headers, additionalParams.headers);
			request.queryParams = this.utils.mergeInto(request.queryParams, additionalParams.queryParams);

			//If an auth type was specified inject the appropriate auth client
			if (authType === 'AWS_IAM') {
				clientToUse = this.sigV4Client;
			}

			//Call the selected http client to make the request, returning a promise once the request is sent
			return clientToUse.makeRequest(request);
		}
	}]);

	return APIGatewayClient;
}();

exports.default = APIGatewayClient;