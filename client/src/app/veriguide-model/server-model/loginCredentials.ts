/**
 * VeriGuide REST API
 *
 * OpenAPI spec version: 0.0.1
 * Contact: info@veriguide.org
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { SystemParam } from './systemParam';


export interface LoginCredentials {
    loginId?: string;
    loginType?: SystemParam;
    password?: string;
    schoolType?: SystemParam;
}
