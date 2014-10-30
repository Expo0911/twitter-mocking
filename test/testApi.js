//var nock = require("nock");
var twitter = require("twitter");
var chai = require("chai");
var expect = chai.expect;
var querystring = require('querystring');
var nock = require("nock");


var twitterClient = new twitter({
	    consumer_key: "fake",
	    consumer_secret: "secret",
	    access_token_key: "token_key",
	    access_token_secret: "token_secret"
});

twitter.prototype.show = function(id, callback)
{
	twitterClient.get('/statuses/show.json', {id:id}, callback);
};

var data = 
{
	id : "210462857140252672",
	query : "#NCSU",
  newStatus : "new Status"
}

// TESTS

describe('twitterClient', function(){
  describe('#verifyCredentials()', function(){
   	it('should return valid login properties', function(done){


      var mockService = nock("https://api.twitter.com")
         .get("/1.1/account/verify_credentials.json")
         .reply(200, {"name": "diwali", "screen_name": "statefair"});

   		twitterClient.verifyCredentials(function(results)
   		{
   			expect(results).to.have.property("name");
   			expect(results).to.have.property("screen_name");

				done();// for unit testing
   		});

    });
	});
});

describe('twitterClient', function(){
  describe('#search(text)', function(){
   	it('should return valid list of statuses', function(done){
      var mockService = nock("https://api.twitter.com")
         .get("/1.1/search/tweets.json?q=" + querystring.escape(data.query))
         //*****************code changes************************************
         .reply(200, {statuses:[ {"id": "test id abcde", "text": "print this test id"}]});    
         // form a new Array data structure with id and text
         //*****************code changes end********************************
   		twitterClient.search(data.query, function(results)
   		{
        //*****************code changes*************************************
   			expect(results).to.have.property("statuses");
   			expect(results.statuses.length).to.be.above(0);
   			// more assertions
        // each status should have an id property and text property
				expect(results.statuses[0]).to.have.property("id");
        expect(results.statuses[0]).to.have.property("text");
        //*****************code changes end*********************************
				done();
   		});

    });
	});
});

/*
describe('twitterClient', function(){
  describe('#updateStatus(text)', function(){
   	it('should return updated status', function(done){
      //POST text to "https://api.twitter.com/1.1/statuses/update.json"
      //*****************code changes***************************************
      //*****************add moking*****************************************
      var mockService = nock("https://api.twitter.com")
         .post("/1.1/statuses/update.json")
         .reply(200, {"text": data.newStatus});

   		twitterClient.updateStatus(data.newStatus, function(results)
   		{
   			expect(results).to.have.property("text");
   			expect(results.text).to.equal(data.newStatus);
        expect(results.text.length).to.be.below(400);
        console.log("\t Testing updateStatus(text):");
        console.log("\t Print results.text:\t" + results.text);
        console.log("\t Print data.newStatus:\t" + data.newStatus);

				done();
   		});
      //*****************code changes end***********************************
    });
	});
});
*/
describe('twitterClient', function(){
  describe('#updateStatus(text)', function(){
    it('should return updated status', function(done){
      var longMessage = "test for 140 character limit when updating status test for 140 character limit when updating status test for 140 character limit when updating status test for 140 character limit when updating status";
      // POST text to "https://api.twitter.com/1.1/statuses/update.json"
      var mockService = nock("https://api.twitter.com")
         .post("/1.1/statuses/update.json", {"status":longMessage, "include_entities":1})
         .reply(413, {"error":"Message is too long"});
    
      twitterClient.updateStatus(longMessage, function(results)
      {
        var data = JSON.parse( results.data );
        /*
        //Test part ***************************  
        console.log("Testing updateStatus : ");
        console.log("1.results"); 
          console.log(results);
        console.log("2.JSON.stringify(results)");
          console.log(JSON.stringify(results));
        console.log("3.results.data");
          console.log(results.data);    
        console.log("4.data");  
          console.log(data);
        console.log("5.data.error");
          console.log(data.error);
        console.log("6.results.data.error");
          console.log(results.data.error);
        //Test part ends***********************
        */
        //Verify the statusCode property
        expect(results).to.have.property("statusCode");
        //Verify the statusCode is 413
        expect(results.statusCode).to.be.equal(413);
        // Verify the data property
        expect(results).to.have.property("data");
        // Verify the data.error property
        expect(JSON.parse(results.data)).to.have.property("error");
        expect(data).to.have.property("error");  
        expect(results.data).to.be.equal(JSON.stringify(data));
        //Verify the error message is equal to "Message is too long"
        expect(data.error).to.be.equal("Message is too long");

        done();
      });
    });
  });
});




//Add a new test case that passes a new status which exceeds the 140 character limit for updateStatus.
// test for 140 character limit when updating status
//******************************************************
describe('twitterClient', function(){
  describe('#show()', function(){
   	it('should return valid twitter status', function(done){

    var mockService = nock("https://api.twitter.com")
         .get("/1.1/statuses/show.json?id="+data.id)
         .reply(200, 
            {
              "coordinates": null,
              "favorited": false,
              "truncated": false,
              "created_at": "Wed Jun 06 20:07:10 +0000 2012",
              "id_str": data.id,
              "entities": {
                "urls": [
                  {
                    "expanded_url": "https://dev.twitter.com/terms/display-guidelines",
                    "url": "https://t.co/Ed4omjYs",
                    "indices": [
                      76,
                      97
                    ],
                    "display_url": "dev.twitter.com/terms/display-\u2026"
                  }
                ],
                "hashtags": [
                  {
                    "text": "Twitterbird",
                    "indices": [
                      19,
                      31
                    ]
                  }
                ],
                "user_mentions": [
             
                ]
              },
              "in_reply_to_user_id_str": null,
              "contributors": [
                14927800
              ],
              "text": "Along with our new #Twitterbird, we've also updated our Display Guidelines: https://t.co/Ed4omjYs  ^JC",
              "retweet_count": 66,
              "in_reply_to_status_id_str": null,
              "id": 210462857140252672,
              "geo": null,
              "retweeted": true,
              "possibly_sensitive": false,
              "in_reply_to_user_id": null,
              "place": null,
              "user": {
                "profile_sidebar_fill_color": "DDEEF6",
                "profile_sidebar_border_color": "C0DEED",
                "profile_background_tile": false,
                "name": "Twitter API",
                "profile_image_url": "http://a0.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png",
                "created_at": "Wed May 23 06:01:13 +0000 2007",
                "location": "San Francisco, CA",
                "follow_request_sent": false,
                "profile_link_color": "0084B4",
                "is_translator": false,
                "id_str": "6253282",
                "entities": {
                  "url": {
                    "urls": [
                      {
                        "expanded_url": null,
                        "url": "http://dev.twitter.com",
                        "indices": [
                          0,
                          22
                        ]
                      }
                    ]
                  },
                  "description": {
                    "urls": [
             
                    ]
                  }
                },
                "default_profile": true,
                "contributors_enabled": true,
                "favourites_count": 24,
                "url": "http://dev.twitter.com",
                "profile_image_url_https": "https://si0.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png",
                "utc_offset": -28800,
                "id": 6253282,
                "profile_use_background_image": true,
                "listed_count": 10774,
                "profile_text_color": "333333",
                "lang": "en",
                "followers_count": 1212963,
                "protected": false,
                "notifications": null,
                "profile_background_image_url_https": "https://si0.twimg.com/images/themes/theme1/bg.png",
                "profile_background_color": "C0DEED",
                "verified": true,
                "geo_enabled": true,
                "time_zone": "Pacific Time (US & Canada)",
                "description": "The Real Twitter API. I tweet about API changes, service issues and happily answer questions about Twitter and our API. Don't get an answer? It's on my website.",
                "default_profile_image": false,
                "profile_background_image_url": "http://a0.twimg.com/images/themes/theme1/bg.png",
                "statuses_count": 3333,
                "friends_count": 31,
                "following": true,
                "show_all_inline_media": false,
                "screen_name": "twitterapi"
              },
              "in_reply_to_screen_name": null,
              "source": "web",
              "in_reply_to_status_id": null
            });


   		twitterClient.show(data.id, function(results)
   		{
   			expect(results).to.have.property("id_str");
   			chai.assert.equal(results.id_str,data.id);

        //*********************test code********************************************
        console.log("\tUpdating status : \n\t" + "data.id: "+ "\t"+ data.id);
        //*********************test code ends***************************************

				done();
   		});

    });
	});
});
