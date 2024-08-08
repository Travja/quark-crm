import { _token } from '$lib/data';
import type { LayoutLoad } from '../../.svelte-kit/types/src/routes/$types';

export const ssr = false;

// We need to pull the `token` field off the url and store it in the data.ts#token store

export const load: LayoutLoad = async ({ url }) => {
  const urlToken = url.searchParams.get('token');
  if (urlToken) {
    _token.set(urlToken);
  }

  return {};
};