import { useState } from "react";

function Tabela({ dados, firstHeader, secondHeader, getFirstHeader, getSecondHeader, action }){

    const [paginaAtual, setPaginaAtual] = useState(1);
    const linhasPorPagina = 5;

    const idxUltimaLinha = paginaAtual * linhasPorPagina;
    const idxPrimeiraLinha = idxUltimaLinha - linhasPorPagina;
    const dadosAtuais = dados.slice(idxPrimeiraLinha, idxUltimaLinha);

    const paginasTotais = Math.ceil(dados.length / linhasPorPagina);

    const handleProximaPagina = () => {
        if (paginaAtual < paginasTotais) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const handlePaginaAnterior = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div>
            <div className="forwardBackArrows">
                <button className="arrow" onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>
                    ⬅
                </button>
                <button className="arrow" onClick={handleProximaPagina} disabled={paginaAtual === paginasTotais}>
                    ➡
                </button>
            </div>
            <table className="tableContainer">
                <thead>
                    <tr>
                        <th>{firstHeader}</th>
                        <th>{secondHeader}</th>
                    </tr>
                </thead>
                <tbody>
                    {dadosAtuais.length > 0 ? (
                        dadosAtuais.map((dado) => (
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
            <div style={{textAlign: "right"}}>{paginaAtual + "/" + paginasTotais}</div>
        </div>
    );
}

export default Tabela;