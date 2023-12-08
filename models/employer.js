const query = require("../db/dbConnection");
const { multipleColumnSet, multipleColumnGet, multipleColumnGetInner, multipleColumnInsert } = require("../utils/common");

class EmployerModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM user INNER JOIN employer ON user.id = employer.id`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGetInner("employer", params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGetInner("employer", params);
    const sql = `SELECT * FROM user INNER JOIN employer ON user.id = employer.id WHERE ${columnSet} LIMIT 1`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async (params) => {
    const { sql, values } = multipleColumnInsert("employer", params);
    const result = await query(sql, [...values]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE employer SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };
}

module.exports = new EmployerModel();
