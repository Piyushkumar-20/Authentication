import {createServer} from "node:http"
import {createExpressApp} from './app'

async function main(){
    try{
        const server = createServer(createExpressApp())

        const PORT: number = 8080

        server.listen (PORT, () => {
            console.log(`HTTP server is running on PORT ${PORT}`)
        })
    } catch (error){
        console.log("Error starting HTTP Server")
        throw error
    }
}

main()