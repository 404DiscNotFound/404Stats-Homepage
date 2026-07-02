const TOKEN_KEY_PREFIX = 'f0f_token_';

export function getServerToken(slug) {
  return sessionStorage.getItem(TOKEN_KEY_PREFIX + slug);
}

export function setServerToken(slug, token) {
  sessionStorage.setItem(TOKEN_KEY_PREFIX + slug, token);
}

export function clearServerToken(slug) {
  sessionStorage.removeItem(TOKEN_KEY_PREFIX + slug);
}

export function withAccessToken(slug, payload = {}) {
  const token = getServerToken(slug);
  return token ? { ...payload, access_token: token } : payload;
}