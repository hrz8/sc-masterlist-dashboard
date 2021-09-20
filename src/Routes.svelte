
<script lang="ts">
  import Router from 'svelte-spa-router'

  // pages
  import Home from './pages/Home.svelte'
  import Partlist from './pages/Partlist.svelte'
  import PartnerList from './pages/Partner.svelte'

  const routes = {
    '/': Home,
    '/part-list': Partlist,
    '/partner-list': PartnerList
  }
</script>

<Router {routes} />
