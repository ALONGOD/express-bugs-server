const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const { txt, minSeverity } = filterBy

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name, value } = target
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [name]: value }))
    }


    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prev => ({ ...prev, pageIdx: prev.pageIdx + diff }))
    }


    // return <div>hii</div>


    return (
        <section className="note-filter flex flex-row">
            <input onChange={handleChange} value={txt} name="txt" type="text" placeholder="Search..." />

            <input min="1" max="5" name="minSeverity" value={minSeverity} onChange={handleChange} type='range'></input>
            <span>{minSeverity}</span>

            <button onClick={() => onGetPage(-1)}>-</button>
            <span>{filterByToEdit.pageIdx + 1}</span>
            <button onClick={() => onGetPage(1)}>+</button>

        </section>
    )

}