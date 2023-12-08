const query = require("../db/dbConnection");
const { multipleColumnGet } = require("../utils/common");
const { v4: uuidv4 } = require("uuid");
class BookmarkModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM bookmark`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGet(params);

    const sql = `SELECT * FROM bookmark WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async (jobseekerId, jobId) => {
    const id = uuidv4();
    const sql = `INSERT INTO bookmark (id, jobseekerId, jobId) VALUES (?,?,?)`;
    const result = await query(sql, [id, jobseekerId, jobId]);

    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  delete = async (jobseekerId, jobId) => {
    const sql = `DELETE FROM bookmark WHERE jobseekerId = ? AND jobId = ?`;
    const result = await query(sql, [jobseekerId, jobId]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new BookmarkModel();
