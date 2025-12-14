module identity_vault_anchor::identity_vault {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    struct VaultAnchored has copy, drop {
        vault_id: address,
        owner: address,
        version: u64,
        commitment: vector<u8>,
    }
    struct IdentityVault has key {
        id: UID,
        owner: address,
        version: u64,
        commitment: vector<u8>,
        updated_at_ms: u64,
    }
    public entry fun create_vault(commitment: vector<u8>, now_ms: u64, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let vault = IdentityVault {
            id: object::new(ctx),
            owner: sender,
            version: 1,
            commitment,
            updated_at_ms: now_ms,
        };

        event::emit(VaultAnchored {
            vault_id: object::uid_to_address(&vault.id),
            owner: sender,
            version: vault.version,
            commitment: vault.commitment,
        });

        transfer::transfer(vault, sender);
    }
    public entry fun update_commitment(
        vault: &mut IdentityVault,
        new_commitment: vector<u8>,
        now_ms: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == vault.owner, 0);

        vault.version = vault.version + 1;
        vault.commitment = new_commitment;
        vault.updated_at_ms = now_ms;
    }

    public fun get_version(vault: &IdentityVault): u64 { vault.version }
    public fun get_owner(vault: &IdentityVault): address { vault.owner }
}
