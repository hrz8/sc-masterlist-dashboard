<script lang="ts">
  import type { RestAPI } from 'src/services/rest/service'

  import { getContext, onMount } from 'svelte';

  import Select from 'svelte-select'

  const masterlistService = (getContext('masterlistService')) as RestAPI

  let items = [
    {value: 'chocolate', label: 'Chocolate'},
    {value: 'pizza', label: 'Pizza'},
    {value: 'cake', label: 'Cake'},
    {value: 'chips', label: 'Chips'},
    {value: 'ice-cream', label: 'Ice Cream'},
  ];

  let value = {value: 'cake', label: 'Cake'};

  function handleSelect(event) {
    console.log('selected item', event.detail);
    // .. do something here 🙂
  }

  onMount(async () => {
    const { message } = await masterlistService.call('partner.detail', {
      params: {
        id: 'a3fd278a-2fec-46da-8910-e475fc83086d'
      }
    })
    console.log(message);
  })
</script>

<h1>
  Partner
</h1>
<table class="table">
  <caption>List of users</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>

<!-- <Select {items} {value} on:select={handleSelect} isClearable={false}></Select> -->
