exports.up = function (knex, Promise) {
    return knex.schema.createTable('pupils', function (table) {
        table.increments();
        table.string('name').notNullable(); 
        table.string('sname').notNullable();
        table.integer('classroom_id').notNullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('pupils');
};