"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceStatuses = exports.adminRoles = void 0;
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
