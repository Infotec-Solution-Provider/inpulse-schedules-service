"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_service_1 = require("../services/prisma.service");
const axios_1 = __importDefault(require("axios"));
async function checkSchedules() {
    const currentDate = new Date();
    const schedules = await prisma_service_1.prisma.schedule.findMany({
        where: {
            scheduleDate: { lte: currentDate },
            alreadyStarted: false
        }
    });
    await Promise.all(schedules.map(async (schedule) => {
        console.log(new Date().toLocaleString(), `Schedule for ${schedule.clientName}: `, schedule.id, schedule.scheduleDate);
        const url = `http://localhost:8000/api/${schedule.clientName}/custom-routes/start-attendance`;
        const attendanceData = {
            operatorId: schedule.toUserId,
            contactId: schedule.whatsappId,
            sectorId: schedule.sectorId,
            is_schedule: 1
        };
        await Promise.all([
            axios_1.default.post(url, attendanceData),
            prisma_service_1.prisma.schedule.update({ where: { id: schedule.id }, data: { startedAt: new Date(), alreadyStarted: true } })
        ]);
    }));
}
const runSchedulesJob = () => node_cron_1.default.schedule('*/1 * * * *', checkSchedules);
exports.default = runSchedulesJob;
//# sourceMappingURL=schedules.job.js.map