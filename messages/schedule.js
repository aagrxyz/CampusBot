// var csv = require("fast-csv");
// var fs = require("fs");
// var course_database = {};

// csv.fromPath("./database/course_database.csv")
// .on("data", function(data){
//     data = data.map(function(a){return a.toUpperCase().trim();});
//     var courses = data[1].split('/').map(function(a){return a.toUpperCase().trim();});
//     for(var i=0;i<courses.length;i++)
//     {
//         if(!(courses[i]in course_database))
//         {
//             course_database[courses[i].trim()] = {};
//         }
//         course_database[courses[i].trim()][data[0].trim()] = data[2].trim();
//     }
// }).on("end", function(){
//     console.log("done");
//     var str = JSON.stringify(course_database,null,4);
//     fs.writeFile('course_database.json', str, function (err) {
//       if (err) throw err;
//       console.log('It\'s saved!');
//     });
// });

// module.exports = course_database;

var fs = require("fs-extra");
var course_db = (process.env.NODE_ENV=="development")?"./database/course_database.json":"D:\\home\\site\\wwwroot\\messages\\database\\course_database.json";
var slot_db = (process.env.NODE_ENV=="development")?"./database/slot_database.json":"D:\\home\\site\\wwwroot\\messages\\database\\slot_database.json";
var course_list_db = (process.env.NODE_ENV=="development")?"./database/data_base.json":"D:\\home\\site\\wwwroot\\messages\\database\\data_base.json";
 
var course_database = JSON.parse(fs.readFileSync(course_db));
var slot_database = JSON.parse(fs.readFileSync(slot_db));
var course_list = JSON.parse(fs.readFileSync(course_list_db));


/* pass an object containing fields course and slot */
function get_class_schedule(course)
{
    var slot = course.slot.toUpperCase().trim();
    course = course.course.toUpperCase().trim();
    if(course in course_database && slot in course_database[course])
    {
        return {"location": course_database[course][slot], "timing": slot_database[slot]};
    }
    else
    {
        return undefined;
    }
}

function get_day_schedule(day,courses)
{
    day = day.toUpperCase();
    var schedule = [];
    for(var i=0;i<courses.length;i++)
    {
        var sch = get_class_schedule(courses[i]);
        if(sch !== undefined && day in sch.timing)
        {
            schedule.push({"course":courses[i].course.toUpperCase().trim(),"slot":courses[i].slot.toUpperCase().trim(),"location":sch.location,"timing":sch.timing[day]});
        }
    }
    schedule.sort(function(a,b)
    {
        return a.timing.start.localeCompare(b.timing.start);
    });
    return schedule;
}

function get_courses(number)
{
    number = number.toUpperCase();
    if(number in course_list)
    {
        var res = course_list[number];
        res.entry = number;
        return res;
    }
    else
    {
        return undefined;
    }
}

function get_week_schedule(courses)
{
    var week = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"];
    var schedule = {};
    for(var i=0;i<week.length;i++)
    {
        schedule[week[i]] = get_day_schedule(week[i],courses);
    }
    return schedule;
}

function pretty_day_schedule(day,schedule)
{
    if(schedule !== undefined)
    {
        day = day.toUpperCase();
        pretty = day+":\n\n";
        for(var i=0;i<schedule.length;i++)
        {
            pretty+= schedule[i].course+"("+schedule[i].slot+") : "+schedule[i].location+" => "+schedule[i].timing.start+"-"+schedule[i].timing.end+"\n\n";
        }
        return pretty;
    }
    else
    {
        return "";
    }
}

function pretty_schedule(schedule)
{
    var str = "";
    for(var i=0;i<schedule.length;i++)
    {
        str+= schedule[i].course+"("+schedule[i].slot+") : "+schedule[i].location+" \n\t"+schedule[i].timing.start+"-"+schedule[i].timing.end+"\n";
    }
    return str;
}

function pretty_week_schedule(schedule)
{
    if(schedule !== undefined)
    {
        var pretty_sch = [];
        for(var i in schedule)
        {
            if(schedule[i] !== undefined)
            {
                pretty_sch.push(pretty_day_schedule(i,schedule[i]));
            }
            else
            {
                pretty_sch.push("");
            }
        }
        return pretty_sch;
    }
    else
    {
        return [];
    }
}

module.exports = {
    "courses" : get_courses,
    "week_schedule" : get_week_schedule,
    "day_schedule" : get_day_schedule,
    "class_schedule" : get_class_schedule,
    "pretty_week" : pretty_week_schedule,
    "pretty_day" : pretty_day_schedule,
    "pretty_schedule": pretty_schedule
};