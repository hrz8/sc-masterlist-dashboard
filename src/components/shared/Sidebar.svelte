<script lang="ts">
  import {
    Icon,
    Tooltip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
  } from 'sveltestrap'
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
</script>

<div id="sidebar-wrapper" class="d-flex flex-column flex-shrink-0">
  <a use:link href="/" id="sidebar-app" class="bg-dark bg-gradient text-light text-center p-3 link-dark text-decoration-none">
    <Icon class="h3" name="house-door" />
  </a>
  <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
    <li>
      <a use:link use:active={{path: '/', className: 'active'}} href="/" id="sidebar-dashboard" class="nav-link py-3 border-bottom">
        <Icon class="h4" name="speedometer2" />
      </a>
      <Tooltip target="sidebar-dashboard" placement="right">Dashboard</Tooltip>
    </li>
    <li>
      <a use:link use:active={{path: '/part-list*', className: 'active'}} href="/part-list" id="sidebar-editor" class="nav-link py-3 border-bottom">
        <Icon class="h4" name="bounding-box" />
      </a>
      <Tooltip target="sidebar-editor" placement="right">Part List</Tooltip>
    </li>
    <li>
      <a use:link use:active={{path: '/partner-list*', className: 'active'}} href="/partner-list" id="sidebar-faq" class="nav-link py-3 border-bottom">
        <Icon class="h4" name="people" />
      </a>
      <Tooltip target="sidebar-faq" placement="right">Partner List</Tooltip>
    </li>
  </ul>
  <Dropdown class="border-top" direction="right" style="position: unset;">
    <DropdownToggle tag="div">
      <a href="/" on:click="{(e) => e.preventDefault()}" class="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none">
        <Icon class="h4" name="person-circle" />
      </a>
    </DropdownToggle>
    <DropdownMenu class="text-small shadow">
      <DropdownItem header>Account</DropdownItem>
      <DropdownItem>
        <Icon class="h4" name="person-badge" /> Profile
      </DropdownItem>
      <DropdownItem>
        <Icon class="h4" name="gear" /> Settings
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem>
        <Icon class="h4" name="box-arrow-right" /> Sign Out
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</div>

<style>
#sidebar-wrapper {
  width: 4.5em;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0.125em 0.5em rgb(0 0 0 / 15%);
}
.nav-flush .nav-link {
  border-radius: 0;
}
</style>
