"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("inpulse-crm/connection");
require("dotenv/config");
class Instances {
    static async runQuery(clientName, query, values) {
        const response = await this.mannager.executeQuery(clientName, query, values);
        return response.result;
    }
}
Instances.mannager = new connection_1.InstancesMannager(process.env.INSTANCES_SERVICE_URL);
exports.default = Instances;
//# sourceMappingURL=instances.service.js.map