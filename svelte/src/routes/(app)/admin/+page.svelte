<script lang='ts'>
  import CreateArtist from '$lib/ui/admin/CreateArtist.svelte';
  import { artists }  from "$lib/data";
  import ArtistWidget from "$lib/ui/artist/ArtistWidget.svelte";
    import CreateUser from '$lib/ui/admin/CreateUser.svelte';
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

  <h2>Users</h2>
  <CreateUser>
    <h3>Create User</h3>
  </CreateUser>
</div>

<style>
    h1 {
        margin: 0.5rem 0;
    }
</style>
