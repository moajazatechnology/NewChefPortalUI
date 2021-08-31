import { FormGroup } from "@angular/forms";

export class CommonUtils
{

  public static validateAllFormFields(formGroup: FormGroup)
  {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}