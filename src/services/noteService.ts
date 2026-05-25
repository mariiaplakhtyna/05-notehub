import axios from 'axios';
import type { Note, NotesResponse, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  const response = await instance.get(`${BASE_URL}/notes`, {
    params: {
  page,
  search,
  perPage: 12,
},
  });

  return response.data;
};

export const createNote = async (
  note: CreateNoteData
): Promise<Note> => {
  const response = await instance.post(
    `${BASE_URL}/notes`,
    note
  );

  return response.data;
};

export const deleteNote = async (
  id: number
): Promise<Note> => {
  const response = await instance.delete(
    `${BASE_URL}/notes/${id}`
  );

  return response.data;
};