import React, { useState } from 'react';
import './FormularioContato.css'; 

function FormularioContato() { 
    
    // 1. Gerenciamento do Estado das Respostas (Tipado como string)
    const [respostaUm, setRespostaUm] = useState<string>('');
    const [respostaDois, setRespostaDois] = useState<string>('');
    const [respostaTres, setRespostaTres] = useState<string>('');
    const [respostaQuatro, setRespostaQuatro] = useState<string>('');
    const [respostaQuinto, setrespostaQuinto] = useState<string>('');
    
    // 2. Gerenciamento do Estado da Interface (Tipado como string)
    const [statusEnvio, setStatusEnvio] = useState<string>(''); // 'enviando', 'sucesso', 'erro'
    const [mensagem, setMensagem] = useState<string>('');

    
    // Aponta para o seu Controller (Formulario) e Ação (enviar-email)
    const API_ENDPOINT: string = 'https://api-controle-atividade-production.up.railway.app/api/Formulario/enviar-email'; 

    // Tipagem explícita do evento para TypeScript
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (statusEnvio === 'enviando') return;

        setStatusEnvio('enviando');
        setMensagem('Enviando suas respostas...');

        // 3. Montar o Objeto de Dados
        // As chaves JSON devem ser IGUAIS às definidas na anotação [JsonPropertyName] do C#
        const dados = {
            respostaPerguntaUm: respostaUm, 
            respostaPerguntaDois: respostaDois,
            respostaPerguntaTres: respostaTres,
            respostaPerguntaQuatro: respostaQuatro,
            respostaPerguntaQuinto: respostaQuinto,
        };

        try {
            const resposta = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            if (resposta.ok) {
                // 4. Sucesso no Envio
                setStatusEnvio('sucesso');
                setMensagem('Sucesso! Seu e-mail foi enviado.');
                
                // Limpar o formulário
                setRespostaUm('');
                setRespostaDois('');
                setRespostaTres('');
                setRespostaQuatro('');
                setrespostaQuinto('');

            } else {
                const erroData = await resposta.json();
                setStatusEnvio('erro');
                
                const erroMensagem = erroData.Mensagem || (erroData.errors ? JSON.stringify(erroData.errors) : 'Erro desconhecido no servidor.');
                setMensagem(`Falha: ${erroMensagem}`); 
            }
        } catch (erro) {
            setStatusEnvio('erro');
            setMensagem('Erro de conexão. Verifique se a API C# está rodando e se o CORS está configurado.');
            console.error('Erro de conexão:', erro);
        }
    };

    return (
        <div className="formulario-container">
            <h2>Controle de Atividades</h2>
            
            <form onSubmit={handleSubmit}>
                
                {/* Pergunta 1: Requerida */}
                <div className="campo">
                    <label htmlFor="pergunta1">Digite seu nome:</label>
                    <input
                        type="text"
                        id="pergunta1"
                        value={respostaUm}
                        onChange={(e) => setRespostaUm(e.target.value)}
                        required
                    />
                </div>
                
                {/* Pergunta 2: Requerida */}
                <div className="campo">
                    <label htmlFor="pergunta2">Como foi o dia de hoje?</label>
                    <textarea
                        id="pergunta2"
                        value={respostaDois}
                        onChange={(e) => setRespostaDois(e.target.value)}
                        required
                    />
                </div>
                
                {/* Pergunta 3: Opcional */}
                <div className="campo">
                    <label className='textPergunta' htmlFor="pergunta3">Houve alguma dificuldade?</label>
                    <textarea
                        id="pergunta3"
                        value={respostaTres}
                        onChange={(e) => setRespostaTres(e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="pergunta3">Como será o dia de amanhã?</label>
                    <textarea
                        id="pergunta4"
                        value={respostaQuatro}
                        onChange={(e) => setRespostaQuatro(e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="campo">
                    <label htmlFor="pergunta3">Link da task</label>
                    <input
                        type="text"
                        id="pergunta5"
                        value={respostaQuinto}
                        onChange={(e) => setrespostaQuinto(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={statusEnvio === 'enviando'}>
                    {statusEnvio === 'enviando' ? 'Enviando...' : 'Enviar Respostas'}
                </button>
            </form>

            {/* Exibe o feedback do envio */}
            {statusEnvio && (
                <p className={`feedback ${statusEnvio}`}>{mensagem}</p>
            )}
        </div>
    );
}

export default FormularioContato;