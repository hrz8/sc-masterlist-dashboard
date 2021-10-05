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

  // init context
  const toastSuccess = (message: string) => {
    toast.push(message, {
      theme: {
        '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A'
      }
    });
  };
  const toastError = (message: string) => {
    toast.push(message, {
      pausable: true,
      theme: {
        '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
      }
    });
  };
  setContext('toastSuccess', toastSuccess);
  setContext('toastError', toastError);
  setContext('toastErrorWrapper', (error: any, message: string) => {
    toastError(`
        ${message}<br>
        reason: ${error.message}${
          error.data?.reason
          ? `, ${error.data.reason}`
          : ''
        }${
          error.errorCode
          ? `<br>code: [${error.errorCode}]` 
          : ''
        }
      `);
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
