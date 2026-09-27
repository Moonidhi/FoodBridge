import React from 'react';
import { ShieldCheck, AlertTriangle, CheckSquare, Square, Info } from 'lucide-react';

export default function ComplianceChecklist({ compliance, onChange, category }) {
  const isPerishable = ['Cooked Meal', 'Dairy', 'Bakery'].includes(category);

  const toggleItem = (key) => {
    onChange({
      ...compliance,
      [key]: !compliance[key]
    });
  };

  const allChecked = compliance.prepared_safe && compliance.temp_safe && compliance.no_spoilage;
  const uncheckedCount = [compliance.prepared_safe, compliance.temp_safe, compliance.no_spoilage].filter(v => !v).length;

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      allChecked 
        ? 'bg-emerald-50/80 border-emerald-300' 
        : 'bg-amber-50/80 border-amber-300'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${allChecked ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Food Safety & Hygiene Checklist
          </span>
        </div>

        {allChecked ? (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            100% Safety Verified
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {uncheckedCount} {uncheckedCount === 1 ? 'item' : 'items'} pending
          </span>
        )}
      </div>

      <div className="space-y-2 text-xs">
        
        {/* Item 1 */}
        <label 
          onClick={() => toggleItem('prepared_safe')}
          className="flex items-start gap-2.5 cursor-pointer select-none p-1.5 rounded-xl hover:bg-white/60 transition-colors"
        >
          {compliance.prepared_safe ? (
            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-slate-800">Prepared within safe window</span>
            <p className="text-[11px] text-slate-500 font-medium">Food was freshly cooked or packaged within the last 2 hours.</p>
          </div>
        </label>

        {/* Item 2 */}
        <label 
          onClick={() => toggleItem('temp_safe')}
          className="flex items-start gap-2.5 cursor-pointer select-none p-1.5 rounded-xl hover:bg-white/60 transition-colors"
        >
          {compliance.temp_safe ? (
            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-slate-800">Temperature control compliant</span>
            <p className="text-[11px] text-slate-500 font-medium">Held at hot temperature (&gt;60°C) or chilled below 4°C until pickup.</p>
          </div>
        </label>

        {/* Item 3 */}
        <label 
          onClick={() => toggleItem('no_spoilage')}
          className="flex items-start gap-2.5 cursor-pointer select-none p-1.5 rounded-xl hover:bg-white/60 transition-colors"
        >
          {compliance.no_spoilage ? (
            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-slate-800">Hygiene & Spoilage Inspection</span>
            <p className="text-[11px] text-slate-500 font-medium">Inspected for clean food-grade containers, zero off-odor, or contamination.</p>
          </div>
        </label>

      </div>

      {!allChecked && (
        <div className="mt-3 pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Soft Warning: Unticked items will mark this post with a compliance flag for volunteers, but posting is allowed for demo.
          </span>
        </div>
      )}
    </div>
  );
}
