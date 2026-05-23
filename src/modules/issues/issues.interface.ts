export interface IIssue {
    title: string;
    description: string;
    type: "bug" | "feature_request";
}

export interface IIssueUpdate {
    title?: string;
    description?: string;
    type?: "bug" | "feature_request";
    status?: "open" | "in_progress" | "resolved";
}


