// requirements
const Nanoid = require("nanoid");
const sleep = require("system-sleep");
const Dropbox = require("dropbox").Dropbox;
const modulesList = require("./modulesList.json")
require("isomorphic-fetch");
require("dotenv").config();

// require addModule files
const honeyJar = require("./addModules/honeyJar")

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
module.exports.dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });;

// function to create folder
function createFolder (folderPath) {
    dbx.filesCreateFolderV2({path: folderPath})
    .then(function(response) {
    console.log(response);
    })
    .catch(function(error) {
    console.error(error);
	});
	// sleep to avoid namespace lock contentions
	sleep(100);
}

// delcare values for lists of modules
const mainModules = modulesList.mainModules

// delcare constant for folders that need to be created in a pack
const skeletonFoldersToCreate = [
	"textures/item",
	"textures/block"
]

// compilePack function that gets exported to app.js
module.exports.compilePack  = function(requestBody) {

	// generate id
    id = Nanoid.nanoid(4)
    console.log("id="+id)
	
	// create value for invidual pack path
	const packPath = `/packs/${id}`
	console.log("pack path = "+packPath)

	// create pack folder
	createFolder(packPath);
	
	// create skeleton folder structure
	for (i in skeletonFoldersToCreate) {createFolder(packPath+"/assets/minecraft/"+ skeletonFoldersToCreate[i])}

	// go through every available module, and if it is included in the request body, run the function to add it
	if ( requestBody.modules.includes ("honeyJar") ) {
		console.log("yes honey jar")
		honeyJar.addModule(packPath)
	} else {
		console.log("no honey jar")
	}

	// temp
	//honeyJar.addModule(packPath)
	
}