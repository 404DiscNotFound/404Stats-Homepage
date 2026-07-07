export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(91,160,51,0.08) 0%, transparent 70%)' }} />
      <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,79,232,0.08) 0%, transparent 70%)' }} />
    </div>
  );
}