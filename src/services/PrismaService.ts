import { Prisma, PrismaClient } from "@prisma/client";
import keystorage from "./keystorage";

export default class DBService {

    public prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createRelayer(address: string) {
        try {
            await this.prisma.relayer.create({
                data: {
                    id: address
                }
            })
            console.log("Relayer Inserted")
        } catch(e) {}
    }

    async seedRelayers() {
        keystorage.forEach(async(key) => {
            await this.createRelayer(key.address);
        });
        console.log(`ALL RELAYERS INSERTED`)
    }

    async createTransaction(transactionId: string) {
        await this.prisma.transaction.create({
            data: {
                id: transactionId
            }
        })
    }
}