import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

/**
 * Retrieves a specific Attribute object by its ID.
 */
export async function attribute_get(attributeId: string): Promise<{
  data: string;
  is_public: boolean;
} | null> {
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  try {
    const response = await client.getObject({
      id: attributeId,
      options: { showContent: true },
    });

    if (!response.data || !response.data.content) {
      console.warn(`Attribute ${attributeId} not found`);
      return null;
    }

    const content = response.data.content;

    if (content.dataType !== 'moveObject') {
      console.warn(`Object ${attributeId} is not a Move object`);
      return null;
    }

    const fields = content.fields as any;

    return {
      data: fields.data,
      is_public: fields.is_public,
    };

  } catch (error) {
    console.error('Error in attribute_get:', error);
    throw error;
  }
}
