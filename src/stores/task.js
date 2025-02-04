import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const task = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentTask = ref(null)

  const getTask = () => task.value
  const getTaskById = (id) => task.value.find((task) => task.id === id)

  const fetchTasks = async () => {
    try {
      loading.value = true
      const response = await api.get('/task')
      task.value = response.data
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    try {
      loading.value = true
      const response = await api.post('/task', taskData)
      task.value = [...task.value, response.data]
      return response.data
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (taskId, taskData) => {
    try {
      loading.value = true
      const response = await api.put(`/task/${taskId}`, taskData)
      const index = task.value.findIndex((t) => t.id === taskId)
      if (index !== -1) {
        task.value[index] = response.data
        task.value = [...task.value]
      }
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (taskId) => {
    try {
      loading.value = true
      await api.delete(`/task/${taskId}`)
      task.value = task.value.filter((t) => t.id !== taskId)
      return true
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setCurrentTask = (task) => {
    currentTask.value = task
  }

  return {
    task,
    loading,
    error,
    currentTask,
    getTask,
    getTaskById,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setCurrentTask,
  }
})
