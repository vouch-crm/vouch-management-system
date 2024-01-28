"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employmentType = exports.employeeRequests = exports.serviceStatuses = exports.adminRoles = void 0;
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
    employeeRequests["EARLYLEAVE"] = "early-leave";
})(employeeRequests || (exports.employeeRequests = employeeRequests = {}));
var employmentType;
(function (employmentType) {
    employmentType["FULLTIME"] = "full-time";
    employmentType["PARTTIME"] = "part-time";
    employmentType["CONTRACTOR"] = "contractor";
})(employmentType || (exports.employmentType = employmentType = {}));
