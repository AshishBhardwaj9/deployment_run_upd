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
const index_1 = require("../dbSetup/index");
const index_2 = require("../midware/index");
const router = express_1.default.Router();
let retUName = "";
function fetchAllTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield index_1.User.findOne({ username: retUName }).populate('td_list');
        if (user) {
            return user.td_list;
        }
        else {
            return [];
        }
    });
}
function writeTodo(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var newtd = new index_1.Todo(payload);
        yield newtd.save();
        var user = yield index_1.User.findOne({ username: retUName });
        if (user) {
            user.td_list.push(newtd._id);
            yield user.save();
        }
    });
}
function updateTodo(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var upd = yield index_1.Todo.findOneAndUpdate({ id: id }, data, { new: true });
        if (upd) {
            return true;
        }
        else {
            return false;
        }
        //   var look=await Todo.findOne({id:id});
        //   var f=  await Todo.findOneAndUpdate({_id:look._id},data,{new:true});
        //console.log('f '+f);
    });
}
function deleteTodo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var look = yield index_1.Todo.findOne({ id: id });
        var user = yield index_1.User.findOne({ username: retUName });
        if (user && look) {
            user.td_list.splice(user.td_list.indexOf(look._id), 1);
            yield user.save();
            return (index_1.Todo.deleteOne({ id: id }).then(() => { return true; }).catch((err) => { console.log(err); return false; }));
        }
        else {
            return false;
        }
    });
}
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var token = req.headers.authorization;
    console.log("Token: " + token);
    if (token) {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        };
        var toSend = {
            method: 'POST',
            'headers': headers
        };
        const resp = yield (0, index_2.userAuth)(toSend);
        console.log(resp);
        if (resp.message == 'Logged in') {
            retUName = resp.username;
            next();
        }
        else if (resp.message == "Session expired") {
            res.json({ "message": "Session expired" });
        }
        else if (resp.message == "Error") {
            res.json({ "message": "An error occured. Login again" });
        }
        else {
            res.json({ "message": "User not found, login again" });
        }
    }
}));
router.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield fetchAllTodo());
}));
router.get('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var id = req.params.id;
    var val = (yield fetchAllTodo()).find((i) => (i.id).toString() == id);
    val ? res.json(val) : res.json({ "message": "Not found" });
}));
router.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var allTd = yield fetchAllTodo();
    var val = "";
    if (allTd.length) {
        val = allTd.find((i) => i.id == req.body.id);
    }
    console.log(val);
    if (!val) {
        yield writeTodo(req.body);
        res.json({ 'message': 'Todo with id ' + req.body.id + ' created successfully.' });
    }
    else {
        res.json({ 'message': 'Todo with same id already exists' });
    }
    ;
}));
router.put('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var allTd = yield fetchAllTodo();
    var val = allTd.find((i) => (i.id).toString() == req.params.id);
    //console.log('Val: '+val);
    if (val) {
        var upRes = yield updateTodo(req.params.id, req.body);
        if (upRes) {
            res.json({ 'message': 'Todo with id ' + req.params.id + ' updated successfully.' });
        }
        else {
            res.json({ 'message': 'Todo with id ' + req.params.id + ' update usuccessful' });
        }
    }
    else {
        res.json({ 'message': 'Todo with id ' + req.body.id + ' doesnt exist' });
    }
}));
router.delete('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var allTd = yield fetchAllTodo();
    var val = allTd.find((i) => (i.id).toString() == req.params.id);
    //console.log(val);
    if (val) {
        var delRes = yield deleteTodo(req.params.id);
        console.log(delRes);
        if (delRes == true) {
            res.json({ 'message': 'Todo with id ' + req.params.id + ' deleted successfully.' });
        }
        else {
            res.json({ 'message': 'Todo with id ' + req.params.id + ' deletion unsuccessful.' });
        }
    }
    else {
        res.json({ 'message': 'Todo with id ' + req.params.id + ' doesnt exist' });
    }
}));
exports.default = router;
