<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Métricas do Sistema</div>
    </div>
    <q-card v-if="metrics">
      <q-card-section>
        <div><strong>Usuários Ativos:</strong> {{ metrics.active_users }}</div>
        <div><strong>Tarefas por Status:</strong></div>
        <ul>
          <li v-for="(count, status) in metrics.tasks_by_status" :key="status">
            {{ getStatusLabel(status) }}: {{ count }}
          </li>
        </ul>
        <div>
          <strong>Tempo Médio de Resposta:</strong> {{ metrics.avg_response_time }} segundos
        </div>
        <div><strong>Taxa de Erros:</strong> {{ metrics.error_rate }}%</div>
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
  name: 'MetricsPage',
  methods: {
    getStatusLabel(status) {
      const labels = {
        pending: 'Pendente',
        in_progress: 'Em Progresso',
        completed: 'Concluída',
      }
      return labels[status] || status
    },
  },
  setup() {
    const $q = useQuasar()
    const metrics = ref(null)
    const loading = ref(true)

    const fetchMetrics = async () => {
      try {
        const response = await api.get('/metrics')
        metrics.value = response.data
      } catch (err) {
        $q.notify({
          type: 'negative',
          message: `Erro ao carregar métricas: ${err}`,
          position: 'top',
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchMetrics()
    })

    return {
      metrics,
      loading,
    }
  },
})
</script>
