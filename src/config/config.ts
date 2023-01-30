import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const RPC_URL = process.env.RPC_URL || 'http://45.79.181.218:8080/'
const RELAYER_PRIV_KEY = process.env.RELAYER_PRIV_KEY || "";


export const config = {
    rpc: {
        url: RPC_URL,
        privKey: RELAYER_PRIV_KEY,
    },
    server: {
        port: SERVER_PORT
    }
};