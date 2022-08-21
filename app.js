class Course {
    constructor(title, instructor, image) {
        this.courseId = Math.floor(Math.random() * 1000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

class UI {
    addCourseTolist(course) {
        const list = document.getElementById('courseList');
        let html = `
        <tr>
        <td><img src="img/${course.image}"/></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td> <a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
        </tr>      
        `;
        list.innerHTML += html;
    }
    deleteCourseFromUI(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            return true;
        }
    }
    clearControls() {
        const title = document.getElementById('title').value = '';
        const instructor = document.getElementById('instructor').value = '';
        const image = document.getElementById('image').value = '';
    }
    showAlert(message, className) {
        var alert = `
        <div class="alert alert-${className}">
        ${message}
        </div>
        `
        const row = document.querySelector('.row');
        row.insertAdjacentHTML('beforebegin', alert);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);

    }
}
class Storage {
    static getCourse() {
        let courses;
        if (localStorage.getItem('courses') === null) {
            courses = [];
        } else {
            courses = JSON.parse(localStorage.getItem('courses'));
        }
        return courses;
    }
    static addCourse(course) {
        const courses = Storage.getCourse();
        courses.push(course);
        localStorage.setItem('courses', JSON.stringify(courses))
    }
    static displayCourse() {
        const courses = Storage.getCourse();
        courses.forEach((course) => {
            const ui = new UI();
            ui.addCourseTolist(course);
        });
    }
    static deleteCourseFromLS(element) {
        if (element.classList.contains('delete')) {
            const courses = Storage.getCourse();
            const id = element.getAttribute('data-id');

            courses.forEach((course, index) => {
                if (course.courseId == id) {
                    courses.splice(index, 1);
                }
            });
            localStorage.setItem('courses', JSON.stringify(courses));
        }
    }
}

document.addEventListener('DOMContentLoaded', Storage.displayCourse);// sayfa yüklendiğinde localstorage'dan elamanları getirip ekranda gösterecek

document.getElementById('newCoruse').addEventListener('submit', (e) => {
    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;

    const course = new Course(title, instructor, image);
    const ui = new UI();

    if (title === '' || instructor === '' || image === '') {
        ui.showAlert('boş yollama kardeşim ya', 'warning')
    } else {
        ui.addCourseTolist(course);
        Storage.addCourse(course);

        ui.clearControls();
        ui.showAlert('helal la kardeşş', 'success');
    }
    e.preventDefault();
});

document.getElementById('courseList').addEventListener('click', (e) => {
    const ui = new UI();
    if (ui.deleteCourseFromUI(e.target) == true) {
        Storage.deleteCourseFromLS(e.target);
        ui.showAlert('silinmişke', 'danger');
    }
})