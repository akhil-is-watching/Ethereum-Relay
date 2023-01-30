import express, {Request, Response, NextFunction} from 'express'
import {DB, transactionService} from '../services';
import crypto from 'crypto'
import { randomBytes } from 'ethers/lib/utils';

const submitTransaction = async(req: Request, res: Response, next: NextFunction) => {
    const transaction = req.body;
    const transactionId = `0x${crypto.createHash('sha256').update(transaction + Date.now() + randomBytes(5)).digest('hex')}`;
    await DB.createTransaction(transactionId);
    await transactionService.sendTransaction(transactionId, transaction)

    res.status(200).json({ transactionId: transactionId })
}

const getTransansctions = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await DB.prisma.transaction.findMany({});
        res.status(200).json({ transactions: transactions });
    } catch(e: any) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }   
}

const getTransactionById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const transactionId = req.body
        const transaction = await DB.prisma.transaction.findFirst({
            where: {
                id: transactionId
            }
        })

        res.status(200).json({ transaction: transaction });
    } catch(e: any) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }  
}

export default { submitTransaction };