const admin = require("firebase-admin");
const { google } = require("googleapis");

// 🔐 FIREBASE ADMIN ===================================================

admin.initializeApp({
  credential: admin.credential.cert(
    require("./firebase-service-account.json")
  )
});

const db = admin.firestore();

// 📊 GOOGLE SHEETS ====================================================
const auth = new google.auth.GoogleAuth({
  credentials: require("./google-service-account.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

const sheets = google.sheets({ version: "v4", auth });

// ⚙️ CONFIG ===========================================================
const SPREADSHEET_ID = "1R6amnIv9ADFSK_xjvW0GdahlOkW3TKvEcFguTShLkZU";
const SHEET_NAME = "Calendrier";

// 🚀 MAIN =============================================================
async function run() {
  console.log("📥 Lecture Google Sheet…");

  // B1 = user
  const userCell = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!B1`
  });

  const userEmail = userCell.data.values?.[0]?.[0];
  if (!userEmail) throw new Error("❌ Utilisateur manquant (B1)");

  console.log("👤 Utilisateur :", userEmail);

  // C4:D34 = date / durée
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!C4:D34`,
    valueRenderOption: "UNFORMATTED_VALUE"
  });

  const rows = data.data.values || [];
  let writes = 0;

  for (const [rawDate, duree] of rows) {
    if (!rawDate || duree === "" || duree === null) continue;

    // Google Sheets donne un serial number pour les dates
    const jsDate = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
    jsDate.setHours(12, 0, 0, 0);

    const dateKey = jsDate.toISOString().slice(0, 10);

    console.log(`📅 ${dateKey} → ${duree}`);

    await db
      .collection("users")
      .doc(userEmail)
      .collection("calendar")
      .doc(dateKey)
      .set({
        duree: Number(duree)
      }, { merge: true });

    writes++;
  }

  console.log(`🎉 Import terminé : ${writes} écritures Firestore`);
}

run().catch(err => {
  console.error("🔥 Erreur import :", err);
});
