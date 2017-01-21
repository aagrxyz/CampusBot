var fs = require("fs-extra");
var course_db_file = (process.env.NODE_ENV=="development")?"./database/courses.json":"D:\\home\\site\\wwwroot\\messages\\database\\courses.json";
var course_db = JSON.parse(fs.readFileSync(course_db_file));
var course_prof_db_file = (process.env.NODE_ENV=="development")?"./database/course_prof.json":"D:\\home\\site\\wwwroot\\messages\\database\\course_prof.json";
var course_prof_db = JSON.parse(fs.readFileSync(course_prof_db_file));
function get_course(code)
{
	code = code.toUpperCase();
	if(code in course_db)
	{
		var temp = course_db[code];
		temp.professor = course_prof_db[code].professor;
		return temp;
	}
	else
	{
		return undefined;
	}
}

function pretty_course(course)
{
	if(course === undefined)
	{
		return "";
	}
	else
	{
		var pretty = course.name+" ["+course.code+"]\n\nCredit = "+course.credit+"\n\nStructure = "+course.structure + "\n\nCourse Coordinator: " + course.professor;
		return pretty;
	}
}

module.exports = {
	get_course: get_course,
	pretty_course: pretty_course
};