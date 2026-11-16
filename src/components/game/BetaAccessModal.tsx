import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, ShieldAlert, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { verifyCode } from '../../utils/betaAuth';
import { soundManager } from '../../audio/soundManager';

interface BetaAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const BetaAccessModal: React.FC<BetaAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Enter Access Code',
  description = 'Please enter your access code to open the lab.'
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter an access code.');
      soundManager.playFailure();
      return;
    }

    if (verifyCode(code)) {
      setError(null);
      setSuccess(true);
      soundManager.playSuccess();
      setTimeout(() => {
        onSuccess();
      }, 300);
    } else {
      setError('Incorrect access code. Please try again.');
      soundManager.playFailure();
      inputRef.current?.select();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#0d1522] p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={() => {
            soundManager.playButton();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10 text-sky-300">
            {success ? <CheckCircle2 size={24} className="text-emerald-400" /> : <Lock size={22} />}
          </div>
          <div>
            <h2 id="access-modal-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p className="text-xs text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="modal-code-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Access Code
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="modal-code-input"
                ref={inputRef}
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter access code"
                autoComplete="off"
                spellCheck="false"
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 font-mono text-sm tracking-wider text-white placeholder:text-slate-500 placeholder:tracking-normal focus:outline-none transition ${
                  error
                    ? 'border-rose-500/70 bg-rose-500/[0.08] focus:border-rose-400'
                    : success
                    ? 'border-emerald-500/70 bg-emerald-500/[0.08] focus:border-emerald-400'
                    : 'border-white/15 bg-white/[0.05] focus:border-sky-400 focus:bg-white/[0.08]'
                }`}
              />
            </div>
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-in fade-in duration-100">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{error}</span>
              </p>
            )}
            {success && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>Access verified! Opening lab…</span>
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playButton();
                onClose();
              }}
              className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={success}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 text-xs font-bold text-slate-950 shadow-[0_4px_20px_-5px_rgba(56,189,248,0.5)] transition hover:bg-sky-300 active:translate-y-0.5 disabled:opacity-60"
            >
              <span>{success ? 'Unlocked' : 'Enter Lab'}</span>
              {!success && <ArrowRight size={14} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BetaAccessModal;
