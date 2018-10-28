
const path = require('path');
const fs = require('fs');

function searchFilesInDirectory( ext,filter) {
   var dir='./';
   var flag=0;
    if (!ext||!filter||!fs.existsSync(dir)) {
        console.log(`USAGE: node search [ext] [text]`);
        return;
    }
    //files- Contains all files in the current folder.
    const files = fs.readdirSync(dir);
   
    //found-Contains all files with the specific extension and the current directory. 
    const found = getFilesInDirectory(dir, ext);
    
    //Saving the contents of the  requested files within a variable.
    found.forEach(file => {
        const fileContent = fs.readFileSync(file);

        

        // We want full words, so we use full word boundary in regex.
        const regex = new RegExp('\\b' + filter + '\\b');
        if (regex.test(fileContent)) {
            console.log(`Your word was found in file: ${file}`);
            flag=1;
        }

    });
    if(flag===0)
    {
    console.log(`No files found with ${ext} extension and with "${filter}" string`);
    return;
    }

}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectory(dir, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }
    
    //for the found files.
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            if (path.extname(file) === ext) {
                //added to the set of results to be displayed to the user. 
                files.push(filePath);
            }
        }
    });
   
    return files;
}
//Activate the actual function.
searchFilesInDirectory( '.'+process.argv[2],process.argv[3]);