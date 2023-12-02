//Módulo 4 deverá acrescentar duas novas funcionalidades ao nosso projeto
//Exibir a data do último acesso do usuário e o nome do usuário (cookies) cookies = biscoitos
//Autenticar o usuário para controlar o acesso aos recursos da aplicação (sessão)

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
//exemplo de importação de biblioteca usando: 'commanjs'
//express = requite('express');

const porta = 3000;
const host = '0.0.0.0';
var listaUsuarios = [];

function processaCadastroUsuario(req, res) {
    //extrair os dados do corpo da requisição além de validar os dados
    const dados = req.body;
    let conteudoResposta = '';
    //é necessario validar os dados enviados
    //A validação dos dados é de responsabilidade da aplicação servidor
    if(!(dados.nome && dados.sobreNome && dados.telefone 
        && dados.email && dados.rua && dados.bairro && dados.numero && dados.cep)) {

        conteudoResposta = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Formulário com Validação em Bootstrap</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">          
            </head>
            <body>          
                <div class="container">
                    <h2>Formulário com Validação em Bootstrap</h2>
                    <form action="/cadastrarUsuario" method="POST" class="needs-validation" novalidate> 
                        <div class="form-group">
                            <label for="nome">Nome:</label>
                            <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome" value="${dados.nome}" required>
                        </div>
        `;
        if(!dados.nome) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo nome é obrigatório</p>
            </div>
            `;
        }

        conteudoResposta += `
        <div class="form-group">
            <label for="sobrenome">Sobrenome:</label>
            <input type="text" class="form-control" id="sobreNome" name="sobreNome" placeholder="Digite seu sobrenome"  value="${dados.sobreNome}"  required>
        </div>
        `;   
        if(!dados.sobreNome) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo sobre nome é obrigatório</p>
            </div>
            `;
        }   

        conteudoResposta += `
        <div class="form-group">    
            <label for="telefone">Telefone:</label>
            <input type="text" class="form-control" id="telefone" name="telefone" placeholder="Digite seu telefone" value="${dados.telefone}"  required>
        </div>
        `;   
        if(!dados.telefone) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo telefone é obrigatório</p>
            </div>
            `;
        }   

        conteudoResposta += `
        <div class="form-group">
            <label for="email">E-mail:</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Digite seu e-mail"  value="${dados.email}" required>
        </div>       
        `;   
        if(!dados.email) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo e-mail é obrigatório</p>
            </div>
            `;
        }  

        conteudoResposta += `
        <div class="form-group">
            <label for="rua">Rua:</label>
            <input type="text" class="form-control" id="rua" name="rua" placeholder="Digite sua rua"  value="${dados.rua}" required>
        </div>      
        `;   
        if(!dados.rua) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo rua é obrigatório</p>
            </div>
            `;
        }  

        conteudoResposta += `
        <div class="form-group">
            <label for="bairro">Bairro:</label>
            <input type="text" class="form-control" id="bairro" name="bairro" placeholder="Digite seu bairro"  value="${dados.bairro}" required>
        </div>       
        `;   
        if(!dados.bairro) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo bairro é obrigatório</p>
            </div>
            `;
        } 

        conteudoResposta += `
        <div class="form-group">
            <label for="numero">Número:</label>
            <input type="text" class="form-control" id="numero" name="numero" placeholder="Digite o número"  value="${dados.numero}" required>
        </div>
        `;   
        if(!dados.numero) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo numero é obrigatório</p>
            </div>
            `;
        }  

        conteudoResposta += `
        <div class="form-group">
            <label for="cep">CEP:</label>
            <input type="text" class="form-control" id="cep" name="cep" placeholder="Digite o CEP" value="${dados.cep}"  required>
        </div>       
        `;   
        if(!dados.cep) {
            conteudoResposta += `
            <div>
                <p class="text-danger">O campo cep é obrigatório</p>
            </div>
            `;
        }   

        conteudoResposta += ` 
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </form>
                </div>

                <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </body>
            </html>
        `;

        res.end(conteudoResposta);

    }   else {

        const usuario = {
            nome: dados.nome,
            sobreNome: dados.sobreNome,
            telefone: dados.telefone,
            email: dados.email,
            rua: dados.rua,
            bairro: dados.bairro,
            numero: dados.numero,
            cep: dados.cep
        }

        //adiciona um usuario na lista
        listaUsuarios.push(usuario);

        //retorna a lista de usuários
        conteudoResposta = `
            <!DOCTYPE html>
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <title>Menu do Sistema</title>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                </head>
                <body>
                    <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                <th>Nome</th>
                                <th>Sobre nome</th>
                                <th>Telefone</th>
                                <th>E-mail</th>
                                <th>Rua</th>
                                <th>Bairro</th>
                                <th>Numero</th>
                                <th>Cep</th>
                                </tr>
                            </thead>
                        <tbody> `;

        for(const usuario of listaUsuarios) {
            conteudoResposta += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.sobreNome}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.rua}</td>
                    <td>${usuario.bairro}</td>
                    <td>${usuario.numero}</td>
                    <td>${usuario.cep}</td>
                </tr>
            `;
        }

        conteudoResposta += `
                        </tbody>
                    </table>
                    <a class="btn btn-primary" href="/" role="button">Voltar ao Menu</a>
                    <a class="btn btn-primary" href="/cadastrarUsuario.html" role="button">Continuar Cadastrando</a>
                </body>
                <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </html>
        `;
        res.end(conteudoResposta);
    }
}

//pseudo middleware
function autenticar(req, res, next) {
    if(req.session.usuarioAutenticado) {
        next();
    } else {
        res.redirect("/login.html");
    }
}  

const app = express();
//ativando a funcionalidade de manipular cookies
app.use(cookieParser());

//adicionar uma nova capacidade para essa aplicação: Memorizar ou identificar com quem o servidor esta falando
//durante o uso do sistema, a aplicação sabera, dentro de uma sessão valida com quem ela se comunica
app.use(session({
    secret: "M1nH4Ch2v3S3cR3t4",
    resave: true, //atualiza a sessão mesmo que não há alterações a cada requisição
    saveUninitialized:  true,
    cookie: {
        //tempo de vida da sessão
        maxAge: 1000 * 60 * 15 // 15 minutos
    }
}))

//ativar a extensão que manipula requisições http
//opção false ativa a extensão querystring
//opção true ativa a extensão qs (manipula objetos, listas, aninhados)
app.use(express.urlencoded({extended: true}));


//indicando para a aplicação como servir arquivos estáticos localizados na pasta 'paginas'.
app.use(express.static(path.join(process.cwd(), './paginas')));

app.get('/', autenticar, (req, res) => {
    const dataUltimoAcesso = req.cookies.DataUltimoAcesso;
    const data = new Date();
    res.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });
    res.end(`
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Menu do Sistema</title>
            </head>
            <body>
                <h1>Menu</h1>
                <ul>
                    <li><a href="/cadastrarUsuario.html">Cadastrar Usuário</li>
                </ul>
            </body>
            <footer>
                <p> Seu último acesso foi em ${dataUltimoAcesso}</p>
            </footer>
        </html>
    `);
});

//endpoint login que irá processar o login da aplicação
app.post('/login', (req, res) => {
    const usuario = req.body.usuario;
    const senha =  req.body.senha;
    if (usuario && senha && (usuario === 'gabriel') && (senha === '1234')) {
        req.session.usuarioAutenticado = true;
        res.redirect('/');
    } else {
        res.end(`
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Falha na autenticacao</title>
            </head>
            <body>
                <h2>Usuário ou senha inválidos!</h2>
                <a href="/login.html">Voltar ao login</a>
            </body>
        </html>            
        `)
    }
});
//rota para processar o cadastro de usuários endpoint = '/cadastrarUsuario'
app.post('/cadastrarUsuario', autenticar, processaCadastroUsuario);


app.listen(porta, host, () => {
    console.log(`servidor executando na URL http://${host}:${porta}`);
});