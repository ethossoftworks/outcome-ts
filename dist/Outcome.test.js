/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Outcome.test.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Outcome.test.ts":
/*!*****************************!*\
  !*** ./src/Outcome.test.ts ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Outcome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Outcome */ "./src/Outcome.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const result2 = yield _Outcome__WEBPACK_IMPORTED_MODULE_0__["Outcome"].wrap(testPromise());
        if (result2.isError()) {
            console.warn(result2.error);
            return;
        }
        console.log(result2.value);
        const result3 = yield _Outcome__WEBPACK_IMPORTED_MODULE_0__["Outcome"].wrap(testBadPromise());
        if (result3.isError()) {
            console.warn(result3.error);
        }
        else {
            console.log(result3.value);
        }
        const result1 = yield test();
        if (result1.isError()) {
            console.warn(result1.error);
            return;
        }
        console.log(result1.value);
    });
}
function testPromise() {
    return new Promise((resolve, reject) => {
        resolve("Good Promise");
    });
}
function testBadPromise() {
    return new Promise((resolve, reject) => {
        reject("Bad Promise");
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        if (Math.round(Math.random()) === 1) {
            return _Outcome__WEBPACK_IMPORTED_MODULE_0__["Outcome"].err("Random: Error");
        }
        return _Outcome__WEBPACK_IMPORTED_MODULE_0__["Outcome"].val("Random: Success");
    });
}
main();


/***/ }),

/***/ "./src/Outcome.ts":
/*!************************!*\
  !*** ./src/Outcome.ts ***!
  \************************/
/*! exports provided: Outcome */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Outcome", function() { return Outcome; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Outcome;
(function (Outcome) {
    function val(value) {
        return new OutcomeValue(value);
    }
    Outcome.val = val;
    function err(error) {
        return new OutcomeError(error);
    }
    Outcome.err = err;
    function wrap(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new OutcomeValue(yield promise);
            }
            catch (e) {
                return new OutcomeError(e);
            }
        });
    }
    Outcome.wrap = wrap;
})(Outcome || (Outcome = {}));
class OutcomeError {
    constructor(error) {
        this.error = error;
    }
    isError() {
        return true;
    }
}
class OutcomeValue {
    constructor(value) {
        this.value = value;
    }
    isError() {
        return false;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=Outcome.test.js.map