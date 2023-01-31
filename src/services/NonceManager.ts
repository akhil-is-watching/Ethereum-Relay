import { ethers } from "ethers";
import keystorage from "./keystorage";

export class NonceManager {

    relayers: Map<string, number>;
    public provider: ethers.providers.JsonRpcProvider;


    constructor() {
        this.relayers = new Map<string, number>();
        
        // this.provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/KWo03EtX54m_F8Hfarz6xYA3Jv-G9UGi")
        this.provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon/fac3cca9a3b738e938055119183a64b0e107cd6a19e2a5a31a101638e244ed15")
        // this.provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/twOhOlAtTXa6n2_pCOcjrKIRJVaNmJrf")
        this.seedRelayers();
    }

    seedRelayers() {
        keystorage.forEach(async(key) => {
            this.relayers.set(key.address, await this.getLatestNonce(key.address))
        })
        console.log(`All relayers nonce synced`)
    }

    async getLatestNonce(address: string) {
        let recordNonce = await this.provider.getTransactionCount(address, "pending"); 
        let customNonce = this.relayers.get(address)
        if(customNonce === undefined) customNonce = 0;
        let nonce = recordNonce > customNonce ? recordNonce : customNonce
        return nonce;
    }

    incrementNonce(address: string) {
        let currentNonce = this.relayers.get(address);
        if(currentNonce === undefined) return 0;
        this.relayers.set(address, currentNonce+1);
    }

}