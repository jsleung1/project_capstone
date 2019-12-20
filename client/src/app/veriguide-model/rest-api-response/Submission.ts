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
    instructorEmail: string;
    
    instructorComments?: string;
    studentScore?: number;
    studentReferences: string;
    
    submissionFileUrl: string;
    submissionUploadUrl: string;

    similarityPercentage: number;

    uploadDateTime: string;
    expandedInstructorComments: boolean;
    expandedReferences: boolean;
    studentScoreStr: string;

    origInstructorComments?: string;
    origStudentScore?: number;
    origStudentReferences?: string;
}
  