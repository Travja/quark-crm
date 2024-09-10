<script lang="ts">
  import ReusableLayout from '$lib/ReusableLayout.svelte';
  import LeftMenu from '$lib/LeftMenu.svelte';
  import { goto } from '$app/navigation';
  import { roles } from '$lib/http';
  import { onMount } from 'svelte';
  import type { ApiWindow } from 'global';

  let win: ApiWindow;

  onMount(() => {
    win = window as unknown as ApiWindow;
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    win.electron.logout();
    goto('/login');
  };
</script>

<ReusableLayout>
  <svelte:fragment slot="header">
    <LeftMenu />
    <nav>
      <ul>
        <li
          role="menuitem"
          tabindex="0"
          class="nav-button"
          on:click={() => goto('/')}
          on:keypress={() => goto('/')}
        >
          Dashboard
        </li>
        <li
          role="menuitem"
          tabindex="0"
          class="nav-button"
          on:click={() => goto('/analytics')}
          on:keypress={() => goto('/analytics')}
        >
          Analytics
        </li>
        {#if $roles.includes('ADMIN')}
          <li
            role="menuitem"
            tabindex="0"
            class="nav-button"
            on:click={() => goto('/admin')}
            on:keypress={() => goto('/admin')}
          >
            Admin
          </li>
        {/if}
      </ul>
      <div
        class="logout"
        role="button"
        tabindex="0"
        on:click={logout}
        on:keypress={(e) => {
          if (e.key === 'Enter') logout();
        }}
      >
        Logout
      </div>
    </nav>
  </svelte:fragment>
  <slot />
</ReusableLayout>

<style>
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: var(--bg-secondary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-flex;
    flex-direction: row;
    gap: 0.4em;
  }

  li {
    padding: 0.5em;
  }

  .nav-button,
  .logout {
    padding: 0.75em;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .nav-button:hover,
  .logout:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
