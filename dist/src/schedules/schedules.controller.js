"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_service_1 = require("../services/prisma.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const http_errors_1 = require("@rgranatodutra/http-errors");
const utils_1 = require("inpulse-crm/utils");
const instances_service_1 = __importDefault(require("../services/instances.service"));
const detailedQuery_select_1 = require("./query/detailedQuery.select");
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
class SchedulesController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.router.get("/api/wa-schedules/:clientName", this.findAllByClient);
        this.router.get("/api/wa-schedules/:clientName/:toUserId", this.findAllByUser);
        this.router.post("/api/wa-schedules/:clientName", (0, utils_1.validateDto)(create_schedule_dto_1.CreateScheduleDto), this.create);
        this.router.patch("/api/wa-schedules/:clientName/:scheduleId", (0, utils_1.validateDto)(update_schedule_dto_1.UpdateScheduleDto), this.update);
        this.router.delete("/api/wa-schedules/:clientName/:scheduleId", this.remove);
    }
    async create(req, res) {
        const clientName = req.params.clientName;
        const body = req.body;
        const insertedSchedule = await prisma_service_1.prisma.schedule.create({ data: { clientName, ...body } });
        const url = `${process.env.WHATSAPP_SERVICE_URL}/api/${clientName}/custom-routes/finish-attendance`;
        console.log("URL", url);
        await axios_1.default.post(url, {
            operatorId: body.toUserId,
            sectorId: body.sectorId,
            contactId: body.whatsappId,
        });
        return res.status(201).json({ message: "successful inserted schedule", data: insertedSchedule });
    }
    async update(req, res) {
        const { clientName, scheduleId } = req.params;
        const body = req.body;
        const findSchedule = await prisma_service_1.prisma.schedule.findUnique({ where: { id: scheduleId, clientName } });
        if (!findSchedule) {
            throw new http_errors_1.NotFoundError("schedule not found");
        }
        const updatedSchedule = await prisma_service_1.prisma.schedule.update({ where: { id: scheduleId, clientName }, data: body });
        return res.status(200).json({ message: "successful updated schedule", data: updatedSchedule });
    }
    async remove(req, res) {
        const { clientName, scheduleId } = req.params;
        const findSchedule = await prisma_service_1.prisma.schedule.findUnique({ where: { id: scheduleId, clientName } });
        if (!findSchedule) {
            throw new http_errors_1.NotFoundError("schedule not found");
        }
        const removedSchedule = await prisma_service_1.prisma.schedule.delete({ where: { id: scheduleId, clientName } });
        return res.status(200).json({ message: "successful removed schedule", data: removedSchedule });
    }
    async findAllByClient(req, res) {
        const { clientName } = req.params;
        const schedules = await prisma_service_1.prisma.schedule.findMany({
            where: { clientName, alreadyStarted: false },
            orderBy: { scheduleDate: "asc" }
        });
        const usersQuery = detailedQuery_select_1.FETCH_USER_DETAILS + "\nWHERE CODIGO IN (?)";
        const userIds = Array.from(new Set([...schedules.map(s => s.toUserId), ...schedules.map(s => s.byUserId)]));
        const users = userIds.length ? await instances_service_1.default.runQuery(clientName, usersQuery, [userIds]) : [];
        const contactsQuery = detailedQuery_select_1.FETCH_CONTACT_DETAILS + "\nWHERE ctt.CODIGO IN (?)";
        const contactIds = Array.from(new Set(schedules.map(s => s.whatsappId)));
        const contacts = contactIds.length ? await instances_service_1.default.runQuery(clientName, contactsQuery, [contactIds]) : [];
        const sectorsQuery = detailedQuery_select_1.FETCH_SECTOR_DETAILS + "\nWHERE CODIGO IN (?)";
        const sectorIds = Array.from(new Set(schedules.map(s => s.sectorId)));
        const sectors = sectorIds.length ? await instances_service_1.default.runQuery(clientName, sectorsQuery, [sectorIds]) : [];
        const detailedSchedules = schedules.map(s => {
            const toUser = users.find(u => u.id === s.toUserId);
            const byUser = users.find(u => u.id === s.byUserId);
            const contact = contacts.find(c => c.id === s.whatsappId);
            const sector = sectors.find(sec => sec.id === s.sectorId);
            return { toUserName: toUser.userName, byUserName: byUser.userName, ...contact, ...sector, ...s };
        });
        return res.status(200).json({ message: "successful fetched client schedules", data: detailedSchedules });
    }
    async findAllByUser(req, res) {
        try {
            const { clientName, toUserId } = req.params;
            const schedules = await prisma_service_1.prisma.schedule.findMany({
                where: { clientName, toUserId: +toUserId, alreadyStarted: false },
                orderBy: { scheduleDate: "asc" }
            });
            const usersQuery = detailedQuery_select_1.FETCH_USER_DETAILS + "\nWHERE CODIGO IN (?)";
            const userIds = Array.from(new Set([...schedules.map(s => s.toUserId), ...schedules.map(s => s.byUserId)]));
            const users = userIds.length ? await instances_service_1.default.runQuery(clientName, usersQuery, [userIds]) : [];
            const contactsQuery = detailedQuery_select_1.FETCH_CONTACT_DETAILS + "\nWHERE ctt.CODIGO IN (?)";
            const contactIds = Array.from(new Set(schedules.map(s => s.whatsappId)));
            const contacts = contactIds.length ? await instances_service_1.default.runQuery(clientName, contactsQuery, [contactIds]) : [];
            const sectorsQuery = detailedQuery_select_1.FETCH_SECTOR_DETAILS + "\nWHERE CODIGO IN (?)";
            const sectorIds = Array.from(new Set(schedules.map(s => s.sectorId)));
            const sectors = sectorIds.length ? await instances_service_1.default.runQuery(clientName, sectorsQuery, [sectorIds]) : [];
            const detailedSchedules = schedules.map(s => {
                const toUser = users.find(u => u.id === s.toUserId);
                const byUser = users.find(u => u.id === s.byUserId);
                const contact = contacts.find(c => c.id === s.whatsappId);
                const sector = sectors.find(sec => sec.id === s.sectorId);
                return { toUserName: toUser.userName, byUserName: byUser.userName, ...contact, ...sector, ...s };
            });
            return res.status(200).json({ message: "successful fetched user schedules", data: detailedSchedules });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "unknown server error", err });
        }
    }
}
exports.default = SchedulesController;
//# sourceMappingURL=schedules.controller.js.map