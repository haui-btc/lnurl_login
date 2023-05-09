const noteElement = document.getElementById('note');
const saveButton = document.getElementById('save');
const messageElement = document.getElementById('message');

// Replace this with your server's save note endpoint <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const saveNoteEndpoint = '/api/save-note';

async function saveNote() {
    const publicKey = localStorage.getItem('publicKey');
    const note = noteElement.value;

    if (!publicKey) {
        messageElement.textContent = 'Error: User not authenticated.';
        return;
    }

    if (!note.trim()) {
        messageElement.textContent = 'Error: Note cannot be empty.';
        return;
    }

    try {
        const response = await axios.post(saveNoteEndpoint, { publicKey, note });
        messageElement.textContent = response.data.message;
        noteElement.value = '';
    } catch (error) {
        console.error('Error saving note:', error);
        messageElement.textContent = 'Error saving note. Please try again later.';
    }
}

saveButton.addEventListener('click', saveNote);


// Add this to your notes.js file
const notesListElement = document.getElementById('notes');

// Replace this with your server's fetch notes endpoint <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const fetchNotesEndpoint = '/api/fetch-notes';

async function fetchNotes() {
  const publicKey = localStorage.getItem('publicKey');

  if (!publicKey) {
    messageElement.textContent = 'Error: User not authenticated.';
    return;
  }

  try {
    const response = await axios.get(fetchNotesEndpoint, { params: { publicKey } });
    const notes = response.data;

    // Clear the list and populate with fetched notes
    notesListElement.innerHTML = '';

    notes.forEach(note => {
      const listItem = document.createElement('li');
      listItem.textContent = `${note.note} (saved at ${new Date(note.created_at).toLocaleString()})`;
      notesListElement.appendChild(listItem);
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    messageElement.textContent = 'Error fetching notes. Please try again later.';
  }
}

// Fetch notes when the page loads
fetchNotes();

