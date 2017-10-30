exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('teachers').del()
        .then(function () {
            // Inserts seed entries
            return knex('teachers').insert([
                {
                    id: 1,
                    name: 'NTeacher1',
                    sname: 'SNteacher1'
                },
                {
                    id: 2,
                    name: 'NTeacher2',
                    sname: 'SNteacher2'
                },
                {
                    id: 3,
                    name: 'NTeacher3',
                    sname: 'SNteacher3'
                }
      ]);
        });
};
