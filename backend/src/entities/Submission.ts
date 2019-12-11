export interface Submission {
    submissionId: string;
    assignmentId: string;
    createdAt: string;

    assignmentName: string;
    studentId: string;
    studentName: string;
    studentEmail: string;    
    fileName: string;
    instructorId: string;
    instructorName: string;

    instructorComments: string;
    studentScore: number;
    similarityPercentage: number;
    reportStatus: string;
    studentRemarks: string;
    
    submissionFileUrl: string;
    submissionUploadUrl: string;
}
  