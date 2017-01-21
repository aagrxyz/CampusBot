var fs = require("fs-extra");
var menu_database = (process.env.NODE_ENV=="development")?"./database/menu.json":"D:\\home\\site\\wwwroot\\messages\\database\\menu.json";
var menu_db = JSON.parse(fs.readFileSync(menu_database));

function match_hostel(hostel)
{
	var hostels = ["JWALAMUKHI","ARAVALI","KARAKORAM","NILIGIRI","ZANSKAR","KUMAON","VINDHYACHAL","SHIVALIK","SATPURA","GIRNAR","UDAIGIRI","KAILASH","HIMADRI"];
	hostel=hostel.toUpperCase();
	var no_hostels =hostels.length;
	var max_length = 0;
	var index =-1;
	var element_max_numbers=0;
	for(var i= 0; i<no_hostels;i++)
	{
		var j=0;
		while((j< hostel.length) && (hostel[j] === hostels[i][j]))
		{
			j++;
		}
		if(j>max_length)
		{
			max_length=j;
			index=i;
			element_max_numbers=1;
		}
		else if(j===max_length)
		{
			element_max_numbers++;
		}
		else
		{}
	}
	if(element_max_numbers === 1)
	{
		return hostels[index];
	}
	else
	{
		return null;
	}
}
function get_mess_hostel(hostel)
{
	hostel = match_hostel(hostel);
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