import { Card } from './ui/card';
import { BrandMotion } from './BrandMotionSystem';

// Brand Motion Guide Component
export default function BrandMotionGuide() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 bg-card border-border/20">
        <h4 className="font-medium mb-4">Timing Scale</h4>
        <div className="space-y-3">
          {Object.entries(BrandMotion.timing).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm capitalize">{key}</span>
              <span className="text-sm text-muted-foreground">{value}s</span>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-6 bg-card border-border/20">
        <h4 className="font-medium mb-4">Easing Curves</h4>
        <div className="space-y-3">
          {Object.entries(BrandMotion.easing).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <span className="text-sm capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="text-xs text-muted-foreground font-mono">{value}</div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-6 bg-card border-border/20">
        <h4 className="font-medium mb-4">Stagger Delays</h4>
        <div className="space-y-3">
          {Object.entries(BrandMotion.stagger).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm capitalize">{key}</span>
              <span className="text-sm text-muted-foreground">{value}s</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}