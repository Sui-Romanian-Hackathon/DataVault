import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { Transaction } from '@mysten/sui/transactions';

export const client_new = async (
  privateKey: string,
  packageId: string
): Promise<void> => {
  try {
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    const { secretKey } = decodeSuiPrivateKey(privateKey);
    const signer = Secp256k1Keypair.fromSecretKey(secretKey);

    const tx = new Transaction();

    tx.moveCall({
      target: `${packageId}::client::client_new`,
      arguments: [],
    });

    const result = await suiClient.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true, 
      },
    });

    if (result.effects?.status.status !== 'success') {
      throw new Error(
        `client_new failed: ${result.effects?.status.error}`
      );
    }

    console.log('client_new success');
  } catch (error) {
    console.error('Error in client_new:', error);
    throw error;
  }
};
