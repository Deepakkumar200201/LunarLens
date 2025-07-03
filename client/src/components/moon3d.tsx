import { getMoonPhaseIcon } from '@/lib/moonPhaseCalculations';

interface Moon3DVisualizationProps {
  moonData?: {
    phase: string;
    illumination: number;
    age: number;
  };
}

export default function Moon3DVisualization({ moonData }: Moon3DVisualizationProps) {
  const illumination = moonData?.illumination || 50;
  const phase = moonData?.phase || 'Full Moon';
  
  // Calculate the shadow position based on illumination
  const shadowPosition = illumination <= 50 
    ? `${100 - (illumination * 2)}%`  // New moon to full moon
    : `${(illumination - 50) * 2}%`;   // Full moon to new moon

  return (
    <div className="w-64 h-64 md:w-80 md:h-80 mx-auto">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Moon sphere with CSS 3D effects */}
        <div className="relative">
          <div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full moon-3d relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at 30% 30%, #F9FAFB 0%, #E5E7EB 40%, #9CA3AF 70%, #374151 100%)`,
              boxShadow: `
                inset -20px -20px 50px rgba(0,0,0,0.5),
                inset 20px 20px 50px rgba(255,255,255,0.1),
                0 0 50px rgba(138, 43, 226, 0.3)
              `
            }}
          >
            {/* Phase shadow overlay */}
            <div 
              className="absolute inset-0 rounded-full transition-all duration-1000"
              style={{
                background: illumination <= 50
                  ? `linear-gradient(90deg, rgba(11, 20, 38, 0.8) 0%, rgba(11, 20, 38, 0.8) ${shadowPosition}, transparent ${shadowPosition})`
                  : `linear-gradient(270deg, rgba(11, 20, 38, 0.8) 0%, rgba(11, 20, 38, 0.8) ${shadowPosition}, transparent ${shadowPosition})`
              }}
            />
            
            {/* Crater details */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-gray-600 opacity-60"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-gray-700 opacity-50"></div>
            <div className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-gray-500 opacity-40"></div>
            <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-gray-600 opacity-60"></div>
            
            {/* Glowing rim effect */}
            <div className="absolute inset-0 rounded-full" 
                 style={{
                   background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
                   animation: 'moonGlow 3s ease-in-out infinite alternate'
                 }}
            />
          </div>
          
          {/* Phase emoji overlay */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-4xl">
            {getMoonPhaseIcon(phase)}
          </div>
        </div>
      </div>
      
      {moonData && (
        <div className="text-center mt-8">
          <div className="text-2xl font-orbitron font-bold mb-2">
            {moonData.phase}
          </div>
          <div className="text-sm text-blue-200">
            {moonData.illumination}% Illuminated • {moonData.age.toFixed(1)} days old
          </div>
        </div>
      )}
      

    </div>
  );
}
