
class TicketsManager {
    constructor() {
        this.ticketJSON = "tickets.json"
    }

    //////////////////////////////// GET TICKETS
    getTickets = async () => {
        if(fs.existsSync(this.ticketJSON)) {
            const data = await fs.promises.readFile(this.ticketJSON, 'utf8');
            const tickets = JSON.parse(data)
            return tickets
        } else {
            return []
        }
    }
}

module.exports = TicketsManager