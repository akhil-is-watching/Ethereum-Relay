import { NonceManager } from "./NonceManager";
import DBService from "./PrismaService";
import TransactionService from "./TransactionService";
import crypto from 'crypto'
import { EIP1559Transaction } from "./interfaces";

const nonceManager = new NonceManager();
const transactionService = new TransactionService(nonceManager);
const DB = new DBService();
DB.seedRelayers();

// const sendTransaction =async (transactionId:string, transaction:EIP1559Transaction) => {
//     try {
//         await transactionService.sendTransaction(transactionId, transaction);
//     } catch(e: any) {
//         console.log(`Error`);
//     }
// }

export { transactionService, DB }