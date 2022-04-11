import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { runtimeConfig } from './shared/config/app.config';
import { TypeOrmFactoryConfigService } from './shared/config/typeorm-factory-config.service';
import { DatabaseExceptionFilter } from './shared/filters/database-exception.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';
import { ClassTransformInterceptor } from './shared/interceptors/class-transform.interceptor';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';
import { HealthController } from './controllers/health.controller';
import { MemberController } from './controllers/member.controller';
import { AuthController } from './controllers/auth.controller';
import { EventController } from './controllers/event.controller';
import { AuthService } from './services/auth.service';
import { MemberService } from './services/member.service';
import { EventService } from './services/event.service';
import { Member } from './entities/member.entity';
import { Auth } from './entities/auth.entity';
import { User } from './entities/user.entity';
import { AuthRole } from './entities/auth-role.entity';
import { Event } from './entities/event.entity';
import { EventAttendance } from './entities/event-attendance.entity';
import { EventAttendanceService } from './services/event-attendance.service';
import { EventAttendanceController } from './controllers/event-attendance.controller';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [runtimeConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactoryConfigService,
    }),
    TypeOrmModule.forFeature([
      User,
      Member,
      Auth,
      AuthRole,
      Event,
      EventAttendance,
    ]),
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    MemberController,
    EventController,
    EventAttendanceController,
  ],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassTransformInterceptor },
    AuthService,
    MemberService,
    EventService,
    EventAttendanceService,
  ],
})
export class AppModule {}
