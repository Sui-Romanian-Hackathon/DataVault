import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

export async function client_get(
  privateKey: string,
  packageId: string
): Promise<{ ClientOwnerCapId: string; clientId: string } | null> {
  try {
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    const { secretKey } = decodeSuiPrivateKey(privateKey);
    const keypair = Secp256k1Keypair.fromSecretKey(secretKey);
    const address = keypair.toSuiAddress();

    const structType = `${packageId}::client::ClientOwnerCap`;

    const response = await suiClient.getOwnedObjects({
      owner: address,
      filter: { StructType: structType },
      options: { showContent: true },
    });

    if (!response.data.length) {
      console.warn(`No ClientOwnerCap found for ${address}`);
      return null;
    }

    const obj = response.data[0].data;
    if (
      obj?.content?.dataType !== 'moveObject' ||
      !('fields' in obj.content)
    ) {
      return null;
    }

    const fields = obj.content.fields as any;

    if (!fields.client?.id) {
      console.warn('ClientOwnerCap has no linked client');
      return null;
    }

    return {
      ClientOwnerCapId: obj.objectId,
      clientId: fields.client.id, 
    };

  } catch (error) {
    console.error('Error in client_get:', error);
    throw error;
  }
}
