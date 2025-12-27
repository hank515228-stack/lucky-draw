
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [displayingName, setDisplayingName] = useState('???');
  const [remainingPool, setRemainingPool] = useState<Participant[]>([]);
  const [history, setHistory] = useState<Participant[]>([]);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingPool(participants);
  }, [participants]);

  const startDraw = () => {
    if (participants.length === 0) return;
    
    const pool = allowRepeat ? participants : remainingPool;
    if (pool.length === 0) {
      alert("No more participants left in the pool!");
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const duration = 2500; // 2.5 seconds animation
    const interval = 80;

    const tick = () => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      setDisplayingName(participants[randomIndex].name);
      
      counter += interval;
      if (counter < duration) {
        timerRef.current = window.setTimeout(tick, interval);
      } else {
        const finalPool = allowRepeat ? participants : remainingPool;
        const winnerIndex = Math.floor(Math.random() * finalPool.length);
        const selectedWinner = finalPool[winnerIndex];

        setWinner(selectedWinner);
        setDisplayingName(selectedWinner.name);
        setIsDrawing(false);
        setHistory(prev => [selectedWinner, ...prev]);

        if (!allowRepeat) {
          setRemainingPool(prev => prev.filter(p => p.id !== selectedWinner.id));
        }
      }
    };

    tick();
  };

  const reset = () => {
    setRemainingPool(participants);
    setWinner(null);
    setHistory([]);
    setDisplayingName('???');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-100 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold text-indigo-900 mb-8">Lucky Draw</h2>
          
          <div className="relative w-full max-w-md h-48 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 border-4 border-indigo-100 overflow-hidden">
            <div className={`text-4xl md:text-6xl font-black text-indigo-600 ${isDrawing ? 'animate-bounce' : ''}`}>
              {displayingName}
            </div>
            {winner && (
              <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center animate-pulse">
                <div className="text-6xl">🎉</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
            <button
              onClick={startDraw}
              disabled={isDrawing || participants.length === 0}
              className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {isDrawing ? 'Drawing...' : 'Draw Winner'}
            </button>
            <button
              onClick={reset}
              disabled={isDrawing}
              className="px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl transition-all"
            >
              Reset Pool
            </button>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="repeat"
              checked={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="repeat" className="text-gray-700 font-medium">Allow repeated winners</label>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Pool Size: <span className="font-bold text-indigo-600">{allowRepeat ? participants.length : remainingPool.length}</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          Winner History
        </h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center py-8">No winners yet</p>
          ) : (
            history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-indigo-900">{h.name}</span>
                <span className="text-xs text-indigo-400">#{history.length - i}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
