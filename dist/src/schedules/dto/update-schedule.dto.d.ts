import { Schedule } from "../types/schedule.type";
export declare class UpdateScheduleDto implements Partial<Schedule> {
    scheduleDate: Date;
    startedAt?: Date;
    alreadyStarted?: boolean;
}
