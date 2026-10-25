import { useSyncExternalStore } from 'react';
import { eventTimes, getScheduleWindow, isRegistrationOpenAt, isSubmissionOpenAt } from '../config/schedule';

let currentTime = Date.now();
let timer: number | undefined;
const listeners = new Set<() => void>();

function scheduleTick() {
  window.clearTimeout(timer);
  const now = Date.now();
  const nextSecond = Math.floor(now / 1000) * 1000 + 1000;
  const boundary = [eventTimes.challengeStart, eventTimes.challengeEnd]
    .find(time => time > now) ?? Number.POSITIVE_INFINITY;
  timer = window.setTimeout(refreshClock, Math.max(1, Math.min(nextSecond, boundary) - now));
}

function refreshClock() {
  const nextTime = Date.now();
  if (nextTime !== currentTime) {
    currentTime = nextTime;
    listeners.forEach(listener => listener());
  }
  if (listeners.size) scheduleTick();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener('visibilitychange', refreshClock);
    window.addEventListener('focus', refreshClock);
    refreshClock();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', refreshClock);
      window.removeEventListener('focus', refreshClock);
    }
  };
}

const getNow = () => currentTime;
const getWindow = () => getScheduleWindow(currentTime);
const getRegistrationOpen = () => isRegistrationOpenAt(currentTime);
const getSubmissionOpen = () => isSubmissionOpenAt(currentTime);

export function useEventNow() { return useSyncExternalStore(subscribe, getNow, getNow); }
export function useScheduleWindow() { return useSyncExternalStore(subscribe, getWindow, getWindow); }
export function useRegistrationOpen() { return useSyncExternalStore(subscribe, getRegistrationOpen, getRegistrationOpen); }
export function useSubmissionOpen() { return useSyncExternalStore(subscribe, getSubmissionOpen, getSubmissionOpen); }
