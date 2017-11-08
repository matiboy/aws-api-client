'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uritemplate = exports.SimpleHttpClient = exports.SigV4Client = exports.Utils = exports.APIGatewayClient = exports.apiGateway = undefined;

var _APIGatewayClient = require('./APIGatewayClient');

var _APIGatewayClient2 = _interopRequireDefault(_APIGatewayClient);

var _Utils = require('./Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _SigV4Client = require('./SigV4Client');

var _SigV4Client2 = _interopRequireDefault(_SigV4Client);

var _SimpleHttpClient = require('./SimpleHttpClient');

var _SimpleHttpClient2 = _interopRequireDefault(_SimpleHttpClient);

var _urlTemplate = require('./url-template');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiGateway = {
  core: {
    apiGatewayClientFactory: {
      newClient: function newClient(simpleHttpClientConfig, sigV4ClientConfig) {
        return new _APIGatewayClient2.default(simpleHttpClientConfig, sigV4ClientConfig);
      }
    },
    utils: new _Utils2.default()
  }
}; /**
    * Created by Pedro on 3/29/2017.
    */

exports.apiGateway = apiGateway;
exports.APIGatewayClient = _APIGatewayClient2.default;
exports.Utils = _Utils2.default;
exports.SigV4Client = _SigV4Client2.default;
exports.SimpleHttpClient = _SimpleHttpClient2.default;
exports.uritemplate = _urlTemplate.uritemplate;