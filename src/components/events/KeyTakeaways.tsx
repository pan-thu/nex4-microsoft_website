import { Brain, Rocket, Fingerprint, CheckSquare, Zap, Shield, Cloud, Bot } from 'lucide-react';
import type { KeyTakeaway } from '@/types/events';

const ICON_MAP: Record<string, React.ElementType> = {
  brain:       Brain,
  rocket:      Rocket,
  fingerprint: Fingerprint,
  check:       CheckSquare,
  zap:         Zap,
  shield:      Shield,
  cloud:       Cloud,
  bot:         Bot,
};

export function KeyTakeaways({ items }: { items: KeyTakeaway[] }) {
  if (!items.length) return null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-5">
        In this session, you&apos;ll learn
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.icon] ?? Brain;
          return (
            <div key={i} className="flex gap-4 items-center group">
              <div className="shrink-0 flex items-center justify-center">
                <Icon size={20} className="text-white/40 group-hover:text-white/70 transition-colors duration-300" />
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
