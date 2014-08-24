
/*
 * GET home page.
 */


module.exports = function(app){
	// http://localhost:9000/reader.html?cid=moby-dick#p=0
	app.get('/:name', function(req, res){
		// res.render('index', {title: 'MooReader_site'});
		// console.log(__dirname + '/../public/reader.html');
		console.log('name: ' + req.params.name);
		if(req.params.name === 'manifest.appcache'){
			res.sendfile('manifest.appcache', {root: './public'});
		} else{
			res.sendfile('reader.html', {root: './public'});
		}
	});

	app.get('/plugins/:', function(req, res){
		console.log('got plugins request!');
	});

}
