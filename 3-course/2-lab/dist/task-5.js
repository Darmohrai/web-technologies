"use strict";
// 2. OnlineCourse class
class OnlineCourse {
    constructor(title, duration) {
        this.title = title;
        this.duration = duration;
        this.students = [];
    }
    registerStudent(student) {
        if (!this.isStudentRegistered(student)) {
            this.students.push(student);
            console.log(`${student} has been registered for ${this.title}`);
        }
        else {
            console.log(`${student} is already registered for ${this.title}`);
        }
    }
    isStudentRegistered(student) {
        return this.students.includes(student);
    }
}
// 3. CourseManager class
class CourseManager {
    constructor() {
        this.courses = [];
    }
    addCourse(course) {
        this.courses.push(course);
        console.log(`Course "${course.title}" added.`);
    }
    removeCourse(courseName) {
        this.courses = this.courses.filter(c => c.title !== courseName);
        console.log(`Course "${courseName}" removed.`);
    }
    findCourse(courseName) {
        return this.courses.find(c => c.title === courseName);
    }
    listCourses() {
        console.log("\n--- Courses and Students ---");
        for (const course of this.courses) {
            console.log(`Course: ${course.title} (${course.duration} hours)`);
            console.log(`Students: ${course.students.length > 0 ? course.students.join(", ") : "No students registered"}`);
            console.log();
        }
    }
}
// 4. Test
const manager = new CourseManager();
const tsCourse = new OnlineCourse("TypeScript Basics", 40);
const jsCourse = new OnlineCourse("JavaScript Advanced", 50);
const javaCourse = new OnlineCourse("Java Fundamentals", 60);
manager.addCourse(tsCourse);
manager.addCourse(jsCourse);
manager.addCourse(javaCourse);
tsCourse.registerStudent("Alice");
tsCourse.registerStudent("Bob");
jsCourse.registerStudent("Charlie");
javaCourse.registerStudent("Alice");
javaCourse.registerStudent("Eve");
// List all courses with students
manager.listCourses();
// Example of removing a course
manager.removeCourse("JavaScript Advanced");
// Show updated list
manager.listCourses();
