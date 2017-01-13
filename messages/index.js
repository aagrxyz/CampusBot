// For more information about this template visit http://aka.ms/azurebots-node-qnamaker
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var builder_cognitiveservices = require("botbuilder-cognitiveservices");
var request = require('request');
var whois = require('./whois');
var papers = require('./get_papers');
var events = require('./events');
var schedule = require('./schedule');
var course = require('./course');
var useEmulator = (process.env.NODE_ENV == 'development');

// var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
var connector = useEmulator ? new builder.ConsoleConnector().listen() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

//var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
      //          knowledgeBaseId: process.env.QnAKnowledgebaseId, 
//    subscriptionKey: process.env.QnASubscriptionKey});
var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v2.0/apps/a03a7e51-dd74-401d-bbe9-071134809292?subscription-key=319a73d29574452fb76a949ea4d42a5e&verbose=true');
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
var recognizerqna = new builder_cognitiveservices.QnAMakerRecognizer({
            knowledgeBaseId: "03d2ac21-ace5-4cbf-88ac-d0e272037e1b", 
    subscriptionKey: "9e13de47c0cd4210b08592d36559fbd6"});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
   recognizers: [recognizerqna],
                defaultMessage: 'No match! Try changing the query terms!',
                qnaThreshold: 0.3}
);

bot.dialog('/', intents);

intents.matches('qna', '/qna');
intents.matches('Converse', '/converse');
intents.matches('profile', '/profile');
intents.matches('repeat', '/repeat');
intents.matches('whois', '/whois');
intents.matches('downpaper', '/papers');
intents.matches('events', '/events');
intents.matches('complaint', '/complaint');
intents.matches('schedule', '/schedule');
intents.matches('course','/course');
intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

//bot.dialog('/qna', basicQnAMakerDialog);

bot.dialog('/course',[
    function(session,args,next)
    {
        builder.Prompts.text("Give me the course code");
    },
    function(session,results)
    {
        var c = course.get_course(results.response);
        if(c === undefined)
        {
            session.send("No such course code found!");
        }
        else
        {
            session.send(course.pretty_course(c));
        }
        session.endDialog();
    }
]);

bot.dialog('/events',[
    function(session,args)
    {
        events.get_events(function(result){
            var story = events.story(result);
            for(var i=0;i<story.length;i++)
            {
                session.send(story[i]);
            }
            session.endDialog();
        });
    }
]);

bot.dialog('/schedule',[
    function(session,args,next) {
        session.send("Entered first");
        if (!session.userData.en) {
            builder.Prompts.text(session, "What's your entry number?");
        } else {
            next();
        }
    },
    function(session,results)
    {
        session.send("Entered second");
        if (results.response) {
            session.userData.en = results.response;
        }
        var courses = schedule.courses(session.userData.en);
        if(courses !== undefined)
        {
            var week = schedule.week_schedule(courses.courses);
            var sch = schedule.pretty_week(week);
            for(var i=0;i<sch.length;i++)
            {
                session.send(sch[i]);
            }
        }
        else
        {
            session.userData.en = undefined;
            session.send("Invalid entry number provided!");
        }
        session.endDialog();
    }
]);


bot.dialog('/whois', [
    function (session,args,next) {
      var nameoren = builder.EntityRecognizer.findAllEntities(args.entities, 'whoisent');
      if (!nameoren) {
         builder.Prompts.text(session, 'Give me a Name or an Entry number');
      } else {
      	var name ="";
      	for( var i =0; i<nameoren.length-1;i++)
      	{
      		name += nameoren[i].entity + " ";
      	}
      	name += nameoren[nameoren.length-1].entity;
        next({ response: name });
      }
    },
    function (session, results) {
        var result = whois.identify(results.response);
        if(result.length === 0)
        {
            session.send("No matches found. Please try again.");
        }
        else
        {
            var ans = "";
            if(result.length > 4)
            {
                session.send("Your query was too general. Here are top 4 results :");
            }
            else if(result.length > 1)
            {
                session.send("Matches found :");
            }
            for(var i=0;i<result.length && i < 4;i++)
            {
                session.send(whois.story(result[i]));
            }
        }
        session.endDialog();
    }
]);

bot.dialog('/papers', [
    function (session, args, next) {
        if (!session.userData.en) {
            builder.Prompts.text(session, "What's your entry number?");
        } else {
            next();
        }
    },
    function (session, results) {
      if (results.response) {
        session.userData.en = results.response;
        }
        var http = require('http');
	    var options = {
	        host: 'www.cse.iitd.ernet.in',
	        path: '/aces-acm/api?entry='+ session.userData.en
	    };
	    http.get(options, function(resp){
	      resp.on('data', function(chunk){
	      });
	    }).on("error", function(e){
	      session.send("Got some error, please try later");
	    });
	    session.send("Download Papers at www.cse.iitd.ernet.in/aces-acm/download/" + session.userData.en.toUpperCase() + ".zip");      
	    
      session.endDialogWithResult({ response: session.userData });
    }      
]);

bot.dialog('/repeat', [
    function (session) {
        builder.Prompts.text(session, 'Hi! I repeat everything!');
    },
    function (session, results) {
        session.send(results.response);
        session.endDialog();
    }
]);

bot.dialog('/profile', [
    function (session, args, next) {
            builder.Prompts.text(session, "What's your name?");
    },
    function (session, results, next) {
        if (results.response) {
            session.userData.name = results.response;
        }
        builder.Prompts.text(session, "What your entry number?");
    },
    function (session, results) {
        if (results.response) {
            session.userData.en = results.response;
            session.send("Thanks, "+session.userData.name+", Your profile has been saved");
        }
        session.endDialogWithResult({ response: session.userData });
    }
]);

bot.dialog('/complaint', [
    function (session, args, next) {
        if(!session.userData.name || !session.userData.en){
            session.beginDialog("/profile");
        }
        builder.Prompts.text(session, "Enter the subject of your complaint");        
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.sub = results.response;
        }
        builder.Prompts.text(session, "Describe the complaint in detail");
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.desc = results.response;
        }
        builder.Prompts.text(session, "Who is/are responsible for the matter mentioned in the complaint?");
    },
    function (session, results) {
       if (results.response) {
            session.dialogData.resp = results.response;
        }
        session.send("Your complaint is about "+session.dialogData.sub+". The detailed description is "+session.dialogData.desc+" and people responsible are "+session.dialogData.resp);
        var request = require("request");
        var options = { method: 'POST',
          url: 'http://www.cse.iitd.ernet.in/aces-acm/api',
          headers: 
           { 'postman-token': '504d20da-90fb-ec0b-fa29-7c90d5652c36',
             'cache-control': 'no-cache',
             'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
          formData: 
           { action: 'postcomplaint',
             Subject: session.dialogData.sub,
             Description: session.dialogData.desc,
            'People In-Charge': session.dialogData.resp,
             Name: session.userData.name,
            'Entry Number': session.userData.en } };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
        });
        session.endDialog();
     }
]);

bot.dialog('/qna', [
    function (session) {
       // builder.Prompts.text(session, 'Hi! What is your name?');
        //session.send("What's ur query?");
        builder.Prompts.text(session, 'Ask me anything!');
     //  session.beginDialogue(basicQnAMakerDialog);
        //session.endDialog();

   },  function (session, results) {
       
       
       var postBody = '{"question":"' + results.response + '"}';
            request({
                url: "https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/03d2ac21-ace5-4cbf-88ac-d0e272037e1b/generateAnswer",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': "9e13de47c0cd4210b08592d36559fbd6"
                },
                body: postBody
            },
                function (error, response, body) {
                    var result;
                       // console.log(body);
                            result = JSON.parse(body);
                            result.score = result.score / 100;
                         //   result.answer = htmlentities.decode(result.answer);
                            session.send(result.answer);
                }
            );


   //session.send(results.response);
        session.endDialog();
    }
    ]);


bot.dialog('/converse', [
    function (session,args) {
        var task = builder.EntityRecognizer.findEntity(args.entities, 'convtopic');
        if (!task) {
            builder.Prompts.text(session, "What would you like to talk about?");
        } else {
            next({ response: task.entity });
        }
    },
    function (session, results) {
        session.send("Yes"+ session.userData.name+" I do like talking about " + results.response);
        session.endDialog();
    }
]);

if (useEmulator) {
    // var restify = require('restify');
    // var server = restify.createServer();
    // server.listen(3978, function() {
    //     console.log('test bot endpont at http://localhost:3978/api/messages');
    // });
    // server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
