import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SajhedarLoader from "@/components/SajhedarLoader";
import Nav from "@/components/Nav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function TripAnalytics() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const { data: session, status } = useSession();

    // useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         router.push('/');
    //     }
    // }, [router, status]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`/api/trips/${id}/analytics`);
    //             if (!res.ok) {
    //                 throw new Error('Failed to fetch trips');
    //             }
    //             const data = await res.json();
    //             setData(data);

    //         } catch (e) {
    //             console.log(e);
    //         } finally {
    //             setLoading(false);
    //         }
    //         fetchData();
    //     }
    // }, [session, id]);

    // if (loading) {
    //     return <div className="min-h-screen flex items-center justify-center text-slate-600">
    //         <SajhedarLoader />
    //     </div>;
    // }

    return (
        <div className="mx-auto px-4 py-8">
            <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 mb-10">
        <div className="mx-auto flex items-center justify-between">
          <div onClick={()=>router.back()}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors group text-sm font-medium">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </div>
        </div>
      </header>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">Trip Expense Analytics</h1>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Total Expenditure</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Total Transactions</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1"></p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">Top Expense Category</p>
                    <p className="text-xl font-bold text-slate-800 mt-1"></p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Breakdown Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending by Category</h3>
                    <div className="h-64 flex items-center justify-center">
                        {/* You can map your category data into Recharts PieChart here */}
                        <p className="text-slate-400 text-sm">Category chart placeholder</p>
                    </div>
                </div>

                {/* Member Contribution Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Member Contributions</h3>
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-slate-400 text-sm">Member contributions chart placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}