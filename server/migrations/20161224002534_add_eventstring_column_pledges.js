
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pledges', function(table) {
      table.string('event_string').notNullable();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pledges', function(table) {
      table.dropColumn('event_string');
    })
  ])
};
