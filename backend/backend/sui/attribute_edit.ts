import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { Transaction } from '@mysten/sui/transactions';

/**
 * Edits an existing attribute on a client.
 */
export const attribute_edit = async (
  privateKey: string,
  packageId: string,
  clientId: string,
  clientOwnerCapId: string,
  attributeId: string,
  newData: string,
  isPublic: boolean
): Promise<void> => {
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  const { secretKey } = decodeSuiPrivateKey(privateKey);
  const signer = Secp256k1Keypair.fromSecretKey(secretKey);

  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::client::attribute_edit`,
    arguments: [
      tx.object(clientId),
      tx.object(clientOwnerCapId),
      tx.object(attributeId),      
      tx.pure.string(newData),     
      tx.pure.bool(isPublic),      
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
