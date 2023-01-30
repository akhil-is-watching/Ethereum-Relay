import { ethers } from "ethers";
import { NonceManager } from "./NonceManager";
import keystorage from "./keystorage";
import DBService from "./PrismaService";
import { EIP1559Transaction } from "./interfaces";

export default class TransactionService {
    provider: ethers.providers.JsonRpcProvider;
    nonceManager: NonceManager;
    DB: DBService

    relayers: Array<string>;
    wallets: Map<string, ethers.Wallet>;
    relayerIndex: number;

    constructor(nonceManager: NonceManager) {
        this.nonceManager = nonceManager;
        this.provider = nonceManager.provider;
        // this.wallet = new ethers.Wallet("999b52c67291e1dece82f1c4b51a7f2b9f4c678d52497f318edd9ef5c2513326", this.provider);
        this.relayers = [];
        this.wallets = new Map<string, ethers.Wallet>();
        this.seedWallets();
        this.relayerIndex = 0;
        this.DB = new DBService();
    }

    seedWallets() {
        keystorage.forEach(key => {
            this.relayers.push(key.address);
            this.wallets.set(key.address, new ethers.Wallet(key.privateKey, this.provider));
        });
        console.log(`All wallet object initialized`);
    }

    parseTransactionReceipt(transactionReceipt: ethers.providers.TransactionResponse) {
        const txReceipt = {
            hash: transactionReceipt.hash,
            from: transactionReceipt.from,
            to: transactionReceipt.to,
            nonce: transactionReceipt.nonce,
            value: transactionReceipt.value,
            data: transactionReceipt.data,
            blockNumber: transactionReceipt.blockNumber,
            rawTransaction: transactionReceipt.raw
        }

        return JSON.stringify(txReceipt);
    }

    getNextRelayer() {
        let currentRelayer = this.relayers[this.relayerIndex];
        this.relayerIndex = (this.relayerIndex + 1) % this.relayers.length;
        return currentRelayer;
    }


    async sendTransaction(transactionId: string, transaction: EIP1559Transaction) {
        let relayer = this.getNextRelayer();
        let nonce = await this.nonceManager.getLatestNonce(relayer);
        console.log(`Sending from ${relayer} with nonce ${nonce}`)
        let wallet = this.wallets.get(relayer);
        transaction.nonce = nonce;
        wallet?.sendTransaction(transaction)
            .then(async(transactionReceipt) => {
                console.log(`txHash : ${transactionReceipt.hash}`)
                let trxn = {
                    id: transactionId,
                    from: relayer,
                    hash: transactionReceipt.hash,
                    nonce: nonce,
                    success: true,
                    pending: false,
                    transactionReceipt: JSON.stringify(transactionReceipt)
                }
                await this.DB.prisma.transaction.update({
                    where: {
                        id: transactionId
                    },
                    data: {
                        relayerId: relayer,
                        txHash: transactionReceipt.hash,
                        nonce: nonce,
                        status: "SUCCESS",
                        txObject: this.parseTransactionReceipt(transactionReceipt)
                    }
                })
            })
            .catch(async(error: any) => {
                console.log(`Transaction failed with nonce: ${nonce}`);
                await this.nonceManager.getLatestNonce(relayer);
                await this.DB.prisma.transaction.update({
                    where: {
                        id: transactionId
                    },
                    data: {
                        relayerId: relayer,
                        nonce: -1,
                        status: "FAILED"
                    }
                })
            })
        this.nonceManager.incrementNonce(relayer);
    }

}