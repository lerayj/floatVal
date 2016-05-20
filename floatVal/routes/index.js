var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');
var cheerio = require('cheerio');
//TODO: curlrequest le folat exchange
//TODO: Cheerio pour parser la reponse de exchange pour avoir le float


router.get('/', function(req, res, next) {
	var pMarket = new Promise(function(resolve, reject){
		var market="http://steamcommunity.com/market/listings/730/AK-47%20%7C%20Redline%20%28Field-Tested%29/render/?query=&start=30&count=10&country=FR&language=english&currency=3";
		request.get(market,(error, response, body) => {
			if(error)
				console.log("Error: ", error);
			var info = JSON.parse(body);
			resolve(info.listinginfo);
		});
	});

	pMarket.then(function(market){
		var Datablob = [];
		//console.log("OK market: ", market);
		 var items = _.values(market);
		 _.each(items, function(item){
			var liteItem = {
				price: item.price,
				link: item.asset.market_actions[0].link
			} 
			console.log("item: ", liteItem);
		});
		getFloatFromExchangeResult();
	});

	res.render('index', { title: 'Express' });
});

module.exports = router;

//curl get float exchange
//curl 'http://csgo.exchange/item/float' -H 'Pragma: no-cache' -H 'Origin: http://csgo.exchange' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6,sw;q=0.4' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: text/html, */*; q=0.01' -H 'Cache-Control: no-cache' -H 'X-Requested-With: XMLHttpRequest' -H 'Cookie: __cfduid=d1a8c7678fc8e61efead5e0b2783e56d71463659626; csgoexch=8505029i4is64l8a9qog5vdt46' -H 'Connection: keep-alive' -H 'Referer: http://csgo.exchange/' --data 's=M&a=6278199743&m=632006240952485816&d=4793525727119541147' --compressed

function getFloatFromExchangeResult(html){
								
	var html = "<div class='target-label'><div title='Wear Value' style='position:relative;right:-43px;top:-0.8em'>0.20041191577911376953</div></div>";
	var $ = cheerio.load(html);
	console.log("RESULTAT: ", $('.target-label').text());
	return $('.target-label').text();
}