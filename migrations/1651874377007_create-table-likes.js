exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"comments"',
      onDelete: "cascade",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    date: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("likes", "comment_id");
  pgm.createIndex("likes", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("likes");
};
