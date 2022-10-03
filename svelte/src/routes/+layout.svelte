<script lang='ts'>
  import { loadData } from '../lib/data';
  import { onMount } from 'svelte';

  onMount(() => loadData());
</script>

<slot />