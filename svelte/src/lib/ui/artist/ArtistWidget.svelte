<script lang="ts">
  import type { Artist } from '@types/global';
  import Pill from '$lib/ui/Pill.svelte';
  import { formatPhone } from "$lib/api/util.js";

  export let artist: Artist;
</script>

<Pill>
  <div class="content">
    <div class="name">{artist.firstName} {artist.lastName}</div>
    <a href="mailto:{artist.email}">{artist.email}</a>
    <a href="tel:{artist.phone}">{formatPhone(artist.phone)}</a>
  </div>
</Pill>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    align-items: center;
  }

  .name {
    font-weight: bold;
  }
</style>
