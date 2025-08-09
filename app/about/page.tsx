import React from "react";
import Footer from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              About Kaidenz Clothing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Kaidenz Clothing is a modern fashion brand dedicated to providing stylish, 
              comfortable, and affordable clothing for everyone. Our mission is to empower 
              self-expression and confidence through fashion, blending timeless classics 
              with the latest trends.
            </p>
          </div>

          <Separator className="my-12" />

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-none">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs">Q</Badge>
                </div>
                <h3 className="text-xl font-semibold">Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use premium materials and expert craftsmanship to ensure 
                  every piece meets the highest standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs">S</Badge>
                </div>
                <h3 className="text-xl font-semibold">Sustainability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to ethical sourcing and sustainable practices 
                  to protect our planet for future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xs">C</Badge>
                </div>
                <h3 className="text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in giving back and supporting our community through 
                  various initiatives and partnerships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}