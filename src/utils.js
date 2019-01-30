export const isLoggedIn = () => {
  let session = getSession();
  //let token = session && session.token;
  return session;
};

export const getSession = () => {
  return getObjectFromLocal("session");
};

export function setObjectToLocal(key, value) {
  if (window && window.localStorage) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getObjectFromLocal(key) {
  if (typeof window === "undefined") {
    return null;
  }

  if (window && window.localStorage) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}

export function removeItem(key) {
  if (window && window.localStorage) {
    localStorage.removeItem(key);
  }
}

export function logout() {
  removeItem("session");
  removeItem("images");
}

export const blobToBase64 = blob =>
  new Promise((res, rej) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      const base64data = reader.result;
      if (base64data) {
        res(base64data);
      }
    };
  });
