interface Table{
    name: string
}

export default function Table({name}: Table) {
    return(
        <div>
            <p>{name}</p>
        </div>
    );
}