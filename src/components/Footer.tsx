import Link from 'next/link'
 
export default function Footer() {
  return (
    <div className="bg-gray-900 text-white py-4">
      <div className='sm:flex sm:justify-between pr-10 lg:pr-14'>
        <div className="ml-4 md:ml-8">
        <div className='flex pt-4'>
          <div className="text-2xl items-center flex font-bold">
        <div className="font-extrabold flex items-center place-self-center w-full text-white bg-amber-600 rounded-full m-1 text-2xl h-8 p-2.5">S</div>
        Sajhedar
      </div> 
        </div>
          <div className='ml-10 mb-2'>
            <p className="text-sm text-teal-200 max-w-xs">
            Split and manage your group travel expenses, hassle-free.
          </p>
          </div>
      </div>
      <div className="flex gap-8 text-sm p-5 pl-15">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-teal-500 mb-1">Product</span>
            <Link href="/" className="hover:text-orange-300 transition-colors">Home</Link>
            <Link href="/feedback" className="hover:text-orange-300 transition-colors">Feedback</Link>
            <Link href="/about-us" className="hover:text-orange-300 transition-colors">About Us</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-teal-500 mb-1">Legal</span>
            <Link href="/"className="hover:text-orange-300 transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-orange-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-xs sm:text-sm text-white">
          &copy; All copyrights reserved Sajhedar {new Date().getFullYear()} | <span>Made in India with ♥️</span>
      </div>
    </div>
  )
}