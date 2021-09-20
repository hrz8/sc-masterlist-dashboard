<script lang="ts">
  import { Styles } from 'sveltestrap'
  import { link } from 'svelte-spa-router'
  import Counter from './lib/Counter.svelte'

  import Router from './Routes.svelte'
</script>

<Styles />

<main>
  <h1>Hello Typescript!</h1>

  <Counter />

  <nav>
    <a use:link href="/">Home</a>
    <a use:link href="/part-list">Part List</a>
    <a use:link href="/partner-list">Partner List</a>
  </nav>

  <hr>

  <Router />
</main>
