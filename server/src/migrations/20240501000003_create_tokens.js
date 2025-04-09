/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tokens', function(table) {
    table.increments('id').primary();
    table.string('symbol').notNullable();
    table.string('name').notNullable();
    table.string('icon').notNullable();
    table.integer('chain_id').notNullable();
    table.string('contract_address');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Composite unique constraint
    table.unique(['symbol', 'chain_id']);
    
    // Indexes
    table.index('chain_id');
    table.index('symbol');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tokens');
}; 