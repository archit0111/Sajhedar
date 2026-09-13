import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { ArrowRight, DollarSign, ShieldCheck, Users, Zap} from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home(){

  const router = useRouter();

  const features = [
    {
      icon: DollarSign,
      title: "Easy Expense Splitting",
      description: "Split group bills effortlessly without messy spreadsheets or manual math.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      description: "Your financial data and trip logs are protected perfectly.",
    },
    {
      icon: Zap,
      title: "Settle in One Tap",
      description: "Clear balances quickly using direct integrated payment requests.",
    },
    {
      icon: Users,
      title: "Organized Group Trips",
      description: "Keep track of multiple itineraries, member balances, and shared receipts.",
    },
  ];

  return(
    <>
    <div className="h-fit bg-slate-50">
      {/*Header Section */}
      <header className="border-b-1 border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm">
    <div className="px-10 md:px-15 py-5">
      <Nav/>
    </div>
    </header>

    {/*Welcome Section*/}
    <div className="h-auto w-full text-center mt-4 pt-20">
      <h1 className="sm:text-4xl lg:text-5xl  text-3xl font-bold">Welcome to <span className="text-teal-800">Sajhedar</span></h1>
      <p className="text-teal-900 mt-6 sm:text-lg">✨ Split your trip expances without headache</p>
      <div className="rounded-2xl justify-self-center mt-3 bg-amber-500 p-1 w-[20%] font-bold text-white"></div>
    </div>
    <div>
      <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="flex hover:cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all focus:ring-2 focus:ring-emerald-600/20"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <Link href={"/login"}
            className="rounded-xl border border-slate-300 px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-200 transition-all">
              Sign In
            </Link>
          </div>
    </div>
    {/*Picture Section*/}
    <div className="justify-center flex">
      <img src="heroSectionPic.png" alt="hero_sec_pic" />
    </div>
    <div className="p-4 py-6 justify-self-center lg:max-w-[70%] m-4 border border-slate-200 rounded-xl text-center mb-5 items-center">
      <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Split your trip expenses easily, keep track of shared balances, and settle up with your group in seconds.
      </p>
    </div>
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="rounded-2xl bg-amber-500 p-1 w-[20%] font-bold text-white"></div>
      </div>
    </div>
    <div className="mt-12">
      <div className="flex justify-center pt-4">
        <button
              onClick={() => router.push("/signup")}
              className="flex hover:cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all focus:ring-2 focus:ring-emerald-600/20"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
      </div>
    </div>
    {/*feature section*/}
    <div className="m-4 mt-15 h-fit p-4">
      <div className="justify-self-center mb-20">
        <p className="text-2xl sm:text-3xl text-slate-800 font-bold">
          Everything you need for group expanses
        </p>
        <p className="flex justify-center mt-1 text-slate-600">
          Built to handle trip budgets cleanly and transparently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature,i)=>(
          <div key={i} className="p-6 rounded-2xl bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <feature.icon className=""/>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
    {/*footer section */}
    <div className="mt-25">
      <Footer/>
    </div>
    </div>
    
    </>
  )
}