<script lang="ts">
  import ReusableLayout from '$lib/ReusableLayout.svelte';
  import LeftMenu from '$lib/LeftMenu.svelte';
  import { goto } from '$app/navigation';
  import { roles } from '$lib/http';
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
    </nav>
  </svelte:fragment>
  <slot />
</ReusableLayout>

<style>
  nav {
    background-color: var(--bg-secondary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
  }

  li {
    padding: 0.5em;
  }

  .nav-button {
    padding: 0.75em;
    margin: 0 0.2em;
  }

  .nav-button:hover {
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
</style>
