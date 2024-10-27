/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    username: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },
    email: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    last_login: {
      type: "timestamp",
      notNull: false,
    },
  });

  // Add an index on email to speed up queries for login or lookups
  pgm.createIndex("users", "email");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
