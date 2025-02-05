<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Saúde da Aplicação</div>
    </div>
    <q-card v-if="healthStatus">
      <q-card-section>
        <div><strong>Status:</strong> {{ getStatusLabel(healthStatus.status) }}</div>
        <div>
          <strong>Banco de Dados:</strong>
          {{ healthStatus.checks.database ? 'Conectado' : 'Desconectado' }}
        </div>
        <div>
          <strong>Redis:</strong> {{ healthStatus.checks.redis ? 'Conectado' : 'Desconectado' }}
        </div>
        <div><strong>API:</strong> {{ healthStatus.checks.api ? 'Funcionando' : 'Inativo' }}</div>
      </q-card-section>
    </q-card>
    <q-spinner v-if="loading" />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'HealthPage',
  methods: {
    getStatusLabel(status) {
      return status === 'healthy' ? 'Saudável' : 'Insalubre'
    },
  },
  setup() {
    const $q = useQuasar()
    const healthStatus = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const fetchHealthStatus = async () => {
      try {
        const response = await api.get('/health')
        healthStatus.value = response.data
      } catch (err) {
        $q.notify({
          type: 'negative',
          message: `Erro ao carregar status de saúde: ${err}`,
          position: 'top',
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchHealthStatus()
    })

    return {
      healthStatus,
      loading,
      error,
    }
  },
})
</script>
