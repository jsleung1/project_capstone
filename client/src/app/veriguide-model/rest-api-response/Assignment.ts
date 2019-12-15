export interface Assignment {

    assignmentId?: string;
    courseId?: string;
    createdAt?: string;
    
    courseName?: string;
    instructorId?: string;
    instructorName?: string;

    assignmentName: string;
    assignmentDescription: string;
    dueDate: string;
}