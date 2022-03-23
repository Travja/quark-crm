<script lang='ts'>
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import type { ApiWindow } from '@types/global';
  import { onMount } from 'svelte';

  let win: ApiWindow;

  onMount(() => {
    win = window as unknown as ApiWindow;
  });

  let username: string, password: string;
  let error = false;

  const login = async () => {
    win.electron.login({ username, password }).then((res) => error = res.error);
  };
</script>

<section>
  <h1>Login</h1>
  <StyledInput bind:value={username} placeholder='Username' />
  <StyledInput bind:value={password} type='password' placeholder='Password' />
  {#if error}
    <div class='error'>Failed to login: {error}</div>
  {/if}
  <div class='button' on:click={login}>Submit</div>
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
