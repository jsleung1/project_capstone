export interface User {
    userId: string;
    createdAt?: string;

    userType: string;

    email: string;
    userName: string;  
}

export const Instructor = 'Instructor'
export const Student = 'Student'