import { Injectable } from "@nestjs/common";
import { CreateStudentCourseDto } from "./dto/create-student_course.dto";
import { UpdateStudentCourseDto } from "./dto/update-student_course.dto";
import { PrismaService } from "../prisma/prisma.service";
import { connect } from "http2";

@Injectable()
export class StudentCoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createStudentCourseDto: CreateStudentCourseDto) {
    return this.prismaService.studentCourses.create({
      data: {
        student: { connect: { id: createStudentCourseDto.studentId } },
        course: { connect: { id: createStudentCourseDto.courseId } },
      },
    });
  }

  findAll() {
    return this.prismaService.studentCourses.findMany({
      include: { course: true, student: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} studentCourse`;
  }

  update(id: number, updateStudentCourseDto: UpdateStudentCourseDto) {
    return `This action updates a #${id} studentCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCourse`;
  }
}
