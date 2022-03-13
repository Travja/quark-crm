<script>
  import '../app.css';
  import LeftMenu from '../lib/LeftMenu.svelte';
  import TitleBar from '../lib/TitleBar.svelte';
</script>

<header>
  <TitleBar />
  <LeftMenu />
  <nav>
    <ul>
      <li>Button 1</li>
      <li>Button 2</li>
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
    background-color: red;
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
</style>
