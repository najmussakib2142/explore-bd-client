// import React from "react";
// import './pagination.css'

// const Pagination = ({
//     currentPage,
//     totalPages,
//     onPageChange,
//     itemsPerPage,
//     onItemsPerPageChange,
// }) => {
//     // Generate page numbers
//     const pages = [...Array(totalPages).keys()];

//     return (
//         <div className="pagination text-center my-6">
//             {/* Previous Button */}
//             <button
//                 className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 mr-2 disabled:opacity-50"
//                 disabled={currentPage === 0}
//                 onClick={() => onPageChange(currentPage - 1)}
//             >
//                 Prev
//             </button>

//             {/* Page Numbers */}
//             {pages.map((page) => (
//                 <button
//                     key={page}
//                     className={`px-3 py-1 rounded mr-2 ${currentPage === page
//                             ? "bg-primary text-white"
//                             : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//                         }`}
//                     onClick={() => onPageChange(page)}
//                 >
//                     {page + 1}
//                 </button>
//             ))}

//             {/* Next Button */}
//             <button
//                 className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 ml-2 disabled:opacity-50"
//                 disabled={currentPage === totalPages - 1}
//                 onClick={() => onPageChange(currentPage + 1)}
//             >
//                 Next
//             </button>

//             {/* Items per page dropdown */}
//             <select
//                 className="ml-4 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
//                 value={itemsPerPage}
//                 onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
//             >
//                 <option value="6">6</option>
//                 <option value="12">12</option>
//                 <option value="15">15</option>
//                 <option value="50">50</option>
//             </select>
//         </div>
//     );
// };

// export default Pagination;
