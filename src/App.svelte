<script lang="ts">
  import { setContext } from 'svelte';
  import { Styles } from 'sveltestrap';
  import { SvelteToast } from '@zerodevx/svelte-toast'
  import { toast } from '@zerodevx/svelte-toast';

  import Router from './Routes.svelte';
  import Sidebar from './components/shared/Sidebar.svelte';
  import { RestAPI } from './services/rest/service';
  import {
    endpoints as masterlistEndpoints,
    BASE_URL as MASTERLIST_BASE_URL
  } from './services/rest/endpoints/masterlist-service';

  // initialize service
  setContext('masterlistService', new RestAPI(MASTERLIST_BASE_URL, masterlistEndpoints));
  setContext('toastSuccess', (message: string) => {
    toast.push(message, {
      theme: {
        '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A'
      }
    });
  });
  setContext('toastError', (message: string) => {
    toast.push(message, {
      pausable: true,
      theme: {
        '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
      }
    });
  });
</script>

<Styles />
<SvelteToast />

<main>
  <Sidebar />
  <Router />
</main>

<style>
  main {
    display: flex;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
  }
</style>
