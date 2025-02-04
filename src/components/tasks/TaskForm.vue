<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.title"
      label="Título"
      :rules="[(val) => !!val || 'Título é obrigatório']"
    />

    <q-input
      v-model="form.description"
      type="textarea"
      label="Descrição"
      :rules="[(val) => !!val || 'Descrição é obrigatória']"
    />

    <q-input
      v-model="form.due_date"
      type="date"
      label="Data de Vencimento"
      :rules="[(val) => !!val || 'Data é obrigatória']"
    />

    <q-select
      v-model="form.status"
      :options="statusOptions"
      label="Status"
      :rules="[(val) => !!val || 'Status é obrigatório']"
    />

    <div class="row q-gutter-sm justify-end">
      <q-btn label="Cancelar" color="negative" flat @click="$emit('cancel')" />
      <q-btn
        :label="isEditing ? 'Salvar' : 'Criar'"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'TaskForm',

  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit', 'cancel'],

  setup(props, { emit }) {
    const form = ref({
      title: '',
      description: '',
      due_date: '',
      status: 'pending',
    })

    const statusOptions = [
      { label: 'Pendente', value: 'pending' },
      { label: 'Em Progresso', value: 'in_progress' },
      { label: 'Concluída', value: 'completed' },
    ]

    const isEditing = ref(false)

    onMounted(() => {
      if (props.task.id) {
        form.value = { ...props.task }
        isEditing.value = true
      }
    })

    const onSubmit = () => {
      emit('submit', { ...form.value })
    }

    return {
      form,
      statusOptions,
      isEditing,
      onSubmit,
    }
  },
})
</script>
