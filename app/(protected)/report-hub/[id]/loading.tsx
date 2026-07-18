export default function ReportDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-4xl p-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded mt-4 animate-pulse" />
      </div>
    </div>
  );
}
