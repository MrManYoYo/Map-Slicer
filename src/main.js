const express = require('express'),
  ejs = require('ejs'),
  app = express();

app.use('/static', express.static(__dirname + '/public'))
app.engine( 'html', require('ejs').renderFile );
app.set('view engine', 'html')
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(3000, () => {
  console.log('Servcer is start')
})