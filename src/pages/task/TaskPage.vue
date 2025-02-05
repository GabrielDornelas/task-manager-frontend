<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Minhas Tarefas</div>
      <q-btn color="primary" icon="add" label="Nova Tarefa" @click="openTaskDialog()" />
    </div>

    <div class="q-gutter-md">
      <task-card
        v-for="task in taskStore.task"
        :key="task.id"
        :task="task"
        :editTask="() => openTaskDialog(task)"
        :deleteTask="() => confirmDelete(task)"
      />
    </div>

    <q-dialog v-model="taskDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ dialogTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <task-form
            :task="currentTask"
            :loading="formLoading"
            @submit="handleSubmit"
            @cancel="taskDialog = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useTaskStore } from 'src/stores/task'
import { useQuasar } from 'quasar'
import TaskForm from 'components/task/TaskForm.vue'
import TaskCard from 'components/task/TaskCard.vue'

export default defineComponent({
  name: 'TaskPage',

  components: {
    TaskForm,
    TaskCard,
  },

  setup() {
    const taskStore = useTaskStore()
    const $q = useQuasar()
    const taskDialog = ref(false)
    const currentTask = ref(null)
    const formLoading = ref(false)
    const filter = ref('')

    const columns = [
      { name: 'title', label: 'Título', field: 'title', sortable: true },
      { name: 'description', label: 'Descrição', field: 'description' },
      {
        name: 'expire_date',
        label: 'Vencimento',
        field: 'expire_date',
        sortable: true,
        format: (val) => {
          if (!val) return ''
          const date = new Date(val)
          return date.toLocaleDateString('pt-BR')
        },
      },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
      {
        name: 'created_at',
        label: 'Criada em',
        field: 'created_at',
        sortable: true,
        format: (val) => {
          if (!val) return ''
          const date = new Date(val)
          return date.toLocaleDateString('pt-BR')
        },
      },
      { name: 'actions', label: 'Ações', field: 'actions' },
    ]

    onMounted(() => {
      taskStore.fetchTasks()
    })

    const openTaskDialog = (task = null) => {
      currentTask.value = task
      taskDialog.value = true
    }

    const handleSubmit = async (formData) => {
      try {
        formLoading.value = true
        if (currentTask.value?.id) {
          const updatedTask = { ...currentTask.value, ...formData }
          const index = taskStore.task.findIndex((t) => t.id === currentTask.value.id)
          if (index !== -1) {
            taskStore.task[index] = updatedTask
          }
          await taskStore.updateTask(currentTask.value.id, formData)
          taskStore.fetchTasks()
          $q.notify({
            type: 'positive',
            message: 'Tarefa atualizada com sucesso',
            position: 'top',
          })
        } else {
          const newTask = await taskStore.createTask(formData)
          taskStore.task.push(newTask)
          taskStore.fetchTasks()
          $q.notify({
            type: 'positive',
            message: 'Tarefa criada com sucesso',
            position: 'top',
          })
        }
        taskDialog.value = false
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao salvar tarefa',
          position: 'top',
        })
      } finally {
        formLoading.value = false
      }
    }

    const confirmDelete = (task) => {
      $q.dialog({
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir esta tarefa?',
        persistent: true,
        ok: {
          label: 'Confirmar',
          color: 'negative',
          flat: true,
        },
        cancel: {
          label: 'Cancelar',
          color: 'grey',
          flat: true,
        },
      }).onOk(() => {
        const index = taskStore.task.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          taskStore.task.splice(index, 1)
        }
        return taskStore
          .deleteTask(task.id)
          .then(() => {
            taskStore.fetchTasks()
            $q.notify({
              type: 'positive',
              message: 'Tarefa excluída com sucesso',
              position: 'top',
            })
          })
          .catch((error) => {
            console.error('Erro ao excluir tarefa:', error)
            $q.notify({
              type: 'negative',
              message: error.response?.data?.message || 'Erro ao excluir tarefa',
              position: 'top',
            })
          })
      })
    }

    const getStatusColor = (status) => {
      const colors = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'positive',
      }
      return colors[status] || 'grey'
    }

    const getStatusLabel = (status) => {
      const labels = {
        pending: 'Pendente',
        in_progress: 'Em Progresso',
        completed: 'Concluída',
      }
      return labels[status] || status
    }

    return {
      taskStore,
      columns,
      taskDialog,
      currentTask,
      formLoading,
      filter,
      openTaskDialog,
      handleSubmit,
      confirmDelete,
      getStatusColor,
      getStatusLabel,
      dialogTitle: computed(() => (currentTask.value?.id ? 'Editar Tarefa' : 'Nova Tarefa')),
    }
  },
})
</script>
