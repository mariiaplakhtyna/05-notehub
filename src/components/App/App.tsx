import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import SearchBox from '../SearchBox/SearchBox';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import Pagination from '../Pagination/Pagination';

import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

import css from './App.module.css';

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (values: {
    title: string;
    content: string;
    tag: NoteTag;
  }) => {
    createMutation.mutate(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </header>

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && <NoteList notes={data.notes} onDelete={deleteMutation.mutate} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}