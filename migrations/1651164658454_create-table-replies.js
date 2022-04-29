/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    commentid: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"comments"',
      onDelete: "cascade",
    },
    userid: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    content: { type: "text", notNull: true },
    date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: {
      type: "BOOLEAN",
      default: false,
    },
  });
  pgm.createIndex("replies", "commentid");
  pgm.createIndex("replies", "userid");
};

exports.down = (pgm) => {
  pgm.dropTable("replies");
};
