"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueType = exports.basis = exports.payFrequency = exports.employmentType = exports.employeeRequests = exports.serviceStatuses = exports.adminRoles = void 0;
var adminRoles;
(function (adminRoles) {
    adminRoles["SUPERADMIN"] = "superadmin";
    adminRoles["ADMIN"] = "admin";
})(adminRoles || (exports.adminRoles = adminRoles = {}));
var serviceStatuses;
(function (serviceStatuses) {
    serviceStatuses["SUCCESS"] = "Success";
    serviceStatuses["ERROR"] = "Error";
    serviceStatuses["FAILED"] = "Failed";
})(serviceStatuses || (exports.serviceStatuses = serviceStatuses = {}));
var employeeRequests;
(function (employeeRequests) {
    employeeRequests["HOLIDAY"] = "holiday";
    employeeRequests["SICK"] = "sick";
    employeeRequests["WORKFROMHOME"] = "work-from-home";
})(employeeRequests || (exports.employeeRequests = employeeRequests = {}));
var employmentType;
(function (employmentType) {
    employmentType["FULLTIME"] = "full-time";
    employmentType["PARTTIME"] = "part-time";
    employmentType["CONTRACTOR"] = "contractor";
})(employmentType || (exports.employmentType = employmentType = {}));
var payFrequency;
(function (payFrequency) {
    payFrequency["WEEKLY"] = "weekly";
    payFrequency["MONTHLY"] = "monthly";
    payFrequency["FOUR_WEEKLY"] = "4-weekly";
    payFrequency["BI_WEEKLY"] = "bi-weekly";
    payFrequency["BI_MONTHLY"] = "bi-monthly";
})(payFrequency || (exports.payFrequency = payFrequency = {}));
var basis;
(function (basis) {
    basis["PER_HOUR"] = "per hour";
    basis["PER_DAY"] = "per day";
    basis["PER_WEEK"] = "per week";
    basis["PER_MONTH"] = "per month";
    basis["PER_ANNUM"] = "per annum";
})(basis || (exports.basis = basis = {}));
var revenueType;
(function (revenueType) {
    revenueType["CONFIRMED"] = "Confirmed";
    revenueType["AWAITING_APPROVAL"] = "Awaiting Approval";
    revenueType["OPPORTUNITY"] = "Oppurtunity";
    revenueType["NEW_LEADS"] = "New Leads";
})(revenueType || (exports.revenueType = revenueType = {}));
