export default function Loading() {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-72 border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
