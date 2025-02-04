<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="text-body2 q-mb-md text-center">
      Digite seu e-mail para receber as instruções de recuperação de senha.
    </div>

    <q-input
      v-model="email"
      type="email"
      label="E-mail"
      :rules="[
        (val) => !!val || 'E-mail é obrigatório',
        (val) => validateEmail(val) || 'E-mail inválido',
      ]"
    />

    <div class="full-width q-pt-md">
      <q-btn label="Enviar" type="submit" color="primary" class="full-width" :loading="loading" />
    </div>

    <div class="text-center q-pt-sm">
      <q-btn
        flat
        color="primary"
        label="Voltar ao login"
        @click="$router.push({ name: 'login' })"
      />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'RequestResetPage',

  setup() {
    const email = ref('')
    const loading = ref(false)
    const authStore = useAuthStore()
    const $q = useQuasar()

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const onSubmit = async () => {
      try {
        loading.value = true
        await authStore.requestPasswordReset(email.value)
        $q.notify({
          type: 'positive',
          message: 'Instruções enviadas para seu e-mail',
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao solicitar reset de senha',
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      validateEmail,
      onSubmit,
    }
  },
})
</script>
