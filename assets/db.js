const admin = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const serviceAccount = require('../env.json');

if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
  const db = admin.firestore();
module.exports = { db };