import auth0 from "auth0-js";

const auth = new auth0.WebAuth({
  domain: "wacii.auth0.com",
  clientID: "4e93O3ZuNbpVxvnc90dj6ht4KEU5yErT",
  redirectUri: "http://localhost:3000/callback",
  audience: "https://wacii.auth0.com/userinfo",
  responseType: "token id_token",
  scope: "openid"
});

const login = () => auth.authorize();
const parseHash = auth.parseHash.bind(auth);

const setSession = ({ accessToken, expiresIn, idToken }) => {
  const expiresAt = JSON.stringify(
    expiresIn * 1000 + new Date().getTime()
  );

  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("expires_at", expiresAt);
  localStorage.setItem("id_token", idToken);

  scheduleRenewal();
};

const clearSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("id_token");
}

const logout = () => {
  clearSession();
  window.clearTimeout(renewalTimeout);
};

const isAuthenticated = () => {
  const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

const renewToken = () => {
  auth.checkSession({}, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      setSession(result);
    }
  })
}

let renewalTimeout;
const scheduleRenewal = () => {
  if (!process.browser) return;
  
  const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  const delay = expiresAt - Date.now();
  if (delay > 0) {
    renewalTimeout = setTimeout(renewToken, delay)
  }
}

scheduleRenewal();

export {
  isAuthenticated,
  login,
  logout,
  setSession,
  clearSession,
  parseHash
};
