import { Schedule } from "../types/schedule.type";
export declare class CreateScheduleDto implements Partial<Schedule> {
    scheduleDate: Date;
    whatsappId: number;
    toUserId: number;
    byUserId: number;
    sectorId: number;
}
