<script>
  import StyledInput from './ui/StyledInput.svelte';
  import { Range } from '$lib/models/Range';

  let selectedRange = Range.THIRTY_DAYS;

  const newRange = (event) => {
    let target = event.target;
    let value = target.options[target.selectedIndex].value;
    selectedRange = Range[value];
  };

</script>

<container class='data h-center'>
  <div class='top h-center'>
    <h4>Select a Time Period to Display</h4>
    <StyledInput type='select' on:change={newRange}>
      {#each Object.keys(Range) as range}
        <option value='{range}'>{Range[range]}</option>
      {/each}
    </StyledInput>
    {#if selectedRange == Range.CUSTOM}
      <div class='custom'>
        <hr />
        <div>
          <StyledInput type='date' />
          <span>to</span>
          <StyledInput type='date' />
        </div>
      </div>
    {/if}
  </div>
  <div class='data-shown'>

  </div>
</container>

<style>

</style>
