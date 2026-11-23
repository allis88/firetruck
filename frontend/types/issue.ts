export type IssueStatus = "new" | "resolved";

export interface Issue {
  id: number;
  title: string;
  priority: number;
  status: IssueStatus;
}

export interface CreateIssueInput {
  title: string;
  priority: number;
}
