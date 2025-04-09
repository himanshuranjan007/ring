/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bridge_steps', function(table) {
    table.increments('id').primary();
    table.string('tx_id').notNullable();
    table.string('name').notNullable();
    table.enum('status', ['pending', 'in_progress', 'completed', 'failed']).defaultTo('pending');
    table.timestamp('timestamp');
    table.integer('order').notNullable();
    
    // Foreign key
    table.foreign('tx_id').references('tx_id').inTable('bridge_transactions').onDelete('CASCADE');
    
    // Indexes
    table.index('tx_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('bridge_steps');
}; 