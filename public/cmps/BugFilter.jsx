const { useState, useEffect } = React;

export function BugFilter({ filterBy, onSetFilterBy }) {
    const { txt, minSeverity, sortBy, sortDir } = filterBy;

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });

    useEffect(() => {
        onSetFilterBy(filterByToEdit);
    }, [filterByToEdit]);

    function handleChange({ target }) {
        const { name, value } = target;
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [name]: value }));
    }

    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return;
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }));
    }

    function toggleSortOrder() {
        const newSortDir = sortDir === 'asc' ? 'desc' : 'asc';
        setFilterByToEdit(prev => ({ ...prev, sortDir: newSortDir }));
    }

    function handleSortChange(event) {
        const newSortBy = event.target.value;
        setFilterByToEdit(prev => ({ ...prev, sortBy: newSortBy }));
    }

    return (
        <section className="note-filter flex flex-row">
            <input onChange={handleChange} value={txt} name="txt" type="text" placeholder="Search..." />

            <input min="1" max="5" name="minSeverity" value={minSeverity} onChange={handleChange} type='range'></input>
            <span>Minimum severity:{minSeverity}</span>

            <button onClick={() => onGetPage(-1)}>-</button>
            <span>Page number:{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => onGetPage(1)}>+</button>

            <div>
                Sort by:
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="createdAt">Created At</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                </select>

                <label>
                    <input
                        type='checkbox'
                        checked={sortDir === 'desc'}
                        onChange={toggleSortOrder}
                    />
                </label>
            </div>
        </section>
    );
}
