import React from "react";

const Pagination = ({ currentPage, totalPage, onPageChange }) => {
    const pages = [...Array(totalPage).keys()].map(num => num + 1);
    return (
        <nav>
            <ul className="pagination justify-content-end">
                <li className={`page-item ${currentPage == 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                </li>
                {
                    pages.map(page => (
                        <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
                        </li>
                    ))}
                <li className={`page-item ${currentPage == totalPage ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPage} >Next</button>
                </li>
            </ul>
        </nav>
    )

}

export default Pagination;