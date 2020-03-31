const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if (context.auth.token.admin !== true) {
    return { error: "Denied." };
  }
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} is now an admin.`
      };
    })
    .catch(err => {
      return err;
    });
});

//  Up vote system
exports.upvote = functions.https.onCall((data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can vote up requests"
    );
  }
  // get refs for user doc & request doc
  const user = admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid);
  const api = admin
    .firestore()
    .collection("apis")
    .doc(data.id);

  return user.get().then(doc => {
    // check thew user hasn't already upvoted
    if (doc.data().upvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can only vote something up once"
      );
    }

    // update the array in user document
    return user
      .update({
        upvotedOn: [...doc.data().upvotedOn, data.id]
      })
      .then(() => {
        // update the votes on the api
        return api.update({
          upvotes: admin.firestore.FieldValue.increment(1)
        });
      });
  });
});

//  DOWN vote system
exports.downvote = functions.https.onCall((data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can down vote requests"
    );
  }
  // get refs for user doc & request doc
  const user = admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid);
  const api = admin
    .firestore()
    .collection("apis")
    .doc(data.id);

  return user.get().then(doc => {
    // check thew user hasn't already upvoted
    if (doc.data().downvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can only vote something down once"
      );
    }

    // update the array in user document
    return user
      .update({
        downvotedOn: [...doc.data().downvotedOn, data.id]
      })
      .then(() => {
        // update the votes on the api
        return api.update({
          downvotes: admin.firestore.FieldValue.increment(1)
        });
      });
  });
});
