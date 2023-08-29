import * as fs from 'fs';
export const saveLogs = (object:object,filePath:string) => {
    try {
        const content = "//This was generated on "+new Date().toLocaleDateString()+"\n"+JSON.stringify(object, null, 2);  // The 'null, 2' parameters add formatting to the output.
        fs.writeFileSync(filePath, content);
        console.log(`Successfully wrote object to ${filePath}`);
    } catch (error) {
        console.error('Error writing object to file:', error);
    }
}
