import { 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Image as ImageIcon, 
  Bell,
  Users,
  Shield,
  Lock,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  CreditCard,
  Wrench,
  Star,
  TrendingUp,
  Heart,
  HelpCircle,
  Zap
} from "lucide-react";
import FampoLogo from "@/components/FampoLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Navigation with Hover Animation */}
      <div className="nav-wrapper group fixed top-0 z-50 w-full">
        {/* Hover Trigger Area at Top */}
        <div className="h-4 w-full"></div>
        {/* Navigation Bar */}
        <nav className="w-full border-b bg-white/80 backdrop-blur-sm shadow-sm transition-transform duration-500 ease-in-out -translate-y-full group-hover:translate-y-0">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <FampoLogo size={40} className="rounded-lg shadow-md" />
              <span className="text-xl font-semibold text-zinc-900">Fampo</span>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <a 
                href="#how-it-works" 
                className="nav-link group/link relative flex items-center gap-2 rounded-full bg-blue-50/80 px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-100 hover:text-blue-800 hover:shadow-md hover:scale-105"
              >
                <Zap className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                <span>How It Works</span>
              </a>
              <a 
                href="#features" 
                className="nav-link group/link relative flex items-center gap-2 rounded-full bg-green-50/80 px-5 py-2.5 text-sm font-bold text-green-700 shadow-sm transition-all hover:bg-green-100 hover:text-green-800 hover:shadow-md hover:scale-105"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                <span>Features</span>
              </a>
              <a 
                href="#faq" 
                className="nav-link group/link relative flex items-center gap-2 rounded-full bg-purple-50/80 px-5 py-2.5 text-sm font-bold text-purple-700 shadow-sm transition-all hover:bg-purple-100 hover:text-purple-800 hover:shadow-md hover:scale-105"
              >
                <HelpCircle className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                <span>FAQ</span>
              </a>
              <a 
                href="#pricing" 
                className="nav-link group/link relative flex items-center gap-2 rounded-full bg-pink-50/80 px-5 py-2.5 text-sm font-bold text-pink-700 shadow-sm transition-all hover:bg-pink-100 hover:text-pink-800 hover:shadow-md hover:scale-105"
              >
                <CreditCard className="h-4 w-4 transition-transform group-hover/link:scale-110" />
                <span>Pricing</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#join-waitlist"
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6 lg:px-8 lg:pt-10 lg:pb-8">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm sm:mb-3">
            <Sparkles className="h-4 w-4" />
            <span>Coming Soon</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl sm:mb-3 lg:text-6xl">
            The Ultimate FAMily PlatfOrm
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Dashboard App</span>
          </h1>
          <p className="mb-3 text-lg leading-relaxed text-zinc-600 sm:text-xl sm:mb-4 lg:mx-auto lg:max-w-2xl">
            A calm, modern, and secure digital family dashboard that helps families stay organized, 
            connected, and informed — without chaos.
          </p>
          <div className="mb-3 flex flex-col items-center justify-center gap-3 sm:mb-4 sm:flex-row">
            <a
              href="#join-waitlist"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
            >
              Join Waitlist
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto"
            >
              Learn More
            </a>
          </div>
          
          {/* Trust Indicators & Quick Stats */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-600 sm:mb-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-white"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 ring-2 ring-white"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 ring-2 ring-white"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 ring-2 ring-white"></div>
              </div>
              <span className="font-medium text-zinc-900">1,000+ Families</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium text-zinc-900">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-zinc-900">Trusted by Families</span>
            </div>
          </div>

          {/* Quick Feature Highlights */}
          <div className="mt-4 w-full overflow-x-visible sm:mt-5">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-2 px-4 sm:grid-cols-2 sm:gap-2 sm:px-6 lg:px-8 xl:grid-cols-4 xl:gap-2">
              <div className="group flex min-w-0 flex-col items-center overflow-visible rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm transition-all hover:scale-105 hover:shadow-md sm:p-5 lg:p-4 xl:p-5">
                <div className="mb-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <Calendar className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-semibold text-zinc-800">Shared Calendar</span>
                <p className="-mt-0.5 text-center text-xs leading-tight text-zinc-600">Keep everyone in sync</p>
              </div>
              <div className="group flex min-w-0 flex-col items-center overflow-visible rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm transition-all hover:scale-105 hover:shadow-md sm:p-5 lg:p-4 xl:p-5">
                <div className="mb-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-semibold text-zinc-800">Task Management</span>
                <p className="-mt-0.5 text-center text-xs leading-tight text-zinc-600">Assign and track tasks</p>
              </div>
              <div className="group flex min-w-0 flex-col items-center overflow-visible rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm transition-all hover:scale-105 hover:shadow-md sm:p-5 lg:p-4 xl:p-5">
                <div className="mb-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 shadow-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <Bell className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-semibold text-zinc-800">Smart Reminders</span>
                <p className="-mt-0.5 text-center text-xs leading-tight text-zinc-600">Never miss important events</p>
              </div>
              <div className="group flex min-w-0 flex-col items-center overflow-visible rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm transition-all hover:scale-105 hover:shadow-md sm:p-5 lg:p-4 xl:p-5">
                <div className="mb-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600 shadow-sm transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                  <Heart className="h-7 w-7" />
                </div>
                <span className="text-center text-sm font-semibold text-zinc-800">Family Memories</span>
                <p className="-mt-0.5 text-center text-xs leading-tight text-zinc-600">Preserve special moments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to push transition section below viewport */}
      <div className="hero-transition-spacer"></div>

      {/* Transition Showcase Section */}
      <section className="relative overflow-hidden border-y border-zinc-200 bg-gradient-to-r from-white via-blue-50/30 to-white px-4 pb-10 sm:px-6 lg:px-8 viewport-push-up">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="group flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md transition-transform group-hover:scale-110">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900">100% Secure</div>
                <div className="text-sm text-zinc-600">Your family data protected</div>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md transition-transform group-hover:scale-110">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900">Easy Setup</div>
                <div className="text-sm text-zinc-600">Get started in minutes</div>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md transition-transform group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-zinc-900">All Ages</div>
                <div className="text-sm text-zinc-600">Perfect for everyone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section id="features" className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
              Does This Sound Familiar?
            </h2>
            <p className="text-lg text-zinc-600">
              Families struggle with scattered information and missed connections
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-7 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-zinc-900">The Problem</h3>
              <ul className="space-y-2.5 text-zinc-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span>Scattered information across WhatsApp, notes apps, and calendars</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span>Missed events and forgotten tasks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span>No shared source of truth for family coordination</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-red-500">✗</span>
                  <span>Tools built for teams, not families</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-7 text-white shadow-xl">
              <h3 className="mb-4 text-xl font-semibold">The Fampo Solution</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Single shared family dashboard for everything</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Clear visibility into events, tasks, and announcements</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Automated reminders via WhatsApp & SMS</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Private, secure place for family memories</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0" />
                  <span>Simple UX that works for all age groups</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 viewport-section-spacing">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="mb-1.5 text-3xl font-bold text-zinc-900 sm:text-4xl sm:mb-2">
              Why Families Love Fampo
            </h2>
            <p className="text-base text-zinc-600 sm:text-lg">
              Built specifically for families, not corporate teams
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/80 p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md sm:mb-3 sm:h-12 sm:w-12">
                <Sparkles className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-zinc-900 sm:mb-2 sm:text-lg">Calm</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                No noisy notifications or overwhelming interfaces. Just peaceful family coordination.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/80 p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-md sm:mb-3 sm:h-12 sm:w-12">
                <CheckCircle2 className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-zinc-900 sm:mb-2 sm:text-lg">Organized</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Everything in one place: calendar, tasks, notes, and memories. No more searching.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/80 p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 text-white shadow-md sm:mb-3 sm:h-12 sm:w-12">
                <Bell className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-zinc-900 sm:mb-2 sm:text-lg">Reliable</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Automated WhatsApp & SMS reminders ensure nothing falls through the cracks.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/80 p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink-600 text-white shadow-md sm:mb-3 sm:h-12 sm:w-12">
                <Users className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-zinc-900 sm:mb-2 sm:text-lg">Family-First</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Designed for all ages — from kids to grandparents. Simple, intuitive, and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white px-4 sm:px-6 lg:px-8 viewport-section-spacing">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="mb-1.5 text-3xl font-bold text-zinc-900 sm:text-4xl sm:mb-2">
              How It Works
            </h2>
            <p className="text-base text-zinc-600 sm:text-lg">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 sm:gap-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-md transition-shadow hover:shadow-lg sm:p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-md sm:mb-4 sm:h-10 sm:w-10 sm:text-base">
                1
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Create Family Space</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Sign up and invite your family members. Everyone gets secure access to your private family dashboard.
              </p>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-md transition-shadow hover:shadow-lg sm:p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-md sm:mb-4 sm:h-10 sm:w-10 sm:text-base">
                2
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Add Events & Tasks</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Start adding family events, assign tasks, write notes, and share announcements. Everything stays organized.
              </p>
            </div>
            <div className="relative rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-md transition-shadow hover:shadow-lg sm:p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white shadow-md sm:mb-4 sm:h-10 sm:w-10 sm:text-base">
                3
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Get Reminders Automatically</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Fampo sends WhatsApp and SMS reminders automatically. Your family stays informed without any extra effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
              Everything Your Family Needs
            </h2>
            <p className="text-lg text-zinc-600">
              All your family coordination tools in one place
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shadow-sm">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Family Calendar</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Shared events with categories (birthdays, school, travel, medical). Automatic reminders keep everyone informed.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600 shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Tasks & To-Dos</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Assign tasks to family members with due dates. Track completion and stay on top of responsibilities.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Family Notes</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Store important information like Wi-Fi passwords and emergency contacts. Categorized notes for easy access.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shadow-sm">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Announcements</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Share time-bound family messages. Set expiry dates to keep information current and relevant.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-pink-100 text-pink-600 shadow-sm">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Family Memories</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                Upload photos and attach notes to memories. Private family gallery to preserve special moments.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-100 text-teal-600 shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-zinc-900">Smart Notifications</h3>
              <p className="text-sm leading-relaxed text-zinc-600">
                WhatsApp reminders with SMS fallback. User-level and app-level controls for personalized notification preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture at a Glance */}
      <section className="bg-gradient-to-b from-white via-blue-50/30 to-white px-4 sm:px-6 lg:px-8 viewport-section-spacing">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-4 text-center sm:mb-5">
            <h2 className="mb-1 text-3xl font-bold text-zinc-900 sm:text-4xl sm:mb-1.5">
              Simple & Reliable
            </h2>
            <p className="text-sm text-zinc-600 sm:text-base">
              Built on modern infrastructure you can trust
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-white via-white to-blue-50/40 p-3 shadow-2xl sm:p-5 lg:p-6">
            <div className="relative grid gap-3 lg:grid-cols-3 lg:gap-2.5">
              {/* Family Members Card */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-blue-50/80 to-white p-3 text-center shadow-md transition-all hover:shadow-xl hover:scale-[1.02] sm:p-4 lg:text-left">
                <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 sm:mb-3 sm:h-12 sm:w-12 lg:mx-0">
                  <Users className="h-6 w-6 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-zinc-900 sm:text-base">Family Members</h3>
                <p className="text-xs leading-snug text-zinc-600">
                  Access Fampo from any web browser. Simple, secure, and accessible.
                </p>
                <div className="absolute -right-2 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg lg:flex">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Fampo Platform Card */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-green-50/80 to-white p-3 text-center shadow-md transition-all hover:shadow-xl hover:scale-[1.02] sm:p-4 lg:text-left">
                <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 sm:mb-3 sm:h-12 sm:w-12 lg:mx-0">
                  <Sparkles className="h-6 w-6 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-zinc-900 sm:text-base">Fampo Platform</h3>
                <p className="text-xs leading-snug text-zinc-600">
                  Your shared dashboard with calendar, tasks, notes, memories, and smart organization.
                </p>
                <div className="absolute -right-2 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-600 shadow-lg lg:flex">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Smart Reminders Card */}
              <div className="group relative rounded-2xl bg-gradient-to-br from-purple-50/80 to-white p-3 text-center shadow-md transition-all hover:shadow-xl hover:scale-[1.02] sm:p-4 lg:text-left">
                <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 sm:mb-3 sm:h-12 sm:w-12 lg:mx-0">
                  <Bell className="h-6 w-6 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-zinc-900 sm:text-base">Smart Reminders</h3>
                <p className="text-xs leading-snug text-zinc-600">
                  Automatic WhatsApp notifications and SMS fallback ensure your family never misses important events or tasks.
                </p>
              </div>

              {/* Mobile connector lines */}
              <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-200 via-green-200 to-purple-200 lg:hidden"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="bg-zinc-50 px-4 sm:px-6 lg:px-8 trust-security-section">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 text-center sm:mb-5">
            <h2 className="mb-1 text-3xl font-bold text-zinc-900 sm:text-4xl sm:mb-1.5">
              Trust & Security
            </h2>
            <p className="text-sm text-zinc-600 sm:text-base">
              Your family's privacy and data security are our top priorities
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3 sm:gap-4">
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:p-4">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm sm:mb-3 sm:h-12 sm:w-12">
                <Lock className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 sm:text-base">Secure Authentication</h3>
              <p className="text-xs leading-snug text-zinc-600">
                Industry-standard email and password authentication with JWT tokens. Your account is protected.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:p-4">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm sm:mb-3 sm:h-12 sm:w-12">
                <Shield className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 sm:text-base">Private Family Data</h3>
              <p className="text-xs leading-snug text-zinc-600">
                Row-level security ensures only your family members can access your shared dashboard and memories.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:p-4">
              <div className="mb-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-sm sm:mb-3 sm:h-12 sm:w-12">
                <Clock className="h-6 w-6 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-zinc-900 sm:text-base">Modern Infrastructure</h3>
              <p className="text-xs leading-snug text-zinc-600">
                Built on reliable, scalable platforms with 99.9% uptime. Your family dashboard is always available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900 sm:text-4xl sm:mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-zinc-600 sm:text-lg">
              Everything you need to know about Fampo
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm sm:p-5">
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Is it private?</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Yes! Fampo uses row-level security to ensure only your family members can access your dashboard. 
                Your data is encrypted and stored securely. We never share your information with third parties.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm sm:p-5">
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Is it for kids & elders?</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                Absolutely! Fampo is designed to be simple and intuitive for all ages. The interface is clean, 
                easy to read, and accessible. Whether you're 8 or 80, you'll find Fampo easy to use.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm sm:p-5">
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Do I need WhatsApp?</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                While WhatsApp reminders are a convenient feature, they're not required. Fampo works perfectly 
                as a web-based dashboard. You can also receive SMS reminders as an alternative, and all information 
                is available in your dashboard at any time.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm sm:p-5">
              <h3 className="mb-2 text-base font-semibold text-zinc-900 sm:text-lg">Is it free?</h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                We're launching soon with early access for families. Join our waitlist to stay updated on pricing 
                and availability. We're committed to making family organization accessible and affordable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Subscription */}
      <section id="pricing" className="bg-gradient-to-br from-zinc-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
              Pricing & Plans
            </h2>
            <p className="text-lg text-zinc-600">
              Choose the plan that works best for your family
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-xl lg:p-12">
            <div className="mb-8 flex items-center justify-center gap-3 rounded-xl bg-amber-50 px-6 py-4 text-center">
              <Wrench className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Subscription and payment features are currently under development. We'll announce pricing plans soon!
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6">
                <h3 className="mb-2 text-xl font-bold text-zinc-900">Free</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-zinc-900">$0</span>
                  <span className="text-zinc-600">/month</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Basic family dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Up to 5 family members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Calendar & tasks</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white p-6 shadow-lg">
                <div className="mb-2 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
                <h3 className="mb-2 text-xl font-bold text-zinc-900">Family</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-zinc-900">Coming Soon</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Unlimited family members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>WhatsApp & SMS reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Photo storage</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6">
                <h3 className="mb-2 text-xl font-bold text-zinc-900">Premium</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-zinc-900">Coming Soon</span>
                </div>
                <ul className="mb-6 space-y-2 text-sm text-zinc-600">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Everything in Family</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Advanced features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="join-waitlist" className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to Organize Your Family?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-blue-50 sm:text-xl">
            Join thousands of families who are staying connected and organized with Fampo.
          </p>
          <div className="mx-auto max-w-md">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border-2 border-white/20 bg-white/95 px-6 py-3.5 text-base font-medium text-zinc-900 placeholder:text-zinc-500 shadow-lg backdrop-blur-sm focus:border-white/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-700"
                aria-label="Email address for waitlist"
              />
              <button
                type="button"
                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-700"
              >
                Join Waitlist
              </button>
            </div>
            <div className="mb-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-blue-100 backdrop-blur-sm">
              <p className="font-medium">
                <Wrench className="mr-2 inline h-4 w-4" />
                Waitlist feature is currently under development
              </p>
            </div>
            <p className="text-sm text-blue-100">
              Early access • No spam • Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <FampoLogo size={40} className="rounded-lg shadow-md" />
              <span className="text-xl font-semibold text-zinc-900">Fampo</span>
            </div>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <CreditCard className="h-4 w-4" />
              Pricing & Plans
            </a>
          </div>
          <div className="border-t border-zinc-200 pt-6 text-center">
            <p className="mb-2 text-sm font-medium text-zinc-900">Complete FAMily PlatfOrm Dashboard application ! Happiness Delivered !!</p>
            <p className="mb-3 text-sm text-zinc-600">Built with ❤️ for families everywhere</p>
            <p className="text-xs text-zinc-500">
              © 2026 Fampo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
