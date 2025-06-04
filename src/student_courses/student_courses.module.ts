import { Module } from "@nestjs/common";
import { StudentCoursesService } from "./student_courses.service";
import { StudentCoursesController } from "./student_courses.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService],
})
export class StudentCoursesModule {}
