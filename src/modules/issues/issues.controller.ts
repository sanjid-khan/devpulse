import type { Request, Response, NextFunction } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";


const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reportedId = req.user!.id;
        const result = await issuesService.createIssueIntoDB(req.body, reportedId);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode:  500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};


const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result  = await issuesService.getAllIssuesFromDB();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result.rows,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode:  500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};


const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result  = await issuesService.getSingleIssueFromDB(id as string);

        if (result.rows.length === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                error: {},
            });
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode:  500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = req.user!;

        const result = await issuesService.updateIssueFromDB(
            req.body,
            id as string,
            user.id,
            user.role
        );

        if (result.rows.length === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                error: {},
            });
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode:  500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await issuesService.deleteIssueFromDB(id as string);

        if (result.rowCount === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                error: {},
            });
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};


export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}