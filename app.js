const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

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
        cb(null, 'uploads/');
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

app.listen(8080, () => {
    console.log('App start');
});