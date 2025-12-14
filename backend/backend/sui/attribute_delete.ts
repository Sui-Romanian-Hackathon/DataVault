import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { Transaction } from '@mysten/sui/transactions';

/**
 * Deletes an existing attribute from a client.
 */
export const attribute_delete = async (
  privateKey: string,
  packageId: string,
  clientId: string,
  clientOwnerCapId: string,
  attributeId: string
): Promise<void> => {
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  const { secretKey } = decodeSuiPrivateKey(privateKey);
  const signer = Secp256k1Keypair.fromSecretKey(secretKey);

  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::client::attribute_delete`,
    arguments: [
      tx.object(clientId),
      tx.object(clientOwnerCapId),
      tx.object(attributeId), 
    ],
  });

  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });

  if (result.effects?.status.status !== 'success') {
    throw new Error(result.effects?.status.error);
  }
};
