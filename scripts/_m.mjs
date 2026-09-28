import sharp from 'sharp';
const [out, w, cols, ...files] = process.argv.slice(2);
const W=+w; const metas = await Promise.all(files.map(f=>sharp(f).metadata()));
const H = Math.round(metas[0].height * W / metas[0].width);
const C=+cols, rows=Math.ceil(files.length/C);
const comps = await Promise.all(files.map(async (f,i)=>({input: await sharp(f).resize(W,H).toBuffer(), left:(i%C)*(W+6), top:Math.floor(i/C)*(H+6)})));
await sharp({create:{width:C*(W+6),height:rows*(H+6),channels:3,background:'#f0f'}}).composite(comps).jpeg({quality:78}).toFile(out);
