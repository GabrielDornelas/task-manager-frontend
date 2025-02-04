import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    currentTask: null,
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id) => state.tasks.find((task) => task.id === id),
  },

  actions: {
    async fetchTasks() {
      try {
        this.loading = true
        const response = await api.get('/tasks')
        this.tasks = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      try {
        const response = await api.post('/tasks', taskData)
        this.tasks.push(response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async updateTask(taskId, taskData) {
      try {
        const response = await api.put(`/tasks/${taskId}`, taskData)
        const index = this.tasks.findIndex((task) => task.id === taskId)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    async deleteTask(taskId) {
      try {
        await api.delete(`/tasks/${taskId}`)
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
      } catch (error) {
        throw error
      }
    },

    setCurrentTask(task) {
      this.currentTask = task
    },
  },
})
