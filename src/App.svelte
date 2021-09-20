<script lang="ts">
  import { Styles } from 'sveltestrap'

  import Router from './Routes.svelte'
  import Sidebar from './components/shared/Sidebar.svelte'
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
