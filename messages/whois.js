var jsonFile = "database/name_database.json";
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

module.exports = get_data;
