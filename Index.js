//config inicial do servidor express
const express = require('express')
const app = express()

//configuração do banco
const mongoose = require('mongoose')

//Buscando pelo obejto
const Person = require('./models/Person')

//Explicando ao express qual lib usar para parsing do contéudo
app.use(
    express.urlencoded({
        extended:true
    })
)

//Aceitando request json
app.use(express.json)

//Rotas para os métodos (post, get, put, delete)
app.post('/person', async(req,res) =>{
    const{name,salary,approved} = req.body

    const person = {
        name,
        salary,
        approved
    }

    try{
        await Person.create(person)
        res.status(201).json({message: 'Inserido com sucesso.'})
    } catch(error) {
        res.status(500).json({error:error})
    }
})

app.get('/person', async(req,res) => {
    try{
        const people = await Person.find()
        res.status(200).json(people)
    } catch (error) {
        res.status(500).json({error:error})
    }
    }
)

app.patch('/person/:id', async(req, res) => {
    const id = req.params.id

    const{name, salary, approved} = req.body

    const person = {
        name,
        salary,
        approved
    }

    try{
        const updatePerson = await Person.updateOne({_id:id}, person)
        if(updatePerson.matchedCount === 0){
            res.status(422).json({message:'Usuário não encontrado.'})
            return
        }

        res.status(200).json(person)
    } catch(error){
        res.status(500).json({error:error})
    }
})

app.delete('/person/:id', async(req, res) => {
    const id = req.params.id
    const person = await Person.findOne({_id:id})

    if (!person){
        res.status(422).json({message: 'Usuário não encontrado.'})
        return
    }
    try{
        await Person.deleteOne({_id:id})
        res.status(200).json({message:'Usuário deletado.'})
    } catch(error) {
        res.status(500).json({error:error})
    }
})

app.get('/', (req, res) => {
    res.json({message:'Nada aqui, página inicial'})
})

mongoose.connect('mongodb://localhost:27017/')
.then(() => {
    console.log('Conexão com banco de dados estabelecida com sucesso.')
    app.listen(3000)
})
.catch((err) => console.log(err))
