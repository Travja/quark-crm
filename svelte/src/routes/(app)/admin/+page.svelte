<script lang='ts'>
  import CreateArtist from '$lib/ui/CreateArtist.svelte';
  import { artists }  from "$lib/data";
  import ArtistWidget from "$lib/ui/artist/ArtistWidget.svelte";
</script>

<div>
  <h1>Admin</h1>

  <h2>Artists</h2>

  {#each $artists as artist}
    <ArtistWidget {artist} />
  {/each}

  <CreateArtist>
    <h3>Create Artist</h3>
  </CreateArtist>
</div>

<style>
    h1 {
        margin: 0.5rem 0;
    }
</style>
