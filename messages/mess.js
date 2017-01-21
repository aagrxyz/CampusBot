var fs = require("fs-extra");
var menu_database = (process.env.NODE_ENV=="development")?"./database/menu.json":"D:\\home\\site\\wwwroot\\messages\\database\\menu.json";
var menu_db = JSON.parse(fs.readFileSync(menu_database));

function get_mess_hostel(hostel)
{
	hostel = hostel.toUpperCase();
	if(hostel in menu_db)
	{
		return menu_db[hostel];
	}
	else
	{
		return null;
	}
}

function get_mess_day(hostel,day)
{
	day = day.toUpperCase();
	if(day in hostel)
	{
		return hostel[day];
	}
	return null;
}
function pretty_mess(menu)
{
	if(menu === undefined)
	{
		return [];
	}
	else
	{
		var pretty= [];
		pretty[0]= "BREAKFAST: " + menu['BREAKFAST'][0];
		pretty[1]= "LUNCH: " + menu['LUNCH'][0];
		pretty[2]= "DINNER: " + menu['DINNER'][0];
		return pretty;
	}
}

module.exports = {
	get_mess_hostel : get_mess_hostel,
	get_mess_day : get_mess_day,
	pretty_mess : pretty_mess
};