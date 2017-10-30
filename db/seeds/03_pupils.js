exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('pupils').del().then(function () {
        // Inserts seed entries
        return knex('pupils').insert([
            {
                id: 1
                , name: 'NPupil1'
                , sname: 'SNPupil1'
                , classroom_id: 1
                }
            , {
                id: 2
                , name: 'NPupil2'
                , sname: 'SNPupil2'
                , classroom_id: 2
                }
            , {
                id: 3
                , name: 'NPupil3'
                , sname: 'SNPupil3'
                , classroom_id: 3
                }
      ]);
    });
};