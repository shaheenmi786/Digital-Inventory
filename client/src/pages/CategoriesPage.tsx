import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Tags, Plus, Package, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultCategories = [
    {
      name: 'Staples & Grains',
      nameKn: 'ಧಾನ್ಯಗಳು ಮತ್ತು ಬೇಳೆಕಾಳುಗಳು',
      description: 'Rice, Dal, Atta, Ragi and whole pulses',
      icon: '🌾',
      itemsCount: 4,
    },
    {
      name: 'Oils & Dairy',
      nameKn: 'ಎಣ್ಣೆ ಮತ್ತು ಹೈನುಗಾರಿಕೆ',
      description: 'Pure Nandini ghee, cooking oils, butter and milk products',
      icon: '🧈',
      itemsCount: 2,
    },
    {
      name: 'Spices & Masalas',
      nameKn: 'ಮಸಾಲೆಗಳು',
      description: 'Authentic Karnataka powders, whole spices, sambar mix',
      icon: '🌶️',
      itemsCount: 1,
    },
    {
      name: 'Beverages',
      nameKn: 'ಪಾನೀಯಗಳು',
      description: 'Filter coffee powders, premium teas and healthy drinks',
      icon: '☕',
      itemsCount: 2,
    },
    {
      name: 'Personal Care',
      nameKn: 'ವೈಯಕ್ತಿಕ ಆರೈಕೆ',
      description: 'Mysore Sandal soaps, dental care and grooming essentials',
      icon: '🧼',
      itemsCount: 1,
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Kirana Product Categories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize inventory by localized grocery categories with bilingual Kannada classification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultCategories.map((cat, idx) => (
          <div key={idx} className="card-3d card-3d-hover p-5 bg-white dark:bg-[#151d30]">
            <div className="flex items-start justify-between">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {cat.itemsCount} SKUs
              </span>
            </div>

            <h3 className="font-bold text-base text-slate-900 dark:text-white">{cat.name}</h3>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {cat.nameKn}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
