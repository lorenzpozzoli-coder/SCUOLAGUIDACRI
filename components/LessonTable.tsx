
import React, { useState } from 'react';
import { Lesson, UserRole } from '../types';

interface LessonTableProps {
  lessons: Lesson[];
  role: UserRole;
  onBook: (lessonId: string, studentName: string) => void;
  onDelete?: (lessonId: string) => void;
}

const LessonTable: React.FC<LessonTableProps> = ({ lessons, role, onBook, onDelete }) => {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [tempStudentName, setTempStudentName] = useState('');

  const handleBookClick = (id: string) => {
    setBookingId(id);
    setTempStudentName('');
  };

  const submitBooking = (id: string) => {
    if (tempStudentName.trim()) {
      onBook(id, tempStudentName.trim());
      setBookingId(null);
    }
  };

  // Determina se l'utente corrente può prenotare (tutti tranne l'istruttore loggato)
  const canBook = role !== UserRole.INSTRUCTOR;

  if (lessons.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
        <p className="text-gray-500 italic">Nessuna lezione in programma al momento.</p>
      </div>
    );
  }

  const renderLessonCells = (lesson: Lesson) => (
    <>
      {bookingId === lesson.id ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={tempStudentName}
            onChange={(e) => setTempStudentName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitBooking(lesson.id)}
            onBlur={() => !tempStudentName && setBookingId(null)}
            placeholder="Il tuo nome..."
            className="border-2 border-blue-500 rounded-lg px-3 py-2.5 sm:py-1.5 text-base sm:text-sm focus:ring-2 focus:ring-blue-200 outline-none shadow-sm w-full sm:w-48 bg-blue-50 font-semibold touch-manipulation"
            autoFocus
          />
          {canBook && !lesson.student && bookingId === lesson.id && (
            <div className="flex gap-2">
              <button onClick={() => submitBooking(lesson.id)} className="flex-1 text-white bg-green-600 hover:bg-green-700 px-4 py-2.5 sm:py-1.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 touch-manipulation min-h-[44px]">CONFERMA</button>
              <button onClick={() => setBookingId(null)} className="px-4 py-2.5 sm:py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-all touch-manipulation min-h-[44px]">X</button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => canBook && !lesson.student && handleBookClick(lesson.id)}
          className={`
            inline-flex items-center justify-center min-w-[100px] px-3 py-2 sm:py-1.5 rounded-lg transition-all duration-200 border touch-manipulation min-h-[44px] sm:min-h-0
            ${lesson.student ? "text-gray-900 font-bold border-transparent bg-gray-50" : "text-gray-400 italic border-transparent"} 
            ${canBook && !lesson.student ? "cursor-pointer bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg font-bold not-italic shadow-sm" : ""}
          `}
          title={canBook && !lesson.student ? "Clicca per prenotarti!" : ""}
        >
          {lesson.student || "LIBERO"}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Vista a card su mobile */}
      <div className="md:hidden space-y-3">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-bold text-gray-900">{lesson.displayDate}</p>
                <p className="text-sm text-gray-600 font-mono">{lesson.startTime} – {lesson.endTime}</p>
              </div>
              <div className="flex items-center gap-1">
                {role === UserRole.INSTRUCTOR && onDelete && (
                  <button onClick={() => onDelete(lesson.id)} className="text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all active:scale-90 touch-manipulation" title="Elimina" aria-label="Elimina">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-1 w-fit uppercase tracking-tighter">{lesson.instructor}</p>
            <div className="pt-1">{renderLessonCells(lesson)}</div>
          </div>
        ))}
      </div>

      {/* Tabella su desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dalle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alle</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Istruttore</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Allievo</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stato</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-blue-50/40 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{lesson.displayDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono font-medium">{lesson.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono font-medium">{lesson.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter">
                    {lesson.instructor}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLessonCells(lesson)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {canBook && !lesson.student && bookingId === lesson.id && (
                      <>
                        <button onClick={() => submitBooking(lesson.id)} className="text-white bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95">CONFERMA</button>
                        <button onClick={() => setBookingId(null)} className="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">X</button>
                      </>
                    )}
                    {role === UserRole.INSTRUCTOR && onDelete && (
                      <button onClick={() => onDelete(lesson.id)} className="text-red-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all active:scale-90" title="Elimina record">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LessonTable;
