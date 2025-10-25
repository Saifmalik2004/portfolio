import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dashboardService from "@/services/dashboardService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  FileText,
  Code,
  Award,
  Mail,
  Users,
  UserCheck,
  Layers,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ ShadCN Skeleton

type StatCardProps = {
  title: string;
  value: number;
  href?: string;
  icon?: React.ReactNode;
  accent?: string;
  loading?: boolean;
};

const StatCard = ({ title, value, href, icon, accent, loading }: StatCardProps) => (
  <Card className="group hover:shadow-lg transition-shadow duration-200 border border-border/40">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {loading ? <Skeleton className="h-4 w-24" /> : title}
      </CardTitle>
      <div className={`p-2 rounded-md ${accent} text-white`}>
        {loading ? <Skeleton className="h-5 w-5 rounded-full" /> : icon}
      </div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-2" />
      ) : (
        <div className="text-3xl font-semibold">{value}</div>
      )}
      {href && !loading && (
        <div className="mt-4">
          <Link to={href}>
            <Button variant="outline" size="sm" className="w-full">
              Manage
            </Button>
          </Link>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats load error", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalSkills =
    (stats.frontendSkills ?? 0) +
    (stats.backendSkills ?? 0) +
    (stats.toolSkills ?? 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your portfolio statistics.
        </p>
      </div>

      {/* ✅ TOP SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs ?? 0}
          href="/admin/blogs"
          icon={<FileText size={20} />}
          accent="bg-purple-500"
          loading={loading}
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects ?? 0}
          href="/admin/projects"
          icon={<FolderPlus size={20} />}
          accent="bg-blue-500"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          href="/admin/users"
          icon={<Users size={20} />}
          accent="bg-teal-500"
          loading={loading}
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts ?? 0}
          href="/admin/contacts"
          icon={<Mail size={20} />}
          accent="bg-red-500"
          loading={loading}
        />
        <StatCard
          title="Total Certificates"
          value={stats.totalCertificates ?? 0}
          href="/admin/certificates"
          icon={<Award size={20} />}
          accent="bg-green-500"
          loading={loading}
        />
        <StatCard
          title="Total Skills"
          value={totalSkills}
          href="/admin/skills"
          icon={<Layers size={20} />}
          accent="bg-orange-500"
          loading={loading}
        />
      </div>

      {/* ✅ MIDDLE SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers ?? 0}
          href="/admin/users"
          icon={<UserCheck size={20} />}
          accent="bg-emerald-500"
          loading={loading}
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages ?? 0}
          href="/admin/contacts"
          icon={<Mail size={20} />}
          accent="bg-rose-500"
          loading={loading}
        />
      </div>

      {/* ✅ BOTTOM SECTION: Skills Breakdown */}
      <Card className="group hover:shadow-lg transition-shadow duration-200 border border-border/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {loading ? <Skeleton className="h-4 w-28" /> : "Skill Breakdown"}
          </CardTitle>
          <div className="p-2 rounded-md bg-indigo-500 text-white">
            {loading ? <Skeleton className="h-5 w-5 rounded-full" /> : <Code size={20} />}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3 mt-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frontend</span>
                <span className="font-medium">{stats.frontendSkills ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backend</span>
                <span className="font-medium">{stats.backendSkills ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tools</span>
                <span className="font-medium">{stats.toolSkills ?? 0}</span>
              </div>
            </div>
          )}

          {!loading && (
            <div className="mt-4">
              <Link to="/admin/skills">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Skills
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
