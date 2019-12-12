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
    studentRemarks: string;
    
    submissionFileUrl: string;
    submissionUploadUrl: string;

    similarityPercentage: number;
    reportStatus: string;
    reportCreateTime: string;
}
  