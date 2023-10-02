"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("./routes/userReq/index"));
const uservalidation_1 = __importDefault(require("./routes/userReq/uservalidation"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/user', index_1.default);
app.use('/validation', uservalidation_1.default);
mongoose_1.default.connect('mongodb+srv://ashishjha115:Hind%40786@cluster8.ay8chck.mongodb.net/Todo_DB');
app.listen(3000, () => { console.log('Listening to 3000'); });

exports.default = app;
