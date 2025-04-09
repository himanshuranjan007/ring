/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bridge_transactions', function(table) {
    table.string('tx_id').primary();
    table.integer('source_chain_id').notNullable();
    table.integer('destination_chain_id').notNullable();
    table.string('token_symbol').notNullable();
    table.string('amount').notNullable();
    table.string('wallet_address').notNullable();
    table.string('destination_address');
    table.enum('status', ['pending', 'in_progress', 'completed', 'failed']).defaultTo('pending');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.timestamp('estimated_completion_time');
    table.timestamp('completion_time');
    
    // Indexes
    table.index('wallet_address');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('bridge_transactions');
}; 