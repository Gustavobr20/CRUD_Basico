const express = require ('express')

const server = express(); 

server.use(express.json());

// Query params = ?nome=NodeJS
// Route params = /curso/2
// Request Body = { nome: 'Node JS', tipo: 'Back-End'}

const cursos = ['Node JS', 'javaScript', 'React Native'];

// Middleware global - Requisição independente (utiliza o next para ir para proxima requisição abaixo)
server.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);
    
    return next();
})

// retorna o erro caso não coloque um name
function checkCurso(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({error: "Nome do curso é obrigatório"});
    }

    return next();
}

// Middleware global

function checkIndexCurso(req, res, next) {

    const curso = cursos[req.params.index];

    if(!curso){
        return res.status(400).json({error: "O curso não existe"});
    }

    return next();
};

server.get('/cursos', (req, res) => {
    return res.json(cursos);
});

// com os comandos abaixo eu espero que ele acesse localhost:3000/cursos
server.get('/cursos/:index', checkIndexCurso, (req, res) =>{
    const { index } = req.params;

    return res.json(cursos[index]) // rota que tras informações, o segundo parametro é uma função que devolve alguma coisa e dentro do parenteses utilizado o req e o res
}) 

// criando um novo curso
server.post('/cursos', checkCurso, (req, res) => {
    const {name} = req.body;
    cursos.push(name);

    return res.json(cursos);
});

// Atualizando um curso
server.put('/cursos/:index', checkCurso, checkIndexCurso, (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    cursos[index] = name;

    return res.json(cursos);
})

// Excluindo algum curso

server.delete('/cursos/:index', checkIndexCurso, (req, res) => {
    const {index} = req.params;

    cursos.splice(index, 1);

    return res.json(cursos);
})

server.listen(3000); // diz para o servidor ler a porta 3000