<template>
  <q-chip :color="statusColor" text-color="white" :label="statusLabel" />
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TaskStatus',

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const statusColor = computed(() => {
      const colors = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'positive',
      }
      return colors[props.status] || 'grey'
    })

    const statusLabel = computed(() => {
      const labels = {
        pending: 'Pendente',
        in_progress: 'Em Progresso',
        completed: 'Concluída',
      }
      return labels[props.status] || props.status
    })

    return {
      statusColor,
      statusLabel,
    }
  },
})
</script>
