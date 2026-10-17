import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { postService } from '../services/api';
import { formatNumber, formatDate, truncate } from '../utils/helpers';
import toast from 'react-hot-toast';

// ─── Mock chart data ──────────────────────────────────────────────
const areaData = [
  { month: 'Jan', revenue: 4200, users: 240 },
  { month: 'Feb', revenue: 5800, users: 310 },
  { month: 'Mar', revenue: 4900, users: 280 },
  { month: 'Apr', revenue: 7100, users: 420 },
  { month: 'May', revenue: 6400, users: 390 },
  { month: 'Jun', revenue: 8900, users: 540 },
  { month: 'Jul', revenue: 9200, users: 610 },
];

const barData = [
  { day: 'Mon', sessions: 42 },
  { day: 'Tue', sessions: 67 },
  { day: 'Wed', sessions: 55 },
  { day: 'Thu', sessions: 80 },
  { day: 'Fri', sessions: 72 },
  { day: 'Sat', sessions: 30 },
  { day: 'Sun', sessions: 20 },
];

const pieData = [
  { name: 'Organic', value: 45 },
  { name: 'Direct', value: 28 },
  { name: 'Referral', value: 17 },
  { name: 'Social', value: 10 },
];

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ede9fe'];

const kpis = [
  {
    label: 'Total Revenue',
    value: '$48,295',
    delta: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-50 text-green-600 dark:bg-green-950/40',
  },
  {
    label: 'Active Users',
    value: '3,842',
    delta: '+8.1%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40',
  },
  {
    label: 'Orders',
    value: '1,073',
    delta: '-2.3%',
    trend: 'down',
    icon: ShoppingCart,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
  },
  {
    label: 'Growth',
    value: '24.8%',
    delta: '+3.7%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40',
  },
];

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await postService.getAll({ _limit: 5 });
      setPosts(res.data);
      if (isRefresh) toast.success('Dashboard refreshed!');
    } catch (err) {
      toast.error(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <Loading message="Loading dashboard…" />;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="secondary"
            size="sm"
            loading={refreshing}
            onClick={() => fetchPosts(true)}
          >
            <RefreshCw size={14} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus size={14} />
            Add widget
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, delta, trend, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={18} />
              </div>
            </CardHeader>
            <div
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                trend === 'up'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              {delta} vs last month
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for 2025</CardDescription>
          </div>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal size={16} />
          </Button>
        </CardHeader>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={areaData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${formatNumber(v)}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                fontSize: '13px',
              }}
              formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar + Pie charts */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Weekly Sessions</CardTitle>
                <CardDescription>User sessions per day this week</CardDescription>
              </div>
            </CardHeader>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="sessions" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardTitle className="mb-1">Traffic Sources</CardTitle>
            <CardDescription className="mb-4">Acquisition breakdown</CardDescription>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    fontSize: '13px',
                  }}
                  formatter={(v) => [`${v}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Recent posts table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest content from JSONPlaceholder API</CardDescription>
          </div>
          <Button variant="secondary" size="sm">
            View all
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  #
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Title
                </th>
                <th className="hidden pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                  Preview
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {posts.map((post) => (
                <tr key={post.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 pr-4 text-xs text-gray-400">{post.id}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-100">
                    {truncate(post.title, 40)}
                  </td>
                  <td className="hidden py-3 pr-4 text-gray-500 dark:text-gray-400 sm:table-cell">
                    {truncate(post.body, 60)}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      {post.userId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
