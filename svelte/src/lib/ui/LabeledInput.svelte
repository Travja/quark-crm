<!--suppress XmlInvalidId -->
<script lang='ts'>
  import StyledInput from '$lib/ui/StyledInput.svelte';

  export let id: string;
  export let value: any;
  export let type = 'text';
  export let placeholder = '';
  export let group: any;
</script>

<div>
  <label for={id}>
    <slot />
  </label>
  <StyledInput {id}
               name={id}
               {type}
               {placeholder}
               bind:value={value}
               bind:group={group}
  >
    <slot name='value' />
  </StyledInput>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    flex: 1;
    /*display: grid;*/
    /*align-items: center;*/
    /*grid-template-columns: minmax(100px, 1fr) 8fr;*/
  }

  label:empty {
    display: none;
  }

  label:not(:empty) {
    font-size: 0.9rem;
    /*margin: 0 0.5rem;*/
    margin: 0.5rem 0 0.25rem;
  }
</style>