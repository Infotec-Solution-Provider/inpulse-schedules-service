export declare const FETCH_USER_DETAILS = "SELECT CODIGO as id, NOME AS userName FROM operadores";
export declare const FETCH_SECTOR_DETAILS = "SELECT CODIGO AS id, NOME AS sectorName FROM w_setores";
export declare const FETCH_CONTACT_DETAILS: string;
export interface UserDetails {
    id: number;
    userName: string;
}
export interface SectorDetails {
    id: number;
    sectorName: string;
}
export interface ContactDetails {
    id: number;
    customerName: string;
    customerCnpj: string;
    contactName: string;
    sectorName: string;
}
