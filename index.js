// DOM elements
const guideList = document.querySelector(".guides");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");

// vue stuff
var app = new Vue({
  el: "#app",
  data: {
    requests: [],
    search: ""
  },
  methods: {
    upvoteRequest(id) {
      //console.log(id);
      const upvote = firebase.functions().httpsCallable("upvote");
      upvote({ id }).catch(error => {
        console.log(error.message);
      });
    },
    downvoteRequest(id) {
      const downvote = firebase.functions().httpsCallable("downvote");
      downvote({ id }).catch(error => {
        console.log(error.message);
      });
    }
  },

  mounted() {
    const ref = firebase
      .firestore()
      .collection("apis")
      .orderBy("upvotes", "desc");
    ref.onSnapshot(snapshot => {
      let requests = [];
      snapshot.forEach(doc => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      this.requests = requests;
    });
  },
  computed: {
    filteredApis: function() {
      return this.requests.filter(apis => {
        return apis.title.toLowerCase().includes(this.search.toLowerCase());
      });
    }
  }
});

//

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
        <div>Username: ${doc.data().username}</div>
        <div>Bio: ${doc.data().bio}</div>
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

// setup materialize components
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
