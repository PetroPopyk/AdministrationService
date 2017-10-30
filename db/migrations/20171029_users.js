exports.up = function (knex, Promise) {
    return knex.schema.createTable('AdministrationUsers', function (table) {
        table.increments();
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.string('role').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('AdministrationUsers');
};
