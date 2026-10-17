import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart2,
  Globe,
  Star,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/Button';
import Card, { CardTitle, CardDescription } from '../components/Card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built on Vite for near-instant hot module replacement and optimised production bundles.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
  },
  {
    icon: Shield,
    title: 'Type-Safe Forms',
    description:
      'React Hook Form + Zod give you runtime-validated, fully accessible forms out of the box.',
    color: 'text-green-500 bg-green-50 dark:bg-green-950/40',
  },
  {
    icon: BarChart2,
    title: 'Rich Data Viz',
    description:
      'Recharts is pre-configured so you can drop beautiful, responsive charts into any page.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    icon: Globe,
    title: 'Client-Side Routing',
    description:
      'React Router DOM v6 powers nested layouts, protected routes, and lazy loading.',
    color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Frontend Engineer',
    text: 'Vexora saved me a full day of boilerplate. Every pattern I need is already there.',
    rating: 5,
  },
  {
    name: 'Alex Rivera',
    role: 'Full-Stack Developer',
    text: 'Clean code, great DX, and the Tailwind setup just works. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Jordan Park',
    role: 'Product Engineer',
    text: 'The component library is polished enough to ship straight to production.',
    rating: 4,
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 py-20 text-white text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Zap size={12} /> React + Vite + Tailwind v4
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Build faster.<br />Ship with confidence.
          </h1>
          <p className="mt-4 text-lg text-violet-100">
            Vexora is a production-ready React starter with routing, forms,
            charts, auth, and a beautiful design system — all pre-configured.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 shadow-lg shadow-violet-900/30"
              onClick={() => {}}
            >
              Get started <ArrowRight size={16} />
            </Button>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                View dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Everything you need
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            A carefully assembled toolkit so you can focus on your product.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description, color }) => (
            <Card key={title} hover>
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-8 dark:from-violet-950/30 dark:to-purple-950/30">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
          What's included
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'React 19 + Vite 8',
            'Tailwind CSS v4',
            'React Router DOM v6',
            'React Hook Form + Zod',
            'Axios with interceptors',
            'Recharts data viz',
            'React Hot Toast',
            'Lucide React icons',
            'clsx + tailwind-merge',
            'Dark mode support',
            'Responsive layouts',
            'Accessible components',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="shrink-0 text-violet-600 dark:text-violet-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Loved by developers
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map(({ name, role, text, rating }) => (
            <Card key={name}>
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Ready to ship?
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Jump into the dashboard and see what Vexora can do.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Create an account</Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="secondary">
              Learn more
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
