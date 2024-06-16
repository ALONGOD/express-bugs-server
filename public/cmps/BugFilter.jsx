const { useState, useEffect } = React

export function NoteFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name, value } = target
        setFilterByToEdit(prevFilterBy => ({ ...prevFilterBy, [name]: value }))
        console.log(filterByToEdit)
    }

    const { search, type } = filterBy;

    // return <div>hii</div>
    return (
        <section className="note-filter flex flex-row">
            <input onChange={handleChange} value={search} name="search" type="text" placeholder="Search..." />
            <img src="assets/img/search-icon.png" />

            <select className="note-type-filter" name="type" value={type} onChange={handleChange}>
                <option value="">All Types</option>
                <option value="NoteTxt">Text</option>
                <option value="NoteImg">Image</option>
                <option value="NoteTodos">Todos</option>
                <option value="NoteVideo">Video</option>
            </select>

        </section>
    )

}