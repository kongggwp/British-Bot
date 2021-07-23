var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        handless: true
    }
})

module.export ={
    name: 'image',
    description: 'this sends an image to a discord text channel',
    async execute(client, message, args){
        const image_query = args.join(' ');
        if(!image_query) return message.channel.send('Please enter an image name');

        const image_result = await google.scrape(image_query, 1);
        message.channel.send(image_result[0].url);
    }
}