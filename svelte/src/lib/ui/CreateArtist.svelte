<script lang="ts">
  import { afetch, apiUrl } from '$lib/http.js';
  import type { Artist } from '@types/global.js';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { artists, refreshArtists } from '$lib/data';

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

  let artist: Artist = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  let success = '';
  let error = '';

  async function handleSubmit() {
    error = '';
    success = '';

    // Validate that first + last name are filled in, then use regex to validate email and phone
    if (!artist.firstName || !artist.lastName) {
      error = 'First and last name are required';
      return;
    }

    if (!emailRegex.test(artist.email)) {
      error = 'Invalid email';
      return;
    }

    if (!phoneRegex.test(artist.phone)) {
      error = 'Invalid phone number';
      return;
    }

    afetch(`${apiUrl}/api/artist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(artist)
    })
      .then((res) => {
        if (res.ok) {
          console.log('Artist created');
          success = `Artist ${artist.firstName} ${artist.lastName} created`;
          artist = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          };

          refreshArtists();
        } else {
          res.text().then((text) => {
            console.error('Failed to create artist', text);
            error = text;
          });
        }
      })
      .catch((err) => {
        console.error('Failed to create artist', err);
        error = 'Failed to create artist';
      });
  }
</script>

<h2>Create Artist</h2>
<form class="form" on:submit|preventDefault={handleSubmit}>
  <div class="flex">
    <LabeledInput bind:value={artist.firstName}>First Name</LabeledInput>

    <LabeledInput bind:value={artist.lastName}>Last Name</LabeledInput>
  </div>

  <div class="flex">
    <LabeledInput bind:value={artist.email} type="email">Email</LabeledInput>

    <LabeledInput bind:value={artist.phone}>Phone</LabeledInput>
  </div>

  {#if success}
    <div class="success">
      {success}
    </div>
  {/if}

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  <button type="submit">Create</button>
</form>

<style>
  .flex {
    width: 100%;
    display: flex;
    gap: 1rem;
    align-content: stretch;
  }

  .success {
    color: green;
    margin-top: 1rem;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }

  button {
    margin-top: 1rem;
  }
</style>
