const query = require("../db/dbConnection");
const { multipleColumnGet, multipleColumnSet, multipleColumnInsert } = require("../utils/common");
class EducationModel {
  find = async (params = {}) => {
    let sql = `SELECT * FROM education`;

    if (!Object.keys(params).length) {
      return await query(sql);
    }

    const { columnSet, values } = multipleColumnGet(params);
    sql += ` WHERE ${columnSet}`;

    return await query(sql, [...values]);
  };

  findOne = async (params) => {
    const { columnSet, values } = multipleColumnGet(params);

    const sql = `SELECT * FROM education WHERE ${columnSet} LIMIT 1`;

    const result = await query(sql, [...values]);

    return result[0];
  };

  create = async (params) => {
    const { sql, values } = await multipleColumnInsert("education", params);
    const result = await query(sql, [...values]);
    const affectedRows = result ? result.affectedRows : 0;
    return affectedRows;
  };

  update = async (params, id) => {
    const { columnSet, values } = multipleColumnSet(params);

    const sql = `UPDATE education SET ${columnSet} WHERE id = ?`;

    const result = await query(sql, [...values, id]);

    return result;
  };

  delete = async (id) => {
    const sql = `DELETE FROM education WHERE id = ?`;
    const result = await query(sql, [id]);
    const affectedRows = result ? result.affectedRows : 0;

    return affectedRows;
  };
}

module.exports = new EducationModel();
