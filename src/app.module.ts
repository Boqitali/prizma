import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { StudentsModule } from './students/students.module';
import { StudentCoursesModule } from './student_courses/student_courses.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}), PrismaModule, UsersModule, AuthModule, OrdersModule, StudentsModule, StudentCoursesModule, CoursesModule, ],
  controllers: [],
  providers: [],
})
export class AppModule {}
