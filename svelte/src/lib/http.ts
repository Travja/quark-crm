import { get, writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { ApiWindow } from 'global';

const setupLocalStore = (
  key: string,
  def: string,
  setAction?: (data: string) => string,
  postLoad?: (saved: string) => void
): Writable<string> => {
  let saved: string = def;
  if (browser) {
    const stored = localStorage.getItem(key);
    if (stored) {
      saved = stored;
      if (postLoad) postLoad(saved);
    }
  }

  const { subscribe, set, update } = writable<string>(saved);
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
export const _refreshToken: Writable<string> = setupLocalStore(
  'refreshToken',
  ''
);

const validateAndRefreshToken = async (): Promise<void> => {
  // Extract the JWT data and check expiry. If expired, refresh the token
  const token = get(_token);
  if (!token) {
    throw new Error('No token to refresh');
  }

  const jwt = token.split('.');
  if (jwt.length !== 3) {
    throw new Error('Invalid token');
  }

  const payload = JSON.parse(atob(jwt[1]));
  if (!payload.exp) {
    throw new Error('Invalid token');
  }

  const expiry = new Date(payload.exp * 1000);
  if (expiry >= new Date()) return;

  return fetch('http://localhost:8080/auth/refresh', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + get(_refreshToken)
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        console.log('saving credentials');
        (<ApiWindow>(<unknown>window)).electron.writeCredentials({
          token: data.token,
          refreshToken: data.refreshToken
        });
        _token.set(data.token);
        _refreshToken.set(data.refreshToken);
      }
    });
};

export const afetch = async (
  input: RequestInfo,
  init?: RequestInit,
  fetch = window.fetch
): Promise<Response> => {
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
          validateAndRefreshToken()
            .then(() => {
              init.headers['Authorization'] = `Bearer ${get(_token)}`;
              fetch(input, init)
                .then((res) => {
                  if (get(_token) && res.status == 401) {
                    location.href = '/login';
                    reject('Authentication failed');
                    return;
                  }

                  resolve(res);
                })
                .catch((err) => {
                  location.href = '/login';
                  reject(err);
                });
            })
            .catch((err) => {
              location.href = '/login';
              console.error('failed to refresh token: ', err);
              reject(err);
            });
        } else if (!token) {
          window.location.href = '/login';
          reject('Unauthenticated');
          return;
        } else {
          resolve(res);
        }
      })
      .catch(reject);
  });
};
