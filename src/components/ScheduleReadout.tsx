import { getCountdown, type CountdownKind } from '../config/schedule';
import { useEventNow } from '../hooks/useEventClock';

export function ScheduleReadout({ kind, className = '' }: { kind: CountdownKind; className?: string }) {
  const now = useEventNow();
  const { label, value } = getCountdown(kind, now);
  return <span className={className} aria-live="off">
    <span className="schedule-readout__label">{label}</span>
    {value && <span className="schedule-readout__value">{value}</span>}
  </span>;
}
