const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const canvas = createCanvas(167, 250);
const ctx = canvas.getContext('2d');

const cards = [];

const indexes = require('./indexes.json');
const config = require('./drawings.json');
const fr = require('./fr.json');

loadImage('cards.png').then((image) => {
	for (let r = 0; r < 7; r++) {
		for (let c = 0; c < 15; c++) {
			const card = indexes[r][c];
			if (!card) {
				continue;
			}

			const type = card.split('-')[0];
			const filename = (card.split('-')[1] ?? card) + '.png';
			const count = card.split('-')[2];
			const smiles = card.split('-')[3];
			const diploma = card.split('-')[4];
			const salary = card.split('-')[5];

			ctx.drawImage(image, c * 167, r * 250, 167, 250, 0, 0, 167, 250);

			if (type) {
				if (fr[r] && fr[r][c] && config[type]) {
					const trad = fr[r][c];
					const texts = trad.split(':');

					const fonts = config[type].texts;

					fonts.forEach((font, i) => {
						ctx.font = font.split(',')[0];
						ctx.fillStyle = font.split(',')[1];

						let x;
						if (font.split(',')[2]) {
							x = font.split(',')[2];
						} else {
							const width = ctx.measureText(texts[i]).width;
							x = (canvas.width - width) / 2;
						}

						ctx.fillText(texts[i], x, font.split(',')[3]);
					});

					for (let i = 0; i < count; i++) {
						cards.push({
							type: type,
							smiles: smiles,
							file: filename,
							diploma: diploma,
							salary: salary
						});
					}
				}
			}

			fs.writeFileSync('cards/' + filename, canvas.toBuffer());
		}
	}
	
	fs.writeFileSync('cards.json', JSON.stringify(cards));

	console.log(cards.length + ' cards');
});
