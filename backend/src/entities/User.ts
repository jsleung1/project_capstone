export interface User {
    userId: string;
    createdAt: string;

    userName: string;  

    userType: string;
    email: string;
}

export const Instructor = 'Instructor'
export const Student = 'Student'
