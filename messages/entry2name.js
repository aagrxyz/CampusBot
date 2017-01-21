var fs = require("fs-extra");
var name_db = (process.env.NODE_ENV=="development")?"./database/name_database.json":"D:\\home\\site\\wwwroot\\messages\\database\\name_database.json";
 
var name_database = JSON.parse(fs.readFileSync(name_db));

function get_name(name)
{
	name = name.toUpperCase().trim();
	if(name in name_database)
	{
		return name_database[name];
	}
	return undefined;
}

module.exports = get_name;