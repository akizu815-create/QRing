// Header inspection only; never decode, transform or rewrite an illustration.
module.exports=function imageSize(b){
 if(b.length>=24 && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return [b.readUInt32BE(16),b.readUInt32BE(20)];
 if(b.length>=30 && b.subarray(0,4).toString()==='RIFF' && b.subarray(8,12).toString()==='WEBP'){
  const type=b.subarray(12,16).toString();
  if(type==='VP8X')return [1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];
  if(type==='VP8 ')return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];
  if(type==='VP8L'){const bits=b.readUInt32LE(21);return [(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];}
 }
 if(b[0]===255 && b[1]===216){
  let p=2;
  while(p+8<b.length){
   if(b[p++]!==255)break;while(b[p]===255)p++;
   const marker=b[p++];if(marker===0xd9||marker===0xda)break;
   if(marker===0x01||(marker>=0xd0&&marker<=0xd8))continue;
   if(p+7>=b.length)break;
   const size=b.readUInt16BE(p);
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))return [b.readUInt16BE(p+5),b.readUInt16BE(p+3)];
   if(size<2)break;p+=size;
  }
 }
 throw new Error('Cannot read PNG/JPEG/WebP dimensions');
};
