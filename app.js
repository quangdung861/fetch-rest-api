var courseApi = "http://localhost:4000/courses";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function start() {
  getCourses(renderCourses);
  handleCreateForm();
}

start();

//

function getCourses(callback) {
  fetch(courseApi)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function createCourse(formData, callback) {
  fetch(courseApi, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: myHeaders,
  })
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function handleDeleteCourse(courseId) {
  console.log(courseId);
  var options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(courseApi + "/" + courseId, options)
    .then(function (response) {
      return response.json();
    })
    .then(function () {
      var domDel = document.querySelector(`.course-item-${courseId}`);
      if(domDel) domDel.remove();
    });
}

function renderCourses(courses) {
  var listCoursesBlock = document.querySelector("#list-courses");
  var htmls = courses.map(function (course) {
    return `
      <li class="course-item-${course.id}">
        <h4>${course.name}</h4>
        <p>${course.price}</p>
        <button onclick="handleDeleteCourse(${course.id})" >Xóa</button>
      </li>
      `;
  });
  listCoursesBlock.innerHTML = htmls.join("");
}

function handleCreateForm() {
  var createBtn = document.querySelector("#create");

  createBtn.onclick = function () {
    var name = document.querySelector("input[name='name']").value;
    var price = document.querySelector("input[name='price']").value;

    var formData = {
      name,
      price,
    };
    createCourse(formData, function () {
      getCourses(renderCourses);
    });
  };
}
