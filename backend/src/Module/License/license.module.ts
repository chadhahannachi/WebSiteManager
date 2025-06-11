import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { LicenseRequestController } from './license-request.controller';
import { LicenseRequestService } from './license-request.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [HttpModule],
  controllers: [LicenseController, LicenseRequestController, PaymentController],
  providers: [LicenseService, LicenseRequestService, PaymentService],
  exports: [LicenseService, LicenseRequestService, PaymentService],
})
export class LicenseModule {}