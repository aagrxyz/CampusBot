var FB = require("fb");
FB.setAccessToken('EAACEdEose0cBACIPWxZBX7XwpiVkJJfLIvHK0KrbYpOcCy8Wy5Oju2ZCKYOD8Ct1sTeSTBXZASRthItuRwX5FSBGTMlZBqCxvlNOR1iIYZAgZAZCamHClDBvKgFmNTp6ZAHxByLCNgUkv8QzdHiLK3evxGKrZCMWbJaJDwZCIsutrInygOdNGl4TWCLqOAnawr1U0ZD');
// var page_ids = ["music.iitd","rendezvous.iitd","acesacm"];
var page_ids = ["music.iitd","iitd.delhi","rendezvous.iitd","IITD.tryst","tech.iitd","acesacm","iitdebate","cultureIITD","boardforstudentwelfare","bspiitd","debatingclubiitd","litclub.iitd","ecoclubiitd","ICPC.IITD","iitd.bsa","vortex.iitd","speranza.iitd","BoardforHostelManagementIITDelhi","saciitdelhi","iitd.sportech","Literati.IITD"];

var requests = [];


for (var id in page_ids)
{
    requests.push({method: "get", relative_url: page_ids[id]+"?fields=events.limit(3)"});
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
    for(var i=0;i<events.length && i< 5;i++)
    {
        var event = events[i];
        var start = new Date(event.start_time);
        var end = new Date(event.end_time);
        ans += (event.name+"\n"+start.toDateString()+": "+start.toLocaleTimeString()+" - "+end.toLocaleTimeString()+"\n"+event.location+"\n\n");
    }
    return ans;
}

module.exports = {
    get_events: fetch_events,
    story: make_story
};
