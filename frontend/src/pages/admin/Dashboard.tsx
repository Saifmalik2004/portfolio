

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
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  href?: string;
  icon?: React.ReactNode;
  accent?: string;
};

const StatCard = ({ title, value, href, icon, accent }: StatCardProps) => (
  <Card className="group hover:shadow-lg transition-shadow duration-200 border border-border/40">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-md ${accent} text-white`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold">{value}</div>
      {href && (
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats load error", error);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your portfolio statistics.
        </p>
      </div>

      {/* Projects and Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Featured Projects"
          value={stats.featuredProjects ?? 0}
          href="/admin/projects"
          icon={<FolderPlus size={20} />}
          accent="bg-orange-500"
        />
        <StatCard
          title="Total Projects"
          value={stats.totalProjects ?? 0}
          href="/admin/projects"
          icon={<FolderPlus size={20} />}
          accent="bg-blue-500"
        />
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs ?? 0}
          href="/admin/blogs"
          icon={<FileText size={20} />}
          accent="bg-purple-500"
        />
        <StatCard
          title="Total Certificates"
          value={stats.totalCertificates ?? 0}
          href="/admin/certificates"
          icon={<Award size={20} />}
          accent="bg-green-500"
        />
      </div>

      {/* ✅ Grouped Skills Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-shadow duration-200 border border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills Overview
            </CardTitle>
            <div className="p-2 rounded-md bg-indigo-500 text-white">
              <Code size={20} />
            </div>
          </CardHeader>
          <CardContent>
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

            <div className="mt-4">
              <Link to="/admin/skills">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Skills
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <StatCard
          title="Total Contacts"
          value={stats.totalContacts ?? 0}
          href="/admin/contacts"
          icon={<Mail size={20} />}
          accent="bg-red-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          href="/admin/users"
          icon={<Users size={20} />}
          accent="bg-teal-500"
        />
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers ?? 0}
          href="/admin/users"
          icon={<UserCheck size={20} />}
          accent="bg-emerald-500"
        />
      </div>

      {/* Unread Messages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages ?? 0}
          href="/admin/contacts"
          icon={<Mail size={20} />}
          accent="bg-rose-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
