import { pool } from "../../db/index.js";

const getMetricsFromDB = async () => {
  const users = await pool.query(`SELECT COUNT(*)::int AS total_users FROM users`);
  const issues = await pool.query(`SELECT COUNT(*)::int AS total_issues FROM issues`);
  const openIssues = await pool.query(`SELECT COUNT(*)::int AS open_issues FROM issues WHERE status='open'`);
  const inProgressIssues = await pool.query(`SELECT COUNT(*)::int AS in_progress_issues FROM issues WHERE status='in_progress'`);
  const resolvedIssues = await pool.query(`SELECT COUNT(*)::int AS resolved_issues FROM issues WHERE status='resolved'`);
  const bugIssues = await pool.query(`SELECT COUNT(*)::int AS bugs FROM issues WHERE type='bug'`);
  const featureIssues = await pool.query(`SELECT COUNT(*)::int AS feature_requests FROM issues WHERE type='feature_request'`);

  return {
    total_users: users.rows[0].total_users,
    total_issues: issues.rows[0].total_issues,
    open_issues: openIssues.rows[0].open_issues,
    in_progress_issues: inProgressIssues.rows[0].in_progress_issues,
    resolved_issues: resolvedIssues.rows[0].resolved_issues,
    bugs: bugIssues.rows[0].bugs,
    feature_requests: featureIssues.rows[0].feature_requests,
  };
};

export const metricsService = {
  getMetricsFromDB,
};
