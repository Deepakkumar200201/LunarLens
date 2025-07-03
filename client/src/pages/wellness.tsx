import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/navigation';
import { useMoonData } from '@/hooks/use-moon-data';
import { Heart, Leaf, Moon, Sun, Star, Sparkles, Target, Calendar } from 'lucide-react';

export default function WellnessPage() {
  const { data: moonData, isLoading } = useMoonData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getWellnessTips = (phase: string, zodiacSign: string) => {
    const phaseTips: Record<string, string[]> = {
      'New Moon': [
        'Set intentions for the lunar cycle ahead',
        'Practice meditation and mindfulness',
        'Start a new self-care routine',
        'Journal about your goals and dreams',
        'Take a relaxing bath with essential oils'
      ],
      'Waxing Crescent': [
        'Take action on your wellness goals',
        'Begin a new exercise routine',
        'Try a new healthy recipe',
        'Practice positive affirmations',
        'Connect with supportive friends'
      ],
      'First Quarter': [
        'Push through fitness challenges',
        'Address any health obstacles',
        'Make important wellness decisions',
        'Practice assertiveness in self-care',
        'Try high-energy workouts'
      ],
      'Waxing Gibbous': [
        'Fine-tune your wellness routine',
        'Adjust your diet based on what works',
        'Seek feedback on your progress',
        'Practice patience with your journey',
        'Focus on consistency over perfection'
      ],
      'Full Moon': [
        'Celebrate your wellness achievements',
        'Practice gratitude for your body',
        'Release unhealthy habits',
        'Do a full-body stretch routine',
        'Connect with nature under moonlight'
      ],
      'Waning Gibbous': [
        'Share wellness knowledge with others',
        'Mentor someone in their health journey',
        'Practice giving back to your community',
        'Reflect on lessons learned',
        'Express gratitude for progress made'
      ],
      'Last Quarter': [
        'Let go of wellness guilt and shame',
        'Forgive yourself for past setbacks',
        'Declutter your wellness space',
        'Break unhealthy patterns',
        'Practice self-compassion'
      ],
      'Waning Crescent': [
        'Rest and restore your energy',
        'Focus on gentle, restorative practices',
        'Prepare for the next wellness cycle',
        'Practice deep breathing exercises',
        'Prioritize quality sleep'
      ]
    };

    const zodiacTips: Record<string, string[]> = {
      'Aries': ['Try high-intensity workouts', 'Lead a fitness group', 'Set bold wellness goals'],
      'Taurus': ['Focus on nutritious, comforting foods', 'Try grounding exercises', 'Create a peaceful wellness space'],
      'Gemini': ['Vary your exercise routine', 'Learn about different wellness practices', 'Connect with wellness communities'],
      'Cancer': ['Focus on emotional wellness', 'Try water-based exercises', 'Create nurturing self-care rituals'],
      'Leo': ['Make wellness fun and creative', 'Try dance or performance-based fitness', 'Celebrate your wellness wins'],
      'Virgo': ['Focus on detailed wellness planning', 'Try organized fitness routines', 'Pay attention to nutritional details'],
      'Libra': ['Find balance in your wellness routine', 'Try partner workouts', 'Focus on beauty and wellness'],
      'Scorpio': ['Try transformative wellness practices', 'Focus on deep healing', 'Explore mind-body connections'],
      'Sagittarius': ['Try adventure-based fitness', 'Explore new wellness philosophies', 'Set expansive wellness goals'],
      'Capricorn': ['Set structured wellness goals', 'Focus on long-term health benefits', 'Track your progress'],
      'Aquarius': ['Try innovative wellness practices', 'Join group fitness activities', 'Focus on unique approaches'],
      'Pisces': ['Try intuitive wellness practices', 'Focus on spiritual wellness', 'Practice compassion-based self-care']
    };

    return {
      phase: phaseTips[phase] || phaseTips['New Moon'],
      zodiac: zodiacTips[zodiacSign] || zodiacTips['Aries']
    };
  };

  const getMoonRituals = (phase: string) => {
    const rituals: Record<string, { title: string, description: string, steps: string[] }> = {
      'New Moon': {
        title: 'New Moon Intention Setting',
        description: 'Harness the energy of new beginnings',
        steps: [
          'Find a quiet, sacred space',
          'Light a white candle',
          'Write down 3-5 intentions for the lunar cycle',
          'Hold the paper and visualize your goals',
          'Place the paper under your pillow'
        ]
      },
      'Full Moon': {
        title: 'Full Moon Release Ceremony',
        description: 'Let go of what no longer serves you',
        steps: [
          'Write down what you want to release',
          'Find a safe place to burn the paper',
          'As it burns, visualize letting go',
          'Take three deep breaths',
          'Express gratitude for the lessons learned'
        ]
      },
      'First Quarter': {
        title: 'Action Moon Ritual',
        description: 'Channel energy into purposeful action',
        steps: [
          'Review your new moon intentions',
          'Choose one to focus on this week',
          'Create a specific action plan',
          'Visualize overcoming obstacles',
          'Take one concrete step immediately'
        ]
      },
      'Last Quarter': {
        title: 'Forgiveness Moon Practice',
        description: 'Practice self-forgiveness and healing',
        steps: [
          'Sit in comfortable meditation posture',
          'Place hands on heart',
          'Breathe deeply and forgive yourself',
          'Forgive others who have hurt you',
          'Send love and light to all beings'
        ]
      }
    };

    return rituals[phase] || rituals['New Moon'];
  };

  const wellnessCategories = [
    { id: 'all', label: 'All', icon: Heart },
    { id: 'physical', label: 'Physical', icon: Target },
    { id: 'mental', label: 'Mental', icon: Sparkles },
    { id: 'spiritual', label: 'Spiritual', icon: Star },
    { id: 'emotional', label: 'Emotional', icon: Moon }
  ];

  const categorizedTips = {
    physical: [
      'Stay hydrated throughout the day',
      'Get adequate sleep (7-9 hours)',
      'Move your body regularly',
      'Eat nourishing, whole foods',
      'Practice good posture'
    ],
    mental: [
      'Practice mindfulness meditation',
      'Limit negative news consumption',
      'Challenge negative thought patterns',
      'Learn something new regularly',
      'Practice gratitude daily'
    ],
    spiritual: [
      'Connect with nature regularly',
      'Practice prayer or meditation',
      'Read inspiring spiritual texts',
      'Participate in community service',
      'Reflect on your life purpose'
    ],
    emotional: [
      'Express your feelings openly',
      'Practice self-compassion',
      'Set healthy boundaries',
      'Seek support when needed',
      'Celebrate small victories'
    ]
  };

  const currentTips = moonData ? getWellnessTips(moonData.phase, moonData.zodiac?.sign || 'Aries') : null;
  const currentRitual = moonData ? getMoonRituals(moonData.phase) : null;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-12 constellation-bg">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Lunar Wellness</h1>
            <p className="text-green-200">Align your wellbeing with the natural rhythms of the moon</p>
          </div>

          {/* Current Moon Wellness */}
          <div className="mb-8">
            <Card className="glass-card border-green-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-400" />
                  Today's Wellness Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse h-4 bg-green-500/20 rounded"></div>
                    <div className="animate-pulse h-3 bg-green-500/10 rounded w-2/3"></div>
                  </div>
                ) : moonData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-100 mb-2">Current Moon Phase: {moonData.phase}</h3>
                      <p className="text-green-200 mb-4">{moonData.wellnessTip}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-100">Phase-Specific Tips:</h4>
                        <ul className="space-y-1">
                          {currentTips?.phase.slice(0, 3).map((tip, index) => (
                            <li key={index} className="text-sm text-green-200 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-green-100 mb-2">
                        Moon in {moonData.zodiac?.sign}
                      </h3>
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-100">Zodiac-Specific Tips:</h4>
                        <ul className="space-y-1">
                          {currentTips?.zodiac.map((tip, index) => (
                            <li key={index} className="text-sm text-green-200 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wellness Categories */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Wellness Categories</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {wellnessCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "border-green-500/30 text-green-200 hover:bg-green-500/10"
                        }
                      >
                        <category.icon className="w-4 h-4 mr-2" />
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCategory === 'all' ? (
                      Object.entries(categorizedTips).map(([category, tips]) => (
                        <div key={category}>
                          <h4 className="font-medium text-green-100 mb-2 capitalize">{category} Wellness</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tips.map((tip, index) => (
                              <div key={index} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-sm text-green-200">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : selectedCategory !== 'all' ? (
                      <div>
                        <h4 className="font-medium text-green-100 mb-4 capitalize">{selectedCategory} Wellness Tips</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categorizedTips[selectedCategory as keyof typeof categorizedTips]?.map((tip, index) => (
                            <div key={index} className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                              <p className="text-sm text-green-200">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Moon Ritual */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-400" />
                    Moon Ritual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="animate-pulse h-4 bg-purple-500/20 rounded"></div>
                      <div className="animate-pulse h-3 bg-purple-500/10 rounded w-2/3"></div>
                    </div>
                  ) : currentRitual ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-purple-100">{currentRitual.title}</h3>
                        <p className="text-sm text-purple-300 mt-1">{currentRitual.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-purple-200 mb-2">Steps:</h4>
                        <ol className="space-y-2">
                          {currentRitual.steps.map((step, index) => (
                            <li key={index} className="text-sm text-purple-200 flex gap-3">
                              <Badge variant="outline" className="border-purple-500/30 text-purple-300 min-w-[24px] h-6 rounded-full p-0 flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Wellness Calendar */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <span className="text-sm font-medium text-blue-200">{day}</span>
                        <span className="text-xs text-blue-300">
                          {index === 0 && '🧘 Meditation'}
                          {index === 1 && '🏃 Exercise'}
                          {index === 2 && '🌿 Nature walk'}
                          {index === 3 && '📚 Learning'}
                          {index === 4 && '💝 Self-care'}
                          {index === 5 && '🤝 Social time'}
                          {index === 6 && '😴 Rest day'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}