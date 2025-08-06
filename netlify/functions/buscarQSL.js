const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.handler = async (event) => {
  try {
    const callSign = event.queryStringParameters?.callSign;

    if (!callSign) {
      console.warn("❗ Indicativo no proporcionado");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Indicativo no proporcionado" })
      };
    }

    console.log(`🔍 Buscando imágenes para: ${callSign}`);

    const result = await cloudinary.search
      .expression(`folder=qsl/${callSign}`) // Asegurate que el folder sea correcto
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    if (!result.resources || result.resources.length === 0) {
      console.warn(`📭 No se encontraron imágenes para ${callSign}`);
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "No se encontraron imágenes para este indicativo" })
      };
    }

    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id
    }));

    console.log(`✅ Se encontraron ${images.length} imágenes`);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(images)
    };

  } catch (error) {
    console.error("💥 Error al buscar imágenes:", error.message || error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Error interno al buscar imágenes" })
    };
  }
};
