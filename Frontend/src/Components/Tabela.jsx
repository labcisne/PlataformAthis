function Tabela({ dados, firstHeader, secondHeader, getFirstHeader, getSecondHeader, action }){

    return (
        <div>
            <div className="tableScrollContainer">
                <table className="tableContainer">
                <thead>
                    <tr>
                        <th>{firstHeader}</th>
                        <th>{secondHeader}</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.length > 0 ? (
                        dados.map((dado) => (
                            <tr key={dado._id} onClick={action ? action(dado) : undefined}>
                                <td>{getFirstHeader(dado)}</td>
                                <td>{getSecondHeader(dado)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                -
                            </td>
                            <td style={{ textAlign: "center" }}>
                                Nenhum dado encontrado!
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
}

export default Tabela;