export interface ReportSharingRequestShareeDTO  {

    request_id?: number;
    acad_year?: number;
    term?: string;
    subject_area?: string;
    catalog_number?: string;
    section_code?: string;
    yearTermCourseCode?: string;
    yearTermCourseCodeSection?: string;
    yearTermCourseCodeSectionName?: string;
    owner_school_login?: string;
    request_school_login?: string;
    request_time?: string;
    endorse_type?: string;
    share_level?: string;
    share_mode?: string;
    sharee?: string;
    sharee_role_unit?: string;
    endorsement_status?: string;
    shareeName?: string;
    courseOwnerName?: string;
    shareRequesterName?: string;

    approve?: string;
}
