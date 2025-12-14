import { client_new } from './sui/client_new';
import { client_get } from './sui/client_get';
import { client_get_attributes } from './sui/client_get_attributes';
import { client_delete } from './sui/client_delete';

import { attribute_new } from './sui/attribute_new';
import { attribute_get } from './sui/attribute_get';
import { attribute_edit } from './sui/attribute_edit';
import { attribute_delete } from './sui/attribute_delete';

const PACKAGE_ID =
  '0xb85755f05fe8a84a7a796b913de3bab4d6af8698bf94df0dd5ad42bf60435e6d';

export interface Attribute {
  id: string;
  data: string;        // 🔒 encrypted blob
  is_public: boolean;
}

export interface Client {
  id: string;
  cap_id: string;
  attributes: Attribute[];
}

/**
 * Load client + encrypted attributes from Sui
 */
export async function load_encrypted(private_key: string): Promise<Client> {
  let client: Client = {
    id: '',
    cap_id: '',
    attributes: [],
  };

  const existing = await client_get(private_key, PACKAGE_ID);

  if (!existing) {
    await client_new(private_key, PACKAGE_ID);
  }

  const client_get_result = await client_get(private_key, PACKAGE_ID);
  if (!client_get_result) {
    throw new Error('Failed to load client');
  }

  client.id = client_get_result.clientId;
  client.cap_id = client_get_result.ClientOwnerCapId;

  const attrIds = await client_get_attributes(client.id);
  if (!attrIds) return client;

  for (const id of attrIds) {
    const attr = await attribute_get(id);
    if (!attr) continue;

    client.attributes.push({
      id,
      data: attr.data,         // 🔒 encrypted
      is_public: attr.is_public,
    });
  }

  return client;
}

/**
 * Save encrypted attributes
 */
export async function save(
  private_key: string,
  client: Client
): Promise<void> {
  for (const attr of client.attributes) {
    await attribute_edit(
      private_key,
      PACKAGE_ID,
      client.id,
      client.cap_id,
      attr.id,
      attr.data,        // 🔒 still encrypted
      attr.is_public
    );
  }
}

export async function create_attribute(
  private_key: string,
  client: Client,
  encryptedAttribute: Attribute
) {
  await attribute_new(
    private_key,
    PACKAGE_ID,
    client.id,
    client.cap_id,
    encryptedAttribute.data,
    encryptedAttribute.is_public
  );
}

export async function delete_attribute(
  private_key: string,
  client: Client,
  attribute_id: string
) {
  await attribute_delete(
    private_key,
    PACKAGE_ID,
    client.id,
    client.cap_id,
    attribute_id
  );
}

export async function delete_client(
  private_key: string,
  client: Client
) {
  if (client.attributes.length > 0) {
    throw new Error('Client still has attributes');
  }

  await client_delete(
    private_key,
    PACKAGE_ID,
    client.id,
    client.cap_id
  );
}
