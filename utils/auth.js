import auth0 from "auth0-js";
import Cookie from "js-cookie";

const PREFIX = "private_events/";
export const ACCESS_TOKEN = `${PREFIX}access_token`;
export const EXPIRES_AT = `${PREFIX}expires_at`;
export const ID_TOKEN = `${PREFIX}id_token`;

const auth = new auth0.WebAuth({
  domain: "wacii.auth0.com",
  clientID: "4e93O3ZuNbpVxvnc90dj6ht4KEU5yErT",
  redirectUri: "http://localhost:3000/callback",
  audience: "http://localhost:3000",
  responseType: "token id_token",
  scope: "openid"
});

const login = () => auth.authorize();

const setSession = ({ accessToken, expiresIn, idToken }) => {
  const expiresAt = JSON.stringify(
    expiresIn * 1000 + new Date().getTime()
  );

  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(EXPIRES_AT, expiresAt);
  localStorage.setItem(ID_TOKEN, idToken);

  Cookie.set("id_token", idToken);

  scheduleRenewal();
  broadcastAuthenticated(true);
};

const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(EXPIRES_AT);
  localStorage.removeItem(ID_TOKEN);

  Cookie.remove("id_token");
}

const logout = () => {
  clearSession();
  clearTimeout(renewalTimeout);
  broadcastAuthenticated(false);
};

const isAuthenticated = (isServer, cookies) => {
  if (isServer) {
    return cookies.id_token !== undefined;
  } else {
    const expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT));
    return new Date().getTime() < expiresAt;
  }
}

const listeners = [];
const subscribeAuthenticated = (isServer, cookies, listener) => {
  listener(isAuthenticated(isServer, cookies));
  listeners.push(listener);
  return () => listeners.splice(listeners.indexOf(listener), 1);
}
const broadcastAuthenticated = (authenticated) => {
  listeners.forEach(listener => listener(authenticated));
};

const handleAuthentication = () => {
  auth.parseHash((err, result) => {
    if (err) {
      console.error(err);
    } else {
      setSession(result);
    }
  });
};

const renewToken = () => {
  auth.checkSession({}, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      setSession(result);
    }
  })
};

let renewalTimeout;
const scheduleRenewal = () => {
  if (!process.browser) return;

  const expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT));
  const delay = expiresAt - Date.now();
  if (delay > 0) {
    renewalTimeout = setTimeout(renewToken, delay)
  }
};

scheduleRenewal();

export {
  isAuthenticated,
  subscribeAuthenticated,
  login,
  logout,
  setSession,
  clearSession,
  handleAuthentication
};
