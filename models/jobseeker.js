const query = require("../db/dbConnection");
const { multipleColumnSet, multipleColumnGetInner, multipleColumnInsert } = require("../utils/common");

class JobseekerModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM user INNER JOIN jobseeker ON user.id = jobseeker.id`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGetInner("jobseeker", params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGetInner("jobseeker", params);
    const sql = `SELECT * FROM user INNER JOIN jobseeker ON user.id = jobseeker.id WHERE ${columnSet} LIMIT 1`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async (params) => {
    const { sql, values } = multipleColumnInsert("jobseeker", params);
    const result = await query(sql, [...values]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE jobseeker SET ${columnSet} WHERE id = ?`;
    const result = await query(sql, [...values, id]);

    return result;
  };
}

module.exports = new JobseekerModel();
