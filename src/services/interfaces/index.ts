interface ITransaction {
    to: string;
    value: string;
    data?: string;
    nonce?: number;
    gasLimit: string;
}


interface EIP1559Transaction extends ITransaction {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string
}

interface EIP2930Transaction extends ITransaction {
    gasPrice: string;
}

export { EIP1559Transaction, EIP2930Transaction }

