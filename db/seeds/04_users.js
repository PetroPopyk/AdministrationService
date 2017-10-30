exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('AdministrationUsers').del()
        .then(function () {
            // Inserts seed entries
            return knex('AdministrationUsers').insert([
                {
                    id: 1,
                    login: 'admin',
                    password: 'admin',
                    role: 'admin'
                },
                {
                    id: 2,
                    login: 'mod',
                    password: 'mod',
                    role: 'moderator'
                },
                {
                    id: 3,
                    login: 'user',
                    password: 'user',
                    role: 'user'
                }
      ]);
        });
};
