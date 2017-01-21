var FB = require("fb");
FB.setAccessToken(process.env.ACCESS_TOKEN);
var page_ids = ["music.iitd","rendezvous.iitd","acesacm"];
var page_ids = [
"music.iitd",           //Music Club
"iitd.delhi",           //IIT Delhi
"rendezvous.iitd",      //Rendezvous
"IITD.tryst",           //Tryst
"tech.iitd",            //Dev Club
"acesacm",              //Aces Acm
"iitdebate",            //Debate
"cultureIITD",          //BRCA
"boardforstudentwelfare",//BSW
"bspiitd",              //BSP
"debatingclubiitd",     //Debating Club
"litclub.iitd",         //Lit Club
"ecoclubiitd",          //Economics Club
"ICPC.IITD",            //ICPC
"iitd.bsa",             //BSA
"vortex.iitd",          //Vortex
"speranza.iitd",        //Speranza
"BoardforHostelManagementIITDelhi", //BHM
"saciitdelhi",          //SAC
"iitd.sportech",        //Sportech
"Literati.IITD",         //Literati
"enactusiitdelhi",       //enactus
"edciitdelhi",          //EDC
"eesiitd",              //EES
"igemiitdelhi",         //IGEM
"photographyandfilmclubiitdelhi",   //PFC
"maths.society.iitd",      //Math Society
"kaizeniitd4society",      //Kaizen
"PhysicsAndAstronomyIITD",  //Astronomy
"hindisamiti.iitdelhi",     //Hindi Samiti
"danceanddramaticsclubiitd", //Dance And Drama
"Athletics-IIT-Delhi-1552703724944013", //Athletics
"smp.iitd",             //smp
"DanceClub.IITDelhi",   //Dance
"wellnessclubiitd",     //wellness club
"iitd.qc",              //Quizzing
"SPIC.MACAY.IITD",      //Spic Macay
"AAIPIITD"            //Alumni Association
];

// var page_ids = [
//     "IITD.tryst"
//     ];

var requests = [];

for (var id in page_ids)
{
    requests.push({method: "get", relative_url: page_ids[id]+"?fields=events.limit(4){cover,name,start_time,end_time,place,id}"});
}

function fetch_events(callback)
{
    var dic_events = {};
    FB.api('','post',{batch:requests},function(res){
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        for(var i=0;i<res.length;i++)
        {
            try
            {
                event = (JSON.parse(res[i].body));
                for (var ev =0;ev<event.events.data.length;ev++)
                {
                    // console.log("-------------");
                    var eve = event.events.data[ev];
                    eve.start = new Date(eve.start_time);
                    eve.end = new Date(eve.end_time);
                    var parsed_event = {};
                    try
                    {
                        parsed_event.cover = eve.cover.source;
                    }
                    catch(e)
                    {
                        parsed_event.cover = undefined;
                    }
                    parsed_event.name = eve.name;
                    parsed_event.start_time = eve.start.toLocaleDateString('en-US',{weekday: "short", day: "2-digit", month: "short",hour: "numeric",minute: "numeric",timeZone: "Asia/Kolkata"});
                    try
                    {
                        parsed_event.end_time = eve.end.toLocaleDateString('en-US',{weekday: "short", day: "2-digit", month: "short",hour: "numeric",minute: "numeric",timeZone: "Asia/Kolkata"});
                    }
                    catch(e)
                    {
                        parsed_event.end_time = "";
                    }
                    parsed_event.place = eve.place.name;
                    parsed_event.link = "https://www.facebook.com/events/"+eve.id;
                    if (Date.parse(eve.start_time) > Date.now() || Date.parse(eve.end_time) > Date.now())
                    {
                        dic_events[eve.id] = parsed_event;
                    }
                }
            }
            catch(e)
            {
                // console.log("Empty result");
            }
        }
        var events = [];
        for(var key in dic_events)
        {
            events.push(dic_events[key]);
        }
        
        events.sort(function(a, b){
            var cmp = Date.parse(a.start_time) - Date.parse(b.start_time);
            if(cmp < 0) return -1;
            if(cmp > 0) return 1;
            return 0;
        });
        // console.log('E---------E------E');
        callback(events);
    });
}

function make_story(events)
{
    var ans = [];
    for(var i=0;i<events.length && i< 6;i++)
    {
        var event = events[i];
        var start = new Date(event.start_time);
        var end = new Date(event.end_time);
        try
        {
            ans.push(event.name+"\n"+start+" - "+end+"\n"+event.place+"\n\n"+"Link- "+event.link);
        }
        catch(e)
        {
            console.log("-----------------------------");
            console.log(event);
            console.log(e);
            console.log("-----------------------------");
            
        }
    }
    return ans;
}

module.exports = {
    get_events: fetch_events,
    story: make_story
};
