<script lang="ts">
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import moment, { type Moment } from 'moment';
  import Card from '$lib/ui/Card.svelte';
  import { formatCurrency } from '$lib/api/util';
  import { afetch, apiUrl } from '$lib/http';
  import type { OperatingExpense, Statistics } from '@types/global';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { formatDate } from '$lib/api/util.js';
  import InsetInput from '$lib/ui/InsetInput.svelte';
  import Pill from '$lib/ui/Pill.svelte';

  let selectedPreset: string = 'this-month';
  let startDate = moment().subtract(1, 'days');
  let endDate = moment();

  let stats: Statistics;

  let income = 0;
  let expenses = 0;
  let operatingExpenses = 0;
  let net = 0;

  let newOperatingExpense: OperatingExpense = {
    date: '',
    paidTo: '',
    purpose: '',
    amount: 0
  };

  $: if (stats) {
    income = stats.newCustomerIncome + stats.returningCustomerIncome;
    expenses =
      stats.printExpenses +
      stats.frameExpenses +
      stats.shippingExpenses +
      stats.taxes +
      stats.fees +
      stats.other;
    // + stats.artists

    operatingExpenses = stats.operatingExpenses
      .map((oe) => oe.amount)
      .reduce((a, b) => a + b, 0);

    net = income - expenses - operatingExpenses;
  }

  $: selectPreset(selectedPreset);

  const loadData = () => {
    afetch(
      `${apiUrl}/api/stats/${moment(startDate).utc().format('YYYY-MM-DD')}/${moment(endDate).utc().format('YYYY-MM-DD')}`
    )
      .then((response) => response.json())
      .then((data) => (stats = data));
  };

  $: if (startDate && endDate) loadData();

  const selectPreset = (preset) => {
    switch (preset) {
      case 'today':
        startDate = moment();
        endDate = moment();
        break;
      case 'yesterday':
        startDate = moment().subtract(1, 'days');
        endDate = moment().subtract(1, 'days');
        break;
      case 'last-7-days':
        startDate = moment().subtract(7, 'days');
        endDate = moment();
        break;
      case 'last-30-days':
        startDate = moment().subtract(30, 'days');
        endDate = moment();
        break;
      case 'this-month':
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        break;
      case 'last-month':
        startDate = moment().subtract(1, 'month').startOf('month');
        endDate = moment().subtract(1, 'month').endOf('month');
        break;
      case 'this-quarter':
        startDate = moment().startOf('quarter');
        endDate = moment().endOf('quarter');
        break;
      case 'last-quarter':
        startDate = moment().subtract(1, 'quarter').startOf('quarter');
        endDate = moment().subtract(1, 'quarter').endOf('quarter');
        break;
      case 'ytd':
        startDate = moment().startOf('year');
        endDate = moment();
        break;
      case 'last-year':
        startDate = moment().subtract(1, 'year').startOf('year');
        endDate = moment().subtract(1, 'year').endOf('year');
        break;
      case 'custom':
        // Do nothing
        return;
    }

    startDate = <Moment>startDate.format('YYYY-MM-DD');
    endDate = <Moment>endDate.format('YYYY-MM-DD');
  };

  const createOperatingExpense = () => {
    afetch(`${apiUrl}/api/operating-expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOperatingExpense)
    }).then((_) => {
      newOperatingExpense = {
        date: '',
        paidTo: '',
        purpose: '',
        amount: 0
      };
      loadData();
    });
  };

  const deleteOperatingExpense = (id) => {
    afetch(`${apiUrl}/api/operating-expense/${id}`, {
      method: 'DELETE'
    }).then((_) => loadData());
  };
</script>

<div>
  <div class="flex">
    <h1>Analytics</h1>
    <span class="spacer" />
    <span class="group">
      <StyledInput bind:value={selectedPreset} type="select">
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last-7-days">Last 7 Days</option>
        <option value="last-30-days">Last 30 Days</option>
        <option value="this-month">This Month</option>
        <option value="last-month">Last Month</option>
        <option value="this-quarter">This Quarter</option>
        <option value="last-quarter">Last Quarter</option>
        <option value="ytd">Year to Date</option>
        <option value="last-year">Last Year</option>
        <option value="custom">Custom</option>
      </StyledInput>
      <span class="caps">or</span>
      <span class="date-range">
        <StyledInput
          bind:value={startDate}
          max={moment(endDate).format('YYYY-MM-DD')}
          on:change={() => (selectedPreset = 'custom')}
          type="date"
        />
        <span class="caps">to</span>
        <StyledInput
          bind:value={endDate}
          min={moment(startDate).format('YYYY-MM-DD')}
          on:change={() => (selectedPreset = 'custom')}
          type="date"
        />
      </span>
    </span>
  </div>
  <div class="cards">
    <Card>
      <svelte:fragment slot="header">{stats?.totalOrders || 0}</svelte:fragment>
      <div>Orders</div>
    </Card>
    <Card color="#3cf">
      <svelte:fragment slot="header">{formatCurrency(income)}</svelte:fragment>
      <div>Income</div>
    </Card>
    <Card color="orange">
      <svelte:fragment slot="header">{formatCurrency(expenses)}</svelte:fragment
      >
      {#if operatingExpenses > 0}
        <div class="operating-summary">
          +{formatCurrency(operatingExpenses)} OpEx
        </div>
      {/if}
      <div>Expenses</div>
    </Card>
    <Card color={net >= 0 ? 'lime' : 'red'}>
      <svelte:fragment slot="header">{formatCurrency(net)}</svelte:fragment>
      <div>Net Income</div>
    </Card>
  </div>
  <div class="body">
    <div class="in">
      <LabeledInput readonly value={formatCurrency(stats?.creation)}>
        Creation
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.prints)}>
        Prints
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.frames)}>
        Frames
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.roots)}>
        Roots
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.leaves)}>
        Leaves
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.dateBranches)}>
        Date Branches
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.shipping)}>
        Shipping
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.updates)}>
        Updates
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.custom)}>
        Custom
      </LabeledInput>
    </div>

    <div class="out">
      <LabeledInput readonly value={formatCurrency(stats?.printExpenses)}>
        Prints
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.frameExpenses)}>
        Frames
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.shippingExpenses)}>
        Shipping
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.taxes)}>
        Taxes
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.fees)}>
        Fees
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.artists)}>
        Artists
      </LabeledInput>
      <LabeledInput readonly value={formatCurrency(stats?.other)}>
        Other
      </LabeledInput>
    </div>
  </div>
  <hr />
  <div class="operating-expenses">
    <div class="ops">
      <h2>
        Operating Expenses - <span class="operating"
          >{formatCurrency(operatingExpenses)}</span
        >
      </h2>
      {#if stats}
        <table>
          <tr>
            <th>Date</th>
            <th>Paid To</th>
            <th>Purpose</th>
            <th>Amount</th>
            <th></th>
          </tr>
          {#each stats.operatingExpenses as oe}
            <tr>
              <td>{formatDate(moment(oe.date, 'YYYY-MM-DD').toDate())}</td>
              <td>{oe.paidTo}</td>
              <td>{oe.purpose}</td>
              <td class="currency">{formatCurrency(oe.amount)}</td>
              <td class="buttons">
                <Pill
                  hover
                  color="#d33"
                  on:click={() => deleteOperatingExpense(oe.id)}
                  on:keypress={(e) =>
                    e.key === 'Enter' && deleteOperatingExpense(oe.id)}
                >
                  <span class="material-symbols-outlined">delete</span>
                </Pill>
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    </div>

    <div class="form">
      <h4>Add Operating Expense</h4>
      <InsetInput
        bind:value={newOperatingExpense.date}
        name="date"
        type="date"
        id="op-expense-date"
        >Date
      </InsetInput>
      <InsetInput
        bind:value={newOperatingExpense.paidTo}
        name="paidTo"
        type="text"
        id="op-expense-paid-to"
        >Paid To
      </InsetInput>
      <InsetInput
        bind:value={newOperatingExpense.purpose}
        name="purpose"
        type="text"
        id="op-expense-purpose"
        >Purpose
      </InsetInput>
      <InsetInput
        bind:value={newOperatingExpense.amount}
        min="0"
        name="amount"
        type="number"
        id="op-expense-amount"
        >Amount
      </InsetInput>
      <Pill
        hover
        color="#3c3"
        on:click={createOperatingExpense}
        on:keypress={(e) => e.key === 'Enter' && createOperatingExpense}
      >
        <span class="material-symbols-outlined">add</span>
      </Pill>
    </div>
  </div>
</div>

<style>
  .flex {
    display: flex;
    align-items: center;
  }

  h1 {
    margin: 0.5rem 0;
  }

  .group {
    font-size: 1rem;
  }

  .caps {
    font-variant: small-caps;
  }

  .cards {
    margin: 1rem 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.5rem;
  }

  .body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    place-items: start;
  }

  .in,
  .out {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .currency {
    text-align: right;
  }

  .operating-expenses {
    display: grid;
    grid-template-columns: 4fr 1fr;
    align-items: start;
    gap: 2rem;
  }

  .operating {
    color: #ea6c25;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid var(--fg-color-mid);
    padding: 8px;
    text-align: left;
  }

  .operating-summary {
    font-size: 0.8rem;
  }
</style>
