import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProgressState {
  completed: Record<string, boolean>  // exerciseId -> completed
  attempts: Record<string, number>    // exerciseId -> attempt count
}

const STORAGE_KEY = 'workshop_progress'

const loadFromStorage = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completed: {}, attempts: {} }
}

const saveToStorage = (state: ProgressState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

const initialState: ProgressState = loadFromStorage()

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    markCompleted(state, action: PayloadAction<string>) {
      state.completed[action.payload] = true
      saveToStorage(state)
    },
    recordAttempt(state, action: PayloadAction<string>) {
      state.attempts[action.payload] = (state.attempts[action.payload] || 0) + 1
      saveToStorage(state)
    },
    resetProgress(state) {
      state.completed = {}
      state.attempts = {}
      saveToStorage(state)
    },
  },
})

export const { markCompleted, recordAttempt, resetProgress } = progressSlice.actions
export default progressSlice.reducer
