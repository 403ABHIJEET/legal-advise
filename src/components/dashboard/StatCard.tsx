export function StatCard({ label, value, sub, icon }: { label: string; value: number | string; sub: string; icon: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-white p-[19px] shadow-card max-sm:p-[13px]">
      <div className="flex items-center justify-between text-xs text-muted max-sm:text-[11px]">
        <span>{label}</span><span className="text-base text-gold">{icon}</span>
      </div>
      <strong className="mt-2 block text-[28px] font-bold text-navy max-sm:text-[23px]">{value}</strong>
      <small className="text-muted">{sub}</small>
    </div>
  );
}
