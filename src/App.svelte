<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { Styles } from 'sveltestrap'

  import Router from './Routes.svelte'
  import Sidebar from './components/shared/Sidebar.svelte'
  import { RestAPI } from './services/rest/service';
  import {
    endpoints as masterlistEndpoints,
    BASE_URL as MASTERLIST_BASE_URL
  } from './services/rest/endpoints/masterlist-service';
  setContext('masterlistService', new RestAPI(MASTERLIST_BASE_URL, masterlistEndpoints))

  // onMount(() => {
  // })
</script>

<Styles />

<main>
  <Sidebar />
  <Router />
</main>

<style>
  main {
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
