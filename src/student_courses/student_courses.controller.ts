import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';

@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Get()
  findAll() {
    return this.studentCoursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentCoursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentCourseDto: UpdateStudentCourseDto) {
    return this.studentCoursesService.update(+id, updateStudentCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentCoursesService.remove(+id);
  }
}
