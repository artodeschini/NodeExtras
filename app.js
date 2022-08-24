const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const mailer = require('nodemailer');

// static resource
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

// body-parse
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// nomear os arquivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // obs devido ao .gitignore talvez seja necessario criar essa pasta
    },
    filename: function(res, file, cb) {
        //cb(null, file.originalname); nome original do arquivo
        // nome original do arquivo + data atual + etensao para nao haver conflitos
        cb(null, file.originalname + Date.now() + path.extname(file.originalname));
    }
});

// configura o diretorio onde ficaram os arquivo enviados
// const upload = multer({ dest: "uploads/"});
const upload = multer({ storage });

// configuracao do transport smtp para envio de email 
const transporter = mailer.createTransport({
    // guia para configurar https://kinsta.com/pt/blog/servidor-smtp-gmail/
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    // auth: {
    //     user: 'artodeschini@gmail.com',
    //     pass: 'abcABC123'
    // }

    //host: 'smtp://smtp.mailtrap.io',
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '5228b8de4c680f',
        pass: '98baf81f6651db'
    }
});

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/upload", (req, res) => {
    res.render('upload');
});

// dentro do middle upload.single coloco o 'name' do campo que representa o file
app.post("/upload", upload.single('arquivo'), (req, res) => {
    res.render('upload');
});

app.get("/email", (req, res) => {
    res.render('mail');
});

app.post("/email", (req, res) => {
    let {para, titulo, conteudo} = req.body;

    transporter.sendMail({
        from: 'artodeschini@gmail.com', // precisa ser o mesmo configurado no transport
        to: para,
        subject: titulo,
        html: conteudo
        //text: geralmente se usa um dos dois html ou text
    }).then(msg => {
        console.log(msg);
    }).catch(e => {
        console.log(e);
    });

    res.render('mail');
});

app.listen(8080, () => {
    console.log('App start');
});