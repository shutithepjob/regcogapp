export const Spinner = () => (
    <div className="flex flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-sm text-gray-500 aniamte-pulse">กำลังจัดการข้อมูล...</p>
    </div>
);