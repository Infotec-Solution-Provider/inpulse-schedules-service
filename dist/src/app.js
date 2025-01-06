"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = require("@rgranatodutra/http-errors");
const schedules_controller_1 = __importDefault(require("./schedules/schedules.controller"));
const utils_1 = require("inpulse-crm/utils");
const schedules_job_1 = __importDefault(require("./schedules/schedules.job"));
const app = (0, express_1.default)();
const controllers = {
    schedules: new schedules_controller_1.default()
};
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(controllers.schedules.router);
Object.values(controllers).forEach(c => {
    const e = (0, utils_1.getRouterEndpoints)(c.router, "");
    e.forEach(r => console.log(`[ROUTE] ${r}`));
});
app.use(http_errors_1.handleRequestError);
(0, schedules_job_1.default)();
exports.default = app;
//# sourceMappingURL=app.js.map