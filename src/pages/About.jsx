import { Users, Target, Award, Rocket, Code2, Heart } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'Alex Morgan',
    role: 'Founder & Lead Engineer',
    initials: 'AM',
    color: 'bg-violet-600',
    bio: 'Full-stack developer with 10+ years building scalable web applications.',
  },
  {
    name: 'Jamie Lee',
    role: 'UI/UX Designer',
    initials: 'JL',
    color: 'bg-rose-500',
    bio: 'Passionate about crafting beautiful, accessible interfaces that users love.',
  },
  {
    name: 'Sam Patel',
    role: 'Backend Architect',
    initials: 'SP',
    color: 'bg-amber-500',
    bio: 'Expert in API design, database optimisation, and cloud infrastructure.',
  },
];

const values = [
  {
    icon: Code2,
    title: 'Developer first',
    description:
      'Every decision is made with DX in mind. Clean APIs, clear patterns, excellent tooling.',
  },
  {
    icon: Heart,
    title: 'Open source',
    description:
      'We believe great software should be free and open for everyone to use and extend.',
  },
  {
    icon: Target,
    title: 'Quality over speed',
    description:
      'We take the time to get things right — from accessibility to performance.',
  },
  {
    icon: Rocket,
    title: 'Ship fast',
    description:
      'Boilerplate should never hold you back. Vexora gets you to production quickly.',
  },
];

export default function About() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
          <Users size={14} />
          About us
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          We build tools that developers love
        </h1>
        <p className="mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
          Vexora started as an internal starter kit and grew into a full-featured
          React boilerplate. Our mission is to eliminate repetitive setup work so
          you can focus on what actually matters — building your product.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/register">
            <Button>Get started free</Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">View on GitHub</Button>
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'GitHub Stars', value: '4.2K' },
          { label: 'Downloads', value: '28K' },
          { label: 'Contributors', value: '47' },
          { label: 'Issues closed', value: '312' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {value}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* Values */}
      <section>
        <h2 className="mb-8 text-xl font-bold text-gray-900 dark:text-gray-100">
          Our values
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                <Icon size={18} />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
          <Award size={14} />
          Meet the team
        </div>
        <h2 className="mb-8 text-xl font-bold text-gray-900 dark:text-gray-100">
          The people behind Vexora
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {team.map(({ name, role, initials, color, bio }) => (
            <Card key={name} hover>
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white ${color}`}
              >
                {initials}
              </div>
              <CardTitle>{name}</CardTitle>
              <p className="mt-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
                {role}
              </p>
              <CardDescription className="mt-2">{bio}</CardDescription>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
