
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateGroupNames } from '../services/geminiService';

interface AutoGroupingProps {
  participants: Participant[];
}

const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('Superheroes');

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleGroupAction = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    const shuffled: Participant[] = shuffle<Participant>(participants);
    const numberOfGroups = Math.ceil(shuffled.length / groupSize);
    
    // Get AI-powered names
    const names = await generateGroupNames(numberOfGroups, theme);

    const newGroups: Group[] = [];
    for (let i = 0; i < numberOfGroups; i++) {
      newGroups.push({
        id: `group-${i}`,
        name: names[i] || `Team ${i + 1}`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const downloadCsv = () => {
    if (groups.length === 0) return;

    let csvContent = "組別名稱,成員姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `${group.name},${member.name}\n`;
      });
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `grouping_results_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">分組產生器</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">每組人數</label>
            <input
              type="number"
              min="2"
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">組別名稱主題 (AI 產生)</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="Professional">專業風格</option>
              <option value="Superheroes">超級英雄</option>
              <option value="Space Exploration">太空探險</option>
              <option value="Exotic Fruits">熱帶水果</option>
              <option value="Greek Gods">希臘神話</option>
              <option value="Famous Scientists">知名科學家</option>
            </select>
          </div>
          <button
            onClick={handleGroupAction}
            disabled={isGenerating || participants.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isGenerating ? '正在分組中...' : '開始自動分組'}
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-gray-800">分組結果 ({groups.length} 組)</h3>
            <button
              onClick={downloadCsv}
              className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              下載 CSV 紀錄
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className="bg-indigo-600 px-6 py-4">
                  <h3 className="text-white font-bold text-lg flex justify-between items-center">
                    {group.name}
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                      {group.members.length} 人
                    </span>
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {group.members.map((member) => (
                      <li key={member.id} className="flex items-center text-gray-700">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-500 font-medium">準備好為 {participants.length} 位參加者進行分組</p>
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
