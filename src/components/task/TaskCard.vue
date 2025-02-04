<!-- src/components/task/TaskCard.vue -->
<template>
  <q-card class="my-card">
    <q-card-section>
      <div><strong>Título:</strong> {{ task.title }}</div>
      <div><strong>Descrição:</strong> {{ task.description }}</div>
      <div><strong>Vencimento:</strong> {{ formatDate(task.expire_date) }}</div>
      <div>
        <strong>Status:</strong>
        <q-chip :color="getStatusColor(task.status)" text-color="white">
          {{ getStatusLabel(task.status) }}
        </q-chip>
      </div>
      <div><strong>Criada em:</strong> {{ formatDate(task.created_at) }}</div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat round color="primary" icon="edit" @click="editTask()" />
      <q-btn flat round color="negative" icon="delete" @click="deleteTask()" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    task: Object,
    editTask: Function,
    deleteTask: Function,
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },
    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'positive',
      }
      return colors[status] || 'grey'
    },
    getStatusLabel(status) {
      const labels = {
        pending: 'Pendente',
        in_progress: 'Em Progresso',
        completed: 'Concluída',
      }
      return labels[status] || status
    },
  },
}
</script>

<style scoped>
.my-card {
  margin: 10px;
}
</style>
