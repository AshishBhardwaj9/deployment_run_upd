"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const USER = new mongoose_2.Schema({
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String },
    td_list: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Todo_collections' }]
});
// const USER=new mongoose.Schema({
//     firstname:String,
//     lastname:String,
//     password:String,
//     username:String,
//     td_list:[{type:mongoose.Schema.Types.ObjectId,ref:'Todo_collections'}]
// });
const TODO = new mongoose_1.default.Schema({
    id: { type: String },
    title: { type: String },
    description: { type: String },
    adNote: { type: String },
    dtRange: { type: String }
});
// const TODO=new mongoose.Schema({
//     id:String,
//     title:String,
//     description:String,
//     adNote:String,
//     dtRange:String
// });
const User = (0, mongoose_2.model)('Users', USER);
exports.User = User;
const Todo = (0, mongoose_2.model)('Todo_collections', TODO);
exports.Todo = Todo;
