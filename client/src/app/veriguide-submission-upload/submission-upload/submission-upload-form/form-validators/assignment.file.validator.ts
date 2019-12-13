import {FormControl} from '@angular/forms';

export class AssignmentFileValidator {
  public static readonly maxFileSizeMB = 20;

  static isFileOversize(fc: FormControl) {
    const objFile: File = fc.value;
    if (!objFile || !objFile.size) {
      return null;
    } else if ((objFile.size / 1024 / 1024) <= AssignmentFileValidator.maxFileSizeMB) {
      return null;
    }
    return { isFileOversize: true };
  }
}
