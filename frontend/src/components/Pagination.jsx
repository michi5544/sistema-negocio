export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  for (let i = left; i <= right; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        {left > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">1</button>
            {left > 2 && <span className="px-2 py-1 text-sm text-gray-400">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-sm border rounded ${
              p === currentPage
                ? "bg-[#005187] text-white border-[#005187]"
                : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        {right < totalPages && (
          <>
            {right < totalPages - 1 && <span className="px-2 py-1 text-sm text-gray-400">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
