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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const dbSetup_1 = require("../dbSetup"); //destructuring whaterever object is returned from dbSetup. Can also use const db=require('../dbSetup') and then use db.User db.Todo
var router = express_1.default.Router();
const secret = 'sigmaUser';
const zLCred = zod_1.z.object({
    username: zod_1.z.string().min(1).max(8),
    password: zod_1.z.string().min(1).max(8)
});
const zSCred = zod_1.z.object({
    firstname: zod_1.z.string().min(1),
    lastname: zod_1.z.string().min(1),
    username: zod_1.z.string().min(1).max(8),
    password: zod_1.z.string().min(1).max(8),
    // td_list:z.array(z.string()).refine((val)=> val==[])
});
function genJWT(value) {
    let token = jsonwebtoken_1.default.sign(value, secret, { expiresIn: 300 });
    return token;
}
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseLCred = zLCred.safeParse(req.body);
    console.log(parseLCred);
    if (!parseLCred.success) {
        res.status(400).json({ "message": "invalid credential type, " + parseLCred.error });
    }
    else if (parseLCred.success) {
        var exist = yield dbSetup_1.User.findOne(({ username: parseLCred.data.username, password: parseLCred.data.password }));
        if (exist) {
            let token = genJWT(parseLCred.data);
            console.log(token);
            res.json({ "token": token, "username": parseLCred.data.username });
        }
        else {
            res.json({ "message": "user not found" });
        }
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseSCred = zSCred.safeParse(req.body);
    if (!parseSCred.success) {
        // res.status(400).json({"message":"Invalid credential type, "+parseSCred.error})
        var err = parseSCred.error.issues;
        var msgData = 'An error occured at: ';
        err.forEach(e => {
            if (err.indexOf(e) == err.length - 1) {
                msgData += e.path + "-" + e.message + ".";
            }
            else {
                msgData += e.path + "-" + e.message + "; ";
            }
        });
        res.status(400).json({ "message": msgData });
    }
    else {
        var exist = yield dbSetup_1.User.findOne(({ username: parseSCred.data.username, password: parseSCred.data.password }));
        if (exist) {
            res.json({ "message": "user already exists" });
        }
        else {
            var newUser = new dbSetup_1.User(parseSCred.data);
            newUser.save();
            let token = genJWT(req.body);
            res.json({ "token": token, "username": parseSCred.data.username });
        }
    }
}));
exports.default = router;
