<template>
  <div class="notes-app">
    <!-- Notes Sidebar -->
    <div class="notes-sidebar">
      <div class="sidebar-header">
        <h3>Notes</h3>
        <button class="new-note-btn" @click="createNote">+</button>
      </div>
      
      <div class="notes-list">
        <div
          v-for="note in notes"
          :key="note.id"
          class="note-item"
          :class="{ active: note.id === activeNoteId }"
          @click="selectNote(note.id)"
        >
          <div class="note-title">{{ note.title || 'Untitled' }}</div>
          <div class="note-preview">{{ note.preview }}</div>
          <div class="note-date">{{ note.date }}</div>
        </div>
      </div>
    </div>
    
    <!-- Notes Editor -->
    <div class="notes-editor">
      <div v-if="activeNote" class="editor-container">
        <input
          v-model="activeNote.title"
          type="text"
          class="note-title-input"
          placeholder="Title"
          @input="updateNote"
        />
        <textarea
          v-model="activeNote.content"
          class="note-content-input"
          placeholder="Start typing..."
          @input="updateNote"
        />
      </div>
      <div v-else class="no-note-selected">
        <p>Select a note or create a new one</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Note {
  id: string
  title: string
  content: string
  preview: string
  date: string
}

const notes = ref<Note[]>([
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is your first note! You can create, edit, and organize your thoughts here.\n\nNotes is a simple and elegant way to capture your ideas.',
    preview: 'This is your first note! You can create, edit...',
    date: 'Today 10:30 AM',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: '- Apples\n- Milk\n- Bread\n- Coffee\n- Eggs',
    preview: '- Apples - Milk - Bread - Coffee - Eggs',
    date: 'Yesterday',
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: 'Team meeting notes:\n- Discussed Q1 goals\n- Reviewed project timeline\n- Assigned action items',
    preview: 'Team meeting notes: - Discussed Q1 goals...',
    date: 'Jan 17',
  },
])

const activeNoteId = ref('1')
let nextNoteId = 4

const activeNote = computed(() => notes.value.find(n => n.id === activeNoteId.value))

function selectNote(noteId: string) {
  activeNoteId.value = noteId
}

function createNote() {
  const newNote: Note = {
    id: String(nextNoteId++),
    title: '',
    content: '',
    preview: '',
    date: 'Just now',
  }
  notes.value.unshift(newNote)
  activeNoteId.value = newNote.id
}

function updateNote() {
  if (!activeNote.value) return
  
  // Update preview
  const contentPreview = activeNote.value.content
    .replace(/\n/g, ' ')
    .substring(0, 50)
  activeNote.value.preview = contentPreview + (contentPreview.length >= 50 ? '...' : '')
  
  // Update date
  activeNote.value.date = 'Just now'
}
</script>

<style scoped>
.notes-app {
  height: 100%;
  display: flex;
  background: var(--app-bg);
}

.notes-sidebar {
  width: 280px;
  background: var(--app-sidebar-bg);
  border-right: 1px solid var(--app-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--app-border);
}

.sidebar-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.new-note-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--macos-blue);
  color: white;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.new-note-btn:hover {
  transform: scale(1.1);
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--app-border);
  transition: background 0.15s ease;
}

.note-item:hover {
  background: var(--app-item-hover);
}

.note-item.active {
  background: var(--app-bg);
  border-right: 3px solid var(--macos-blue);
}

.note-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-preview {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-date {
  font-size: 11px;
  color: var(--text-tertiary);
}

.notes-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
}

.note-title-input {
  border: none;
  outline: none;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  background: transparent;
}

.note-title-input::placeholder {
  color: var(--text-tertiary);
}

.note-content-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  resize: none;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background: transparent;
}

.note-content-input::placeholder {
  color: var(--text-tertiary);
}

.no-note-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 16px;
}
</style>
