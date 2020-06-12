/* eslint-disable import/extensions */
/* eslint-disable lines-between-class-members */

import { Resource, State } from "synapse";
import { Email, Id, Text, Hash, Word, Password } from "synapse/lib/fields";
import { field, schema, expose } from "synapse/lib/meta";

import db = require("../victoria");

export default class User extends Resource {
  @field(new Id()) _id: string;
  @field(new Word(3, 16)) username: string;
  @field(new Text()) password: string;

  static async find({ username }) {
    const query = `SELECT FROM users WHERE username = "${username}"`;
    // make SQL query /  find user / check pass / get user back / use his ID if needed.
    db.query(query)
      .then((data) => {
        if (!data.rows[0]) return "fuck you";
        return User.create(data.rows[0]);
      })
      .catch((err) => err);
  }
  // post request /
  static async login({ username, password }) {
    const query = `SELECT FROM users WHERE username = "${username}"`;
    db.query(query).then((data) => {
      if (!data.rows[0]) return "fuck u";
      // check the password
      return User.create(data.rows[0]);
    });
  }

  @expose("POST /") // => /api/user/
  @schema(User.schema.exclude("_id", "password").extend({ password: new Hash(6) }))
  static async register({ username, password }) {
    const query = `INSERT INTO users (username, password) VALUES ("${username}","${password})`;
    db.query(query)
      .then((user) => User.create(user))
      .catch((err) => err);
  }
}
