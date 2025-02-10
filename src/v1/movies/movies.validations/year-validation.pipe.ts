import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class YearValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null) {
      return value;
    }

    const year = parseInt(value, 10);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      throw new BadRequestException('Invalid year');
    }
    return year;
  }
}
