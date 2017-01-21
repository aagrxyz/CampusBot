var fs = require("fs-extra");
var menu_database = (process.env.NODE_ENV=="development")?"./database/menu_database.json":"D:\\home\\site\\wwwroot\\messages\\database\\menu.json";

var menu_db = JSON.parse(fs.readFileSync(menu));

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