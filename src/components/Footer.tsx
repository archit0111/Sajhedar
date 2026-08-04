import Link from 'next/link'
 
export default function Footer() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <div className="text-2xl text-amber-400 font-bold mb-2">Sajhedar</div>
          <p className="text-sm text-teal-200 max-w-xs">
            Split and manage your group travel expenses, hassle-free.
          </p>
        </div>
 
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-teal-500 mb-1">Product</span>
            <Link href="/home" className="hover:text-orange-300 transition-colors">Home</Link>
            <Link href="/cart" className="hover:text-orange-300 transition-colors">Trips</Link>
            <Link href="/wishlist" className="hover:text-orange-300 transition-colors">Partners</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-teal-500 mb-1">Legal</span>
            <Link href="/privacy" className="hover:text-orange-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
 
      <div className="py-4 text-center text-xs sm:text-sm text-teal-500">
        All copyrights reserved &nbsp;|&nbsp; Made in India with ♥️
      </div>
    </div>
  )
}



// "import { Instagram, Twitter, Github } from \"lucide-react\";

// export default function Footer() {
//   return (
//     <footer
//       data-testid=\"footer\"
//       className=\"relative bg-[#212824] text-[#F4F1EB] pt-20 pb-8 px-6 lg:px-10 overflow-hidden\"
//     >
//       <div className=\"max-w-7xl mx-auto\">
//         <div className=\"grid md:grid-cols-12 gap-10\">
//           <div className=\"md:col-span-5\">
//             <div className=\"flex items-center gap-2\">
//               <span className=\"inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#E06D53] text-white font-display font-black\">
//                 S
//               </span>
//               <span className=\"font-display text-2xl font-bold tracking-tight\">Sajhedar</span>
//             </div>
//             <p className=\"mt-5 text-white/60 max-w-sm leading-relaxed\">
//               The gentlest way to split group expenses. Built for people who'd rather remember the sunset than the receipt.
//             </p>
//             <div className=\"mt-6 flex items-center gap-3\">
//               {[Twitter, Instagram, Github].map((I, i) => (
//                 <a
//                   key={i}
//                   href=\"#\"
//                   data-testid={`footer-social-${i}`}
//                   className=\"h-10 w-10 inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors\"
//                 >
//                   <I size={16} />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {[
//             {
//               title: \"Product\",
//               links: [\"How it works\", \"Features\", \"Pricing\", \"Roadmap\"],
//             },
//             { title: \"Company\", links: [\"About\", \"Blog\", \"Careers\", \"Press\"] },
//             { title: \"Support\", links: [\"Help center\", \"Contact\", \"Privacy\", \"Terms\"] },
//           ].map((col, i) => (
//             <div key={col.title} className=\"md:col-span-2\" data-testid={`footer-col-${i}`}>
//               <div className=\"text-[11px] font-bold uppercase tracking-[0.22em] text-[#E06D53]\">
//                 {col.title}
//               </div>
//               <ul className=\"mt-5 space-y-3\">
//                 {col.links.map((l) => (
//                   <li key={l}>
//                     <a
//                       href=\"#\"
//                       className=\"text-sm text-white/70 hover:text-white transition-colors\"
//                     >
//                       {l}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Massive wordmark */}
//         <div className=\"mt-16 pt-10 border-t border-white/10\">
//           <div
//             aria-hidden
//             className=\"font-display font-black leading-none tracking-tighter text-white/[0.06] select-none\"
//             style={{ fontSize: \"clamp(4rem, 18vw, 18rem)\" }}
//           >
//             sajhedar.
//           </div>
//         </div>

//         <div className=\"mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-xs\">
//           <div>© {new Date().getFullYear()} Sajhedar. All copyrights reserved.</div>
//           <div className=\"flex items-center gap-2\">
//             Made in India with <span className=\"text-[#E06D53]\">♥</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }