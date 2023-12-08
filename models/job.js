const query = require("../db/dbConnection");
const { multipleColumnGet, multipleColumnSet, multipleColumnInsert } = require("../utils/common");
const { v4: uuidv4 } = require("uuid");
class JobModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM job`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findInner = async (params = {}) => {
    let sql = `SELECT * FROM job INNER JOIN user ON job.author = user.id`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGet(params);

    const sql = `SELECT * FROM job WHERE ${columnSet} LIMIT 1`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  findLimit = async (params = {}, limit) => {
    let sql = `SELECT * FROM job`;

    if (!Object.keys(params).length) {
      return await query(sql + ` LIMIT ${limit}`);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet} LIMIT ${limit}`;

    return await query(sql, [...values]);
  };

  findLimitOffset = async (params = {}, limit, offset) => {
    let sql = `SELECT * FROM job`;

    if (!Object.keys(params).length) {
      return await query(sql + ` LIMIT ${limit} OFFSET ${offset}`);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet} LIMIT ${limit} OFFSET ${offset}`;

    return await query(sql, [...values]);
  };

  findLimitNotApplied = async (limit) => {
    let sql = `SELECT * FROM job INNER JOIN application ON job.id = application.jobId LIMIT ${limit}`;

    return await query(sql);
  };

  findLimitOffsetNotApplied = async (limit, offset) => {
    let sql = `SELECT * FROM job INNER JOIN application ON job.id = application.jobId LIMIT ${limit} OFFSET ${offset}`;

    return await query(sql);
  };

  create = async (params) => {
    const { sql, values } = await multipleColumnInsert("job", params);
    const result = await query(sql, [...values]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE job SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM job WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new JobModel();
