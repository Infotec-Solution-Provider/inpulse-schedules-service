"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FETCH_CONTACT_DETAILS = exports.FETCH_SECTOR_DETAILS = exports.FETCH_USER_DETAILS = void 0;
exports.FETCH_USER_DETAILS = "SELECT CODIGO as id, NOME AS userName FROM operadores";
exports.FETCH_SECTOR_DETAILS = "SELECT CODIGO AS id, NOME AS sectorName FROM w_setores";
exports.FETCH_CONTACT_DETAILS = "SELECT\n" +
    "\tctt.CODIGO as id,\n" +
    "\tcli.RAZAO as customerName,\n" +
    "\tcli.CPF_CNPJ as customerCnpj,\n" +
    "\tctt.NOME as contactName\n" +
    "FROM w_clientes_numeros ctt\n" +
    "LEFT JOIN clientes cli ON cli.CODIGO = ctt.CODIGO_CLIENTE";
//# sourceMappingURL=detailedQuery.select.js.map