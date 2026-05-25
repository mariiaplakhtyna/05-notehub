import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import SearchBox from '../SearchBox/SearchBox';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';

import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

import css from './App.module.css';

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={debouncedSearch} />

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && <p>Error loading notes.</p>}

      {notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          forcePage={page - 1}
          onPageChange={({ selected }) => {
            setPage(selected + 1);
          }}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}