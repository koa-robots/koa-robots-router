'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    let root = arguments.length <= 0 || arguments[0] === undefined ? '.' : arguments[0];
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    root = (0, _path.normalize)((0, _path.resolve)(root));

    options = Object.assign({
        routes: null,
        index: '/index'
    }, options);

    for (let key in options.routes) {
        console.log(key);
    }

    return function* (next) {
        let path = (0, _path.join)(root, (this.path === '/' ? options.index : this.path) + '.js');

        try {
            if ((yield _coFs2.default.stat(path)).isFile()) {
                yield _interopRequireDefault(require(path)).default().call(this);
            }
        } catch (err) {
            if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code)) {
                return;
            }
        }

        yield next;
    };
};

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault2(_coFs);

var _path = require('path');

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}