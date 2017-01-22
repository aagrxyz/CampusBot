
var fs = require("fs-extra");
var request = require("request");
var rev_db = (process.env.NODE_ENV=="development")?"./database/reviews.json":"D:\\home\\site\\wwwroot\\messages\\database\\reviews.json";
var rev = JSON.parse(fs.readFileSync(rev_db));
var droptoken = process.env['dropboxaccess'];

function list_files(code)
{
    if(!(code in rev))
    {
      return -1;
    }
    code = code.toUpperCase();  
    var toret;
    var options = { method: 'POST',
    url: 'https://api.dropboxapi.com/2/files/list_folder',
    headers: 
    { 'postman-token': 'f16cbbcd-7149-ba6b-08f4-9cffc33a14be',
       'cache-control': 'no-cache',
       'content-type': 'application/json',
       authorization: 'Bearer ' +droptoken },
    body: 
    { path: '/courses/' +code,
       recursive: false,
       include_media_info: false,
       include_deleted: false,
       include_has_explicit_shared_members: false },
    json: true };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    toret = body
    console.log(body);
    });
    return toret;
}

function get_files(code)
{
	if(!(code in rev))
    {
      return -1;
    }
    var urlr;
	var options = { method: 'POST',
    url: 'https://api.dropboxapi.com/2/sharing/list_shared_links',
    headers: 
    {     
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: 'Bearer '+droptoken },
        body: { path: '/courses/'+code },
        json: true };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(body.links.length==0){
    	  flag = true;
        }
        else{
    	  urlr = body.links[0];
    	  flag = false ;
        }
        console.log(body);
    });	
    if(flag)
    {	
        var options = 
        { 
            method: 'POST',
            url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                authorization: 'Bearer '+droptoken 
            },
            body: 
            { 
                path: '/courses/'+code,
                settings: { requested_visibility: 'public' } 
            },
                json: true 
        };
        request(options, function (error, response, body) 
        {
            if (error) throw new Error(error);
            console.log(body);
        });
        urlr = body.url;
    }
return urlr;
}

function put_file(code,file){
var fname="bkjbkjb";
code="AMD310";
code = code.toUpperCase();  
var b = file;
var options = { method: 'POST',
  url: 'https://content.dropboxapi.com/2/files/upload',
  headers: 
   { 'postman-token': '8d510110-2ea7-2c11-ad10-55e0098a2732',
     'cache-control': 'no-cache',
     'dropbox-api-arg': '{     \\"path\\": \\"/courses/'+code+'/'+fname+'\\",     \\"mode\\": \\"add\\",     \\"autorename\\": true,     \\"mute\\": false }',
     'content-type': 'application/octet-stream',
     authorization: 'Bearer ' + droptoken }
	body: b};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  
});
return true;
}
module.exports = {
	list_files : list_files,
	get_files : get_files,
	put_file : put_file
};