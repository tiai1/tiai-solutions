import { useActiveSection } from '@/lib/viewport';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'problem', label: 'Problem' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'charts', label: 'Charts' },
  { id: 'testimonials', label: 'Testimonials' },
];

export default function ProgressRail() {
  const activeSection = useActiveSection();

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="progress-rail hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300 hover:scale-125',
              activeSection === section.id 
                ? 'bg-primary shadow-lg shadow-primary/50' 
                : 'bg-muted hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to ${section.label} section`}
            data-testid={`progress-dot-${section.id}`}
          />
        ))}
      </div>
    </div>
  );
}
