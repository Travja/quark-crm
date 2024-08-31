<script lang="ts">
  import moment from "moment/moment";

  export let value: any;
  export let id: string;
  export let type: 'number' | 'text' | 'dropdown' = 'text';
  export let min: number = undefined;
  export let max: number = undefined;
  export let step: number = undefined;

  let offset = 0;
  let internalDate: string;

  const processVal = (val): void => {
    if (!val || (type != 'date' && type != 'datetime')) return;
    if (typeof val == 'string') {
      if (type == 'date') {
        console.log('val', val);
        if (!internalDate && !val) {
          value = undefined;
          return;
        }
        let mom = moment(val, moment.HTML5_FMT.DATETIME_LOCAL).startOf('day');
        value = mom.toISOString().split('Z')[0]; //.replace(/\.0{3}/, '');
        internalDate = value.split('T')[0];
      }
      return;
    }

    let mom = moment(val, moment.HTML5_FMT.DATETIME_LOCAL).startOf('minute');
    if (offset == 0) {
      offset = mom.utcOffset() / 60;
    }

    let convert;
    if (type == 'date') {
      convert = mom.toISOString().split('T')[0];
      internalDate = convert;
    }
    mom = mom.add({ hour: offset });
    convert = mom.toISOString().split('Z')[0];

    value = convert;
    console.log('convert', convert);
  };

  $: processVal(internalDate);
  $: processVal(value);
</script>

<div class="sp-in">
  {#if type === 'number'}
    <input
      class="sp-input"
      name="test"
      placeholder=" "
      bind:value
      type="number"
      {id}
      {min}
      {max}
      {step}
    />
  {:else if type === 'dropdown'}
    <select
      class="sp-input"
      name="test"
      bind:value
      class:selected={!!value}
      {id}
      on:select
      on:change
    >
      <option value={undefined}></option>
      <slot name="dropdown" />
    </select>
  {:else if type === 'date'}
    <input
      class="sp-input"
      name="test"
      placeholder=" "
      bind:value={internalDate}
      type="date"
      {id}
      {min}
      {max}
      on:change
      on:input
    />
  {:else}
    <input class="sp-input" name="test" placeholder=" " bind:value {id} />
  {/if}
  <label for="test"><slot /></label>
</div>

<style>
  .sp-in {
    position: relative;
    margin: 0.5rem 0;
  }

  .sp-in label {
    position: absolute;
    top: 0.5rem;
    left: 0;
    color: var(--fg-color-light);
    padding-inline: 0.5rem;
    pointer-events: none;
    transition: all 0.2s ease;
    /*background-color: red;*/
    /*height: 5px;*/

    transform-origin: left center;

    display: flex;
    align-items: center;
  }

  .sp-in:has(input:not(:placeholder-shown)) label,
  .sp-in:has(input:focus) label,
  .sp-in:has(select.selected) label,
  .sp-in:has(select:focus) label {
    color: var(--fg-color);
    background-color: var(--bg-color);
    height: 5px;
    transform: translate(0.4rem, -0.7rem) scale(0.8);
  }

  .sp-input {
    border: 1px solid var(--fg-color-mid);
    border-radius: 0.3rem;
    background-color: var(--bg-color);
    color: var(--fg-color);
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 1px;
  }

  .sp-input:focus {
    outline: none;
    margin-bottom: 0;
    border-bottom: 2px solid var(--title-accent-color);
  }
</style>
