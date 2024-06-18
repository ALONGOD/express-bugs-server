export function BugPreview({ bug }) {
    return (
        <article>
            <h4>{bug.title}</h4>
            <h1>🐛</h1>
            <p>Severity: <span>{bug.severity}</span></p>
            <p>Description: <span>{bug.description}</span></p>
            {bug.labels && bug.labels.length > 0 && (
                <div>
                    <p>Labels:</p>
                    <ul>
                        {bug.labels.map((label, index) => (
                            <li key={index}>{label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}