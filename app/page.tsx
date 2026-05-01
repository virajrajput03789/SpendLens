import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Is your team paying <span className="text-indigo-600">too much</span> for AI tools?
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
          Get a free 2-minute audit of your Cursor, Claude, Copilot, and ChatGPT spend — see exactly what to cut.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <Link href="/audit">
            <Button size="lg" className="px-8 py-6 text-lg rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
              Audit my AI stack — it's free
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 italic">"Found $840/month we didn't know we were wasting."</p>
            <p className="mt-4 font-semibold text-sm text-gray-900">— Head of Engineering, Series B SaaS</p>
            <p className="text-xs text-gray-500">(Mocked)</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 italic">"Switched 3 tools based on this. Saved $400 in the first month."</p>
            <p className="mt-4 font-semibold text-sm text-gray-900">— Solo founder, bootstrapped</p>
            <p className="text-xs text-gray-500">(Mocked)</p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-center items-center text-center">
            <p className="text-3xl font-black text-indigo-700">1,200+</p>
            <p className="text-indigo-900 font-medium">audits completed</p>
            <p className="text-xs text-indigo-400 mt-2">(Mocked)</p>
          </div>
        </div>

        <div className="mt-32 max-w-3xl mx-auto text-left mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Is this actually free?</h3>
              <p className="mt-2 text-gray-600">Yes. No credit card. No catch. We show you your audit immediately. We only ask for your email if you want to save the report.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How do you make money?</h3>
              <p className="mt-2 text-gray-600">If your audit shows significant savings, we'll introduce you to Credex — a marketplace for discounted AI credits. We earn a referral if you buy. If you're already spending optimally, we'll tell you that too.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How is the pricing data kept current?</h3>
              <p className="mt-2 text-gray-600">We verify all plan pricing each week from official vendor pricing pages. Every number links to a source URL.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}