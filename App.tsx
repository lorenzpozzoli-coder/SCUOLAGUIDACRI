
import React, { useState, useEffect, useCallback } from 'react';
import { Lesson, UserRole } from './types';
import { storageService } from './services/storageService';
import LessonTable from './components/LessonTable';
import InstructorForm from './components/InstructorForm';

const INSTRUCTOR_PASSWORD = 'Kamenaga';
const DELETE_PASSWORD = 'Valhalla';

const App: React.FC = () => {
  // Impostiamo STUDENT come default per mostrare subito la tabella
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloud, setIsCloud] = useState(false);
  
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await storageService.getLessons();
    setLessons(data);
    setIsCloud(storageService.isCloudConnected());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const sub = storageService.subscribe(loadData);
    return () => { sub.unsubscribe(); };
  }, [loadData]);

  const handleInstructorAccess = () => {
    if (passwordInput === INSTRUCTOR_PASSWORD) {
      setRole(UserRole.INSTRUCTOR);
      setShowPasswordModal(false);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Password errata.');
    }
  };

  const handleAddLesson = async (data: Omit<Lesson, 'id' | 'student' | 'createdAt'>) => {
    await storageService.saveLesson(data);
    await loadData();
  };

  const handleBookLesson = async (lessonId: string, studentName: string) => {
    await storageService.updateStudent(lessonId, studentName);
    await loadData();
  };

  const handleDeleteRequest = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeletePasswordInput('');
  };

  const handleConfirmDelete = async () => {
    if (deletePasswordInput === DELETE_PASSWORD) {
      if (lessonToDelete) {
        await storageService.deleteLesson(lessonToDelete);
        setShowDeleteModal(false);
        setLessonToDelete(null);
        setDeletePasswordInput('');
        await loadData();
      }
    } else {
      setDeleteError('Password errata.');
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">PROGRAMMA LEZIONI</h1>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${isCloud ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isCloud ? 'Cloud' : 'Local'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Scuola Guida C.R.I.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {loading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
            
            {/* Navigazione Ruoli */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setRole(UserRole.STUDENT)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${role === UserRole.STUDENT ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ALLIEVO
              </button>
              <button 
                onClick={() => role !== UserRole.INSTRUCTOR && setShowPasswordModal(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${role === UserRole.INSTRUCTOR ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ISTRUTTORE
              </button>
            </div>

            {role === UserRole.INSTRUCTOR && (
              <button 
                onClick={() => setRole(UserRole.STUDENT)} 
                className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              >
                Esci
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="space-y-6">
          {role === UserRole.INSTRUCTOR && <InstructorForm onAdd={handleAddLesson} />}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Tabella Prenotazioni
                {role === UserRole.STUDENT && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Sola Lettura</span>}
              </h3>
              <div className="flex items-center gap-2">
                 <button onClick={loadData} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                 </button>
                 <span className="text-xs text-gray-400 font-medium">{lessons.length} record</span>
              </div>
            </div>
            
            <LessonTable 
              lessons={lessons} 
              role={role} 
              onBook={handleBookLesson}
              onDelete={role === UserRole.INSTRUCTOR ? handleDeleteRequest : undefined}
            />
          </div>
        </div>
      </main>

      {/* Modal Password Istruttore */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Area Riservata</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Inserisci la password per abilitare le funzioni di inserimento ed eliminazione.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInstructorAccess()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Password Istruttore"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-xs mb-4 font-bold">{loginError}</p>}
            <div className="flex gap-4">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Annulla</button>
              <button onClick={handleInstructorAccess} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Accedi</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Password Eliminazione */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold mb-2 text-red-600">Conferma Eliminazione</h3>
            <p className="text-gray-500 mb-6 text-sm">Inserisci la password di sicurezza per eliminare definitivamente questo record.</p>
            <input
              type="password"
              value={deletePasswordInput}
              onChange={(e) => setDeletePasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmDelete()}
              className="w-full border border-red-100 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-500 bg-red-50/30 transition-all"
              placeholder="Password Sicurezza"
              autoFocus
            />
            {deleteError && <p className="text-red-500 text-xs mb-4 font-bold">{deleteError}</p>}
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Annulla</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors">Elimina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
