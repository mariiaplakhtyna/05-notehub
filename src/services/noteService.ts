import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  const response = await instance.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      search,
    },
  });

  return response.data;
};

export const createNote = async (
  note: CreateNoteData
): Promise<Note> => {
  const response = await instance.post<Note>('/notes', note);

  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);

  return response.data;
};