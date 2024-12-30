import express from 'express';
import { DotLottie } from '@dotlottie/dotlottie-js';
import multer from 'multer';

const app = express();
const port = process.env.PORT || 3000;

// Configuração do multer para lidar com o upload do arquivo JSON
const upload = multer();

app.post('/convert', upload.single('lottieFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    // Lê o conteúdo do arquivo JSON
    const lottieJSON = JSON.parse(req.file.buffer.toString());

    // Cria uma nova instância do DotLottie
    const dotLottie = new DotLottie();

    // Adiciona a animação ao arquivo dotLottie
    await dotLottie.addAnimation({
      id: 'animation',
      data: lottieJSON
    });

    // Gera o arquivo dotLottie
    const dotLottieFile = await dotLottie.build();

    // Configura os headers da resposta
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=animation.lottie');

    // Envia o arquivo
    res.send(Buffer.from(dotLottieFile));

  } catch (error) {
    console.error('Erro ao converter arquivo:', error);
    res.status(500).json({ error: 'Erro ao processar o arquivo' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
