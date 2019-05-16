'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _set = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/set"));

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/typeof"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.for-each");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

module.exports =
/*#__PURE__*/
function () {
  function Utils() {
    (0, _classCallCheck2["default"])(this, Utils);
  }

  (0, _createClass2["default"])(Utils, null, [{
    key: "sortObjectKeys",
    value: function sortObjectKeys(obj) {
      var sort = function sort(obj) {
        var tmp = {};
        (0, _keys["default"])(obj).sort().forEach(function (k) {
          if ((0, _isArray["default"])(obj[k])) {
            var p = [];
            obj[k].forEach(function (item) {
              if (item != null && (0, _typeof2["default"])(item) === "object") {
                p.push(sort(item));
              } else {
                p.push(item);
              }
            });
            tmp[k] = p;
          } else if (obj[k] != null && (0, _typeof2["default"])(obj[k]) === "object") {
            tmp[k] = sort(obj[k]);
          } else if (obj[k] != null && typeof obj[k] === "function") {
            tmp[k] = evil(obj[k].toString());
          } else {
            tmp[k] = new String(obj[k]).toString();
          }
        });
        return tmp;
      };

      return sort(obj);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(obj) {
      switch ((0, _typeof2["default"])(obj)) {
        case "undefined":
          {
            return true;
          }

        case "string":
          {
            return obj.length === 0;
          }

        case "number":
          {
            return obj === 0;
          }

        case "object":
          {
            if (obj == null) {
              return true;
            } else if ((0, _isArray["default"])(obj)) {
              return obj.length === 0;
            } else {
              return (0, _keys["default"])(obj).length === 0;
            }
          }
      }
    }
  }, {
    key: "toString",
    value: function toString(str) {
      if (typeof str === "number") {
        str = str.toLocaleString();
        return str.replace(/[,]/g, '');
      } else if (this.isEmpty(str)) {
        return "";
      } else {
        return str.toString();
      }
    }
  }, {
    key: "hasRepeatElement",
    value: function hasRepeatElement(target, splitChar) {
      if (!(target instanceof Array)) {
        if (this.isEmpty(splitChar)) {
          throw new Error("split char is empty");
        }

        target = target.split(splitChar);
      }

      var srcLen = target.length;
      var eSet = new _set["default"](target);
      return !(srcLen == eSet.size);
    }
  }]);
  return Utils;
}();

function evil(fn) {
  var Fn = Function;
  return new Fn('return ' + fn)();
}