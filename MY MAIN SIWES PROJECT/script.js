// --- LIVE IN-MEMORY DATA (NO SAVING) ---
let currentSemester = 1;
let coursesSem1 = [];
let coursesSem2 = [];


function getGradePoint(grade) {
  const points = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
  return points[grade] ?? 0;
}

function renderTable() {
  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  let list = currentSemester === 1 ? coursesSem1 : coursesSem2;
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No courses added for Semester ${currentSemester}.</td></tr>`;
  } else {
    for (let i = 0; i < list.length; i++) {
      let c = list[i];
      let gp = getGradePoint(c.grade);
      let qp = c.units * gp;
      tbody.innerHTML += `
        <tr>
          <td>${c.code}</td>
          <td>${c.units}</td>
          <td>${c.grade}</td>
          <td>${gp}</td>
          <td>${qp}</td>
          <td><button type="button" class="btn btn-danger" style="padding:4px 8px;" onclick="deleteCourse(${c.id})">Delete</button></td>
        </tr>
      `;
    }
  }

  let stats = calculateSemester(list);
  setText("totalUnits", stats.totalUnits);
  setText("totalPoints", stats.totalPoints);
  setText("semGpa", stats.gpa.toFixed(2));
}

function calculateSemester(list) {
  let totalUnits = 0;
  let totalPoints = 0;

  for (let i = 0; i < list.length; i++) {
    let gp = getGradePoint(list[i].grade);
    totalUnits += list[i].units;
    totalPoints += list[i].units * gp;
  }
  let gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
  return { totalUnits, totalPoints, gpa };
}
// using the result of the above this computes the CGPA and updates the page to showthe result.
function updateSummaryDisplays() {
  let s1 = calculateSemester(coursesSem1);
  let s2 = calculateSemester(coursesSem2);
  let combinedUnits = s1.totalUnits + s2.totalUnits;
  let combinedPoints = s1.totalPoints + s2.totalPoints;
  let cgpa = combinedUnits > 0 ? combinedPoints / combinedUnits : 0;

  setText("homeGpa1", s1.gpa.toFixed(2));
  setText("homeGpa2", s2.gpa.toFixed(2));
  setText("homeCgpa", cgpa.toFixed(2));

  setText("calcGpa1", s1.gpa.toFixed(2));
  setText("calcGpa2", s2.gpa.toFixed(2));
  setText("calcCgpa", cgpa.toFixed(2));
}
// if an element exists in a currentpage, this function finds it and sets its text content to the provided value, tha kind thing.
function setText(id, value) {
  let el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ---myyyyyy HAM NAVIGATION Arrrghhhhhh ---
function initNavigation() {
  let toggle = document.querySelector(".menu-toggle");
  let nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    let isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", initNavigation);

function switchTab(tab) {
  document.getElementById("tabLogin").classList.toggle("active", tab === "login");
  document.getElementById("tabRegister").classList.toggle("active", tab === "register");
  document.getElementById("formLogin").classList.toggle("hidden", tab !== "login");
  document.getElementById("formRegister").classList.toggle("hidden", tab !== "register");
}

function demoAuthSubmit(e, message) {
  e.preventDefault();
  alert(message);
}
 
function initCalculator() {
  renderTable();
  updateSummaryDisplays();
}
// this function is used to set the current semester and update the UI accordingly, boy reference line 1     
function setSemester(sem) {
  currentSemester = sem;
  document.getElementById("btnSem1").classList.toggle("active", sem === 1);
  document.getElementById("btnSem2").classList.toggle("active", sem === 2);
  renderTable();
}

function addCourse(e) {
  e.preventDefault();
  let code = document.getElementById("courseCode").value.trim().toUpperCase();
  let units = parseInt(document.getElementById("courseUnits").value, 10);
  let grade = document.getElementById("courseGrade").value;

  if (!code || isNaN(units) || units < 1) return;

  let course = { id: Date.now() + Math.random(), code, units, grade };
  if (currentSemester === 1) {
    coursesSem1.push(course);
  } else {
    coursesSem2.push(course);
  }

  document.getElementById("courseForm").reset();
  renderTable();
  updateSummaryDisplays();
}
// this is for the delete button. it removes a course from the list based on its unique id
function deleteCourse(id) {
  if (currentSemester === 1) {
    coursesSem1 = coursesSem1.filter(c => c.id !== id);
  } else {
    coursesSem2 = coursesSem2.filter(c => c.id !== id);
  }
  renderTable();
  updateSummaryDisplays();
}

