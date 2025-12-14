import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

/**
 * Retrieves the list of Attribute IDs stored in the Client.attributes ObjectTable.
 * @param clientId - The ID of the Client object
 * @returns Array of Attribute object IDs or null if failed
 */
export async function client_get_attributes(
  clientId: string
): Promise<string[] | null> {
  try {
    const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

    const clientObj = await suiClient.getObject({
      id: clientId,
      options: { showContent: true },
    });

    if (!clientObj.data?.content) {
      console.warn(`Client object ${clientId} not found or has no content.`);
      return null;
    }

    const content = clientObj.data.content;

    if (content.dataType !== 'moveObject' || !('fields' in content)) {
      console.warn('Client object is not a Move object.');
      return null;
    }

    const fields = content.fields as any;

    if (!fields.attributes?.fields?.id) {
      console.warn("Field 'attributes' not found on Client object.");
      return null;
    }
    const attributesTableId: string = fields.attributes.fields.id;

    const attributeIds: string[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await suiClient.getDynamicFields({
        parentId: attributesTableId,
        cursor,
        limit: 50,
      });

      for (const item of response.data) {
        attributeIds.push(item.objectId);
      }

      hasNextPage = response.hasNextPage;
      cursor = response.nextCursor;
    }

    return attributeIds;

  } catch (error) {
    console.error('Error in client_get_attributes:', error);
    throw error;
  }
}
