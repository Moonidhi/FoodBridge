import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { 
  Award, 
  Download, 
  Share2, 
  X, 
  Utensils, 
  Leaf, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Heart
} from 'lucide-react';
import { calculateCo2Avoided } from '../utils/helpers';

export default function ImpactCertificate({ isOpen, onClose, donor, listing, monthlyMeals = 140, monthlyKg = 35 }) {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || (!donor && !listing)) return null;

  const donorName = donor?.name || listing?.donor_name || 'Green Leaf Bistro';
  const mealsSaved = listing ? listing.meals_estimate : monthlyMeals;
  const kgSaved = listing ? listing.quantity_kg : monthlyKg;
  const co2Avoided = calculateCo2Avoided(kgSaved);
  const streak = donor?.streak_count || 4;

  const certId = `FB-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(certificateRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `FoodBridge-Impact-Certificate-${donorName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture certificate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyShare = () => {
    const text = `${donorName} just saved ${mealsSaved} surplus meals (${co2Avoided} kg CO2e avoided) with FoodBridge! #FoodRescue #ZeroWaste`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-8 animate-float">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Area */}
        <div ref={certificateRef} className="bg-gradient-to-b from-emerald-50/90 via-white to-slate-50 p-8 sm:p-10 border-8 border-emerald-600/20 m-3 rounded-2xl relative text-slate-900 overflow-hidden">
          
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-emerald-600"></div>

          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
              <Award className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 mt-2">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Official Food Rescue Impact Certificate</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
              Certificate of Sustainability Impact
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              FoodBridge Zero Surplus Food Rescue Verification
            </p>
          </div>

          {/* Presented To */}
          <div className="my-6 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-700 mt-1 tracking-tight border-b-2 border-emerald-200 pb-2 inline-block px-6">
              {donorName}
            </div>

            {/* Friendly Headline */}
            <p className="text-sm font-semibold text-slate-700 max-w-lg mx-auto mt-4 leading-relaxed">
              <strong>"{donorName} rescued {mealsSaved} surplus meals this month, preventing food waste and empowering local community shelters!"</strong>
            </p>
          </div>

          {/* 3 Impact Stat Pills */}
          <div className="grid grid-cols-3 gap-3 my-6">
            
            <div className="bg-white p-3 rounded-2xl border border-emerald-200 text-center shadow-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">{mealsSaved}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Meals Saved</div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-teal-200 text-center shadow-xs">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-teal-700">{co2Avoided} kg</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">CO₂e Avoided</div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center shadow-xs">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-700">{streak} Wks</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Week Streak</div>
            </div>

          </div>

          {/* Footer Verification */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div>
              Verified Date: <strong>{dateStr}</strong>
            </div>
            <div className="flex items-center gap-1 font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{certId}</span>
            </div>
          </div>

        </div>

        {/* Certificate Modal Action Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Share your impact on LinkedIn & social media!
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating Image...' : 'Download Certificate PNG'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
