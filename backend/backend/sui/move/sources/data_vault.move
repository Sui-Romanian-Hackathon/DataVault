module data_vault::client {
  use std::string::String;
  use sui::object_table::{Self, ObjectTable};

  const ENotOwner: u64 = 0;
  const ETableNotEmpty: u64 = 1;

  public struct AttributeData has store, drop {
    data: String,
    is_public: bool,
  }

  public struct Attribute has key, store {
    id: UID,
    data: AttributeData,
  }

  public struct Client has key {
    id: UID,
    attributes: ObjectTable<ID, Attribute>,
  }

  public struct ClientOwnerCap has key, store {
    id: UID,
    client: ID,
  }


  #[allow(lint(self_transfer))]
  public fun client_new(ctx: &mut TxContext) {
    let client_uid = object::new(ctx);
    let client_id = object::uid_to_inner(&client_uid);

    let client = Client {
      id: client_uid,
      attributes: object_table::new(ctx), 
    };

    let cap = ClientOwnerCap {
      id: object::new(ctx),
      client: client_id
    };

    transfer::share_object(client);
    transfer::public_transfer(cap, tx_context::sender(ctx));
  }

  public fun client_delete(
    client: Client,
    cap: ClientOwnerCap
  ) {
    assert!(cap.client == object::id(&client), ENotOwner);

    let Client { id, attributes } = client;

    if (!object_table::is_empty(&attributes)) {
      abort ETableNotEmpty
    };
    object_table::destroy_empty(attributes);

    object::delete(id);

    let ClientOwnerCap { id: cap_id, client: _ } = cap;
    object::delete(cap_id);
  }

  public fun attribute_new(
    client: &mut Client,
    cap: &ClientOwnerCap,
    data: String,
    is_public: bool,
    ctx: &mut TxContext,
  ) {
    assert!(cap.client == object::id(client), ENotOwner);

    let id = object::new(ctx);
    let attribute_id = object::uid_to_inner(&id);

    let attribute = Attribute {
      id,
      data: AttributeData {
        data,
        is_public,
      }
    };

    client.attributes.add(attribute_id, attribute);
  }

  public fun attribute_delete(
    client: &mut Client, 
    cap: &ClientOwnerCap, 
    attribute_id: ID 
  ) {
    assert!(cap.client == object::id(client), ENotOwner);

    let attribute = client.attributes.remove(attribute_id);

    let Attribute { id, data: _ } = attribute;

    object::delete(id);
  }

  public fun attribute_edit(
    client: &mut Client, 
    cap: &ClientOwnerCap, 
    attribute_id: ID,
    new_data: String, 
    is_public: bool
  ) {
    assert!(cap.client == object::id(client), ENotOwner);
    
    let attribute = client.attributes.borrow_mut(attribute_id);

    attribute.data.data = new_data;
    attribute.data.is_public = is_public;
  }
}
