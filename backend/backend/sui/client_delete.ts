import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { Transaction } from '@mysten/sui/transactions';

/**
 * Deletes a client on the Sui Testnet.
 * @param privateKey - string in secp256k1 encoding
 * @param packageId - The package ID where the module lives
 * @param clientObjectId - The ID of the Client object to delete
 * @param capObjectId - The ID of the ClientOwnerCap object
 */
export const client_delete = async (
  privateKey: string,
  packageId: string,
  clientObjectId: string,
  capObjectId: string
): Promise<void> => {
  try {
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    const { secretKey } = decodeSuiPrivateKey(privateKey);
    const signer = Secp256k1Keypair.fromSecretKey(secretKey);

    const tx = new Transaction();

    tx.moveCall({
      target: `${packageId}::client::client_delete`,
      arguments: [
        tx.object(clientObjectId),
        tx.object(capObjectId),
      ],
    });

    const result = await suiClient.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: { showEffects: true },
    });

    if (result.effects?.status.status !== 'success') {
      throw new Error(result.effects?.status.error ?? 'Transaction failed');
    }

  } catch (error) {
    console.error('Error in client_delete:', error);
    throw error;
  }
};
