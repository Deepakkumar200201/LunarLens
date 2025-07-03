import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import DailyInsights from '@/components/daily-insights';
import { useMoonData } from '@/hooks/use-moon-data';
import { Sparkles, Star, Heart, Brain, Lightbulb } from 'lucide-react';

export default function InsightsPage() {
  const { data: moonData, isLoading } = useMoonData();

  const getZodiacElement = (sign: string) => {
    const elements: Record<string, string> = {
      'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
      'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
      'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
      'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return elements[sign] || 'Unknown';
  };

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      'Fire': 'text-red-400 bg-red-500/10 border-red-500/20',
      'Earth': 'text-green-400 bg-green-500/10 border-green-500/20',
      'Air': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'Water': 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    };
    return colors[element] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const getPhaseInsights = (phase: string) => {
    const insights: Record<string, { energy: string; focus: string, activities: string[] }> = {
      'New Moon': {
        energy: 'New beginnings and fresh starts',
        focus: 'Setting intentions and planting seeds',
        activities: ['Goal setting', 'Journaling', 'Planning', 'Meditation']
      },
      'Waxing Crescent': {
        energy: 'Building momentum and taking action',
        focus: 'Moving forward with your intentions',
        activities: ['Taking first steps', 'Learning', 'Networking', 'Creating']
      },
      'First Quarter': {
        energy: 'Overcoming challenges and making decisions',
        focus: 'Pushing through obstacles',
        activities: ['Problem solving', 'Making tough choices', 'Assertiveness', 'Action']
      },
      'Waxing Gibbous': {
        energy: 'Refinement and adjustment',
        focus: 'Fine-tuning your approach',
        activities: ['Editing', 'Improving', 'Adjusting plans', 'Seeking feedback']
      },
      'Full Moon': {
        energy: 'Peak energy and manifestation',
        focus: 'Celebrating achievements and releasing',
        activities: ['Gratitude practice', 'Celebration', 'Releasing', 'Harvesting']
      },
      'Waning Gibbous': {
        energy: 'Sharing wisdom and giving back',
        focus: 'Teaching and mentoring others',
        activities: ['Sharing knowledge', 'Mentoring', 'Giving thanks', 'Reflecting']
      },
      'Last Quarter': {
        energy: 'Letting go and forgiveness',
        focus: 'Releasing what no longer serves',
        activities: ['Decluttering', 'Forgiveness', 'Breaking habits', 'Cleansing']
      },
      'Waning Crescent': {
        energy: 'Rest and restoration',
        focus: 'Preparing for the next cycle',
        activities: ['Rest', 'Reflection', 'Self-care', 'Healing']
      }
    };
    return insights[phase] || insights['New Moon'];
  };

  const getZodiacInsights = (sign: string) => {
    const insights: Record<string, { traits: string[], themes: string }> = {
      'Aries': { traits: ['Leadership', 'Initiative', 'Courage'], themes: 'New beginnings and bold action' },
      'Taurus': { traits: ['Stability', 'Patience', 'Sensuality'], themes: 'Building and nurturing' },
      'Gemini': { traits: ['Communication', 'Curiosity', 'Adaptability'], themes: 'Learning and connecting' },
      'Cancer': { traits: ['Emotion', 'Intuition', 'Nurturing'], themes: 'Home and family focus' },
      'Leo': { traits: ['Creativity', 'Expression', 'Confidence'], themes: 'Self-expression and joy' },
      'Virgo': { traits: ['Organization', 'Service', 'Detail'], themes: 'Health and improvement' },
      'Libra': { traits: ['Balance', 'Harmony', 'Relationships'], themes: 'Partnership and beauty' },
      'Scorpio': { traits: ['Transformation', 'Intensity', 'Mystery'], themes: 'Deep change and healing' },
      'Sagittarius': { traits: ['Adventure', 'Philosophy', 'Truth'], themes: 'Expansion and wisdom' },
      'Capricorn': { traits: ['Ambition', 'Structure', 'Achievement'], themes: 'Goals and responsibility' },
      'Aquarius': { traits: ['Innovation', 'Freedom', 'Community'], themes: 'Progress and friendship' },
      'Pisces': { traits: ['Compassion', 'Intuition', 'Creativity'], themes: 'Spirituality and dreams' }
    };
    return insights[sign] || insights['Aries'];
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 constellation-bg">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Cosmic Insights</h1>
            <p className="text-purple-200">Discover the wisdom of lunar cycles and celestial guidance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Insights Component */}
            <div className="lg:col-span-2">
              <DailyInsights moonData={moonData} isLoading={isLoading} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Moon Phase Energy */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Phase Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-4 bg-purple-500/20 rounded"></div>
                    <div className="animate-pulse h-3 bg-purple-500/10 rounded w-2/3"></div>
                  </div>
                ) : moonData ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {moonData.phase === 'New Moon' && '🌑'}
                        {moonData.phase === 'Waxing Crescent' && '🌒'}
                        {moonData.phase === 'First Quarter' && '🌓'}
                        {moonData.phase === 'Waxing Gibbous' && '🌔'}
                        {moonData.phase === 'Full Moon' && '🌕'}
                        {moonData.phase === 'Waning Gibbous' && '🌖'}
                        {moonData.phase === 'Last Quarter' && '🌗'}
                        {moonData.phase === 'Waning Crescent' && '🌘'}
                      </div>
                      <h3 className="font-semibold text-purple-100">{moonData.phase}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-purple-200">Energy:</p>
                        <p className="text-sm text-purple-100">{getPhaseInsights(moonData.phase).energy}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-purple-200">Focus:</p>
                        <p className="text-sm text-purple-100">{getPhaseInsights(moonData.phase).focus}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-purple-200">Recommended Activities:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getPhaseInsights(moonData.phase).activities.map((activity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Zodiac Influence */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  Zodiac Influence
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-4 bg-purple-500/20 rounded"></div>
                    <div className="animate-pulse h-3 bg-purple-500/10 rounded w-2/3"></div>
                  </div>
                ) : moonData?.zodiac ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-purple-100 text-lg">
                        Moon in {moonData.zodiac.sign}
                      </h3>
                      <p className="text-sm text-purple-300">{moonData.zodiac.degree.toFixed(1)}°</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Badge className={`${getElementColor(getZodiacElement(moonData.zodiac.sign))}`}>
                          {getZodiacElement(moonData.zodiac.sign)} Sign
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-purple-200">Key Traits:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getZodiacInsights(moonData.zodiac.sign).traits.map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-200">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-purple-200">Themes:</p>
                        <p className="text-sm text-purple-100">{getZodiacInsights(moonData.zodiac.sign).themes}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Wellness Integration */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  Wellness Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-4 bg-purple-500/20 rounded"></div>
                    <div className="animate-pulse h-3 bg-purple-500/10 rounded w-2/3"></div>
                  </div>
                ) : moonData ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <Lightbulb className="w-4 h-4 text-green-400 mb-2" />
                      <p className="text-sm text-green-100">{moonData.wellnessTip}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-purple-200">Moon Phase Wellness:</p>
                      <div className="text-sm text-purple-100 space-y-1">
                        {moonData.phase === 'New Moon' && (
                          <p>Focus on rest, intention-setting, and gentle self-care practices.</p>
                        )}
                        {moonData.phase === 'First Quarter' && (
                          <p>Channel energy into physical activity and overcoming challenges.</p>
                        )}
                        {moonData.phase === 'Full Moon' && (
                          <p>Practice gratitude, release stress, and celebrate achievements.</p>
                        )}
                        {moonData.phase === 'Last Quarter' && (
                          <p>Focus on letting go, forgiveness, and emotional cleansing.</p>
                        )}
                        {!['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'].includes(moonData.phase) && (
                          <p>Maintain balance and flow with the moon's changing energy.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="mt-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">Understanding Lunar Cycles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-100 mb-3">Working with Moon Phases</h4>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p><strong>New Moon:</strong> Plant seeds of intention and start fresh projects.</p>
                      <p><strong>Waxing Phases:</strong> Build momentum and take action on your goals.</p>
                      <p><strong>Full Moon:</strong> Celebrate achievements and release what doesn't serve.</p>
                      <p><strong>Waning Phases:</strong> Reflect, rest, and prepare for the next cycle.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-100 mb-3">Zodiac Integration</h4>
                    <div className="space-y-2 text-sm text-purple-200">
                      <p><strong>Fire Signs:</strong> Bold action, creativity, and leadership energy.</p>
                      <p><strong>Earth Signs:</strong> Practical matters, stability, and material concerns.</p>
                      <p><strong>Air Signs:</strong> Communication, ideas, and social connections.</p>
                      <p><strong>Water Signs:</strong> Emotions, intuition, and spiritual insights.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}