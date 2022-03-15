<script lang='ts'>
  import '../app.css';
  import LeftMenu from '$lib/LeftMenu.svelte';
  import TitleBar from '$lib/TitleBar.svelte';
  import { goto } from '$app/navigation';
</script>

<header>
  <TitleBar />
  <LeftMenu />
  <nav>
    <ul>
      <li class='nav-button' on:click={() => goto("/")}>Home</li>
      <li class='nav-button' on:click={() => goto("/list")}>List</li>
    </ul>
  </nav>
</header>
<main>
  <slot />
</main>

<style>
    header {
        background-color: var(--bg-color);
    }

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
