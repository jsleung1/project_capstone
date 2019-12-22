export interface Assignment {

    assignmentId?: string;
    courseId?: string;
    createdAt?: string;
    
    courseCode?: string;
    instructorId?: string;
    instructorName?: string;

    assignmentName: string;
    assignmentDescription: string;
    dueDate: string;
}