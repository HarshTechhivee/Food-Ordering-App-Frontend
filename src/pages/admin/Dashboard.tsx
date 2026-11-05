import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminDashboard } from "../../store/slices/adminDashboardSlice";
import { socket } from "../../services/socket.js";
import { formatStatus, getStatusPaymentClass } from "../../utils/commonFunction.js";
import type { DashboardOrder, DashboardStats } from "../../services/adminDashboard.api.js";

const formatCount = (value: number | undefined) =>
    new Intl.NumberFormat("en-IN").format(value ?? 0);

const formatCurrency = (value: number | string | undefined) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value ?? 0));

const orderStatuses = [
    { key: "DELIVERED", label: "Delivered", color: "#25A55B" },
    { key: "APPROVED", label: "Approved", color: "#EAB308" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "#249CCB" },
    { key: "PENDING", label: "Pending", color: "#F07818" },
    { key: "CANCELLED", label: "Cancelled", color: "#9B948E" },
    { key: "REJECTED", label: "Rejected", color: "#E34B43" },
] as const;

function OrdersOverview({ stats }: { stats: DashboardStats | null }) {
    const values = orderStatuses.map((status) => ({
        ...status,
        value: stats?.orderStatus[status.key] ?? 0,
    }));
    const statusTotal = values.reduce((total, status) => total + status.value, 0);
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <section className="card admin-dashboard-panel" aria-labelledby="admin-orders-overview-title">
            <div className="card-body">
                <div className="admin-dashboard-panel-heading">
                    <div>
                        <h2 id="admin-orders-overview-title">Orders Overview</h2>
                        <p>Current order status breakdown</p>
                    </div>
                </div>

                <div className="admin-dashboard-overview-content">
                    <div
                        className="admin-dashboard-donut"
                        role="img"
                        aria-label={`Orders overview: ${formatCount(stats?.totalOrders)} total orders`}
                    >
                        <svg viewBox="0 0 160 160" aria-hidden="true">
                            <circle className="admin-dashboard-donut-track" cx="80" cy="80" r={radius} />
                            {statusTotal > 0 && values.map((status) => {
                                if (status.value === 0) {
                                    return null;
                                }
                                const length = (status.value / statusTotal) * circumference;
                                const segment = (
                                    <circle
                                        key={status.key}
                                        cx="80"
                                        cy="80"
                                        r={radius}
                                        fill="none"
                                        stroke={status.color}
                                        strokeWidth="17"
                                        strokeDasharray={`${length} ${circumference - length}`}
                                        strokeDashoffset={-offset}
                                        transform="rotate(-90 80 80)"
                                    />
                                );
                                offset += length;
                                return segment;
                            })}
                        </svg>
                        <div className="admin-dashboard-donut-center">
                            <strong>{formatCount(stats?.totalOrders)}</strong>
                            <span>Orders</span>
                        </div>
                    </div>

                    <ul className="admin-dashboard-legend">
                        {values.map((status) => (
                            <li key={status.key}>
                                <span className="admin-dashboard-legend-label">
                                    <i style={{ backgroundColor: status.color }} aria-hidden="true" />
                                    {status.label}
                                </span>
                                <strong>{formatCount(status.value)}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function RevenueTrend({ orders }: { orders: DashboardOrder[] }) {
    const dailyPaidOrders = new Map<string, { date: Date; total: number }>();
    orders
        .filter((order) => order.paymentStatus.toUpperCase() === "PAID")
        .forEach((order) => {
            const date = new Date(order.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const entry = dailyPaidOrders.get(key);
            const total = Number(order.totalAmount);
            if (entry) {
                entry.total += total;
            } else {
                dailyPaidOrders.set(key, { date, total });
            }
        });

    const points = Array.from(dailyPaidOrders.values()).sort(
        (left, right) => left.date.getTime() - right.date.getTime()
    );
    const chart = { width: 540, height: 224, left: 70, right: 16, top: 14, bottom: 42 };
    const plotWidth = chart.width - chart.left - chart.right;
    const plotHeight = chart.height - chart.top - chart.bottom;
    const maxValue = Math.max(...points.map((point) => point.total), 0);
    const yMaximum = maxValue > 0 ? Math.ceil(maxValue / 100) * 100 : 100;
    const chartPoints = points.map((point, index) => ({
        ...point,
        x: chart.left + (points.length <= 1 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth),
        y: chart.top + plotHeight - (point.total / yMaximum) * plotHeight,
    }));
    const linePath = chartPoints
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");
    const areaPath = chartPoints.length > 0
        ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chart.top + plotHeight} L ${chartPoints[0].x} ${chart.top + plotHeight} Z`
        : "";
    const yTicks = [0, yMaximum / 2, yMaximum];
    const dateLabel = (date: Date) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);

    return (
        <section className="card admin-dashboard-panel" aria-labelledby="admin-revenue-trend-title">
            <div className="card-body">
                <div className="admin-dashboard-panel-heading">
                    <div>
                        <h2 id="admin-revenue-trend-title">Revenue Trend</h2>
                        <p>Daily totals from recent paid orders</p>
                    </div>
                </div>

                {chartPoints.length === 0 ? (
                    <div className="admin-dashboard-chart-empty">
                        Revenue trend is unavailable until recent paid orders are recorded.
                    </div>
                ) : (
                    <div className="admin-dashboard-chart-wrap">
                        <svg
                            className="admin-dashboard-revenue-chart"
                            viewBox={`0 0 ${chart.width} ${chart.height}`}
                            role="img"
                            aria-label="Daily totals from recent paid orders"
                        >
                            <defs>
                                <linearGradient id="adminRevenueArea" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#EA7418" stopOpacity="0.22" />
                                    <stop offset="100%" stopColor="#EA7418" stopOpacity="0.015" />
                                </linearGradient>
                            </defs>
                            {yTicks.map((tick) => {
                                const y = chart.top + plotHeight - (tick / yMaximum) * plotHeight;
                                return (
                                    <g key={tick}>
                                        <line
                                            x1={chart.left}
                                            x2={chart.width - chart.right}
                                            y1={y}
                                            y2={y}
                                            className="admin-dashboard-chart-gridline"
                                        />
                                        <text x={chart.left - 10} y={y + 4} textAnchor="end" className="admin-dashboard-chart-axis-label">
                                            {formatCurrency(tick)}
                                        </text>
                                    </g>
                                );
                            })}
                            <path d={areaPath} fill="url(#adminRevenueArea)" />
                            {chartPoints.length > 1 && <path d={linePath} className="admin-dashboard-revenue-line" />}
                            {chartPoints.map((point) => (
                                <g key={point.date.toISOString()}>
                                    <circle cx={point.x} cy={point.y} r="4.5" className="admin-dashboard-revenue-point" />
                                    <text
                                        x={point.x}
                                        y={chart.height - 13}
                                        textAnchor="middle"
                                        className="admin-dashboard-chart-axis-label"
                                    >
                                        {dateLabel(point.date)}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                )}
            </div>
        </section>
    );
}

function AdminDashboard() {
    const dispatch = useAppDispatch();
    const { stats, loading, error } = useAppSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchAdminDashboard());
    }, [dispatch]);

    useEffect(() => {
        const handleOrderChange = () => dispatch(fetchAdminDashboard());
        socket.on("order:new", handleOrderChange);
        socket.on("order:statusUpdated", handleOrderChange);
        socket.on("order:cancelled", handleOrderChange);

        return () => {
            socket.off("order:new", handleOrderChange);
            socket.off("order:statusUpdated", handleOrderChange);
            socket.off("order:cancelled", handleOrderChange);
        };
    }, [dispatch]);

    const kpis = [
        {
            label: "Total Orders",
            value: loading ? "..." : formatCount(stats?.totalOrders),
            icon: "bi-receipt",
            tone: "orange",
        },
        {
            label: "Total Revenue",
            value: loading ? "..." : formatCurrency(stats?.revenue),
            icon: "bi-currency-rupee",
            tone: "green",
        },
        {
            label: "Pending Orders",
            value: loading ? "..." : formatCount(stats?.pendingOrders),
            icon: "bi-clock-history",
            tone: "blue",
        },
        {
            label: "Menu Items",
            value: loading ? "..." : formatCount(stats?.menuItems),
            icon: "bi-menu-button-wide",
            tone: "purple",
        },
    ];

    return (
        <div className="admin-page admin-dashboard-page">
            <header className="admin-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your restaurant activity.</p>
                </div>
            </header>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2" aria-hidden="true" />
                    Unable to load dashboard: {error}
                </div>
            )}

            <section className="admin-dashboard-kpis" aria-label="Restaurant metrics">
                {kpis.map((kpi) => (
                    <article className="card admin-dashboard-kpi" key={kpi.label}>
                        <div className="card-body">
                            <div>
                                <p>{kpi.label}</p>
                                <strong>{kpi.value}</strong>
                            </div>
                            <span className={`admin-dashboard-kpi-icon is-${kpi.tone}`} aria-hidden="true">
                                <i className={`bi ${kpi.icon}`} />
                            </span>
                        </div>
                    </article>
                ))}
            </section>

            <section className="admin-dashboard-analytics" aria-label="Order and revenue analytics">
                <OrdersOverview stats={stats} />
                <RevenueTrend orders={stats?.recentOrders ?? []} />
            </section>

            <section className="card admin-dashboard-recent" aria-labelledby="admin-recent-orders-title">
                <div className="card-body">
                    <div className="admin-dashboard-recent-heading">
                        <div>
                            <h2 id="admin-recent-orders-title">Recent Orders</h2>
                            <p>Latest orders placed by customers</p>
                        </div>
                        <Link to="/admin/orders" className="admin-dashboard-view-all">
                            View All Orders
                            <i className="bi bi-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="admin-dashboard-recent-table-wrap">
                        <table className="table admin-dashboard-recent-table">
                            <caption className="visually-hidden">Recent customer orders</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Order #</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Items</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <th scope="row">#{order.id}</th>
                                        <td>{order.user.name}</td>
                                        <td>{order.itemCount ?? "—"}</td>
                                        <td className="text-nowrap">{formatCurrency(order.totalAmount)}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${getStatusPaymentClass(order.status)}`}>
                                                {formatStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="text-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && stats?.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="admin-dashboard-no-orders">No orders yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;
