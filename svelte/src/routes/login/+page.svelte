<script lang="ts">
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import type { ApiWindow } from '@types/global';
  import { onMount } from 'svelte';
  import { _refreshToken, _token, apiUrl } from '$lib/http';

  let win: ApiWindow;

  onMount(() => {
    win = window as unknown as ApiWindow;
  });

  let username: string, password: string;
  let error = false;

  const login = async () => {
    if (win.electron) {
      win.electron
        .login({ username, password })
        .then((res) => {
          if (res.authorized) {
            _token.set(res.token);
            _refreshToken.set(res.refreshToken);
            win.location.href = '/';
          } else {
            error = res.error;
          }
        });
    } else {
      fetch(`${apiUrl}/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(username + ':' + password)
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authorized) {
            _token.set(data.token);
            _refreshToken.set(data.refreshToken);
            win.location.href = '/';
          } else {
            error = data.error?.message ? data.error.message : data.error;
          }
        })
        .catch((err) => {
          error = err.message;
        });
    }
  };
</script>

<section>
  <h1>Login</h1>
  <StyledInput bind:value={username} placeholder="Username" margin="0.5rem" />
  <StyledInput
    bind:value={password}
    on:keypress={(e) => {
      if (e.key === 'Enter') login();
    }}
    type="password"
    placeholder="Password"
    margin="0.5rem 0.5rem 1rem"
  />
  {#if error}
    <div class="error">Failed to login: {error}</div>
  {/if}
  <div
    role="button"
    tabindex="0"
    class="button"
    on:click={login}
    on:keypress={(e) => {
      if (e.key === 'Enter') login();
    }}
  >
    Submit
  </div>
</section>

<style>
  h1 {
    margin: 0;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .error {
    color: red;
    margin: 0.75em;
  }
</style>
