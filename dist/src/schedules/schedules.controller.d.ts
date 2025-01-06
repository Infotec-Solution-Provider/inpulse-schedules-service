import { Router } from "express";
import "dotenv/config";
declare class SchedulesController {
    readonly router: Router;
    constructor();
    private create;
    private update;
    private remove;
    private findAllByClient;
    private findAllByUser;
}
export default SchedulesController;
