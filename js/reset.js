function confirmReset() {
  const password = document.getElementById("newPassword").value;
  const params = new URLSearchParams(window.location.search);
  const oobCode = params.get("oobCode");

  if (!password || password.length < 6) {
    showError("Le mot de passe doit contenir au moins 6 caractères");
    return;
  }

  firebase.auth().confirmPasswordReset(oobCode, password)
    .then(() => {
      alert("Mot de passe modifié avec succès !");
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error(error);
      showError("Lien invalide ou expiré");
    });
}

function goToLogin() {
  window.location.href = "index.html";
}