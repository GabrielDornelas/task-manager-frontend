<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="email"
      type="email"
      label="E-mail"
      :rules="[
        (val) => !!val || 'E-mail é obrigatório',
        (val) => validateEmail(val) || 'E-mail inválido',
      ]"
    />

    <q-input
      v-model="password"
      :type="isPwd ? 'password' : 'text'"
      label="Senha"
      :rules="[(val) => !!val || 'Senha é obrigatória']"
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
        label="Entrar"
        type="submit"
        color="primary"
        class="full-width"
        :loading="authStore.loading"
      />
    </div>

    <div class="text-center q-pt-sm">
      <q-btn
        flat
        color="primary"
        label="Esqueci minha senha"
        @click="$router.push({ name: 'request-reset' })"
      />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const email = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const authStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const onSubmit = async () => {
      try {
        await authStore.login(email.value, password.value)
        router.push({ name: 'tasks' })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao fazer login',
        })
      }
    }

    return {
      email,
      password,
      isPwd,
      authStore,
      validateEmail,
      onSubmit,
    }
  },
})
</script>
