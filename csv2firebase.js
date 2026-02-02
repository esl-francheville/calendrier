const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = JSON.parse(
  fs.readFileSync("export_calendar.json", "utf8")
);

async function importCalendar() {
  let count = 0;

  for (const item of data) {
    if (!item.user || !item.day || typeof item.duree !== "number") {
      console.warn("⛔ Entrée invalide ignorée :", item);
      continue;
    }

    const ref = db
      .collection("users")
      .doc(item.user)
      .collection("calendar")
      .doc(item.day);

    await ref.set(
      { duree: item.duree },
      { merge: true }
    );

    console.log(`✅ ${item.user} | ${item.day} → ${item.duree}`);
    count++;
  }

  console.log(`🎉 Import terminé (${count} écritures Firestore)`);
}

importCalendar().catch(console.error);