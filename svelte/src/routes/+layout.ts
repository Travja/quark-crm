import type { LayoutLoad } from '../../.svelte-kit/types/src/routes/$types';
import { _refreshToken, _token } from '$lib/http';

export const ssr = false;

// We need to pull the `token` field off the url and store it in the data.ts#token store

export const load: LayoutLoad = async ({ url }) => {
  const urlToken = url.searchParams.get('token');
  const urlRefreshToken = url.searchParams.get('refreshToken');
  if (urlToken) {
    _token.set(urlToken);
  }

  if (urlRefreshToken) {
    _refreshToken.set(urlRefreshToken);
  }

  return {};
};