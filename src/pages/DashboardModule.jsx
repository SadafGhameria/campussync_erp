import "./DashboardModule.css";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { moduleDetails } from "../data/dashboardData";
import studentsImage from "../assets/students.jpg";
import campusImage from "../assets/hero-campus.jpg";
import dashboardImage from "../assets/dashboard-preview.jpg";
import libraryImage from "../assets/libraby.jpg";
import adminstudentsImage from "../assets/adminstudents.png";
import API from "../api/axios";

const moduleImages = {
  students: studentsImage,
  campus: campusImage,
  dashboard: dashboardImage,
  library: libraryImage,
  adminstudents: adminstudentsImage,
};

const fallbackDetail = {
  title: "Workspace",
  description: "Manage records, review recent updates, and keep this workflow moving.",
  heroImage: "dashboard",
  features: ["Overview", "Records", "Approvals", "Reports", "Settings"],
  stats: [
    { label: "Total Records", value: "248", trend: "Live workspace" },
    { label: "Pending Review", value: "18", trend: "Needs action" },
    { label: "Updated Today", value: "32", trend: "Fresh updates" },
  ],
  chart: [
    { name: "Mon", value: 42 },
    { name: "Tue", value: 58 },
    { name: "Wed", value: 51 },
    { name: "Thu", value: 67 },
    { name: "Fri", value: 63 },
  ],
  columns: ["Item", "Owner", "Updated", "Status"],
  rows: [
    ["Academic workflow", "Campus office", "Today", "Active"],
    ["Review queue", "Department", "Yesterday", "In progress"],
    ["Monthly summary", "ERP system", "Jun 28", "Ready"],
  ],
};

function DashboardModule() {
  const { config, role } = useOutletContext();
  const { module } = useParams();
  const [activeFeature, setActiveFeature] = useState(0);
  const [courses, setCourses] = useState(null);
  const [courseError, setCourseError] = useState("");

  const detail = useMemo(() => {
    const navItem = config.nav.find((item) => item.path?.endsWith(`/${module}`));
    const baseDetail = moduleDetails[module] || fallbackDetail;

    return {
      ...baseDetail,
      title: navItem?.title || baseDetail.title,
    };
  }, [config.nav, module]);

  useEffect(() => {
    if (module !== "courses") return;
    let active = true;
    setCourseError("");
    API.get("/courses")
      .then((response) => {
        if (active) setCourses(response.data.data);
      })
      .catch((requestError) => {
        if (active) setCourseError(requestError.response?.data?.message || "Could not load course records.");
      });
    return () => { active = false; };
  }, [module]);

  const displayDetail = useMemo(() => {
    if (module !== "courses" || !courses) return detail;
    const departments = courses.reduce((result, course) => {
      result[course.department] = (result[course.department] || 0) + 1;
      return result;
    }, {});
    return {
      ...detail,
      stats: [
        { label: "Active Courses", value: String(courses.filter((course) => course.isActive).length), trend: "Live database" },
        { label: "Departments", value: String(Object.keys(departments).length), trend: "With active courses" },
        { label: "Total Credits", value: String(courses.reduce((total, course) => total + (course.credits || 0), 0)), trend: "Configured courses" },
      ],
      chart: Object.entries(departments).map(([name, value]) => ({ name, value })),
      columns: ["Code", "Course", "Department", "Semester", "Status"],
      rows: courses.map((course) => [course.courseCode, course.courseName, course.department, `Semester ${course.semester}`, course.isActive ? "Active" : "Inactive"]),
    };
  }, [courses, detail, module]);

  const currentFeature = displayDetail.features?.[activeFeature] || displayDetail.title;
  const heroImage = moduleImages[displayDetail.heroImage] || dashboardImage;
  const isAdminModule = role === "admin";

  return (
    <div className="module-page">
      <div className="module-hero">
        <img src={heroImage} alt={`${displayDetail.title} workspace`} />
        <div className="module-hero-overlay">
          <div>
            <p className="eyebrow">{config.roleLabel} Module</p>
            <h1>{displayDetail.title}</h1>
            <p>{displayDetail.description}</p>
          </div>

          {module !== "courses" && <button className="primary-action"><Plus size={18} />New {displayDetail.title}</button>}
        </div>
      </div>

      {isAdminModule && (
        <nav className="module-feature-nav" aria-label={`${displayDetail.title} features`}>
          {displayDetail.features.map((feature, index) => (
            <button
              key={feature}
              className={activeFeature === index ? "active" : ""}
              onClick={() => setActiveFeature(index)}
            >
              {feature}
            </button>
          ))}
        </nav>
      )}

      {courseError && <p className="module-api-error">{courseError}</p>}

      <div className="module-summary">
        {displayDetail.stats.map((stat) => (
          <div key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="module-dashboard-grid">
        <section className="feature-workspace">
          <div className="feature-heading">
            <div>
              <span className="feature-pill">{currentFeature}</span>
              <h2>{currentFeature}</h2>
              <p>
                Use this area to manage {currentFeature.toLowerCase()} inside the {displayDetail.title.toLowerCase()} module.
              </p>
            </div>
            <ArrowUpRight size={22} />
          </div>

          <div className="feature-actions">
            <button>
              <CheckCircle2 size={17} />
              Review
            </button>
            <button>
              <SlidersHorizontal size={17} />
              Filter
            </button>
            <button>
              <Search size={17} />
              Search
            </button>
          </div>

          <div className="module-table-wrap">
            <table className="module-table">
              <thead>
                <tr>
                  {displayDetail.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayDetail.rows.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`}>
                        {index === row.length - 1 ? <span className="status-pill">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="module-insights">
          <div className="chart-card">
            <div>
              <h3>{displayDetail.title} Analytics</h3>
              <p>Snapshot for the selected module</p>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              {displayDetail.chart.length > 4 ? (
                <AreaChart data={displayDetail.chart}>
                  <defs>
                    <linearGradient id="moduleChartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" fill="url(#moduleChartFill)" strokeWidth={3} />
                </AreaChart>
              ) : (
                <BarChart data={displayDetail.chart}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="next-steps-card">
            <h3>Module Flow</h3>
            {displayDetail.features.slice(0, 5).map((feature, index) => (
              <button
                key={feature}
                className={activeFeature === index ? "active" : ""}
                onClick={() => setActiveFeature(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {feature}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DashboardModule;
