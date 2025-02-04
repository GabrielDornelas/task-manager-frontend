<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="username"
      type="text"
      label="Usuário"
      :rules="[(val) => !!val || 'Usuário é obrigatório']"
    />

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
        label="Cadastrar"
        type="submit"
        color="primary"
        class="full-width"
        :loading="authStore.loading"
      />
    </div>

    <div class="text-center q-pt-sm">
      <q-btn flat color="primary" label="Já tenho conta" :to="{ name: 'login' }" />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'RegisterPage',

  setup() {
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const isPwd = ref(true)
    const authStore = useAuthStore()
    const router = useRouter()
    const $q = useQuasar()

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const onSubmit = async () => {
      try {
        await authStore.register(username.value, email.value, password.value)
        router.push({ name: 'task' })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erro ao cadastrar usuário',
        })
      }
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      isPwd,
      authStore,
      validateEmail,
      onSubmit,
    }
  },
})
</script>
