export enum adminRoles {
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin'
}

export enum serviceStatuses {
    SUCCESS = 'Success',
    ERROR = 'Error',
    FAILED = 'Failed'
}

export enum employeeRequests {
    HOLIDAY = 'holiday',
    SICK = 'sick',
    WORKFROMHOME = 'work-from-home',
}

export enum employmentType {
    FULLTIME = 'full-time',
    PARTTIME = 'part-time',
    CONTRACTOR = 'contractor'
}

export enum payFrequency {
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    FOUR_WEEKLY = '4-weekly',
    BI_WEEKLY = 'bi-weekly',
    BI_MONTHLY = 'bi-monthly'
}

export enum basis {
    PER_HOUR = 'per hour',
    PER_DAY = 'per day',
    PER_WEEK = 'per week',
    PER_MONTH = 'per month',
    PER_ANNUM = 'per annum'
}

export enum revenueType {
    CONFIRMED = 'Confirmed',
    AWAITING_APPROVAL = 'Awaiting Approval',
    OPPORTUNITY = 'Opportunity',
    NEW_LEADS = 'New Leads'
}