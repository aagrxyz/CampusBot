var jsonFile = (process.env.NODE_ENV=="development")?"./database/name_database.json":"D:\\home\\site\\wwwroot\\messages\\database\\name_database.json";
var fs = require("fs-extra");
var database_file = fs.readFileSync(jsonFile);
var database = JSON.parse(database_file);

function getmail(entry)
{
	return entry.substr(4,3).toLowerCase()+entry.substr(2,2)+entry.substr(7,4)+"@iitd.ac.in";
}

function synthesize(entry,name)
{
	return {
		"name":name,
		"entry": entry,
		"email": getmail(entry)
	};
}



function sort_priority(result,en) 
{
	var temp = [];
	if(en===undefined)
		return result;
	en = en.toUpperCase();
	var year = en.substr(0,4);
	var dept = en.substr(4,2).toUpperCase();
	var j=0;
	for(var i =0;i<result.length;i++)
	{
		if(result[i]['entry'].substr(0,4)===year)
		{
			temp[j++]=result[i];
		}
	}
	j=0;
	var temp1=[];
	for(var i=0;i<temp.length;i++)
	{
		if(temp[i]['entry'].substr(4,2)===dept)
		{
			temp1[j++]=temp[i];
		}
	}
	var ans =[];
	j=0;
	for(var i=0;i<temp1.length;i++)
	{
		ans[j++]=temp1[i];	
	}
	for(var i=0;i<temp.length;i++)
	{
		if(!ans.includes(temp[i]))
		{
			ans[j++]=temp[i];
		}
	}
	for(var i=0;i<result.length;i++)
	{
		if(!ans.includes(result[i]))
		{
			ans[j++]=result[i];
		}
	}
	return ans;	
}

function match(query, key, name)
{
	name = name.toUpperCase().replace(/\s\s+/g, ' ');
	query = query.toUpperCase().replace(/\s\s+/g, ' ');
	if(query === key)
	{
		return true;
	}

	if(query.length > 2 && (query == name || name.split(" ").includes(query)))
	{
		return true;
	}
	return false;
}


function get_data(name) {
	var result = [];
	name = name.toUpperCase();
	for (var key in database)
	{
		if(match(name,key,database[key]))
		{
			result.push(synthesize(key,database[key]));
		}
	}
	return result;
}

function make_story(data) {
	return data.name+"\n\nEntry No. "+data.entry+"\n\nContact at - "+data.email+"\n\n";
}

module.exports = {
	identify: get_data,
	story: make_story,
	priority: sort_priority
};
