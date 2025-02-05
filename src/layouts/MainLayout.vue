<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Gerenciador de Tarefas </q-toolbar-title>

        <q-btn-dropdown flat icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple :to="{ name: 'task' }" exact>
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Tarefas</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'metrics' }" exact>
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>Métricas</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'health' }" exact>
          <q-item-section avatar>
            <q-icon name="health_and_safety" />
          </q-item-section>
          <q-item-section>Saúde da Aplicação</q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'swagger' }" exact>
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Documentação Swagger</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false)
    const authStore = useAuthStore()
    const router = useRouter()

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push({ name: 'login' })
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      handleLogout,
    }
  },
})
</script>
