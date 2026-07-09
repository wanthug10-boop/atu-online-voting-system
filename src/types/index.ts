export type Role = "STUDENT" | "ELECTION_COMMITTEE" | "SUPER_ADMIN";
export type ElectionType = "SRC" | "DEPARTMENTAL" | "HALL" | "CLASS";
export type ElectionStatus = "PENDING" | "ACTIVE" | "CLOSED" | "ARCHIVED";
export type CandidateStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AuthUser {
  id: string;
  studentId: string;
  email: string;
  name: string;
  role: Role;
}
