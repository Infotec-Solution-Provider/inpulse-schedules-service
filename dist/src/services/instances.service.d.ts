import "dotenv/config";
declare class Instances {
    private static mannager;
    static runQuery<T>(clientName: string, query: string, values: Array<any>): Promise<T>;
}
export default Instances;
