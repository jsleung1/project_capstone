export interface Submission {
    submissionId: string;
    assignmentId: string;
    studentId: string;
    
    createdAt: string;

    instructorComments: string;
    studentScore: number;
    similarityPercentage: number;

    submissionFileUrl?: string;
}
  