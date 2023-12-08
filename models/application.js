const query = require("../db/dbConnection");
const { multipleColumnSet, multipleColumnGet } = require("../utils/common");
const Role = require("../constants/user");
const { v4: uuidv4 } = require("uuid");
const ApplicationStatus = require("../constants/application");

class ApplicationModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM application`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGet(params);

    const sql = `SELECT * FROM application WHERE ${columnSet} LIMIT 1`;
    const result = await query(sql, [...values]);

    return result[0];
  };

  findBy = async (params) => {
    const { columnSet, values } = multipleColumnGet(params);

    var sql = `SELECT * FROM application WHERE ${columnSet}`;

    const result = await query(sql, [...values]);

    return result;
  };

  //find all applications of a job
  findApplicationOfJob = async (jobId) => {
    const sql = `SELECT * FROM application WHERE jobId = ?`;
    const result = await query(sql, [jobId]);
    return result;
  };

  //find all applications of a user
  findApplicationOfJobSeeker = async (user_id) => {
    const sql = `SELECT * FROM application WHERE jobseekerId = ?`;
    const result = await query(sql, [user_id]);
    return result;
  };

  create = async (jobseekerId, jobId) => {
    const id = uuidv4();
    const sql = `INSERT INTO application (id, jobseekerId, jobId, status) VALUES (?,?,?,?)`;

    const result = await query(sql, [id, jobseekerId, jobId, ApplicationStatus.Pending]);

    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };

  update = async (params, jobseekerId, jobId) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE application SET ${columnSet} WHERE jobseekerId = ? AND jobId = ?`;

    const result = await query(sql, [...values, jobseekerId, jobId]);

    return result;
  };

  updateById = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE application SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (jobseekerId, jobId) => {
    const sql = `DELETE FROM application WHERE jobseekerId = ? AND jobId = ?`;
    const result = await query(sql, [jobseekerId, jobId]);

    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new ApplicationModel();
