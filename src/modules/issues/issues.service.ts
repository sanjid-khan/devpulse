import { pool } from "../../db"
import type { IIssue,IIssueUpdate } from "./issues.interface"


const createIssueIntoDB = async (payload: IIssue, reporterId: number)=>{

    const { title, description, type } = payload;

    if (!["bug", "feature_request"].includes(type)) {
        throw new Error("Invalid type! Must be bug or feature_request..");
    }

    const result = await pool.query(
        `INSERT INTO issues(title, description, type, reporter_id)
         VALUES($1, $2, $3, $4)
         RETURNING *`,
        [title, description, type, reporterId]
    );

    return result;

}



const getAllIssuesFromDB = async () => {

    const issues = await pool.query(
        `SELECT * FROM issues`
    );

    if (issues.rows.length === 0) {
        throw new Error ("Issues not found !!")
    }

    const result = [];

    for (const issue of issues.rows) {
        const reporter = await pool.query(
            `SELECT id, name, role FROM users WHERE id=$1`,
            [issue.reporter_id]
        );

        const { reporter_id, created_at, updated_at, ...issueData } = issue;

        result.push({  ...issueData,  reporter: reporter.rows[0] ,  created_at, updated_at,});
    }

    
    issues.rows = result;
    return issues;
}



const getSingleIssueFromDB = async (id: string) => {

    const issue = await pool.query(
        `SELECT * FROM issues WHERE id=$1`,
        [id]
    );

    if (issue.rows.length === 0) {
       throw new Error("Issue not found!!");
    }

    const issueData = issue.rows[0];

    const reporter = await pool.query(
        `SELECT id, name, role FROM users WHERE id=$1`,
        [issueData.reporter_id]
    );


    const { reporter_id, created_at, updated_at, ...Issue } = issueData;
    issue.rows[0] = { ...Issue,  reporter: reporter.rows[0], created_at, updated_at, };


    return issue;
};



const updateIssueFromDB = async (payload: IIssueUpdate, id: string, userId: number, userRole: string) => {

    const existing = await pool.query(
        `SELECT * FROM issues WHERE id=$1`,
        [id]
    );

    if (existing.rows.length === 0) {
        throw new Error("Issue not found!");
    }


    const issue = existing.rows[0];


    if (userRole === "contributor") {
        if (issue.reporter_id !== userId) 
            {
            throw new Error("Forbidden! You can only update your own issues.");
        }


        if (issue.status !== "open") {
            throw new Error("Conflict! You can only update issues with open status.");
        }
    }

    const { title, description, type, status } = payload;


    if (type && !["bug", "feature_request"].includes(type)) {
        throw new Error("Invalid type! Must be bug or feature_request.");
    }

    
    if (status && userRole === "contributor") {
        throw new Error("Forbidden! Contributors cannot change status.");
    }


    if (status && !["open", "in_progress", "resolved"].includes(status)) {
        throw new Error("Invalid status! Must be open, in_progress or resolved.");
    }


    const result = await pool.query(
      `UPDATE issues
       SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       type = COALESCE($3, type),
       status = COALESCE($4, status),
       updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, description, type, status, id]
    );

    return result;

};



const deleteIssueFromDB = async(id: string)=>{

    const result = await pool.query(
        `DELETE FROM issues WHERE id=$1`,
        [id]
    );

    return result;

}


export const issuesService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueFromDB,
    deleteIssueFromDB
}
