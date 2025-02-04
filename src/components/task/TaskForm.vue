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
      v-model="form.expire_date"
      mask="##/##/####"
      :rules="[
        (val) => !!val || 'Data é obrigatória',
        (val) => isValidDate(val) || 'Data inválida',
      ]"
      label="Data de Vencimento"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="form.expire_date" mask="DD/MM/YYYY" :locale="ptBR" today-btn />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-select
      v-model="form.status"
      :options="statusOptions"
      label="Status"
      :rules="[(val) => !!val || 'Status é obrigatório']"
      emit-value
      map-options
      behavior="menu"
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
      default: () => null,
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
      expire_date: '',
      status: 'pending',
    })

    const statusOptions = [
      { label: 'Pendente', value: 'pending' },
      { label: 'Em Progresso', value: 'in_progress' },
      { label: 'Concluída', value: 'completed' },
    ]

    const isEditing = ref(false)

    const ptBR = {
      days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
      daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
      months:
        'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split(
          '_',
        ),
      monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    }

    const isValidDate = (dateStr) => {
      if (!dateStr) return false
      const [day, month, year] = dateStr.split('/')
      const date = new Date(year, month - 1, day)
      return (
        date instanceof Date &&
        !isNaN(date) &&
        date.getDate() == day &&
        date.getMonth() == month - 1 &&
        date.getFullYear() == year
      )
    }

    const formatDateForAPI = (dateStr) => {
      if (!dateStr) return ''
      const [day, month, year] = dateStr.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    onMounted(() => {
      if (props.task) {
        const task = { ...props.task }
        if (task.expire_date) {
          const date = new Date(task.expire_date)
          task.expire_date = date.toLocaleDateString('pt-BR')
        }
        if (typeof task.status === 'string') {
          const statusOption = statusOptions.find((opt) => opt.value === task.status)
          task.status = statusOption || statusOptions[0]
        }
        form.value = task
        isEditing.value = true
      }
    })

    const onSubmit = () => {
      const formData = { ...form.value }
      formData.expire_date = formatDateForAPI(formData.expire_date)
      formData.status =
        typeof formData.status === 'object' ? formData.status.value : formData.status
      emit('submit', formData)
    }

    return {
      form,
      statusOptions,
      isEditing,
      onSubmit,
      ptBR,
      isValidDate,
    }
  },
})
</script>
