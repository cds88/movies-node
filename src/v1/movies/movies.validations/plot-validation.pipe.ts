import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PlotValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null) {
      return value;
    }
    if (typeof value !== 'string' || !isNaN(Number(value))) {
      throw new BadRequestException('Invalid plot');
    }
    if (value.length > 255) {
      throw new BadRequestException('Plot is too long');
    }
    return value;
  }
}
