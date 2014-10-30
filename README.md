Unit Testing
===========

1) Fork this repository to your account.

2) git clone the forked account.

3) Install everything you need: `npm install`

4) Run `npm test` to run unit test suite.

There are two unit tests failing.  Provide the mocking necessary to complete the unit tests.

5) Complete the assertions needed for the `search` call.

6) Add a new test case that passes a new status which exceeds the 140 character limit for `updateStatus`.

7) Commit your updated code to your repository for extra homework assignment credit.

### Submit

Enter your github repo in this [google doc](https://docs.google.com/spreadsheets/d/1xnkzwKVDz4-62O_SLkfH14DK0_KHqx0Pq6FCeQjNT-w/edit?usp=sharing).

### Updates

See [this commit](https://github.ncsu.edu/CSC510-Fall2014/UnitTesting/commit/00937049768fbcb640eda11b02a0cef735214a2a) to see updates to testCases.

For the new test case, see the sample nock expression for mocking the service response.  

    var mockService = nock("https://api.twitter.com")
            .post("/1.1/statuses/update.json", {"status":longMessage, "include_entities":1})
            .reply(413, {"error":"Message is too long"});

It will return a results data structure that looks as the following:

    {"statusCode":413,"data":"{\"error\":\"Message is too long\"}"}
    
The data attribute contains string escaped JSON.  To escape it, just do the following:

    var data = JSON.parse( results.data );

The test case should make the following checks:

* Verify the statusCode property
* Verify the statusCode is 413
* Verify the data and data.error property
* Verify the error message is equal to "Message is too long"



