import { get, writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ApiWindow } from 'global';

const setupLocalStore = (key: string,
                         def: string,
                         setAction?: (data: string) => string,
                         postLoad?: (saved: string) => void): Writable<string> => {
  let saved: string = def;
  if (browser) {
    const stored = localStorage.getItem(key);
    if (stored) {
      saved = stored;
      if (postLoad) postLoad(saved);
    }
  }

  const {
    subscribe,
    set,
    update
  } = writable<string>(saved);
  return {
    subscribe,
    set: (value: string) => {
      if (setAction) value = setAction(value);
      if (browser) {
        localStorage.setItem(key, value + '');
      }
      return set(value);
    },
    update
  };
};

export const _token: Writable<string> = setupLocalStore('token', '');
export const _refreshToken: Writable<string> = setupLocalStore('refreshToken', '');

const validateAndRefreshToken = async (): Promise<void> => {
  // Extract the JWT data and check expiry. If expired, refresh the token
  const token = get(_token);
  if (!token) {
    return;
  }

  const jwt = token.split('.');
  if (jwt.length !== 3) {
    return;
  }

  const payload = JSON.parse(atob(jwt[1]));
  if (!payload.exp) {
    return;
  }

  const expiry = new Date(payload.exp * 1000);
  if (expiry >= new Date()) return;

  return fetch('http://localhost:8080/auth/refresh', {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + get(_refreshToken)
    }
  }).then(res => res.json())
    .then(data => {
      if (data.token) {
        console.log('saving credentials');
        (<ApiWindow><unknown>window).electron.writeCredentials({
          token: data.token,
          refreshToken: data.refreshToken
        });
        _token.set(data.token);
        _refreshToken.set(data.refreshToken);
      }
    });
};

export const afetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  let token = get(_token);
  if (token) {
    if (!init) {
      init = {};
    }
    if (!init.headers) {
      init.headers = {};
    }
    init.headers['Authorization'] = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then((res) => {
        if (token && res.status == 401) {
          validateAndRefreshToken().then(() => {
            init.headers['Authorization'] = `Bearer ${get(_token)}`;
            fetch(input, init).then(resolve).catch(reject);
          });
        } else {
          resolve(res);
        }
      })
      .catch(reject);
  });
};