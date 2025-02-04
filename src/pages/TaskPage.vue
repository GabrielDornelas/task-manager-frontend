<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Minhas Tarefas</div>
      <q-btn color="primary" icon="add" label="Nova Tarefa" @click="openTaskDialog()" />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="taskStore.task"
        :columns="columns"
        row-key="id"
        :loading="taskStore.loading"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input v-model="filter" placeholder="Pesquisar" dense outlined class="q-ml-md">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip :color="getStatusColor(props.value)" text-color="white">
              {{ getStatusLabel(props.value) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-group flat>
              <q-btn flat round color="primary" icon="edit" @click="openTaskDialog(props.row)" />
              <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" />
            </q-btn-group>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo para criar/editar tarefa -->
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

export default defineComponent({
  name: 'TaskPage',

  components: {
    TaskForm,
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
          await taskStore.updateTask(currentTask.value.id, formData)
          $q.notify({
            type: 'positive',
            message: 'Tarefa atualizada com sucesso',
            position: 'top',
          })
        } else {
          await taskStore.createTask(formData)
          $q.notify({
            type: 'positive',
            message: 'Tarefa criada com sucesso',
            position: 'top',
          })
        }
        taskDialog.value = false
        await taskStore.fetchTasks()
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
        return taskStore
          .deleteTask(task.id)
          .then(() => {
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
