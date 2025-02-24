function BotoesSelecionaveis( { arrayDeOpcoes, selecionado, setSelecionado } ){

    const handleClick = (valorBotao) => {
        setSelecionado((prev) => (prev ===  valorBotao ? "" : valorBotao))
    }

    return (
        <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
            {arrayDeOpcoes.map((opcao, idx) => (
                <button
                    type="button"
                    key={idx}
                    onClick={() => {handleClick(opcao)}}
                    className={selecionado === opcao ? "botaoSelecionado" : "botaoNaoSelecionado"}
                >
                    {opcao}
                </button>
            ))}
        </div>
    )
}

export default BotoesSelecionaveis;