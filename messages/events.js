var FB = require("fb");
FB.setAccessToken(process.env.ACCESS_TOKEN);
// var page_ids = ["music.iitd","rendezvous.iitd","acesacm"];
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
var requests = [];

for (var id in page_ids)
{
    requests.push({method: "get", relative_url: page_ids[id]+"?fields=events.limit(4)"});
}

function fetch_events(callback)
{
    var events = [];
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
                    var eve = event.events.data[ev];
                    if (Date.parse(eve.end_time) > Date.now())
                    {
                        events.push(eve);
                    }
                }
            }
            catch(e)
            {
                // console.log("Empty result");
            }
        }
        events.sort(function(a, b){
            var cmp = Date.parse(a.end_time) - Date.parse(b.end_time);
            if(cmp < 0) return -1;
            if(cmp > 0) return 1;
            return 0;
        });
        callback(events);
    });
}

function make_story(events)
{
    var ans = "";
    for(var i=0;i<events.length && i< 6;i++)
    {
        var event = events[i];
        var start = new Date(event.start_time);
        var end = new Date(event.end_time);
        ans += (event.name+"\n"+start.toDateString()+": "+start.toLocaleTimeString()+" - "+end.toLocaleTimeString()+"\n"+event.place.name+"\n"+"Link- facebook.com/events/"+event.id+"\n\n");
    }
    return ans;
}

module.exports = {
    get_events: fetch_events,
    story: make_story
};
