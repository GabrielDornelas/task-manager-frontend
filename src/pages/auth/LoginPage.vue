<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="username"
      type="text"
      label="Usuário"
      :rules="[(val) => !!val || 'Usuário é obrigatório']"
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
      <div class="row q-gutter-sm justify-center">
        <q-btn flat color="primary" label="Esqueci minha senha" :to="{ name: 'request-reset' }" />
        <q-btn flat color="primary" label="Criar conta" :to="{ name: 'register' }" />
      </div>
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
    const username = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const authStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()

    const onSubmit = async () => {
      try {
        await authStore.login(username.value, password.value)
        router.push({ name: 'task' })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao fazer login',
        })
      }
    }

    return {
      username,
      password,
      isPwd,
      authStore,
      onSubmit,
    }
  },
})
</script>
