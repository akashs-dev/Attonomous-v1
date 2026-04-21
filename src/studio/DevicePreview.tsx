import React, { useState } from 'react'

interface DevicePreviewProps {
  title?: string
  body?: string
  defaultPlatform?: 'ios' | 'android'
}

export default function DevicePreview({ title, body, defaultPlatform = 'ios' }: DevicePreviewProps) {
  const [platform, setPlatform] = useState<'ios' | 'android'>(defaultPlatform)

  const displayTitle = title?.slice(0, platform === 'ios' ? 50 : 65) || 'Notification title'
  const displayBody = body?.slice(0, 240) || 'Notification body text will appear here.'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full p-0.5 gap-0.5">
        {(['ios', 'android'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 capitalize
              ${platform === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {p === 'ios' ? 'iOS' : 'Android'}
          </button>
        ))}
      </div>

      <div className="relative bg-[#1C1C1E] rounded-[36px] flex-shrink-0" style={{ width: 200, height: 340, padding: '12px 8px' }}>
        {platform === 'ios'
          ? <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10" />
          : <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-10" />
        }
        <div className="w-full h-full rounded-[28px] overflow-hidden" style={{ backgroundColor: '#F0F0F0' }}>
          <div className={`flex items-center justify-between px-4 ${platform === 'ios' ? 'pt-8 pb-1' : 'pt-5 pb-1'}`}>
            <span className="text-[8px] font-semibold text-[#1C1C1E]">9:41</span>
            <div className="w-3 h-1.5 border border-[#1C1C1E] rounded-sm">
              <div className="w-2/3 h-full bg-[#1C1C1E] rounded-sm" />
            </div>
          </div>
          <div className="mx-2 mt-2 bg-white rounded-xl overflow-hidden shadow-sm border border-[#E0E0E0]">
            <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1">
              <div className="w-4 h-4 rounded-[4px] flex-shrink-0" style={{ backgroundColor: '#F97316' }} />
              <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-wide">Bajaj Markets</span>
              <span className="text-[8px] text-gray-400 ml-auto">now</span>
            </div>
            <div className="px-2.5 pb-2.5">
              <p className="text-[9px] font-bold text-[#1C1C1E] leading-tight mb-0.5 line-clamp-2">{displayTitle}</p>
              <p className="text-[8px] text-gray-500 leading-tight line-clamp-3">{displayBody}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center opacity-20">
            <div className="w-16 h-16 rounded-full bg-green-300" />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        {platform === 'ios' ? 'iOS · title ≤50 · body ≤240' : 'Android · title ≤65 · body ≤240'}
      </p>
    </div>
  )
}
