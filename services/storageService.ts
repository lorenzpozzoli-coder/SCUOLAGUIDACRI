
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lesson } from '../types';

const SUPABASE_URL = "https://odwptkxnjweynirwuwbk.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd3B0a3huandleW5pcnd1d2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzc4OTQsImV4cCI6MjA4NjY1Mzg5NH0.Qjyne7DWwLGSv2B-psZAO8FQgp7L5-w__pF3OkRTHLs";

const isConfigured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes("INSERISCI_QUI");

let supabase: SupabaseClient | null = null;
if (isConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn("Configurazione Supabase non valida.");
  }
}

const LOCAL_KEY = 'cri_local_db';

export const storageService = {
  isCloudConnected: () => isConfigured && supabase !== null,

  getLessons: async (): Promise<Lesson[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('date', { ascending: true })
        .order('startTime', { ascending: true });
      
      if (!error && data) return data as Lesson[];
    }

    const localData = localStorage.getItem(LOCAL_KEY);
    const lessons: Lesson[] = localData ? JSON.parse(localData) : [];
    return lessons.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  },

  saveLesson: async (lesson: Omit<Lesson, 'id' | 'createdAt' | 'student'>): Promise<void> => {
    if (supabase) {
      const { error } = await supabase
        .from('lessons')
        .insert([{ ...lesson, student: '' }]);
      if (!error) return;
    }

    const localData = localStorage.getItem(LOCAL_KEY);
    const lessons: Lesson[] = localData ? JSON.parse(localData) : [];
    const newLesson: Lesson = {
      ...lesson,
      id: crypto.randomUUID(),
      student: '',
      createdAt: Date.now()
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify([...lessons, newLesson]));
  },

  updateStudent: async (lessonId: string, studentName: string): Promise<void> => {
    if (supabase) {
      const { error } = await supabase
        .from('lessons')
        .update({ student: studentName })
        .eq('id', lessonId);
      if (!error) return;
    }

    const localData = localStorage.getItem(LOCAL_KEY);
    const lessons: Lesson[] = localData ? JSON.parse(localData) : [];
    const updated = lessons.map(l => l.id === lessonId ? { ...l, student: studentName } : l);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  },

  deleteLesson: async (lessonId: string): Promise<void> => {
    if (supabase) {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
      if (!error) return;
    }

    const localData = localStorage.getItem(LOCAL_KEY);
    const lessons: Lesson[] = localData ? JSON.parse(localData) : [];
    const filtered = lessons.filter(l => l.id !== lessonId);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },

  subscribe: (onUpdate: () => void) => {
    if (supabase) {
      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, onUpdate)
        .subscribe();
      
      return { unsubscribe: () => channel.unsubscribe() };
    }
    return { unsubscribe: () => {} };
  }
};
