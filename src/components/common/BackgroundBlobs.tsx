interface Props { prominent?: boolean }

export function BackgroundBlobs({ prominent }: Props) {
  const o = prominent ? 1 : 0.6; // opacity multiplier for non-gradient stops

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Cyan point — upper left */}
      <div className="absolute top-[8%] left-[18%] w-[72px] h-[72px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(170,228,255,${o}) 0%, rgba(130,200,255,${o*0.5}) 45%, transparent 70%)`, filter: 'blur(12px)', animation: 'blob-pulse 5s ease-in-out infinite' }} />
      {/* Cyan point — upper right */}
      <div className="absolute top-[14%] right-[22%] w-[90px] h-[90px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(150,218,255,${o}) 0%, rgba(110,185,255,${o*0.45}) 45%, transparent 70%)`, filter: 'blur(16px)', animation: 'blob-float 7s ease-in-out infinite 1.5s' }} />
      {/* Purple orb — left mid */}
      <div className="absolute top-[28%] left-[-3%] w-[200px] h-[200px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(148,118,238,${o*0.65}) 0%, rgba(118,92,208,${o*0.22}) 52%, transparent 70%)`, filter: 'blur(48px)', animation: 'blob-wander 16s ease-in-out infinite' }} />
      {/* Tiny cyan dot — mid */}
      <div className="absolute top-[45%] left-[55%] w-[50px] h-[50px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(165,232,255,${o}) 0%, transparent 65%)`, filter: 'blur(9px)', animation: 'blob-pulse 8s ease-in-out infinite 3s' }} />
      {/* Blue orb — right center */}
      <div className="absolute top-[50%] right-[5%] w-[160px] h-[160px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(65,138,228,${o*0.38}) 0%, transparent 65%)`, filter: 'blur(42px)', animation: 'blob-drift 11s ease-in-out infinite 2s' }} />
      {/* Purple orb — lower left */}
      <div className="absolute top-[68%] left-[3%] w-[185px] h-[185px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(128,95,222,${o*0.45}) 0%, transparent 65%)`, filter: 'blur(52px)', animation: 'blob-wander 20s ease-in-out infinite 5s' }} />
      {/* Cyan point — lower */}
      <div className="absolute top-[74%] right-[30%] w-[68px] h-[68px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(165,228,255,${o}) 0%, rgba(130,208,255,${o*0.4}) 50%, transparent 70%)`, filter: 'blur(12px)', animation: 'blob-float 6s ease-in-out infinite 0.5s' }} />
      {/* Purple dot — bottom right */}
      <div className="absolute top-[85%] right-[12%] w-[58px] h-[58px] rounded-full"
        style={{ background: `radial-gradient(circle, rgba(192,150,255,${o*0.92}) 0%, transparent 65%)`, filter: 'blur(10px)', animation: 'blob-pulse 9s ease-in-out infinite 4s' }} />
    </div>
  );
}
