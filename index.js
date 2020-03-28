// DOM elements
const guideList = document.querySelector(".guides");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");

const setupUI = user => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = "block"));
    }
    // account info
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().username}</div>
        <div>${doc.data().bio}</div>
        <div class="red-text">${user.admin ? "Admin" : ""}</div>
      `;
        accountDetails.innerHTML = html;
      });
    // toggle user UI elements
    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    adminItems.forEach(item => (item.style.display = "none"));
    // clear account info
    accountDetails.innerHTML = "";
    // toggle user elements
    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

// setup guides
const setupGuides = data => {
  if (data.length) {
    let html = "";
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
        <li>
          <div class=" grey lighten-2 " "> ${guide.title}, + ${guide.likes} likes</div>
          <div class=" grey lighten-4"> <a href="${guide.address}" target='_blank'>${guide.address}</a> </div>
          <div class=" grey lighten-4"> ${guide.access} </div>
          <div class=" grey lighten-4"> ${guide.instructions} </div>
        </li>
      `;
      html += li;
    });
    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = '<h5 class="">Log in to view APIs</h5>';
  }
};

// setup materialize components
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
