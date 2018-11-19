import { StreamLogger } from 'ual'

const log = new StreamLogger({
    stream: process.stdout,
    colors: true,
})

export default log
