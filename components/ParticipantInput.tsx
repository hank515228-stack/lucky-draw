
import React, { useState } from 'react';
import { Participant } from '../types';

interface ParticipantInputProps {
  onParticipantsUpdate: (participants: Participant[]) => void;
  currentCount: number;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ onParticipantsUpdate, currentCount }) => {
  const [textInput, setTextInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processInput(content);
    };
    reader.readAsText(file);
  };

  const processInput = (rawText: string) => {
    const names = rawText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const newParticipants: Participant[] = names.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));

    onParticipantsUpdate(newParticipants);
    setTextInput('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Participants</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste names (One per line or comma-separated)
          </label>
          <textarea
            className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="John Doe&#10;Jane Smith&#10;Alice Wang..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={() => processInput(textInput)}
            disabled={!textInput.trim()}
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            Add to List
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV/TXT File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">CSV or Text file with names</p>
              </div>
              <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantInput;
