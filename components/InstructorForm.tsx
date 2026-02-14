
import React, { useState } from 'react';

interface InstructorFormProps {
  onAdd: (data: { date: string; displayDate: string; startTime: string; endTime: string; instructor: string }) => void;
}

const InstructorForm: React.FC<InstructorFormProps> = ({ onAdd }) => {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [instructor, setInstructor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !start || !end || !instructor) return;

    // Convert date YYYY-MM-DD to DD:MM:YYYY for display as requested
    const [y, m, d] = date.split('-');
    const displayDate = `${d}:${m}:${y}`;

    onAdd({
      date,
      displayDate,
      startTime: start,
      endTime: end,
      instructor
    });

    // Reset fields
    setDate('');
    setStart('');
    setEnd('');
    setInstructor('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-blue-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Inserisci Nuova Lezione
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Da (HH:MM)</label>
            <input
              type="time"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">A (HH:MM)</label>
            <input
              type="time"
              required
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Istruttore</label>
          <input
            type="text"
            required
            placeholder="Nome Istruttore"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-md shadow-blue-200"
          >
            Aggiungi Record
          </button>
        </div>
      </div>
    </form>
  );
};

export default InstructorForm;
