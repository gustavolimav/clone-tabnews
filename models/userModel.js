import database from "../infra/database.js";

class UserModel {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create({ username, email, passwordHash }) {
    const result = await database.query(
      `INSERT INTO users (username, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *;`,
      [username, email, passwordHash],
    );

    return new UserModel(result.rows[0]);
  }

  static async getById(id) {
    const result = await database.query(`SELECT * FROM users WHERE id = $1;`, [
      id,
    ]);

    if (result.rows.length === 0) {
      console.error("User not found");
      return undefined;
    }

    return new UserModel(result.rows[0]);
  }

  static async update(id, { username, email, passwordHash }) {
    const result = await database.query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           email = COALESCE($2, email), 
           password_hash = COALESCE($3, password_hash), 
           updated_at = NOW() 
       WHERE id = $4 
       RETURNING *;`,
      [username, email, passwordHash, id],
    );

    if (result.rows.length === 0) {
      console.error("User not found");
      return undefined;
    }

    return new UserModel(result.rows[0]);
  }

  static async delete(id) {
    const result = await database.query(
      `DELETE FROM users WHERE id = $1 RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      console.error("User not found");
      return undefined;
    }

    return new UserModel(result.rows[0]);
  }

  static async getAll() {
    const result = await database.query(
      `SELECT * FROM users ORDER BY created_at DESC;`,
    );

    return result.rows.map((row) => new UserModel(row));
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default UserModel;
