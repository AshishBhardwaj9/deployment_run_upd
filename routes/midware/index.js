"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuth = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../dbSetup/index"); //destructuring whaterever object is returned from dbSetup. Can also use const db=require('../dbSetup') and then use db.User db.Todo
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use((0, cors_1.default)());
const secret = 'sigmaUser';
function userValTkn(bToken) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = bToken.split(" ")[1];
        try {
            //const {username:uName,password:uPass}=jwt.verify(token,secret);
            const value = jsonwebtoken_1.default.verify(token, secret);
            // const uName=(<any>value).username;
            // const uPass=(<any>value).password;
            var exist = yield (index_1.User).findOne(({ username: value.username, password: value.password }));
            if (exist) {
                return { "message": true, "username": value.username };
            }
            else {
                return { "message": false };
            }
        }
        catch (error) {
            console.log("JWT invalid " + error);
            if (error.toString().indexOf("jwt expired")) {
                return { "message": "expiry" };
            }
            else
                return { "message": "Error" };
        }
    });
}
const userAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.headers.Authorization);
    var result = yield userValTkn(req.headers.Authorization);
    console.log(result);
    if (result.message == "expiry") {
        return ({ "message": "Session expired" });
    }
    else if (!result.message) {
        return ({ "message": "user not found" });
    }
    else if (result.message == "Error") {
        return ({ "message": "Error" });
    }
    else {
        return ({ "message": "Logged in", "username": result.username });
    }
});
exports.userAuth = userAuth;
