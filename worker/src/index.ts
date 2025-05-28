import { createClient } from 'redis';
import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const client = createClient();
const pubClient = createClient();

async function processSubmission(submission: any) {
    const { code, language, roomId, submissionId, input } = JSON.parse(submission);

    console.log(`Processing submission for room id: ${roomId}, submission id: ${submissionId}`);

    const codeDir = path.resolve(`./tmp/user-${Date.now()}`);
    await fs.mkdir(codeDir, { recursive: true });


    let codeFilePath = "";
    let dockerCommand = "";

    const inputFilePath = path.join(codeDir, "input.txt");


    try {
        await fs.writeFile(inputFilePath, input, "utf8");

        switch (language) {
            case "javascript":
                codeFilePath = path.join(codeDir, "userCode.js");
                await fs.writeFile(codeFilePath, code);

                dockerCommand = `docker run --rm --memory="256m" --cpus="1.0" --pids-limit 100 -v "${codeDir.replace(
                    /\\/g,
                    "/"
                )}:/usr/src/app" node:18 sh -c "node /usr/src/app/${path.basename(
                    codeFilePath
                )} /usr/src/app/input.txt"`;
                break;

            case "python":
                codeFilePath = path.join(codeDir, "userCode.py");

                await fs.writeFile(codeFilePath, code);

                dockerCommand = `docker run --rm --memory="256m" --cpus="1.0" --pids-limit 100 -v "${codeDir.replace(
                    /\\/g,
                    "/"
                )}:/usr/src/app" python:3.9 sh -c "python /usr/src/app/${path.basename(
                    codeFilePath
                )} /usr/src/app/input.txt"`;
                break;

            case "cpp":
                codeFilePath = path.join(codeDir, "userCode.cpp");
                await fs.writeFile(codeFilePath, code);
                dockerCommand = `docker run --rm --memory="256m" --cpus="1.0" --pids-limit 100 \
-v "${codeDir.replace(/\\/g, "/")}:/usr/src/app" gcc:11  \
sh -c "g++ /usr/src/app/userCode.cpp -o /usr/src/app/a.out && /usr/src/app/a.out < /usr/src/app/input.txt"`;

                break;

            case "go":
                codeFilePath = path.join(codeDir, "userCode.go");
                await fs.writeFile(codeFilePath, code);
                dockerCommand = `docker run --rm --memory="256m" --cpus="1.0" --pids-limit 100 -v "${codeDir}:/usr/src/app" golang:1.18 sh -c "go run /usr/src/app/userCode.go < /usr/src/app/input.txt"`;
                break;
                
            default: throw new Error("Unsupported language");     
        }
    }catch(e){
        console.error("Failed to prepare code file or Docker command",e);
        return;
    }

    exec(dockerCommand,async(error,stdout,stderr)=>{
        let result = stdout || stderr;
        if(error){
            result = `Error: ${error.message}`;
        }

        console.log(`Result for room ${roomId}: ${result}`);

        try{
            await pubClient.publish(roomId,result);
        }catch(e){
            console.error("Failed to publish result to Redis,", e)
        }

        try{
            await fs.rm(codeDir,{recursive:true,force:true});
        }catch(cleanupError){
            console.error("Failed to clean up directory:", cleanupError);
        }
    })
}

async function main() {
    try {
        await client.connect();
        await pubClient.connect();

        console.log("Redis Client Connected");

        while (true) {
            const submission = await client.brPop("problems", 0);

            console.log("Processing submission...");

            if(submission){
                await processSubmission(submission.element);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

main();
