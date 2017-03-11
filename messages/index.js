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
var mess = require('./mess');
var review = require('./review');
var entry2name = require('./entry2name');
var useEmulator = (process.env.NODE_ENV == 'development');
// var m = require('mitsuku-api')();
var dropbox = require('./dropbox');

var Cleverbot = require('cleverbot-node');
var cleverbot = new Cleverbot;
cleverbot.configure({botapi: "4795226bb2cf8dfefe88b1e7defe66b5"});

// var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
var connector = useEmulator ? new builder.ChatConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword']
    }):
    new botbuilder_azure.BotServiceConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword'],
        stateEndpoint: process.env['BotStateEndpoint'],
        openIdMetadata: process.env['BotOpenIdMetadata']
});
// var connector = useEmulator ? new builder.ConsoleConnector().listen() : new botbuilder_azure.BotServiceConnector({
//     appId: process.env['MicrosoftAppId'],
//     appPassword: process.env['MicrosoftAppPassword'],
//     stateEndpoint: process.env['BotStateEndpoint'],
//     openIdMetadata: process.env['BotOpenIdMetadata']
// });


var bot = new builder.UniversalBot(connector);
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^(goodbye)|(bye)|(exit)|(end)|(quit)/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8f01707e-7af2-4f48-8cd1-27ec08c7cb69?subscription-key=e6c045b1b51e4ce1891dd4e75f916e6f&verbose=true');
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
var recognizerqna = new builder_cognitiveservices.QnAMakerRecognizer({
            knowledgeBaseId: "ed4f7426-23cc-4522-9294-fb2aba145168",
    subscriptionKey: "2fae0729b5cb475fa89c5175ff98164d"});

var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
   recognizers: [recognizerqna],
                defaultMessage: 'No match! Try changing the query terms!',
                qnaThreshold: 0.3}
);
var introMessage = ['Main functionalities are described below-\n\nProfile : Say \'hi\' or \'setup\' at any time to setup your profile.\n\nFAQ : Say \'faq\' or \'question answer\' to ask the bot a FAQ about insti',
'Class Schedule : Ask the bot "My schedule for the week" or "Monday schedule" or "schedule tomorrow" to get your lecture schedule.\n\nConversation : Say "talk about snowy mounains" or "converse" or "chat" to enter converation mode. Say "end" to exit this mode.',
'Who is :   Ask the bot \'Who is Name/EN\' to find students in the institute with that Name/EN.\n\nEvents :   Ask \'events\' to find upcoming events in the campus (from facebook).',
'Course info :  Ask "Course information COL216" or "details of COL331 course to see some details about that course.\n\nPaper Download : Say \'download my papers\' or \'question papers\' to download previous papers of all the courses that you are registered in.',
'Complaint : Type \'complaint\' etc to register a complaint with the institute.'
];


bot.dialog('/', intents);
// bot.dialog('/',[
    // function(session)
    // {
        // console.log(session);
        // session.endDialog("hha");
    // }
// ]);

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
intents.matches('mess','/mess');
intents.matches('review','/review');
intents.matches('main','/main');
intents.matches('material','/material');
intents.matches('exam','/exam');
intents.matches('developers','/developers');
intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));


bot.dialog('/main',[
    function(session,args,next) {
        if(!session.userData.en || !session.userData.name)
        {
            session.beginDialog('/profile');
        }
        else
        {
            next();
        }
    },
    function(session,args,next) {
        // console.log(typeof(intents));
        // console.log(intents);
        builder.Prompts.choice(session, "What would you like to get (type end to quit)?", "Upcoming Events|Class Schedule|Papers Download|Who is|Mess Schedule|Exam Schedule|Course Material|Developers|Profile Setup|Help");
    },
    function(session,results){
        if(results.response)
        {
            if(results.response.entity === 'Exit')
            {
                session.endDialog("Thanks for using. You can call again by saying Hi");
            }
            else
            {
                switch(results.response.entity)
                {
                    // console.log("In Casse");
                    case "Upcoming Events":
                        session.beginDialog('/events');
                        break;
                    case "Class Schedule":
                        session.beginDialog('/schedule');
                        break;
                    case "Converse":
                        session.beginDialog('/converse');
                        break;
                    case "Papers Download":
                        session.beginDialog('/papers');
                        break;
                    case "Who is":
                        session.beginDialog('/whois');
                        break;
                    case "Mess Schedule":
                        session.beginDialog('/mess');
                        break;
                    case "Profile Setup":
                        session.userData.en = undefined;
                        session.userData.name = undefined;
                        session.beginDialog('/profile');
                        break;
                    case "FAQ":
                        session.beginDialog('/qna');
                        break;
                    case "Course Review":
                        session.beginDialog('/review');
                        break;
                    case "Course Material":
                        session.beginDialog('/material');
                        break;
                    case "TimePass":
                        session.beginDialog('/converse');
                        break;
                    case "Exam Schedule":
                        session.beginDialog('/exam');
                        break;
                    case "Developers":
                        session.beginDialog('/developers');
                        break;
                    case "Help":
                        session.beginDialog('/help');
                        break;
                }
            }
        }
        else
        {
            session.endDialog("Invalid Response. You can call again by saying Hi");
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/main');
    }
]);

bot.dialog('/help',[
    function(session)
    {
        var introCard = new builder.HeroCard(session)
                .title("Campus Bot")
                .text("Your own campus assistant")
                .images([
                    builder.CardImage.create(session, "https://s24.postimg.org/jwjmzedid/dev.png")
                ]);
        var msg = new builder.Message(session).attachments([introCard]);
        session.send(msg);
        introMessage.forEach(function(ms){
            session.send(ms);
        });
        session.endDialog();
    }
]);

bot.dialog('/profile', [
    function (session, args, next) {
        builder.Prompts.text(session, "What your entry number?");
    },
    function (session, results, next) {
        if (results.response) {
            session.userData.en = results.response.toUpperCase();
            session.userData.name = entry2name(session.userData.en);
            if(session.userData.name === undefined)
            {
                session.send("Invalid Entry Number Given. Please try again");
                session.replaceDialog('/profile');
            }
            else
            {
                var name = session.userData.name.split(" ")[0].toLowerCase();
                session.userData.name = name[0].toUpperCase()+name.substring(1);
                session.send('Hi '+session.userData.name+", Welcome to CampusBot");
                session.endDialog();
            }
        }
        else
        {
            session.endDialog();
        }
    }
]);

bot.dialog('/whois', [
    function (session,args,next) {
      var nameoren = [];
      try{
        nameoren = builder.EntityRecognizer.findAllEntities(args.entities, 'whoisent');
      }
      catch(e)
      {
        nameoren = [];
      }
      if (!nameoren || nameoren.length === 0) {
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
            var attach = [];
            result = whois.priority(result,session.userData.en);
            if(result.length > 4)
            {
                session.send("Your query was too general. Here are top 4 results personalized for you :");
            }
            for(var i=0;i<result.length && i < 4;i++)
            {
                attach.push(
                    new builder.HeroCard(session)
                        .title(result[i].name)
                        .text("Entry - "+result[i].entry+"\n"+"Email - "+result[i].email)
                    );
                // session.send(whois.story(result[i]));
            }
            var msg = new builder.Message(session)
                    .attachments(attach);
            session.send(msg);
        }
        session.endDialog();
    }
]);

bot.dialog('/qna', [
    function (session) {
        builder.Prompts.text(session, 'Ask me anything!');
    },
    function (session, results) {
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
                result = JSON.parse(body);
                result.score = result.score / 100;
                session.send(result.answer);
            }
            );
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
        // var message = new builder.Message(session)
        //     .attachments([{
        //         name: "Question Paper",
        //         contentType: "application/zip",
        //         contentUrl: "https://www.cse.iitd.ernet.in/aces-acm/download/"+ session.userData.en.toUpperCase() + ".zip"
        //     }]);
        //
        var message = new builder.Message(session)
                .attachments([
                    new builder.HeroCard(session)
                        .title("Exam Papers")
                        .subtitle("Magna was never so easy :P")
                        .buttons([builder.CardAction.downloadFile(session,"https://www.cse.iitd.ernet.in/aces-acm/download/"+ session.userData.en.toUpperCase() + ".zip","Download")])
                ]);
        session.endDialog(message);

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
bot.dialog('/developers', [
    function (session) {
        session.send('The Developers are : 1. Aman Agrawal \n2. Suyash Agrawal \n3. Madhur Singhal');
        session.endDialog();
    }
]);

bot.dialog('/exam',[
    function(session)
    {
        builder.Prompts.choice(session,"Select exam","Minor1|Minor2|Major");
    },
    function(session,results)
    {
        if((["MINOR1","MINOR2","MAJOR"]).includes(results.response.entity.toUpperCase()))
        {
            if(!session.userData.en)
            {
                session.beginDialog('/profile');
            }
            var courses = schedule.courses(session.userData.en);
            if(courses)
            {
                var sch = schedule.exam_schedule(results.response.entity,courses.courses);
                if(sch.length === 0)
                {
                    var attach = [];
                    attach.push(
                        new builder.HeroCard(session)
                            .title("Woohoo! No Exams :D")
                            .subtitle("Have fun")
                    );
                    var msg = new builder.Message(session)
                                    .attachments(attach);
                }
                else
                {
                    var week = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
                    for(var day in sch)
                    {
                        var attach = [];
                        var parts = sch[day][0].split("/");
                        var dt = new Date(parseInt(parts[2], 10),
                                          parseInt(parts[1], 10) - 1,
                                          parseInt(parts[0], 10));
                        session.send(dt.toDateString());
                        for(var i=1;i<sch[day].length;i++)
                        {
                            var c = course.get_course(sch[day][i].course);
                            var slot = sch[day][i].slot;
                            attach.push(
                                new builder.HeroCard(session)
                                    .title(c.code+"("+slot+")")
                                    .subtitle(c.name)
                            );
                        }
                        var msg = new builder.Message(session)
                                    .attachments(attach);
                        session.send(msg);
                    }
                }
                session.endDialog();
            }
            else
            {
                session.endDialog("Sorry, some error occurred");
            }
        }
        else
        {
            session.endDialog("You entered an invalid response");
        }
    }
]);

bot.dialog('/complaint', [
    function (session, args, next) {
        if(!session.userData.name){
            builder.Prompts.text(session, "What's your Name?");
        }
        else{
        next();
        }
    },
 function (session,results,next) {
        if (results.response) {
             session.userData.name = results.response;
        }
        if(!session.userData.en){
            builder.Prompts.text(session, "What's your Entry No.?");
        }
        else{
        next();
        }
    },
    function (session,results,next) {
        if (results.response) {
             session.userData.en = results.response;
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

bot.dialog('/events',[
    function(session,args)
    {
        // console.log("EVENTS----------");
        events.get_events(function(result){
            // console.log("answer captured");
            var attach = [];
            result.forEach(function(ev){
                // console.log(ev);
                var card = new builder.ThumbnailCard(session)
                            .title(ev.name)
                            .subtitle(ev.start_time+" - "+ev.end_time)
                            .tap(
                                builder.CardAction.openUrl(session,ev.link)
                            );
                if(ev.cover)
                {
                    card = card.images([builder.CardImage.create(session,ev.cover)]);
                }
                // console.log(card);
                attach.push(card);
            });
            // console.log("answer synthesized");
            // console.log(attach);
            var msg = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(attach);
            // console.log("message synthesized");
            // var story = events.story(result);
            // for(var i=0;i<story.length;i++)
            // {
            //     session.send(story[i]);
            // }
            // session.send(msg);
            // console.log("ending");
            session.endDialog(msg);
        });
    }
]);

bot.dialog('/course',[
    function(session,args,next)
    {
        var coursecode = builder.EntityRecognizer.findEntity(args.entities, 'courseent');
        if (!coursecode) {
              builder.Prompts.text(session,"Give me the course code");
        } else {
            next({ response: coursecode.entity });
        }
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

bot.dialog('/mess',[
    function(session,args,next) {
        session.dialogData.arrr = args;
        builder.Prompts.text(session, "Which Hostel?");
    },
    function(session,results)
    {
        var days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
        var day = undefined;
        try
        {
            var str = session.dialogData.arrr.entities[0].resolution.date;
            if(str.substr(0,9)==="XXXX-WXX-")
            {
                day = days[parseInt(str[9])];
            }
            else if(str.substr(0,4)==="XXXX")
            {
                day = new Date(Date.now()).getFullYear()+str.substr(4);
                day = days[new Date(str).getDay()];
            }
            else
            {
                day = days[new Date(str).getDay()];
            }
        }
        catch(e)
        {
            day = undefined;
        }
        if(day === undefined)
        {
            var dd = new Date(Date.now());
            var day =dd.toLocaleDateString('en-US',{weekday: "long", timeZone: "Asia/Kolkata"});
            day = day.toUpperCase();
        }
        session.dialogData.arrr = undefined;

        if (results.response) {
            session.userData.hostel = results.response;
        }
        var hostel = mess.get_mess_hostel(session.userData.hostel);
        if(hostel!==null)
        {
            var menu_day = mess.get_mess_day(hostel,day);
            var pretty_menu = mess.pretty_mess(menu_day);
            session.send(pretty_menu[0]);
            session.send(pretty_menu[1]);
            session.send(pretty_menu[2]);
        }
        else
        {
            session.userData.hostel = undefined;
            session.send("Invalid Hostel provided!");
        }
        session.endDialog();
    }
]);

bot.dialog('/schedule',[
    function(session,args,next) {
        session.dialogData.arrr = args;
        if (!session.userData.en) {
            builder.Prompts.text(session, "What's your entry number?");
        } else {
            next();
        }
    },
    function(session,results)
    {
        var days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
        var day = undefined;
        // console.log(session.dialogData.arrr.entities);
        try
        {
            var str = session.dialogData.arrr.entities[0].resolution.date;
            if(str.substr(0,9)==="XXXX-WXX-")
            {
                day = days[parseInt(str[9])];
            }
            else if(str.substr(0,4)==="XXXX")
            {
                day = new Date(Date.now()).getFullYear()+str.substr(4);
                day = days[new Date(str).getDay()];
            }
            else
            {
                day = days[new Date(str).getDay()];
            }
        }
        catch(e)
        {
            day = undefined;
        }
        // console.log(day);
        session.dialogData.arrr = undefined;

        if (results.response) {
            session.userData.en = results.response;
        }
        var courses = schedule.courses(session.userData.en);
        if(courses !== undefined)
        {
            var week = schedule.week_schedule(courses.courses);
            // console.log("In Schedule:");
            if(day === undefined)
            {
                // console.log("day is undefined");
                // var sch = schedule.pretty_week(week);

                // for(var i=0;i<sch.length;i++)
                // {
                //     session.send(sch[i]);
                // }

                // console.log("after msg");
                for(var i in week)
                {
                    // console.log("Week - "+i);
                    // console.log(week[i]);
                    var attach = [];
                    if(week[i] !== undefined)
                    {
                        for(var c in week[i])
                        {
                            attach.push(
                                    new builder.ThumbnailCard(session)
                                        .title(week[i][c].course)
                                        .text(week[i][c].location+": "+week[i][c].timing.start+"-"+week[i][c].timing.end)
                            );
                        }
                        // console.log("Sending");
                        var msg = new builder.Message(session)
                            .textFormat(builder.TextFormat.markdown)
                            .attachmentLayout(builder.AttachmentLayout.carousel)
                            .attachments(attach);
                        session.send(i);
                        session.send(msg);
                    }
                }
            }
            else
            {
                // console.log("We have entity - "+day);
                if(["SUNDAY","SATURDAY"].includes(day))
                {
                    session.send(day+" is a holiday!");
                }
                else
                {
                    var attach = [];
                    day = day.toUpperCase();
                    for(var i in week[day])
                    {
                        attach.push(
                            new builder.ThumbnailCard(session)
                                .title(week[day][i].course)
                                .text(week[day][i].location+": "+week[day][i].timing.start+"-"+week[day][i].timing.end)
                            );
                    }
                    // var sch = schedule.pretty_day(day,week[day]);
                    var msg = new builder.Message(session)
                            .attachments(attach);
                    session.send(day);
                    session.send(msg);
                }
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

bot.dialog('/converse', [
    function(session,args,next)
    {
        if(args.in_conv !== "yes")
        {
            builder.Prompts.text(session, "Hi!, what would you like to talk about? (type \"end\" to exit)");
        }
        else
        {
            builder.Prompts.text(session,args.msg);
        }
    },
    function(session,results)
    {
        var check;
        // console.log(results.response);
        if((typeof results.response !== 'undefined') && results.response){
            check = results.response.toUpperCase().trim();
        }
        if(check === "END" || check === "\"END\"")
        {
            session.send("Thank you for chatting :)");
            session.endDialog();
        }
        else
        {

		cleverbot.write(results.response, function (response) {
     		session.endDialog();
                session.beginDialog('/converse',{in_conv: "yes",msg: response.message});
    		});


        }
    }
]);

bot.dialog('/material', [
    function(session) {
        builder.Prompts.choice(session,"Do you want to contribute material or download it?","Download|Contribute|View Repository");
    },
    function(session,results)
    {
        if(results.response.entity.toUpperCase() === "DOWNLOAD")
        {
            session.beginDialog('/download');
        }
        else if(results.response.entity.toUpperCase() === "CONTRIBUTE")
        {
            // console.log("Function was here");
            session.beginDialog('/upload');
        }
        else if(results.response.entity.toUpperCase() === "VIEW REPOSITORY")
        {
            session.beginDialog('/view_repo');
        }
        else
        {
            session.endDialog("You entered an invalid response");
        }
    }
]);

bot.dialog('/upload',[
    function(session,args,next)
    {
        // console.log("still going right");
        builder.Prompts.text(session,"Enter course code of material being uploaded");
    },
    function(session,results)
    {
        // console.log("what happened? = "+results.response);
        session.dialogData.course = results.response;
        if(!dropbox.correct(session.dialogData.course))
        {
            session.endDialog("You entered an invalid course code!");
        }
        else
        {
            builder.Prompts.attachment(session,"Please attach and send the file to be uploaded");
        }
    },
    function(session,results)
    {
        if(results.response.length === 0)
        {
            session.endDialog("You didn't upload any attachment");
        }
        else
        {
            results.response.forEach(
                function(attachment)
                {
                    console.log(attachment);
                    dropbox.put(session.dialogData.course,attachment.contentUrl,function(){console.log("Uploaded");});
                }
            );
        }
        session.endDialog("Thank you for contributing");
    }
]);

bot.dialog('/download',[
    function(session)
    {
        builder.Prompts.text(session,"Enter code of course that you want to download");
    },
    function(session,results)
    {
        session.dialogData.course = results.response;
        if(!dropbox.correct(session.dialogData.course))
        {
            session.endDialog("You entered an invalid course code!");
        }
        else
        {
            try
            {
                dropbox.get(session.dialogData.course,function(link)
                    {
                        // console.log(link);
                        var message = new builder.Message(session)
                                    .attachments([
                                        new builder.HeroCard(session)
                                            .title(link.name)
                                            .subtitle("Course Material")
                                            .buttons([builder.CardAction.downloadFile(session,link.url,"Download")])
                                    ]);
                        session.endDialog(message);
                    });
            }
            catch(e)
            {
                session.endDialog("Sorry, some error occurred :(");
            }

        }
    }
]);

bot.dialog('/view_repo',[
    function(session)
    {
        builder.Prompts.text(session,"Enter code of course that you want to download");
    },
    function(session,results)
    {
        session.dialogData.course = results.response;
        if(!dropbox.correct(session.dialogData.course))
        {
            session.endDialog("You entered an invalid course code!");
        }
        else
        {
            try
            {
                dropbox.list(session.dialogData.course,function(files)
                    {
                        // console.log(link);
                        var attach = [];
                        files.entries.forEach(
                            function(val)
                            {
                                attach.push(
                                    new builder.ThumbnailCard(session)
                                        .title(val.name)
                                        .subtitle(dropbox.convert(val.size))
                                );
                            }
                        );
                        var message = new builder.Message(session)
                                    .attachments(attach);
                        session.endDialog(message);
                    });
            }
            catch(e)
            {
                session.endDialog("Sorry, some error occurred :(");
            }

        }
    }
]);


bot.dialog('/review', [
    function (session, args) {

		builder.Prompts.text(session, "What's the name of the course?");
    },
    function (session, results, next) {
        if (results.response) {
			session.dialogData.cod = results.response;
			if(review.get_course(results.response)===undefined){
				session.send("Invalid response. Say 'review' again to retry.")
                session.endDialog();
			}
            else
            {
                var res = review.get_reviews(results.response);
                if(res===undefined){
                    session.send("Invalid response. Say 'review' again to retry.")
                    session.endDialog();
                }
                else
                {
        			if(res.length==0){
        				session.send("Sorry there are no reviews yet.");
        			}
        			else{
        				session.send("Reviews for this course are - ");
        				for(var i=0;i<res.length;i++){
        					session.send(res[i]);
        				}
        			}
        			builder.Prompts.text(session, "Would you like to add a review for this course?");
                }
            }
        }
        else{
            session.send("Invalid response. Say 'review' again to retry.")
			session.endDialog();
		}
    },
    function (session, results) {
        if (results.response) {
			var rr = results.response;
			rr = rr.toUpperCase();
			if(rr=="YES"||rr=="YEAH"||rr=="Y"){
				builder.Prompts.text(session, "What is your review?");
			}
			else{
                session.send("Okay.");
				session.endDialog();
			}
		}
       // session.endDialog();
    },
	function (session, results) {
		if (results.response) {
            review.record_review(session.dialogData.cod,results.response);
            session.send("Thanks! Your review has been recorded.");
        }
        session.endDialog();
    }
]);


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(8000, function() {
        console.log('test bot endpoint at http://localhost:8000/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() };
}
