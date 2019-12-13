export class UserSelectOptionDTO {
  key?: string;
  display?: string;

  constructor(param: { display: any; key: any }) {
    if (param.key) { this.key = String(param.key).trim(); }
    if (param.display) { this.display = String(param.display).trim(); }
  }
}
