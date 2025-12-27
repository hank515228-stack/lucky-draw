
import React, { useState, useMemo } from 'react';
import { Participant, Tab } from './types';
import ParticipantInput from './components/ParticipantInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';

const MOCK_NAMES = [
  "張小明", "李美玲", "王大同", "陳佩琪", "林國華", 
  "Alice Johnson", "Bob Smith", "Charlie Brown", "David Wilson", "Eva Green",
  "黃心怡", "周杰倫", "吳建宏", "鄭文燦", "許淑華",
  "Frank Miller", "Grace Lee", "Henry Ford", "Ivy Chen", "Jack Ma"
];

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PARTICIPANTS);

  const handleUpdateParticipants = (newOnes: Participant[]) => {
    setParticipants(prev => [...prev, ...newOnes]);
  };

  const clearParticipants = () => {
    if (confirm("確定要清空所有名單嗎？")) {
      setParticipants([]);
    }
  };

  const generateMockData = () => {
    const mockData: Participant[] = MOCK_NAMES.map((name, index) => ({
      id: `mock-${Date.now()}-${index}`,
      name
    }));
    setParticipants(prev => [...prev, ...mockData]);
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      const isDuplicate = seen.has(p.name);
      seen.add(p.name);
      return !isDuplicate;
    });
    setParticipants(uniqueList);
  };

  // 計算重複項
  const duplicateNames = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => counts.set(p.name, (counts.get(p.name) || 0) + 1));
    return new Set([...counts.entries()].filter(([name, count]) => count > 1).map(([name]) => name));
  }, [participants]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">HR Pro <span className="text-indigo-600">Toolbox</span></h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab(Tab.PARTICIPANTS)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === Tab.PARTICIPANTS ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                參加者名單
              </button>
              <button
                onClick={() => setActiveTab(Tab.LUCKY_DRAW)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === Tab.LUCKY_DRAW ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                獎品抽籤
              </button>
              <button
                onClick={() => setActiveTab(Tab.GROUPING)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === Tab.GROUPING ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                自動分組
              </button>
            </div>

            <div className="flex items-center space-x-4">
               <span className="text-sm font-medium text-gray-500">
                 共 <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md mx-1">{participants.length}</span> 人
               </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around bg-white border-b border-gray-200 py-2">
        <button onClick={() => setActiveTab(Tab.PARTICIPANTS)} className={`text-xs flex flex-col items-center ${activeTab === Tab.PARTICIPANTS ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          名單
        </button>
        <button onClick={() => setActiveTab(Tab.LUCKY_DRAW)} className={`text-xs flex flex-col items-center ${activeTab === Tab.LUCKY_DRAW ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
          抽籤
        </button>
        <button onClick={() => setActiveTab(Tab.GROUPING)} className={`text-xs flex flex-col items-center ${activeTab === Tab.GROUPING ? 'text-indigo-600' : 'text-gray-400'}`}>
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          分組
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === Tab.PARTICIPANTS && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <ParticipantInput onParticipantsUpdate={handleUpdateParticipants} currentCount={participants.length} />
              <button 
                onClick={generateMockData}
                className="w-full bg-white border-2 border-dashed border-indigo-200 text-indigo-600 py-3 rounded-2xl hover:bg-indigo-50 transition-all font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                生成模擬名單 (測試用)
              </button>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">當前參加者</h2>
                  <div className="space-x-4">
                    {duplicateNames.size > 0 && (
                      <button 
                        onClick={removeDuplicates}
                        className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-semibold transition-colors"
                      >
                        移除重複項 ({duplicateNames.size})
                      </button>
                    )}
                    <button 
                      onClick={clearParticipants}
                      className="text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors"
                    >
                      清空全部
                    </button>
                  </div>
                </div>
                <div className="p-0 max-h-[600px] overflow-y-auto">
                  {participants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      <p>名單目前是空的</p>
                      <p className="text-xs">請點擊左側或下方按鈕新增參加者</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {participants.map((p, i) => {
                        const isDuplicate = duplicateNames.has(p.name);
                        return (
                          <li key={p.id} className={`p-4 flex items-center justify-between transition-colors ${isDuplicate ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center">
                              <span className="w-8 text-gray-400 text-xs font-mono">{i + 1}.</span>
                              <span className={`font-medium ${isDuplicate ? 'text-red-700' : 'text-gray-700'}`}>{p.name}</span>
                            </div>
                            {isDuplicate && (
                              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider">重複</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.LUCKY_DRAW && (
          <LuckyDraw participants={participants} />
        )}

        {activeTab === Tab.GROUPING && (
          <AutoGrouping participants={participants} />
        )}
      </main>

      {/* Floating CTA for small list */}
      {participants.length < 5 && activeTab !== Tab.PARTICIPANTS && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-lg flex items-center">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-yellow-700">
              參加者人數較少，建議再增加一些人。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
