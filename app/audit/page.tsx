import AuditForm from '@/components/AuditForm';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Free AI Spend Audit
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Takes 2 minutes. See where you're overpaying.
          </p>
        </div>
        <AuditForm />
      </div>
    </div>
  );
}
