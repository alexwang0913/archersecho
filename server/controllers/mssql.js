const sql = require('mssql')

exports.list = async (req, res) => {
  try {
    /**

SELECT section_group, section_name, data_point_group_key, data_point, data_point_value FROM tblACRReportData WITH (NOLOCK) WHERE report_id = (SELECT MAX(report_id) FROM tblACRReportData) ORDER BY data_id

SELECT TOP(1) * FROM tblACRReports WITH (NOLOCK) ORDER BY report_id DESC

     */
    // const query =
    // 'SELECT section_group, section_name, data_point_group_key, data_point, data_point_value FROM tblACRReportData WITH (NOLOCK) WHERE report_id = (SELECT MAX(report_id) FROM tblACRReportData) ORDER BY data_id'
    const query =
      'SELECT TOP(1) * FROM tblACRReports WITH (NOLOCK) ORDER BY report_id DESC'
    const result = await sql.query(query)
    res.status(200).json(result)
  } catch (err) {
    console.log(err)
  }
}
