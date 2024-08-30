<script lang="ts">
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import moment, { type Moment } from 'moment';
  import Card from '$lib/ui/Card.svelte';
  import { formatCurrency } from '$lib/api/util';
  import { afetch } from '$lib/http';
  import type { Statistics } from '@types/global';
  import Pill from '$lib/ui/Pill.svelte';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';

  let selectedPreset: string = 'this-month';
  let startDate = moment().subtract(1, 'days');
  let endDate = moment();

  let stats: Statistics;

  let income = 0;
  let expenses = 0;
  let net = 0;

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

    net = income - expenses;
  }

  $: selectPreset(selectedPreset);

  $: if (startDate && endDate) {
    afetch(
      `http://localhost:8080/api/stats/${moment(startDate).utc().format('YYYY-MM-DD')}/${moment(endDate).utc().format('YYYY-MM-DD')}`
    )
      .then((response) => response.json())
      .then((data) => (stats = data));
  }

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
      case 'custom':
        // Do nothing
        return;
    }

    startDate = <Moment>startDate.format('YYYY-MM-DD');
    endDate = <Moment>endDate.format('YYYY-MM-DD');
  };
</script>

<div>
  <h1>Analytics</h1>
  <div class="search-filters">
    <div class="dates">
      <!--      <div class="date-title">Select a Time Period to Display</div>-->
      <div class="group">
        <StyledInput bind:value={selectedPreset} type="select">
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last-7-days">Last 7 Days</option>
          <option value="last-30-days">Last 30 Days</option>
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
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
      </div>
    </div>
  </div>
  <div class="cards">
    <Card>
      <!--      <svelte:fragment slot="header">Customers</svelte:fragment>-->
      <!--      <div>{stats?.customers}</div>-->
      <svelte:fragment slot="header">{stats?.totalOrders}</svelte:fragment>
      <div>Orders</div>
    </Card>
    <Card color="#3cf">
      <!--      <svelte:fragment slot="header">Income</svelte:fragment>-->
      <!--      <div>{formatCurrency(income)}</div>-->
      <svelte:fragment slot="header">{formatCurrency(income)}</svelte:fragment>
      <div>Income</div>
    </Card>
    <Card color="orange">
      <!--      <svelte:fragment slot="header">Expenses</svelte:fragment>-->
      <!--      <div>{formatCurrency(expenses)}</div>-->
      <svelte:fragment slot="header">{formatCurrency(expenses)}</svelte:fragment
      >
      <div>Expenses</div>
    </Card>
    <Card color={net >= 0 ? 'lime' : 'red'}>
      <!--      <svelte:fragment slot="header">Net Income</svelte:fragment>-->
      <!--      <div>{formatCurrency(net)}</div>-->
      <svelte:fragment slot="header">{formatCurrency(net)}</svelte:fragment>
      <div>Net Income</div>
    </Card>
  </div>
  <div class="body">
    <div class="in">
      <LabeledInput value={formatCurrency(stats?.creation)} readonly>
        Creation
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.prints)} readonly>
        Prints
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.frames)} readonly>
        Frames
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.roots)} readonly>
        Roots
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.leaves)} readonly>
        Leaves
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.dateBranches)} readonly>
        Date Branches
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.shipping)} readonly>
        Shipping
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.updates)} readonly>
        Updates
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.custom)} readonly>
        Custom
      </LabeledInput>
    </div>

    <div class="out">
      <LabeledInput value={formatCurrency(stats?.printExpenses)} readonly>
        Prints
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.frameExpenses)} readonly>
        Frames
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.shippingExpenses)} readonly>
        Shipping
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.taxes)} readonly>
        Taxes
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.fees)} readonly>
        Fees
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.artists)} readonly>
        Artists
      </LabeledInput>
      <LabeledInput value={formatCurrency(stats?.other)} readonly>
        Other
      </LabeledInput>
    </div>
  </div>
</div>

<style>
  .caps {
    font-variant: small-caps;
  }

  .cards {
    margin: 1rem 0;
    display: flex;
    justify-content: space-evenly;
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
</style>
