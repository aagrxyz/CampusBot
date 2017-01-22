var fs = require("fs-extra");
var request = require("request");
var course_database = (process.env.NODE_ENV=="development")?"./database/courses.json":"D:\\home\\site\\wwwroot\\messages\\database\\courses.json";
var course_db = JSON.parse(fs.readFileSync(course_database));
var droptoken = process.env['dropboxaccess'];
var requestP = require("request-promise").defaults({encoding:null});


function list_files(code,callback) {
    code = code.toLowerCase().trim();
    if(!(code.toUpperCase() in course_db))
    {
      return -1;
    }
    code = code.toLowerCase();
    var toret;
    var options = {
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/files/list_folder',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: 'Bearer ' + droptoken
        },
        body: {
            path: '/courses/' + code,
            recursive: false,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        },
        json: true
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        toret = body;
        console.log(body);
        callback(toret);
    });
}

function get_files(code,callback) {
    if(!(code.toUpperCase() in course_db))
    {
        return -1;
    }
    code = code.toLowerCase().trim();
    var urlr;
    var options = {
        method: 'POST',
        url: 'https://api.dropboxapi.com/2/sharing/list_shared_links',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: 'Bearer ' + droptoken
        },
        body: {
            path: '/courses/' + code
        },
        json: true
    };
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        if (body.links.length === 0) {
            flag = true;
        } else {
            urlr = body.links[0];
            flag = false;
        }
        if (flag) {
            var options = {
                method: 'POST',
                url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + droptoken
                },
                body: {
                    path: '/courses/' + code,
                    settings: {
                        requested_visibility: 'public'
                    }
                },
                json: true
            };
            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                // console.log(body);
            });
            urlr = body.url;
        }
        // console.log(body);
        callback(urlr);
    });
}

function put_file(code, file, callback,name) {
    code = code.toLowerCase().trim();
    if(!name)
    {
        name = file.split('/');
        name = name[name.length-1].split('?')[0];
    }
    var fileDownload = requestP(file);
    code = code.toLowerCase();

    if(!(code in course_db))
    {
        return -1;
    }

    fileDownload.then(
        function (response) {
            var dic = {};
            dic.path = '/courses/' + code + '/' + name;
            dic.mode = 'add';
            dic.autorename = true;
            dic.mute = false;

            var options = {
                method: 'POST',
                url: 'https://content.dropboxapi.com/2/files/upload',
                headers: {
                    'cache-control': 'no-cache',
                    'dropbox-api-arg': JSON.stringify(dic),
                    'content-type': 'application/octet-stream',
                    authorization: 'Bearer ' + droptoken
                },
                body: response
            };

            request(options, function(error, response, body) {
                if (error) throw new Error(error);
                callback();
            });
        }
    ).catch(function (err) {
        console.log(err);
    });
}

function correct_code(code)
{
    if(code)
    {
        code = code.toUpperCase().trim();
        return (code in course_db);
    }
    return false;
}

function formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
}

module.exports = {
    list: list_files,
    get: get_files,
    put: put_file,
    correct: correct_code,
    convert: formatBytes
};