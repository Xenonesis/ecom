"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export default function LogoShowcasePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ShopHub Logo Showcase</h1>
          <p className="text-muted-foreground text-lg">
            Explore the new ShopHub logo in different variants and themes
          </p>
          
          {/* Theme Switcher */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm font-medium">Theme:</span>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                System
              </Button>
            </div>
          </div>
        </div>

        {/* Logo Variants Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Full Logo */}
          <div className="border rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-card">
            <Logo variant="full" size={40} />
            <div className="text-center">
              <h3 className="font-semibold">Full Logo</h3>
              <p className="text-sm text-muted-foreground">Icon + Text</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                variant="full" size=&#123;40&#125;
              </code>
            </div>
          </div>

          {/* Icon Only */}
          <div className="border rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-card">
            <Logo variant="icon" size={60} />
            <div className="text-center">
              <h3 className="font-semibold">Icon Only</h3>
              <p className="text-sm text-muted-foreground">Shopping Bag Hub</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                variant="icon" size=&#123;60&#125;
              </code>
            </div>
          </div>

          {/* Text Only */}
          <div className="border rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-card">
            <Logo variant="text" />
            <div className="text-center">
              <h3 className="font-semibold">Text Only</h3>
              <p className="text-sm text-muted-foreground">Gradient Text</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                variant="text"
              </code>
            </div>
          </div>
        </div>

        {/* Size Variations */}
        <div className="border rounded-lg p-8 mb-12 bg-card">
          <h2 className="text-2xl font-bold mb-6">Size Variations</h2>
          <div className="flex flex-wrap items-end justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={24} />
              <span className="text-xs text-muted-foreground">24px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={32} />
              <span className="text-xs text-muted-foreground">32px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={48} />
              <span className="text-xs text-muted-foreground">48px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={64} />
              <span className="text-xs text-muted-foreground">64px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={80} />
              <span className="text-xs text-muted-foreground">80px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Logo variant="icon" size={100} />
              <span className="text-xs text-muted-foreground">100px</span>
            </div>
          </div>
        </div>

        {/* Full Logo Sizes */}
        <div className="border rounded-lg p-8 mb-12 bg-card">
          <h2 className="text-2xl font-bold mb-6">Full Logo Sizes</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Logo variant="full" size={24} />
              <span className="text-sm text-muted-foreground">Small (24px)</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo variant="full" size={32} />
              <span className="text-sm text-muted-foreground">Medium (32px)</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo variant="full" size={40} />
              <span className="text-sm text-muted-foreground">Large (40px) - Default</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo variant="full" size={56} />
              <span className="text-sm text-muted-foreground">Extra Large (56px)</span>
            </div>
          </div>
        </div>

        {/* Design Details */}
        <div className="border rounded-lg p-8 bg-card">
          <h2 className="text-2xl font-bold mb-4">Design Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Concept</h3>
              <p className="text-sm text-muted-foreground">
                The logo combines a shopping bag with interconnected nodes, representing ShopHub as 
                a central marketplace connecting buyers and sellers in a network.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: "#7C3AED" }}></div>
                  <span className="text-muted-foreground">Purple: #7C3AED (Light)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: "#DB2777" }}></div>
                  <span className="text-muted-foreground">Pink: #DB2777 (Light)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: "#2563EB" }}></div>
                  <span className="text-muted-foreground">Blue: #2563EB (Light)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Theme-aware (light/dark)</li>
                <li>✓ Scalable SVG design</li>
                <li>✓ Multiple variants</li>
                <li>✓ Gradient effects</li>
                <li>✓ Glow filters</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Usage</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Import the component:</p>
                <code className="block bg-muted p-2 rounded text-xs">
                  import &#123; Logo &#125; from '@/components/logo';
                </code>
                <p className="pt-2">Use in your component:</p>
                <code className="block bg-muted p-2 rounded text-xs">
                  &lt;Logo variant="full" size=&#123;40&#125; /&gt;
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
