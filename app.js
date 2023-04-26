var courseApi = "http://localhost:4000/courses";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function start() {
  getCourses(renderCourses);
  handleCreateForm();
}

start();

//
var currentdom = null;

console.log("🚀 ~ file: app.js:4 ~ currentdom:", currentdom);

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
      if (response.status === 201) {
        console.log("🚀 ~ file: app.js:33 ~ response:", response.status);
        console.log(document.querySelector("input[name='name']"));
        document.querySelector("input[name='name']").value = "";
        document.querySelector("input[name='price']").value = "";
      }
      currentdom = null;
      return response.json();
    })
    .then(callback);
  currentdom = null;
}

function handleDeleteCourse(courseId) {
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
      getCourses(renderCourses);
    });
  currentdom = null;
}

function handleOpenFormUpdateCourse(courseId) {
  var domUpd = document.querySelector(`.course-item-${courseId}`);

  if (currentdom) {
    handleCloseFormUpdate(currentdom);
  }

  currentdom = courseId;
  var htmls = `<div class="form-update-${courseId}" style="margin-top: 20px">
      <input class="name" name="newName" />
      <input class="price" name="newName" />
      <button onclick="handleUpdateCourseAction(${courseId})">xác nhận</button>
      <button onclick="handleCloseFormUpdate(${courseId})">Hủy</button>
    </div>`;
  domUpd.innerHTML += htmls;

  var dombtnUpdate = domUpd.querySelectorAll(".btn-update")[0];
  dombtnUpdate.remove();
}

function handleUpdateCourseAction(courseId) {
  const name = document.querySelector(".name").value;
  const price = document.querySelector(".price").value;
  fetch(`${courseApi}/${courseId}`, {
    method: "PATCH",
    headers: myHeaders,
    body: JSON.stringify({
      ...(name && { name }),
      ...(price && { price }),
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function () {
      getCourses(renderCourses);
    });
  currentdom = null;
}

function handleCloseFormUpdate(courseId) {
  var domFormUpdate = document.querySelector(`.form-update-${courseId}`);
  domFormUpdate.remove();

  const domLi = document.querySelector(`.course-item-${courseId}`);

  domLi.innerHTML += `<button class="btn-update" onclick="handleOpenFormUpdateCourse(${courseId})">Chỉnh sửa</button>`;
  currentdom = null;
}

function renderCourses(courses) {
  var listCoursesBlock = document.querySelector("#list-courses");
  var htmls = courses.map(function (course) {
    return `
      <li class="course-item-${course.id}">
        <h4>${course.name}</h4>
        <p>${course.price}</p>
        <button  onclick="handleDeleteCourse(${course.id})" >Xóa</button>
        <button class="btn-update" onclick="handleOpenFormUpdateCourse(${course.id})" >Chỉnh sửa</button>
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
