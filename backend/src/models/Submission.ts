export interface Submission {
    submissionId: string;
    assignmentId: string;
    createdAt: string;

    studentId: string;
    studentName: string;
    studentEmail: string;    
   
    instructorComments: string;
    studentScore: number;
    similarityPercentage: number;
    reportStatus: string;
    
    fileName: string;
    submissionFileUrl: string;
}
  