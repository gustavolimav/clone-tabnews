import database from "infra/database";

async function create(userInputValues) {
  const results = await database.query({
    text: `
        INSERT INTO 
          users (username, password, email) 
        VALUES 
          ($1, $2, $3)
        RETURNING
          id, username, email, created_at, updated_at
        ;`,
    values: [userInputValues.username, userInputValues.password, userInputValues.email],
  });

  return results.rows[0];
}

const user = {
  create,
};

export default user;