import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, BarChart3, Users, ArrowRight, ChefHat, Clock, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Orderhai</span>
          </div>
          <Link to="/login">
            <Button variant="hero" size="lg">
              Login
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-hero">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Serving Fresh Food to Villages
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Manage Your Orders
              <span className="block gradient-primary bg-clip-text text-transparent">
                With Ease
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Complete order management dashboard for your food delivery business. 
              Track orders, manage stocks, monitor revenue, and coordinate delivery partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Powerful tools to manage your entire food delivery operation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: "Order Management",
                description: "Track and assign orders to shops manually with real-time status updates",
              },
              {
                icon: BarChart3,
                title: "Stock Control",
                description: "Monitor inventory levels and never run out of popular items",
              },
              {
                icon: Truck,
                title: "Delivery Partners",
                description: "Manage your delivery boys and track their assignments",
              },
              {
                icon: Users,
                title: "Shop Management",
                description: "Maintain your shop list and assign orders efficiently",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Preview */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular Menu Items
            </h2>
            <p className="text-muted-foreground">
              Delicious food for village convenience
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Burger", "Chowmin", "Gol Gappe", "Momos", 
              "Chilli Potato", "Biryani", "Fried Rice", 
              "Anda Roll", "Chicken Roll"
            ].map((item, index) => (
              <span
                key={index}
                className="bg-card text-foreground px-4 py-2 rounded-full text-sm font-medium border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, value: "24/7", label: "Order Tracking" },
              { icon: MapPin, value: "50+", label: "Villages Covered" },
              { icon: ShoppingBag, value: "1000+", label: "Orders Daily" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="gradient-primary rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Streamline Your Operations?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Login to your dashboard and start managing orders efficiently
            </p>
            <Link to="/login">
              <Button 
                variant="secondary" 
                size="xl"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Login Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © 2024 Orderhai. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
