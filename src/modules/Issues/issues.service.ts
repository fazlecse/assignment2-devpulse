import pool from "../../db";
import type { IIssue, IQuery } from "./issues.interface";

const createIussueIntoDB = async (payload: IIssue, reporter_id: string) => {
  const { title, description, type } = payload;
  const reporter = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [reporter_id],
  );
  if (reporter.rows.length === 0) {
    throw new Error("Reporter not exists!");
  }
  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4) RETURNING *
      `,
    [title, description, type, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (query: IQuery) => {
  const { sort = "newest", type, status } = query;

  const conditions: string[] = [];
  const values: any[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause =
    sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";

  const issuesResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues ${whereClause} ${orderClause}`,
    values,
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((i: any) => i.reporter_id))];
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const reporterMap: Record<number, any> = {};
  for (const r of reportersResult.rows) {
    reporterMap[r.id] = r;
  }

  return issues.map(({ reporter_id, ...issue }: any) => ({
    ...issue,
    reporter: reporterMap[reporter_id] ?? null,
  }));
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1`,
    [id],
  );
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueFromDB = async (
  payload: IIssue,
  id: string,
  user: { id: string; role: string },
) => {
  const { title, description, type } = payload;

  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueResult.rows[0];

  if (user.role === "contributor") {
    if (String(issue.reporter_id) !== String(user.id)) {
      throw new Error("You can only update your own issues!");
    }
    if (issue.status !== "open") {
      throw new Error(
        "Contributors can only update issues with status 'open'!",
      );
    }
  }

  const result = await pool.query(
    `
      UPDATE issues SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type)
      WHERE id = $4 RETURNING *
    `,
    [title, description, type, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id],
  );
  return result;
};

export const issuesService = {
  createIussueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
};
