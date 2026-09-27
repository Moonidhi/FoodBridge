import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { parseWhatsAppText } from '../utils/whatsappParser';
import { useLanguage } from '../context/LanguageContext';

export default function QuickWhatsAppIntake({ onParseSuccess }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const sampleMessages = [
    "5kg rice, Block A hostel, ready now",
    "cooked meal 20 servings, Green Leaf Bistro, ready in 30 min",
    "fresh bread 15 loaves, Baker Street, ready now"
  ];

  const handleParse = (inputText) => {
    const val = inputText || text;
    if (!val.trim()) {
      setError('Please enter a single freeform text line first.');
      return;
    }

    setError('');
    const parsed = parseWhatsAppText(val);
    if (parsed && onParseSuccess) {
      onParseSuccess(parsed);
    }
  };

  return (
    <div className="bg-emerald-950 text-white rounded-xl p-4 sm:p-5 border border-emerald-800/80 shadow-sm space-y-3 relative overflow-hidden">
      
      {/* Decorative WhatsApp badge header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">{t('quick_whatsapp_title')}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                {t('simulated_api')}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
              {t('quick_whatsapp_subtitle')}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-emerald-300/70 font-semibold flex items-center gap-1 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {t('prefills_for_review')}
        </span>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleParse();
        }}
        className="flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError('');
            }}
            placeholder={t('whatsapp_placeholder')}
            className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <span>{t('parse_and_review')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-300 font-medium">{error}</p>
      )}

      {/* Try Sample Templates */}
      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-emerald-300/70 font-semibold shrink-0">{t('sample_templates')}</span>
        {sampleMessages.map((msg, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setText(msg);
              handleParse(msg);
            }}
            className="bg-emerald-900/40 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer truncate max-w-xs"
          >
            "{msg}"
          </button>
        ))}
      </div>

    </div>
  );
}
