"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const RPC_URL = process.env.RPC_URL || 'http://45.79.181.218:8080/';
const RELAYER_PRIV_KEY = process.env.RELAYER_PRIV_KEY || "";
exports.config = {
    rpc: {
        url: RPC_URL,
        privKey: RELAYER_PRIV_KEY,
    },
    server: {
        port: SERVER_PORT
    }
};
