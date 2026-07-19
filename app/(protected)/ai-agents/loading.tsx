export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
        style={{ borderColor: "#1c519c", borderTopColor: "transparent" }}
      />
      <p className="text-sm text-gray-600">Loading AI agents...</p>
    </div>
  );
}
