import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useEventRuntime } from '../context/EventRuntime';
import type { ManualPhaseOverride } from '../config/schedule';

type Operation = 'authenticate' | 'force-puzzle' | 'automatic';
type ControlResult = { authenticated?: boolean; manualPhaseOverride?: ManualPhaseOverride; error?: string };

export function EmergencyEventControl({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { phase, manualOverride, applyManualOverride } = useEventRuntime();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState<Exclude<Operation, 'authenticate'> | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => {
    if (!open) {
      passwordRef.current = '';
      setAuthenticated(false);
      setPending(false);
      setConfirming(null);
      setFeedback('');
    }
  }, [open]);

  const requestControl = async (operation: Operation, password: string) => {
    setPending(true);
    setFeedback('');
    try {
      const response = await fetch('/api/event-control', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, password }),
      });
      const data: ControlResult = await response.json();
      if (!response.ok) throw new Error(data.error || 'Control unavailable. Try again later.');
      if (operation === 'authenticate') {
        if (data.authenticated !== true || (data.manualPhaseOverride !== null && data.manualPhaseOverride !== 'puzzle')) throw new Error('Control unavailable. Try again later.');
        passwordRef.current = password;
        if (inputRef.current) inputRef.current.value = '';
        setAuthenticated(true);
        setFeedback('CONTROL READY.');
      } else {
        const expected = operation === 'force-puzzle' ? 'puzzle' : null;
        if (data.manualPhaseOverride !== expected) throw new Error('Control unavailable. Try again later.');
        applyManualOverride(expected);
        setFeedback(expected === 'puzzle' ? 'HUMAN TEST OVERRIDE ACTIVE' : 'AUTOMATIC SCHEDULE RESTORED');
        setConfirming(null);
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Control unavailable. Try again later.');
    } finally {
      setPending(false);
    }
  };

  const authenticate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pending && inputRef.current) void requestControl('authenticate', inputRef.current.value);
  };
  const confirm = () => {
    if (confirming && !pending) void requestControl(confirming, passwordRef.current);
  };

  return <dialog className="emergency-control" ref={dialogRef} onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose} aria-labelledby="emergency-control-title">
    <div className="emergency-control__top"><span>ACE / EVENT CONTROL</span><button type="button" onClick={onClose} aria-label="Close event control">×</button></div>
    <h2 id="emergency-control-title">{authenticated ? 'EVENT CONTROL' : 'EMERGENCY EVENT CONTROL'}</h2>
    {!authenticated ? <form onSubmit={authenticate}>
      <label htmlFor="emergency-password">Password</label>
      <input id="emergency-password" ref={inputRef} type="password" autoComplete="off" required maxLength={256} />
      <div className="emergency-control__actions"><button type="button" onClick={onClose}>CANCEL</button><button type="submit" disabled={pending}>UNLOCK</button></div>
    </form> : <>
      <p className="emergency-control__state">CURRENT MODE / <strong>{manualOverride === 'puzzle' ? 'FORCED HUMAN TEST' : 'AUTOMATIC SCHEDULE'}</strong><br />EFFECTIVE PHASE / <strong>{phase.toUpperCase()}</strong></p>
      <div className="emergency-control__actions">
        <button type="button" disabled={pending || manualOverride === 'puzzle'} onClick={() => setConfirming('force-puzzle')}>FORCE HUMAN TEST LIVE</button>
        <button type="button" disabled={pending || manualOverride === null} onClick={() => setConfirming('automatic')}>RETURN TO AUTOMATIC</button>
      </div>
      {confirming && <div className="emergency-control__confirm" role="group" aria-label="Confirm release change">
        <p>{confirming === 'force-puzzle' ? 'Force the Human Test live for all participants?' : 'Return event phase control to the scheduled timeline?'}</p>
        <div className="emergency-control__actions"><button type="button" onClick={() => setConfirming(null)}>CANCEL</button><button type="button" disabled={pending} onClick={confirm}>CONFIRM</button></div>
      </div>}
    </>}
    <p className="emergency-control__feedback" role="status" aria-live="polite">{feedback}</p>
  </dialog>;
}
