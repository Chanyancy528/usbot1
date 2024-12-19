import ChatInterface from '@/components/chat/chat-interface'

export default function StageSection() {
  return (
    <div className="relative w-[80vw] mx-auto" style={{ height: '30vh' }}>
      {/* Main yellow stage */}
      <div className="absolute bottom-0 w-[140%] left-[-20%] h-[140%] bg-gradient-to-t from-[#fff5b8] to-[#fffad1]" 
        style={{
          borderRadius: "100% 100% 0 0",
          transform: "scale(1.1, 0.7)"
        }} 
      />

      {/* Mirror effects for stage */}
      <div className="absolute bottom-0 w-[140%] left-[-20%] h-[140%] bg-gradient-to-b from-transparent to-white/20" 
        style={{
          borderRadius: "100% 100% 0 0",
          transform: "scale(1.1, 0.7)"
        }}
      />
      
      {/* Shine spots */}
      <div className="absolute bottom-[20%] left-[30%] w-[10vw] h-[10vh] bg-white/20 rounded-full blur-xl" />
      <div className="absolute bottom-[30%] right-[20%] w-[8vw] h-[8vh] bg-white/20 rounded-full blur-lg" />

      {/* Light beams grid - contained within stage */}
      <div className="absolute inset-0 w-[140%] left-[-20%]" style={{ 
        zIndex: 5,
        height: '100%',  // Match the visible part of yellow stage
        clipPath: 'inset(0 0 0 0)',  // Clip anything outside this container
      }}>
        {/* Left-side beams - now tilting right */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`beam-left-${i}`}
            className="absolute w-[30px] h-[120%] bg-[#fffef0]"
            style={{
              left: `${2 + i * 15}%`,
              bottom: '-20%',
              opacity: '0.25',
              transformOrigin: 'top left',
              transform: 'rotate(-35deg)',
              backdropFilter: 'blur(1px)',
              mixBlendMode: 'overlay',
              maskImage: 'linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)'  // Fade edges
            }}
          />
        ))}
        {/* Right-side beams - same changes for right side */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`beam-right-${i}`}
            className="absolute w-[30px] h-[120%] bg-[#fffef0]"
            style={{
              right: `${2 + i * 15}%`,
              bottom: '-20%',
              opacity: '0.25',
              transformOrigin: 'top right',
              transform: 'rotate(35deg)',
              backdropFilter: 'blur(1px)',
              mixBlendMode: 'overlay',
              maskImage: 'linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)'  // Fade edges
            }}
          />
        ))}
      </div>

      {/* Additional rounded decorations */}
      <div className="absolute bottom-[-8%] left-[-8%] w-[25vw] h-[12vw] bg-[#ffeb3b]/20 rounded-t-full" 
        style={{ transform: 'scale(1.2, 0.8)' }} 
      />
      <div className="absolute bottom-[-5%] right-[-10%] w-[20vw] h-[10vw] bg-[#ffd54f]/20 rounded-t-full" 
        style={{ transform: 'scale(1.2, 0.8)' }} 
      />
      <div className="absolute bottom-[8%] left-[35%] w-[15vw] h-[8vw] bg-[#ffca28]/20 rounded-t-full" 
        style={{ transform: 'scale(1.2, 0.8)' }} 
      />
      
      {/* Chat Interface */}
      <div className="relative z-10 max-w-xl mx-auto px-4 pb-6 h-full flex items-end">
        <ChatInterface />
      </div>
    </div>
  )
}