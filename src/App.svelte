<script lang="ts">
  import { Styles } from 'sveltestrap'
  import { link } from 'svelte-spa-router'
  import Counter from './lib/Counter.svelte'

  import Router from './Routes.svelte'
  import Sidebar from './components/shared/Sidebar.svelte'
</script>

<Styles />

<main>
  <Sidebar />
  <!-- <h1>Hello Typescript!</h1>

  <nav>
    <a use:link href="/">Home</a>
    <a use:link href="/part-list">Part List</a>
    <a use:link href="/partner-list">Partner List</a>
  </nav> -->

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
