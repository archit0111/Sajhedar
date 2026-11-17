import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SajhedarLoader from "@/components/SajhedarLoader";
import { ArrowLeft } from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface Expense {
    _id?: string;
    tripId: string;
    payer: string;
    amount: number;
    description: string;
    date: string | Date;
    splitType?: 'equal' | 'custom' | 'percentage';
    splits?: {
        memberId: string;
        amount: number;
    }[];
}


export default function TripAnalytics() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Expense[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [router, status]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/trips/${id}/analytics`);
                if (!res.ok) {
                    throw new Error('Failed to fetch trips');
                }
                const data = await res.json();
                setData(data);

            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [session, id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-600">
            <SajhedarLoader />
        </div>;
    }

    const categorizeExpense = (description = '') => {
        const text = description.toLowerCase();

        if (text.includes('food') || text.includes('lunch') || text.includes('dinner') || text.includes('breakfast') || text.includes('cafe') || text.includes('restaurant') || text.includes('snack') || text.includes('tea')) {
            return 'Food & Drinks';
        }
        if (text.includes('taxi') || text.includes('uber') || text.includes('auto') || text.includes('train') || text.includes('flight') || text.includes('bus') || text.includes('metro') || text.includes('petrol') || text.includes('fuel')) {
            return 'Transport';
        }
        if (text.includes('hotel') || text.includes('stay') || text.includes('room') || text.includes('hostel') || text.includes('resort') || text.includes('bnb')) {
            return 'Accommodation';
        }
        if (text.includes('ticket') || text.includes('movie') || text.includes('party') || text.includes('club') || text.includes('entry') || text.includes('tour')) {
            return 'Entertainment & Activities';
        }
        if (text.includes('shopping') || text.includes('clothes') || text.includes('gift') || text.includes('mall')) {
            return 'Shopping';
        }

        return 'General / Other';
    };

    //calculating required fields

    const totalExpenditure = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalTransaction = data.length;
    const categoryMap: Record<string, number> = {};
    data.forEach((exp) => {
        const detectedCategory = categorizeExpense(exp.description);
        categoryMap[detectedCategory] = (categoryMap[detectedCategory] || 0) + exp.amount;
    });

    const categoryData = Object.keys(categoryMap).map((cat) => ({
        name: cat,
        value: categoryMap[cat]
    }));

    const topCategory = categoryData.length > 0
        ? categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
        : 'N/A';

    const memberMap: Record<string, number> = {};
    data.forEach((exp) => {
        const payer = exp.payer || 'Unknown';
        memberMap[payer] = (memberMap[payer] || 0) + exp.amount;
    });

    const memberData = Object.keys(memberMap).map((member) => ({
        name: member,
        paid: memberMap[member],
    }));

    const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    return (
        <div className="mx-auto px-4 py-8">
            <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 mb-10">
                <div className="mx-auto flex items-center justify-between">
                    <div onClick={() => router.back()}
                        className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors group text-sm font-medium cursor-pointer">
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Dashboard</span>
                    </div>
                </div>
            </header>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">Trip Expense Analytics</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Total Expenditure</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">₹{totalExpenditure.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{totalTransaction}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Top Expense Category</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{topCategory}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending by Category</h3>
                    <div className="h-64 flex items-center justify-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400 text-sm">No expenses logged yet.</p>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Member Contributions</h3>
                    <div className="h-64 flex items-center justify-center">
                        {memberData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={memberData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="paid" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400 text-sm">No contributions logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}