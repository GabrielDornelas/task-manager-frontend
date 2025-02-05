<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="text-body2 q-mb-md text-center">Digite sua nova senha.</div>

    <q-input
      v-model="password"
      :type="isPwd ? 'password' : 'text'"
      label="Nova Senha"
      :rules="[
        (val) => !!val || 'Senha é obrigatória',
        (val) => val.length >= 3 || 'A senha deve ter no mínimo 3 caracteres',
      ]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <q-input
      v-model="confirmPassword"
      :type="isPwd ? 'password' : 'text'"
      label="Confirmar Senha"
      :rules="[
        (val) => !!val || 'Confirmação de senha é obrigatória',
        (val) => val === password || 'As senhas não conferem',
      ]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div class="full-width q-pt-md">
      <q-btn
        label="Alterar Senha"
        type="submit"
        color="primary"
        class="full-width"
        :loading="loading"
      />
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
import { defineComponent, ref, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ResetPasswordPage',

  setup() {
    const password = ref('')
    const confirmPassword = ref('')
    const isPwd = ref(true)
    const loading = ref(false)
    const token = ref('')
    const authStore = useAuthStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    onMounted(() => {
      token.value = route.params.token
      if (!token.value) {
        $q.notify({
          type: 'negative',
          message: 'Token inválido',
        })
        router.push({ name: 'login' })
      }
    })

    const onSubmit = async () => {
      try {
        loading.value = true
        await authStore.resetPassword(token.value, password.value)
        $q.notify({
          type: 'positive',
          message: 'Senha alterada com sucesso',
        })
        router.push({ name: 'login' })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao alterar senha',
        })
      } finally {
        loading.value = false
      }
    }

    return {
      password,
      confirmPassword,
      isPwd,
      loading,
      onSubmit,
    }
  },
})
</script>
