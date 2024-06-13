const { MessageAttachment, MessageEmbed } = require('discord.js');
const qr = require('qr-image');

module.exports = {
    execute : "",
    category: 'member',
    name: 'generarqr',
    description: 'Genera un código QR a partir de un texto proporcionado.',
    execute(message, args) {
        // Obtener el texto para convertir en código QR
        const texto = args.join(' ');

        // Generar el código QR
        const qrImage = qr.imageSync(texto, { type: 'png' });

        // Crear un objeto de adjunto del código QR
        const qrAttachment = new MessageAttachment(qrImage, 'qr-code.png');

        // Crear el mensaje incrustado con el código QR y el texto
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Código QR Generado')
            .setDescription(`Aquí tienes el código QR para el texto: ${texto}`)
            .setImage('attachment://qr-code.png')
            .setFooter('Powered by MercuGmes');

        // Enviar el mensaje incrustado con el código QR
        message.channel.send({ embeds: [embed], files: [qrAttachment] })
            .catch(error => {
                console.error('Error al enviar el código QR:', error);
                message.channel.send('Hubo un error al generar el código QR.');
            });
    },
};
