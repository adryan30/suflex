import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthcheck(): string {
    return 'ok!';
  }
}
