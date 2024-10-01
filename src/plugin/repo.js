import config from '../../config.cjs';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const timeString = `${String(days).padStart(2, '0')}-${String(hours).padStart(2, '0')}-${String(minutes).padStart(2, '0')}-${String(seconds).padStart(2, '0')}`;
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (['repo', 'sc', 'deploy'].includes(cmd)) {
    const width = 800;
    const height = 500;
    const image = new Jimp(width, height, 'yellow');
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const textMetrics = Jimp.measureText(font, timeString);
    const textHeight = Jimp.measureTextHeight(font, timeString, width);
    const x = (width / 2) - (textMetrics / 2);
    const y = (height / 2) - (textHeight / 2);
    image.print(font, x, y, timeString, width, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    const uptimeMessage = `*𝙹𝙾𝚎𝚕 𝙼𝙳 𝚁𝙴𝙿𝙾*
╭❐
┇ creator:𝙹𝙾𝚎𝚕 𝚃𝚎𝚌𝚑
┇ repo
┇ https://github.com/joeljamestech/JOEL-MD
╰❑
`;
    
    const buttons = [
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "𝚘𝚠𝚗𝚎𝚛",
          id: `${prefix}owner`
        })
      },
      {
        "name": "quick_reply",
        "buttonParamsJson": JSON.stringify({
          display_text: "𝙶𝚒𝚝𝙷𝚞𝚋",
          id: `https://github.com/joeljamestech/JOEL-MD`
        })
      }
    ];

    const msg = generateWAMessageFromContent(m.from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: uptimeMessage
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "𝚙𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝙹𝙾𝚎𝚕 𝚔𝚊𝚗𝚐'𝚘𝚖𝚊"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              ...(await prepareWAMessageMedia({ image: buffer }, { upload: Matrix.waUploadToServer })),
              title: ``,
              gifPlayback: false,
              subtitle: "",
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            }),
            contextInfo: {
              quotedMessage: m.message,
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '255714595078@s.whatsapp.net',
                newsletterName: "JOel",
                serverMessageId: 143
              }
            }
          }),
        },
      },
    }, {});

    await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id
    });
  }
};

export default alive;