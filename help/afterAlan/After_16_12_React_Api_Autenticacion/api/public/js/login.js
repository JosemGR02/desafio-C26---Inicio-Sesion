const loginForm = document.getElementById("loginForm");

const login = async (e) => {
  e.preventDefault();

  const data = new FormData(loginForm);

  const credentials = {};

  for (const field of data) {
    credentials[field[0]] = field[1];
  }

  const response = await fetch("/api/auth", {
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    // redirect: true,
  });

  if (response.status === 200) {
    return window.location.replace("/");
  }

  alert("Contraseña Incorrecta");
};

// try catch recomendado

loginForm.addEventListener("submit", login);

const githubBtn = document.getElementById("githubBtn");

githubBtn.addEventListener("click", (e) => {
  e.preventDefault();

  window.open("http://localhost:8080/api/auth/github-login", "_self");
});
