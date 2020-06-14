/* eslint-disable camelcase */
/* eslint-disable import/extensions */
/* eslint-disable lines-between-class-members */

import { Resource, State, Collection } from "synapse";
import { Email, Id, Text, Hash, Word, Password } from "synapse/lib/fields";
import { field, schema, expose } from "synapse/lib/meta";
import User from "./User";
import Session from "./Session";

import db = require("../victoria");

export default class Message extends Resource {
  @field(new Id()) message_id: string;
  @field(new Text()) message: string;
  @field(new Id()) posted_by: string;
  @field(new Text()) created_at: string;
  @field(new Text()) tag_name: string;

  @schema(Message.union(Session).select("message_id", "client_id"))
  static async verifyAuthor({ message_id, client_id }) {
    const messageQuery = `SELECT * FROM messages WHERE message_id = '${message_id}'`;
    const sessionQuery = `SELECT * FROM sessions WHERE client_id = '${client_id}'`;
    const sessionResult = await db.query(sessionQuery);
    const messageResult = await db.query(messageQuery);
    console.log(sessionResult.rows[0], messageResult.rows[0]);
    const { posted_by } = messageResult.rows[0];
    const { user_id } = sessionResult.rows[0];
    if (user_id === posted_by) return State.OK();
    return State.UNAUTHORIZED();
  }

  @expose("DELETE /:message_id")
  @schema(Message.union(Session).select("message_id", "client_id"))
  static async remove({ message_id, client_id }) {
    const allowed = await Message.verifyAuthor({ message_id, client_id });
    if (allowed.__meta__.status === 200) {
      const query = `DELETE FROM messages WHERE message_id = '${message_id}'`;
      return db.query(query).then((res) => State.OK());
    }
    return State.UNAUTHORIZED();
  }

  @expose("PATCH /:message_id")
  @schema(Message.union(Session).select("message_id", "message", "client_id"))
  static async update({ message_id, message, client_id }) {
    const allowed = await Message.verifyAuthor({ message_id, client_id });
    if (allowed.__meta__.status === 200) {
      const query = `UPDATE messages
                     SET message = '${message}'
                     WHERE message_id = '${message_id}'
                     RETURNING *`;
      const result = await db.query(query);
      const tagQuery = `SELECT tag_name FROM tags WHERE message_id = '${message_id}'`;
      const tagResult = await db.query(tagQuery);
      const { tag_name } = tagResult.rows[0];
      return Message.create({ ...result.rows[0], tag_name });
    }
    return State.UNAUTHORIZED();
  }

  @expose("POST /")
  @schema(Message.union(Session).select("message", "client_id", "tag_name"))
  static async post({ message, client_id, tag_name }) {
    const userQuery = `SELECT user_id FROM sessions WHERE client_id = '${client_id}'`;
    const userResult = await db.query(userQuery);
    const { user_id } = userResult.rows[0];
    const messageQuery = `INSERT INTO messages (message, posted_by) VALUES ($1, $2) RETURNING *`;
    const messageValues = [`${message}`, `${user_id}`];
    const messageResult = await db.query(messageQuery, messageValues);
    const { message_id, created_at, posted_by } = messageResult.rows[0];
    const tagQuery = `INSERT INTO tags (message_id, tag_name) VALUES($1, $2) RETURNING *`;
    const tagValues = [`${message_id}`, `${tag_name}`];
    const tagResult = await db.query(tagQuery, tagValues);
    return Message.create({ message_id, message, posted_by, created_at, tag_name });
  }

  @expose("GET /:tag_name")
  @schema(Message.schema.select("tag_name"))
  static async getByTag({ tag_name }) {
    const query = `SELECT message_id FROM tags WHERE tag_name = '${tag_name}'`;
    const collection = await db.query(query);
    const collectionOfMessages = await Promise.all(
      collection.rows.map(async (obj) => {
        const res = await db.query(`SELECT * FROM messages WHERE message_id = '${obj.message_id}'`);
        return { ...res.rows[0], tag_name };
      })
    );
    console.log(collectionOfMessages);
    return Message.collection(<Array<object>>collectionOfMessages);
  }
}

// static async invalidate(path: string) {
//   const queries = this.dependents.from(path);
//   return Promise.all(queries.map(async (query) => this.set(query)));
// }
// @field(new Id()) _id: string;    ++
//   @field(new Text()) message: string; ++
//   @field(new Id()) posted_by: string; ++
//   @field(new Text()) created_at: string; ++
//   @field(new Text()) tag_name: string;++
