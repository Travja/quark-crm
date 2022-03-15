<script lang='ts'>
  import { data } from '$lib/data';
  import { onMount } from 'svelte';
  import { OrderStatus } from '$lib/models/order';
  import TextInput from '../lib/ui/TextInput.svelte';

  onMount(() => {
    $data.push({
      customerName: 'Test 3',
      orderDate: new Date(),
      status: OrderStatus.SHIPPED
    });
    $data = [...$data];
  });

  const checkEnter = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      // TODO Apply search/filter

    }
  };

</script>

<div class='heading-bar'>
  <div class='material-icons'>filter_alt</div>
  <div class='spacer' />
  <TextInput placeholder='Search...' fontSize='1.2em' margin='0' on:keypress={checkEnter} />
</div>
<div class='center'>
  <table>
    <thead>
    <tr>
      <th>Customer</th>
      <th>Last Contact</th>
      <th>Status</th>
      <th>Order Date</th>
      <th>Col 4</th>
    </tr>
    </thead>
    <tbody>
    {#each $data as datum}
      <tr>
        <a href='#'>
          {datum.customerName}
        </a>
        <td>{datum.lastContact || ''}</td>
        <td>{datum.status}</td>
        <td>
          {
            datum.orderDate.toLocaleString("en-US",
              { dateStyle: 'medium', timeStyle: 'short' })
          }
        </td>
        <td>4</td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style>
    .heading-bar {
        display: flex;
        align-items: center;
        margin-bottom: 0.5em;
    }

    .center {
        align-items: stretch;
        width: 100%;
    }

    table {
        border-collapse: collapse;
    }

    table * {
        border: 1px solid var(--fg-color);
        padding: 0.5em;
    }

    thead tr {
        background-color: var(--accent-color);
        color: black;
        font-weight: bold;
    }

    td {
        min-width: 4em;
    }

    a {
        display: table-cell;
        color: var(--link-color);
    }

</style>